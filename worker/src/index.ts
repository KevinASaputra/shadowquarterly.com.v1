import { isOriginAllowed } from './utils/is-origin-allowed';

export default {
	async fetch(req, env, ctx): Promise<Response> {
		switch (req.method) {
			case 'GET':
				try {
					const url = new URL(req.url);
					const key = url.pathname.slice(1);
					const headers = new Headers();
					const origin = req.headers.get('origin') ?? '';

					if (origin && isOriginAllowed(origin)) {
						headers.set('Access-Control-Allow-Origin', origin);
						headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
						headers.set('Access-Control-Allow-Headers', 'Content-Type');
					}

					const cacheKey = new Request(url.toString(), req);
					const cache = caches.default;

					let response = await cache.match(cacheKey);
					if (response) {
						console.log('cache hit ${key} from ${url.toString()}');
						return response;
					}

					console.log('Response for request URL: ${ url.toString() } not present in cache.Fetching and caching request');

					const object = await env.shadowquarterly_workers.get(key);
					if (!object) {
						return new Response('Object not found', {
							status: 404,
						});
					}

					object.writeHttpMetadata(headers);
					headers.set('etag', object.httpEtag);
					headers.set('Cache-Control', 'public, max-age=31536000, immutable');

					response = new Response(object.body, {
						headers,
					});

					ctx.waitUntil(cache.put(cacheKey, response.clone()));

					return response;
				} catch (err) {
					console.log('workers error:', err);
					if (err instanceof Error) {
						return new Response(`Error: ${(err as Error).message}`, {
							status: 500,
						});
					}
				}
			default:
				return new Response('Method not allowed', {
					status: 405,
				});
		}
	},
} satisfies ExportedHandler<Env>;
