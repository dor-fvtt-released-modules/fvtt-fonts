import * as constants from '../constants.js';
import { loc, gameSystemPackAvailable } from '../utils.js';
import { FvttFontsMainSettingsForm } from './fvtt-fonts-main-settings-form.js';

// Register default settings
export default function registerSettings() {
    // Main settings menu
    game.settings.registerMenu(constants.moduleName, 'mainSettingsForm', {
        label: loc('mainSettings', 'settingsButton', 'label'),
        type: FvttFontsMainSettingsForm,
        restricted: true,
    });
    // Stores fonts the GM has added to the system successfully
    game.settings.register(constants.moduleName, 'gmAddedFonts', {
        scope: 'world',
        config: false,
        default: [],
        type: Array,
        //onChange: () => FvttFonts.render({settings: true})
    });
    // Stores which of the gm-added fonts are currently enabled
    game.settings.register(constants.moduleName, 'gmAddedFontsEnabled', {
        scope: 'world',
        config: false,
        default: [],
        type: Array,
        //onChange: () => FvttFonts.render({settings: true})
    });
    // Determines if the module default fonts should be visible in the font manager
    game.settings.register(constants.moduleName, 'fvttFontsDefaultFontsVisible', {
        scope: 'world',
        config: false,
        default: true,
        type: Boolean,
        //onChange: () => FvttFonts.render({settings: true})
    });
    // Determines which of the module default fonts, if visible, are enabled
    game.settings.register(constants.moduleName, 'fvttFontsDefaultFontsEnabled', {
        scope: 'world',
        config: false,
        default: [],
        type: Array,
        //onChange: () => FvttFonts.render({settings: true})
    });
    // Determines if the dungeondraft fonts are visible in the font manager
    game.settings.register(constants.moduleName, 'dungeondraftFontsVisible', {
        scope: 'world',
        config: false,
        default: false,
        type: Boolean,
    });
    // Determines which of the dungeondraft fonts, if visible, are enabled
    game.settings.register(constants.moduleName, 'dungeondraftFontsEnabled', {
        scope: 'world',
        config: false,
        default: [],
        type: Array,
        //onChange: () => FvttFonts.render({settings: true})
    });
    // Only registers the game system settings if a pack is available for that system
    if (gameSystemPackAvailable()) {
        // Determines if the game system fonts are visible in the font manager
        game.settings.register(constants.moduleName, 'gameSystemFontsVisible', {
            scope: 'world',
            config: false,
            default: false,
            type: Boolean,
        });
        // Determines which of the game system fonts, if visible, are enabled
        game.settings.register(constants.moduleName, 'gameSystemFontsEnabled', {
            scope: 'world',
            config: false,
            default: [],
            type: Array,
            //onChange: () => FvttFonts.render({settings: true})
        });
    }
    // Stores font packs added by other modules via the Fonts API
    game.settings.register(constants.moduleName, 'fontsApiFontPacks', {
        scope: 'world',
        config: false,
        default: {},
        type: Object,
    });
    // Determines which fonts from packs passed via the Font API are enabled
    game.settings.register(constants.moduleName, 'fontsApiFontsEnabled', {
        scope: 'world',
        config: false,
        default: [],
        type: Array,
        //onChange: () => FvttFonts.render({settings: true})
    });
    // Overrides the default alphabetical sort behavior when inserting fonts into CONFIG.fontFamilies
    game.settings.register(constants.moduleName, 'categorySort', {
        scope: 'world',
        config: false,
        default: false,
        type: Boolean,
    });
}
