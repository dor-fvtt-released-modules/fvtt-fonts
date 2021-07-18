import * as constants from '../constants.js';
import AddFontLogic from './add-font-logic.js';
import {
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    settingSet,
    settingGet,
    settingDetails,
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
            template: `modules/${constants.moduleName}/templates/FvttFontsMainSettingsMenu.hbs`,
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

        const miscConstants = {
            locPrefix: `${constants.moduleName}.mainSettings.`,
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
            if (settingDetails(key).type.name === 'Boolean') {
                settingSet(key, value);
                // } else if (key === 'gmFontsAdded' && key) {
                //  gmFonts = settingGet(key);
            }
        }
    }
}
