/**
 * Standard input field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Input
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 * @require Locale
 * @require text!package/quiqqer/formbuilder/bin/fields/Input.html
 */
define('package/quiqqer/formbuilder/bin/fields/Input', [

    'package/quiqqer/formbuilder/bin/FormField',
    'Locale',
    'text!package/quiqqer/formbuilder/bin/fields/Input.html'

], function (Field, QUILocale, body) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Input',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            placeholder: ''
        },

        initialize: function (options) {
            this.parent(options);

            this.$Input = null;

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

            this.$Input = this.getBody().getElement('input');

            if (this.getAttribute('placeholder')) {
                this.$Input.placeholder = this.getAttribute('placeholder');
            }
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param Elm
         */
        $onGetSettings: function (self, Elm) {

            var Node  = new Element('div', {
                    html: '<label>' +
                          '    <span class="qui-formfield-settings-setting-title">' +
                          QUILocale.get('quiqqer/formbuilder', 'field.settings.placeholder') +
                          '    </span>' +
                          '    <input type="text" name="placeholder" />' +
                          '</label>'
                }).inject(Elm),

                Input = Node.getElement('[name="placeholder"]');


            Input.addEvent('change', function () {
                self.setAttribute('placeholder', this.value);
                self.$Input.placeholder = this.value;
            });

            Input.addEvent('keyup', function () {
                self.setAttribute('placeholder', this.value);
                self.$Input.placeholder = this.value;
            });

            if (self.getAttribute('placeholder')) {
                Input.value = self.getAttribute('placeholder');
            }
        }
    });
});