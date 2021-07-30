import * as constants from './constants.js';

// Simplifies localization
export function loc(domain, section, key, locPlaceholders = {}) {
    return game.i18n.format(`${constants.moduleName}.${domain}.${section}.${key}`, locPlaceholders);
}

// Simplifies logging to the console
export async function log(logString, type = 'info') {
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
export async function notify(
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
    await log(locString, type);
}

// Simplified debug logging
export async function debug(debugString, force = false) {
    if (game.modules.get('_dev-mode')) {
        try {
            const isDebugging = game.modules
                .get('_dev-mode')
                ?.api?.getPackageDebugValue(constants.moduleName);

            if (force || isDebugging) {
                await log(debugString, 'debug');
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

// Waits for another JS to load before executing method
export function whenAvailable(name, callback) {
    let interval = 10; // ms
    window.setTimeout(function () {
        if (window[name]) {
            callback(window[name]);
        } else {
            whenAvailable(name, callback);
        }
    }, interval);
}

// Simplifies setting settings
export async function settingSet(key, value) {
    await game.settings.set(constants.moduleName, key, value);
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

    Handlebars.registerHelper('isdefined', function (value) {
        return value !== undefined;
    });
}

/**
 * Preloads templates for partials
 */
export function preloadTemplates() {
    let templates = [
        'templates/main_settings_tabs/FontPreviewerTab.hbs',
        'templates/main_settings_tabs/FontManagerTab.hbs',
        'templates/main_settings_tabs/AddFontTab.hbs',
        'templates/main_settings_tabs/FontPacksTab.hbs',
        'templates/main_settings_tabs/PreferencesTab.hbs',
        'templates/main_settings_tabs/font_manager_categories/FoundryDefaultFontsPack.hbs',
        'templates/main_settings_tabs/font_manager_categories/GmAddedFontsPack.hbs',
        'templates/main_settings_tabs/font_manager_categories/GmLocalFontsPack.hbs',
        'templates/main_settings_tabs/font_manager_categories/FvttFontsDefaultFontsPack.hbs',
        'templates/main_settings_tabs/font_manager_categories/CurrentGameSystemFontsPack.hbs',
        'templates/main_settings_tabs/font_manager_categories/DungeondraftDefaultFontsPack.hbs',
        'templates/main_settings_tabs/font_manager_categories/FontsApiFontPacks.hbs',
    ];

    templates = templates.map((t) => `modules/${constants.moduleName}/${t}`);
    loadTemplates(templates);
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
    const panagramCount = Number(loc('mainSettings', 'panagrams', 'panagramCount'));
    const shuffle = Math.floor(Math.random() * (panagramCount - 1 + 1) + 1);
    return loc('mainSettings', 'panagrams', `panagram-${shuffle}`);
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export async function loadConfigFontFamilies() {
    let enabledFontArray = [];
    enabledFontArray = enabledFontArray.concat(
        constants.foundryDefaultFonts,
        settingGet('gmAddedFontsEnabled'),
    );

    if (settingGet('fvttFontsDefaultFontsVisible')) {
        enabledFontArray = enabledFontArray.concat(settingGet('fvttFontsDefaultFontsEnabled'));
    }
    if (settingGet('dungeondraftFontsVisible')) {
        enabledFontArray = enabledFontArray.concat(settingGet('dungeondraftFontsEnabled'));
    }

    if (gameSystemPackAvailable() && settingGet('gameSystemFontsVisible')) {
        enabledFontArray = enabledFontArray.concat(settingGet('gameSystemFontsEnabled'));
    }

    //enabledFontArray.concat(settingGet('fontsApiFontsEnabled'));

    if (!settingGet('categorySort')) {
        enabledFontArray.sort();
    }
    CONFIG.fontFamilies = enabledFontArray;
}

export async function redrawDrawings() {
    canvas?.drawings?.placeables
        .filter((drawing) => drawing.data.type === 't')
        .forEach((d) => d.draw());
}
