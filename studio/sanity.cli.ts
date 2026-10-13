import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'krb5nty9',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // The hosted editor address becomes https://<studioHost>.sanity.studio
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || 'wire-2026',
  deployment: {autoUpdates: false},
})
