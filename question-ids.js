(() => {
  // Question IDs are intentionally derived from immutable question content rather than list position.
  // Inserting or reordering questions therefore never shifts historical answers. Once published,
  // changing a question's wording should be treated as a new question unless an explicit legacy ID is retained.
  const hash = text => {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36).padStart(7, '0');
  };
  ProfessionalModel.questions.forEach(question => {
    question.id = `pgq.${question.dimension}.${hash(question.text)}`;
  });
})();