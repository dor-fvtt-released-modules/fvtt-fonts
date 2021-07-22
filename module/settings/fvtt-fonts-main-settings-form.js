import * as constants from '../constants.js';
import FontPreviewerLogic from './font-previewer-logic.js';
import AddFontLogic from './add-font-logic.js';
import {
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    settingSet,
    settingGet,
    settingDetails,
    panagramShuffler,
    isEmpty,
    notify,
} from '../utils.js';

export class FvttFontsMainSettingsForm extends FormApplication {
    constructor(object, options = {}) {
        super(object, options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'fvtt-fonts-main-settings-form',
            title: loc('mainSettings', 'mainSettingsFormFrame', 'frameTitle'),
            template: `modules/${constants.moduleName}/templates/FvttFontsMainSettingsForm.hbs`,
            classes: ['sheet'],
            width: 750,
            height: 'auto',
            closeOnSubmit: false,
            submitOnChange: true,
            tabs: [{ navSelector: '.tabs', contentSelector: '#config-tabs', initial: 'general' }],
        });
    }

    getData(options) {
        let data = {};

        const fontPreviewerData = {
            enabledFonts: CONFIG.fontFamilies,
            panagramBlob: FontPreviewerLogic.panagramCombiner(),
        };
        mergeObject(data, fontPreviewerData);

        const miscConstants = {
            locPrefix: `${constants.moduleName}.mainSettings.`,
            previewAlphabet: panagramShuffler(),
        };
        mergeObject(data, miscConstants);

        // Simple Boolean settings
        const simpleBooleans = {
            fvttFontsDefaultFontsVisible: settingGet('fvttFontsDefaultFontsVisible'),
            dungeondraftFontsVisible: settingGet('dungeondraftFontsVisible'),
            categorySort: settingGet('categorySort'),
        };
        mergeObject(data, simpleBooleans);

        // Game system settings
        if (gameSystemPackAvailable()) {
            const gameSystemOptions = {
                gameSystemPackAvailable: true,
                gameSystemFontsVisible: settingGet('gameSystemFontsVisible'),
                gameSystemName: game.system.data.name,
                gameSystemTitle: game.system.data.title,
                gameSystemDetails: gameSystemDetails(),
            };
            mergeObject(data, gameSystemOptions);
        }

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Listen for font change in Font Previewer
        html.find('.previewed-font').on('change', async (event) => {
            const previewedFont = event.currentTarget.value; //font select's value
            html.find('.font-preview-text').each(function () {
                let z = previewedFont;
                this.style.font = `120% ${previewedFont}`; // TODO use a % per font
            }, previewedFont);
            console.log(this.position);
            this.setPosition({ height: 'auto' });
            console.log(this.position);
        });

        // Listen for add font button
        html.find('button').on('click', async (event) => {
            if (event.currentTarget?.dataset?.action === 'addFont') {
                AddFontLogic.newFontSubmitted(html);
            }
        });
        // End Add Font processing block
    }

    async _updateObject(ev, formData) {
        for (const [key, value] of Object.entries(formData)) {
            let details = settingDetails(key);
            if (details && details.type.name === 'Boolean') {
                settingSet(key, value);
                // } else if (key === 'gmFontsAdded' && key) {
                //  gmFonts = settingGet(key);
            }
        }
    }
}
