/**
 * Form Builder
 *
 * @module package/quiqqer/formbuilder/bin/FormBuilder
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/buttons/Button
 * @require package/quiqqer/bricks/bin/Sortables
 * @require text!package/quiqqer/formbuilder/bin/FormBuilder.html
 * @require text!package/quiqqer/formbuilder/bin/FormBuilderFields.html
 * @require css!package/quiqqer/formbuilder/bin/FormBuilder.css
 */
define('package/quiqqer/formbuilder/bin/FormBuilder', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/buttons/Button',
    'package/quiqqer/bricks/bin/Sortables',

    'text!package/quiqqer/formbuilder/bin/FormBuilder.html',
    'text!package/quiqqer/formbuilder/bin/FormBuilderFields.html',
    'css!package/quiqqer/formbuilder/bin/FormBuilder.css'

], function (QUI, QUIControl, QUIButton, Sortables, formBuilder, formBuilderFields) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/FormBuilder',

        Binds: [
            'openFieldList',
            'closeFieldList',

            'enableSort',
            'disableSort',
            'toggleSort',

            'openFormSettings',
            'hideSettings',
            'closeSettings',
            '$onFieldClick'
        ],

        options: {
            submit: 'Senden'
        },

        initialize: function (options) {
            this.parent(options);

            this.$List   = null;
            this.$Active = null;

            this.$ButtonAdd       = null;
            this.$ButtonSettings  = null;
            this.$ButtonSort      = null;
            this.$SettingsContent = null;
            this.$Settings        = null;

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
                    click: this.closeSettings
                });

            this.$Settings.setStyles({
                display: '',
                opacity: 0,
                width  : 0
            });

            this.$SettingsContent = this.$Settings.getElement(
                '.qui-formbuilder-settings-content'
            );

            this.$ButtonAdd = new QUIButton({
                text     : 'Feld hinzufügen',
                textimage: 'icon-plus',
                events   : {
                    onClick: this.openFieldList
                }
            }).inject(this.$Buttons);

            this.$ButtonSettings = new QUIButton({
                text     : 'Formular Einstellungen',
                textimage: 'icon-gear',
                events   : {
                    onClick: this.openFormSettings
                }
            }).inject(this.$Buttons);

            this.$ButtonSort = new QUIButton({
                icon  : 'icon-sort',
                alt   : 'Sortierung',
                events: {
                    onClick: this.toggleSort
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
                settings: this.getAttributes()
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

            if ("settings" in formData) {
                this.setAttributes(formData.settings);
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
                        left   : -300,
                        opacity: 0
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
                left   : 0,
                opacity: 1
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
                left   : '-110%',
                opacity: 0
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

                    self.hideSettings().then(function () {
                        self.$Active = Field;
                        self.openSettings();
                    });
                },
                onDestroy: function (Field) {
                    delete self.$fields[Field.getId()];

                    if (self.$Active.getId() === Field.getId()) {
                        self.$Active = null;
                    }

                    self.closeSettings();
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
         * sort / drag & drop
         */

        /**
         * toggle sort
         */
        toggleSort: function () {

            if (this.$ButtonSort.isActive()) {
                this.disableSort();
                return;
            }

            this.enableSort();
        },

        /**
         * enable sort
         */
        enableSort: function () {

            var self = this;

            this.$ButtonAdd.disable();
            this.$ButtonSettings.disable();
            this.$ButtonSort.setActive();

            this.closeSettings();
            this.closeFieldList();

            this.$__Sort = new Sortables(this.$Container, {
                revert: {
                    duration: 250
                },
                clone : function (event) {
                    var Target = event.target;

                    if (Target.nodeName != 'FIELDSET') {
                        Target = Target.getParent('fieldset');
                    }

                    var size = Target.getSize(),
                        pos  = Target.getPosition(self.$Container);

                    return new Element('div', {
                        styles: {
                            background: 'rgba(0,0,0,0.5)',
                            height    : size.y,
                            top       : pos.y,
                            width     : size.x,
                            zIndex    : 1000
                        }
                    });
                },

                onStart: function () {
                    self.$Container.addClass('sorting');
                },

                onComplete: function () {
                    self.$Container.removeClass('sorting');
                }
            });
        },

        /**
         * disable sort
         */
        disableSort: function () {

            if (typeof this.$__Sort !== 'undefined' && this.$__Sort) {
                this.$__Sort.detach();
                this.$__Sort = null;
            }

            this.$ButtonAdd.enable();
            this.$ButtonSettings.enable();
            this.$ButtonSort.setNormal();
        },

        /**
         * settings
         */

        /**
         * open field settings
         *
         * @return Promise
         */
        openSettings: function () {

            var self = this;

            return new Promise(function (resolve) {

                if (!self.$Active) {
                    resolve();
                    return;
                }

                if (parseInt(self.$Settings.getSize().x) != 300) {
                    moofx(self.$Container).animate({
                        width: self.$Container.getSize().x - 300
                    }, {
                        duration: 250
                    });
                }

                self.$SettingsContent.set('html', '');
                self.$Settings.setStyles('display', null);

                moofx(self.$Settings).animate({
                    opacity     : 1,
                    paddingRight: 10,
                    width       : 300
                }, {
                    duration: 250,
                    callback: function () {

                        var Settings = self.$Active.getSettings();
                        Settings.inject(self.$SettingsContent);

                        moofx(self.$SettingsContent).animate({
                            opacity: 1
                        }, {
                            duration: 250,
                            callback: function () {
                                resolve();
                            }
                        });

                    }
                });

            });

        },

        /**
         * close field settings
         *
         * @return Promise
         */
        hideSettings: function () {

            var self = this;

            return new Promise(function (resolve) {

                moofx(self.$SettingsContent).animate({
                    opacity: 0
                }, {
                    duration: 250,
                    callback: function () {
                        resolve();
                    }
                });

            });
        },

        /**
         * hide field settings
         *
         * @return Promise
         */
        closeSettings: function () {

            var self = this;

            return new Promise(function (resolve) {

                moofx(self.$Settings).animate({
                    opacity    : 0,
                    marginRight: 0,
                    padding    : 0,
                    width      : 0
                }, {
                    duration: 250,
                    callback: function () {

                        self.$Settings.setStyles('display', 'none');
                        self.$SettingsContent.set('html', '');

                        moofx(self.$Container).animate({
                            width: self.$Container.getSize().x + 310
                        }, {
                            duration: 250,
                            callback: function () {

                                self.$Container.setStyle('width', null);

                                if (self.$Active) {
                                    self.$Active.unselect();
                                }

                                resolve();
                            }
                        });

                    }
                });

            });

        },

        /**
         * open the settings
         */
        openFormSettings: function () {
            var self = this;

            return new Promise(function (resolve) {

                self.closeSettings().then(function () {

                    require([
                        'text!package/quiqqer/formbuilder/bin/FormBuilderSettings.html'
                    ], function (formSettings) {

                        if (parseInt(self.$Settings.getSize().x) != 300) {
                            moofx(self.$Container).animate({
                                width: self.$Container.getSize().x - 300
                            }, {
                                duration: 250
                            });
                        }

                        self.$SettingsContent.set('html', formSettings);
                        self.$Settings.setStyles('display', null);

                        var Submit = self.$Settings.getElement('[name="form-submit"]');

                        //form-submit
                        Submit.addEvents({
                            change: function () {
                                self.setAttribute('submit', this.value);
                            },

                            keyup: function () {
                                self.setAttribute('submit', this.value);
                            }
                        });

                        Submit.value = self.getAttribute('submit');

                        moofx(self.$Settings).animate({
                            opacity     : 1,
                            paddingRight: 10,
                            width       : 300
                        }, {
                            duration: 250,
                            callback: resolve
                        });

                    });

                });

            });

        }
    });
});