import * as constants from './constants.js';

// Simplifies localization
export function loc(domain, section, key, locPlaceholders = {}) {
    return game.i18n.format(`${constants.moduleName}.${domain}.${section}.${key}`, locPlaceholders);
}

// Simplifies logging to the console
export function log(logString, type = 'info') {
    if (type === 'error') {
        console.error(`${constants.moduleTitle} | ${logString}`);
    } else if (type === 'warn') {
        console.warn(`${constants.moduleTitle} | ${logString}`);
    } else if (type === 'debug') {
        console.warn(`DEBUG | ${constants.moduleTitle} | ${logString}`);
    } else {
        console.log(`${constants.moduleTitle} | ${logString}`);
    }
}

// Simplifies showing a notification
export function notify(
    locMap = {},
    type = 'info',
    locPlaceholders,
    options = { permanent: false, localize: true },
) {
    const locString = loc(locMap.locDomain, locMap.locSection, locMap.locKey, locPlaceholders);
    ui.notifications.notify(`${constants.moduleTitle} | ${locString}`, type, {
        permanent: options.permanent,
        localize: options.localize,
    });
    log(locString, type);
}

// Simplified debug logging
export function debug(debugString, force = false) {
    if (game.modules.get('_dev-mode')) {
        try {
            const isDebugging = game.modules
                .get('_dev-mode')
                ?.api?.getPackageDebugValue(constants.moduleName);

            if (force || isDebugging) {
                log(debugString, 'debug');
            }
        } catch (e) {}
    }
}

// Determines if string is false or empty
export function isEmpty(string) {
    return !string || string.length === 0 || /^\s*$/.test(string);
}

// Checks if something is an object
export function isObject(variable) {
    return Object.prototype.toString.call(variable) === '[object Object]';
}

// Simplifies setting settings
export function settingSet(key, value) {
    game.settings.set(constants.moduleName, key, value);
}

// Simplifies getting settings
export function settingGet(key) {
    return game.settings.get(constants.moduleName, key);
}

// Gets setting details as object
export function settingDetails(key) {
    return game.settings.settings.get(`${constants.moduleName}.${key}`);
}

// Registers useful handlebars helper functions
export function setupHandlebarsHelpers() {
    Handlebars.registerHelper('concat', function (...params) {
        // Ignore the object appended by handlebars.
        if (isObject(params[params.length - 1])) {
            params.pop();
        }

        return params.join('');
    });
}

// Checks if there is an available font pack for a game system.  If no id provided, assumes the current system.
export function gameSystemPackAvailable(id = game.system.id) {
    return constants.gameSystemFontPacks.list.includes(id);
}

// Easily retrieve game system details. If no id provided, assumes the current system.
export function gameSystemDetails(id = game.system.id) {
    return constants.gameSystemFontPacks.details[id];
}

// Just for fun. Gets one of ten random panagrams to use as the preview alphabet.
export function panagramShuffler() {
    const shuffle = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    return loc('settings', 'manageFontsMenu', `panagrams.panagram-${shuffle}`);
}
