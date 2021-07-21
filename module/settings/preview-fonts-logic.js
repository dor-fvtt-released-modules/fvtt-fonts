// import FontsPolyglotHandler from '../other_modules/fonts-polyglot-handler.js';
import * as constants from '../constants.js';
import { loc } from '../utils.js';

export default class PreviewFontsLogic {
    static assembleEnabledFonts() {
        const configFonts = CONFIG.fontFamilies;
        let enabledFonts = {};

        for (const key of configFonts) {
            enabledFonts[key] = {
                name: key,
                sourceIconId: 'foundry-default-icon',
                sourceIconPath: 'icons/fvtt.png',
                sourceIconHoverText: loc('settings', 'manageFontsMenu', 'foundryDefaultIconHover'),
            };
        }
        return enabledFonts;
    }

    static _findFontSource(font) {}
}
