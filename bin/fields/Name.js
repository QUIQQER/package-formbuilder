/**
 * Name fields
 *
 * @module package/quiqqer/formbuilder/bin/fields/Name
 * @author www.pcsg.de (Henning Leutz)
 *
 * @reuquire package/quiqqer/formbuilder/bin/FormField
 * @reuquire Mustache
 * @reuquire Locale
 * @reuquire text!package/quiqqer/formbuilder/bin/fields/Name.html
 * @reuquire css!package/quiqqer/formbuilder/bin/fields/Name.css
 */
define('package/quiqqer/formbuilder/bin/fields/Name', [

    'package/quiqqer/formbuilder/bin/FormField',
    'Mustache',
    'Locale',

    'text!package/quiqqer/formbuilder/bin/fields/Name.html',
    'css!package/quiqqer/formbuilder/bin/fields/Name.css'

], function (Field, Mustache, QUILocale, body) {
    "use strict";

    var lg = 'quiqqer/formbuilder';

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Name',

        Binds: [
            '$onCreate',
            '$onGetSettings',
            '$inputChange',
            '$refreshData'
        ],

        options: {
            extend: false,
            title : QUILocale.get(lg, 'field.settings.Name.label.title'),
            first : QUILocale.get(lg, 'field.settings.Name.label.first'),
            last  : QUILocale.get(lg, 'field.settings.Name.label.last'),
            suffix: QUILocale.get(lg, 'field.settings.Name.label.suffix')
        },

        initialize: function (options) {
            this.parent(options);

            this.$Title  = null;
            this.$First  = null;
            this.$Last   = null;
            this.$Suffix = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody().set('html', Mustache.render(body, {
                title : this.getAttribute('title'),
                first : this.getAttribute('first'),
                last  : this.getAttribute('last'),
                suffix: this.getAttribute('suffix')
            }));

            if (this.getAttribute('extend')) {
                this.$toggleExtended(true);
            } else {
                this.$toggleExtended(false);
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
            this.$SettingsContainer = new Element('div', {
                'class': 'qui-formfield-settings-setting'
            }).inject(Elm);

            var lgPrefix = 'field.settings.Name.label.';

            this.$Title = new Element('div', {
                'class': 'qui-formfield-settings-setting qui-formbuilder-settings__hidden',
                html   : '<label>' +
                '</label><span class="qui-formfield-settings-setting-title">' +
                QUILocale.get(lg, lgPrefix + 'title') +
                '</span>' +
                '<input name="title" type="text" />' +
                '</label>'
            }).inject(Elm);

            this.$First = new Element('label', {
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                '<span class="qui-formfield-settings-setting-title">' +
                QUILocale.get(lg, lgPrefix + 'first') +
                '</span>' +
                '<input name="first" type="text" />' +
                '</label>'
            }).inject(Elm);

            this.$Last = new Element('label', {
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                '<span class="qui-formfield-settings-setting-title">' +
                QUILocale.get(lg, lgPrefix + 'last') +
                '</span>' +
                '<input name="last" type="text" />' +
                '</label>'
            }).inject(Elm);

            this.$Suffix = new Element('label', {
                'class': 'qui-formfield-settings-setting qui-formbuilder-settings__hidden',
                html   : '<label>' +
                '<span class="qui-formfield-settings-setting-title">' +
                QUILocale.get(lg, lgPrefix + 'suffix') +
                '</span>' +
                '<input name="suffix" type="text" />' +
                '</label>'
            }).inject(Elm);

            var TitleInput  = this.$Title.getElement('[name="title"]');
            var FirstInput  = this.$First.getElement('[name="first"]');
            var LastInput   = this.$Last.getElement('[name="last"]');
            var SuffixInput = this.$Suffix.getElement('[name="suffix"]');

            TitleInput.addEvent('change', this.$inputChange);
            FirstInput.addEvent('change', this.$inputChange);
            LastInput.addEvent('change', this.$inputChange);
            SuffixInput.addEvent('change', this.$inputChange);

            TitleInput.value  = this.getAttribute('title');
            FirstInput.value  = this.getAttribute('first');
            LastInput.value   = this.getAttribute('last');
            SuffixInput.value = this.getAttribute('suffix');

            // init attributes
            this.setAttributes({
                title : this.getAttribute('title'),
                first : this.getAttribute('first'),
                last  : this.getAttribute('last'),
                suffix: this.getAttribute('suffix')
            });

            // extend attributes
            new Element('label', {
                html: '<input type="checkbox" name="extend" />' +
                '<span>' +
                QUILocale.get(lg, 'field.settings.Name.label.extend') +
                '</span>'
            }).inject(this.$SettingsContainer);

            var Extend = this.$SettingsContainer.getElement('[name="extend"]');

            Extend.addEvents({
                change: function () {
                    self.$toggleExtended(this.checked);
                }
            });

            if (this.getAttribute('extend')) {
                Extend.checked = true;
            }
        },

        /**
         * Toggle extended form fields
         *
         * @param {Boolean} enabled
         */
        $toggleExtended: function (enabled) {
            var FormPreview         = this.getBody();
            var extendedPreviewElms = FormPreview.getElements('.form-name-extended');

            this.setAttribute('extend', enabled);

            if (enabled) {
                if (this.$Title) {
                    this.$Title.removeClass('qui-formbuilder-settings__hidden');
                }

                if (this.$Suffix) {
                    this.$Suffix.removeClass('qui-formbuilder-settings__hidden');
                }

                extendedPreviewElms.removeClass('qui-formbuilder-settings__hidden');
            } else {
                if (this.$Title) {
                    this.$Title.addClass('qui-formbuilder-settings__hidden');
                }

                if (this.$Suffix) {
                    this.$Suffix.addClass('qui-formbuilder-settings__hidden');
                }

                extendedPreviewElms.addClass('qui-formbuilder-settings__hidden');
            }
        },

        /**
         * input change event
         * @param event
         */
        $inputChange: function (event) {
            var Input = event.target;

            this.setAttribute(Input.name, Input.value);
            this.$refreshData();
        },

        /**
         * refresh data helper
         */
        $refreshData: function () {
            this.getBody().set('html', Mustache.render(body, {
                title : this.getAttribute('title'),
                first : this.getAttribute('first'),
                last  : this.getAttribute('last'),
                suffix: this.getAttribute('suffix')
            }));
        }
    });
});