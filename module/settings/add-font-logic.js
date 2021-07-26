import * as constants from '../constants.js';
import {
    notify,
    isEmpty,
    debug,
    settingGet,
    settingSet,
    gameSystemPackAvailable,
    gameSystemDetails,
    loc,
} from '../utils.js';
import GoogleFontLoader from '../google-font-loader.js';

export default class AddFontLogic {
    // Called when the 'Add Font' button is pressed on the Add Font tab of the Main Settings Form.
    static newFontSubmitted(html) {
        const newFont = html.find('input#gmAddedFonts')[0].value.trim();
        if (isEmpty(newFont)) {
            notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'empty' }, 'warn');
            return;
        }
        AddFontLogic.processNewFont(newFont);
    }

    // Receives added fonts and validates that they exist in the Google Fonts API. If they don't the result will be a CORS error.
    static async processNewFont(newFont, validator = null, dupesChecked = false) {
        // Check for duplicate fonts if they haven't been checked for this font already
        if (!dupesChecked) {
            const dupeCheck = AddFontLogic._checkForDuplicates(newFont);
            if (dupeCheck.dupe) {
                AddFontLogic._messageDuplicateFont(newFont, dupeCheck.dupePack);
                return;
            }
        }

        // Get validator if not present
        if (!validator) {
            GoogleFontLoader.validateGoogleFont(newFont, 'addFont');
            return;
        }

        // If font didn't validate, message the rejection.
        if (!validator.valid) {
            AddFontLogic._messageAddFailure(newFont, validator);
            return;
        }

        // All checks have passed. Add and enable the font.
        AddFontLogic._addAndEnableFont(newFont);
    }

    // Adds and enables a validated, non-duplicate font
    static _addAndEnableFont(newFont) {
        let gmAddedFonts = settingGet('gmAddedFonts');
        gmAddedFonts.push(newFont);
        gmAddedFonts.sort();
        settingSet('gmAddedFonts', gmAddedFonts);

        let gmAddedFontsEnabled = settingGet('gmAddedFontsEnabled');
        gmAddedFontsEnabled.push(newFont);
        gmAddedFontsEnabled.sort();
        settingSet('gmAddedFontsEnabled', gmAddedFontsEnabled);

        AddFontLogic._messageAddSuccess(newFont);
    }

    // Prevents duplicate fonts from being added by checking submissions against existing font packs
    static _checkForDuplicates(newFont) {
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

    // Handles messaging the user when a submitted font is rejected
    static _messageAddFailure(newFont, validator) {
        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'invalid' }, 'error', {
            newFont: `${newFont}`,
        });
        debug(`Reject Response: Code: ${validator.responseCode} | Error:${validator.error}`);
    }

    // Handles messaging the user when a submitted font is a dupe
    static _messageDuplicateFont(newFont, dupePack) {
        notify(
            { locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'duplicate' },
            'warn',
            {
                newFont: `${newFont}`,
                existingFontPack: `${dupePack}`,
            },
        );
    }

    static _messageAddSuccess(newFont) {
        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'added' }, 'info', {
            newFont: `${newFont}`,
        });
    }
}
