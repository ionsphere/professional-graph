const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const tooltip = document.getElementById('nodeTooltip');

const clusters = [
  { id: 'technology', label: 'Technology', hue: 210, jobs: ['Software Engineer','Data Scientist','ML Engineer','Cybersecurity Analyst','Product Manager','UX Designer','Cloud Engineer','Game Developer','Robotics Engineer','QA Engineer'] },
  { id: 'health', label: 'Health', hue: 350, jobs: ['Physician','Registered Nurse','Physical Therapist','Psychologist','Dentist','Pharmacist','Paramedic','Medical Researcher','Dietitian','Radiology Technologist'] },
  { id: 'science', label: 'Science', hue: 275, jobs: ['Biologist','Chemist','Physicist','Astronomer','Environmental Scientist','Geologist','Statistician','Lab Technician','Epidemiologist','Materials Scientist'] },
  { id: 'creative', label: 'Creative', hue: 32, jobs: ['Graphic Designer','Writer','Musician','Film Director','Photographer','Architect','Animator','Fashion Designer','Industrial Designer','Actor'] },
  { id: 'education', label: 'Education', hue: 48, jobs: ['Primary Teacher','Professor','Special Education Teacher','School Counselor','Corporate Trainer','Librarian','Instructional Designer','Tutor','Principal','Museum Educator'] },
  { id: 'business', label: 'Business', hue: 150, jobs: ['Entrepreneur','Sales Manager','Financial Analyst','Accountant','Marketing Manager','Operations Manager','Consultant','Recruiter','Real Estate Agent','Project Manager'] },
  { id: 'public', label: 'Public Service', hue: 190, jobs: ['Lawyer','Judge','Police Officer','Firefighter','Social Worker','Urban Planner','Diplomat','Policy Analyst','Military Officer','Emergency Manager'] },
  { id: 'trades', label: 'Trades', hue: 12, jobs: ['Electrician','Plumber','Carpenter','Welder','HVAC Technician','Machinist','Auto Mechanic','Construction Manager','Solar Installer','Building Inspector'] },
  { id: 'transport', label: 'Transport', hue: 95, jobs: ['Truck Driver','Taxi Driver','Ride-share Driver','Bus Driver','Train Operator','Pilot','Ship Captain','Delivery Driver','Logistics Planner','Air Traffic Controller'] },
  { id: 'service', label: 'Service', hue: 320, jobs: ['Chef','Hotel Manager','Barber','Fitness Trainer','Childcare Worker','Event Planner','Tour Guide','Customer Support Specialist','Security Guard','Veterinary Assistant'] }
];

const traitKeys = ['analysis','building','people','care','creativity','leadership','order','outdoors','risk','movement'];
const seeded = (text) => {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 13), 1274126177)) >>> 0) / 4294967295;
};

const clusterTraits = {
  technology: { analysis:.9, building:.8, creativity:.5, order:.5 },
  health: { care:1, people:.8, analysis:.6, risk:.4 },
  science: { analysis:1, outdoors:.35, order:.55 },
  creative: { creativity:1, people:.35, building:.3 },
  education: { people:.9, care:.7, creativity:.5, leadership:.45 },
  business: { leadership:.9, people:.75, order:.65, analysis:.45 },
  public: { people:.7, care:.55, leadership:.65, risk:.55, order:.6 },
  trades: { building:1, movement:.75, outdoors:.45, order:.5 },
  transport: { movement:1, risk:.55, order:.65, outdoors:.4 },
  service: { people:.85, care:.55, movement:.55, creativity:.35 }
};

const nodes = [];
const edges = [];
clusters.forEach((cluster, ci) => {
  const angle = -Math.PI / 2 + (ci / clusters.length) * Math.PI * 2;
  const cx = Math.cos(angle) * 560;
  const cy = Math.sin(angle) * 390;
  const root = { id: cluster.id, label: cluster.label, cluster, level: 0, x: cx, y: cy, radius: 34, score: 0, changedAt: 0, traits: clusterTraits[cluster.id] };
  nodes.push(root);
  cluster.jobs.forEach((job, ji) => {
    const localAngle = angle + (ji - 4.5) * 0.105;
    const distance = 155 + (ji % 2) * 42;
    const random = seeded(job);
    const traits = {};
    traitKeys.forEach(key => traits[key] = Math.min(1, (clusterTraits[cluster.id][key] || 0) + random() * .24));
    const node = {
      id: `${cluster.id}-${ji}`,
      label: job,
      cluster,
      level: 1,
      x: cx + Math.cos(localAngle) * distance,
      y: cy + Math.sin(localAngle) * distance,
      radius: 14,
      score: 0,
      changedAt: 0,
      traits
    };
    nodes.push(node);
    edges.push([root, node]);
  });
});

