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
    'controls/users/Select',
    'controls/users/Entry',
    'Locale',

    'css!package/quiqqer/formbuilder/bin/fields/Users.css'

], function (Field, UserSelect, UserEntry, QUILocale) {
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
            new Element('span', {
                'class': 'qui-formfield-settings-setting-title',
                html   : QUILocale.get(
                    'quiqqer/formbuilder',
                    'field.users.settings.userlist.label'
                )
            }).inject(Elm);

            this.$SettingsContainer = new Element('div', {
                styles: {
                    clear: 'both'
                }
            }).inject(Elm);

            this.$UserInput = new UserSelect().inject(this.$SettingsContainer);

            // add user to the input
            var users = this.getAttribute('users');

            users = users.clean();

            self.$UserInput.addEvents({
                onChange: function (Control) {
                    self.setAttribute('users', Control.getValue().split(','));
                    self.refresh();
                }
            });

            for (var i = 0, len = users.length; i < len; i++) {
                self.$UserInput.addItem(users[i]);
            }
        },

        /**
         * Add a user to the form preview
         *
         * @param {Number} userId
         */
        addUser: function (userId) {
            var Body    = this.getBody();
            var UserElm = Body.getElement('div.users-entry[data-id="' + userId + '"]');

            if (UserElm) {
                return;
            }

            new UserEntry(userId).inject(this.getBody());
        },

        /**
         * Remove user from form preview
         *
         * @param {Number} userId
         */
        removeUser: function (userId) {
            var Body    = this.getBody();
            var UserElm = Body.getElement('div.users-entry[data-id="' + userId + '"]');

            if (UserElm) {
                UserElm.destroy();
            }
        }
    });
});
