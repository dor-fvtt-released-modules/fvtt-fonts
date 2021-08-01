import * as constants from '../constants.js';
import {
    getFontManagerTabData,
    assembleInstalledFonts,
    removeFontListener,
    expandCollapseGroup,
    resetFontManagerTabSize,
    renderWithoutCollapse,
} from './font-manager-tab-logic.js';
import {
    getFontPreviewerTabData,
    fontPreviewerPreviewListener,
    panagramCombiner,
} from './font-previewer-tab-logic.js';
import {
    checkFontListener,
    addFontListener,
    inputListener,
    cancelAddFontListener,
    checkNewFont,
    addNewFont,
    checkForDuplicateFonts,
    addFontMessaging,
} from './add-font-tab-logic.js';

import { getFontPacksTabData } from './font-packs-tab-logic.js';
import {
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    settingSet,
    settingGet,
    settingDetails,
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

    // Override _onChangeInput to Avoid submitting 'Add Font' input box based only on it losing focus.
    // Will still be submitted by 'Add Font' button
    _onChangeInput(event) {
        let targetName = event.target.name;
        if (targetName === 'gmAddFontInput') {
        } else {
            super._onChangeInput(event);
        }
    }

    async activateListeners(html) {
        super.activateListeners(html);
        // Listen for font removal of GM Added Fonts on the Font Manager tab
        removeFontListener.call(this, html);

        // Listen for font change in Font Previewer
        fontPreviewerPreviewListener.call(this, html);

        // Listen for an empty font submission
        checkFontListener.call(this, html);
        inputListener.call(this, html);
        addFontListener.call(this, html);
        cancelAddFontListener.call(this, html);

        // Listen for 'Close' button
        html.find("[name='close-button']").on('click', async () => {
            this.close();
        });
    }

    async _updateObject(ev, formData) {
        for (const [key, value] of Object.entries(formData)) {
            let details = settingDetails(key);

            // If a simple Boolean setting was changed, flips it.
            if (details && details.type.name === 'Boolean' && settingGet(key) !== value) {
                await settingSet(key, value);
                await loadConfigFontFamilies();
                this.render();
            }

            // If a new font was added, add it.
            if (key === 'gmAddFontInput' && value) {
                await addNewFont(value);
                this.render();
            }

            if (key === 'removeFont') {
                let gmAddedFonts = settingGet('gmAddedFonts');
                let gmAddedFontsEnabled = settingGet('gmAddedFontsEnabled');

                if (gmAddedFontsEnabled.includes(value)) {
                    gmAddedFontsEnabled = gmAddedFontsEnabled.filter((font) => font !== value);
                    gmAddedFontsEnabled.sort();
                    await settingSet('gmAddedFontsEnabled', gmAddedFontsEnabled);
                }

                if (gmAddedFonts.includes(value)) {
                    gmAddedFonts = gmAddedFonts.filter((font) => font !== value);
                    gmAddedFonts.sort();
                    await settingSet('gmAddedFonts', gmAddedFonts);
                    await loadConfigFontFamilies();
                    await renderWithoutCollapse('gmAddedFonts');
                    this.render();
                }
            }

            // If a font was enabled or disabled in the Font Manager, flip it.
            if (key === 'fontEnableDisable') {
                const change = ev.target.id.split('--');
                const pack = change[0];
                const changedFont = change[1];
                if (changedFont) {
                    const currentState = settingGet(pack);
                    const included = currentState.includes(changedFont);
                    if (included) {
                        let newState = currentState.filter((font) => font !== changedFont);
                        await settingSet(pack, newState);
                        await loadConfigFontFamilies();
                        await renderWithoutCollapse(pack.replace('Enabled', ''));
                        this.render();
                    } else if (!included) {
                        currentState.push(changedFont);
                        let newState = currentState;
                        newState.sort();
                        await settingSet(pack, newState);
                        await loadConfigFontFamilies();
                        await renderWithoutCollapse(pack.replace('Enabled', ''));
                        this.render();
                    }
                }
            }
        }
    }
}

// Make sure imports are part of the FvttFontsMainSettingsForm class.
Object.assign(FvttFontsMainSettingsForm.prototype, {
    // Font Manager tab imports
    getFontManagerTabData,
    assembleInstalledFonts,
    removeFontListener,
    expandCollapseGroup,
    resetFontManagerTabSize,
    renderWithoutCollapse,
    // Font Previewer tab imports
    getFontPreviewerTabData,
    fontPreviewerPreviewListener,
    panagramCombiner,
    // Add font tab imports
    checkFontListener,
    inputListener,
    addFontListener,
    cancelAddFontListener,
    checkNewFont,
    addNewFont,
    checkForDuplicateFonts,
    addFontMessaging,
    // Font packs tab imports
    getFontPacksTabData,
    // Preferences tab imports
    getPreferencesTabData,
});

export default FvttFontsMainSettingsForm;
