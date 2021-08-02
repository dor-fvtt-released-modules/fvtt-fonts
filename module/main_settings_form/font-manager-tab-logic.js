import * as constants from '../constants.js';
import {
    gameSystemDetails,
    gameSystemPackAvailable,
    loadConfigFontFamilies,
    loc,
    panagramShuffler,
    settingGet,
    settingSet,
} from '../utils.js';

export function getFontManagerTabData() {
    return {
        previewAlphabet: panagramShuffler(),
        installedFonts: assembleInstalledFonts(),
    };
}

export function assembleInstalledFonts() {
    let assembledFonts = {};

    // Add FoundryVTT default fonts
    let foundryDefaultFontsCollection = {};
    foundryDefaultFontsCollection['foundryDefaultFonts'] = {};
    for (const key of constants.foundryDefaultFonts) {
        foundryDefaultFontsCollection['foundryDefaultFonts'][key] = {
            name: key,
            sourceIconId: 'foundry-default-icon',
            sourceIconPath: 'icons/fvtt.png',
            sourceIconHoverText: loc('mainSettings', 'fontManagerTab', 'foundryDefaultIconHover'),
        };
    }
    mergeObject(assembledFonts, foundryDefaultFontsCollection);

    // Add GM-added fonts, if any have been added
    if (settingGet('gmAddedFonts').length > 0) {
        let enabledGmAddedFonts = settingGet('gmAddedFontsEnabled');
        let gmAddedFontsCollection = {};
        gmAddedFontsCollection['gmAddedFonts'] = {};
        for (const key of settingGet('gmAddedFonts')) {
            gmAddedFontsCollection['gmAddedFonts'][key] = {
                name: key,
                enabled: enabledGmAddedFonts.includes(key),
                sourceIconId: 'gm-added-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/gmIcon.png`,
                sourceIconHoverText: loc('mainSettings', 'fontManagerTab', 'gmAddedIconHover'),
            };
        }
        mergeObject(assembledFonts, gmAddedFontsCollection);
    }

    // Add FVTT Fonts default fonts
    if (settingGet('fvttFontsDefaultFontsVisible')) {
        let enabledFvttFontsDefaultFonts = settingGet('fvttFontsDefaultFontsEnabled');
        let fvttFontsDefaultFontsCollection = {};
        fvttFontsDefaultFontsCollection['fvttFontsDefaultFonts'] = {};
        for (const key of constants.fvttFontsDefaultFonts) {
            fvttFontsDefaultFontsCollection['fvttFontsDefaultFonts'][key] = {
                name: key,
                enabled: enabledFvttFontsDefaultFonts.includes(key),
                sourceIconId: 'fvtt-fonts-default-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/fvttFontsIcon.png`,
                sourceIconHoverText: loc(
                    'mainSettings',
                    'fontManagerTab',
                    'fvttFontsDefaultIconHover',
                    { title: constants.moduleTitle },
                ),
            };
        }
        mergeObject(assembledFonts, fvttFontsDefaultFontsCollection);
    }

    // Add Game system fonts if enabled in Settings
    if (gameSystemPackAvailable() && settingGet('gameSystemFontsVisible')) {
        let enabledGameSystemFonts = settingGet('gameSystemFontsEnabled');
        let currentGameSystemDetails = gameSystemDetails();
        let currentGameSystemFontsCollection = {};
        currentGameSystemFontsCollection['currentGameSystemFonts'] = {};
        for (const key of currentGameSystemDetails.fonts) {
            currentGameSystemFontsCollection['currentGameSystemFonts'][key] = {
                name: key,
                enabled: enabledGameSystemFonts.includes(key),
                sourceIconId: 'game-system-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/${currentGameSystemDetails.iconName}`,
                sourceIconHoverText: `${loc(
                    'mainSettings',
                    'fontManagerTab',
                    'gameSystemIconHover',
                )}`,
            };
        }
        mergeObject(assembledFonts, currentGameSystemFontsCollection);
    }

    // Add Dungeondraft default fonts if enabled in Settings
    if (settingGet('dungeondraftFontsVisible')) {
        let dungeondraftFonts = settingGet('dungeondraftFontsEnabled');
        let dungeondraftFontsCollection = {};
        dungeondraftFontsCollection['dungeondraftFonts'] = {};
        for (const key of constants.dungeondraftFonts) {
            dungeondraftFontsCollection['dungeondraftFonts'][key] = {
                name: key,
                enabled: dungeondraftFonts.includes(key),
                sourceIconId: 'dungeondraft-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/dungeondraftIcon.png`,
                sourceIconHoverText: loc('mainSettings', 'fontManagerTab', 'dungeondraftIconHover'),
            };
        }
        mergeObject(assembledFonts, dungeondraftFontsCollection);
    }

    // Add local fonts, if there are any.
    let localFonts = settingGet('localFonts');
    localFonts = Object.keys(localFonts);
    let localFontsEnabled = settingGet('localFontsEnabled');
    if (localFonts && localFonts.length > 0) {
        let localFontsCollection = {};
        localFontsCollection['localFonts'] = {};
        for (const key of localFonts) {
            localFontsCollection['localFonts'][key] = {
                name: key,
                enabled: localFontsEnabled.includes(key),
                sourceIconId: 'local-fonts-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/localIcon.png`,
                sourceIconHoverText: loc('mainSettings', 'fontManagerTab', 'localFontIconHover'),
            };
        }
        mergeObject(assembledFonts, localFontsCollection);
    }
    return assembledFonts;
}

