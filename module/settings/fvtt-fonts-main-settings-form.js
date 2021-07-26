import * as constants from '../constants.js';
import FontManagerLogic from './font-manager-logic.js';
import FontPreviewerLogic from './font-previewer-logic.js';
import AddFontLogic from './add-font-logic.js';
import {
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    debug,
    settingSet,
    settingGet,
    settingDetails,
    panagramShuffler,
    renderOnSettingChange,
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

        const fontPreviewerData = {
            enabledFonts: FontPreviewerLogic.getEnabledFonts(),
            completeAlphabet: loc('mainSettings', 'fontPreviewerTab', 'completeAlphabet'),
            panagramBlob: FontPreviewerLogic.panagramCombiner(),
        };
        mergeObject(data, fontPreviewerData);

        const fontManagerData = {
            previewAlphabet: panagramShuffler(),
            installedFonts: FontManagerLogic.assembleInstalledFonts(),
        };
        mergeObject(data, fontManagerData);

        const miscConstants = {
            locPrefix: `${constants.moduleName}.mainSettings.`,
            moduleTitle: `${constants.moduleTitle}`,
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
            debug(`Current position: ${this.position}`);
            this.setPosition({ height: 'auto' });
            debug(`New position: ${this.position}`);
        });

        // Listen for add font button
        html.find('button').on('click', async (event) => {
            if (event.currentTarget?.dataset?.action === 'addFont') {
                AddFontLogic.newFontSubmitted(html);
            }
        });
        // End Add Font processing block

        // Listen for 'Close' button
        html.find("[name='close-button']").on('click', async (event) => {
            this.close();
        });
        // End 'Close' button
    }

    _updateObject(ev, formData) {
        for (const [key, value] of Object.entries(formData)) {
            let details = settingDetails(key);
            if (details && details.type.name === 'Boolean') {
                renderOnSettingChange(this);
                settingSet(key, value);
            }
        }
    }
}
