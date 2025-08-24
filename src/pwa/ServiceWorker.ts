// Service Worker para funcionalidade offline
const CACHE_NAME = 'equilibrium-v1.0.0';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // CSS e JS serão adicionados dinamicamente pelo build
];

const API_CACHE_NAME = 'equilibrium-api-v1';
const GAME_DATA_CACHE = 'equilibrium-gamedata-v1';

// Estratégias de cache
enum CacheStrategy {
  CACHE_FIRST = 'cache-first',
  NETWORK_FIRST = 'network-first',
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only'
}

// Configuração de rotas e estratégias
const ROUTE_STRATEGIES: { [pattern: string]: CacheStrategy } = {
  // Assets estáticos - Cache First
  '\\.(?:js|css|png|jpg|jpeg|svg|woff2?)$': CacheStrategy.CACHE_FIRST,
  
  // Páginas principais - Stale While Revalidate
  '^/$': CacheStrategy.STALE_WHILE_REVALIDATE,
  '^/game': CacheStrategy.STALE_WHILE_REVALIDATE,
  '^/tutorial': CacheStrategy.STALE_WHILE_REVALIDATE,
  
  // API calls - Network First
  '^/api/': CacheStrategy.NETWORK_FIRST,
  
  // Game data - Cache First (dados do jogo são estáticos)
  '^/data/': CacheStrategy.CACHE_FIRST
};

declare const self: ServiceWorkerGlobalScope;

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Cache assets críticos
      try {
        await cache.addAll(STATIC_ASSETS);
        console.log('[SW] Static assets cached');
      } catch (error) {
        console.error('[SW] Failed to cache static assets:', error);
      }
      
      // Force activation
      await self.skipWaiting();
    })()
  );
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.startsWith('equilibrium-') && name !== CACHE_NAME
      );
      
      await Promise.all(
        oldCaches.map(cacheName => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

// Fetch event - Main request handling
self.addEventListener('fetch', (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  const url = new URL(event.request.url);
  const strategy = getStrategyForUrl(url.pathname);
  
  event.respondWith(handleRequest(event.request, strategy));
});

// Determine cache strategy for URL
function getStrategyForUrl(pathname: string): CacheStrategy {
  for (const [pattern, strategy] of Object.entries(ROUTE_STRATEGIES)) {
    if (new RegExp(pattern).test(pathname)) {
      return strategy;
    }
  }
  return CacheStrategy.NETWORK_FIRST; // Default strategy
}

// Handle request based on strategy
async function handleRequest(request: Request, strategy: CacheStrategy): Promise<Response> {
  const url = new URL(request.url);
  
  try {
    switch (strategy) {
      case CacheStrategy.CACHE_FIRST:
        return await cacheFirst(request);
      
      case CacheStrategy.NETWORK_FIRST:
        return await networkFirst(request);
      
      case CacheStrategy.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request);
      
      case CacheStrategy.NETWORK_ONLY:
        return await fetch(request);
      
      case CacheStrategy.CACHE_ONLY:
        return await cacheOnly(request);
      
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error(`[SW] Request failed for ${url.pathname}:`, error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      const offlineResponse = await cache.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return a basic offline response
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Cache First strategy
async function cacheFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First strategy
async function networkFirst(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(
        request.url.includes('/api/') ? API_CACHE_NAME : CACHE_NAME
      );
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(
      request.url.includes('/api/') ? API_CACHE_NAME : CACHE_NAME
    );
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Update cache in background
  const networkUpdate = updateCacheInBackground(request);
  
  // Return cached response if available, otherwise wait for network
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return await networkUpdate;
}

// Cache Only strategy
async function cacheOnly(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (!cachedResponse) {
    throw new Error('No cached response available');
  }
  
  return cachedResponse;
}

// Update cache in background
async function updateCacheInBackground(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Background update failed:', error);
    throw error;
  }
}

// Background Sync for analytics data
self.addEventListener('sync', (event: any) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalyticsData());
  }
  
  if (event.tag === 'feedback-sync') {
    event.waitUntil(syncFeedbackData());
  }
});

// Sync analytics data when online
async function syncAnalyticsData(): Promise<void> {
  try {
    // Get stored analytics data
    const analyticsData = localStorage.getItem('equilibrium-analytics-events');
    
    if (analyticsData) {
      const events = JSON.parse(analyticsData);
      
      // Send to analytics endpoint
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events })
      });
      
      console.log('[SW] Analytics data synced');
    }
  } catch (error) {
    console.error('[SW] Failed to sync analytics:', error);
  }
}

// Sync feedback data when online
async function syncFeedbackData(): Promise<void> {
  try {
    const feedbackData = localStorage.getItem('equilibrium-feedback-pending');
    
    if (feedbackData) {
      const feedback = JSON.parse(feedbackData);
      
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });
      
      // Clear pending data after successful sync
      localStorage.removeItem('equilibrium-feedback-pending');
      console.log('[SW] Feedback data synced');
    }
  } catch (error) {
    console.error('[SW] Failed to sync feedback:', error);
  }
}

// Push notifications (for future beta updates)
self.addEventListener('push', (event: any) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options: NotificationOptions = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Abrir Jogo'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Handle periodic background sync (for engagement metrics)
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'engagement-metrics') {
    event.waitUntil(collectEngagementMetrics());
  }
});

// Collect engagement metrics
async function collectEngagementMetrics(): Promise<void> {
  try {
    // Collect usage data
    const metrics = {
      timestamp: Date.now(),
      cacheHits: 0, // Would track cache performance
      offlineUsage: 0, // Track offline usage
      errors: 0 // Track service worker errors
    };
    
    // Store metrics locally
    const stored = localStorage.getItem('equilibrium-sw-metrics') || '[]';
    const allMetrics = JSON.parse(stored);
    allMetrics.push(metrics);
    
    // Keep only last 30 days of metrics
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentMetrics = allMetrics.filter((m: any) => m.timestamp > thirtyDaysAgo);
    
    localStorage.setItem('equilibrium-sw-metrics', JSON.stringify(recentMetrics));
  } catch (error) {
    console.error('[SW] Failed to collect metrics:', error);
  }
}

// Message handling
self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status);
    });
  }
});

// Get cache status for debugging
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
}

export {};