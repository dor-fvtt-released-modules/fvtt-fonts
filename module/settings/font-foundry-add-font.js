export class FontFoundryAddFont extends FormApplication {
    
	// constructor (object, options = {}) {
	// 	super(object, options);
	// }

    // Default options for the form
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			id : 'font-foundry-add-font-form',
			title : game.i18n.localize(`${constants.moduleName}.addFontForm.title`),
			template : './modules/font-foundry/templates/AddFontsForm.hbs',
			classes : ['sheet'],
			width : "auto",
			height : 600,
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