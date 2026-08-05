const canvas=document.getElementById('graphCanvas');
const ctx=canvas.getContext('2d',{alpha:false});
const tooltip=document.getElementById('nodeTooltip');
const slider=document.getElementById('questionSlider');
const {sectors,questions,dimensions}=ProfessionalModel;
const HIGHLIGHT_MS=2600;
const choices=[['Strongly dislike',-1],['Dislike',-.5],['Unsure',0],['Like',.5],['Strongly like',1]];
const nodes=[],edges=[];
const mergeTraits=(...parts)=>{const out={};parts.forEach(p=>Object.entries(p||{}).forEach(([k,v])=>out[k]=Math.max(out[k]||0,v)));return out;};

sectors.forEach((sector,si)=>{
  const a=-Math.PI/2+si/sectors.length*Math.PI*2;
  const root={id:sector.id,label:sector.label,sector,level:0,x:Math.cos(a)*760,y:Math.sin(a)*540,radius:34,traits:sector.traits,score:0,visualRank:0,changedAt:-Infinity};
  nodes.push(root);
  sector.groups.forEach((group,gi)=>{
    const [label,jobs,extra]=group;
    const spread=(gi-(sector.groups.length-1)/2)*.16;
    const ga=a+spread;
    const branch={id:`${sector.id}-${gi}`,label,sector,level:1,x:root.x+Math.cos(ga)*190,y:root.y+Math.sin(ga)*190,radius:21,traits:mergeTraits(sector.traits,extra),score:0,visualRank:0,changedAt:-Infinity};
    nodes.push(branch);edges.push([root,branch]);
    jobs.forEach((job,ji)=>{
      const ja=ga+(ji-(jobs.length-1)/2)*.105;
      const d=120+(ji%2)*25;
      const leaf={id:`${sector.id}-${gi}-${ji}`,label:job,sector,level:2,x:branch.x+Math.cos(ja)*d,y:branch.y+Math.sin(ja)*d,radius:11,traits:mergeTraits(sector.traits,extra),score:0,visualRank:0,changedAt:-Infinity};
      nodes.push(leaf);edges.push([branch,leaf]);
    });
  });
});

