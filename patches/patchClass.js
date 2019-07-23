/**
 * Utility function used by patch functions to alter specific lines in a class
 * @param {Class} klass           Class to be patched
 * @param {Function} func         Function in the class to be patched
 * @param {Number} line_number    Line within the function to be patched
 * @param {String} line           Existing text of line to be patched
 * @param {String} new_line       Replacement text for line to be patched
 * @returns {Class}              Revised class
 */
function patchClass(klass, func, line_number, line, new_line) {
  let funcStr = func.toString()
  let lines = funcStr.split("\n")
  if (lines[line_number].trim() == line.trim()) {
    lines[line_number] = lines[line_number].replace(line, new_line);
    classStr = klass.toString()
    fixedClass = classStr.replace(funcStr, lines.join("\n"))
    return Function('"use strict";return (' + fixedClass + ')')();
  }
  else {
    console.log("Function has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
  }
}
