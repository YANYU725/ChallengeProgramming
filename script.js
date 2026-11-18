'use strict';
const $=s=>document.querySelector(s),A=$('#app'),DIRS=[[-1,0],[0,1],[1,0],[0,-1]],KEY='cp_rec_v1';
const LAB=['基本','応用','発展'],SHORT={beetle:'ビートル',signal:'信号機',led:'光るメッセージ'};
const BL={F:'⬆ すすむ',R:'↱ みぎを むく',L:'↰ ひだりを むく',red:'🔴 あかを つける',yellow:'🟡 きいろを つける',blue:'🔵 あおを つける',w1:'⏱ 1びょう まつ',w3:'⏱ 3びょう まつ',heart:'❤ ハートを ひょうじ',smile:'😊 えがおを ひょうじ',off:'⬛ がめんを けす'};
const PAT={heart:['.#.#.','#####','#####','.###.','..#..'].join(''),smile:['.#.#.','.#.#.','.....','#...#','.###.'].join('')};
const CAR='<svg viewBox="0 0 100 100"><rect x="22" y="18" width="14" height="12" rx="4" fill="#222"/><rect x="62" y="18" width="14" height="12" rx="4" fill="#222"/><rect x="22" y="70" width="14" height="12" rx="4" fill="#222"/><rect x="62" y="70" width="14" height="12" rx="4" fill="#222"/><rect x="10" y="26" width="80" height="48" rx="24" fill="#ffd400" stroke="#333" stroke-width="3"/><rect x="52" y="33" width="14" height="34" rx="6" fill="#7fb8ee"/><rect x="26" y="35" width="12" height="30" rx="5" fill="#7fb8ee"/><circle cx="86" cy="36" r="5" fill="#fff" stroke="#333"/><circle cx="86" cy="64" r="5" fill="#fff" stroke="#333"/></svg>';
const ACT={
beetle:{n:'きいろい ビートルを うごかそう！',ic:'🚗',b:['F','R','L'],
 c:{t:'ビートルを 2マス すすめて、ゴールへ いこう！',m:['S.G'],d:1,h:['ゴールまで なんマスか かぞえてみよう','「すすむ」ブロックを つかうよ','「すすむ」を 2かい ならべよう']},
 st:[
 {t:'まがって ゴールへ いこう！',m:['..G','S..'],d:1,h:['ゴールは どっちかな？','「すすむ」と「ひだりを むく」を つかうよ','すすむ 2かい → ひだり → すすむ 1かい']},
 {t:'ほしを とおって、ゴールへ いこう！',m:['..G','.P.','S..'],d:1,h:['ほし⭐を とおって ゴールへ いこう','みぎと ひだりに まがるよ','すすむ 1 → ひだり → すすむ 1 → みぎ → すすむ 1 → ひだり → すすむ 1']},
 {t:'いわを よけて、ゴールへ いこう！',m:['...G','.#..','....','S...'],d:1,h:['いわ🪨を よけて ゴールへ いこう','はじめは みぎに すすもう','すすむ 2 → ひだり → すすむ 3 → みぎ → すすむ 1']} ]},
signal:{n:'しんごうきを うごかそう！',ic:'🚦',b:['red','yellow','blue','w1','w3'],st:[
 {t:'あかしんごうを つけよう！',g:[{v:'red'}],h:['あかい ランプを つけるよ','「あかを つける」を つかうよ','「あかを つける」を 1こ ならべよう']},
 {t:'あお → き → あか の じゅんに ひからせよう！',g:[{v:'blue'},{v:'yellow'},{v:'red'}],h:['いろの じゅんばんを たしかめよう','3つの いろの ブロックを 1こずつ つかうよ','あお → きいろ → あか の じゅんに ならべよう']},
 {t:'あお3びょう → き1びょう → あか3びょう！',tm:1,g:[{v:'blue',w:3000},{v:'yellow',w:1000},{v:'red',w:3000}],h:['いろと じかんを どちらも たしかめよう','いろの ブロックの あとに「まつ」ブロックを いれるよ','あお・3びょう・きいろ・1びょう・あか・3びょう の じゅんだよ']}]},
led:{n:'ひかる メッセージを つくろう！',ic:'💡',b:['heart','smile','off','w1','w3'],st:[
 {t:'ハートを ひからせよう！',g:[{v:'heart'}],h:['ハートを ひょうじ させるよ','「ハートを ひょうじ」を つかうよ','「ハートを ひょうじ」を 1こ ならべよう']},
 {t:'ハート → えがお の じゅんに ひからせよう！',g:[{v:'heart'},{v:'smile'}],h:['ひょうじの じゅんばんを たしかめよう','「ハート」と「えがお」を 1こずつ つかうよ','ハートを ひょうじ → えがおを ひょうじ']},
 {t:'ハート3びょう → けす → えがお1びょう！',tm:1,g:[{v:'heart',w:3000},{v:'off'},{v:'smile',w:1000}],h:['5つの うごきを じゅんばんに かんがえよう','「まつ」ブロックと「がめんを けす」を つかうよ','ハート・3びょう まつ・けす・えがお・1びょう まつ']}]}};

