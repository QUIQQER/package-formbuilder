/**
 * Standard input phone field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Phone
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/fields/Input
 * @require text!package/quiqqer/formbuilder/bin/fields/Phone.html
 */
define('package/quiqqer/formbuilder/bin/fields/Phone', [

    'package/quiqqer/formbuilder/bin/fields/Input',
    'text!package/quiqqer/formbuilder/bin/fields/Phone.html'

], function (FieldInput, body) {
    "use strict";

    return new Class({

        Extends: FieldInput,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Phone',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onCreate: this.$onCreate
            });
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