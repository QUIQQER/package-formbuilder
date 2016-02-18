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
    'qui/controls/windows/Confirm',
    'package/quiqqer/bricks/bin/Sortables',
    'Locale',

    'text!package/quiqqer/formbuilder/bin/FormBuilder.html',
    'text!package/quiqqer/formbuilder/bin/FormBuilderFields.html',
    'css!package/quiqqer/formbuilder/bin/FormBuilder.css'

], function (QUI, QUIControl, QUIButton, QUIConfirm, Sortables, QUILocale, formBuilder, formBuilderFields) {
    "use strict";

    var lg = 'quiqqer/formbuilder';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/FormBuilder',

        Binds: [
            '$onInject',

            'openFieldList',
            'closeFieldList',

            'enableSort',
            'disableSort',
            'toggleSort',

            'openFormSettings',
            'hideSettings'
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

            this.addEvents({
                onInject: this.$onInject
            });
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

            this.$Buttons          = this.$Elm.getElement('.qui-formbuilder-buttons');
            this.$Container        = this.$Elm.getElement('.qui-formbuilder-container');
            this.$Settings         = this.$Elm.getElement('.qui-formbuilder-settings');
            this.$ContainerButtons = this.$Elm.getElement('.qui-formbuilder-container-buttons');

            this.$SettingsContent = this.$Settings.getElement(
                '.qui-formbuilder-settings-content'
            );

            this.$ButtonAdd = new QUIButton({
                text     : QUILocale.get(lg, 'button.add.field'),
                textimage: 'fa fa-plus',
                events   : {
                    onClick: this.openFieldList
                },
                styles   : {
                    width: 'calc(100% - 50px)'
                }
            }).inject(this.$Buttons);
            //
            this.$ButtonSettings = new QUIButton({
                title : QUILocale.get(lg, 'button.form.settings.title'),
                icon  : 'fa fa-gear',
                events: {
                    onClick: this.openFormSettings
                },
                styles: {
                    width: 50
                }
            }).inject(this.$Buttons);

            this.$ButtonSort = new QUIButton({
                textimage: 'fa fa-sort',
                text     : QUILocale.get(lg, 'button.form.sort.text'),
                title    : QUILocale.get(lg, 'button.form.sort.title'),
                events   : {
                    onClick: this.toggleSort
                },
                styles   : {
                    'float': 'right'
                }
            }).inject(this.$ContainerButtons);


            return this.$Elm;
        },

        /**
         * event : on inject
         */
        $onInject: function () {
            this.openFormSettings();
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

            var elements    = [],
                fields      = this.$Container.getElements('.qui-formfield'),
                emptyLabels = 0;

            var i, len, Field, attributes;

            for (i = 0, len = fields.length; i < len; i++) {

                if (typeof this.$fields[fields[i].get('data-quiid')] === 'undefined') {
                    continue;
                }

                Field      = this.$fields[fields[i].get('data-quiid')];
                attributes = Field.getAttributes();

                if (attributes.label === '') {
                    emptyLabels++;
                }

                elements.push({
                    type      : Field.getType(),
                    attributes: Field.getAttributes()
                });
            }

            if (emptyLabels) {
                QUI.getMessageHandler().then(function (MH) {
                    MH.addError(
                        QUILocale.get(
                            'quiqqer/formbuilder',
                            'message.error.formbuilder.emptyfields'
                        )
                    );
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
         * @param {object} formData
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
         * opens the field dialog
         */
        openFieldList: function () {

            var self = this;

            new QUIConfirm({
                icon     : 'fa fa-plus',
                title    : QUILocale.get(lg, 'window.add.field.title'),
                maxWidth : 800,
                maxHeight: 600,
                autoclose: false,

                cancel_button: {
                    text     : QUILocale.get('quiqqer/system', 'cancel'),
                    textimage: 'fa fa-remove'
                },

                ok_button: {
                    text: QUILocale.get('quiqqer/system', 'add')
                },

                events: {
                    onOpen: function (Win) {
                        Win.Loader.show();
                        Win.getContent().setStyle('opacity', 0);
                        Win.getContent().set('html', formBuilderFields);

                        QUI.parse(Win.getContent()).then(function () {
                            Win.Loader.hide();

                            moofx(Win.getContent()).animate({
                                opacity: 1
                            });
                        });
                    },

                    onSubmit: function (Win) {

                        var i, len, Field;

                        var controls = QUI.Controls.getControlsInElement(
                            Win.getContent()
                        );

                        var result         = [],
                            requiredFields = [];

                        for (i = 0, len = controls.length; i < len; i++) {
                            Field = controls[i];

                            if (Field.getType() != 'package/quiqqer/formbuilder/bin/FormBuilderFields') {
                                continue;
                            }

                            if (Field.getValue() <= 0) {
                                continue;
                            }

                            if (!Field.getAttribute('field')) {
                                continue;
                            }

                            requiredFields.push(
                                Field.getAttribute('field')
                            );

                            result.push({
                                field: Field.getAttribute('field'),
                                value: Field.getValue()
                            });
                        }

                        if (!result.length) {
                            return;
                        }

                        require(requiredFields, function () {

                            var First = false;
                            var cls   = arguments;

                            result.each(function (data) {
                                var Insert;
                                var index = requiredFields.indexOf(data.field);

                                if (typeof cls[index] === 'undefined') {
                                    return;
                                }

                                for (i = 0, len = data.value; i < len; i++) {
                                    Insert = new cls[index]();

                                    if (!First) {
                                        First = Insert;
                                    }

                                    self.addField(Insert);
                                }
                            });

                            // select first inserted field
                            if (First) {
                                First.select();
                            }

                            Win.close();
                        });
                    }
                }
            }).open();
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

                    self.openFormSettings();
                }
            });

            Field.setParent(this);
            Field.inject(this.$Container);
        },

        /**
         * select the last field
         */
        selectLastField: function () {
            var First = this.$Container.getLast('.qui-formfield');

            if (!First) {
                this.openFormSettings();
                return;
            }

            var Control = QUI.Controls.getById(First.get('data-quiid'));

            if (Control) {
                Control.select();
            }
        },

        /**
         * select the first field
         */
        selectFirstField: function () {
            var Last = this.$Container.getFirst('.qui-formfield');

            if (!Last) {
                this.openFormSettings();
                return;
            }

            var Control = QUI.Controls.getById(Last.get('data-quiid'));

            if (Control) {
                Control.select();
            }
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

            this.$Container.addClass('sortEnabled');

            //this.closeSettings();
            //this.closeFieldList();

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

            this.$Container.removeClass('sortEnabled');
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

                self.hideSettings().then(function () {

                    self.$SettingsContent.set('html', '');
                    self.$Settings.setStyles('display', null);

                    moofx(self.$Settings).animate({
                        opacity: 1
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
         * open the settings
         */
        openFormSettings: function () {
            var self = this;

            if (this.$Active) {
                this.$Active.unselect();
                this.$Active = null;
            }

            return new Promise(function (resolve) {
                require([
                    'text!package/quiqqer/formbuilder/bin/FormBuilderSettings.html'
                ], function (formSettings) {
                    self.$SettingsContent.set('html', formSettings);
                    self.$Settings.setStyles('display', null);

                    self.$SettingsContent.getElement('.form-settings').set({
                        html: QUILocale.get(lg, 'form.settings.sendButton.label')
                    });

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
                        opacity: 1
                    }, {
                        duration: 250,
                        callback: resolve
                    });
                });
            });
        }
    });
});