import { loc, notify, isEmpty, debug } from '../utils.js';
import FvttFonts from '../fvtt-fonts.js';
import * as constants from '../constants.js';

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
    static processNewFont(newFont) {
        let url = `https://fonts.googleapis.com/css2?family=${newFont}`;

        fetch(url, {
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
            },
        })
            .then(function (response) {
                if (response.status === 200) {
                    AddFontLogic._acceptNewFont(response.status, newFont); // HTTP 200 = font exists
                } else {
                    AddFontLogic._rejectNewFont(response.status); // Any other HTTP code - font doesn't exist
                }
            })
            .catch(function (err) {
                AddFontLogic._rejectNewFont(err, newFont); // An error - usually CORS - means the font doesn't exist
            });
    }

    static _acceptNewFont(response, newFont) {
        debug(`Accept Response: ${response}`);

        // let currentFontsList = settingGet('fonts')

        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'added' }, 'info', {
            newFont: `${newFont}`,
        });
    }

    // Handles messaging the user when a submitted font is rejected
    static _rejectNewFont(response, newFont) {
        debug(`Reject Response: ${response}`);
        notify({ locDomain: 'userAlerts', locSection: 'addFontSave', locKey: 'invalid' }, 'error', {
            newFont: `${newFont}`,
        });
    }
}
