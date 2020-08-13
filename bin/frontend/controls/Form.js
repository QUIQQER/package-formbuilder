/**
 * Form control
 *
 * @module package/quiqqer/formbuilder/bin/frontend/controls/Form
 * @author www.pcsg.de (Patrick Müller)
 */
define('package/quiqqer/formbuilder/bin/frontend/controls/Form', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',

    'utils/Controls',
    'Locale'

], function (QUI, QUIControl, QUILoader, QUIControlUtils, QUILocale) {
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

            this.Loader = new QUILoader();

            this.$Form        = null;
            this.$ErrorMsgElm = null;

            this.$formSubmitAllowed  = true;
            this.$formSubmitErrorMsg = false;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * Event: onImport
         */
        $onImport: function () {
            var self = this;

            this.$Form = this.getElm();

            this.Loader.inject(this.$Form);

            var fieldsWithControls = this.$Form.getElements('div[data-control="1"]');

            this.$Form.addEvent('submit', function (event) {
                if (!self.$formSubmitAllowed) {
                    if (self.$formSubmitErrorMsg) {
                        self.showFormError(self.$formSubmitErrorMsg);
                    } else {
                        self.showFormError(
                            QUILocale.get(lg, 'exception.Builder.general')
                        );
                    }

                    event.stop();
                    return;
                }

                if (self.$ErrorMsgElm) {
                    self.$ErrorMsgElm.destroy();
                }

                if (!fieldsWithControls.length) {
                    return;
                }

                event.stop();
                self.Loader.show();

                var fieldSubmitPromises = [];

                for (var i = 0, len = fieldsWithControls.length; i < len; i++) {
                    var FieldControl = QUI.Controls.getById(fieldsWithControls[i].get('data-quiid'));

                    if (FieldControl && "submit" in FieldControl) {
                        fieldSubmitPromises.push(FieldControl.submit());
                    }
                }

                Promise.all(fieldSubmitPromises).then(function () {
                    self.Loader.hide();
                    self.$Form.submit();
                });
            });

            this.$registerCaptchaHandling();
        },

        /**
         * Check if a CAPTCHA is used and register events
         */
        $registerCaptchaHandling: function () {
            var self       = this,
                CaptchaElm = this.$Form.getElement('div[data-qui="package/quiqqer/captcha/bin/controls/CaptchaDisplay"]');

            if (!CaptchaElm) {
                return;
            }

            QUIControlUtils.getControlByElement(CaptchaElm).then(function (CaptchaDisplay) {
                CaptchaDisplay.getCaptchaControl().then(function (CaptchaControl) {
                    CaptchaControl.addEvents({
                        onSuccess: function () {
                            self.$formSubmitAllowed = true;
                        },
                        onExpired: function () {
                            self.$formSubmitAllowed  = false;
                            self.$formSubmitErrorMsg = QUILocale.get(lg, 'exception.Builder.wrong_captcha');
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

            document.body.scrollTo(this.$ErrorMsgElm);
        }
    });
});