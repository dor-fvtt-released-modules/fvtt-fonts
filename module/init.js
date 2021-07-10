import constants from "./constants.js";
import { setupHandlebarsHelpers } from "./utils.js";
import registerSettings from "./settings/settings.js";

// Register settings enumerated in settings.js
Hooks.once("init", () => {
  registerSettings();
  setupHandlebarsHelpers();
});

// Register with devMode module for debugging purposes
Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(`${constants.moduleName}`);
});

Hooks.on("renderFvttFontsAddFont", () => {
  let fontInput = document.getElementById("addFontName");
  fontInput.focus();
});
