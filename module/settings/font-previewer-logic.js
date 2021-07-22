// import FontsPolyglotHandler from '../other_modules/fonts-polyglot-handler.js';
import * as constants from '../constants.js';
import { loc, shuffleArray } from '../utils.js';

export default class FontPreviewerLogic {
    static panagramCombiner() {
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
            console.log(panagramArray);
            console.log(panagramBlob);
        }
        return panagramBlob;
    }
}
