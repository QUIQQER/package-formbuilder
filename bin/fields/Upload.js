/**
 * Allow to upload files in form
 *
 * @module package/quiqqer/formbuilder/bin/fields/Upload
 * @author www.pcsg.de (Patrick Müller)
 */
define('package/quiqqer/formbuilder/bin/fields/Upload', [

    'package/quiqqer/formbuilder/bin/FormField',
    'Locale',

    'qui/utils/Form',
    'Mustache',

    'text!package/quiqqer/formbuilder/bin/fields/Upload.html',
    'text!package/quiqqer/formbuilder/bin/fields/Upload.Settings.html',
    'css!package/quiqqer/formbuilder/bin/fields/Upload.css'

], function (Field, QUILocale, QUIFormUtils, Mustache, body, templateSettings) {
    "use strict";

    var lg = 'quiqqer/formbuilder';

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Upload',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            file_count         : 1,
            file_size          : 5000,
            file_endings_custom: '',
            file_types         : []
        },

        initialize: function (options) {
            this.parent(options);

            this.$availableFileTypes = [
                {
                    mimeType: 'image/bmp',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.image_bmp')
                },
                {
                    mimeType: 'image/jpeg',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.image_jpeg')
                },
                {
                    mimeType: 'image/png',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.image_png')
                },
                {
                    mimeType: 'image/svg+xml',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.image_svg_xml')
                },
                {
                    mimeType: 'application/pdf',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.application_pdf')
                },
                {
                    mimeType: 'application/msexcel',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.application_msexcel')
                },
                {
                    mimeType: 'application/msword',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.application_msword')
                },
                {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.vnd_openxmlformats_officedocument_spreadsheetml_sheet')
                },
                {
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.vnd_openxmlformats_officedocument_wordprocessingml_document')
                },
                {
                    mimeType: 'application/gzip',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.application_gzip')
                },
                {
                    mimeType: 'application/zip',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.application_zip')
                },
                {
                    mimeType: 'text/plain',
                    title   : QUILocale.get(lg, 'field.Upload.file_type.text_plain')
                },
            ];

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {
            var Body = this.getBody();

            Body.set('html', body);

            //this.$LabelText = Body.getElement('span.form-privacyPolicycheckbox-label');
            //
            //if (this.getAttribute('text')) {
            //    this.$LabelText.innerHTML = this.getAttribute('text');
            //} else {
            //    this.$LabelText.innerHTML = QUILocale.get(lg, 'field.settings.Upload.label.default');
            //}
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param Elm
         */
        $onGetSettings: function (self, Elm) {
            var Node = new Element('div', {
                'class': 'qui-formfield-settings-setting',
                html   : Mustache.render(templateSettings, {
                    labelFileCount        : QUILocale.get(lg, 'field.settings.Upload.labelFileCount'),
                    labelFileSize         : QUILocale.get(lg, 'field.settings.Upload.labelFileSize'),
                    labelFileSizeTotal    : QUILocale.get(lg, 'field.settings.Upload.labelFileSizeTotal'),
                    labelFileTypes        : QUILocale.get(lg, 'field.settings.Upload.labelFileTypes'),
                    labelCustomFileEndings: QUILocale.get(lg, 'field.settings.Upload.labelCustomFileEndings'),
                    fileTypes             : this.$availableFileTypes,
                })
            }).inject(Elm);

            var Form = Node.getElement('form.quiqqer-formbuilder-fields-upload-settings-form');

            QUIFormUtils.setDataToForm({
                file_count         : this.getAttribute('file_count'),
                file_size          : this.getAttribute('file_size'),
                file_endings_custom: this.getAttribute('file_endings_custom'),
                'file_types[]'     : this.getAttribute('file_types')
            }, Form);

            Node.getElements('input').addEvent('change', function () {
                var FormData = QUIFormUtils.getFormData(Form);

                FormData.file_types = FormData['file_types[]'];
                delete FormData['file_types[]'];

                self.setAttributes(FormData);
            });

            //var Textarea = Node.getElement('textarea');
            //
            //if (this.getAttribute('text')) {
            //    Textarea.value = this.getAttribute('text');
            //} else {
            //    Textarea.value = QUILocale.get(lg, 'field.settings.Upload.label.default');
            //}
            //
            //Textarea.addEvent('keyup', function () {
            //    self.setAttribute('text', this.value);
            //    self.$LabelText.innerHTML = this.value;
            //});
        }
    });
});