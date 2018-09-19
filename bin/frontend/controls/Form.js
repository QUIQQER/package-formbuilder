/**
 * Form control
 *
 * @module package/quiqqer/formbuilder/bin/frontend/controls/Form
 * @author www.pcsg.de (Patrick Müller)
 */
define('package/quiqqer/formbuilder/bin/frontend/controls/Form', [

    'qui/controls/Control',
    'utils/Controls',
    'Locale'

], function (QUIControl, QUIControlUtils, QUILocale) {
    "use strict";

    var lg = 'quiqqer/formbuilder';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/formbuilder/bin/frontend/controls/Form',

        Binds: [
            '$onImport',
            'showFormError'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$ErrorMsgElm = null;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * Event: onImport
         */
        $onImport: function () {
            var self       = this,
                Form       = this.getElm(),
                CaptchaElm = Form.getElement('div[data-qui="package/quiqqer/captcha/bin/controls/CaptchaDisplay"]');

            if (!CaptchaElm) {
                return;
            }

            QUIControlUtils.getControlByElement(CaptchaElm).then(function (CaptchaDisplay) {
                CaptchaDisplay.getCaptchaControl().then(function (CaptchaControl) {
                    var formSubmitAllowed = false;

                    CaptchaControl.addEvents({
                        onSuccess: function () {
                            formSubmitAllowed = true;
                        },
                        onExpired: function () {
                            formSubmitAllowed = false;
                        }
                    });

                    Form.addEvent('submit', function (event) {
                        if (!formSubmitAllowed) {
                            self.showFormError(
                                QUILocale.get(lg, 'exception.Builder.wrong_captcha')
                            );

                            event.stop();
                            return;
                        }

                        if (self.$ErrorMsgElm) {
                            self.$ErrorMsgElm.destroy();
                        }
                    });
                });
            });
        },

        /**
         * Displays a form error
         *
         * @param {String} msg
         */
        showFormError: function (msg) {
            if (!this.$ErrorMsgElm) {
                this.$ErrorMsgElm = new Element('div', {
                    'class': 'content-message-error'
                }).inject(this.getElm(), 'before');
            }

            this.$ErrorMsgElm.set('html', msg);
        }
    });
});