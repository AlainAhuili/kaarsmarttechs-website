(function(){
const $ = id => document.getElementById(id);
const rand = (a,b)=>a+Math.random()*(b-a);
/* toy bricks: stud pitch P (scene metres); bricks are 1.2 P tall, plates and tiles 0.4 P */
const P = 0.13, BH = P*1.2, PH = P*0.4;
const COLORS = {
  red:   {name:'Red',    hex:0xc91a09, css:'#c91a09'},
  blue:  {name:'Blue',   hex:0x0d5ec4, css:'#0d5ec4'},
  yellow:{name:'Yellow', hex:0xf2cd37, css:'#f2cd37'},
  green: {name:'Green',  hex:0x237841, css:'#237841'}
};
const SHAPES = {brick:'Brick', plate:'Plate', tile:'Tile', slope:'Slope'};
const SIZES = {'1x2':[1,2], '2x2':[2,2], '2x4':[2,4], '2x6':[2,6]};
const RULES = {
  color:{label:'color', keys:Object.keys(COLORS), name:k=>COLORS[k].name},
  shape:{label:'shape', keys:Object.keys(SHAPES), name:k=>SHAPES[k]},
  size: {label:'size',  keys:Object.keys(SIZES),  name:k=>k.replace('x','×')+' studs'}
};
let rule = 'color';
const PALLET_H = 0.15;
const BIN_POS = [-5.4,-1.8,1.8,5.4].map(x=>new THREE.Vector3(x,0,-6.4));
const DOCK = new THREE.Vector3(0,0,7);
const attrKey = a => rule==='color' ? a.color : rule==='shape' ? a.shape : a.size;
const binIndex = a => RULES[rule].keys.indexOf(attrKey(a));

/* ================= renderer ================= */
const canvas = $('c'), stage = $('stage');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;

const scene = new THREE.Scene();
const HAZE = 0x8a9094;
scene.background = new THREE.Color(HAZE).convertSRGBToLinear();
scene.fog = new THREE.Fog(scene.background.getHex(), 26, 62);

const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 120);
camera.position.set(9.5, 7.2, 12.5);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.4, -0.8);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI*0.47;
controls.minDistance = 2.5; controls.maxDistance = 30;

/* image-based lighting: a simple warehouse "room" with bright skylight panels */
(function buildEnv(){
  const env = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(40,14,40), new THREE.MeshBasicMaterial({color:0x4c5054, side:THREE.BackSide}));
  room.position.y = 7; env.add(room);
  const floorE = new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.MeshBasicMaterial({color:0x3a3d40}));
  floorE.rotation.x = -Math.PI/2; floorE.position.y = 0.01; env.add(floorE);
  const panelMat = new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(5.5,5.5,5.2)});
  for(let x=-12;x<=12;x+=8) for(let z=-12;z<=12;z+=8){
    const p = new THREE.Mesh(new THREE.PlaneGeometry(4.5,1.4), panelMat);
    p.rotation.x = Math.PI/2; p.position.set(x,13.9,z); env.add(p);
  }
  const win = new THREE.Mesh(new THREE.PlaneGeometry(30,3), new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(2.4,2.6,2.9)}));
  win.position.set(0,9,-19.9); env.add(win);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(env, 0.035).texture;
  pm.dispose();
})();

scene.add(new THREE.HemisphereLight(0xe9eef2, 0x4a4743, 0.18));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
sun.position.set(6, 15, 7);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0002; sun.shadow.normalBias = 0.02;
Object.assign(sun.shadow.camera, {left:-14,right:14,top:14,bottom:-14,near:2,far:40});
scene.add(sun);
const fill = new THREE.DirectionalLight(0xcfe0ff, 0.45); fill.position.set(-8,6,-4); scene.add(fill);

/* ================= procedural textures ================= */
function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function tex(c, srgb, rep){
  const t = new THREE.CanvasTexture(c);
  if(srgb) t.encoding = THREE.sRGBEncoding;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  if(rep){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0],rep[1]); }
  return t;
}
function speckle(g,w,h,n,cols,smin,smax){ for(let i=0;i<n;i++){ g.fillStyle=cols[(Math.random()*cols.length)|0]; const s=rand(smin,smax); g.fillRect(Math.random()*w,Math.random()*h,s,s);} }
function blotch(g,w,h,n,rgb,amin,amax,rmin,rmax){
  for(let i=0;i<n;i++){ const x=Math.random()*w,y=Math.random()*h,r=rand(rmin,rmax);
    const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,`rgba(${rgb},${rand(amin,amax)})`); gr.addColorStop(1,`rgba(${rgb},0)`);
    g.fillStyle=gr; g.fillRect(x-r,y-r,2*r,2*r);
    // wrap for tiling
    [[w,0],[-w,0],[0,h],[0,-h]].forEach(([dx,dy])=>{ g.save(); g.translate(dx,dy); g.fillRect(x-r,y-r,2*r,2*r); g.restore(); });
  }
}

/* polished concrete: color, roughness, bump. One tile = 6 m with saw-cut joints at the edges */
const CON = 1024;
const conC = makeCanvas(CON,CON), cg = conC.getContext('2d');
cg.fillStyle='#7c7973'; cg.fillRect(0,0,CON,CON);
blotch(cg,CON,CON,60,'70,66,60',.05,.16,60,260);
blotch(cg,CON,CON,40,'190,186,178',.04,.12,60,220);
speckle(cg,CON,CON,26000,['#7d7a74','#a19e97','#6f6c67','#b3b0a9','#86837d'],0.6,2.2);
cg.globalAlpha=.06; cg.strokeStyle='#2c2b28'; cg.lineWidth=9;           // tyre marks
for(let i=0;i<7;i++){cg.beginPath();const y=Math.random()*CON;cg.moveTo(-20,y);cg.bezierCurveTo(CON*.3,y+rand(-200,200),CON*.6,y+rand(-200,200),CON+20,y+rand(-120,120));cg.stroke();}
cg.globalAlpha=.35; cg.strokeStyle='#4b4945'; cg.lineWidth=1.2;          // hairline cracks
for(let i=0;i<5;i++){let x=Math.random()*CON,y=Math.random()*CON;cg.beginPath();cg.moveTo(x,y);for(let k=0;k<30;k++){x+=rand(-14,14);y+=rand(-4,14);cg.lineTo(x,y);}cg.stroke();}
cg.globalAlpha=1; cg.fillStyle='#4e4c48'; cg.fillRect(0,0,CON,3); cg.fillRect(0,0,3,CON); // saw cut joints
const rC = makeCanvas(512,512), rg = rC.getContext('2d');
rg.fillStyle='#8a8a8a'; rg.fillRect(0,0,512,512);
blotch(rg,512,512,50,'40,40,40',.15,.4,30,140);
blotch(rg,512,512,30,'220,220,220',.1,.35,30,120);
speckle(rg,512,512,9000,['#707070','#a0a0a0','#909090'],0.6,1.6);
const bC = makeCanvas(512,512), bg = bC.getContext('2d');
bg.fillStyle='#808080'; bg.fillRect(0,0,512,512);
speckle(bg,512,512,22000,['#6a6a6a','#959595','#7a7a7a','#8c8c8c'],0.5,1.5);
bg.fillStyle='#303030'; bg.fillRect(0,0,512,2); bg.fillRect(0,0,2,512);

const FLOOR = 36, REP = FLOOR/6;
const floorMat = new THREE.MeshStandardMaterial({
  map:tex(conC,true,[REP,REP]), roughnessMap:tex(rC,false,[REP,REP]), bumpMap:tex(bC,false,[REP,REP]),
  bumpScale:0.012, roughness:0.62, metalness:0.0, envMapIntensity:0.9
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR,FLOOR), floorMat);
floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);

/* worn floor paint */
function paintTex(color, w, h){
  const c = makeCanvas(w,h), g = c.getContext('2d');
  g.fillStyle=color; g.fillRect(0,0,w,h);
  g.globalCompositeOperation='destination-out';
  for(let i=0;i<w*h/30;i++){ g.fillStyle=`rgba(0,0,0,${rand(.2,1)})`; const s=rand(.6,3); g.fillRect(Math.random()*w,Math.random()*h,s,s); }
  for(let i=0;i<w/25;i++){ const x=Math.random()*w,y=Math.random()*h,r=rand(4,h*.9);
    const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(0,0,0,.6)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(x-r,y-r,2*r,2*r);}
  return c;
}
const paintMatCache = {};
function floorPaint(color, w, d, x, z, rotY){
  const key = color+w.toFixed(1)+d.toFixed(1);
  const m = paintMatCache[key] || (paintMatCache[key] = new THREE.MeshStandardMaterial({
    map:tex(paintTex(color, Math.max(32,Math.round(w*40)), Math.max(16,Math.round(d*40))), true),
    transparent:true, roughness:.55, polygonOffset:true, polygonOffsetFactor:-2, depthWrite:false}));
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w,d), m);
  p.rotation.x = -Math.PI/2; if(rotY) p.rotation.z = rotY;
  p.position.set(x, 0.002, z); p.receiveShadow = true; scene.add(p); return p;
}
floorPaint('#e5bd1c', 15, 0.12, 0, -4.2);                    // sorting-zone line
floorPaint('#e5bd1c', 15, 0.12, 0, -8.6);
floorPaint('#e5bd1c', 0.12, 4.4, -7.5, -6.4); floorPaint('#e5bd1c', 0.12, 4.4, 7.5, -6.4);
floorPaint('#e9ecea', 0.1, 20, -9.4, 1.2); floorPaint('#e9ecea', 0.1, 20, 9.4, 1.2); // walkway edges
(function stencil(){
  const c = makeCanvas(1024,128), g = c.getContext('2d');
  g.fillStyle='#e5bd1c'; g.font='700 92px "Chakra Petch", Impact, sans-serif'; g.textAlign='center'; g.fillText('SORTING ZONE',512,100);
  g.globalCompositeOperation='destination-out';
  for(let i=0;i<5000;i++){g.fillStyle=`rgba(0,0,0,${rand(.3,1)})`;g.fillRect(Math.random()*1024,Math.random()*128,rand(1,3),rand(1,3));}
  const p = new THREE.Mesh(new THREE.PlaneGeometry(4.4,0.55), new THREE.MeshStandardMaterial({map:tex(c,true),transparent:true,roughness:.55,polygonOffset:true,polygonOffsetFactor:-2,depthWrite:false}));
  p.rotation.x=-Math.PI/2; p.position.set(0,0.003,-3.7); p.receiveShadow=true; scene.add(p);
})();
/* charging dock: outline + rubber mat + charger post */
floorPaint('#2db3a6', 2.4, 0.1, DOCK.x, DOCK.z-1.4); floorPaint('#2db3a6', 2.4, 0.1, DOCK.x, DOCK.z+1.4);
floorPaint('#2db3a6', 0.1, 2.9, DOCK.x-1.2, DOCK.z); floorPaint('#2db3a6', 0.1, 2.9, DOCK.x+1.2, DOCK.z);

