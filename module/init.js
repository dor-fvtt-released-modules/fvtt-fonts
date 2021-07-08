import constants from './constants.js';
import registerSettings from './settings/settings.js';

// Register settings enumerated in settings.js
Hooks.once('init', () => {
  registerSettings();
});

// Register with devMode module for debugging purposes
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(`${constants.moduleName}`);
  });

Hooks.on('renderFontFurnaceAddFont', () => {
    let fontInput = document.getElementById('addFontName');
    fontInput.focus();
})