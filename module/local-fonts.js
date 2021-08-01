import { settingGet, settingSet, log } from './utils.js';

// Checks the set localFontFolder for font files, returns an object including font name/filename/path/extension
export async function getLocalFontObj() {
    const lfp = settingGet('localFontFolder');
    let fontPaths = await FilePicker.browse('data', lfp, {
        extensions: ['.ttf', '.woff', '.woff2', '.otf'],
    });
    let fonts = {};
    fontPaths.files.forEach((fontPath) => {
        let fontFile = fontPath.split('\\').pop().split('/').pop();
        let fontName = fontFile.split('.').shift().replace('%20', ' ');
        let fontExtension = fontFile.split('.').pop();
        let fontFormat = '';

        if (fontExtension === '.ttf') {
            fontFormat = 'truetype';
        } else if (fontExtension === '.otf') {
            fontFormat = 'opentype';
        } else if (fontExtension === '.woff') {
            fontFormat = 'woff';
        } else if (fontExtension === '.woff2') {
            fontFormat = 'woff2';
        }

        fonts[fontName] = {
            name: fontName,
            extension: fontExtension,
            format: fontFormat,
            filename: fontFile,
            path: fontPath,
        };
    });
    return fonts;
}

export async function installLocalFonts() {
    let fonts = await getLocalFontObj();
    await settingSet('localFonts', fonts);
}

export async function loadLocalFonts() {
    let localFonts = await settingGet('localFonts');
    const fontSheet = $('link[href="modules/fvtt-fonts/styles/fvtt-font-packs.css"]')[0].sheet;

    for (let [key, value] of Object.entries(localFonts)) {
        fontSheet.insertRule(
            `@font-face {font-family: "${value.name}"; src:url("/${value.path}") format("${value.format}");`,
            log(`Local font '${key}' loaded.`),
        );
    }
}
