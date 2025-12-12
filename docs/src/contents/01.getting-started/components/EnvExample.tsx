import { LoadingScreen } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

function EnvExample() {
  const [envContent, setEnvContent] = useState('')

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/LifeForge-app/lifeforge/refs/heads/main/env/.env.example'
    )
      .then(response => response.text())
      .then(text => setEnvContent(text))
      .catch(error => console.error('Error fetching .env.example:', error))
  }, [])

  return !envContent ? (
    <div className="mt-4">
      <LoadingScreen />
    </div>
  ) : (
    <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4">
      <code className="text-sm whitespace-pre text-zinc-300">{envContent}</code>
    </pre>
  )
}

export default EnvExample
