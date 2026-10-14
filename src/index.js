// isaaceast.com/groov/* -> static assets in ./groov (see wrangler.toml).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/groov') {
      return Response.redirect(`${url.origin}/groov/`, 301);
    }
    url.pathname = url.pathname.replace(/^\/groov/, '') || '/';
    const res = await env.ASSETS.fetch(new Request(url.toString(), request));
    // Redirects produced by the asset handler (clean-URL and trailing-slash
    // normalisation) are relative to the asset root; put the prefix back.
    const loc = res.headers.get('Location');
    if (loc && loc.startsWith('/') && !loc.startsWith('/groov')) {
      const h = new Headers(res.headers);
      h.set('Location', `/groov${loc}`);
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  },
};