/* ================= reusable materials ================= */
const M = {
  whitePaint: new THREE.MeshPhysicalMaterial({color:0xeef0ef, roughness:.32, metalness:.05, clearcoat:.7, clearcoatRoughness:.18}),
  darkPlastic: new THREE.MeshStandardMaterial({color:0x2b2f33, roughness:.68}),
  rubber: new THREE.MeshStandardMaterial({color:0x161718, roughness:.92}),
  alu: new THREE.MeshStandardMaterial({color:0xc9cdd0, roughness:.32, metalness:1}),
  steel: new THREE.MeshStandardMaterial({color:0x8f9497, roughness:.42, metalness:1}),
  darkSteel: new THREE.MeshStandardMaterial({color:0x3d4246, roughness:.5, metalness:.8}),
  glass: new THREE.MeshPhysicalMaterial({color:0x0b0f12, roughness:.05, metalness:.2, clearcoat:1, clearcoatRoughness:.03}),
  red: new THREE.MeshStandardMaterial({color:0xc4161c, roughness:.35}),
  yellow: new THREE.MeshStandardMaterial({color:0xf2c218, roughness:.45})
};
function mesh(geo, mat, x,y,z, parent, noShadow){
  const m = new THREE.Mesh(geo, mat); m.position.set(x||0,y||0,z||0);
  if(!noShadow){ m.castShadow = true; m.receiveShadow = true; }
  if(parent) parent.add(m); return m;
}
function roundedBox(w,h,d,r,s){
  s = s||3; r = Math.min(r, w/2-1e-3, h/2-1e-3, d/2-1e-3);
  const shape = new THREE.Shape(), eps = 1e-5, rad = r-eps;
  shape.absarc(eps,eps,eps,-Math.PI/2,-Math.PI,true);
  shape.absarc(eps,h-rad*2,eps,Math.PI,Math.PI/2,true);
  shape.absarc(w-rad*2,h-rad*2,eps,Math.PI/2,0,true);
  shape.absarc(w-rad*2,eps,eps,0,-Math.PI/2,true);
  const g = new THREE.ExtrudeGeometry(shape,{depth:d-r*2,bevelEnabled:true,bevelSegments:s*2,steps:1,bevelSize:rad,bevelThickness:r,curveSegments:s});
  g.center(); g.computeVertexNormals(); return g;
}
/* soft contact-shadow decal */
const aoTex = (function(){const c=makeCanvas(128,128),g=c.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(.5,'rgba(0,0,0,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return tex(c,false);})();
const aoMat = new THREE.MeshBasicMaterial({map:aoTex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-3});
function aoDecal(w,d,parent,y){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),aoMat);p.rotation.x=-Math.PI/2;p.position.y=y||0.004;p.renderOrder=1;parent.add(p);return p;}

/* ================= warehouse shell ================= */
(function shell(){
  // corrugated cladding
  const c = makeCanvas(256,512), g = c.getContext('2d');
  for(let x=0;x<256;x++){ const v = 150 + 38*Math.sin(x/256*Math.PI*2*8); g.fillStyle=`rgb(${v},${v+4},${v+8})`; g.fillRect(x,0,1,512); }
  blotch(g,256,512,18,'90,95,98',.05,.15,20,90);
  const cladMat = new THREE.MeshStandardMaterial({map:tex(c,true,[12,1]), roughness:.55, metalness:.6});
  const plinth = makeCanvas(256,128), pg = plinth.getContext('2d');
  pg.fillStyle='#8a8781'; pg.fillRect(0,0,256,128); speckle(pg,256,128,4000,['#7a7771','#9a978f'],1,2);
  pg.fillStyle='#6e6b66'; for(let y=0;y<128;y+=32) pg.fillRect(0,y,256,2); for(let y=0;y<128;y+=32) for(let x=(y/32%2)*32;x<256;x+=64) pg.fillRect(x,y,2,32);
  const plinthMat = new THREE.MeshStandardMaterial({map:tex(plinth,true,[14,1]), roughness:.9});
  const H = 10, L = FLOOR;
  [[0,-L/2,0],[ -L/2,0,Math.PI/2],[L/2,0,-Math.PI/2]].forEach(([x,z,ry])=>{
    const wall = mesh(new THREE.PlaneGeometry(L,H-1.6), cladMat, x, 1.6+(H-1.6)/2, z, scene, true); wall.rotation.y = ry; wall.receiveShadow=true;
    const base = mesh(new THREE.PlaneGeometry(L,1.6), plinthMat, x, 0.8, z, scene, true); base.rotation.y = ry; base.receiveShadow=true;
  });
  // steel columns
  const colGeo = new THREE.BoxGeometry(0.35,H,0.35);
  const colMat = new THREE.MeshStandardMaterial({color:0x5b6670, roughness:.5, metalness:.7});
  [-12,12].forEach(x=>[-12.5, 3].forEach(z=>{
    mesh(colGeo, colMat, x, H/2, z, scene);
    const guard = mesh(new THREE.CylinderGeometry(0.45,0.45,1.1,24,1,true), M.yellow, x, 0.55, z, scene); guard.material = M.yellow;
  }));
})();

/* pallet racking along the back wall */
(function racks(){
  const upright = new THREE.MeshStandardMaterial({color:0x1f4f9a, roughness:.45, metalness:.4});
  const beam = new THREE.MeshStandardMaterial({color:0xe2611a, roughness:.4, metalness:.4});
  const wood = (function(){const c=makeCanvas(256,64),g=c.getContext('2d');g.fillStyle='#b9925f';g.fillRect(0,0,256,64);
    for(let i=0;i<220;i++){g.strokeStyle=`rgba(${rand(90,140)|0},${rand(60,90)|0},40,${rand(.1,.35)})`;g.lineWidth=rand(.5,2);g.beginPath();const y=Math.random()*64;g.moveTo(0,y);g.bezierCurveTo(80,y+rand(-4,4),170,y+rand(-4,4),256,y+rand(-3,3));g.stroke();}
    return new THREE.MeshStandardMaterial({map:tex(c,true),roughness:.85});})();
  const card = cardboardMats(1).side;
  const wrap = new THREE.MeshPhysicalMaterial({color:0xffffff, roughness:.15, transparent:true, opacity:.18, clearcoat:1, depthWrite:false});
  const upGeo = new THREE.BoxGeometry(0.09,6,0.09), beamGeo = new THREE.BoxGeometry(2.7,0.13,0.06);
  const palGeo = new THREE.BoxGeometry(1.2,0.14,1.0), loadGeo = new THREE.BoxGeometry(1.15,1,0.95);
  const levels = [0, 1.75, 3.5];
  const zF = -11.0, zB = -12.1;
  for(let b=0;b<8;b++){
    const x0 = -10.8 + b*2.7;
    [zF,zB].forEach(z=>mesh(upGeo, upright, x0, 3, z, scene));
    if(b===7) [zF,zB].forEach(z=>mesh(upGeo, upright, x0+2.7, 3, z, scene));
    levels.forEach((ly,li)=>{
      if(li>0) [zF,zB].forEach(z=>mesh(beamGeo, beam, x0+1.35, ly-0.07, z, scene));
      for(let p=0;p<2;p++){
        if(Math.random()<0.18) continue;
        const px = x0 + 0.72 + p*1.3, pz = (zF+zB)/2;
        mesh(palGeo, wood, px, ly+0.07+(li>0?0:0), pz, scene);
        const hgt = rand(0.6,1.25);
        const ld = mesh(loadGeo, card, px, ly+0.14+hgt/2, pz, scene); ld.scale.y = hgt;
        const wr = mesh(loadGeo, wrap, px, ly+0.14+hgt/2, pz, scene, true); wr.scale.set(1.02, hgt*1.01, 1.02);
      }
    });
  }
})();

/* ================= item materials ================= */
function cardboardMats(seed){
  const side = makeCanvas(256,256), g = side.getContext('2d');
  const base = ['#b88a57','#c29563','#ad8150'][seed%3];
  g.fillStyle=base; g.fillRect(0,0,256,256);
  for(let i=0;i<500;i++){g.strokeStyle=`rgba(90,60,30,${rand(.03,.12)})`;g.lineWidth=rand(.4,1.4);g.beginPath();const y=Math.random()*256;g.moveTo(0,y);g.lineTo(256,y+rand(-2,2));g.stroke();}
  speckle(g,256,256,2500,['rgba(70,45,20,.25)','rgba(230,200,160,.2)'],0.5,1.5);
  blotch(g,256,256,6,'80,50,20',.05,.12,20,70);
  const top = makeCanvas(256,256), t = top.getContext('2d');
  t.drawImage(side,0,0);
  // tape
  t.fillStyle='rgba(205,170,110,.85)'; t.fillRect(0,104,256,48);
  t.fillStyle='rgba(255,255,255,.18)'; t.fillRect(0,108,256,4);
  const sideT = makeCanvas(256,256), s = sideT.getContext('2d');
  s.drawImage(side,0,0); s.fillStyle='rgba(205,170,110,.85)'; s.fillRect(104,0,48,62); s.fillStyle='rgba(255,255,255,.18)'; s.fillRect(108,0,4,62);
  // this-way-up arrows
  s.strokeStyle='rgba(30,25,20,.75)'; s.lineWidth=5;
  [[70,190],[100,190]].forEach(([x,y])=>{s.beginPath();s.moveTo(x,y+30);s.lineTo(x,y);s.moveTo(x-10,y+12);s.lineTo(x,y);s.lineTo(x+10,y+12);s.stroke();});
  s.fillStyle='rgba(30,25,20,.75)'; s.font='700 18px "IBM Plex Mono", monospace'; s.fillText('THIS SIDE UP',128,214);
  return {
    side: new THREE.MeshStandardMaterial({map:tex(side,true), roughness:.9}),
    sideTaped: new THREE.MeshStandardMaterial({map:tex(sideT,true), roughness:.85}),
    top: new THREE.MeshStandardMaterial({map:tex(top,true), roughness:.8})
  };
}
/* ================= bins: grey crates on pallets, relabelled by sort rule ================= */
const binContents = [[],[],[],[]], binCount = [0,0,0,0], binLabels = [];
const palletWood = (function(){const c=makeCanvas(256,64),g=c.getContext('2d');g.fillStyle='#c39a65';g.fillRect(0,0,256,64);
  for(let i=0;i<260;i++){g.strokeStyle=`rgba(${rand(100,150)|0},${rand(65,95)|0},40,${rand(.1,.35)})`;g.lineWidth=rand(.5,2);g.beginPath();const y=Math.random()*64;g.moveTo(0,y);g.bezierCurveTo(80,y+rand(-4,4),170,y+rand(-4,4),256,y+rand(-3,3));g.stroke();}
  return new THREE.MeshStandardMaterial({map:tex(c,true),roughness:.88});})();
const cratePlastic = new THREE.MeshStandardMaterial({color:0x4a5560, roughness:.6});
const CW=1.7, CD=1.3, CH=0.55, CT=0.05;
BIN_POS.forEach((pos,bi)=>{
  const g = new THREE.Group(); g.position.copy(pos);
  for(let i=0;i<6;i++) mesh(new THREE.BoxGeometry(0.15,0.025,1.5), palletWood, -0.85+i*0.34, 0.1375, 0, g);
  [-0.65,0,0.65].forEach(z=>[-0.85,0,0.85].forEach(x=>mesh(new THREE.BoxGeometry(0.15,0.1,0.15), palletWood, x, 0.075, z, g)));
  [-0.65,0,0.65].forEach(z=>mesh(new THREE.BoxGeometry(1.85,0.025,0.15), palletWood, 0, 0.0125, z, g));
  aoDecal(2.6,2.2,g);
  const crate = new THREE.Group(); crate.position.y = PALLET_H; g.add(crate);
  const pl = cratePlastic;
  mesh(new THREE.BoxGeometry(CW,CT,CD), pl, 0, CT/2, 0, crate);
  mesh(new THREE.BoxGeometry(CW,CH,CT), pl, 0, CH/2,  CD/2-CT/2, crate);
  mesh(new THREE.BoxGeometry(CW,CH,CT), pl, 0, CH/2, -CD/2+CT/2, crate);
  mesh(new THREE.BoxGeometry(CT,CH,CD), pl,  CW/2-CT/2, CH/2, 0, crate);
  mesh(new THREE.BoxGeometry(CT,CH,CD), pl, -CW/2+CT/2, CH/2, 0, crate);
  mesh(roundedBox(CW+0.08,0.06,0.1,0.02), pl, 0, CH-0.03,  CD/2, crate);
  mesh(roundedBox(CW+0.08,0.06,0.1,0.02), pl, 0, CH-0.03, -CD/2, crate);
  mesh(roundedBox(0.1,0.06,CD+0.08,0.02), pl,  CW/2, CH-0.03, 0, crate);
  mesh(roundedBox(0.1,0.06,CD+0.08,0.02), pl, -CW/2, CH-0.03, 0, crate);
  const rib = new THREE.BoxGeometry(0.04,CH-0.12,0.035);
  [-0.7,-0.45,0.45,0.7].forEach(x=>{ mesh(rib, pl, x, CH/2, CD/2+0.015, crate); mesh(rib, pl, x, CH/2, -CD/2-0.015, crate); });
  const ribS = new THREE.BoxGeometry(0.035,CH-0.12,0.04);
  [-0.4,0,0.4].forEach(z=>{ mesh(ribS, pl, CW/2+0.015, CH/2, z, crate); mesh(ribS, pl, -CW/2-0.015, CH/2, z, crate); });
  mesh(new THREE.BoxGeometry(CW+0.02,0.05,CD+0.02), pl, 0, 0.12, 0, crate);
  const lc = makeCanvas(512,240);
  const lt = tex(lc,true);
  const holder = mesh(new THREE.BoxGeometry(0.84,0.4,0.02), M.darkPlastic, 0, CH*0.5, CD/2+0.045, crate);
  mesh(new THREE.PlaneGeometry(0.79,0.37), new THREE.MeshStandardMaterial({map:lt,roughness:.4}), 0, 0, 0.011, holder, true);
  binLabels.push({canvas:lc, texture:lt});
  [-1.1,1.1].forEach(x=>{
    mesh(new THREE.CylinderGeometry(0.08,0.08,1.1,20), M.yellow, x, 0.55, 1.0, g);
    mesh(new THREE.CylinderGeometry(0.081,0.081,0.08,20), M.rubber, x, 0.82, 1.0, g);
    mesh(new THREE.CylinderGeometry(0.14,0.14,0.02,20), M.darkSteel, x, 0.01, 1.0, g);
  });
  scene.add(g);
});
/* small pictograms shared by crate labels and the vision panel */
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function drawSide(g, shape, x, y, w, col){ // side silhouette of a 2-stud piece, bottom-left at x,y
  const u = w/2, hb = shape==='brick'||shape==='slope' ? u*1.2 : u*0.4;
  g.fillStyle = col;
  if(shape==='slope'){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+w,y); g.lineTo(x+w,y-hb*0.25); g.lineTo(x+u,y-hb); g.lineTo(x,y-hb); g.closePath(); g.fill(); }
  else { g.fillRect(x,y-hb,w,hb); }
  if(shape!=='tile'){ const n = shape==='slope'?1:2; for(let i=0;i<n;i++) g.fillRect(x+u*i+u*0.2, y-hb-u*0.18, u*0.6, u*0.18); }
}
function drawTop(g, l, w, x, y, u, col, slope, studs){ // top view, l studs across, w studs down
  g.fillStyle = col; rrect(g,x,y,l*u,w*u,u*0.12); g.fill();
  if(slope){ const gr=g.createLinearGradient(x+u,0,x+l*u,0); gr.addColorStop(0,'rgba(255,255,255,.18)'); gr.addColorStop(1,'rgba(0,0,0,.25)'); g.fillStyle=gr; g.fillRect(x+u,y,(l-1)*u,w*u); }
  if(!studs) return;
  for(let i=0;i<(slope?1:l);i++) for(let j=0;j<w;j++){
    g.beginPath(); g.arc(x+(i+.5)*u, y+(j+.5)*u, u*0.3, 0, Math.PI*2);
    g.fillStyle='rgba(255,255,255,.22)'; g.fill(); g.lineWidth=Math.max(1,u*0.06); g.strokeStyle='rgba(0,0,0,.3)'; g.stroke();
  }
}
function drawBinLabel(bi){
  const {canvas:c, texture:t} = binLabels[bi], g = c.getContext('2d'), key = RULES[rule].keys[bi];
  g.fillStyle='#f5f4ef'; g.fillRect(0,0,512,240);
  g.fillStyle='#1c2226'; g.fillRect(0,0,512,46);
  g.fillStyle='#f5f4ef'; g.font='600 28px "Chakra Petch", Impact, sans-serif'; g.fillText('BIN '+(bi+1)+'  ·  SORT BY '+rule.toUpperCase(),18,33);
  g.fillStyle='#151515'; g.font='700 70px "Chakra Petch", Impact, sans-serif';
  g.fillText(rule==='size' ? key.replace('x','×') : RULES[rule].name(key).toUpperCase(), 24, 140);
  g.font='500 24px "IBM Plex Mono", monospace'; g.fillStyle='#555';
  g.fillText(rule==='color'?'ANY SHAPE · ANY SIZE': rule==='shape'?'ANY COLOR · ANY SIZE':'STUDS · ANY COLOR', 26, 196);
  if(rule==='color'){ g.fillStyle=COLORS[key].css; rrect(g,372,74,112,112,14); g.fill(); }
  else if(rule==='shape'){ drawSide(g, key, 372, 170, 112, '#2a3136'); }
  else { const [w,l]=SIZES[key]; const u=Math.min(110/l, 110/w, 34); drawTop(g, l, w, 428-l*u/2, 130-w*u/2, u, '#2a3136', false, true); }
  t.needsUpdate = true;
}
function renderBinsPanel(){
  $('binsTitle').textContent = 'Bins · sorted by '+rule;
  $('binsPanel').innerHTML = RULES[rule].keys.map((k,i)=>`<div class="bin"><em>BIN ${i+1}</em><b id="bc${i}">${binCount[i]}</b><small>${rule==='color'?`<i class="sw" style="background:${COLORS[k].css}"></i>`:''}${RULES[rule].name(k)}</small></div>`).join('');
}
function setRule(r){
  rule = r;
  document.querySelectorAll('[data-rule]').forEach(b=>b.setAttribute('aria-pressed', b.dataset.rule===r));
  binContents.forEach(arr=>{ arr.forEach(m=>scene.remove(m)); arr.length=0; });
  arcs.forEach(a=>scene.remove(a.mesh)); arcs.length = 0;
  binCount.fill(0);
  BIN_POS.forEach((_,i)=>drawBinLabel(i));
  renderBinsPanel();
  if(current && current.id) $('sRoute').textContent = 'Bin '+(binIndex(current.a)+1);
}

