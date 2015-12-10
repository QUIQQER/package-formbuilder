/**
 * Standard input phone field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Select
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/fields/Input
 * @require text!package/quiqqer/formbuilder/bin/fields/Phone.html
 */
define('package/quiqqer/formbuilder/bin/fields/Select', [

    'package/quiqqer/formbuilder/bin/FormField'

], function (FieldInput) {
    "use strict";

    return new Class({

        Extends: FieldInput,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Select',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Select = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody().set('html', '<select></select>');

            this.$Select = this.getBody().getElement('select');
            this.$Select.setStyle('width', '100%');
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param Elm
         */
        $onGetSettings: function (self, Elm) {

        }
    });
});
