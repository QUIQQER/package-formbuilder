/**
 * Form Builder
 *
 * @module package/quiqqer/formbuilder/bin/FormBuilder
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 */
define('package/quiqqer/formbuilder/bin/FormBuilder', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/buttons/Button',

    'text!package/quiqqer/formbuilder/bin/FormBuilder.html',
    'text!package/quiqqer/formbuilder/bin/FormBuilderFields.html',
    'css!package/quiqqer/formbuilder/bin/FormBuilder.css'


], function (QUI, QUIControl, QUIButton, formBuilder, formBuilderFields) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/FormBuilder',

        Binds: [
            'openFieldList',
            'closeFieldList',
            'hideSettings',
            '$onFieldClick'
        ],

        options: {},

        initialize: function (options) {
            this.parent(options);

            this.$List   = null;
            this.$Active = null;
            this.$fields = {};
        },

        /**
         * create the domnode element
         *
         * @returns {HTMLElement}
         */
        create: function () {

            this.$Elm = new Element('div', {
                'class': 'qui-formbuilder',
                html   : formBuilder
            });

            this.$Buttons   = this.$Elm.getElement('.qui-formbuilder-buttons');
            this.$Container = this.$Elm.getElement('.qui-formbuilder-container');
            this.$Settings  = this.$Elm.getElement('.qui-formbuilder-settings');

            this.$Settings.getElement(
                '.qui-formbuilder-settings-closer'
            ).addEvents({
                    click: this.hideSettings
                });

            this.$Settings.setStyles({
                display: '',
                opacity: 0,
                width  : 0
            });

            new QUIButton({
                text     : 'Feld hinzufügen',
                textimage: 'icon-plus',
                events   : {
                    onClick: this.openFieldList
                }
            }).inject(this.$Buttons);

            new QUIButton({
                text     : 'Formular Einstellungen',
                textimage: 'icon-gear',
                events   : {
                    onClick: this.openFieldList
                }
            }).inject(this.$Buttons);


            return this.$Elm;
        },

        /**
         * Save the form data
         *
         * @returns {{
         *  elements: Array,
         *  settings: {}
         *  }}
         */
        save: function () {

            var elements = [];
            var fields   = this.$Container.getElements('.qui-formfield');

            var i, len, Field;

            for (i = 0, len = fields.length; i < len; i++) {

                if (typeof this.$fields[fields[i].get('data-quiid')] === 'undefined') {
                    continue;
                }

                Field = this.$fields[fields[i].get('data-quiid')];

                elements.push({
                    type      : Field.getType(),
                    attributes: Field.getAttributes()
                });
            }

            return {
                elements: elements,
                settings: {}
            };
        },

        /**
         * Load form data into the builder
         *
         * @param {array} formData
         */
        load: function (formData) {

            if (typeOf(formData) !== 'object') {
                return;
            }

            if (!("elements" in formData)) {
                return;
            }

            var self           = this,
                typeCollection = [],
                elements       = formData.elements;

            for (var i = 0, len = elements.length; i < len; i++) {
                typeCollection.push(
                    elements[i].type
                );
            }

            typeCollection = typeCollection.unique();

            require(typeCollection, function () {

                var i, len, index, Control;

                for (i = 0, len = elements.length; i < len; i++) {

                    index   = typeCollection.indexOf(elements[i].type);
                    Control = arguments[index];

                    self.addField(
                        new Control(
                            elements[i].attributes
                        )
                    );
                }

            });
        },

        /**
         * clear the complete form
         */
        clear: function () {

        },

        /**
         * opens the field list
         */
        openFieldList: function () {

            if (!this.$List) {
                this.$List = new Element('div', {
                    html   : formBuilderFields,
                    'class': 'qui-formbuilder-formBuilderFields',
                    styles : {
                        left: -300
                    }
                }).inject(this.getElm());

                new Element('div', {
                    'class': 'fa fa-times icon-remove',
                    styles : {
                        cursor  : 'pointer',
                        height  : 10,
                        position: 'absolute',
                        top     : 10,
                        right   : 10,
                        width   : 10
                    },
                    events : {
                        click: this.closeFieldList
                    }
                }).inject(this.$List);


                this.$List.getElements('button').addEvents({
                    'click': this.$onFieldClick
                });
            }

            this.$List.addClass('shadow');

            moofx(this.$List).animate({
                left: 0
            }, {
                duration: 250
            });
        },

        /**
         * close field list
         */
        closeFieldList: function () {
            if (!this.$List) {
                return;
            }

            moofx(this.$List).animate({
                left: '-110%'
            }, {
                duration: 250,
                callback: function () {
                    this.$List.removeClass('shadow');
                }.bind(this)
            });
        },

        /**
         * Add a form field
         *
         * @param {Object} Field - package/quiqqer/formbuilder/bin/FormField
         */
        addField: function (Field) {

            var self = this;

            this.$fields[Field.getId()] = Field;

            Field.addEvents({
                onSelect : function (Field) {

                    if (self.$Active) {
                        self.$Active.unselect();
                    }

                    self.$Active = Field;
                    self.openSettings();
                },
                onDestroy: function (Field) {
                    delete self.$fields[Field.getId()];

                    if (self.$Active.getId() === Field.getId()) {
                        self.$Active = null;
                    }
                }
            });

            Field.setParent(this);
            Field.inject(this.$Container);
        },

        /**
         * event : on field click
         *
         * @param {DOMEvent} event
         */
        $onFieldClick: function (event) {
            var self      = this,
                Target    = event.target,
                fieldType = Target.get('data-field');

            if (!fieldType || fieldType === '') {
                return;
            }

            require([fieldType], function (Field) {

                self.addField(new Field());
                self.closeFieldList();

            }, function () {

            });
        },

        /**
         * settings
         */

        /**
         * open field settings
         */
        openSettings: function () {

            if (!this.$Active) {
                return;
            }

            if (parseInt(this.$Settings.getSize().x) == 300) {
                return;
            }

            moofx(this.$Container).animate({
                width: this.$Container.getSize().x - 300
            }, {
                duration: 250
            });

            this.$Settings.setStyles('display', null);

            moofx(this.$Settings).animate({
                opacity     : 1,
                paddingRight: 10,
                width       : 300
            }, {
                duration: 250
            });
        },

        /**
         * close field settings
         */
        hideSettings: function () {

            moofx(this.$Settings).animate({
                opacity    : 0,
                marginRight: 0,
                padding    : 0,
                width      : 0
            }, {
                duration: 250,
                callback: function () {

                    this.$Settings.setStyles('display', 'none');

                    moofx(this.$Container).animate({
                        width: this.$Container.getSize().x + 310
                    }, {
                        duration: 250,
                        callback: function () {
                            this.$Container.setStyle('width', null);

                            if (this.$Active) {
                                this.$Active.unselect();
                            }

                        }.bind(this)
                    });

                }.bind(this)
            });
        }
    });
});