/**
 * Patch SightLayer class to allow GM to see through the FOW and to see all tokens on the canvas
 */
function patchSightLayerClass() {
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
}

if (patchedSightLayerClass == undefined) {
  patchSightLayerClass();
  var patchedSightLayerClass = true;
}
