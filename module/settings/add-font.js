import {loc,notify,isEmpty} from '../utils.js';
import FontFurnace from '../font-furnace.js'

export class FontFurnaceAddFont extends FormApplication {
    
	constructor (object, options = {}) {
		super(object, options);
	}

    // Default options for the form
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			id : 'font-furnace-add-font-form',
			title : loc('settings','addFontMenu','frameTitle'),
			template : './modules/font-furnace/templates/AddFontForm.hbs',
			classes : ['sheet'],
			width : 400,
			height : 200,
			closeOnSubmit: true
		});
	}

	// getData (options) {

	// 	function prepSetting (key) {
	// 		let data = game.settings.settings.get(`polyglot.${key}`);
	// 		return {
	// 			value: game.settings.get('polyglot',`${key}`),
	// 			name : data.name,
	// 			hint : data.hint
	// 		};
	// 	}

	// 	return {
	// 		languages : prepSetting('Languages'),
	// 		alphabets : prepSetting('Alphabets')
	// 	};
	// }
	
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
		
		FontFurnace.processNewFont(newFont)
	}
}