import constants from '../constants.js';
import {loc} from '../utils.js';

export class FvttFontsManageFonts extends FormApplication {
    
	constructor (object, options = {}) {
		super(object, options);
	}

    // Default options for the form
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			id : 'fvtt-fonts-manage-fonts-form',
			title : loc('settings','manageFontsMenu','frameTitle'),
			template : './modules/fvtt-fonts/templates/ManageFontsForm.hbs',
			classes : ['sheet'],
			width : 600,
			height : "auto",
			closeOnSubmit: true
		});
	}

	// Assembles a map of the installed fonts for display on the Manage Fonts page
	static assembleInstalledFonts() {
		let assembledFonts = {};

		// Add FoundryVTT default fonts
		for (const key of constants.foundryDefaultFonts) {
			assembledFonts[key] = {
				name: key,
				installed: true, 	//TODO Replace with function to determine install status
				removable: false, 	// Default Foundry VTT fonts cannot be removed.
				sourceIconId: "foundry-default-icon",
				sourceIconPath: "icons/fvtt.png",
				sourceIconHoverText: loc('settings','manageFontsMenu','foundryDefaultIconHover')
			};
		};
		return assembledFonts
	}


	getData (options) {
		//const allFontFamilies = CONFIG.fontFamilies;
		const previewAlphabet = loc('settings','manageFontsMenu','previewAlphabet')
		const locPrefix = `${constants.moduleName}.settings.manageFontsMenu.`
		const fontFamilies = FvttFontsManageFonts.assembleInstalledFonts();

		return {
			previewAlphabet: previewAlphabet,
			locPrefix : locPrefix,
			fontFamilies : fontFamilies
		};
	}

	// async activateListeners(html) {
	// 	super.activateListeners(html);
	// 	html.find('.fvtt-fonts-alphabet').each(function () {
	// 		const font = this.previousSibling;
	// 		debug(font.innerHTML)
	// 		this.style.font = font;
	// 	})
	// 	};

	// /**
	//  * Executes on form submission
	//  * @param {Event} ev - the form submission event
	//  * @param {Object} formData - the form data
	//  */
	// async _updateObject(ev, formData) {
	// 	let langSettings = game.settings.get("polyglot", "Languages");
	// 	const iterableSettings = Object.values(formData)[0];
	// 	let i = 0;
	// 	for (let lang in langSettings) {
	// 		langSettings[lang] = iterableSettings[i];
	// 		i++;
	// 	}
	// 	game.settings.set("polyglot", "Languages", langSettings);
	// }
}