import * as constants from '../constants.js';
import {
    getFontManagerTabData,
    assembleInstalledFonts,
    removeFontListener,
} from './font-manager-tab-logic.js';
import {
    getFontPreviewerTabData,
    getEnabledFonts,
    panagramCombiner,
} from './font-previewer-tab-logic.js';
import { processNewFont, checkForDuplicateFonts, addFontMessaging } from './add-font-tab-logic.js';

import { getFontPacksTabData } from './font-packs-tab-logic.js';
import {
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    debug,
    settingSet,
    settingGet,
    settingDetails,
    isEmpty,
    loadConfigFontFamilies,
} from '../utils.js';
import { getPreferencesTabData } from './preferences-tab-logic.js';

class FvttFontsMainSettingsForm extends FormApplication {
    constructor(object, options = {}) {
        super(object, options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'fvtt-fonts-main-settings-form',
            title: loc('mainSettings', 'mainSettingsFormFrame', 'frameTitle'),
            template: `modules/${constants.moduleName}/templates/FvttFontsMainSettingsForm.hbs`,
            classes: ['sheet'],
            width: 850,
            height: 'auto',
            closeOnSubmit: false,
            submitOnChange: true,
            tabs: [
                { navSelector: '.tabs', contentSelector: '#config-tabs', initial: 'fontManager' },
            ],
        });
    }

    getData(options) {
        let data = {};

        const miscConstants = {
            locPrefix: `${constants.moduleName}.mainSettings.`,
            moduleTitle: `${constants.moduleTitle}`,
        };
        mergeObject(data, miscConstants);

        const fontManagerTabData = getFontManagerTabData();
        mergeObject(data, fontManagerTabData);

        const fontPreviewerTabData = getFontPreviewerTabData();
        mergeObject(data, fontPreviewerTabData);

        const fontPacksTabData = getFontPacksTabData();
        mergeObject(data, fontPacksTabData);

        const preferencesTabData = getPreferencesTabData();
        mergeObject(data, preferencesTabData);

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
        // The final object provided to the template
        return data;
    }

    async activateListeners(html) {
        super.activateListeners(html);
        // Listen for font removal of GM Added Fonts on the Font Manager tab
        html.find("[name='remove-font-button']").on('click', async (event) => {
            const removedFont = event.currentTarget.attributes.data.value;
            let gmAddedFonts = settingGet('gmAddedFonts');
            let gmAddedFontsEnabled = settingGet('gmAddedFontsEnabled');

            if (gmAddedFontsEnabled.includes(removedFont)) {
                gmAddedFontsEnabled = gmAddedFontsEnabled.filter((font) => font !== removedFont);
                gmAddedFontsEnabled.sort();
                console.log(gmAddedFontsEnabled);
                await settingSet('gmAddedFontsEnabled', gmAddedFontsEnabled);
            }

            if (gmAddedFonts.includes(removedFont)) {
                gmAddedFonts = gmAddedFonts.filter((font) => font !== removedFont);
                gmAddedFonts.sort();
                console.log(gmAddedFonts);
                await settingSet('gmAddedFonts', gmAddedFonts);
                await loadConfigFontFamilies();
                this.render(); // TODO solve this closing the collapsible
            }
        });

        // Listen for font change in Font Previewer
        html.find('.previewed-font').on('change', async (event) => {
            const previewedFont = event.currentTarget.value; //font select's value
            html.find('.font-preview-text').each(function () {
                this.style.font = `120% ${previewedFont}`; // TODO use a % per font
            }, previewedFont);
            debug(`Current position: ${this.position}`);
            this.setPosition({ height: 'auto' });
            debug(`New position: ${this.position}`);
        });

        // Listen for add font button
        html.find("[name='add-font-button']").on('click', async (event) => {
            let newFont = html.find('input#gmAddedFonts')[0].value.trim();
            if (isEmpty(newFont)) {
                await addFontMessaging('empty', 'warn');
            }
        });
        // End Add Font processing block

        // Listen for 'Close' button
        html.find("[name='close-button']").on('click', async () => {
            this.close();
        });
        // End 'Close' button
    }

    async _updateObject(ev, formData) {
        for (const [key, value] of Object.entries(formData)) {
            let details = settingDetails(key);
            if (details && details.type.name === 'Boolean' && settingGet(key) !== value) {
                await settingSet(key, value);
                this.render();
            } else if (details && key === 'gmAddedFonts' && value) {
                await processNewFont(value);
                console.log('return here');
                this.render(); // TODO solve this happening before changes have taken place.
            }
        }
    }
}

Object.assign(FvttFontsMainSettingsForm.prototype, {
    getFontManagerTabData,
    assembleInstalledFonts,
    removeFontListener,
});
Object.assign(FvttFontsMainSettingsForm.prototype, {
    getFontPreviewerTabData,
    getEnabledFonts,
    panagramCombiner,
});
Object.assign(FvttFontsMainSettingsForm.prototype, {
    processNewFont,
    checkForDuplicateFonts,
    addFontMessaging,
});
Object.assign(FvttFontsMainSettingsForm.prototype, { getFontPacksTabData });
Object.assign(FvttFontsMainSettingsForm.prototype, { getPreferencesTabData });

export default FvttFontsMainSettingsForm;
