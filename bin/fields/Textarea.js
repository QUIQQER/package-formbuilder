/**
 * Standard textarea field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Textarea
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 */
define('package/quiqqer/formbuilder/bin/fields/Textarea', [

    'package/quiqqer/formbuilder/bin/FormField',
    'Locale',

    'css!package/quiqqer/formbuilder/bin/fields/Textarea.css'

], function (Field, QUILocale) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Textarea',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            placeholder: '',
            height     : '',
            width      : ''
        },

        initialize: function (options) {
            this.parent(options);

            this.$Textarea = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody().set(
                'html',
                '<textarea style="width: 100%;"></textarea>'
            );

            this.$Textarea = this.getBody().getElement('textarea');

            if (this.getAttribute('placeholder')) {
                this.$Textarea.set('placeholder', this.getAttribute('placeholder'));
            }
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param Elm
         */
        $onGetSettings: function (self, Elm) {

            var Node = new Element('div', {
                'class': 'qui-formfield-settings-textarea',
                html   : '<label>' +
                '    <span class="qui-formfield-settings-setting-title">' +
                QUILocale.get('quiqqer/formbuilder', 'field.settings.placeholder') +
                '    </span>' +
                '    <input type="text" name="placeholder" />' +
                '</label>' +
                '<label>' +
                '    <span class="qui-formfield-settings-setting-title">' +
                QUILocale.get('quiqqer/formbuilder', 'field.settings.textarea.height') +
                '    </span>' +
                '    <input type="text" name="height" />' +
                '</label>' +
                '<label>' +
                '    <span class="qui-formfield-settings-setting-title">' +
                QUILocale.get('quiqqer/formbuilder', 'field.settings.textarea.width') +
                '    </span>' +
                '    <input type="text" name="width" />' +
                '</label>'
            }).inject(Elm);

            var settingInputs    = Node.getElements('input'),
                PlaceholderInput = Node.getElement('[name="placeholder"]'),
                HeightInput      = Node.getElement('[name="height"]'),
                WidthInput       = Node.getElement('[name="width"]');

            settingInputs.addEvent('change', function (event) {
                var attribute = event.target.get('name');
                self.setAttribute(attribute, event.target.value);
            });

            PlaceholderInput.addEvent('keyup', function () {
                self.$Textarea.set('placeholder', this.value);
            });

            if (self.getAttribute('placeholder')) {
                PlaceholderInput.value = self.getAttribute('placeholder');
            }

            if (self.getAttribute('height')) {
                HeightInput.value = self.getAttribute('height');
            }

            if (self.getAttribute('width')) {
                WidthInput.value = self.getAttribute('width');
            }
        }
    });
});