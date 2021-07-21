import * as constants from './constants.js';

export default class FvttFontsApi {
    static registerApi() {
        game.modules.get(constants.moduleName).api = {
            registerFonts: FvttFontsApi.registerLocalFonts,
        };
    }

    static registerLocalFonts() {
        return true;
    }
}
