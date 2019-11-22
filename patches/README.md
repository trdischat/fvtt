# FVTT Patches
Module to apply the following patches to Foundry VTT:

## patchSound
* Only display playlists to the GM.
* New parameters for sounds in playlists allow for random delay between repeated plays of the sound.
* While not part of the patch, the module also includes CSS styles to add color to Play and Stop buttons in playlists.

## patchDice
* Limit number of dice to reroll (used for Halfling Lucky trait in the dnd5e system).
* Use the average of 2d20 rolls for normal checks and saves (personal house rule).

Most of the patches rely on the **patchClass** utility function.

As of FVTT version 0.3.4, the **patchFog** patch is no longer necessary, and therefore has been removed from the module.
As of FVTT version 0.3.9, volume easing has been fixed, and therefore the fix has been removed from the **patchSound** patch.

# Installation
Extract the patches.zip file to the public/modules directory. As DM go to the `Manage Modules` options menu in your World ('?' icon on the side bar) then enable the `System Patches` module.  If not all patches are desired, edit modules.json to delete references to unwanted patches.  Do not delete the reference to `patchClass.js`.  This utility function is used to apply the patches and is required.

# License
This Foundry VTT module, written by trdischat with major assistance from KaKaRoTo, is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