/* ================= robot: clear cover, brush intake, internal conveyor + vision tunnel, rear dump bucket ================= */
const robot = new THREE.Group();
const body = new THREE.Group(); robot.add(body);
const glassMat = new THREE.MeshPhysicalMaterial({color:0xe6f2f7, roughness:.03, metalness:0, clearcoat:1, clearcoatRoughness:.03,
  transparent:true, opacity:.14, depthWrite:false, side:THREE.DoubleSide, envMapIntensity:1.6});
const bristleMat = new THREE.MeshStandardMaterial({color:0x2c3439, roughness:1});
const bristleTip = new THREE.MeshStandardMaterial({color:0x2f7fd0, roughness:.9});
// chassis
mesh(roundedBox(1.3,0.08,1.55,0.03), M.darkSteel, 0,0.25,-0.2, body);
[-0.63,0.63].forEach(x=>mesh(roundedBox(0.05,0.16,1.75,0.02), M.darkPlastic, x,0.32,-0.05, body));
mesh(roundedBox(1.3,0.09,0.07,0.03), M.rubber, 0,0.2,-1.03, body);
const ledMat = new THREE.MeshStandardMaterial({color:0x111111, emissive:0x2db3a6, emissiveIntensity:2.2});
[-0.658,0.658].forEach(x=>mesh(new THREE.BoxGeometry(0.01,0.025,1.4), ledMat, x,0.34,-0.05, body, true));
// wheels
const treadTex = (function(){const c=makeCanvas(512,64),g=c.getContext('2d');g.fillStyle='#808080';g.fillRect(0,0,512,64);g.fillStyle='#2a2a2a';
  for(let x=0;x<512;x+=16){g.fillRect(x,8,6,48);}return tex(c,false);})();
