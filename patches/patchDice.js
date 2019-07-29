/**
 * Patch Dice5e class to use the average of 2d20 rolls for normal checks and saves
 * (average = ceil(1d20/2) + floor(1d20/2); 2d10+1-1d2 is statistically the same).
 *
 * Patch Die and Roll classes to allow limit on number of dice to reroll (e.g.,
 * a halfing rolling an attack with advantage would use '2d20r1=1kh' to roll
 * two d20, reroll on a 1, but only on one die, then keep the highest roll).
 */
function patchDice5eClass() {
    oldRoll = Dice5e.d20Roll.toString()
    newClass = patchClass(Dice5e, Dice5e.d20Roll, 30,
      `parts = ["1d20"].concat(parts);`,
      `parts = title.includes("Attack Roll") ? ["1d20"].concat(parts) : ["2d10+1-1d2"].concat(parts);`);
    if (!newClass) return;
    Dice5e = newClass
//    console.log("Changed function : \n", oldRoll, "\nInto : \n", Dice5e.d20Roll.toString())
}

if (patchedDice5eClass == undefined) {
  patchDice5eClass();
  var patchedDice5eClass = true;
}

function patchDieClass() {
  newClass = patchClass(Die, Die.prototype.reroll, 0,
    `reroll(targets) {`,
    `reroll(targets, maxrerolls) {`);
  if (!newClass) return;
  newClass = patchClass(newClass, newClass.prototype.reroll, 3,
    `// Flag dice which are eligible for re-roll`,
    `maxrerolls = maxrerolls || 999;
    // Flag dice which are eligible for re-roll`);
  if (!newClass) return;
  newClass = patchClass(newClass, newClass.prototype.reroll, 7,
    `else if ( targets.includes(r.roll) ) return r.rerolled = true;`,
    `else if ( targets.includes(r.roll) && maxrerolls > 0 ) { maxrerolls--; return r.rerolled = true; }`);
  if (!newClass) return;
  Die = newClass
  CONFIG.diceTypes[CONFIG.diceTypes.findIndex(d => d.name === "Die")] = Die
}

if (patchedDieClass == undefined) {
  patchDieClass();
  var patchedDieClass = true;
}

function patchRollClass() {
    newClass = patchClass(Roll, Roll.prototype.constructor, 38,
      `reroll: /r(<=|>=|<|>)?([0-9]+)?/,`,
      `reroll: /r(<=|>=|<|>)?([0-9]+)?(?:=([0-9]+))?/,`);
    if (!newClass) return;
    newClass = patchClass(newClass, Roll.prototype._rerollDie, 15,
      `die.reroll(target);`,
      `die.reroll(target, rr[3]);`);
    if (!newClass) return;
    Roll = newClass
}

if (patchedRollClass == undefined) {
  patchRollClass();
  var patchedRollClass = true;
}