let rec;try{rec=JSON.parse(localStorage.getItem(KEY))}catch(e){}
rec=rec||{s:{},f:[]};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(rec))}catch(e){}};
let S={scr:'top',prog:[]},V={},stopped=false,wake=null;
const cur=()=>S.st=='c'?ACT.beetle.c:ACT[S.act].st[S.st];
const T=(k=S.act+'-'+S.st)=>rec.s[k]||(rec.s[k]={n:0,c:0,r:0,rr:0,h:[0,0,0]});
const done=k=>rec.s[k]&&rec.s[k].c>0;
const sleep=ms=>new Promise(r=>{wake=r;setTimeout(r,ms)});
const stopRun=()=>{stopped=true;wake&&wake()};

/* ---- 解答可能かを検証 (BFS) ---- */
function solvable(s){const m=s.m,C=m[0].length,ps=[];let st;
 m.forEach((row,r)=>[...row].forEach((ch,c)=>{if(ch=='S')st=[r,c];if(ch=='P')ps.push(r*C+c)}));
 const q=[[st[0],st[1],s.d,0]],seen=new Set(),full=(1<<ps.length)-1;
 while(q.length){const [r,c,d,k]=q.shift(),key=[r,c,d,k].join();if(seen.has(key))continue;seen.add(key);
  if(m[r][c]=='G'&&k==full)return true;
  q.push([r,c,(d+1)%4,k],[r,c,(d+3)%4,k]);
  const nr=r+DIRS[d][0],nc=c+DIRS[d][1];
  if(m[nr]&&m[nr][nc]&&m[nr][nc]!='#'){const i=ps.indexOf(nr*C+nc);q.push([nr,nc,d,i<0?k:k|1<<i])}}
 return false}
[ACT.beetle.c,...ACT.beetle.st].forEach((s,i)=>solvable(s)||console.warn('解答なしのマップ:',i));

/* ---- 画面 ---- */
function show(){({top:scrTop,choose:scrChoose,play:scrPlay,reflect:scrReflect,rec:scrRec})[S.scr]()}
function scrTop(){
 A.innerHTML=`<h1>🚗 challenge programming</h1>
 <div class="card" style="max-width:520px;margin:12px auto"><div class="ic">🚗 ➡ 🏁</div><h2>みんなで やろう！</h2><p>ビートルを まっすぐ うごかそう ${done('beetle-c')?'✔':''}</p><button class="p" data-a="go" data-i="beetle" data-s="c">はじめる</button></div>
 <div class="row"><button class="g" data-a="scr" data-v="choose">じゆうに えらぶ ▶</button><button data-a="scr" data-v="rec">せんせい</button></div>`}
function scrChoose(){
 A.innerHTML=`<h1>すきな ものを えらぼう！</h1><div class="cards">`+Object.keys(ACT).map(k=>`<div class="card"><div class="ic">${ACT[k].ic}</div><h2>${ACT[k].n}</h2><div class="row">${[0,1,2].map(i=>`<button class="p" data-a="go" data-i="${k}" data-s="${i}">${i+1} ${LAB[i]}${done(k+'-'+i)?' ✔':''}</button>`).join('')}</div></div>`).join('')+`</div>
 <div class="row"><button data-a="scr" data-v="top">◀ もどる</button><button class="g" data-a="scr" data-v="reflect">📝 ふりかえり</button></div>`}
function scrPlay(){
 A.innerHTML=`<div class="head"><button data-a="scr" data-v="${S.st=='c'?'top':'choose'}">◀ もどる</button><b>${ACT[S.act].n}</b></div>
 <div class="steps" id="steps"></div><div class="task">🚩 お題：${cur().t}</div>
 <div class="play"><section class="stage" id="stage"></section><section class="ed"><div class="pal" id="pal"></div><div class="prog" id="prog"></div></section></div>
 <div id="msg"></div><div class="ctl" id="ctl"></div>`;dAll()}
