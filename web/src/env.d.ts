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

/** True on preview and branch builds, which search engines should skip (set in astro.config.mjs). */
declare const __NOINDEX__: boolean

/** True when the site is built on Netlify (set in astro.config.mjs). */
declare const __ON_NETLIFY__: boolean
