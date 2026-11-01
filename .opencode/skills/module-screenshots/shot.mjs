// Attaches to an already-running Chrome with --remote-debugging-port and captures
// screenshots. Chrome must be launched separately (see SKILL.md) because Chrome
// refuses DevTools on the default profile directory.
//
// Usage:
//   SHOT_W=1710 SHOT_H=1112 KEEP=1 node shot.mjs '[
//     {"path":"/<module>?view=grid","file":"out-grid.png","waitBefore":6000,
//      "click":"...","waitAfter":3000}
//   ]'
//
// Entry fields: path (navigate; first entry only), file, waitBefore, click,
//               waitAfter, key ([{key, code, keyCode}]), scrollBottom, fullPage.
//
// Set KEEP=1 to leave Chrome running for further runs. Without KEEP the script
// closes the browser when finished.

import { once } from 'node:events'

const PORT = Number(process.env.CDP_PORT ?? 19222)
const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173'

const shots = JSON.parse(process.argv[2] ?? '[]')
const KEEP = !!process.env.KEEP

let ws
let msgId = 0
const pending = new Map()

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function waitForWs() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      const info = await res.json()
      return info.webSocketDebuggerUrl
    } catch {}
    await sleep(300)
  }
  throw new Error(
    `no Chrome DevTools on :${PORT}. Launch Chrome with ` +
      `--remote-debugging-port=${PORT} and a non-default --user-data-dir first.`
  )
}

const main = async () => {
  ws = new WebSocket(await waitForWs())
  await once(ws, 'open')

  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error
        ? reject(new Error(JSON.stringify(msg.error)))
        : resolve(msg.result)
    }
  })

  const send = (method, params = {}) => {
    const id = ++msgId
    ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) =>
      pending.set(id, { resolve, reject })
    )
  }

  const targets = (await send('Target.getTargets')).targetInfos
  let targetId = targets.find(
    t => t.type === 'page' && t.url.includes('localhost:5173')
  )?.targetId

  if (!targetId) {
    await send('Target.createTarget', { url: 'about:blank' })
    targetId = (await send('Target.getTargets')).targetInfos.find(
      t => t.url === 'about:blank'
    ).targetId
  }

  const { sessionId } = await send('Target.attachToTarget', {
    targetId,
    flatten: true
  })

  const nav = (method, params) =>
    new Promise((resolve, reject) => {
      const id = ++msgId
      ws.send(JSON.stringify({ id, sessionId, method, params }))
      pending.set(id, { resolve, reject })
    })

  await nav('Page.enable')
  await nav('Network.enable')
  await nav('Emulation.setDeviceMetricsOverride', {
    width: Number(process.env.SHOT_W ?? 1710),
    height: Number(process.env.SHOT_H ?? 1112),
    deviceScaleFactor: Number(process.env.SHOT_DSF ?? 2),
    mobile: false
  })

  const { writeFileSync } = await import('node:fs')

  const capture = async shot => {
    if (shot.scrollBottom) {
      await nav('Runtime.evaluate', {
        expression: 'window.scrollTo(0, document.body.scrollHeight)'
      })
      await sleep(3000)
    }

    const { data } = await nav('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: !!shot.fullPage
    })

    writeFileSync(shot.file, Buffer.from(data, 'base64'))
    console.log('saved', shot.file)
  }

  const first = shots[0]

  if (first?.path) {
    await nav('Page.navigate', {
      url: URL_BASE + first.path,
      transitionType: 'link'
    })
    await sleep(first.waitBefore ?? 6000)
    await capture(first)
  }

  for (const shot of first?.path ? shots.slice(1) : shots) {
    if (shot.click) {
      await nav('Runtime.enable')
      await nav('Runtime.evaluate', {
        expression: shot.click,
        awaitPromise: false,
        returnByValue: true
      })
      await sleep(shot.waitAfter ?? 4000)
    }

    if (shot.key) {
      for (const k of shot.key) {
        await nav('Input.dispatchKeyEvent', {
          type: 'keyDown',
          key: k.key,
          code: k.code,
          windowsVirtualKeyCode: k.keyCode,
          nativeVirtualKeyCode: k.keyCode
        })
        await nav('Input.dispatchKeyEvent', {
          type: 'keyUp',
          key: k.key,
          code: k.code,
          windowsVirtualKeyCode: k.keyCode,
          nativeVirtualKeyCode: k.keyCode
        })
        await sleep(1500)
      }
    }

    await capture(shot)
  }

  await sleep(300)

  if (!KEEP) {
    try {
      await send('Browser.close')
    } catch {}
  }

  ws.close()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