function dAll(){if(S.scr!='play'||!$('#stage'))return;dSteps();dStage();dPal();dProg();dMsg();dCtl()}
function dSteps(){$('#steps').innerHTML=[['task','🚩 お題'],['build','🧩 手順'],['run','▶ 実行'],['fix','🔧 修正']].map(([k,t])=>`<span class="${S.step==k?'on':''}">${t}</span>${k=='fix'?'':'→'}`).join('')}
function dPal(){$('#pal').innerHTML=ACT[S.act].b.map(b=>`<button class="codeblock ${blockKind(b)}" data-a="add" data-v="${b}" ${S.running?'disabled':''}>${BL[b]}</button>`).join('')}
const blockKind=b=>['F','R','L'].includes(b)?'move':b[0]=='w'?'time':['red','yellow','blue'].includes(b)?'signalblock':'displayblock';
function dProg(){const d=S.running?'disabled':'';
 $('#prog').innerHTML=S.prog.length?S.prog.map((b,i)=>`<div class="item ${blockKind(b)}${S.cur==i?' cur':''}"><span>${i+1}</span><span class="lb">${BL[b]}${S.cur==i?' ◀じっこうちゅう':''}</span><button data-a="up" data-i="${i}" ${d}>▲</button><button data-a="dn" data-i="${i}" ${d}>▼</button><button class="r" data-a="del" data-i="${i}" ${d}>✕</button></div>`).join(''):'<div class="empty">うえの ブロックを おして ここに ならべよう</div>'}
function dMsg(){$('#msg').innerHTML=S.ok?`<div class="box ok">🎉 せいかい！ よくできたね！<div class="row"><button class="g" data-a="next">${S.st=='c'||S.st==2?'えらぶ がめんへ ▶':'つぎの ステージへ ▶'}</button><button data-a="again">もういちど みる</button>${S.st=='c'?'':'<button data-a="scr" data-v="reflect">📝 ふりかえり</button>'}</div></div>`:S.msg?`<div class="box">${S.msg}</div>`:''}
function dCtl(){const d=S.running?'disabled':'';$('#ctl').innerHTML=`<button class="g" data-a="run" ${d}>▶ じっこう</button><button class="r" data-a="stop" ${S.running?'':'disabled'}>■ とめる</button><button data-a="clr" ${d}>🗑 ぜんぶ けす</button><button class="p" data-a="hint" ${d}>💡 ヒント</button>`}
function dStage(){const e=$('#stage');
 if(S.act=='beetle'){const m=cur().m,C=m[0].length;
  e.innerHTML=`<div class="board${V.bad?' bad':''}" style="--cols:${C}">`+m.map((row,r)=>[...row].map((ch,c)=>`<div class="cell">${ch=='G'?'🏁<small>ゴール</small>':ch=='#'?'🪨':ch=='P'?(V.seen.has(r*C+c)?'✅':'⭐'):''}</div>`).join('')).join('')+
  `<div class="car" style="left:calc(var(--cs)*${V.c});top:calc(var(--cs)*${V.r})"><svg style="display:none"></svg>${CAR.replace('<svg ','<svg style="transform:rotate('+V.ang+'deg)" ')}</div>`+
  (Array.isArray(V.bad)?`<div class="boom" style="left:calc(var(--cs)*${V.bad[1]});top:calc(var(--cs)*${V.bad[0]})">💥</div>`:'')+`</div><p class="big">${V.bad=='out'?'⚠ そとに でちゃった':'むき：'+['うえ','みぎ','した','ひだり'][V.dir]}</p>`}
 else if(S.act=='signal'){const t={red:'あか',yellow:'きいろ',blue:'あお'};
  e.innerHTML=`<div class="sig">${[['blue','あお'],['yellow','き'],['red','あか']].map(([k,n])=>`<div class="lamp ${k}${V.lit==k?' on':''}">${n}</div>`).join('')}</div><p class="big">いま：${t[V.lit]?t[V.lit]+'が ついている':'ぜんぶ きえている'}</p>`}
 else{const p=PAT[V.lit]||'.'.repeat(25);
  e.innerHTML=`<div class="led">${[...p].map(x=>`<i class="${x=='#'?'on':''}"></i>`).join('')}</div><p class="big">いま：${{heart:'ハート',smile:'えがお'}[V.lit]||'きえている'}</p>`}}
function resetView(){S.cur=-1;
 if(S.act=='beetle'){const m=cur().m;let r=0,c=0;m.forEach((row,i)=>{const j=row.indexOf('S');if(j>=0){r=i;c=j}});V={r,c,dir:cur().d,ang:(cur().d-1)*90,seen:new Set(),bad:null}}
 else V={lit:null}}

