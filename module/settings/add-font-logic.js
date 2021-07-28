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
import { FvttFontsMainSettingsForm } from './fvtt-fonts-main-settings-form.js';

export default class AddFontLogic {
    // Receives added fonts and validates that they exist in the Google Fonts API. If they don't the result will be a CORS error.
    static async processNewFont(newFont, validator = null, dupesChecked = false) {
        newFont = newFont.trim();

        // Check for duplicate fonts if they haven't been checked for this font already
        if (!dupesChecked) {
            const dupeCheck = await AddFontLogic._checkForDuplicates(newFont);
            if (dupeCheck.dupe) {
                await AddFontLogic._messageDuplicateFont(newFont, dupeCheck.dupePack);
                return;
            }
        }

        // Get validator if not present
        if (!validator) {
            WebFontLoader.validateGoogleFont(newFont, 'addFont');
            return;
        }

        // If font didn't validate, message the rejection.
        if (!validator.valid) {
            await AddFontLogic._messageAddFailure(newFont, validator);
            return;
        }

        // All checks have passed. Add and enable the font.
        //await AddFontLogic._addAndEnableFont(newFont);
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

        await AddFontLogic._messageAddSuccess(newFont);
    }

    // Adds and enables a validated, non-duplicate font
    static async _addAndEnableFont(newFont) {
        let gmAddedFonts = settingGet('gmAddedFonts');
        gmAddedFonts.push(newFont);
        gmAddedFonts.sort();
        await settingSet('gmAddedFonts', gmAddedFonts);

        let gmAddedFontsEnabled = settingGet('gmAddedFontsEnabled');
        gmAddedFontsEnabled.push(newFont);
        gmAddedFontsEnabled.sort();
        await settingSet('gmAddedFontsEnabled', gmAddedFontsEnabled);

        WebFontLoader.loadGoogleFonts([newFont]);

        await AddFontLogic._messageAddSuccess(newFont);
    }

    // Prevents duplicate fonts from being added by checking submissions against existing font packs
    static async _checkForDuplicates(newFont) {
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

    static async messageEmptyFontSubmission() {
        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'empty' }, 'warn');
    }

    // Handles messaging the user when a submitted font is rejected
    static async _messageAddFailure(newFont, validator) {
        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'invalid' }, 'error', {
            newFont: `${newFont}`,
        });
        debug(`Reject Response: Code: ${validator.responseCode} | Error:${validator.error}`);
    }

    // Handles messaging the user when a submitted font is a dupe
    static async _messageDuplicateFont(newFont, dupePack) {
        notify(
            { locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'duplicate' },
            'warn',
            {
                newFont: `${newFont}`,
                existingFontPack: `${dupePack}`,
            },
        );
    }

    static async _messageAddSuccess(newFont) {
        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'added' }, 'info', {
            newFont: `${newFont}`,
        });
    }
}
