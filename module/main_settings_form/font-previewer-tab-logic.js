// import FontsPolyglotHandler from '../other_modules/fonts-polyglot-handler.js';
import { loc, shuffleArray } from '../utils.js';

export function getFontPreviewerTabData() {
    return {
        configFontFamilies: CONFIG.fontFamilies,
        completeAlphabet: loc('mainSettings', 'fontPreviewerTab', 'completeAlphabet'),
        panagramBlob: panagramCombiner(),
    };
}

export function fontPreviewerPreviewListener(html) {
    html.find('#font-previewer-previewed-font').on('change', async (event) => {
        const previewedFont = event.currentTarget.value; //font select's value

        html.find('#font-previewer-preview-text').each(function () {
            this.children['previewer-font-preview-title'].innerText = previewedFont;
            this.style.font = `120% ${previewedFont}`;
            this.classList.replace('font-preview-text--hidden', 'font-preview-text');
        }, previewedFont);
        this.setPosition({ height: 'auto' });
    });
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
