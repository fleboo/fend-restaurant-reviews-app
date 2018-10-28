// Thanks to Travesy Media service worker tutorials

const staticCacheName = 'restaurant-app-v1';

// Install event
self.addEventListener('install', event => {
	console.log("Service Worker: Installed");
});

// Activate event
self.addEventListener('activate', event => {
	console.log("Service Worker: Activated");

	// Delete old caches and keep the current one
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if(cache !== staticCacheName) {
						console.log("Service Worker: Clearing old cache");
						return caches.delete(cache);
					}
				})
			)
		})
	);
});

// Fetch event for when offline
self.addEventListener('fetch', event => {
	console.log("Service Worker: Fetching");

	event.respondWith(
		fetch(event.request).then(response => {
			//Store response from server in cache storage
			const storedResponse = response.clone();

			//Access the cache
			caches.open(staticCacheName).then(cache => {
				//Add response to cache
				cache.put(event.request, storedResponse);
			});
		return response;
		}).catch(error => caches.match(event.request)
		.then(response => response))
	);

});