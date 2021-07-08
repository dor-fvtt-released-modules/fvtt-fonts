import constants from '../constants.js';
import {FontFurnaceAddFont} from "./add-font.js";
import {FontFurnaceManageFonts} from "./manage-fonts.js";

// Register default settings
export default function registerSettings() {

  game.settings.registerMenu(constants.moduleName, 'addFont', {
    label:  loc('settings','addFontMenuButton','label'),
    type: FontFurnaceAddFont,
    restricted: true
	}),

  game.settings.registerMenu(constants.moduleName, 'manageFonts', {
      label:  loc('settings','manageFontsMenuButton','label'),
      type: FontFurnaceManageFonts,
    restricted: true
	}),
  
  game.settings.register(constants.moduleName, 'fonts', {
    scope: 'world',
    config: false,
    default: constants.fontFurnaceDefaultFonts,
    type: String
    //onChange: () => FontFurnace.render({settings: true})
  }),

    game.settings.register(constants.moduleName, 'categorySort', {
        name: loc('settings','categorySortSetting','title'),
        hint: loc('settings','categorySortSetting','hint'),
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });

}