const tyreMat = new THREE.MeshStandardMaterial({color:0x18191a, roughness:.88, bumpMap:treadTex, bumpScale:0.015});
const tyreProfile = [];
for(let i=0;i<=12;i++){const a=-Math.PI/2+i/12*Math.PI; tyreProfile.push(new THREE.Vector2(0.17+0.05*Math.cos(a), 0.075*Math.sin(a)));}
const tyreGeo = new THREE.LatheGeometry(tyreProfile, 40); tyreGeo.rotateZ(Math.PI/2);
const hubGeo = new THREE.CylinderGeometry(0.14,0.14,0.13,28).rotateZ(Math.PI/2);
const capGeo = new THREE.CylinderGeometry(0.05,0.05,0.15,16).rotateZ(Math.PI/2);
const boltGeo = new THREE.CylinderGeometry(0.012,0.012,0.15,8).rotateZ(Math.PI/2);
const wheels = [];
[[0.73,0.5],[-0.73,0.5],[0.73,-0.62],[-0.73,-0.62]].forEach(([x,z])=>{
  const w = new THREE.Group(); w.position.set(x,0.22,z); robot.add(w);
  mesh(tyreGeo, tyreMat, 0,0,0, w); mesh(hubGeo, M.darkSteel, 0,0,0, w); mesh(capGeo, M.alu, 0,0,0, w);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2; mesh(boltGeo, M.alu, 0, Math.cos(a)*0.09, Math.sin(a)*0.09, w);}
  wheels.push(w);
});
aoDecal(2.0,2.6,robot);

/* intake: hood, roller brush, two side brushes */
mesh(roundedBox(1.0,0.025,0.3,0.01), M.darkPlastic, 0,0.33,0.95, body);
[-0.5,0.5].forEach(x=>mesh(new THREE.BoxGeometry(0.025,0.2,0.3), M.darkPlastic, x,0.23,0.95, body));
const roller = new THREE.Group(); roller.position.set(0,0.2,0.95); body.add(roller);
mesh(new THREE.CylinderGeometry(0.035,0.035,0.96,16).rotateZ(Math.PI/2), M.steel, 0,0,0, roller);
for(let i=0;i<6;i++){ const b = mesh(new THREE.BoxGeometry(0.9,0.1,0.016), i%2?bristleMat:bristleTip, 0,0,0, roller); b.rotation.x = i*Math.PI/6*2; b.geometry.translate(0,0.05,0); }
const sideBrushes = [];
const bristleGeo = new THREE.CylinderGeometry(0.004,0.007,0.22,5); bristleGeo.translate(0,0.11,0); bristleGeo.rotateZ(-Math.PI/2+0.12);
[-0.47,0.47].forEach((x,si)=>{
  const sb = new THREE.Group(); sb.position.set(x,0.035,1.08); body.add(sb);
  mesh(new THREE.CylinderGeometry(0.055,0.06,0.035,20), M.darkPlastic, 0,0.01,0, sb);
  mesh(new THREE.CylinderGeometry(0.012,0.012,0.17,8), M.steel, 0,0.1,0, sb);
  for(let i=0;i<24;i++){ const b = mesh(bristleGeo, i%4===0?bristleTip:bristleMat, 0,0,0, sb, true); b.rotation.y = i/24*Math.PI*2 + (i%3)*0.04; }
  sb.userData.dir = si ? -1 : 1; sideBrushes.push(sb);
});

/* conveyors */
const beltTex = (function(){const c=makeCanvas(64,256),g=c.getContext('2d');g.fillStyle='#1e2124';g.fillRect(0,0,64,256);
  speckle(g,64,256,900,['#2a2e31','#16181a'],1,2);g.fillStyle='#34393d';for(let y=0;y<256;y+=32)g.fillRect(0,y,64,5);
  const t=tex(c,true);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})();
const rampTex = beltTex.clone(); rampTex.needsUpdate = true; rampTex.repeat.set(1,3);
const flatTex = beltTex.clone(); flatTex.needsUpdate = true; flatTex.repeat.set(1,3);
const RAMP_A = Math.atan2(0.4, 0.65), RAMP_L = Math.hypot(0.4,0.65);
const ramp = mesh(new THREE.BoxGeometry(0.5,0.02,RAMP_L), [M.rubber,M.rubber,new THREE.MeshStandardMaterial({map:rampTex,roughness:.85}),M.rubber,M.rubber,M.rubber], 0,0.21,0.625, body);
ramp.rotation.x = RAMP_A;
mesh(new THREE.BoxGeometry(0.5,0.02,0.82), [M.rubber,M.rubber,new THREE.MeshStandardMaterial({map:flatTex,roughness:.85}),M.rubber,M.rubber,M.rubber], 0,0.41,-0.1, body);
[[0.04,0.95],[0.42,0.3],[0.42,-0.5]].forEach(([y,z])=>mesh(new THREE.CylinderGeometry(0.03,0.03,0.54,16).rotateZ(Math.PI/2), M.steel, 0,y-0.012,z, body));
[-0.28,0.28].forEach(x=>{
  const r = mesh(new THREE.BoxGeometry(0.02,0.07,RAMP_L), M.alu, x,0.23,0.625, body); r.rotation.x = RAMP_A;
  mesh(new THREE.BoxGeometry(0.02,0.07,0.82), M.alu, x,0.435,-0.1, body);
  mesh(new THREE.BoxGeometry(0.03,0.13,0.03), M.alu, x,0.33,-0.45, body);
});
mesh(new THREE.CylinderGeometry(0.05,0.05,0.13,20).rotateZ(Math.PI/2), M.darkSteel, 0.34,0.41,-0.5, body);
mesh(new THREE.CylinderGeometry(0.045,0.045,0.13,20).rotateZ(Math.PI/2), M.darkSteel, 0.34,0.05,0.95, body);

/* vision tunnel around the flat belt */
const TUN_Z = -0.1;
[-0.33,0.33].forEach(x=>mesh(new THREE.BoxGeometry(0.05,0.47,0.14), M.darkPlastic, x,0.645,TUN_Z, body));
mesh(new THREE.BoxGeometry(0.71,0.06,0.14), M.darkPlastic, 0,0.88,TUN_Z, body);
const tunnelLed = new THREE.MeshStandardMaterial({color:0x111111, emissive:0xeaf6ff, emissiveIntensity:1.6});
[-0.302,0.302].forEach(x=>mesh(new THREE.BoxGeometry(0.008,0.36,0.03), tunnelLed, x,0.64,TUN_Z+0.05, body, true));
mesh(new THREE.BoxGeometry(0.56,0.008,0.03), tunnelLed, 0,0.848,TUN_Z+0.05, body, true);
/* 3D scan camera bar: stereo IR pair + IR dot projector + RGB, plus three laser-line emitters in one plane */
const LZ = TUN_Z-0.03;                                 // laser plane (robot-local z)
const camBar = new THREE.Group(); camBar.position.set(0,0.835,LZ+0.06); body.add(camBar);
mesh(roundedBox(0.36,0.045,0.06,0.018,3), new THREE.MeshStandardMaterial({color:0x1b1f23, roughness:.35, metalness:.6}), 0,0,0, camBar);
mesh(new THREE.BoxGeometry(0.33,0.003,0.04), M.glass, 0,-0.0235,0, camBar, true);
const lensRing = new THREE.MeshStandardMaterial({color:0x8a9196, metalness:1, roughness:.25});
const lensGlass = new THREE.MeshPhysicalMaterial({color:0x0a0f18, roughness:.02, clearcoat:1, metalness:.3});
[[-0.13,'ir'],[-0.05,'proj'],[0.03,'rgb'],[0.13,'ir']].forEach(([x,kind])=>{
  mesh(new THREE.CylinderGeometry(0.013,0.013,0.006,24), lensRing, x,-0.026,0, camBar, true);
  mesh(new THREE.CylinderGeometry(0.009,0.009,0.007,24), kind==='proj'?new THREE.MeshStandardMaterial({color:0x200000,emissive:0x701010,emissiveIntensity:1}):lensGlass, x,-0.027,0, camBar, true);
});
const camLabel = (function(){const c=makeCanvas(256,40),g=c.getContext('2d');g.fillStyle='#1b1f23';g.fillRect(0,0,256,40);g.fillStyle='#cfd6da';g.font='600 22px "Chakra Petch", sans-serif';g.fillText('DEPTH 3D · D-450',10,28);
  return new THREE.MeshStandardMaterial({map:tex(c,true),roughness:.4});})();
