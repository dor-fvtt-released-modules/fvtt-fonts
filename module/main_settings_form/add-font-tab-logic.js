import * as constants from '../constants.js';
import {
    notify,
    debug,
    settingGet,
    settingSet,
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
    loadConfigFontFamilies,
} from '../utils.js';
import WebFontLoader from '../web-font-loader.js';

// Receives added fonts and validates that they exist in the Google Fonts API. If they don't the result will be a CORS error.
export async function processNewFont(newFont) {
    newFont = newFont.trim();

    // Check for duplicate fonts if they haven't been checked for this font already
    const dupeCheck = await checkForDuplicateFonts(newFont);
    if (dupeCheck.dupe) {
        await messageDuplicateFont(newFont, dupeCheck.dupePack);
        await addFontMessaging('duplicate', 'warn', {
            locPlaceholder: {
                newFont: newFont,
                existingFontPack: dupeCheck.dupePack,
            },
        });
        return;
    }

    const validator = await WebFontLoader.validateGoogleFont(newFont);
    // If font didn't validate, message the rejection.
    if (!validator.valid) {
        await addFontMessaging('invalid', 'error', {
            locPlaceholder: { newFont: newFont },
            responseCode: validator.responseCode,
            error: validator.error,
        });
        return;
    }

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

    await WebFontLoader.loadGoogleFonts([newFont]);

    await addFontMessaging('added', 'info', { locPlaceholder: { newFont: newFont } });
}

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
    } else if (constants.dungeondraftDefaultFonts.includes(newFont)) {
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
