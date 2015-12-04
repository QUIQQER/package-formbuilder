/**
 * Standard input email field
 *
 * @module package/quiqqer/formbuilder/bin/fields/EMail
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/fields/Input
 * @require text!package/quiqqer/formbuilder/bin/fields/EMail.html
 */
define('package/quiqqer/formbuilder/bin/fields/EMail', [

    'package/quiqqer/formbuilder/bin/fields/Input',
    'text!package/quiqqer/formbuilder/bin/fields/EMail.html'

], function (FieldInput, body) {
    "use strict";

    return new Class({

        Extends: FieldInput,
        Type   : 'package/quiqqer/formbuilder/bin/fields/EMail',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            placeholder: ''
        },

        initialize: function (options) {
            this.parent(options);
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody().set('html', body);

            this.$Input = this.getBody().getElement('input');

            if (this.getAttribute('placeholder')) {
                this.$Input.placeholder = this.getAttribute('placeholder');
            }
        }
    });
});