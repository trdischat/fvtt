# FVTT Patches
Module to apply the following patches to Foundry VTT:

## patchFog
* Allow GM to see through the FOW.
* Allow the GM to see all tokens on the canvas.

## patchSound
* Apply volume easing to the selected volume level of a sound effect.
* Only display playlists to the GM.
* New parameters for sounds in playlists allow for random delay between repeated plays of the sound.
* While not part of the patch, the module also includes CSS styles to add color to Play and Stop buttons in playlists.

## patchDice
* Limit number of dice to reroll (used for Halfling Lucky trait in the dnd5e system).
* Use the average of 2d20 rolls for normal checks and saves (personal house rule).

Most of the patches rely on the **patchClass** utility function.

Effect of **patchFog**: compare GM view on the left to Player view on the right

![Illustrate effect of lessfog module](lessfog.jpg "Compare GM view to Player view with lessfog enabled")

# Installation
Extract the patches.zip file to the public/modules directory. As DM go to the `Manage Modules` options menu in your World ('?' icon on the side bar) then enable the `System Patches` module.  If not all patches are desired, edit modules.json to delete references to unwanted patches.  Do not delete the reference to `patchClass.js`.  This utility function is used to apply the patches and is required.

# License
This Foundry VTT module, written by trdischat with major assistance from KaKaRoTo, is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
