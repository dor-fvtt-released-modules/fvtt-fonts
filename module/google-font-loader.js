import AddFontLogic from './settings/add-font-logic.js';

export default class GoogleFontLoader {
    static validateGoogleFont(font, originator = 'loadFont') {
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
                    GoogleFontLoader._returnValidator(font, validator, originator);
                } else {
                    validator = { valid: false, responseCode: response.status, error: null }; // Any other HTTP code - font doesn't exist
                    GoogleFontLoader._returnValidator(font, validator, originator);
                }
            })
            .catch(function (err) {
                validator = { valid: false, responseCode: null, error: err }; // An error - usually CORS - means the font doesn't exist
                GoogleFontLoader._returnValidator(font, validator, originator);
            });
    }

    static _returnValidator(font, validator, originator) {
        if (originator === 'addFont') {
            AddFontLogic.processNewFont(font, validator, true);
        } else if (originator === 'loadFont') {
            // do things
        }
    }
    /*   static render(options = {settings: false}) {
    let fontFamilies = game.settings.get(constants.moduleName, 'tempFontSetting');

    fontFamilies.forEach(f => {
      if (CONFIG.fontFamilies.includes(f)) return;
      CONFIG.fontFamilies.push(f);
    });

    fonts = fontFamilies.map(f => {
      f = f.replace(' ', '+');
      f = "family=" + f;
      return f;
    }).join('&');

    $('#fcf').remove();
    const fontEl = $('<link id="fcf">');
    fontEl.attr('rel', `stylesheet`);
    fontEl.attr('type', `text/css`);
    fontEl.attr('media', `all`);
    fontEl.attr('href', `https://fonts.googleapis.com/css2?${fonts}&display=swap`);
    $('head').append(fontEl);
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
