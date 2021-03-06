/**
 * Standard input phone field
 *
 * @module package/quiqqer/formbuilder/bin/fields/Select
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require package/quiqqer/formbuilder/bin/FormField
 * @require qui/controls/buttons/Button
 * @require qui/utils/Elements
 * @require Locale
 * @require css!package/quiqqer/formbuilder/bin/fields/Checkbox.css
 */
define('package/quiqqer/formbuilder/bin/fields/Select', [

    'package/quiqqer/formbuilder/bin/FormField',
    'qui/controls/buttons/Button',
    'qui/utils/Elements',
    'Locale',
    'css!package/quiqqer/formbuilder/bin/fields/Checkbox.css'

], function (FieldInput, QUIButton, QUIElements, QUILocale) {
    "use strict";

    return new Class({

        Extends: FieldInput,
        Type   : 'package/quiqqer/formbuilder/bin/fields/Select',

        Binds: [
            '$onCreate',
            '$onTextChange',
            '$onAddOption',
            '$onDeleteOption',
            '$refreshPlaceholder'
        ],

        options: {
            entries    : [],
            placeholder: ''
        },

        initialize: function (options) {
            this.parent(options);

            this.$Select            = null;
            this.$SelectPlaceholder = null;

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

            var entries = this.getAttribute('entries');

            this.setAttribute('entries', entries.clean());

            if (!entries.length) {
                this.$__creating = false;
                this.addOption('');
                return;
            }

            this.$__creating = true;

            for (var i = 0, len = entries.length; i < len; i++) {
                if (!entries[i]) {
                    continue;
                }

                this.addOption(
                    entries[i].text,
                    entries[i].selected
                );
            }

            this.$__creating = false;
        },

        /**
         * event : on get settings
         *
         * @param self
         * @param {HTMLElement} Elm
         */
        $onGetSettings: function (self, Elm) {

            var i, len, Option, textChange, checkboxChange;

            var entries = this.getAttribute('entries'),

                Node    = new Element('div', {
                    html: '<label>' +
                          '    <span class="qui-formfield-settings-setting-title">' +
                          QUILocale.get('quiqqer/formbuilder', 'field.settings.placeholder') +
                          '    </span>' +
                          '    <input type="text" name="placeholder" />' +
                          '</label>'
                }).inject(Elm),

                Input   = Node.getElement('[name="placeholder"]');

            // placeholder events
            Input.addEvent('change', function () {
                self.setAttribute('placeholder', this.value);
                self.$refreshPlaceholder();
            });

            Input.addEvent('keyup', function () {
                self.setAttribute('placeholder', this.value);
                self.$refreshPlaceholder();
            });

            if (this.getAttribute('placeholder')) {
                Input.value = self.getAttribute('placeholder');
            }

            // elements
            new Element('span', {
                'class': 'qui-formfield-settings-setting-title',
                html   : QUILocale.get(
                    'quiqqer/formbuilder',
                    'field.select.settings.select.label'
                )
            }).inject(Elm);

            this.$SettingsContainer = new Element('div').inject(Elm);


            textChange = function () {
                self.$onTextChange(this);
            };

            checkboxChange = function () {
                self.$setDefaultOption(this);
            };

            var selectdId = 'selectable' + self.getId();

            // create option fields
            for (i = 0, len = entries.length; i < len; i++) {

                if (!entries[i]) {
                    continue;
                }


                Option = new Element('div', {
                    'class': 'qui-form-field-checkbox-settings-choice',
                    html   : '<input type="checkbox" name="' + selectdId + '" />' +
                             '<input type="input" name="title" />'
                });

                new QUIButton({
                    icon  : 'fa fa-plus',
                    events: {
                        onClick: this.$onAddOption
                    }
                }).inject(Option);

                if (i !== 0) {
                    new QUIButton({
                        icon  : 'fa fa-minus',
                        events: {
                            onClick: this.$onDeleteOption
                        }
                    }).inject(Option);
                }

                Option.getElement('[type="checkbox"]').addEvents({
                    change: checkboxChange
                });

                Option.getElement('[type="input"]').addEvents({
                    change: textChange,
                    keyup : textChange
                });

                Option.inject(this.$SettingsContainer);

                Option.getElement('[name="title"]').value = entries[i].text || '';
                Option.getElement('[name="title"]').fireEvent('change');

                if (entries[i].selected) {
                    Option.getElement('[type="checkbox"]').set('checked', true);
                }

                //Option.getElement('[type="checkbox"]').fireEvent('change');
            }
        },

        /**
         * Add an option filed
         *
         * @param {String} text
         * @param {Boolean|Number} [selected]
         *
         * @return {HTMLOptionElement}
         */
        addOption: function (text, selected) {

            if (typeof text === 'undefined') {
                text = '';
            }

            if (typeof selected === 'undefined') {
                selected = false;
            }

            var type = typeOf(selected);

            if (type != 'boolean' && type != 'number') {
                selected = false;
            } else if (type != 'number') {
                selected = selected ? true : false;
            }

            var Option = new Element('option', {
                html    : text,
                selected: selected
            }).inject(this.$Select);

            if (this.$__creating === false) {
                var entries = this.getAttribute('entries');

                entries.push({
                    text    : text,
                    selected: selected ? 1 : 0
                });
            }

            return Option;
        },

        /**
         * event: on text change
         */
        $onTextChange: function (Elm) {
            var entries = this.getAttribute('entries');
            var index   = QUIElements.getChildIndex(Elm.getParent());

            index = parseInt(index) + 1;

            if (typeof entries[index - 1] === 'undefined' || !entries[index - 1]) {
                return;
            }

            var Option = this.$Select.getElement(
                'option:nth-child(' + index + ')'
            );

            Option.set('html', Elm.value);

            entries[index - 1].text = Elm.value;

            this.setAttribute('choices', entries);
        },

        /**
         * event: on option add
         *
         * @param {Object} Btn - qui/controls/buttons/Button, add button
         */
        $onAddOption: function (Btn) {
            var self    = this,
                entries = this.getAttribute('entries');

            var index = QUIElements.getChildIndex(
                Btn.getElm().getParent()
            );

            index = parseInt(index) + 1;

            if (typeof entries[index - 1] === 'undefined' || !entries[index - 1]) {
                return;
            }

            var Parent = Btn.getElm().getParent(),
                Clone  = Parent.clone();

            var Choice = this.$Select.getElement(
                'option:nth-child(' + index + ')'
            );

            var NewOption = new Element('option');

            // insert
            Clone.inject(Parent, 'after'); // insert settings in dom
            NewOption.inject(Choice, 'after');

            // insert at internal choices
            entries.splice(index, 0, Object.clone(entries[index - 1]));

            Clone.getElements('button').destroy();

            new QUIButton({
                icon  : 'fa fa-plus',
                events: {
                    onClick: this.$onAddOption
                }
            }).inject(Clone);

            new QUIButton({
                icon  : 'fa fa-minus',
                events: {
                    onClick: this.$onDeleteOption
                }
            }).inject(Clone);

            this.setAttribute('entries', entries);


            Clone.getElement('[type="checkbox"]')
                .removeEvent('change')
                .addEvents({
                    change: function () {
                        self.$setDefaultOption(this);
                    }
                });

            Clone.getElement('[type="input"]')
                .removeEvent('change')
                .removeEvent('keyup')
                .addEvents({
                    change: function () {
                        self.$onTextChange(this);
                    },
                    keyup : function () {
                        self.$onTextChange(this);
                    }
                });
        },

        /**
         * event : delete option
         * @param Btn
         */
        $onDeleteOption: function (Btn) {
            var self    = this,
                entries = this.getAttribute('entries');

            var index = QUIElements.getChildIndex(
                Btn.getElm().getParent()
            );

            index = parseInt(index) + 1;

            if (typeof entries[index - 1] === 'undefined' || !entries[index - 1]) {
                return;
            }

            var Choice = this.$Select.getElement(
                'option:nth-child(' + index + ')'
            );

            Choice.destroy();
            Btn.getElm().getParent().destroy();

            delete entries[index - 1];
            entries = entries.clean();

            self.setAttribute('entries', entries);
        },

        /**
         * event : on selectable change
         *
         * @param {HTMLElement} Input - checkbox box
         */
        $setDefaultOption: function (Input) {

            var status = Input.checked;

            var index   = QUIElements.getChildIndex(Input.getParent()),
                entries = this.getAttribute('entries');

            if (typeof entries[index] === 'undefined') {
                return;
            }

            var Option;

            if (status) {
                for (var i = 0, len = entries.length; i < len; i++) {
                    entries[i].selected = 0;
                }

                entries[index].selected = status;

                Input.getParent()
                    .getParent()
                    .getElements('[type="checkbox"]')
                    .set('checked', false);

                Input.checked = true;

                this.$Select.getElements('option').set('selected', false);
            }


            if (this.$Select.getElement('[value=""]')) {
                Option = this.$Select
                    .getElements('option:nth-child(' + (index + 2) + ')');

            } else {
                Option = this.$Select
                    .getElements('option:nth-child(' + (index + 1) + ')');

            }

            Option.set('selected', status);

            this.setAttribute('entries', entries);
        },

        /**
         * Refresh the placeholder display
         */
        $refreshPlaceholder: function () {
            if (!this.getAttribute('placeholder')) {
                if (!this.$SelectPlaceholder) {
                    this.$SelectPlaceholder.destroy();
                }
                return;
            }

            if (!this.$SelectPlaceholder) {
                this.$SelectPlaceholder = new Element('option', {
                    value: ''
                }).inject(this.$Select, 'top');
            }

            this.$SelectPlaceholder.set(
                'html',
                this.getAttribute('placeholder')
            );
        }
    });
});
