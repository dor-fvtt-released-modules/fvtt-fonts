import constants from '../constants.js';
import {loc, settingGet} from '../utils.js';

export class FvttFontsManageFonts extends FormApplication {

    constructor(object, options = {}) {
        super(object, options);
    }

    // Default options for the form
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'fvtt-fonts-manage-fonts-form',
            title: loc('settings', 'manageFontsMenu', 'frameTitle'),
            template: './modules/fvtt-fonts/templates/ManageFontsForm.hbs',
            classes: ['sheet'],
            width: 800,
            height: 'auto',
            closeOnSubmit: true
        });
    }

    // Assembles a map of the installed fonts for display on the Manage Fonts page
    static assembleInstalledFonts() {
        let assembledFonts = {};

        // Add FoundryVTT default fonts
        let foundryDefaultFonts = {};
        for (const key of constants.foundryDefaultFonts) {
            foundryDefaultFonts[key] = {
                name: key,
                installed: true, 	//TODO Replace with function to determine install status
                removable: false, 	// Default Foundry VTT fonts cannot be removed.
                sourceIconId: "foundry-default-icon",
                sourceIconPath: "icons/fvtt.png",
                sourceIconHoverText: loc('settings', 'manageFontsMenu', 'foundryDefaultIconHover')
            };
            mergeObject(assembledFonts, foundryDefaultFonts)
        }

        // Add FVTT Fonts default fonts
        let fvttFontsDefaultFonts = {};
        for (const key of constants.fvttFontsDefaultFonts) {
            fvttFontsDefaultFonts[key] = {
                name: key,
                installed: true, 	//TODO Replace with function to determine install status
                removable: true, 	// Default Foundry VTT fonts cannot be removed. TODO implement removal lol
                sourceIconId: "fvtt-fonts-default-icon",
                sourceIconPath: `/modules/${constants.moduleName}/icons/fvttFontsIcon.png`,
                sourceIconHoverText: loc('settings', 'manageFontsMenu', 'fvttFontsDefaultIconHover', {'title': constants.moduleTitle})
            };
            mergeObject(assembledFonts, fvttFontsDefaultFonts)
        }

        // Add Dungeondraft default fonts if enabled in Settings
        if (settingGet('dungeondraftFontsVisible')) {
            let dungeondraftDefaultFonts = {};
            for (const key of constants.dungeondraftDefaultFonts) {
                dungeondraftDefaultFonts[key] = {
                    name: key,
                    installed: true, 	//TODO Replace with function to determine install status
                    removable: true, 	// Default Foundry VTT fonts cannot be removed. TODO implement removal lol
                    sourceIconId: "dungeondraft-default-icon",
                    sourceIconPath: `/modules/${constants.moduleName}/icons/dungeondraftIcon.png`,
                    sourceIconHoverText: loc('settings', 'manageFontsMenu', 'dungeondraftIconHover')
                };
                mergeObject(assembledFonts, dungeondraftDefaultFonts)
            }

        }
        return assembledFonts
    }

    // Just for fun. Gets one of ten random panagrams to use as the preview alphabet.
    static panagramShuffler() {
        const shuffle = Math.floor(Math.random() * (10 - 1 + 1) + 1);
        let panagram = loc('settings', 'manageFontsMenu', `panagrams.panagram-${shuffle}`)

        return panagram
    }

    getData(options) {
        //const allFontFamilies = CONFIG.fontFamilies;
        const previewAlphabet = FvttFontsManageFonts.panagramShuffler();
        const locPrefix = `${constants.moduleName}.settings.manageFontsMenu.`
        const fontFamilies = FvttFontsManageFonts.assembleInstalledFonts();

        return {
            previewAlphabet: previewAlphabet,
            locPrefix: locPrefix,
            fontFamilies: fontFamilies
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