import { constants } from '../constants.js';
import { loc } from '../utils.js';

export class FvttFontsMainSettingsForm extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'fvtt-fonts-main-settings-form',
            title: loc('mainSettings', 'mainSettingsForm'),
            template: `modules/${constants.moduleName}/templates/fvtt-fonts-main-settings-form.html`,
            width: 750,
            height: 'auto',
            closeOnSubmit: true,
            submitOnChange: true,
        });
    }
}
