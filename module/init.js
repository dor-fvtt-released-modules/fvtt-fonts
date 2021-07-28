import * as constants from './constants.js';
import {
    setupHandlebarsHelpers,
    preloadTemplates,
    settingGet,
    whenAvailable,
    loadConfigFontFamilies,
} from './utils.js';
import registerSettings from './settings/settings.js';
import FvttFontsApi from './fvtt-fonts-api.js';
import FontManagerLogic from './settings/font-manager-logic.js';
import WebFontLoader from './web-font-loader.js';

// Register settings enumerated in settings.js
Hooks.once('init', () => {
    WebFontLoader.loadWebFontApi();
    preloadTemplates();
    registerSettings();
    setupHandlebarsHelpers();
    FvttFontsApi.registerApi();
    whenAvailable('WebFont', function () {
        WebFontLoader.loadGoogleFonts(settingGet('gmAddedFontsEnabled'));
    });
    loadConfigFontFamilies();
});

// Register with devMode module for debugging purposes
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(`${constants.moduleName}`);
});

Hooks.on('renderFvttFontsMainSettingsForm', (app, html, options) => {
    FontManagerLogic.controlFontPackCollapseGroups(app, html, options);
});