mesh(new THREE.PlaneGeometry(0.2,0.031), camLabel, 0,0,0.031, camBar, true);
const camLed = mesh(new THREE.SphereGeometry(0.004,8,6), new THREE.MeshBasicMaterial({color:0x30ff60}), 0.165,0.01,0.031, camBar, true);
// laser emitters: top centre + two angled side heads, all firing in the plane z = LZ
const EMIT = [V3(0,0.815,LZ), V3(-0.285,0.7,LZ), V3(0.285,0.7,LZ)];
function V3(x,y,z){return new THREE.Vector3(x,y,z);}
EMIT.forEach((e,i)=>{
  const hd = mesh(new THREE.CylinderGeometry(0.014,0.016,0.05,16), M.darkSteel, e.x,e.y,e.z, body);
  if(i){ hd.rotation.z = (i===1?-1:1)*0.9; }
  mesh(new THREE.SphereGeometry(0.006,10,8), new THREE.MeshBasicMaterial({color:0xff2020}), e.x+(i===1?0.02:i===2?-0.02:0), e.y-(i?0.012:0.026), e.z, body, true);
});
// visible laser fans (triangles from emitter to belt), shown only while scanning
const fanMat = new THREE.MeshBasicMaterial({color:0xff2a2a, transparent:true, opacity:.16, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide});
const fans = EMIT.map((e,i)=>{
  const g = new THREE.BufferGeometry();
  const x0 = i===0?-0.27:i===1?-0.05:-0.27, x1 = i===0?0.27:i===1?0.27:0.05;
  g.setAttribute('position', new THREE.Float32BufferAttribute([e.x,e.y,0, x0,0.43,0, x1,0.43,0],3));
  const m = new THREE.Mesh(g, fanMat); m.position.z = LZ; m.visible = false; m.renderOrder = 6; body.add(m); return m;
});
// bright laser line where the fans touch the brick (latest slice)
const SLICE_MAX = 400;
const sliceGeo = new THREE.BufferGeometry();
sliceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SLICE_MAX*3),3));
sliceGeo.setDrawRange(0,0);
const slicePts = new THREE.Points(sliceGeo, new THREE.PointsMaterial({color:0xff3a2a, size:0.011, transparent:true, opacity:.95, blending:THREE.AdditiveBlending, depthWrite:false}));
slicePts.frustumCulled = false; slicePts.renderOrder = 7; body.add(slicePts);
// accumulated point cloud (brick-local), shown on the brick and in the panel viewer
const CLOUD_MAX = 14000;
const cloudGeo = new THREE.BufferGeometry();
cloudGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(CLOUD_MAX*3),3));
cloudGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(CLOUD_MAX*3),3));
cloudGeo.setDrawRange(0,0);
const worldCloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({color:0x57e3d7, size:0.0055, transparent:true, opacity:.85, blending:THREE.AdditiveBlending, depthWrite:false}));
worldCloud.frustumCulled = false; worldCloud.renderOrder = 7;
const flash = new THREE.PointLight(0xffe8e8, 0, 1.2, 2); flash.position.set(0,0.74,TUN_Z); body.add(flash);

/* electronics */
const battTex = (function(){const c=makeCanvas(256,128),g=c.getContext('2d');g.fillStyle='#29424f';g.fillRect(0,0,256,128);
  g.fillStyle='#e9eef0';g.font='700 30px "Chakra Petch", Impact, sans-serif';g.fillText('48V  LiFePO4',16,52);
  g.font='500 18px "IBM Plex Mono", monospace';g.fillStyle='#9fb6bf';g.fillText('40 Ah · 1.9 kWh',16,86);g.fillStyle='#f2c218';g.fillRect(200,70,40,40);
  return new THREE.MeshStandardMaterial({map:tex(c,true),roughness:.5});})();
mesh(new THREE.BoxGeometry(0.8,0.08,0.55), [M.darkPlastic,M.darkPlastic,battTex,M.darkPlastic,M.darkPlastic,M.darkPlastic], 0,0.33,-0.2, body);
const pcbTex = (function(){const c=makeCanvas(256,160),g=c.getContext('2d');g.fillStyle='#145a32';g.fillRect(0,0,256,160);
  g.strokeStyle='#c9a227';g.lineWidth=1.5;for(let i=0;i<40;i++){g.beginPath();let x=Math.random()*256,y=Math.random()*160;g.moveTo(x,y);x+=rand(-60,60);g.lineTo(x,y);y+=rand(-40,40);g.lineTo(x,y);g.stroke();}
  g.fillStyle='#111';[[30,30,60,50],[120,40,40,40],[180,90,50,30],[40,100,30,30]].forEach(r=>g.fillRect(...r));
  g.fillStyle='#ddd';g.font='10px monospace';g.fillText('SORTBOT MCU r4',150,150);return new THREE.MeshStandardMaterial({map:tex(c,true),roughness:.45,metalness:.2});})();
const pcb = mesh(new THREE.BoxGeometry(0.004,0.22,0.36), [pcbTex,pcbTex,M.darkPlastic,M.darkPlastic,M.darkPlastic,M.darkPlastic], -0.56,0.55,0.25, body);
[[0.6,0.08],[0.55,-0.04],[0.5,0.1]].forEach(([y,z])=>mesh(new THREE.BoxGeometry(0.02,0.04,0.05), M.darkPlastic, -0.548,y,0.25+z, body));
function cable(points, color){
  const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  mesh(new THREE.TubeGeometry(curve, 30, 0.009, 6, false), new THREE.MeshStandardMaterial({color, roughness:.5}), 0,0,0, body);
}
cable([[-0.55,0.46,0.2],[-0.45,0.36,0.0],[-0.2,0.38,-0.15]], 0xb3261e);
cable([[-0.55,0.48,0.3],[-0.4,0.34,0.1],[-0.1,0.36,-0.1]], 0x111111);
cable([[-0.55,0.62,0.3],[-0.35,0.88,0.05],[-0.17,0.86,TUN_Z+0.03]], 0x2f7fd0);
cable([[-0.55,0.5,0.35],[-0.3,0.3,0.6],[0.3,0.08,0.95]], 0xd9a11a);

/* clear cover with aluminium frame (rear panel stops above the belt exit) */
const CZ0 = 0.9, CZ1 = -0.6, CL = CZ0-CZ1, CZ = (CZ0+CZ1)/2, CY0 = 0.35, CY1 = 0.98;
const cover = new THREE.Group(); body.add(cover);
const frameMat = new THREE.MeshStandardMaterial({color:0xc9cfd4, metalness:.35, roughness:.38});
const glassPanel = (w,h,d,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), glassMat); m.position.set(x,y,z); m.renderOrder=5; cover.add(m); };
glassPanel(1.22,0.012,CL, 0,CY1,CZ);
glassPanel(0.012,CY1-CY0,CL, -0.61,(CY0+CY1)/2,CZ); glassPanel(0.012,CY1-CY0,CL, 0.61,(CY0+CY1)/2,CZ);
glassPanel(1.22,CY1-CY0,0.012, 0,(CY0+CY1)/2,CZ0);
glassPanel(1.22,0.3,0.012, 0,CY1-0.15,CZ1);
[[0.61,CZ0],[-0.61,CZ0],[0.61,CZ1],[-0.61,CZ1]].forEach(([x,z])=>mesh(new THREE.BoxGeometry(0.035,CY1-CY0+0.02,0.035), frameMat, x,(CY0+CY1)/2,z, cover));
[0.61,-0.61].forEach(x=>mesh(new THREE.BoxGeometry(0.035,0.035,CL+0.035), frameMat, x,CY1,CZ, cover));
[CZ0,CZ1].forEach(z=>mesh(new THREE.BoxGeometry(1.255,0.035,0.035), frameMat, 0,CY1,z, cover));
[0.61,-0.61].forEach(x=>mesh(new THREE.BoxGeometry(0.03,0.03,CL), frameMat, x,CY0,CZ, cover));
// top gear on the cover
mesh(new THREE.CylinderGeometry(0.085,0.09,0.05,28), M.darkPlastic, 0,1.01,-0.35, cover);
const lidar = mesh(new THREE.CylinderGeometry(0.075,0.075,0.07,28), M.glass, 0,1.07,-0.35, cover);
mesh(new THREE.BoxGeometry(0.02,0.03,0.005), new THREE.MeshBasicMaterial({color:0xff3030}), 0,0,0.076, lidar, true);
const beaconMat = new THREE.MeshStandardMaterial({color:0x222222, emissive:0x2db3a6, emissiveIntensity:2.4});
mesh(new THREE.CylinderGeometry(0.035,0.035,0.08,20), beaconMat, 0.45,1.03,-0.45, cover);
mesh(new THREE.BoxGeometry(0.13,0.04,0.13), M.yellow, -0.45,1.0,-0.45, cover);
mesh(new THREE.CylinderGeometry(0.045,0.05,0.05,20), M.red, -0.45,1.04,-0.45, cover);
[-0.45,0.45].forEach(x=>mesh(new THREE.CylinderGeometry(0.035,0.035,0.02,20).rotateX(Math.PI/2), new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xfff6e0,emissiveIntensity:1.6}), x,0.4,CZ0+0.012, cover, true));
const decal = (function(){const c=makeCanvas(512,96),g=c.getContext('2d');g.fillStyle='#e9eef0';g.font='700 56px "Chakra Petch", Impact, sans-serif';g.fillText('SORTBOT',8,64);
  g.fillStyle='#2db3a6';g.fillRect(300,30,4,40);g.fillStyle='#e9eef0';g.font='600 44px "Chakra Petch", Impact, sans-serif';g.fillText('S-2',318,64);
  return new THREE.MeshStandardMaterial({map:tex(c,true),transparent:true,roughness:.3});})();
