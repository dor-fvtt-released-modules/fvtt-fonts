import { settingGet } from '../utils.js';

export function getFontPacksTabData() {
    return {
        fvttFontsDefaultFontsVisible: settingGet('fvttFontsDefaultFontsVisible'),
        dungeondraftFontsVisible: settingGet('dungeondraftFontsVisible'),
    };
}
