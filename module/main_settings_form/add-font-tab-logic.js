import * as constants from '../constants.js';
import {
    notify,
    settingGet,
    settingSet,
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    loadConfigFontFamilies,
    isEmpty,
} from '../utils.js';
import WebFontLoader from '../web-font-loader.js';

export async function checkFontListener(html) {
    html.find('button#check-font-button').on('click', async () => {
        let textBox = html.find('input#gmAddFontInput');
        let newFont = textBox[0].value.trim();
        if (isEmpty(newFont)) {
            await addFontMessaging('empty', 'warn');
            return;
        }
        const valid = await checkNewFont(newFont);

        let checkButton = await html.find('button#check-font-button')[0];
        let addButton = await html.find('button#add-font-button')[0];
        let cancelAddButton = await html.find('button#cancel-add-font-button')[0];
        let previewText = await html.find('#add-font-preview-text')[0];
        let previewLabel = await html.find('#add-font-preview-label')[0];

        if (valid) {
            // Disable text box editing
            textBox.attr('disabled', 'disabled');

            // Load new font from Google
            await WebFontLoader.loadGoogleFonts([newFont]);

            // Change check button property
            checkButton.classList.replace('add-font-tab-button', 'add-font-tab-button--hidden');
            // Change add button property
            addButton.classList.replace('add-font-tab-button--hidden', 'add-font-tab-button');
            // Change cancel button property
            cancelAddButton.classList.replace('add-font-tab-button--hidden', 'add-font-tab-button');
            // Reveal preview
            previewText.children['add-font-preview-title'].innerText = newFont;
            previewLabel.classList.replace('font-preview-text--hidden', 'font-preview-text');
            previewText.classList.replace('font-preview-text--hidden', 'font-preview-text');
            previewText.style.font = `120% ${newFont}`;
            this.setPosition({ height: 'auto' });
        }
    });
}

export async function inputListener(html) {
    html.find('input#gmAddFontInput').on('keydown', async (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
}

export async function addFontListener(html) {
    html.find('#add-font-button').on('click', async (event) => {
        const newFont = html.find('input#gmAddFontInput')[0].value.trim();
        const formData = {
            gmAddFontInput: newFont,
        };
        this._updateObject(event, formData);
    });
}

export async function cancelAddFontListener(html) {
    html.find('#cancel-add-font-button').on('click', async () => {
        this.render();
        //this.setPosition({ height: 'auto' });
    });
}

export async function checkNewFont(newFont) {
    newFont = newFont.trim();

    // Check for duplicate fonts
    const dupeCheck = await checkForDuplicateFonts(newFont);
    if (dupeCheck.dupe) {
        await addFontMessaging('duplicate', 'warn', {
            locPlaceholder: {
                newFont: newFont,
                existingFontPack: dupeCheck.dupePack,
            },
        });
        return false;
    }

    const validator = await WebFontLoader.validateGoogleFont(newFont);
    // If font didn't validate, message the rejection.
    if (!validator.valid) {
        await addFontMessaging('invalid', 'error', {
            locPlaceholder: { newFont: newFont },
            responseCode: validator.responseCode,
            error: validator.error,
        });
        return false;
    }
    return true;
}

export async function addNewFont(newFont) {
    newFont = newFont.trim();

    // All checks have passed. Add and enable the font.
    let gmAddedFonts = settingGet('gmAddedFonts');
    gmAddedFonts.push(newFont);
    gmAddedFonts.sort();
    await settingSet('gmAddedFonts', gmAddedFonts);

    let gmAddedFontsEnabled = settingGet('gmAddedFontsEnabled');
    gmAddedFontsEnabled.push(newFont);
    gmAddedFontsEnabled.sort();
    await settingSet('gmAddedFontsEnabled', gmAddedFontsEnabled);

    await loadConfigFontFamilies();

    await addFontMessaging('added', 'info', { locPlaceholder: { newFont: newFont } });
}

// Receives added fonts and validates that they exist in the Google Fonts API. If they don't the result will be a CORS error.
export async function processNewFont(newFont) {}

// Prevents duplicate fonts from being added by checking submissions against existing font packs
export async function checkForDuplicateFonts(newFont) {
    let dupeCheck = { dupe: false, dupePack: '' };
    let dupePack = '';

    // Check for duplicated in the static font packs
    if (constants.foundryDefaultFonts.includes(newFont)) {
        dupePack = loc('mainSettings', 'fontManagerTab', 'foundryDefaultPackName');
    } else if (constants.fvttFontsDefaultFonts.includes(newFont)) {
        dupePack = loc('mainSettings', 'fontManagerTab', 'fvttFontsDefaultPackName', {
            title: constants.moduleTitle,
        });
    } else if (settingGet('gmAddedFonts').includes(newFont)) {
        dupePack = loc('mainSettings', 'fontManagerTab', 'gmAddedPackName', {
            title: constants.moduleTitle,
        });
    } else if (constants.dungeondraftFonts.includes(newFont)) {
        dupePack = loc('mainSettings', 'fontManagerTab', 'dungeondraftPackName');
    }

    // If there's a pack for the current system, look for dupes there
    if (!dupePack && gameSystemPackAvailable()) {
        let details = gameSystemDetails();
        if (details.fonts.includes(newFont)) {
            dupePack = loc('mainSettings', 'fontManagerTab', 'gameSystemPackName', {
                system: game.system.data.title,
            });
        }
    }

    // Check for any duplicates in the packs added through the Fonts API
    if (!dupePack) {
        let packs = settingGet('fontsApiFontPacks');
        if (packs.keys) {
            for (const [key, value] of Object.entries(packs)) {
                if (value.includes(newFont)) {
                    dupePack = loc('mainSettings', 'fontManagerTab', 'fontsApiPackName', {
                        module: game.modules.get(`${key}`).data.title,
                    });
                }
            }
        }
    }

    // If we found a duplicate in a pack, update the dupeCheck object before returning it
    if (dupePack) {
        dupeCheck['dupe'] = true;
        dupeCheck['dupePack'] = dupePack;
    }

    return dupeCheck;
}

export async function addFontMessaging(key, type, options = { locPlaceholder: {} }) {
    await notify(
        { locDomain: 'userAlerts', locSection: 'addFontSave', locKey: `${key}` },
        type,
        options.locPlaceholder,
    );
}