// Listen for font removal of GM Added Fonts on the Font Manager tab
export function removeFontListener(html) {
    html.find("[name='removeFont']").on('click', async (event) => {
        const deadFont = event.currentTarget.attributes.data.value;
        const formData = {
            removeFont: deadFont,
        };
        this._updateObject(event, formData);
    });
}

export function controlFontPackCollapseGroups(app, html, options) {
    /* This entire function is credit toJoe Spandrusyszyn (illandril) and his 'Tidy Module Settings' module. Thank you!
     */
    const fontManagerTab = app.form.querySelector('.tab[data-tab="fontManager"]');
    const fontManagerTabNav = app.form.querySelector('.tabs > .item[data-tab="fontManager"]');
    const fontPacksList = fontManagerTab.querySelector('.font-packs-list');

    const headers = fontPacksList.querySelectorAll(`.${constants.cssPackHeader}`);
    for (const header of headers) {
        header.addEventListener(
            'click',
            () => {
                expandCollapseGroup(header);
                resetFontManagerTabSize(app);
            },
            false,
        );
        expandCollapseGroup(header);
    }
    if (fontManagerTabNav.classList.contains('active')) {
        resetFontManagerTabSize(app);
    }
}

export function expandCollapseGroup(header, optForceSame) {
    // Wrap in an if block in case the collapsible is destroyed (ie GM added fonts emptied) so classList can't be called
    if (header) {
        const wasCollapsed = header.classList.contains(constants.cssCollapse);
        const expand = optForceSame ? !wasCollapsed : wasCollapsed;
        if (expand) {
            header.classList.remove(constants.cssCollapse);
        } else {
            header.classList.add(constants.cssCollapse);
        }

        let sibling = header.nextElementSibling;
        while (sibling && !sibling.classList.contains(constants.cssPackHeader)) {
            if (expand) {
                sibling.classList.remove(constants.cssHidden);
            } else {
                sibling.classList.add(constants.cssHidden);
            }
            sibling = sibling.nextElementSibling;
        }
    }
}

export function resetFontManagerTabSize(app) {
    // We shouldn't need to lookup and reset the scrollTop... and don't in the standard foundry,
    // but the CSS applied by some skins (including Ernie's Modern UI) causes some browsers to
    // forget where the settings dialog was scrolled to when the height is recalculated.
    const scrollRegion = app.form.querySelector('.font-packs-list');
    const initialScrollTop = scrollRegion.scrollTop;
    app.setPosition({ height: 'auto' });
    scrollRegion.scrollTop = initialScrollTop;
}

export function renderWithoutCollapse(packName) {
    Hooks.once('renderFvttFontsMainSettingsForm', (app) => {
        let header = app.form.querySelector(`#${packName}Header`);
        expandCollapseGroup(header);
        resetFontManagerTabSize(app);
    });
}
