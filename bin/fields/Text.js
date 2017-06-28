/**
 * Standard input field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Text
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 * @require qui/controls/windows/Confirm
 * @require qui/controls/buttons/Button
 * @require Locale
 */
define('package/quiqqer/formbuilder/bin/fields/Text', [

    'package/quiqqer/formbuilder/bin/FormField',
    'qui/controls/windows/Confirm',
    'qui/controls/buttons/Button',
    'Locale',
    'Editors'

], function (Field, QUIConfirm, QUIButton, QUILocale, Editors) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Text',

        Binds: [
            '$onCreate',
            '$onGetSettings',
            '$createEditorButton',
            'openEditor'
        ],

        options: {
            content: ''
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });

            this.setAttribute('label', QUILocale.get('quiqqer/formbuilder', 'field.text.label'));
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody()
                .getParent('fieldset')
                .getElement('.qui-formfield-prevent')
                .addEvent('click', this.$createEditorButton);

            this.refresh();
        },

        /**
         * Create the editor button
         */
        $createEditorButton: function () {
            var Fieldset = this.getBody().getParent('fieldset');

            this.$EditButton = new QUIButton({
                icon  : 'fa fa-edit',
                styles: {
                    bottom  : 10,
                    'float' : 'none',
                    position: 'absolute',
                    right   : 90,
                    width   : 30
                },
                events: {
                    onClick: this.openEditor
                }
            }).inject(
                Fieldset.getElement('.qui-formfield-prevent')
            );
        },

        /**
         * Refresh the container
         */
        refresh: function () {
            if (this.getAttribute('content')) {
                this.getBody().set('html', this.getAttribute('content'));
            }
        },

        /**
         * unselect the field
         */
        unselect: function () {
            this.parent();
            this.$EditButton.destroy();
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param Elm
         */
        $onGetSettings: function (self, Elm) {
            var Required = Elm.getElement('[name="required"]');
            var Label    = Elm.getElement('[name="label"]');

            Required.getParent('.qui-formfield-settings-setting').setStyle('display', 'none');
            Label.getParent('.qui-formfield-settings-setting').setStyle('display', 'none');
        },

        /**
         * Open the confirm editor window
         */
        openEditor: function () {
            var self = this;

            new QUIConfirm({
                title    : QUILocale.get('quiqqer/formbuilder', 'field.text.label'),
                icon     : 'fa fa-edit',
                maxHeight: 600,
                maxWidth : 800,
                events   : {
                    onOpen: function (Win) {
                        Win.getContent().set('html', '');
                        Win.Loader.show();

                        Editors.getEditor(null).then(function (Editor) {
                            Win.$Editor = Editor;

                            // minimal toolbar
                            Win.$Editor.setAttribute('buttons', {
                                lines: [
                                    [[
                                        {
                                            type  : "button",
                                            button: "Bold"
                                        },
                                        {
                                            type  : "button",
                                            button: "Italic"
                                        },
                                        {
                                            type  : "button",
                                            button: "Underline"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type  : "button",
                                            button: "RemoveFormat"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type  : "button",
                                            button: "NumberedList"
                                        },
                                        {
                                            type  : "button",
                                            button: "BulletedList"
                                        }
                                    ]]
                                ]
                            });

                            Win.$Editor.addEvent('onLoaded', function () {
                                Win.$Editor.switchToWYSIWYG();
                                Win.$Editor.showToolbar();
                                Win.$Editor.setContent(self.getAttribute('content'));
                                Win.Loader.hide();
                            });

                            Win.$Editor.inject(Win.getContent());
                            Win.$Editor.setHeight(200);
                        });
                    },

                    onSubmit: function (Win) {
                        var content = Win.$Editor.getContent();

                        Win.$Editor.destroy();
                        Win.close();

                        self.setAttribute('content', content);
                        self.refresh();
                    }
                }
            }).open();
        }
    });
});