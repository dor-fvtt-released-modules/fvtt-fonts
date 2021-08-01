import { settingGet } from '../utils.js';

export function getPreferencesTabData() {
    return {
        categorySort: settingGet('categorySort'),
        localFontFolder: settingGet('localFontFolder'),
    };
}