const questions = [
  { text: 'I enjoy finding why a complex system fails and tracing the problem to its source.', weights: { analysis:1, order:.25, building:.3 } },
  { text: 'I would enjoy making or repairing something tangible with tools.', weights: { building:1, movement:.5, outdoors:.2 } },
  { text: 'Helping someone through illness, fear, or a difficult personal situation feels meaningful to me.', weights: { care:1, people:.75 } },
  { text: 'I like inventing visual, musical, written, or spatial ideas that did not exist before.', weights: { creativity:1, building:.2 } },
  { text: 'I enjoy persuading people, negotiating, and taking responsibility for a group result.', weights: { leadership:1, people:.75, risk:.3 } },
  { text: 'I prefer work with clear procedures, records, schedules, and measurable completion.', weights: { order:1, analysis:.25 } },
  { text: 'I would rather move through different places than spend most of the day at one desk.', weights: { movement:1, outdoors:.55 } },
  { text: 'I am comfortable making consequential decisions quickly when information is incomplete.', weights: { risk:1, leadership:.5, analysis:.4 } },
  { text: 'Explaining difficult ideas until another person understands them is satisfying.', weights: { people:.8, care:.45, creativity:.35 } },
  { text: 'I enjoy studying evidence, patterns, or data even when there is no immediate practical result.', weights: { analysis:1, order:.35 } },
  { text: 'I would enjoy coordinating many people, deadlines, and resources toward one outcome.', weights: { leadership:.85, order:.85, people:.45 } },
  { text: 'Working outside or around machines, vehicles, buildings, or natural environments appeals to me.', weights: { outdoors:1, movement:.65, building:.55 } }
];

const choices = [
  { label: 'Strongly dislike', value: -1 },
  { label: 'Dislike', value: -.5 },
  { label: 'Unsure', value: 0 },
  { label: 'Like', value: .5 },
  { label: 'Strongly like', value: 1 }
];

let answers = Array(questions.length).fill(null);
let currentQuestion = 0;
let view = { x: 0, y: 0, scale: 1 };
let dragging = false;
let lastPointer = null;
let hoveredNode = null;
let needsFrame = true;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fitView();
}

function fitView() {
  const rect = canvas.getBoundingClientRect();
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const minX = Math.min(...xs) - 70, maxX = Math.max(...xs) + 70;
  const minY = Math.min(...ys) - 70, maxY = Math.max(...ys) + 70;
  view.scale = Math.min(rect.width / (maxX - minX), rect.height / (maxY - minY));
  view.x = rect.width / 2 - ((minX + maxX) / 2) * view.scale;
  view.y = rect.height / 2 - ((minY + maxY) / 2) * view.scale;
  requestDraw();
}

function worldToScreen(node) { return { x: node.x * view.scale + view.x, y: node.y * view.scale + view.y }; }
function screenToWorld(x, y) { return { x: (x - view.x) / view.scale, y: (y - view.y) / view.scale }; }
function requestDraw() { needsFrame = true; }

function scoreGraph() {
  const answered = answers.map((value, i) => value === null ? null : { value, question: questions[i] }).filter(Boolean);
  const now = performance.now();
  nodes.forEach(node => {
    const previous = node.score;
    if (!answered.length) node.score = 0;
    else {
      let weighted = 0, magnitude = 0;
      answered.forEach(({ value, question }) => {
        Object.entries(question.weights).forEach(([trait, weight]) => {
          weighted += value * weight * (node.traits[trait] || 0);
          magnitude += Math.abs(weight);
        });
      });
      node.score = magnitude ? Math.max(-1, Math.min(1, weighted / (magnitude * .68))) : 0;
    }
    if (Math.abs(node.score - previous) > .055) node.changedAt = now;
  });
  requestDraw();
}

function nodeColor(node) {
  const positive = Math.max(0, node.score);
  const negative = Math.max(0, -node.score);
  const saturation = 8 + positive * 78;
  const lightness = 47 + positive * 10 - negative * 17;
  return `hsl(${node.cluster.hue} ${saturation}% ${lightness}%)`;
}