/* ---- 編集・実行 ---- */
function go(a,s){stopRun();S={scr:'play',act:a,st:s,last:a,prog:[],step:'task',hint:0,failed:false,ok:false,msg:'',running:false,cur:-1};T().n++;save();resetView();scrPlay()}
function edit(f){if(S.running)return;f();S.ok=false;S.msg='';S.step=S.failed?'fix':'build';resetView();dAll()}
function hint(){if(S.running)return;if(S.hint<3){S.hint++;T().h[S.hint-1]++;save()}S.msg='💡 ヒント'+S.hint+'：'+cur().h[S.hint-1];dMsg()}
function next(){if(S.st!='c'&&S.st<2)go(S.act,S.st+1);else{S.scr='choose';show()}}
function stepB(b){
 if(b=='R'){V.dir=(V.dir+1)%4;V.ang+=90;return null}
 if(b=='L'){V.dir=(V.dir+3)%4;V.ang-=90;return null}
 const m=cur().m,C=m[0].length,nr=V.r+DIRS[V.dir][0],nc=V.c+DIRS[V.dir][1];
 if(!m[nr]||!m[nr][nc]){V.bad='out';return 'マスの そとに でちゃった'}
 if(m[nr][nc]=='#'){V.bad=[nr,nc];return 'いわに ぶつかった'}
 V.r=nr;V.c=nc;if(m[nr][nc]=='P')V.seen.add(nr*C+nc);return null}
function judgeB(){const m=cur().m;
 if(V.seen.size<m.join('').split('P').length-1)return 'ほしを まだ とおっていないよ';
 return m[V.r][V.c]=='G'?null:'まだ ゴールに ついていないよ'}
function judgeE(ev){const s=cur(),g=s.g,e=s.tm?ev:ev.filter((x,i)=>!i||x.v!=ev[i-1].v);
 if(e.length!=g.length||g.some((x,i)=>x.v!=e[i].v))return 'ならべる じゅんばんを たしかめよう';
 return g.some((x,i)=>x.w!=null&&x.w!=e[i].w)?'まつ じかんを たしかめよう':null}
async function run(){
 if(S.running)return;
 if(!S.prog.length){S.msg='まず ブロックを ならべよう';dMsg();return}
 const t=T();t.r++;if(S.failed)t.rr++;save();
 S.running=true;stopped=false;S.ok=false;S.msg='';S.step='run';resetView();
 const ev=[];let err=null;
 for(let i=0;i<S.prog.length&&!stopped&&!err;i++){
  const b=S.prog[i];S.cur=i;let ms=800;
  if(S.act=='beetle')err=stepB(b);
  else if(b[0]=='w'){const w=b=='w1'?1000:3000;if(ev.length)ev[ev.length-1].w+=w;ms=w}
  else{V.lit=b;ev.push({v:b,w:0});const n=S.prog[i+1];ms=n&&n[0]=='w'?0:1000}
  dAll();await sleep(ms)}
 S.cur=-1;S.running=false;
 if(stopped){resetView();S.msg='とめたよ。もういちど ▶ を おしてね';dAll();return}
 const r=err||(S.act=='beetle'?judgeB():judgeE(ev));
 if(r){S.failed=true;S.msg='😮 '+r+'。ブロックは のこっているよ。なおして もういちど ためそう！'}
 else{S.ok=true;S.failed=false;t.c++;save()}
 dAll()}

