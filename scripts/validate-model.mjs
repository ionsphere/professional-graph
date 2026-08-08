import fs from 'node:fs';
import vm from 'node:vm';

const modelCode = fs.readFileSync(new URL('../model.js', import.meta.url), 'utf8');
const idCode = fs.readFileSync(new URL('../question-ids.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(modelCode, sandbox);
sandbox.ProfessionalModel = sandbox.window.ProfessionalModel;
vm.runInNewContext(idCode, sandbox);
const model = sandbox.window.ProfessionalModel;
const errors = [];
const warnings = [];

if (model.questions.length !== 100) errors.push(`Expected 100 questions; found ${model.questions.length}`);

const questionIds = new Set();
for (const question of model.questions) {
  if (!question.id?.startsWith('pgq.')) errors.push(`Question lacks stable global id: ${question.text}`);
  if (questionIds.has(question.id)) errors.push(`Duplicate question id: ${question.id}`);
  questionIds.add(question.id);
  if (!question.text || question.text.length < 25) warnings.push(`Question ${question.id} is unusually short`);
  if (!Object.keys(question.weights).length) errors.push(`Question ${question.id} has no weights`);
  for (const dimension of Object.keys(question.weights)) {
    if (!model.dimensions[dimension]) errors.push(`Question ${question.id} uses unknown dimension ${dimension}`);
  }
}

const professions = [];
for (const sector of model.sectors) {
  if (!sector.groups?.length) errors.push(`Sector ${sector.id} has no groups`);
  for (const [group, jobs, traits] of sector.groups) {
    if (!jobs.length) errors.push(`Group ${group} has no professions`);
    jobs.forEach(job => professions.push({ job, traits: { ...sector.traits, ...traits } }));
  }
}

for (const dimension of Object.keys(model.dimensions)) {
  const questionCount = model.questions.filter(question => question.weights[dimension]).length;
  const professionCount = professions.filter(profession => (profession.traits[dimension] || 0) > 0).length;
  if (questionCount < 3) warnings.push(`${dimension} has only ${questionCount} questions`);
  if (professionCount < 5) warnings.push(`${dimension} reaches only ${professionCount} professions`);
}

const normalized = text => text.toLowerCase().replace(/[^a-z]/g, '');
const questionTexts = new Map();
for (const question of model.questions) {
  const key = normalized(question.text);
  if (questionTexts.has(key)) errors.push(`Duplicate question wording: ${question.id}`);
  questionTexts.set(key, question.id);
}

console.log(`Sectors: ${model.sectors.length}`);
console.log(`Profession leaves: ${professions.length}`);
console.log(`Questions: ${model.questions.length}`);
console.log(`Dimensions: ${Object.keys(model.dimensions).length}`);
console.log(`Stable question IDs: ${questionIds.size}`);
warnings.forEach(warning => console.warn('WARN', warning));
errors.forEach(error => console.error('ERROR', error));
if (errors.length) process.exit(1);
console.log('Model structural validation passed.');
