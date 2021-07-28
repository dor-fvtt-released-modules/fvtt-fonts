// import FontsPolyglotHandler from '../other_modules/fonts-polyglot-handler.js';
import { loc, shuffleArray } from '../utils.js';

export function getFontPreviewerTabData() {
    return {
        enabledFonts: getEnabledFonts(),
        completeAlphabet: loc('mainSettings', 'fontPreviewerTab', 'completeAlphabet'),
        panagramBlob: panagramCombiner(),
    };
}

export function getEnabledFonts() {
    return CONFIG.fontFamilies;
}

export function panagramCombiner() {
    const panagramCount = Number(loc('mainSettings', 'panagrams', 'panagramCount'));
    let panagramBlob = '';

    // Generate an array of all panagram ID #s, capping based on language
    let panagramArray = [...Array(panagramCount).keys()].map((i) => i + 1);

    // Randomize the order of the ID #s
    shuffleArray(panagramArray);

    // Convert ID #s into the panagram strings
    panagramArray.forEach(function (part, index) {
        this[index] = loc('mainSettings', 'panagrams', `panagram-${part}`);
    }, panagramArray);

    //Assemble the combined panagram blob
    let p = '';
    while (panagramArray.length) {
        p = panagramArray.shift();
        panagramBlob = panagramBlob + p + ' ';
    }
    return panagramBlob;
}
