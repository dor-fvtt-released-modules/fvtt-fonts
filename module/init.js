import * as constants from './constants.js';
import { setupHandlebarsHelpers, preloadTemplates } from './utils.js';
import registerSettings from './settings/settings.js';
import FvttFontsApi from './fvtt-fonts-api.js';

// Register settings enumerated in settings.js
Hooks.once('init', () => {
    preloadTemplates();
    registerSettings();
    setupHandlebarsHelpers();
    FvttFontsApi.registerApi();
});

// Register with devMode module for debugging purposes
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(`${constants.moduleName}`);
});

Hooks.on('renderFvttFontsAddFont', () => {
    let fontInput = document.getElementById('addFontName');
    fontInput.focus();
});
