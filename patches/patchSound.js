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

/**
 * Patch PlaylistDirectory class to display playlists only to the GM
 */
function patchPlaylistDirectoryClass() {
    newClass = patchClass(PlaylistDirectory, PlaylistDirectory.prototype.getData, 4,
      `let visible = game.playlists.entities.filter(p => isGM || p.sounds.some(s => s.playing));`,
      `let visible = game.playlists.entities.filter(p => isGM);`);
    if (!newClass) return;
    PlaylistDirectory = newClass
}

if (patchedPlaylistDirectoryClass == undefined) {
  patchPlaylistDirectoryClass();
  var patchedPlaylistDirectoryClass = true;
}
