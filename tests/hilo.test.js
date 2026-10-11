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
    r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript':f.endsWith('.json')||f.endsWith('.webmanifest')?'application/json':'application/octet-stream'});fs.createReadStream(f).pipe(r)});
  await new Promise(res=>server.listen(0,res));url=`http://localhost:${server.address().port}/`;
  browser=await chromium.launch({channel:'chrome',headless:true});
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
