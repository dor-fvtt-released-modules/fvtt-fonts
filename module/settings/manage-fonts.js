import {loc} from '../utils.js';

export class FontFurnaceManageFonts extends FormApplication {
    
	constructor (object, options = {}) {
		super(object, options);
	}

    // Default options for the form
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			id : 'font-furnace-manage-fonts-form',
			title : loc('settings','manageFontsMenu','frameTitle'),
			template : './modules/font-furnace/templates/ManageFontsForm.hbs',
			classes : ['sheet'],
			width : 600,
			height : "auto",
			closeOnSubmit: true
		});
	}

	getData (options) {
		const configFontFamilies = CONFIG.fontFamilies;
		return {
			fontFamilies : configFontFamilies
		};
	}

	// async activateListeners(html) {
	// 	super.activateListeners(html);
	// 	html.find('.font-furnace-alphabet').each(function () {
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