[[0.659,Math.PI/2],[-0.659,-Math.PI/2]].forEach(([x,r])=>{ const d = mesh(new THREE.PlaneGeometry(0.5,0.094), decal, x,0.3,-0.3, body, true); d.rotation.y = r; });

/* rear elevator + dump bucket */
[-0.52,0.52].forEach(x=>{ mesh(new THREE.BoxGeometry(0.05,1.2,0.06), M.darkSteel, x,0.88,-1.0, body); mesh(new THREE.BoxGeometry(0.018,1.1,0.02), M.alu, x,0.88,-0.965, body); });
mesh(new THREE.BoxGeometry(1.09,0.05,0.06), M.darkSteel, 0,1.48,-1.0, body);
const bucket = new THREE.Group(); bucket.position.set(0,0.30,-0.98); body.add(bucket);
mesh(new THREE.BoxGeometry(0.92,0.025,0.4), M.yellow, 0,0,0.2, bucket);
mesh(new THREE.BoxGeometry(0.92,0.16,0.02), M.yellow, 0,0.08,0.4, bucket);
[-0.46,0.46].forEach(x=>mesh(new THREE.BoxGeometry(0.02,0.16,0.4), M.yellow, x,0.08,0.2, bucket));
mesh(new THREE.BoxGeometry(0.92,0.05,0.02), M.yellow, 0,0.025,0, bucket);
[-0.49,0.49].forEach(x=>mesh(new THREE.BoxGeometry(0.04,0.1,0.06), M.darkSteel, x,0.03,0.02, bucket));

robot.position.copy(DOCK); robot.rotation.y = Math.PI;
scene.add(robot);
/* charger post behind the dock */
(function(){const p=new THREE.Group();p.position.set(DOCK.x, 0, DOCK.z+1.85);
  mesh(roundedBox(0.5,1.1,0.3,0.05), M.whitePaint, 0,0.55,0, p);
  mesh(new THREE.BoxGeometry(0.3,0.08,0.02), new THREE.MeshStandardMaterial({color:0x111,emissive:0x2db3a6,emissiveIntensity:1.8}), 0,0.9,-0.155, p, true);
  mesh(new THREE.BoxGeometry(0.36,0.12,0.08), M.darkPlastic, 0,0.28,-0.18, p);
  scene.add(p);})();

/* hex colours are authored in sRGB; convert once so the renderer gets linear values */
const _lin = new Set();
function linearizeColors(root){
  root.traverse(o=>{ if(!o.material) return; (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{
    if(_lin.has(m)) return; _lin.add(m);
    if(m.color && !(m.blending===THREE.AdditiveBlending)) m.color.convertSRGBToLinear();
    if(m.emissive) m.emissive.convertSRGBToLinear();
  });});
}
/* ================= bricks ================= */
let floorItems = [], itemSeq = 0;
const studGeo = new THREE.CylinderGeometry(P*0.3, P*0.3, P*0.17, 24);
const brickMats = {};
Object.keys(COLORS).forEach(k=>{ brickMats[k] = new THREE.MeshPhysicalMaterial({color:COLORS[k].hex, roughness:.24, metalness:0, clearcoat:.35, clearcoatRoughness:.2}); });
const brickGeoCache = {};
function bodyGeo(shape, w, l){
  const key = shape+w+'x'+l; if(brickGeoCache[key]) return brickGeoCache[key];
  const W = w*P-0.003, L = l*P-0.003, h = shape==='brick'||shape==='slope' ? BH : PH;
  let geo;
  if(shape==='slope'){
    const sh = new THREE.Shape();
    sh.moveTo(-L/2,-h/2); sh.lineTo(L/2,-h/2); sh.lineTo(L/2,-h/2+h*0.22); sh.lineTo(-L/2+P,h/2); sh.lineTo(-L/2,h/2); sh.closePath();
    geo = new THREE.ExtrudeGeometry(sh,{depth:W, bevelEnabled:true, bevelThickness:0.003, bevelSize:0.003, bevelSegments:2});
    geo.rotateY(-Math.PI/2); geo.center();
  } else geo = roundedBox(W, h, L, 0.005, 2);
  return brickGeoCache[key] = geo;
}
function makeBrick(a){
  const g = new THREE.Group(), [w,l] = SIZES[a.size];
  const h = a.shape==='brick'||a.shape==='slope' ? BH : PH;
  const mat = brickMats[a.color];
  mesh(bodyGeo(a.shape,w,l), mat, 0,0,0, g);
  if(a.shape!=='tile'){
    for(let i=0;i<(a.shape==='slope'?1:l);i++) for(let j=0;j<w;j++)
      mesh(studGeo, mat, (j-(w-1)/2)*P, h/2+P*0.085, (i-(l-1)/2)*P, g);
  } else {
    mesh(new THREE.BoxGeometry(w*P-0.012,0.004,l*P-0.012), mat, 0,-h/2+0.002,0, g, true); // bottom groove hint
  }
  g.userData = {a, h:h/2, foot:Math.max(w,l)*P};
  g.userData.ao = aoDecal(w*P*1.9, l*P*1.5, g, -h/2+0.004);
  return g;
}
function randomAttrs(){
  const pick = o=>{const k=Object.keys(o);return k[(Math.random()*k.length)|0];};
  return {shape:pick(SHAPES), color:pick(COLORS), size:pick(SIZES)};
}
function scatter(n){
  let tries = 0, placed = 0;
  while(placed<n && tries<600){
    tries++;
    const x = (Math.random()*2-1)*7.2, z = -2.6 + Math.random()*8.4;
    const p = new THREE.Vector3(x,0,z);
    if(p.distanceTo(DOCK)<2.4 || p.distanceTo(robot.position)<2) continue;
    if(floorItems.some(it=>it.position.distanceTo(p)<1.25)) continue;
    const it = makeBrick(randomAttrs());
    it.position.set(x, it.userData.h, z); it.rotation.y = Math.random()*Math.PI;
    linearizeColors(it); scene.add(it); floorItems.push(it); placed++;
  }
  updateLeft();
}

