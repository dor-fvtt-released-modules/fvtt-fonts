import constants from './constants.js';
import registerSettings from './settings/settings.js';

Hooks.once('init', () => {
  registerSettings();
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(`${constants.moduleName}`);
  });