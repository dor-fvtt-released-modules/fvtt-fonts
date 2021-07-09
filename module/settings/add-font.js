import {loc,notify,isEmpty} from '../utils.js';
import FvttFonts from '../fvtt-fonts.js'
import constants from "../constants.js";

export class FvttFontsAddFont extends FormApplication {
    
	constructor (object, options = {}) {
		super(object, options);
	}

    // Default options for the form
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			id : 'fvtt-fonts-add-font-form',
			title : loc('settings','addFontMenu','frameTitle'),
			template : './modules/fvtt-fonts/templates/AddFontForm.hbs',
			classes : ['sheet'],
			width : 400,
			height : 200,
			closeOnSubmit: true
		});
	}

	getData (options) {
		const locPrefix = `${constants.moduleName}.settings.addFontMenu.`

		return {
			locPrefix : locPrefix
		};
	}
	
	// activateListeners(html) {
	// 	super.activateListeners(html);
	// 	html.find('button').on('click', async (event) => {
	// 		if (event.currentTarget?.dataset?.action === 'reset') {
	// 			await game.settings.set("polyglot", "Languages", {});
	// 			window.location.reload();
	// 		}
	// 	});
	// }


	async _updateObject(event, formData) {
		// let fontSettings = settingGet("fonts");

		let newFont = formData.addFontName.trim();

		// Check if font submission was empty - if so, alert user and do not add
		if (isEmpty(newFont)) {
			notify({'locDomain':'userAlerts','locSection':'addFontSave','locKey':'empty'},'warn');
			return
		}
		
		FvttFonts.processNewFont(newFont)
	}
}