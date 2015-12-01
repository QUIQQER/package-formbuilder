/**
 * Checkbox fields
 *
 * @module package/quiqqer/formbuilder/bin/fields/Users
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 * @require qui/controls/buttons/Button
 * @require qui/utils/Elements
 * @require controls/users/Input
 * @require css!package/quiqqer/formbuilder/bin/fields/Checkbox.css
 */
define('package/quiqqer/formbuilder/bin/fields/Users', [

    'package/quiqqer/formbuilder/bin/FormField',
    'qui/controls/buttons/Button',
    'qui/utils/Elements',
    'controls/users/Input',
    'controls/users/Entry',

    'css!package/quiqqer/formbuilder/bin/fields/Users.css'

], function (Field, QUIButton, QUIElements, UserInput, UserEntry) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Users',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            users     : [],
            mailusers : false,
            selectable: true
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
         * Refresh the display
         */
        refresh: function () {
            if (!this.getBody()) {
                return;
            }

            this.getBody().set('html', '');

            var users = this.getAttribute('users');

            users = users.clean();

            for (var i = 0, len = users.length; i < len; i++) {
                if (users[i]) {
                    this.addUser(users[i]);
                }
            }
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.refresh();
        },

        /**
         * event : on get Settings
         * create the settings - little bit complicated
         *
         * @param {Object} self
         * @param {HTMLElement} Elm
         */
        $onGetSettings: function (self, Elm) {

            var myself = this;

            new Element('div', {
                html   : '<label>' +
                         '    <input type="checkbox" name="mailusers" />' +
                         '    <span class="qui-formfield-settings-setting-title">' +
                         '         Als Mail Empfänger' +
                         '    </span>' +
                         '</label>' +
                         '<label>' +
                         '    <input type="checkbox" name="selectable" />' +
                         '    <span class="qui-formfield-settings-setting-title">' +
                         '         Vom Benutzer auswählbar' +
                         '    </span>' +
                         '</label>',
                'class': 'qui-formfield-settings-setting __checkbox'
            }).inject(Elm);

            Elm.getElements('[type="checkbox"]').addEvents({
                change: function() {
                    myself.setAttribute(
                        this.name,
                        this.checked ? true : false
                    );
                }
            });

            if (this.getAttribute('mailusers')) {
                Elm.getElement('[name="mailusers"]').checked = true;
            }

            if (this.getAttribute('selectable')) {
                Elm.getElement('[name="selectable"]').checked = true;
            }


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
                        var value = Input.getValue().trim(',').split(',');

                        self.setAttribute('users', value);
                        self.refresh();
                    }
                },
                styles: {
                    width: '100%'
                }
            }).inject(this.$SettingsContainer);


            // add user to the input
            var users = this.getAttribute('users');

            users = users.clean();

            for (var i = 0, len = users.length; i < len; i++) {
                if (users[i]) {
                    this.$UserInput.addUser(users[i]);
                }
            }
        },

        /**
         * Add a choice
         *
         * @param {Number} userId
         */
        addUser: function (userId) {
            if (!userId) {
                return;
            }

            new UserEntry(userId).inject(this.getBody());
        }
    });
});
