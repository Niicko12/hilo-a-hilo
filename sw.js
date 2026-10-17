// Hilo a Hilo sin internet.
// La página se pide primero a internet (así llegan los cambios); si no hay conexión se usa la guardada.
// jsPDF, las letras y los iconos se guardan la primera vez y después salen de la memoria del aparato.
const V='hilo-v3';
const CORE=['./','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
const JSPDF='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const FONTS=[
"https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap",
"https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&family=Lobster&family=Kaushan+Script&family=Courgette&family=Cookie&family=Satisfy&family=Great+Vibes&family=Parisienne&family=Allura&family=Sacramento&family=Yellowtail&family=Playfair+Display:wght@700&family=Cinzel:wght@700&family=Abril+Fatface&family=Cormorant+Garamond:wght@700&family=Lora:wght@700&family=Fredoka:wght@600&family=Chewy&family=Bangers&family=Luckiest+Guy&family=Baloo+2:wght@800&family=Bubblegum+Sans&family=Comic+Neue:wght@700&family=Montserrat:wght@800&family=Oswald:wght@600&family=Bebas+Neue&family=Roboto+Slab:wght@700&family=Archivo+Black&family=Alfa+Slab+One&family=UnifrakturMaguntia&family=Pirata+One&family=MedievalSharp&display=swap"
];

self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{
  const c=await caches.open(V);await c.addAll(CORE);
  try{await c.put(JSPDF,await fetch(JSPDF,{mode:'no-cors'}))}catch(err){}
  // hojas de estilo de las letras; de las letras de la app (la primera hoja) se guardan también los archivos latinos
  await Promise.all(FONTS.map(async(u,n)=>{try{const r=await fetch(u,{mode:'cors'});if(!r.ok)return;await c.put(u,r.clone());
    if(n)return;const css=await r.text(),files=[...css.matchAll(/\/\* latin \*\/[^}]*?url\((https:[^)]+)\)/g)].map(m=>m[1]);
    await Promise.all(files.map(f=>fetch(f,{mode:'cors'}).then(x=>x.ok&&c.put(f,x)).catch(()=>{})))}catch(err){}}));
})())});

self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('hilo-')&&k!==V)await caches.delete(k);
  await self.clients.claim()})())});

async function networkFirst(req){const c=await caches.open(V);
  try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),5000);const r=await fetch(req,{signal:ctl.signal});clearTimeout(t);
    if(r.ok)c.put('./',r.clone());return r}
  catch(err){return (await c.match(req,{ignoreSearch:true}))||(await c.match('./'))||Response.error()}}
async function cacheFirst(req){const c=await caches.open(V),hit=await c.match(req);if(hit)return hit;
  const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone()).catch(()=>{});return r}

self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(req.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){e.respondWith(networkFirst(req));return}
  if(u.origin===location.origin||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='cdnjs.cloudflare.com')e.respondWith(cacheFirst(req))});
