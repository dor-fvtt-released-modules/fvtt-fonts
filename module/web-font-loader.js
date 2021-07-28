import AddFontLogic from './settings/add-font-logic.js';

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
        };

        // TODO - Explore using WebFont event callbacks

        WebFont.load(webFontConfig);
    }

    static validateGoogleFont(font, originator = 'loadFont') {
        // TODO Explore using WebFont for validation instead.
        let validator = {};
        let url = `https://fonts.googleapis.com/css2?family=${font}`;

        fetch(url, {
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
            },
        })
            .then(function (response) {
                if (response.status === 200) {
                    validator = { valid: true, responseCode: response.status, error: null }; // HTTP 200 = font exists
                    WebFontLoader._returnValidator(font, validator, originator);
                } else {
                    validator = { valid: false, responseCode: response.status, error: null }; // Any other HTTP code - font doesn't exist
                    WebFontLoader._returnValidator(font, validator, originator);
                }
            })
            .catch(function (err) {
                validator = { valid: false, responseCode: null, error: err }; // An error - usually CORS - means the font doesn't exist
                WebFontLoader._returnValidator(font, validator, originator);
            });
    }

    static _returnValidator(font, validator, originator) {
        if (originator === 'addFont') {
            AddFontLogic.processNewFont(font, validator, true);
        } else if (originator === 'loadFont') {
            // do things
        }
    }
    /*
    fontEl.on('load', () => {
      // Try to redraw drawings. If the font isn't loaded. Then wait 5 seconds and try again.
      this.drawDrawings();
      setTimeout(() => this.drawDrawings(), 5000);
      if (options.settings) {
        ui.notifications.info(game.i18n.localize('ForienCustomFonts.Notifications.FontAdded'), {permanent: true});
      }
    });
  }

  static drawDrawings() {
    canvas?.drawings?.placeables.filter(d => d.data.type === 't').forEach(d => d.draw());
  } */
}
