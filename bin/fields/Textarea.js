/**
 * Standard textarea field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Textarea
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 */
define('package/quiqqer/formbuilder/bin/fields/Textarea', [

    'package/quiqqer/formbuilder/bin/FormField'

], function (Field) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Textarea',

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
            this.getBody().set(
                'html',
                '<textarea style="width: 100%;"></textarea>'
            );

            console.log(123);
        }
    });
});