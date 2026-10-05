const CACHE='bqj-app-v20-7';
const MIDVASH='bqj-midvash-v20-1';
const URDU='bqj-urdu-v20-1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.json','./logo.svg','./icon-192.png','./icon-512.png','./icon-128.png','./icon-96.png','./icon-64.png','./icon-48.png','./icon-32.png','./icon-16.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>![CACHE,MIDVASH,URDU].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;if(u.origin===location.origin)return e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));if(u.hostname==='api.midvash.com'||u.hostname==='hebron10.github.io')return e.respondWith((async()=>{const name=u.hostname==='api.midvash.com'?MIDVASH:URDU;const c=await caches.open(name);const hit=await c.match(e.request);try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(_){return hit||new Response('Offline',{status:503})}})())});
