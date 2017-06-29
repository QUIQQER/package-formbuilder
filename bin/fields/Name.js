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
            title : QUILocale.get('quiqqer/quiqqer', 'title'),
            first : QUILocale.get('quiqqer/quiqqer', 'first'),
            last  : QUILocale.get('quiqqer/quiqqer', 'last'),
            suffix: QUILocale.get('quiqqer/quiqqer', 'suffix')
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
            this.getBody().set('html', Mustache.render(body, {
                title : this.getAttribute('title'),
                first : this.getAttribute('first'),
                last  : this.getAttribute('last'),
                suffix: this.getAttribute('suffix')
            }));

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
            this.$SettingsContainer = new Element('div', {
                'class': 'qui-formfield-settings-setting'
            }).inject(Elm);

            // #locale
            new Element('label', {
                html: '<input type="checkbox" name="extend" />' +
                      '<span>Erweitert</span>'
            }).inject(this.$SettingsContainer);

            var Extend = this.$SettingsContainer.getElement('[name="extend"]');

            Extend.addEvents({
                change: function () {
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


            var Title = new Element('div', {
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                         '</label><span class="qui-formfield-settings-setting-title">Title</span>' +
                         '<input name="title" type="text" />' +
                         '</label>'
            }).inject(Elm);

            var First = new Element('label', {
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                         '<span class="qui-formfield-settings-setting-title">First</span>' +
                         '<input name="first" type="text" />' +
                         '</label>'
            }).inject(Elm);

            var Last = new Element('label', {
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                         '<span class="qui-formfield-settings-setting-title">Last</span>' +
                         '<input name="last" type="text" />' +
                         '</label>'
            }).inject(Elm);

            var Suffix = new Element('label', {
                'class': 'qui-formfield-settings-setting',
                html   : '<label>' +
                         '<span class="qui-formfield-settings-setting-title">suffix</span>' +
                         '<input name="suffix" type="text" />' +
                         '</label>'
            }).inject(Elm);


            Title.getElement('[name="title"]').addEvent('change', this.$inputChange);
            First.getElement('[name="first"]').addEvent('change', this.$inputChange);
            Last.getElement('[name="last"]').addEvent('change', this.$inputChange);
            Suffix.getElement('[name="suffix"]').addEvent('change', this.$inputChange);
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