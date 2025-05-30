// Phase 17: Language Detector
function detectLanguage(code) {
  if (code.includes("function") || code.includes("const")) return "JavaScript";
  if (code.includes("def")) return "Python";
  return "Unknown";
}