/* ---- ふりかえり ---- */
const RQ=[['お題','なにを するのか わかった？',['わかった','ヒントで わかった','むずかしかった']],['手順','ブロックの じゅんばんを かんがえた？',['じぶんで かんがえた','ヒントを もらった','むずかしかった']],['実行','うごかして、けっかを たしかめた？',['たしかめた','いっしょに たしかめた','まだ できなかった']],['修正','うまく いかないとき、なおしてみた？',['じぶんで なおした','ヒントで なおした','なおす ひつようが なかった','むずかしかった']]];
const RKEY=[['🚩','お題','なにをする？'],['🧩','手順','どうやってする？'],['▶','実行','やってみよう！'],['🔧','修正','なおしてみよう！']];
const REFKEY=[['🚩 お題','なにを する？'],['🧩 手順','どうやって する？'],['▶ 実行','やってみよう！'],['🔧 修正','なおしてみよう！']];
const FLOW='🚩 お題をたしかめる → 🧩 手順をかんがえる → ▶ 実行する → 🔧 うまくいかなければ修正する → ▶ もういちど実行する';
function scrReflect(){const R=S.rf;
 if(R.done){A.innerHTML=`<h1>📝 ありがとう！</h1><div class="box ok">さいごまで こたえて くれて ありがとう。<br>じぶんで ためして みたことが すばらしいよ！</div><div class="box">${FLOW}</div><div class="row"><button class="g" data-a="scr" data-v="choose">もういちど ちょうせん</button><button data-a="scr" data-v="top">トップへ</button></div>`;return}
 A.innerHTML=`<h1>📝 ふりかえり</h1>`+RQ.map((q,i)=>`<div class="box"><div class="reflect-key"><strong>${RKEY[i][0]} ${RKEY[i][1]}</strong><span>${RKEY[i][2]}</span></div><div class="reflect-question">${q[1]}</div><div class="opt">${q[2].map((o,j)=>`<button class="${R.a[i]===j?'sel':''}" data-a="ans" data-q="${i}" data-v="${j}">${o}</button>`).join('')}</div></div>`).join('')+
 `<div class="row"><button data-a="scr" data-v="choose">◀ もどる</button><button class="g" data-a="rdone" ${R.a.filter(x=>x!=null).length<4?'disabled':''}>おわり</button></div>`}

/* ---- 記録 ---- */
const rows=()=>Object.entries(rec.s).map(([k,t])=>{const[a,s]=k.split('-');return[SHORT[a],s=='c'?'共通':LAB[s],t.n,t.c,t.r,t.rr,...t.h]});
const fRows=()=>rec.f.map(f=>[f.t,SHORT[f.k]||'-',...f.a.map((v,i)=>RQ[i][2][v])]);
function scrRec(){const tb=(h,r)=>`<table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r.map(x=>`<tr>${x.map(y=>`<td>${y}</td>`).join('')}</tr>`).join('')}</table>`;
 A.innerHTML=`<h1>せんせいよう きろく</h1><div style="overflow-x:auto">${tb(['教材','ステージ','挑戦','クリア','実行','修正後再実行','ヒント1','ヒント2','ヒント3'],rows())}<h2>ふりかえり</h2>${tb(['日時','教材','お題','手順','実行','修正'],fRows())}</div><div class="row"><button data-a="scr" data-v="top">◀ もどる</button><button class="g" data-a="csv">CSVを だす</button><button class="r" data-a="wipe">きろくを けす</button></div><p>※この端末・ブラウザの中だけに保存されます。</p>`}
function csv(){const q=v=>'"'+String(v).replace(/"/g,'""')+'"',L=[['教材','ステージ','挑戦回数','クリア回数','実行回数','修正後再実行','ヒント1','ヒント2','ヒント3'],...rows(),[],['日時','教材','Q1お題','Q2手順','Q3実行','Q4修正'],...fRows()].map(r=>r.map(q).join(','));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+L.join('\r\n')],{type:'text/csv'}));a.download='challenge_programming.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}

/* ---- イベント ---- */
A.onclick=e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const d=b.dataset,i=+d.i;
 switch(d.a){
 case 'scr':stopRun();S.running=false;if(d.v=='reflect')S.rf={a:[]};S.scr=d.v;show();break;
 case 'go':go(d.i,d.s=='c'?'c':+d.s);break;
 case 'add':edit(()=>S.prog.length<20&&S.prog.push(d.v));break;
 case 'up':edit(()=>{if(i>0)[S.prog[i-1],S.prog[i]]=[S.prog[i],S.prog[i-1]]});break;
 case 'dn':edit(()=>{if(i<S.prog.length-1)[S.prog[i+1],S.prog[i]]=[S.prog[i],S.prog[i+1]]});break;
 case 'del':edit(()=>S.prog.splice(i,1));break;
 case 'clr':edit(()=>{S.prog=[];S.failed=false;S.step='build'});break;
 case 'run':run();break;
 case 'stop':stopRun();break;
 case 'hint':hint();break;
 case 'again':S.ok=false;resetView();dAll();break;
 case 'next':next();break;
 case 'ans':S.rf.a[+d.q]=+d.v;scrReflect();break;
 case 'rdone':rec.f.push({t:new Date().toLocaleString('ja-JP'),k:S.last,a:S.rf.a});save();S.rf.done=1;scrReflect();break;
 case 'csv':csv();break;
 case 'wipe':if(confirm('きろくを ぜんぶ けしますか？')){rec={s:{},f:[]};save();scrRec()}break}};
show();
