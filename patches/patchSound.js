/**
 * Patch SoundsLayer class to apply volume easing to selected volume level, not max volume level
 */
function patchSoundsLayerClass() {
    newClass = patchClass(SoundsLayer, SoundsLayer.prototype.update, 34,
      `if ( obj[p].volume === 0 || obj[p].volume < vol ) obj[p].volume = vol;`,
      `if ( obj[p].volume === 0 || obj[p].volume < vol ) obj[p].volume = vol * sound.data.volume;`);
    if (!newClass) return;
    SoundsLayer = newClass
}

if (patchedSoundsLayerClass == undefined) {
  patchSoundsLayerClass();
  var patchedSoundsLayerClass = true;
}