function draw(timestamp) {
  requestAnimationFrame(draw);
  if (!needsFrame && !nodes.some(n => timestamp - n.changedAt < 900)) return;
  needsFrame = false;
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = '#10151f';
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.lineWidth = 1;
  edges.forEach(([a,b]) => {
    const pa = worldToScreen(a), pb = worldToScreen(b);
    ctx.strokeStyle = 'rgba(151,164,184,.16)';
    ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke();
  });

  nodes.forEach(node => {
    const p = worldToScreen(node);
    const r = Math.max(node.level === 0 ? 15 : 5, node.radius * view.scale);
    const age = timestamp - node.changedAt;
    if (age < 900) {
      const pulse = 1 - age / 900;
      ctx.strokeStyle = `rgba(255,255,255,${pulse * .85})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x,p.y,r + 7 + (1-pulse)*15,0,Math.PI*2); ctx.stroke();
      needsFrame = true;
    }
    ctx.fillStyle = nodeColor(node);
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = node === hoveredNode ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.24)';
    ctx.lineWidth = node === hoveredNode ? 2 : 1;
    ctx.stroke();

    const showLabel = node.level === 0 || view.scale > .68 || node === hoveredNode;
    if (showLabel) {
      ctx.font = `${node.level === 0 ? 700 : 500} ${node.level === 0 ? 13 : 10}px Inter, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = node.level === 0 ? '#f5f7fb' : 'rgba(235,240,248,.78)';
      ctx.fillText(node.label, p.x, p.y + r + 5);
    }
  });
}

function zoomAt(factor, sx = canvas.clientWidth/2, sy = canvas.clientHeight/2) {
  const before = screenToWorld(sx, sy);
  view.scale = Math.max(.22, Math.min(3.2, view.scale * factor));
  view.x = sx - before.x * view.scale;
  view.y = sy - before.y * view.scale;
  requestDraw();
}

canvas.addEventListener('wheel', e => { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * .0012), e.offsetX, e.offsetY); }, { passive:false });
canvas.addEventListener('pointerdown', e => { dragging = true; lastPointer = {x:e.clientX,y:e.clientY}; canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging'); });
canvas.addEventListener('pointermove', e => {
  const rect = canvas.getBoundingClientRect();
  if (dragging) {
    view.x += e.clientX-lastPointer.x; view.y += e.clientY-lastPointer.y;
    lastPointer = {x:e.clientX,y:e.clientY}; requestDraw(); return;
  }
  const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  hoveredNode = [...nodes].reverse().find(node => {
    const p=worldToScreen(node); const r=Math.max(node.level===0?15:6,node.radius*view.scale)+6;
    return (mx-p.x)**2+(my-p.y)**2 <= r*r;
  }) || null;
  if (hoveredNode) {
    const p=worldToScreen(hoveredNode);
    tooltip.hidden=false; tooltip.style.left=`${Math.min(rect.width-245,p.x+15)}px`; tooltip.style.top=`${Math.max(10,p.y-18)}px`;
    tooltip.innerHTML=`<strong>${hoveredNode.label}</strong><small>${hoveredNode.cluster.label} · match ${Math.round(Math.max(0,hoveredNode.score)*100)}%</small>`;
  } else tooltip.hidden=true;
  requestDraw();
});
canvas.addEventListener('pointerup', e => { dragging=false; canvas.releasePointerCapture(e.pointerId); canvas.classList.remove('dragging'); });
canvas.addEventListener('pointercancel', () => { dragging=false; canvas.classList.remove('dragging'); });

document.getElementById('zoomIn').onclick=()=>zoomAt(1.25);
document.getElementById('zoomOut').onclick=()=>zoomAt(.8);
document.getElementById('fitView').onclick=fitView;

function renderQuestion() {
  document.getElementById('questionIndex').textContent=`Question ${currentQuestion+1}`;
  document.getElementById('questionText').textContent=questions[currentQuestion].text;
  const holder=document.getElementById('answerButtons'); holder.replaceChildren();
  choices.forEach(choice => {
    const button=document.createElement('button');
    button.className='answer-button'+(answers[currentQuestion]===choice.value?' selected':'');
    button.textContent=choice.label;
    button.onclick=()=>answer(choice.value);
    holder.appendChild(button);
  });
  updateProgress();
}

function answer(value) {
  answers[currentQuestion]=value;
  scoreGraph();
  updateProgress();
  setTimeout(()=>{
    if (currentQuestion < questions.length-1) currentQuestion++;
    else {
      const next=answers.findIndex(v=>v===null);
      if (next>=0) currentQuestion=next;
    }
    renderQuestion();
  },180);
}

function updateProgress() {
  const done=answers.filter(v=>v!==null).length;
  const percent=Math.round(done/questions.length*100);
  document.getElementById('progressLabel').textContent=`${done} of ${questions.length} answered`;
  document.getElementById('progressPercent').textContent=`${percent}%`;
  document.getElementById('progressFill').style.width=`${percent}%`;
}

window.addEventListener('resize', resize);
renderQuestion(); resize(); requestAnimationFrame(draw);
