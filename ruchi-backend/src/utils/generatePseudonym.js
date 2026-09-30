const ADJECTIVES = [
  "Zen", "Pixel", "Moon", "Kairo", "Luna", "Nova", "Echo", "Rex",
  "Vibe", "Sky", "Blaze", "Wren", "Onyx", "Fable", "Sage", "Cove",
];

function generatePseudonym() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const num = Math.floor(Math.random() * 900 + 100); // 100-999
  return `${adjective}#${num}`;
}

module.exports = { generatePseudonym };
