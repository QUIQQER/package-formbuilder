/**
 *
 */
define('package/quiqqer/formbuilder/bin/fields/Checkbox', [

    'package/quiqqer/formbuilder/bin/FormField',

    'text!package/quiqqer/formbuilder/bin/fields/Checkbox.html',
    'css!package/quiqqer/formbuilder/bin/fields/Checkbox.css'

], function (Field, body) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Checkbox',

        Binds : [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onCreate : this.$onCreate
            });
        },

        /**
         * event : on create
         */
        $onCreate : function()
        {
            this.getBody().addClass('qui-form-field-checkbox');
            this.getBody().set('html', body);
        }
    });
});