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
