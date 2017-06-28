/**
 * Form Field
 *
 * @module package/quiqqer/formbuilder/bin/FormField
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require text!package/quiqqer/formbuilder/bin/FormFieldSettings.html
 * @require css!package/quiqqer/formbuilder/bin/FormField.css
 *
 * @event onSelect [this]
 * @event onUnselect [this]
 * @event getSettings [this, HTMLElement]
 */
define('package/quiqqer/formbuilder/bin/FormField', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',

    'text!package/quiqqer/formbuilder/bin/FormFieldSettings.html',
    'css!package/quiqqer/formbuilder/bin/FormField.css'

], function (QUI, QUIControl, QUILocale, settings) {
    "use strict";

    var lg = 'quiqqer/formbuilder';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/FormField',

        Binds: [
            'select',
            'unselect'
        ],

        options: {
            legend: true,

            // values
            label     : 'Untitled',
            cssClasses: '',
            required  : 1
        },

        initialize: function (options) {
            this.parent(options);

            this.$Body    = null;
            this.$Legend  = null;
            this.$Prevent = null;
        },

        /**
         * create the domnode element
         *
         * @returns {HTMLElement}
         */
        create: function () {
            this.$Elm = new Element('fieldset', {
                'class': 'qui-formfield'
            });

            this.$Prevent = new Element('div', {
                'class': 'qui-formfield-prevent',
                events : {
                    click: this.select
                }
            }).inject(this.$Elm);

            this.$Legend = new Element('legend', {
                'class': 'qui-formfield-legend',
                html   : this.getAttribute('label')
            }).inject(this.$Elm);

            if (this.getAttribute('legend') === false) {
                this.$Legend.setStyle('display', 'none');
            }

            this.$Body = new Element('div', {
                'class': 'qui-formfield-body'
            }).inject(this.$Elm);

            this.fireEvent('create', [this, this.$Elm]);

            return this.$Elm;
        },

        /**
         * Return the field body
         * @returns {HTMLElement|null}
         */
        getBody: function () {
            return this.$Body;
        },

        /**
         * Select the field for editing
         */
        select: function () {
            var self = this;

            this.fireEvent('select', [this]);

            this.$Elm.addClass('qui-formfield-active');

            new Element('div', {
                'class': 'qui-formfield-button-dublicate qui-button',
                html   : '<span class="fa fa-plus"></span>',
                events : {
                    click: function () {
                        self.dublicate();
                    }
                }
            }).inject(this.$Prevent);

            new Element('div', {
                'class': 'qui-formfield-button-delete qui-button',
                html   : '<span class="fa fa-minus"></span>',
                events : {
                    click: function () {
                        self.destroy();
                    }
                }
            }).inject(this.$Prevent);
        },

        /**
         * Unselect the field
         */
        unselect: function () {
            this.$Elm.removeClass('qui-formfield-active');
            this.$Prevent.getElements('.qui-formfield-button-dublicate').destroy();
            this.$Prevent.getElements('.qui-formfield-button-delete').destroy();
        },

        /**
         * copy the form field and insert it to the parent
         */
        dublicate: function () {
            var self   = this,
                Parent = this.getParent();

            if (!Parent) {
                return;
            }

            if (typeOf(Parent) !== 'package/quiqqer/formbuilder/bin/FormBuilder') {
                return;
            }

            require([this.getType()], function (Field) {
                Parent.addField(
                    new Field(self.getAttributes())
                );
            });
        },

        /**
         * Return the Settings
         *
         * @return {HTMLElement}
         */
        getSettings: function () {
            var self     = this,
                Settings = new Element('div', {
                    html: settings
                });

            this.fireEvent('getSettings', [this, Settings]);

            var Label      = Settings.getElement('[name="label"]'),
                CssClasses = Settings.getElement('[name="cssClasses"]'),
                Required   = Settings.getElement('[name="required"]');

            // locale
            Settings.getElement('.field-settings').set({
                html: QUILocale.get(lg, 'settings.field.labels')
            });

            Settings.getElement('.required-settings').set({
                html: QUILocale.get(lg, 'settings.required.labels')
            });

            Settings.getElement('.css-settings').set({
                html: QUILocale.get(lg, 'settings.css.labels')
            });


            // label events
            Label.addEvents({
                keyup : function () {
                    self.$Legend.set('html', this.value);
                    self.setAttribute('label', this.value);
                },
                change: function () {
                    self.$Legend.set('html', this.value);
                    self.setAttribute('label', this.value);
                }
            });

            Label.set('value', this.getAttribute('label'));

            // required
            Required.set({
                checked: this.getAttribute('required'),
                events : {
                    change: function () {
                        self.setAttribute('required', this.checked ? 1 : 0);
                    }
                }
            });

            // cssClasses
            CssClasses.addEvents({
                keyup : function () {
                    self.setAttribute('cssClasses', this.value);
                },
                change: function () {
                    self.setAttribute('cssClasses', this.value);
                }
            });

            CssClasses.set('value', this.getAttribute('cssClasses'));

            return Settings;
        }
    });
});