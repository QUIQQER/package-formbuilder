/**
 * Checkbox for European Union General Data Protection Regulation (GDPR) purposes
 *
 * @module package/quiqqer/formbuilder/bin/fields/GDPRCheckbox
 * @author www.pcsg.de (Patrick Müller)
 */
define('package/quiqqer/formbuilder/bin/fields/GDPRCheckbox', [

    'package/quiqqer/formbuilder/bin/FormField',
    'Locale',

    'text!package/quiqqer/formbuilder/bin/fields/GDPRCheckbox.html',
    'css!package/quiqqer/formbuilder/bin/fields/GDPRCheckbox.css'

], function (Field, QUILocale, body) {
    "use strict";

    var lg = 'quiqqer/formbuilder';

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/GDPRCheckbox',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            text: ''
        },

        initialize: function (options) {
            this.parent(options);

            this.$LabelText = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            var Body = this.getBody();

            Body.set('html', body);

            this.$LabelText = Body.getElement('span.form-gdprcheckbox-label');

            if (this.getAttribute('text')) {
                this.$LabelText.innerHTML = this.getAttribute('text');
            } else {
                this.$LabelText.innerHTML = QUILocale.get(lg, 'field.settings.GDPRCheckbox.label.default');
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
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                '    <span class="qui-formfield-settings-setting-title">' +
                QUILocale.get('quiqqer/formbuilder', 'field.settings.GDPRCheckbox.label') +
                '    </span>' +
                '    <span class="qui-formfield-settings-setting-description">' +
                QUILocale.get('quiqqer/formbuilder', 'field.settings.GDPRCheckbox.label.description') +
                '    </span>' +
                '    <textarea></textarea>' +
                '</label>'
            }).inject(Elm);

            var Textarea = Node.getElement('textarea');

            if (this.getAttribute('text')) {
                Textarea.value = this.getAttribute('text');
            } else {
                Textarea.value = QUILocale.get(lg, 'field.settings.GDPRCheckbox.label.default');
            }

            Textarea.addEvent('keyup', function () {
                self.setAttribute('text', this.value);
                self.$LabelText.innerHTML = this.value;
            });
        }
    });
});