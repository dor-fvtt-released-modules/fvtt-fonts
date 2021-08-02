import { settingGet, notify } from '../utils.js';

export function getPreferencesTabData() {
    return {
        categorySort: settingGet('categorySort'),
        localFontFolder: settingGet('localFontFolder'),
    };
}

export async function localFontFolderInputListener(html) {
    html.find('input#localFontFolderInput').on('change', async (event) => {
        let newPath = event.target.value;
        newPath.concat('/');
        const formData = {
            localFontFolder: newPath,
        };
        this._updateObject(event, formData);
    });
}

export async function messageLocalFontFolderChange() {
    let localFonts = await settingGet('localFonts');
    let count = Object.keys(localFonts).length;
    let locKey = count === 0 ? 'noLocalFontsFound' : 'localFontsFound';
    notify(
        {
            locDomain: 'userAlerts',
            locSection: 'localFonts',
            locKey: locKey,
        },
        'info',
        { count: count },
    );
}
