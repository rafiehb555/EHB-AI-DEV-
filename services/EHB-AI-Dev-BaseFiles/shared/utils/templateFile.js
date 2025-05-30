// 🛠️ Template fallback utility

function placeholderTemplate(name) {
  return `// Auto-generated file: ${name}\nmodule.exports = () => {\n  return 'This is a placeholder for missing ${name}';\n};`;
}

module.exports = placeholderTemplate;
