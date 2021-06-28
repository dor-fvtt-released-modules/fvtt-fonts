import constants from '../constants.js';
import {FontFoundryAddFont} from "./font-foundry-add-font.js";

// Register default settings
export default function registerSettings() {

  game.settings.registerMenu(constants.moduleName, 'addFont', {
		name:   game.i18n.localize(`${constants.moduleName}.addFont.title`),
    label:  game.i18n.localize(`${constants.moduleName}.addFont.label`),
		// icon: 'fas fa-globe',
		type: FontFoundryAddFont,
		restricted: true
	}),

  // game.settings.registerMenu(constants.moduleName, 'listFonts', {
	// 	name: game.i18n.localize(`${constants.moduleName}.listFonts.title`),
	// 	hint: game.i18n.localize(`${constants.moduleName}.listFonts.hint`),
  //   label: game.i18n.localize(`${constants.moduleName}.listFonts.label`),
	// 	icon: 'fas fa-globe',
	// 	type: FontFoundryListFonts,
	// 	restricted: true
	// }),
  
  game.settings.register(constants.moduleName, 'tempFontSetting', {
    name: game.i18n.localize(`${constants.moduleName}.tempFontSetting.title`),
    hint: game.i18n.localize(`${constants.moduleName}.tempFontSetting.hint`),
    scope: 'world',
    config: true,
    default: constants.moduleDefaultFonts,
    type: String,
    onChange: () => FontFoundry.render({settings: true})
  }),
  
  game.settings.register(constants.moduleName, 'testSetting', {
    name: game.i18n.localize(`${constants.moduleName}.testSetting.title`),
    hint: game.i18n.localize(`${constants.moduleName}.testSetting.hint`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: () => console.log(game.i18n.localize(`${constants.moduleName}.testPolyglotSetting.toggled`))
  });

}