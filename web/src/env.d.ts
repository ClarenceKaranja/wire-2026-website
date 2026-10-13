/// <reference types="astro/client" />

declare module '*.ndjson?raw' {
  const content: string
  export default content
}

declare namespace App {
  interface Locals {
    preview: boolean
  }
}

/** True on Netlify deploy previews and branch deploys (set in astro.config.mjs). */
declare const __NOINDEX__: boolean
