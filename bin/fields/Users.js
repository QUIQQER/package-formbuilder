/**
 * Checkbox fields
 *
 * @module package/quiqqer/formbuilder/bin/fields/Users
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 * @require qui/controls/buttons/Button
 * @require qui/utils/Elements
 * @require css!package/quiqqer/formbuilder/bin/fields/Checkbox.css
 */
define('package/quiqqer/formbuilder/bin/fields/Users', [

    'package/quiqqer/formbuilder/bin/FormField',
    'qui/controls/buttons/Button',
    'qui/utils/Elements',
    'controls/users/Input',

    'css!package/quiqqer/formbuilder/bin/fields/Users.css'

], function (Field, QUIButton, QUIElements, UserInput) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Users',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            users: []
        },

        initialize: function (options) {

            this.parent(options);

            this.$SettingsContainer = null;
            this.$UserInput         = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {

            var users = this.getAttribute('users'),
                Body  = this.getBody();


        },

        /**
         * event : on get Settings
         * create the settings - little bit complicated
         *
         * @param {Object} self
         * @param {HTMLElement} Elm
         */
        $onGetSettings: function (self, Elm) {
            var users = this.getAttribute('users');

            new Element('span', {
                'class': 'qui-formfield-settings-setting-title',
                html   : 'Benutzer'
            }).inject(Elm);

            this.$SettingsContainer = new Element('div', {
                styles: {
                    clear: 'both'
                }
            }).inject(Elm);

            this.$UserInput = new UserInput({
                events: {
                    onChange: function (Input) {
                        console.log(Input.getValue());
                    }
                },
                styles : {
                    width : '100%'
                }
            }).inject(this.$SettingsContainer);

        },

        /**
         * Add a choice
         *
         * @param {Number} userId
         *
         * @return {HTMLElement}
         */
        addUser: function (userId) {

        }
    });
});
