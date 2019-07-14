function patchClass(klass, func, line_number, line, new_line) {
    let funcStr = func.toString()
    let lines = funcStr.split("\n")
    if (lines[line_number].trim() == line.trim()) {
        lines[line_number] = lines[line_number].replace(line, new_line);
    classStr = klass.toString()
    fixedClass = classStr.replace(funcStr, lines.join("\n"))
    return  eval ("(" + fixedClass + ")")
    } else {
        console.log("Function has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
    }
}

function patchSightLayerClass() {
    oldDraw = SightLayer.prototype.draw.toString()
    oldRestrictVisibility = SightLayer.prototype.restrictVisibility.toString()
    newClass = patchClass(SightLayer, SightLayer.prototype.draw, 8,
      "unexplored: 1.0,",
      "unexplored: game.user.isGM ? ( this.fogExploration ? 0.5 : 0.0 ) : 1.0,");
    if (!newClass) return;
    newClass = patchClass(newClass, newClass.prototype.draw, 9,
      "dark: this.fogExploration ? 0.75 : 1.0,",
      "dark: ( this.fogExploration || game.user.isGM ) ? 0.7 : 1.0,");
    if (!newClass) return;
    newClass = patchClass(newClass, SightLayer.prototype.restrictVisibility, 2,
      "// Tokens",
      `if ( !game.user.isGM )
       // Tokens`);
    if (!newClass) return;
    SightLayer = newClass
//    console.log("Changed function : \n", oldDraw, "\nInto : \n", SightLayer.prototype.draw.toString())
//    console.log("Changed function : \n", oldRestrictVisibility, "\nInto : \n", SightLayer.prototype.restrictVisibility.toString())
}

patchSightLayerClass()

function patchDice5eClass() {
    oldRoll = Dice5e.d20Roll.toString()
    newClass = patchClass(Dice5e, Dice5e.d20Roll, 30,
      `parts = ["1d20"].concat(parts);`,
      `parts = title.includes("Attack Roll") ? ["1d20"].concat(parts) : ["2d10+1-1d2"].concat(parts);`);
    if (!newClass) return;
    Dice5e = newClass
//    console.log("Changed function : \n", oldRoll, "\nInto : \n", Dice5e.d20Roll.toString())
}

patchDice5eClass()

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

patchDieClass()

function patchRollClass() {
    newClass = patchClass(Roll, Roll.prototype.constructor, 25,
      `reroll: /r(<=|>=|<|>)?([0-9]+)?/,`,
      `reroll: /r(<=|>=|<|>)?([0-9]+)?(?:=([0-9]+))?/,`);
    if (!newClass) return;
    newClass = patchClass(newClass, Roll.prototype._rerollDie, 15,
      `die.reroll(target);`,
      `die.reroll(target, rr[3]);`);
    if (!newClass) return;
    Roll = newClass
}

patchRollClass()

function patchSoundsLayerClass() {
    newClass = patchClass(SoundsLayer, SoundsLayer.prototype.update, 34,
      `if ( obj[p].volume === 0 || obj[p].volume < vol ) obj[p].volume = vol;`,
      `if ( obj[p].volume === 0 || obj[p].volume < vol ) obj[p].volume = vol * sound.data.volume;`);
    if (!newClass) return;
    SoundsLayer = newClass
}

patchSoundsLayerClass()


