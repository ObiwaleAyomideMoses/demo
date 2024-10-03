import fs from 'node:fs/promises'
import express from 'express'
import fetch from 'node-fetch'
// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const base = process.env.BASE || '/:client_name/:exchange/:client_id'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')
    console.log('======= url here =======')
    console.log(req.originalUrl)

    // Extract the client ID from the URL
    const clientIdMatch = req.originalUrl.match(/(\d+)(?!.*\d)/)
    const clientId = clientIdMatch ? clientIdMatch[0] : null
    console.log('Extracted client ID:', clientId)

    let clientInfo = {}

    const response = await fetch(
      `https://d7jxq5gn-3001.euw.devtunnels.ms/wallets/clientInfo`
    )
    clientInfo = await response.json()

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)
    console.log('======== clientInfo here =======')
    console.log(clientInfo)
    const html = template
      .replace(
        `<!--app-head-->`,
        `
        ${rendered.head ?? ''}
        <meta property="og:title" content="${
          clientInfo.name ?? 'Default Title'
        }" />
        <meta property="og:description" content="${
          clientInfo.description ?? 'Default Description'
        }" />
        <meta property="og:image" content="${
          clientInfo.image ?? 'default-image-url'
        }" />
        <meta property="og:url" content="${req.originalUrl}" />
      `
      )
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
