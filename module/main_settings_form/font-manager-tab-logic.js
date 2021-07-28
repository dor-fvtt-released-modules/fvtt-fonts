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

export function controlFontPackCollapseGroups(app, html, options) {
    /* This entire function is credit toJoe Spandrusyszyn (illandril) and his 'Tidy Module Settings' module. Thank you!
     */

    const cssCollapse = 'font-pack--collapse';
    const cssHidden = 'font-pack--hidden';
    const cssPackHeader = 'pack-header';

    const fontManagerTab = app.form.querySelector('.tab[data-tab="fontManager"]');
    const fontManagerTabNav = app.form.querySelector('.tabs > .item[data-tab="fontManager"]');

    const expandCollapseGroup = (header, optForceSame) => {
        const wasCollapsed = header.classList.contains(cssCollapse);
        const expand = optForceSame ? !wasCollapsed : wasCollapsed;
        if (expand) {
            header.classList.remove(cssCollapse);
        } else {
            header.classList.add(cssCollapse);
        }

        let sibling = header.nextElementSibling;
        while (sibling && !sibling.classList.contains(cssPackHeader)) {
            if (expand) {
                sibling.classList.remove(cssHidden);
            } else {
                sibling.classList.add(cssHidden);
            }
            sibling = sibling.nextElementSibling;
        }
    };

    const resetSettingsWindowSize = () => {
        // We shouldn't need to lookup and reset the scrollTop... and don't in the standard foundry,
        // but the CSS applied by some skins (including Ernie's Modern UI) causes some browsers to
        // forget where the settings dialog was scrolled to when the height is recalculated.
        const scrollRegion = app.form.querySelector('.font-packs-list');
        const initialScrollTop = scrollRegion.scrollTop;
        app.setPosition({ height: 'auto' });
        scrollRegion.scrollTop = initialScrollTop;
    };

    const fontPacksList = fontManagerTab.querySelector('.font-packs-list');

    const headers = fontPacksList.querySelectorAll(`.${cssPackHeader}`);
    for (const header of headers) {
        header.addEventListener(
            'click',
            () => {
                expandCollapseGroup(header);
                resetSettingsWindowSize();
            },
            false,
        );
        expandCollapseGroup(header);
    }
    if (fontManagerTabNav.classList.contains('active')) {
        resetSettingsWindowSize();
    }
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

    // Add FVTT Fonts default fonts
    if (settingGet('fvttFontsDefaultFontsVisible')) {
        let fvttFontsDefaultFontsCollection = {};
        fvttFontsDefaultFontsCollection['fvttFontsDefaultFonts'] = {};
        for (const key of constants.fvttFontsDefaultFonts) {
            fvttFontsDefaultFontsCollection['fvttFontsDefaultFonts'][key] = {
                name: key,
                enabled: false, //TODO Replace with function to determine install status
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

    // Add Game system fonts if enabled in Settings
    if (gameSystemPackAvailable() && settingGet('gameSystemFontsVisible')) {
        let currentGameSystemDetails = gameSystemDetails();
        let currentGameSystemFontsCollection = {};
        currentGameSystemFontsCollection['currentGameSystemFonts'] = {};
        for (const key of currentGameSystemDetails.fonts) {
            currentGameSystemFontsCollection['currentGameSystemFonts'][key] = {
                name: key,
                enabled: false, // TODO Replace with function to determine install status
                sourceIconId: 'game-system-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/${currentGameSystemDetails.iconName}`,
                sourceIconHoverText: `${loc(
                    'mainSettings',
                    'fontManagerTab',
                    'gameSystemIconHover',
                )} - ${game.system.data.title}`,
            };
        }
        mergeObject(assembledFonts, currentGameSystemFontsCollection);
    }

    // Add Dungeondraft default fonts if enabled in Settings
    if (settingGet('dungeondraftFontsVisible')) {
        let dungeondraftDefaultFontsCollection = {};
        dungeondraftDefaultFontsCollection['dungeondraftDefaultFonts'] = {};
        for (const key of constants.dungeondraftDefaultFonts) {
            dungeondraftDefaultFontsCollection['dungeondraftDefaultFonts'][key] = {
                name: key,
                enabled: false, //TODO Replace with function to determine install status
                sourceIconId: 'dungeondraft-default-icon',
                sourceIconPath: `/modules/${constants.moduleName}/icons/dungeondraftIcon.png`,
                sourceIconHoverText: loc('mainSettings', 'fontManagerTab', 'dungeondraftIconHover'),
            };
        }
        mergeObject(assembledFonts, dungeondraftDefaultFontsCollection);
    }

    return assembledFonts;
}
export function removeFontListener(html) {
    // Listen for font removal of GM Added Fonts on the Font Manager tab
    html.find("[name='remove-font-button']").on('click', async (event) => {
        const removedFont = event.currentTarget.attributes.data.value;
        let gmAddedFonts = settingGet('gmAddedFonts');
        let gmAddedFontsEnabled = settingGet('gmAddedFontsEnabled');

        if (gmAddedFontsEnabled.includes(removedFont)) {
            gmAddedFontsEnabled = gmAddedFontsEnabled.filter((font) => font !== removedFont);
            gmAddedFontsEnabled.sort();
            await settingSet('gmAddedFontsEnabled', gmAddedFontsEnabled);
        }

        if (gmAddedFonts.includes(removedFont)) {
            gmAddedFonts = gmAddedFonts.filter((font) => font !== removedFont);
            gmAddedFonts.sort();
            await settingSet('gmAddedFonts', gmAddedFonts);
            await loadConfigFontFamilies();
            this.render(); // TODO solve this closing the collapsible
        }
    });
}
