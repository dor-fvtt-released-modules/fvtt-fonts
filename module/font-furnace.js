import {notify,debug} from './utils.js';

export default class FontFurnace {

    static processNewFont(newFont) {
        let url = `https://fonts.googleapis.com/css2?family=${newFont}`

        fetch(
            url, {
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then(function(response) {
            if (response.status === 200) {
                FontFurnace._acceptNewFont(response.status,newFont);
            } else {
                FontFurnace._rejectNewFont(response.status);
            }
        }).catch(function(err) {
            FontFurnace._rejectNewFont(err,newFont);
        });
    }

    static _acceptNewFont(response,newFont) {
        debug(`Accept Response: ${response}`);

       // let currentFontsList = settingGet('fonts')



        notify({'locDomain':'userAlerts','locSection':'addFontSave','locKey':'added'},'info',{'newFont':`${newFont}`});
    }

    static _rejectNewFont(response,newFont) {
        debug(`Reject Response: ${response}`);
        notify({'locDomain':'userAlerts','locSection':'addFontSave','locKey':'invalid'},'error',{'newFont':`${newFont}`});
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