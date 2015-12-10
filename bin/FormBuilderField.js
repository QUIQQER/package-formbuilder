/**
 * Form Builder Field
 * Field select for the Add-Field-Dialog
 *
 * @module package/quiqqer/formbuilder/bin/FormBuilderField
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require css!package/quiqqer/formbuilder/bin/FormBuilderField.css
 */
define('package/quiqqer/formbuilder/bin/FormBuilderField', [

    'qui/QUI',
    'qui/controls/Control',

    'css!package/quiqqer/formbuilder/bin/FormBuilderField.css'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/FormBuilderFields',

        Binds: [
            '$onImport',
            '$onChange'
        ],

        options: {
            text : '',
            field: ''
        },

        initialize: function (options) {
            this.parent(options);

            this.$Display = null;
            this.$Input   = null;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * create the domnode element
         *
         * @returns {HTMLElement}
         */
        create: function () {
            this.$Elm = new Element('div', {
                'class'     : 'qui-formbuilder-field',
                html        : '<div class="qui-formbuilder-field-display"></div>' +
                              '<input class="qui-formbuilder-field-input" min="0" type="number" />',
                'data-quiid': this.getId()
            });

            this.$Input   = this.$Elm.getElement('input');
            this.$Display = this.$Elm.getElement('.qui-formbuilder-field-display');

            this.$Input.addEvents({
                change: this.$onChange
            });

            this.$Display.set('html', this.getAttribute('text'));

            return this.$Elm;
        },

        /**
         * event : on import
         */
        $onImport: function () {
            var Elm   = this.getElm(),
                title = Elm.get('title');


            this.setAttribute('text', Elm.get('html'));
            this.setAttribute('field', Elm.get('data-field'));
            this.create().replaces(Elm);

            this.getElm().set('title', title);
        },

        /**
         * event : on input change
         */
        $onChange: function () {

            var value = this.getValue();

            if (value <= 0) {
                this.$Elm.removeClass('qui-formbuilder-field__active');
                return;
            }

            this.$Elm.addClass('qui-formbuilder-field__active');
        },

        /**
         * Return the current value
         * @returns {Number}
         */
        getValue: function () {
            if (this.$Input.value === '') {
                return 0;
            }

            return parseInt(this.$Input.value);
        }
    });
});
