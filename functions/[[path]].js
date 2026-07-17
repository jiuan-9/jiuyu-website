const STATIC_EXTENSIONS = [
  '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.webp', '.woff', '.woff2', '.ttf', '.eot', '.json', '.map',
  '.txt', '.xml', '.webmanifest', '.pdf', '.zip'
]

function isStaticAsset(pathname) {
  const lower = pathname.toLowerCase()
  return STATIC_EXTENSIONS.some(ext => lower.endsWith(ext))
}

export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  if (isStaticAsset(pathname)) {
    return env.ASSETS.fetch(request)
  }

  if (pathname === '/' || pathname === '') {
    return env.ASSETS.fetch(request)
  }

  const staticResponse = await env.ASSETS.fetch(request)
  if (staticResponse.status !== 404) {
    return staticResponse
  }

  const indexRequest = new Request('/index.html', request)
  const indexResponse = await env.ASSETS.fetch(indexRequest)
  return new Response(indexResponse.body, {
    status: 200,
    headers: indexResponse.headers
  })
}