/* ================= behaviour ================= */
const STATES = {
  seek:{t:'Searching floor', c:0x2db3a6}, toItem:{t:'Driving to brick', c:0x2db3a6}, intake:{t:'Brushing brick in', c:0x2db3a6},
  convey:{t:'Conveying inside', c:0x2db3a6}, scan:{t:'3D scanning', c:0xff3030}, register:{t:'Registering', c:0xff3030},
  toBucket:{t:'Transfer to bucket', c:0x2db3a6}, toBin:{t:'Delivering', c:0}, align:{t:'Reversing to box', c:0}, dump:{t:'Unloading into box', c:0},
  reset:{t:'Lowering bucket', c:0x2db3a6}, home:{t:'Returning to dock', c:0x2db3a6}, idle:{t:'Docked · charging', c:0x3fbf5f}
};
let state='seek', target=null, timer=0, regCount=0, current=null;
let speed=1, paused=false, follow=false, simTime=8*3600, vel=0, omega=0, pitch=0, prevVel=0;
let brushSpeed=0, beltSpeed=0;
const arcs = [];
function setState(s){
  state = s; timer = 0;
  let txt = STATES[s].t, col = STATES[s].c;
  if((s==='toBin'||s==='align'||s==='dump') && current){ txt += ' · Bin '+(binIndex(current.a)+1); col = COLORS[current.a.color].hex; }
  $('stateTxt').textContent = txt;
  const hex = '#'+col.toString(16).padStart(6,'0');
  $('stateDot').style.background = hex; $('stateDot').style.color = hex;
  ledMat.emissive.setHex(col).convertSRGBToLinear(); beaconMat.emissive.setHex(col).convertSRGBToLinear();
}
const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
function wrapAngle(a){while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function driveTo(p, stopDist, dt, vmax){
  vmax = vmax||1.7;
  const dx = p.x-robot.position.x, dz = p.z-robot.position.z;
  const dist = Math.hypot(dx,dz), remaining = dist-stopDist;
  const diff = (stopDist===0 && dist<0.06) ? 0 : wrapAngle(Math.atan2(dx,dz) - robot.rotation.y);
  const wantOmega = clamp(diff*3.2,-1.6,1.6);
  omega += clamp(wantOmega-omega, -4*dt, 4*dt);
  robot.rotation.y += omega*dt;
  const vt = (Math.abs(diff)<0.22 && remaining>0) ? Math.min(vmax, Math.sqrt(2*1.1*remaining)) : 0;
  vel += clamp(vt-vel, -2.2*dt, 1.1*dt);
  if(vel<0) vel=0;
  const moved = Math.min(vel*dt, Math.max(0,remaining));
  robot.position.x += Math.sin(robot.rotation.y)*moved;
  robot.position.z += Math.cos(robot.rotation.y)*moved;
  spinWheels(moved, omega*dt);
  const done = remaining<0.02 && Math.abs(diff)<0.03;
  if(done){ vel=0; omega=0; }
  return done;
}
function turnTo(heading, dt){
  const diff = wrapAngle(heading - robot.rotation.y);
  omega += clamp(clamp(diff*3,-1.4,1.4)-omega, -4*dt, 4*dt);
  robot.rotation.y += omega*dt; spinWheels(0, omega*dt);
  if(Math.abs(diff)<0.01){ omega=0; return true; } return false;
}
function spinWheels(moved, dTheta){ wheels.forEach((w,i)=> w.rotation.x += moved/0.22 + (i%2===0?-1:1)*dTheta*0.73/0.22); }
function bucketTo(y, tilt, dt){
  const dy = y-bucket.position.y, dr = tilt-bucket.rotation.x;
  bucket.position.y += Math.sign(dy)*Math.min(Math.abs(dy), 0.6*dt);
  bucket.rotation.x += Math.sign(dr)*Math.min(Math.abs(dr), 1.5*dt);
  return Math.abs(y-bucket.position.y)<1e-3 && Math.abs(tilt-bucket.rotation.x)<1e-3;
}
/* move the carried brick along local waypoints {p, rx, ry} */
function followPath(dt, spd){
  const m = current.mesh;
  let left = spd*dt;
  while(current.path.length && left>0){
    const w = current.path[0], d = m.position.distanceTo(w.p);
    current.rx = w.rx; current.ry = w.ry;
    if(d<=left){ m.position.copy(w.p); current.path.shift(); left -= d; }
    else { m.position.lerp(w.p, left/d); left = 0; }
  }
  const k = Math.min(1, dt*7);
  m.rotation.x += (current.rx - m.rotation.x)*k;
  m.rotation.y += (current.ry - m.rotation.y)*k;
  m.rotation.z += (0 - m.rotation.z)*k;
  return current.path.length===0;
}
const BELT_Y = 0.42, SCAN_END = -0.54, V = (x,y,z)=>new THREE.Vector3(x,y,z);

function update(dt){
  timer += dt;
  let wantBrush = 0.6, wantBelt = 0;
  switch(state){
    case 'seek':
      if(!floorItems.length){ setState('home'); break; }
      floorItems.sort((a,b)=>a.position.distanceTo(robot.position)-b.position.distanceTo(robot.position));
      target = floorItems[0]; clearScanner(); setState('toItem'); break;
    case 'toItem':
      wantBrush = 2;
      if(driveTo(target.position, 1.75, dt)) setState('intake');
      break;
    case 'intake':
      wantBrush = 4; wantBelt = 0.5;
      if(driveTo(target.position, 0.98, dt, 0.4)){
        floorItems = floorItems.filter(i=>i!==target); updateLeft();
        target.userData.ao.visible = false;
        robot.attach(target);
        const h = target.userData.h, yaw = Math.round(target.rotation.y/Math.PI)*Math.PI;
        current = {mesh:target, a:target.userData.a, rx:0, ry:yaw, yaw, path:[
          {p:V(0, 0.04+h, 0.9), rx:0, ry:yaw},
          {p:V(0, BELT_Y+h, 0.3), rx:RAMP_A, ry:yaw},
          {p:V(0, BELT_Y+h, 0.29), rx:0, ry:yaw}
        ]};
        setState('convey');
      }
      break;
    case 'convey':
      wantBrush = 3; wantBelt = 0.5;
      if(followPath(dt, 0.5)){
        current.mesh.rotation.set(0, current.yaw, 0);
        current.path = [{p:V(0, BELT_Y+current.mesh.userData.h, SCAN_END), rx:0, ry:current.yaw}];
        current.scanFrom = current.mesh.position.z;
        startScan(current);
        setState('scan');
      }
      break;
    case 'scan': {
      wantBelt = 0.22;
      const done = followPath(dt, 0.22);
      const k = clamp((current.scanFrom - current.mesh.position.z)/(current.scanFrom-SCAN_END), 0, 1);
      fans.forEach(f=>f.visible=true); fanMat.opacity = 0.13 + 0.05*Math.sin(timer*40);
      flash.intensity = 0.35 + 0.2*Math.sin(timer*30);
      camLed.material.color.setHex(Math.sin(timer*12)>0?0xff3030:0x30ff60);
      scanSlice(current);
      showScanning(k);
      if(done){ fans.forEach(f=>f.visible=false); sliceGeo.setDrawRange(0,0); flash.intensity=0; camLed.material.color.setHex(0x30ff60); finishScan(current); setState('register'); }
      break;
    }
    case 'register':
      if(!current.id) registerItem(current);
      if(timer>0.5){
        const h = current.mesh.userData.h;
        current.path = [{p:V(0, BELT_Y+h, -0.56), rx:0, ry:current.yaw}, {p:V(0, BELT_Y+0.08+h, -0.6), rx:-0.3, ry:current.yaw}];
        setState('toBucket');
      }
      break;
    case 'toBucket':
      wantBelt = 0.5;
      worldCloud.material.opacity = Math.max(0, worldCloud.material.opacity - dt*1.2);
      if(followPath(dt, 0.6)){
        if(worldCloud.parent) worldCloud.parent.remove(worldCloud);
        bucket.attach(current.mesh);
        current.path = [{p:V(0, 0.0125+current.mesh.userData.h, 0.2), rx:0, ry:Math.PI/2}];
        current.inBucket = true;
        setState('toBin');
      }
      break;
    case 'toBin': {
      if(current.path.length) followPath(dt, 1.2);
      const A = BIN_POS[binIndex(current.a)].clone().add(V(0,0,1.8));
      if(driveTo(A, 0, dt)) setState('align');
      break;
    }
    case 'align':
      if(current.path.length) followPath(dt, 1.2);
      if(turnTo(0, dt)) setState('dump');
      break;
    case 'dump': {
      const up = bucket.position.y >= 1.049;
      if(!up) bucketTo(1.05, 0, dt);
      else bucketTo(1.05, -2.0, dt);
      if(up && bucket.rotation.x < -1.35 && current.mesh.parent===bucket) launchArc(current);
      if(current.mesh.parent!==bucket && bucket.rotation.x <= -1.999) setState('reset');
      break;
    }
    case 'reset': {
      const tilted = bucket.rotation.x < -0.001;
      const done = tilted ? bucketTo(1.05, 0, dt) && false : bucketTo(0.30, 0, dt);
      if(done){ current=null; setState('seek'); }
      break;
    }
    case 'home':
      if(floorItems.length){ setState('seek'); break; }
      if(robot.position.distanceTo(DOCK)<0.03 || driveTo(DOCK, 0, dt)){
        vel = 0;
        if(turnTo(Math.PI, dt)) setState('idle');
      }
      break;
    case 'idle':
      wantBrush = 0;
      if(floorItems.length) setState('seek');
      else if(timer>4) scatter(10);
      break;
  }

  // brushes and belts ease to their target speeds
  brushSpeed += (wantBrush-brushSpeed)*Math.min(1,dt*3);
  beltSpeed += (wantBelt-beltSpeed)*Math.min(1,dt*4);
  roller.rotation.x += brushSpeed*dt*3;
  sideBrushes.forEach(b=> b.rotation.y += b.userData.dir*brushSpeed*dt*2.5);
  rampTex.offset.y -= beltSpeed*dt/ RAMP_L * 3;
  flatTex.offset.y -= beltSpeed*dt/0.82*3;

  // suspension: pitch with acceleration, slight load sag
  const acc = (vel-prevVel)/Math.max(dt,1e-4); prevVel = vel;
  pitch += (clamp(-acc*0.012,-0.03,0.03) - pitch)*Math.min(1,dt*6);
  body.rotation.x = pitch;
  body.position.y = (current ? -0.006 : 0) + Math.sin(simTime*18)*0.0015*Math.min(1,vel);
  lidar.rotation.y += dt*14;

  // bricks arcing into crates, then settling
  for(let i=arcs.length-1;i>=0;i--){
    const a = arcs[i]; a.t += dt;
    if(a.t < 0.7){
      const t = a.t/0.7;
      a.mesh.position.lerpVectors(a.from, a.to, t);
      a.mesh.position.y += Math.sin(t*Math.PI)*0.35;
      a.mesh.rotation.x += dt*a.spin; a.mesh.rotation.z += dt*a.spin*0.7;
    } else {
      const s = Math.min(1,(a.t-0.7)/0.35);
      if(!a.settled){ a.settled=true; a.mesh.rotation.set(0, a.rotY, 0); }
      a.mesh.position.copy(a.to); a.mesh.position.y += Math.abs(Math.sin(s*Math.PI*2))*0.05*(1-s);
      if(s>=1) arcs.splice(i,1);
    }
  }

  if(follow) controls.target.lerp(tmp2.copy(robot.position).setY(0.6), Math.min(1, dt*3));
}

function launchArc(cur){
  scene.attach(cur.mesh);
  const bi = binIndex(cur.a), n = binCount[bi]++;
  const el = $('bc'+bi); if(el) el.textContent = binCount[bi];
  binContents[bi].push(cur.mesh);
  const col = n%2, row = Math.floor(n/2)%3, layer = Math.floor(n/6);
  const to = BIN_POS[bi].clone().add(new THREE.Vector3((col-0.5)*0.78+rand(-.04,.04), PALLET_H+0.05+cur.mesh.userData.h+layer*0.18, (row-1)*0.38+rand(-.03,.03)));
  arcs.push({mesh:cur.mesh, from:cur.mesh.position.clone(), to, t:0, spin:rand(2,4), rotY:Math.PI/2+rand(-.15,.15)+(Math.random()<.5?Math.PI:0)});
}

/* ================= 3D scanning (laser triangulation) ================= */
const MM = 8/P;                                   // scene metres -> real millimetres (8 mm stud pitch)
const raycaster = new THREE.Raycaster();
const _o = new THREE.Vector3(), _t = new THREE.Vector3(), _d = new THREE.Vector3(), _l = new THREE.Vector3(), _c = new THREE.Color();
const FULL_H = BH + P*0.17;                       // tallest possible: brick + studs
let cloudN = 0, scan = null;
function startScan(cur){
  cloudN = 0; cloudGeo.setDrawRange(0,0);
  scan = {lastZ:1e9, min:new THREE.Vector3(1e9,1e9,1e9), max:new THREE.Vector3(-1e9,-1e9,-1e9), targets:[]};
  cur.mesh.traverse(o=>{ if(o.isMesh && o!==cur.mesh.userData.ao) scan.targets.push(o); });
  worldCloud.material.opacity = .85;
  cur.mesh.add(worldCloud);
  panelBox.visible = false;
  $('cDims').textContent = '';
}
function scanSlice(cur){
  const m = cur.mesh;
  if(Math.abs(m.position.z - scan.lastZ) < 0.005) return;   // one profile every 0.3 mm of belt travel
  scan.lastZ = m.position.z;
  body.updateWorldMatrix(true,false); m.updateWorldMatrix(true,true);
  const pos = sliceGeo.attributes.position.array; let ns = 0;
  const cp = cloudGeo.attributes.position.array, cc = cloudGeo.attributes.color.array;
  EMIT.forEach((e,i)=>{
    const x0 = i===0?-0.27:i===1?-0.05:-0.27, x1 = i===0?0.27:i===1?0.27:0.05, N = i===0?56:34;
    body.localToWorld(_o.copy(e));
    for(let r=0;r<N;r++){
      body.localToWorld(_t.set(x0+(x1-x0)*r/(N-1), BELT_Y-0.01, LZ));
      raycaster.set(_o, _d.copy(_t).sub(_o).normalize());
      raycaster.far = 1.2;
      const hit = raycaster.intersectObjects(scan.targets, false)[0];
      if(!hit) continue;
      // sensor noise ~0.05 mm
      hit.point.x += (Math.random()-.5)*0.0012; hit.point.y += (Math.random()-.5)*0.0012;
      if(ns < SLICE_MAX){ body.worldToLocal(_l.copy(hit.point)); pos[ns*3]=_l.x; pos[ns*3+1]=_l.y; pos[ns*3+2]=_l.z; ns++; }
      if(cloudN < CLOUD_MAX){
        m.worldToLocal(_l.copy(hit.point));
        cp[cloudN*3]=_l.x; cp[cloudN*3+1]=_l.y; cp[cloudN*3+2]=_l.z;
        const t = clamp((_l.y + m.userData.h)/FULL_H, 0, 1);
        _c.setHSL((1-t)*0.66, 1, 0.52);
        cc[cloudN*3]=_c.r; cc[cloudN*3+1]=_c.g; cc[cloudN*3+2]=_c.b;
        scan.min.min(_l); scan.max.max(_l);
        cloudN++;
      }
    }
  });
  sliceGeo.setDrawRange(0, ns); sliceGeo.attributes.position.needsUpdate = true;
  cloudGeo.setDrawRange(0, cloudN); cloudGeo.attributes.position.needsUpdate = true; cloudGeo.attributes.color.needsUpdate = true;
  $('cPts').textContent = cloudN.toLocaleString('en-US')+' pts';
}
function measured(){
  const L = (scan.max.z-scan.min.z)*MM, W = (scan.max.x-scan.min.x)*MM, H = (scan.max.y-scan.min.y)*MM;
  return {L, W, H};
}
function finishScan(cur){
  const {L,W,H} = measured();
  cur.meas = {L,W,H};
  // fit the bounding box in the panel view
  panelBox.box.min.copy(scan.min); panelBox.box.max.copy(scan.max); panelBox.visible = true;
  $('cDims').textContent = `${L.toFixed(1)} × ${W.toFixed(1)} × ${H.toFixed(1)} mm`;
  $('sMeas').textContent = `L ${L.toFixed(1)} · W ${W.toFixed(1)} · H ${H.toFixed(1)} mm`;
}

/* panel viewer: its own small renderer showing the cloud, slowly orbiting */
const cloudCanvas = $('cloud');
const pr = new THREE.WebGLRenderer({canvas:cloudCanvas, antialias:true});
pr.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
pr.setClearColor(0x0b1012, 1);
const pScene = new THREE.Scene();
const pCam = new THREE.PerspectiveCamera(32, 1.6, 0.01, 20);
const panelCloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({size:0.006, vertexColors:true}));
panelCloud.frustumCulled = false; pScene.add(panelCloud);
const panelBox = new THREE.Box3Helper(new THREE.Box3(), 0x57d3c7); panelBox.visible = false; pScene.add(panelBox);
const pGrid = new THREE.GridHelper(1.2, 24, 0x1f3a3d, 0x162426); pScene.add(pGrid);
let pAng = 0.6;
function renderPanel(dt){
  const w = cloudCanvas.clientWidth, h = cloudCanvas.clientHeight;
  if(!w || !h) return;
  if(cloudCanvas.width !== Math.round(w*pr.getPixelRatio()) || cloudCanvas.height !== Math.round(h*pr.getPixelRatio())){ pr.setSize(w,h,false); pCam.aspect = w/h; pCam.updateProjectionMatrix(); }
  pAng += dt*0.5;
  const size = current && current.mesh ? current.mesh.userData.foot : 0.4;
  const hh = current && current.mesh ? current.mesh.userData.h : 0.05;
  pGrid.position.y = -hh - 0.002;
  const R = 0.35 + size*1.25;
  pCam.position.set(Math.sin(pAng)*R, R*0.62, Math.cos(pAng)*R);
  pCam.lookAt(0, 0, 0);
  pr.render(pScene, pCam);
}

