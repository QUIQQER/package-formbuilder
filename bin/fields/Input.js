/**
 *
 */
define('package/quiqqer/formbuilder/bin/fields/Input', [

    'package/quiqqer/formbuilder/bin/FormField',
    'text!package/quiqqer/formbuilder/bin/fields/Input.html'

], function (Field, body) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Input',

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
            this.getBody().set('html', body);
        }
    });
});