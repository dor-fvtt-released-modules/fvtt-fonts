import constants from './constants.js';

// Checks for Polyglot module, shows additional setting if present and enabled
function checkPolyglot() {
    if (game.modules.get('polyglot').active)
        game.settings.register(constants.moduleName, 'testPolyglotSetting', {
            name: game.i18n.localize(`${constants.moduleName}.testPolyglotSetting.title`),
            hint: game.i18n.localize(`${constants.moduleName}.testPolyglotSetting.hint`),
            scope: 'world',
            config: true,
            default: false,
            type: Boolean,
            onChange: () => console.log(game.i18n.localize(`${constants.moduleName}.testPolyglotSetting.toggled`))
        });
}

// Registers default settings
export default function registerSettings() {

  game.settings.register(constants.moduleName, 'tempFontSetting', {
    name: game.i18n.localize(`${constants.moduleName}.tempFontSetting.title`),
    hint: game.i18n.localize(`${constants.moduleName}.tempFontSetting.hint`),
    scope: 'world',
    config: true,
    default: constants.defaultFonts,
    type: String,
    onChange: () => console.log(game.i18n.localize(`${constants.moduleName}.temtFontSetting.changed`)) /* Fonts.render({settings: true}) */
  }),
  
  game.settings.register(constants.moduleName, 'testSetting', {
    name: game.i18n.localize(`${constants.moduleName}.testSetting.title`),
    hint: game.i18n.localize(`${constants.moduleName}.testSetting.hint`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: () => console.log(game.i18n.localize(`${constants.moduleName}.testPolyglotSetting.toggled`))
  });

  // Check for Polyglot
  checkPolyglot()
}