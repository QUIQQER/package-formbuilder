<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Checkbox
 */
namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 */
class Checkbox extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $result  = '<div>';
        $require = '';
        $name    = '';

        $data    = $this->getAttribute('data');
        $choices = $this->getAttribute('choices');

        if ($this->getAttribute('label')) {
            $name = $this->getAttribute('label');

            if (is_array($choices) && count($choices) > 1) {
                $name .= '[]';
            }
        }

        $name = FormBuilder\Builder::parseFieldName($name);

        if (!is_array($data) && is_bool($data)) {
            $data = array();
        } else {
            if (!is_array($data)) {
                $data = array($data);
            }
        }

        $values = array();

        foreach ($data as $_data) {
            $values[$_data] = true;
        }

        if ($this->getAttribute('require')) {
            $require = 'required="required" ';
        }

        foreach ($choices as $choice) {
            $text    = '';
            $checked = '';

            if (isset($choice['text']) && !empty($choice['text'])) {
                $text = $choice['text'];
            }

            if (isset($choice['checked']) && $choice['checked']) {
                $checked = 'checked="checked" ';
            }

            if (isset($values[$text])
                && $values[$text]
                && $values[$text] == $text
            ) {
                $checked = 'checked="checked" ';
            } elseif ($this->getParent() && $this->getParent()->isSend()) {
                $checked = '';
            }

            $error = '';

            if ($this->getAttribute('error')) {
                $error = ' class="qui-form-error"';
            }

            $result .= '<label ' . $error . '>' .
                       '<input type="checkbox"
                               name="' . $name . '"
                               value="' . $text . '" ' . $checked . $require . ' /> ' .
                       '<span>' . $text . '</span>' .
                       '</label>';
        }

        $result .= '</div>';

        return $result;
    }

    /**
     * @return array
     */
    public function getCSSFiles()
    {
        return array(
            URL_OPT_DIR . 'quiqqer/formbuilder/bin/fields/Checkbox.css'
        );
    }

    /**
     * Check value for the input
     */
    public function checkValue()
    {
        $data = $this->getAttribute('data');

        if (empty($data)) {
            $this->setAttribute('error', true);

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'exception.missing.field'
            ));
        }
    }
}