let answers=Array(questions.length).fill(null),currentQuestion=0,view={x:0,y:0,scale:1},needsFrame=true,hoveredNode=null,advanceTimer=null;
const pointers=new Map();
let gesture=null,lastTap=0;
function requestDraw(){needsFrame=true;}
function worldToScreen(n){return{x:n.x*view.scale+view.x,y:n.y*view.scale+view.y};}
function screenToWorld(x,y){return{x:(x-view.x)/view.scale,y:(y-view.y)/view.scale};}
function fitView(){const r=canvas.getBoundingClientRect(),xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y);const minX=Math.min(...xs)-80,maxX=Math.max(...xs)+80,minY=Math.min(...ys)-80,maxY=Math.max(...ys)+80;view.scale=Math.min(r.width/(maxX-minX),r.height/(maxY-minY));view.x=r.width/2-(minX+maxX)/2*view.scale;view.y=r.height/2-(minY+maxY)/2*view.scale;requestDraw();}
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);fitView();}
function zoomAt(factor,sx=canvas.clientWidth/2,sy=canvas.clientHeight/2){const before=screenToWorld(sx,sy);view.scale=Math.max(.12,Math.min(5,view.scale*factor));view.x=sx-before.x*view.scale;view.y=sy-before.y*view.scale;requestDraw();}
function answerLimit(){const first=answers.findIndex(v=>v===null);return first<0?questions.length-1:first;}
function questionImpact(n,q,value){return Object.entries(q.weights).reduce((s,[k,w])=>s+value*w*(n.traits[k]||0),0);}
function scoreGraph({highlight=null}={}){const used=answers.map((value,i)=>value===null?null:{value,q:questions[i]}).filter(Boolean);nodes.forEach(n=>{let total=0,mag=0;used.forEach(({value,q})=>Object.entries(q.weights).forEach(([k,w])=>{const t=n.traits[k]||0;total+=value*w*t;mag+=Math.abs(w)*Math.max(.15,t);}));n.score=mag?Math.max(-1,Math.min(1,total/mag)):0;});const sorted=[...nodes].sort((a,b)=>a.score-b.score),d=Math.max(1,sorted.length-1);sorted.forEach((n,i)=>n.visualRank=i/d);if(highlight!==null&&answers[highlight]!==null)highlightImpact(highlight);requestDraw();}
function highlightImpact(i){const value=answers[i];if(value===null)return;const ranked=nodes.map(n=>({n,a:Math.abs(questionImpact(n,questions[i],value))})).sort((a,b)=>b.a-a.a);const threshold=ranked[Math.min(55,ranked.length-1)].a,now=performance.now();ranked.forEach(x=>{if(x.a>=threshold&&x.a>.01)x.n.changedAt=now;});requestDraw();}
function nodeColor(n){if(!answers.some(v=>v!==null))return'hsl(215 6% 47%)';const winner=Math.max(0,(n.visualRank-.42)/.58),loser=Math.max(0,(.42-n.visualRank)/.42);return`hsl(${n.sector.hue} ${5+Math.pow(winner,.62)*94}% ${43+Math.pow(winner,.8)*18-Math.pow(loser,.75)*19}%)`;}
function draw(t){requestAnimationFrame(draw);if(!needsFrame&&!nodes.some(n=>t-n.changedAt<HIGHLIGHT_MS))return;needsFrame=false;const r=canvas.getBoundingClientRect();ctx.fillStyle='#10151f';ctx.fillRect(0,0,r.width,r.height);edges.forEach(([a,b])=>{const p=worldToScreen(a),q=worldToScreen(b);ctx.strokeStyle='rgba(151,164,184,.13)';ctx.lineWidth=a.level===0?1.4:1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();});nodes.forEach(n=>{const p=worldToScreen(n),min=n.level===0?13:n.level===1?8:4,rr=Math.max(min,n.radius*view.scale),age=t-n.changedAt;if(age<HIGHLIGHT_MS){const u=age/HIGHLIGHT_MS,alpha=Math.pow(1-u,.6);ctx.strokeStyle=`rgba(255,255,255,${alpha*.95})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,rr+7+Math.sin(Math.min(1,u*1.5)*Math.PI)*12,0,Math.PI*2);ctx.stroke();needsFrame=true;}ctx.fillStyle=nodeColor(n);ctx.beginPath();ctx.arc(p.x,p.y,rr,0,Math.PI*2);ctx.fill();ctx.strokeStyle=n===hoveredNode?'white':'rgba(255,255,255,.22)';ctx.lineWidth=n===hoveredNode?2:1;ctx.stroke();const show=n.level===0||(n.level===1&&view.scale>.3)||(n.level===2&&view.scale>.72)||n===hoveredNode;if(show){ctx.font=`${n.level===0?700:500} ${n.level===0?12:n.level===1?10:9}px system-ui`;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle=n.level===0?'#f7f8fb':'rgba(238,242,248,.76)';ctx.fillText(n.label,p.x,p.y+rr+4);}});}
function pointerXY(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function resetGesture(){const ps=[...pointers.values()];if(ps.length===1)gesture={type:'pan',last:ps[0]};else if(ps.length===2){const [a,b]=ps,mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},dist=Math.hypot(a.x-b.x,a.y-b.y);gesture={type:'pinch',mid,dist,world:screenToWorld(mid.x,mid.y),startScale:view.scale};}else gesture=null;}
canvas.addEventListener('pointerdown',e=>{const p=pointerXY(e);pointers.set(e.pointerId,p);canvas.setPointerCapture(e.pointerId);resetGesture();canvas.classList.add('dragging');const now=performance.now();if(pointers.size===1&&now-lastTap<300){zoomAt(1.65,p.x,p.y);lastTap=0;}else lastTap=now;});
canvas.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId)){pointers.set(e.pointerId,pointerXY(e));if(pointers.size===1&&gesture?.type==='pan'){const p=[...pointers.values()][0];view.x+=p.x-gesture.last.x;view.y+=p.y-gesture.last.y;gesture.last=p;requestDraw();return;}if(pointers.size===2&&gesture?.type==='pinch'){const [a,b]=[...pointers.values()],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},dist=Math.hypot(a.x-b.x,a.y-b.y);view.scale=Math.max(.12,Math.min(5,gesture.startScale*dist/Math.max(1,gesture.dist)));view.x=mid.x-gesture.world.x*view.scale;view.y=mid.y-gesture.world.y*view.scale;requestDraw();return;}}if(e.pointerType==='mouse'&&!pointers.size){const p=pointerXY(e);hoveredNode=[...nodes].reverse().find(n=>{const s=worldToScreen(n),rr=Math.max(n.level===0?13:n.level===1?8:5,n.radius*view.scale)+5;return(p.x-s.x)**2+(p.y-s.y)**2<rr*rr;})||null;if(hoveredNode){const s=worldToScreen(hoveredNode),r=canvas.getBoundingClientRect();tooltip.hidden=false;tooltip.style.left=`${Math.min(r.width-245,s.x+12)}px`;tooltip.style.top=`${Math.max(8,s.y-18)}px`;tooltip.innerHTML=`<strong>${hoveredNode.label}</strong><small>${hoveredNode.sector.label} · relative match ${Math.round(hoveredNode.visualRank*100)}%</small>`;}else tooltip.hidden=true;requestDraw();}});
function endPointer(e){pointers.delete(e.pointerId);if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);resetGesture();if(!pointers.size)canvas.classList.remove('dragging');}
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);canvas.addEventListener('wheel',e=>{e.preventDefault();zoomAt(Math.exp(-e.deltaY*.0012),e.offsetX,e.offsetY);},{passive:false});
document.getElementById('zoomIn').onclick=()=>zoomAt(1.25);document.getElementById('zoomOut').onclick=()=>zoomAt(.8);document.getElementById('fitView').onclick=fitView;
function renderQuestion({replay=false}={}){const q=questions[currentQuestion];document.getElementById('questionIndex').textContent=`Question ${currentQuestion+1} · ${dimensions[q.dimension]}`;document.getElementById('questionText').textContent=q.text;const holder=document.getElementById('answerButtons');holder.replaceChildren();choices.forEach(([label,value])=>{const b=document.createElement('button');b.className='answer-button'+(answers[currentQuestion]===value?' selected':'');b.textContent=label;b.onclick=()=>answer(value);holder.appendChild(b);});updateProgress();if(replay&&answers[currentQuestion]!==null)highlightImpact(currentQuestion);}
function answer(value){clearTimeout(advanceTimer);answers[currentQuestion]=value;scoreGraph({highlight:currentQuestion});renderQuestion();advanceTimer=setTimeout(()=>{if(currentQuestion<questions.length-1){currentQuestion=Math.min(currentQuestion+1,answerLimit());renderQuestion();}},190);}
function updateProgress(){const done=answers.filter(v=>v!==null).length,limit=answerLimit();document.getElementById('progressLabel').textContent=`${done} of ${questions.length} answered`;document.getElementById('progressPercent').textContent=`Viewing ${currentQuestion+1}`;slider.max=questions.length;slider.value=currentQuestion+1;slider.style.setProperty('--progress',`${currentQuestion/(questions.length-1)*100}%`);slider.setAttribute('aria-valuemax',String(limit+1));}
slider.addEventListener('input',()=>{clearTimeout(advanceTimer);const requested=Number(slider.value)-1,current=Math.min(requested,answerLimit());currentQuestion=current;slider.value=current+1;renderQuestion({replay:true});});
window.addEventListener('resize',resize);renderQuestion();resize();requestAnimationFrame(draw);
