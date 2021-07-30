import { redrawDrawings, log } from './utils.js';

export default class WebFontLoader {
    static loadWebFontApi() {
        const script = $('<script defer>');
        script.attr('src', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        $('head').append(script);
    }

    static async loadGoogleFonts(fontArray) {
        let webFontConfig = {
            google: {
                families: fontArray,
            },
            timeout: 2000, // Set the timeout to two seconds
            active: function () {
                redrawDrawings();
                log('All Google Fonts loaded.');
            },
        };

        WebFont.load(webFontConfig);
    }

    static async validateGoogleFont(font) {
        // TODO Explore using WebFont for validation instead.
        let url = `https://fonts.googleapis.com/css2?family=${font}`;

        try {
            let response = await fetch(url, {
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            if (response.status === 200) {
                return await { valid: true, responseCode: response.status, error: null }; // HTTP 200 = font exists
            } else {
                return await { valid: false, responseCode: response.status, error: null }; // Any other HTTP code - font doesn't exist
            }
        } catch (err) {
            return await { valid: false, responseCode: null, error: err }; // An error - usually CORS - means the font doesn't exist
        }
    }
}
