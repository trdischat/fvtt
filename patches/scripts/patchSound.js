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

/**
 * Patch Playlist class to implement random loop delays and randon volume adjustments
 */
function patchPlaylistClass() {
    newClass = patchClass(Playlist, Playlist.prototype._onEnd, 5,
      `if ( sound.repeat ) return;`,
      `if ( sound.repeat ) {
      if ( sound.flags.mindelay === undefined || sound.flags.maxdelay === undefined) return;
      else {
        let p = this;
        p.updateSound({id: sound.id, playing: false});
        let tMin = sound.flags.mindelay;
        let tMax = sound.flags.maxdelay;
        let tDelay = Math.floor( 1000 * ( tMin + ( Math.random() * (tMax-tMin) ) ) );
        setTimeout( function() { p.updateSound({id: sound.id, playing: true}); }, tDelay);
        return;}}`);
    if (!newClass) return;
    newClass = patchClass(newClass, Playlist.prototype.playSound, 12,
      `let vol = sound.volume * game.settings.get("core", "globalPlaylistVolume");`,
      `let minVol = ( sound.flags.minvolume === undefined ) ? 1.0 : parseFloat(sound.flags.minvolume);
      let volAdj = ( minVol === 1.0 ) ? 1.0 : Math.pow( minVol + ( Math.random() * ( 1 - minVol )), 2);
      let vol = sound.volume * game.settings.get("core", "globalPlaylistVolume") * volAdj;`);
    if (!newClass) return;
    Playlist = newClass
}

if (patchedPlaylistClass == undefined) {
  patchPlaylistClass();
  var patchedPlaylistClass = true;
}

/**
 * Use custom template for PlaylistSoundConfig to configure random delays and random volume adjustments 
 */
replaceDefaultOptions = function(class_) {
  defaultOptionsProperty = Object.getOwnPropertyDescriptor(class_, "defaultOptions");
  if (defaultOptionsProperty == undefined) {
    defaultOptionsProperty = Object.getOwnPropertyDescriptor(FormApplication, "defaultOptions");
  }
  Object.defineProperty(class_, '_sound_config_defaultOptions', defaultOptionsProperty);
  Object.defineProperty(class_, 'defaultOptions', {
    get: function () {
      def_options = class_._sound_config_defaultOptions;
      def_options.template = def_options.template.replace("templates/playlist/", "public/modules/patches/templates/")
      return def_options
    }
  });
};

replaceDefaultOptions(PlaylistSoundConfig);
