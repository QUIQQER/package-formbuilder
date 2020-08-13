/**
 * Abstract control for all form fields that require one
 *
 * This is NOT to be used on its own but just for inheritance!
 *
 * @module package/quiqqer/formbuilder/bin/frontend/controls/Field
 * @author www.pcsg.de (Patrick Müller)
 */
define('package/quiqqer/formbuilder/bin/frontend/controls/Field', [

    'qui/controls/Control',

], function (QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/frontend/controls/Field',

        Binds: [
            'submit',
        ],

        options: {
            projectname: false,
            projectlang: false,
            siteid     : false
        },

        /**
         * Submits the field data separately from the main form builder form.
         *
         * The main form only submits if all field submits are completed.
         *
         * @return {Promise}
         */
        submit: function () {
            return Promise.resolve();
        }
    });
});