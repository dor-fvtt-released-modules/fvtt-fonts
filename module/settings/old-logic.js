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
