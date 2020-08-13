/**
 * Upload control
 *
 * @module package/quiqqer/formbuilder/bin/frontend/controls/Upload
 * @author www.pcsg.de (Patrick Müller)
 */
define('package/quiqqer/formbuilder/bin/frontend/controls/Upload', [

    'package/quiqqer/formbuilder/bin/frontend/controls/Field',
    'utils/Controls',
    'qui/controls/loader/Loader'

], function (FormBuilderField, QUIControlUtils, QUILoader) {
    "use strict";

    return new Class({

        Extends: FormBuilderField,
        Type   : 'package/quiqqer/formbuilder/bin/frontend/controls/Upload',

        Binds: [
            '$onImport',
            'submit'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$ErrorMsgElm   = null;
            this.Loader         = new QUILoader();
            this.$UploadControl = null;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * Event: onImport
         */
        $onImport: function () {
            var self = this,
                Form = this.getElm();

            this.Loader.inject(Form);
            this.Loader.show();

            var waitForUploadControl = setInterval(function () {
                var UploadCtrlElm = Form.getElement('.controls-upload-form');

                if (!UploadCtrlElm) {
                    return;
                }

                clearInterval(waitForUploadControl);

                QUIControlUtils.getControlByElement(UploadCtrlElm).then(function (UploadControl) {
                    self.$UploadControl = UploadControl;

                    self.$UploadControl.setParams({
                        'upload_csrf_token': Form.getElement('.quiqqer-formbuilder-upload').get('data-token'),
                        'projectname'      : self.getAttribute('projectname'),
                        'projectlang'      : self.getAttribute('projectlang'),
                        'siteid'           : self.getAttribute('siteid')
                    });

                    self.Loader.hide();
                });
            }, 200);
        },

        /**
         * Submits the field data separately from the main form builder form.
         *
         * The main form only submits if all field submits are completed.
         *
         * @return {Promise}
         */
        submit: function () {
            var self = this;

            if (!this.$UploadControl) {
                return Promise.resolve();
            }

            this.Loader.show();

            return new Promise(function (resolve, reject) {
                var UploadFinishHandler = function () {
                    self.Loader.hide();
                    resolve();
                };

                var UploadErrorHandler = function () {
                    self.Loader.hide();
                    reject();
                };

                if (!self.$UploadControl.getFiles().length) {
                    UploadFinishHandler();
                    return;
                }

                //self.$UploadControl.addEvent('onCancel', UploadErrorHandler);
                self.$UploadControl.addEvent('onError', UploadErrorHandler);
                self.$UploadControl.addEvent('onComplete', UploadFinishHandler);
                self.$UploadControl.submit();
            });

        }
    });
});