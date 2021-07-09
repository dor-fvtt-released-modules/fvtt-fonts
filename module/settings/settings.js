import constants from '../constants.js';
import {loc} from '../utils.js';
import {FvttFontsAddFont} from "./add-font.js";
import {FvttFontsManageFonts} from "./manage-fonts.js";

// Register default settings
export default function registerSettings() {

    game.settings.registerMenu(constants.moduleName, 'manageFonts', {
        label:  loc('settings','manageFontsMenuButton','label'),
         type: FvttFontsManageFonts,
        restricted: true
	}),

    game.settings.registerMenu(constants.moduleName, 'addFont', {
        label:  loc('settings','addFontMenuButton','label'),
        type: FvttFontsAddFont,
         restricted: true
     }),
  
    game.settings.register(constants.moduleName, 'fonts', {
         scope: 'world',
         config: false,
         default: constants.fvttFontsDefaultFonts,
        type: String
         //onChange: () => FvttFonts.render({settings: true})
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