const STATIC_CACHE    = 'static-v1.0.0';
const DYNAMIC_CACHE   = 'dynamic-v1.0.0';
const INMUTABLE_CACHE = 'inmutable-v1.0.0';


const APP_SHELL = [
    '/',
    'index.html',
    'https://d105cd6v88lith.cloudfront.net/favicon.ico',
    'https://d105cd6v88lith.cloudfront.net/**',
    'assets/js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Karla:400,700',
    'https://d105cd6v88lith.cloudfront.net/cache/grid.css'
];


self.addEventListener('install', e => {
    
    
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache =>
        cache.addAll( APP_SHELL ));
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache =>
        cache.addAll( APP_SHELL_INMUTABLE ));
    
    
    
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );
    
});

self.addEventListener('activate', e => {
    
    const resp = caches.keys().then( keys => {
        
        keys.forEach( key => {
            
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
            
            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
            
        });
        
    });
    
    e.waitUntil( resp );
    
});

self.addEventListener( 'fetch', e => {
    
    
    const resp = caches.match( e.request ).then( res => {
        
        if ( res ) {
            return res;
        } else {
            
            return fetch( e.request ).then( newRes => {
                
                return updateCacheDynamic( DYNAMIC_CACHE, e.request, newRes );
                
            });
            
        }
        
    });
    
    
    
    e.respondWith( resp );
    
});



function updateCacheDynamic( dynamicCache, req, res ) {
    
    
    if ( res.ok ) {
        
        return caches.open( dynamicCache ).then( cache => {
            
            cache.put( req, res.clone() );
            
            return res.clone();
            
        });
        
    } else {
        return res;
    }
}

