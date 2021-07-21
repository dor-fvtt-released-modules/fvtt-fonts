import { FONTS } from '../polyglot/polyglot.js';

export default class FontsPolyglotHandler {
    static polyglotFontsEnabled() {
        if (game.modules.get('polyglot').active && game.settings.get('polyglot', 'exportFonts')) {
            return true;
        }
    }

    static polyglotFontList() {
        return FONTS;
    }
}
