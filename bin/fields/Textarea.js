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

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            placeholder: ''
        },

        initialize: function (options) {
            this.parent(options);

            this.$Textarea = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            this.getBody().set(
                'html',
                '<textarea style="width: 100%;"></textarea>'
            );

            this.$Textarea = this.getBody().getElement('textarea');

            if (this.getAttribute('placeholder')) {
                this.$Textarea.set('placeholder', this.getAttribute('placeholder'));
            }
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param Elm
         */
        $onGetSettings: function (self, Elm) {

            var Node  = new Element('div', {
                    html: '<label>' +
                          '    <span class="qui-formfield-settings-setting-title">' +
                          '         Platzhalter' +
                          '    </span>' +
                          '    <input type="text" name="placeholder" />' +
                          '</label>'
                }).inject(Elm),

                Input = Node.getElement('[name="placeholder"]');


            Input.addEvent('change', function () {
                self.setAttribute('placeholder', this.value);
                self.$Textarea.set('placeholder', this.value);
            });

            Input.addEvent('keyup', function () {
                self.setAttribute('placeholder', this.value);
                self.$Textarea.set('placeholder', this.value);
            });

            if (self.getAttribute('placeholder')) {
                Input.value = self.getAttribute('placeholder');
            }
        }
    });
});