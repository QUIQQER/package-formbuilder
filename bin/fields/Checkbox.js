/**
 *
 */
define('package/quiqqer/formbuilder/bin/fields/Checkbox', [

    'package/quiqqer/formbuilder/bin/FormField',
    'qui/controls/buttons/Button',
    'qui/utils/Elements',

    'css!package/quiqqer/formbuilder/bin/fields/Checkbox.css'

], function (Field, QUIButton, QUIElements) {
    "use strict";

    return new Class({

        Extends: Field,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Checkbox',

        Binds: [
            '$onCreate',
            '$onGetSettings'
        ],

        options: {
            choices: []
        },

        initialize: function (options) {

            this.parent(options);

            this.$SettingsContaiiner = null;

            this.addEvents({
                onCreate     : this.$onCreate,
                onGetSettings: this.$onGetSettings
            });
        },

        /**
         * event : on create
         */
        $onCreate: function () {

            var choices = this.getAttribute('choices'),
                Body    = this.getBody();

            choices = choices.clean();

            this.setAttribute('choices', choices);

            Body.addClass('qui-form-field-checkbox');

            if (!choices.length) {
                this.addChoice('Erste Auswahl');
                return;
            }

            this.$__creating = true;

            for (var i = 0, len = choices.length; i < len; i++) {
                if (!choices[i]) {
                    continue;
                }

                this.addChoice(
                    choices[i].text,
                    choices[i].checked
                );
            }

            this.$__creating = false;
        },

        /**
         * event : on get Settings
         *
         * @param {Object} self -
         * @param {HTMLElement} Elm
         */
        $onGetSettings: function (self, Elm) {

            var i, len, Choice, Input, Checkbox;

            var choices = this.getAttribute('choices'),
                labels  = this.getBody().getElements('labels');


            this.$SettingsContaiiner = new Element('div').inject(Elm);


            var addChoiceAfter = function () {

            };

            var btnClickDeleteChoice = function (Btn) {
                var choices = self.getAttribute('choices');
                var index   = QUIElements.getChildIndex(
                    Btn.getElm().getParent()
                );

                index = parseInt(index) + 1;

                if (typeof choices[index - 1] === 'undefined' || !choices[index - 1]) {
                    return;
                }


                var Choice = self.getBody().getChildren(
                    'div:nth-child(' + index + ')'
                );

                Choice.destroy();
                Btn.getElm().getParent().destroy();

                delete choices[index - 1];
                choices    = choices.clean();

                self.setAttribute('choices', choices);
            };

            var checkboxChange = function () {
                var choices = self.getAttribute('choices');
                var index   = QUIElements.getChildIndex(
                    this.getParent()
                );

                index = parseInt(index) + 1;

                if (typeof choices[index - 1] === 'undefined' || !choices[index - 1]) {
                    return;
                }


                var Choice = self.getBody().getChildren(
                    'div:nth-child(' + index + ')'
                );

                Choice.getElement('label input').set('checked', this.checked);

                choices[index - 1].checked = this.checked;
            };


            var textChange = function () {
                var choices = self.getAttribute('choices');
                var index   = QUIElements.getChildIndex(
                    this.getParent()
                );

                index = parseInt(index) + 1;

                if (typeof choices[index - 1] === 'undefined' || !choices[index - 1]) {
                    return;
                }


                var Choice = self.getBody().getChildren(
                    'div:nth-child(' + index + ')'
                );

                Choice.getElement('label span').set('html', this.value);

                choices[index - 1].text = this.value;
            };

            for (i = 0, len = choices.length; i < len; i++) {

                if (!choices[i]) {
                    continue;
                }

                Choice = new Element('div', {
                    'class': 'qui-form-field-checkbox-settings-choice',
                    html   : '<input type="checkbox" name="checked" />' +
                             '<input type="input" name="title" />'
                });

                new QUIButton({
                    icon  : 'icon-plus',
                    events: {
                        onClick: addChoiceAfter
                    }
                }).inject(Choice);

                new QUIButton({
                    icon  : 'icon-minus',
                    Choice: Choice,
                    events: {
                        onClick: btnClickDeleteChoice
                    }
                }).inject(Choice);


                Choice.getElement('[type="checkbox"]').addEvents({
                    change: checkboxChange
                });

                Choice.getElement('[type="input"]').addEvents({
                    change: textChange,
                    keyup : textChange
                });

                Choice.inject(this.$SettingsContaiiner);

                Choice.getElement('[name="checked"]').checked = choices[i].checked;
                Choice.getElement('[name="title"]').value     = choices[i].text || '';

                Choice.getElement('[name="checked"]').fireEvent('change');
                Choice.getElement('[name="title"]').fireEvent('change');
            }
        },

        /**
         * Add a choice
         *
         * @param {String} text
         * @param {Boolean} checked
         *
         * @return {HTMLElement}
         */
        addChoice: function (text, checked) {

            if (typeof text === 'undefined') {
                text = '';
            }

            var Choice = new Element('div', {
                html: '<label>' +
                      '<input type="checkbox" name="" value="" /> ' +
                      '<span>' + text + '</span>' +
                      '</label>'
            }).inject(this.getBody());

            if (checked) {
                Choice.getElement('[type="checkbox"]').checked = checked;
            }

            if (this.$__creating === false) {
                var choices = this.getAttribute('choices');

                choices.push({
                    text   : text,
                    checked: false
                });
            }

            return Choice;
        }
    });
});