import * as constants from './constants.js';
import {
    setupHandlebarsHelpers,
    preloadTemplates,
    settingGet,
    whenAvailable,
    loadConfigFontFamilies,
    redrawDrawings,
} from './utils.js';
import registerSettings from './settings.js';
import FvttFontsApi from './fvtt-fonts-api.js';
import { controlFontPackCollapseGroups } from './main_settings_form/font-manager-tab-logic.js';
import { installLocalFonts, loadLocalFonts } from './local-fonts.js';
import WebFontLoader from './web-font-loader.js';

// Register settings enumerated in settings.js
Hooks.once('init', async () => {
    WebFontLoader.loadWebFontApi();
    preloadTemplates();
    registerSettings();
    setupHandlebarsHelpers();
    FvttFontsApi.registerApi();
    if (settingGet('gmAddedFontsEnabled')[0]) {
        whenAvailable('WebFont', function () {
            WebFontLoader.loadGoogleFonts(settingGet('gmAddedFontsEnabled'));
        });
    }
});

Hooks.once('ready', async () => {
    await installLocalFonts();
    await loadLocalFonts();
    await loadConfigFontFamilies();
});

// Register with devMode module for debugging purposes
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(`${constants.moduleName}`);
});

Hooks.once('canvasReady', () => {
    redrawDrawings();
});

Hooks.on('renderFvttFontsMainSettingsForm', (app, html, options) => {
    controlFontPackCollapseGroups(app, html, options);
});
