/**
 * Standard input phone field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Phone
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 * @require text!package/quiqqer/formbuilder/bin/fields/Phone.html
 */
define('package/quiqqer/formbuilder/bin/fields/Phone', [

    'package/quiqqer/formbuilder/bin/FormField',
    'text!package/quiqqer/formbuilder/bin/fields/Phone.html'

], function (Field, body) {
    "use strict";

    return new Class({

        Extends: Field,
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
        }
    });
});