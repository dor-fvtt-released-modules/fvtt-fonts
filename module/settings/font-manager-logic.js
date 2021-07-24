import * as constants from '../constants.js';
import { gameSystemDetails, gameSystemPackAvailable, loc, settingGet } from '../utils.js';

export default class FontManagerLogic {
    static assembleInstalledFonts() {
        let assembledFonts = {};

        // Add FoundryVTT default fonts
        let foundryDefaultFonts = {};
        for (const key of constants.foundryDefaultFonts) {
            foundryDefaultFonts[key] = {
                name: key,
                installed: true, //TODO Replace with function to determine install status
                removable: false, // Default Foundry VTT fonts cannot be removed.
                sourceIconId: 'foundry-default-icon',
                sourceIconPath: 'icons/fvtt.png',
                sourceIconHoverText: loc('settings', 'manageFontsMenu', 'foundryDefaultIconHover'),
            };
            mergeObject(assembledFonts, foundryDefaultFonts);
        }

        // Add FVTT Fonts default fonts
        if (settingGet('fvttFontsDefaultFontsVisible')) {
            let fvttFontsDefaultFonts = {};
            for (const key of constants.fvttFontsDefaultFonts) {
                fvttFontsDefaultFonts[key] = {
                    name: key,
                    installed: true, //TODO Replace with function to determine install status
                    removable: true, // Default Foundry VTT fonts cannot be removed. TODO implement removal lol
                    sourceIconId: 'fvtt-fonts-default-icon',
                    sourceIconPath: `/modules/${constants.moduleName}/icons/fvttFontsIcon.png`,
                    sourceIconHoverText: loc(
                        'settings',
                        'manageFontsMenu',
                        'fvttFontsDefaultIconHover',
                        { title: constants.moduleTitle },
                    ),
                };
                mergeObject(assembledFonts, fvttFontsDefaultFonts);
            }
        }

        // Add Game system fonts if enabled in Settings
        if (gameSystemPackAvailable() && settingGet('gameSystemFontsVisible')) {
            let currentGameSystemFonts = {};
            let currentGameSystemDetails = gameSystemDetails();
            for (const key of currentGameSystemDetails.fonts) {
                currentGameSystemFonts[key] = {
                    name: key,
                    installed: true, // TODO Replace with function to determine install status
                    removable: true, // TODO implement removal lol
                    sourceIconId: 'game-system-icon',
                    sourceIconPath: `/modules/${constants.moduleName}/icons/${currentGameSystemDetails.iconName}`,
                    sourceIconHoverText: `${loc(
                        'settings',
                        'manageFontsMenu',
                        'gameSystemIconHover',
                    )} - ${game.system.data.title}`,
                };
                mergeObject(assembledFonts, currentGameSystemFonts);
            }
        }

        // Add Dungeondraft default fonts if enabled in Settings
        if (settingGet('dungeondraftFontsVisible')) {
            let dungeondraftDefaultFonts = {};
            for (const key of constants.dungeondraftDefaultFonts) {
                dungeondraftDefaultFonts[key] = {
                    name: key,
                    installed: true, //TODO Replace with function to determine install status
                    removable: true, // Default Foundry VTT fonts cannot be removed. TODO implement removal lol
                    sourceIconId: 'dungeondraft-default-icon',
                    sourceIconPath: `/modules/${constants.moduleName}/icons/dungeondraftIcon.png`,
                    sourceIconHoverText: loc(
                        'settings',
                        'manageFontsMenu',
                        'dungeondraftIconHover',
                    ),
                };
                mergeObject(assembledFonts, dungeondraftDefaultFonts);
            }
        }

        return assembledFonts;
    }
}
