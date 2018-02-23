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

    'qui/controls/Control',
    'qui/controls/buttons/Button',

    'Locale',
    'Mustache',

    'text!package/quiqqer/formbuilder/bin/FormFieldSettings.html',
    'css!package/quiqqer/formbuilder/bin/FormField.css'

], function (QUIControl, QUIButton, QUILocale, Mustache, settings) {
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
            required  : 1,
            pos       : false // position in form builder
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

            var DuplicateBtn = new QUIButton({
                'class': 'qui-formfield-button-duplicate',
                icon   : 'fa fa-plus'
            }).inject(this.$Prevent);

            // duplicate options
            var ContextMenu;

            DuplicateBtn.getContextMenu(function (Menu) {
                ContextMenu = Menu;
                ContextMenu.addEvents({
                    onMouseLeave: function () {
                        ContextMenu.hide();
                    }
                });
            });

            // insert before
            DuplicateBtn.appendChild({
                'class': 'qui-formfield-button-duplicate-child',
                text   : QUILocale.get(lg, 'controls.FormField.insert_before'),
                icon   : 'fa fa-arrow-up',
                events : {
                    onClick: function () {
                        self.addNewField("up");
                        ContextMenu.hide();
                    }
                }
            }).appendChild({
                'class': 'qui-formfield-button-duplicate-child',
                text   : QUILocale.get(lg, 'controls.FormField.insert_after'),
                icon   : 'fa fa-arrow-down',
                events : {
                    onClick: function () {
                        self.addNewField("down");
                        ContextMenu.hide();
                    }
                }
            }).appendChild({
                'class': 'qui-formfield-button-duplicate-child',
                text   : QUILocale.get(lg, 'controls.FormField.copy_before'),
                icon   : 'fa fa-files-o',
                events : {
                    onClick: function () {
                        self.duplicate("up");
                        ContextMenu.hide();
                    }
                }
            }).appendChild({
                'class': 'qui-formfield-button-duplicate-child',
                text   : QUILocale.get(lg, 'controls.FormField.copy_after'),
                icon   : 'fa fa-files-o',
                events : {
                    onClick: function () {
                        self.duplicate("down");
                        ContextMenu.hide();
                    }
                }
            });

            // delete btn
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
            this.$Prevent.getElements('.qui-formfield-button-duplicate').destroy();
            this.$Prevent.getElements('.qui-formfield-button-delete').destroy();
        },

        /**
         * Add new field to a position relevant this Fields position
         *
         * @param {String} direction - Determine the direction the new field is added to ("up"/"down")
         */
        addNewField: function (direction) {
            var self   = this,
                Parent = this.getParent();

            if (!Parent) {
                return;
            }

            var insertPos;

            if (direction === 'up') {
                insertPos = self.getAttribute('pos');
            } else {
                insertPos = self.getAttribute('pos') + 1;
            }

            Parent.openFieldList(insertPos);
        },

        /**
         * copy the form field and insert it to the parent
         *
         * @param {String} direction - Determine the direction the duplicate is added to ("up"/"down")
         */
        duplicate: function (direction) {
            var self   = this,
                Parent = this.getParent();

            if (!Parent) {
                return;
            }

            if (typeOf(Parent) !== 'package/quiqqer/formbuilder/bin/FormBuilder') {
                return;
            }

            require([this.getType()], function (Field) {
                var DuplicateField = new Field(self.getAttributes());

                if (direction === 'up') {
                    DuplicateField.setAttribute(
                        'pos',
                        self.getAttribute('pos')
                    );
                } else {
                    DuplicateField.setAttribute(
                        'pos',
                        self.getAttribute('pos') + 1
                    );
                }

                Parent.addField(DuplicateField);
            });
        },

        /**
         * Return the Settings
         *
         * @return {HTMLElement}
         */
        getSettings: function () {
            var self = this;

            var lgPrefix = 'settings.';

            var Settings = new Element('div', {
                html: Mustache.render(settings, {
                    fieldLabel   : QUILocale.get(lg, lgPrefix + 'fieldLabel'),
                    requiredLabel: QUILocale.get(lg, lgPrefix + 'requiredLabel'),
                    extraCssLabel: QUILocale.get(lg, lgPrefix + 'extraCssLabel')
                })
            });

            this.fireEvent('getSettings', [this, Settings]);

            var Label      = Settings.getElement('[name="label"]'),
                CssClasses = Settings.getElement('[name="cssClasses"]'),
                Required   = Settings.getElement('[name="required"]');

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