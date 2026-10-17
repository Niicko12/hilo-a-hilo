// Pruebas en navegador de Hilo a Hilo: levantan la página con un servidor local y la manejan con Chrome.
// Correr: cd tests && npm install && npm test
const {test,before,after}=require('node:test');
const assert=require('node:assert');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright-core');

const ROOT=path.join(__dirname,'..');let server,url,browser;
before(async()=>{
  server=http.createServer((q,r)=>{const f=path.join(ROOT,q.url==='/'?'index.html':decodeURIComponent(q.url.split('?')[0]));
    if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}
    r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript':f.endsWith('.json')||f.endsWith('.webmanifest')?'application/json':f.endsWith('.png')?'image/png':'application/octet-stream'});fs.createReadStream(f).pipe(r)});
  await new Promise(res=>server.listen(0,res));url=`http://localhost:${server.address().port}/`;
  // en la Mac usa el Chrome instalado; en la nube (Claude Code web/móvil) usa Chromium: npx playwright-core install chromium
  try{browser=await chromium.launch({channel:'chrome',headless:true})}
  catch(e){browser=await chromium.launch({headless:true})}
});
after(async()=>{await browser.close();server.close()});

async function open(opts={}){const ctx=await browser.newContext({viewport:{width:800,height:1100},...opts});const pg=await ctx.newPage();
  const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.goto(url);await pg.waitForFunction(()=>typeof S!=='undefined'&&S.grid);return {ctx,pg,errs}}
async function uploadSample(pg){const png=await pg.evaluate(()=>sampleImage().toDataURL('image/png'));
  await pg.setInputFiles('#file',{name:'Flores.png',mimeType:'image/png',buffer:Buffer.from(png.split(',')[1],'base64')});
  await pg.waitForFunction(()=>S.proj&&S.grid);await pg.waitForTimeout(300)}
async function tapStitches(pg,n){await pg.click('#t-patron');await pg.check('#marking');
  const idx=await pg.evaluate(n=>{const o=[];for(let i=0;i<S.grid.length&&o.length<n;i+=37)if(S.grid[i]>=0)o.push(i);return o},n);
  for(const i of idx){const p=await pg.evaluate(i=>{const c=i%S.cols,r=(i/S.cols)|0,w=document.getElementById('chartwrap');
      w.scrollLeft=Math.max(0,S.m+c*S.cell-100);w.scrollTop=Math.max(0,S.m+r*S.cell-100);
      const b=document.getElementById('chart').getBoundingClientRect();return [b.left+S.m+c*S.cell+S.cell/2,b.top+S.m+r*S.cell+S.cell/2]},i);
    await pg.mouse.click(p[0],p[1])}
  await pg.waitForTimeout(800)}
const state=pg=>pg.evaluate(()=>({done:S.done.size,key:S.key,bar:!document.getElementById('keepBar').hidden}));
const reload=async pg=>{await pg.reload();await pg.waitForFunction(()=>S.proj&&S.grid);await pg.waitForTimeout(600)};

test('arranca con el ejemplo y sin errores',async()=>{const {ctx,pg,errs}=await open();
  assert.ok(await pg.evaluate(()=>S.pal.length>2));assert.deepStrictEqual(errs,[]);await ctx.close()});

test('el avance no se pierde al cambiar el tamaño y vuelve con el botón',async()=>{const {ctx,pg,errs}=await open();
  await uploadSample(pg);await tapStitches(pg,5);
  const a=await state(pg);assert.strictEqual(a.done,5);
  await pg.click('#t-ajustes');await pg.click('#sizeChoices .choice:nth-child(4)');await pg.waitForTimeout(300);
  const b=await state(pg);assert.strictEqual(b.done,0);assert.ok(b.bar,'debe salir el aviso');
  await pg.click('#keepBtn');await pg.waitForTimeout(300);
  const c=await state(pg);assert.strictEqual(c.done,5);assert.strictEqual(c.key,a.key);assert.ok(!c.bar);
  assert.deepStrictEqual(errs,[]);await ctx.close()});

test('el avance sobrevive a recargar aunque se borre localStorage',async()=>{const {ctx,pg}=await open();
  await uploadSample(pg);await tapStitches(pg,4);
  await pg.evaluate(()=>Object.keys(localStorage).filter(k=>/^hilo-[a-z0-9]+$/.test(k)&&!['hilo-big','hilo-tema'].includes(k)).forEach(k=>localStorage.removeItem(k)));
  await reload(pg);assert.strictEqual((await state(pg)).done,4);
  // cambiar algo, recargar: el aviso sigue y el botón recupera el avance
  await pg.click('#t-ajustes');await pg.click('#sizeChoices .choice:nth-child(1)');await pg.waitForTimeout(900);
  await reload(pg);assert.ok((await state(pg)).bar);
  await pg.click('#keepBtn');await pg.waitForTimeout(300);assert.strictEqual((await state(pg)).done,4);await ctx.close()});

test('los bordados guardados a la manera anterior se convierten',async()=>{const {ctx,pg}=await open();
  const r=await pg.evaluate(()=>{const o={done:[1,2,3],doneKey:'hilo-x',updated:5};progOf(o);return o});
  assert.deepStrictEqual(r,{updated:5,prog:{'hilo-x':{done:[1,2,3],at:5}}});await ctx.close()});

test('modo día y noche: sigue al aparato y recuerda lo escogido',async()=>{
  for(const cs of ['light','dark']){const {ctx,pg}=await open({colorScheme:cs});
    assert.strictEqual(await pg.evaluate(()=>isDark()),cs==='dark');
    await pg.click('#themeBtn');assert.strictEqual(await pg.evaluate(()=>isDark()),cs!=='dark');
    await pg.reload();await pg.waitForFunction(()=>S.grid);assert.strictEqual(await pg.evaluate(()=>isDark()),cs!=='dark');
    await ctx.close()}});

test('el PDF se arma en tamaño carta',async()=>{const {ctx,pg}=await open();
  const n=await pg.evaluate(()=>{const d=makePdf();return d?d.getNumberOfPages():0});assert.ok(n>=1);await ctx.close()});

test('marcar arrastrando marca solo ese color y Deshacer quita la pasada completa',async()=>{const {ctx,pg,errs}=await open();
  await uploadSample(pg);await pg.click('#t-patron');await pg.check('#marking');
  // la fila con la racha más larga de un mismo color
  const run=await pg.evaluate(()=>{let best=null;for(let r=0;r<S.rows;r++){let c=0;while(c<S.cols){const v=S.grid[r*S.cols+c];let e=c;while(e+1<S.cols&&S.grid[r*S.cols+e+1]===v)e++;
      if(v>=0&&(!best||e-c>best.e-best.c))best={r,c,e,v};c=e+1}}
    const w=document.getElementById('chartwrap');w.scrollLeft=Math.max(0,S.m+best.c*S.cell-20);w.scrollTop=Math.max(0,S.m+best.r*S.cell-100);
    const b=document.getElementById('chart').getBoundingClientRect(),y=b.top+S.m+(best.r+.5)*S.cell;
    return {...best,x0:b.left+S.m+(best.c+.5)*S.cell,x1:b.left+S.m+(Math.min(best.e+2,S.cols-1)+.5)*S.cell,y}});
  await pg.mouse.move(run.x0,run.y);await pg.mouse.down();await pg.mouse.move(run.x1,run.y,{steps:6});await pg.mouse.up();await pg.waitForTimeout(800);
  const got=await pg.evaluate(()=>[...S.done]);assert.strictEqual(got.length,run.e-run.c+1,'marca toda la racha y nada de otro color');
  assert.ok(await pg.evaluate(v=>[...S.done].every(i=>S.grid[i]===v),run.v));
  await pg.click('#undoBtn');assert.strictEqual(await pg.evaluate(()=>S.done.size),0);
  assert.deepStrictEqual(errs,[]);await ctx.close()});

test('Buscar lo que falta lleva al cuadrito sin marcar y la lista de hilos cuenta lo que falta',async()=>{const {ctx,pg}=await open();
  await uploadSample(pg);await pg.click('#t-patron');
  await pg.evaluate(()=>{S.hi=0;renderChips();const all=[];S.grid.forEach((v,i)=>{if(v===0)all.push(i)});S.missing=all[Math.floor(all.length/2)];
    all.forEach(i=>{if(i!==S.missing)S.done.add(i)});saveMarks();drawScreen()});
  assert.ok(await pg.isVisible('#findBtn'));await pg.click('#findBtn');
  assert.strictEqual(await pg.evaluate(()=>S.findAt),await pg.evaluate(()=>S.missing));
  await pg.click('#t-hilos');assert.match(await pg.textContent('#tbody tr:first-child .tstat'),/faltan 1/);
  await pg.click('#t-patron');await pg.evaluate(()=>{S.done.add(S.missing);saveMarks();drawScreen()});
  assert.ok(!(await pg.isVisible('#findBtn')),'color terminado: ya no hay nada que buscar');
  await pg.click('#t-hilos');assert.match(await pg.textContent('#tbody tr:first-child .tstat'),/terminado/);await ctx.close()});

test('sin internet: la app abre, arma el patrón y el PDF',async()=>{const {ctx,pg}=await open();
  await pg.evaluate(async()=>{await navigator.serviceWorker.ready});
  await pg.reload();await pg.waitForFunction(()=>navigator.serviceWorker.controller&&S.grid);await pg.waitForTimeout(500);
  await ctx.setOffline(true);await pg.reload();await pg.waitForFunction(()=>typeof S!=='undefined'&&S.grid,null,{timeout:15000});
  assert.ok(await pg.evaluate(()=>!!window.jspdf),'jsPDF disponible sin internet');
  assert.ok(await pg.evaluate(()=>{const d=makePdf();return d&&d.getNumberOfPages()>=1}));
  await ctx.close()});

test('es instalable: manifest con iconos',async()=>{const {ctx,pg}=await open();
  const m=await pg.evaluate(async()=>(await fetch(document.querySelector('link[rel=manifest]').href)).json());
  assert.strictEqual(m.display,'standalone');assert.ok(m.icons.some(i=>i.sizes==='512x512'&&i.purpose==='maskable'));
  for(const i of m.icons){const r=await pg.evaluate(async u=>(await fetch(u)).status,i.src);assert.strictEqual(r,200)}await ctx.close()});

test('línea del centro: se dibuja en pantalla y en las hojas, y se recuerda',async()=>{const {ctx,pg,errs}=await open();
  await pg.click('#t-patron');
  // pixel justo en el centro del patrón, entre dos cuadritos
  const px=()=>pg.evaluate(()=>{const cv=document.getElementById('chart'),d=S.dpr||1,X=S.m+S.cols/2*S.cell,Y=S.m+(S.rows/2+.5)*S.cell;
    return [...cv.getContext('2d').getImageData(Math.round(X*d),Math.round(Y*d),1,1).data].slice(0,3).join()});
  const before=await px();await pg.check('#centerLine');const after=await px();
  assert.notStrictEqual(before,after,'aparece la línea');
  await pg.reload();await pg.waitForFunction(()=>S.grid);assert.ok(await pg.isChecked('#centerLine'),'se recuerda');
  await pg.click('#t-hojas');await pg.check('#pagesCenter');
  assert.ok(await pg.evaluate(()=>{const d=makePdf();return d&&d.getNumberOfPages()>=1}));
  assert.deepStrictEqual(errs,[]);await ctx.close()});

// Como en la tablet Android de mamá: pantalla táctil, Chrome de Android, sin wifi y con descargas.
const TABLET={viewport:{width:800,height:1280},deviceScaleFactor:2,isMobile:true,hasTouch:true,acceptDownloads:true,
  userAgent:'Mozilla/5.0 (Linux; Android 14; SM-X210) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'};
// toca con el dedo: quieto "ms" milisegundos y luego se arrastra hasta (x1,y1)
async function finger(pg,x0,y0,x1,y1,ms){const cdp=await pg.context().newCDPSession(pg);
  const t=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  await t('touchStart',x0,y0);await pg.waitForTimeout(ms);
  for(let k=1;k<=8;k++){await t('touchMove',x0+(x1-x0)*k/8,y0+(y1-y0)*k/8);await pg.waitForTimeout(20)}
  await t('touchEnd');await pg.waitForTimeout(500)}

test('tablet Android: marcar con el dedo, sin wifi, PDF, copia de seguridad y WhatsApp',async()=>{
  const {ctx,pg,errs}=await open(TABLET);
  await uploadSample(pg);await pg.click('#t-patron');await pg.check('#marking');
  const run=await pg.evaluate(()=>{let best=null;for(let r=0;r<S.rows;r++){let c=0;while(c<S.cols){const v=S.grid[r*S.cols+c];let e=c;while(e+1<S.cols&&S.grid[r*S.cols+e+1]===v)e++;
      if(v>=0&&(!best||e-c>best.e-best.c))best={r,c,e,v};c=e+1}}
    const w=document.getElementById('chartwrap');w.scrollLeft=Math.max(0,S.m+best.c*S.cell-20);w.scrollTop=Math.max(0,S.m+best.r*S.cell-100);
    const b=document.getElementById('chart').getBoundingClientRect(),y=b.top+S.m+(best.r+.5)*S.cell;
    return {...best,x0:b.left+S.m+(best.c+.5)*S.cell,x1:b.left+S.m+(best.e+.5)*S.cell,y}});
  // deslizar rápido mueve el patrón y no marca nada
  await finger(pg,run.x0,run.y,run.x1,run.y,0);assert.strictEqual(await pg.evaluate(()=>S.done.size),0,'deslizar no marca');
  // dedo quieto y arrastrar marca la racha completa de ese color
  await pg.evaluate(r=>{const w=document.getElementById('chartwrap');w.scrollLeft=Math.max(0,S.m+r.c*S.cell-20);w.scrollTop=Math.max(0,S.m+r.r*S.cell-100)},run);
  await finger(pg,run.x0,run.y,run.x1,run.y,450);
  assert.strictEqual(await pg.evaluate(()=>S.done.size),run.e-run.c+1,'dedo quieto + arrastrar marca la racha');
  // toque corto marca un cuadrito más
  await pg.click('#undoBtn');await pg.touchscreen.tap(run.x0,run.y);await pg.waitForTimeout(300);
  assert.strictEqual(await pg.evaluate(()=>S.done.size),1,'un toque marca uno');

  // PDF y copia de seguridad se descargan como archivo
  await pg.click('#t-hojas');
  const [pdf]=await Promise.all([pg.waitForEvent('download'),pg.click('#pdfBtn')]);assert.match(pdf.suggestedFilename(),/\.pdf$/);
  await pg.click('#t-diseno');
  const [bak]=await Promise.all([pg.waitForEvent('download'),pg.click('#backupBtn')]);assert.match(bak.suggestedFilename(),/\.json$/);
  const saved=JSON.parse(fs.readFileSync(await bak.path(),'utf8'));assert.ok(JSON.stringify(saved).length>100,'la copia trae los bordados');

  // WhatsApp: con menú de compartir, va el archivo; sin él (como en algunos APK), se guarda y se abre WhatsApp
  await pg.evaluate(()=>{window.__shared=null;navigator.canShare=()=>true;navigator.share=async d=>{window.__shared=d.files[0].name}});
  await pg.click('#t-ajustes');await pg.click('#shareImgBtn');await pg.waitForFunction(()=>window.__shared);
  assert.match(await pg.evaluate(()=>window.__shared),/\.png$/);
  await pg.evaluate(()=>{navigator.canShare=undefined;navigator.share=undefined});
  await pg.click('#t-hojas');
  const [file,wa]=await Promise.all([pg.waitForEvent('download'),ctx.waitForEvent('page'),pg.click('#sharePdfBtn')]);
  assert.match(file.suggestedFilename(),/\.pdf$/);await wa.waitForURL(/wa\.me|whatsapp/).catch(()=>{});assert.match(wa.url(),/wa\.me|whatsapp/);

  // sin wifi: vuelve a abrir con el bordado y el avance
  await pg.evaluate(async()=>{await navigator.serviceWorker.ready});
  await pg.reload();await pg.waitForFunction(()=>navigator.serviceWorker.controller&&S.grid);await pg.waitForTimeout(500);
  await ctx.setOffline(true);await pg.reload();await pg.waitForFunction(()=>typeof S!=='undefined'&&S.proj&&S.grid,null,{timeout:15000});await pg.waitForTimeout(600);
  assert.strictEqual(await pg.evaluate(()=>S.done.size),1,'el avance sigue sin wifi');
  assert.ok(await pg.evaluate(()=>{const d=makePdf();return d&&d.getNumberOfPages()>=1}),'PDF sin wifi');
  assert.deepStrictEqual(errs,[]);await ctx.close()});