/* ================= scanner + register UI ================= */
function sizeText(a){ const [w,l]=SIZES[a.size]; return `${w}×${l} studs`; }
function classify(a){ // what the scanner reports, derived from the measured cloud
  const m = measured();
  const studsL = Math.max(1, Math.round(m.L/8)), studsW = Math.max(1, Math.round(m.W/8));
  return {studsL, studsW, H:m.H};
}
function clearScanner(){
  $('sStatus').textContent='Waiting for brick'; ['sId','sShape','sColor','sSize','sMeas','sRoute'].forEach(id=>$(id).textContent='—');
  $('sBar').style.width='0%';
  cloudN = 0; cloudGeo.setDrawRange(0,0); panelBox.visible = false;
  $('cPts').textContent = ''; $('cDims').textContent = 'NO OBJECT IN FIELD';
}
function showScanning(k){
  const a = current.a;
  $('sStatus').textContent = 'Scanning… '+Math.round(k*100)+'%';
  $('sBar').style.width = (k*100)+'%';
  if(cloudN>20){ const m = measured(); $('sMeas').textContent = `L ${m.L.toFixed(1)} · W ${m.W.toFixed(1)} · H ${m.H.toFixed(1)} mm`; }
  if(k>0.35) $('sColor').innerHTML = `<i class="sw" style="background:${COLORS[a.color].css}"></i>${COLORS[a.color].name}`;
  if(k>0.7) $('sShape').textContent = SHAPES[a.shape];
  if(k>0.97){ const c = classify(a); $('sSize').textContent = `${Math.min(c.studsW,c.studsL)}×${Math.max(c.studsW,c.studsL)} studs`; }
}
function registerItem(cur){
  regCount++;
  cur.id = 'BRK-'+String(regCount).padStart(4,'0');
  const a = cur.a, bi = binIndex(a);
  $('sStatus').textContent = 'Registered ✓';
  $('sId').textContent = cur.id; $('sRoute').textContent = 'Bin '+(bi+1)+' ('+RULES[rule].name(attrKey(a))+')';
  $('sShape').textContent = SHAPES[a.shape]; $('sSize').textContent = sizeText(a);
  const li = document.createElement('li');
  li.innerHTML = `<span class="t">${fmtClock(simTime)}</span><span><i class="sw" style="background:${COLORS[a.color].css}"></i>${cur.id} · ${COLORS[a.color].name} ${SHAPES[a.shape]} ${a.size.replace('x','×')} · ${cur.meas?cur.meas.H.toFixed(1)+' mm':''}</span><span class="tag" style="background:#dce5e7">${bi+1}</span>`;
  const log = $('log'); log.prepend(li);
  while(log.children.length>80) log.lastChild.remove();
  $('logEmpty').hidden = true;
}
function updateLeft(){ $('left').textContent = 'On floor: '+floorItems.length; }
function fmtClock(s){ s=Math.floor(s)%86400; return [s/3600,(s%3600)/60,s%60].map(v=>String(Math.floor(v)).padStart(2,'0')).join(':'); }

/* ================= controls ================= */
$('btnPause').onclick = e=>{ paused=!paused; e.target.textContent = paused?'Resume':'Pause'; };
const speeds=[1,2,4]; let si=0;
$('btnSpeed').onclick = e=>{ si=(si+1)%speeds.length; speed=speeds[si]; e.target.textContent='Speed '+speed+'×'; };
$('btnAdd').onclick = ()=>scatter(8);
document.querySelectorAll('[data-rule]').forEach(b=>b.onclick=()=>setRule(b.dataset.rule));
$('btnFollow').onclick = e=>{ follow=!follow; e.target.setAttribute('aria-pressed', follow); if(!follow) controls.target.set(0,0.4,-0.8); };

/* ================= loop ================= */
function resize(){ const w=stage.clientWidth, h=stage.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(stage); resize();

linearizeColors(scene);
setRule('color');
scatter(12); clearScanner(); setState('seek');
$('loading').hidden = true;
let last = performance.now();
function frame(now){
  const dt = Math.min(0.05,(now-last)/1000); last = now;
  if(!paused){ const s = dt*speed; simTime += s; update(s); $('clock').textContent = fmtClock(simTime); }
  controls.update();
  renderer.render(scene, camera);
  renderPanel(paused?0:dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
