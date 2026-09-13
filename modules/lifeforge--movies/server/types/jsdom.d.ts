declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string, options?: Record<string, unknown>)
    window: Window
    document: Document
  }
}
