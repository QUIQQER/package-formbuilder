/**
 * Name fields
 *
 * @module package/quiqqer/formbuilder/bin/fields/Name
 * @author www.pcsg.de (Henning Leutz)
 *
 * @reuquire package/quiqqer/formbuilder/bin/FormField
 * @reuquire text!package/quiqqer/formbuilder/bin/fields/Name.html
 * @reuquire css!package/quiqqer/formbuilder/bin/fields/Name.css
 */
define('package/quiqqer/formbuilder/bin/fields/Name', [

    'package/quiqqer/formbuilder/bin/FormField',
    'text!package/quiqqer/formbuilder/bin/fields/Name.html',

    'css!package/quiqqer/formbuilder/bin/fields/Name.css'

], function (Field, body) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Name',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            extend: false
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody().set('html', body);

            if (this.getAttribute('extend')) {
                this.getBody().addClass('form-name--extend');
            }
        },

        /**
         * event : on get Settings
         * create the settings - little bit complicated
         *
         * @param {Object} self -
         * @param {HTMLElement} Elm
         */
        $onGetSettings: function (self, Elm) {

            this.$SettingsContainer = new Element('div').inject(Elm);

            new Element('label', {
                html: '<input type="checkbox" name="extend" />' +
                      '<span>Erweitert</span>'
            }).inject(this.$SettingsContainer);

            var Extend = this.$SettingsContainer.getElement('[name="extend"]');

            Extend.addEvents({
                change : function() {
                    self.setAttribute('extend', this.checked);

                    if (this.checked) {
                        self.getBody().addClass('form-name--extend');
                    } else {
                        self.getBody().removeClass('form-name--extend');
                    }
                }
            });

            if (this.getAttribute('extend')) {
                Extend.set('checked', true);
            }
        }
    });
});