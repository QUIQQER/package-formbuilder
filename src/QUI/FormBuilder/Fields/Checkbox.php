<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Checkbox
 */

namespace QUI\FormBuilder\Fields;

use function GuzzleHttp\Promise\queue;
use QUI;
use QUI\FormBuilder;
use QUI\Utils\Security\Orthos;

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
        $data    = $this->getAttribute('data');
        $choices = $this->getAttribute('choices');

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

        foreach ($choices as $k => $choice) {
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

            $choiceValue = $this->name . '-' . $k;

            $result .= '<label ' . $error . '>' .
                       '<input type="checkbox"
                               name="' . $this->name . '[]"
                               value="' . $choiceValue . '" ' . $checked . ' /> ' .
                       '<span>' . $text . '</span>' .
                       '</label>';
        }

        $result .= '</div>';

        return $result;
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $value = '';
        $data  = $this->getAttribute('data');

        if (is_array($data)) {
            $values  = array();
            $choices = $this->getAttribute('choices');

            foreach ($data as $choice) {
                $choice = Orthos::clearFormRequest($choice);
                $choice = explode('-', $choice);

                if (isset($choice[2])) {
                    $valueIndex = (int)$choice[2];

                    if (!empty($choices[$valueIndex]['text'])) {
                        $values[] = $choices[$valueIndex]['text'];
                    }
                }
            }

            $value = implode(', ', $values);
        }

        if (empty($value)) {
            $value = '-';
        }

        return $value;
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
        $data     = $this->getAttribute('data');
        $required = $this->getAttribute('required');

        if ($required && empty($data)) {
            $this->setAttribute('error', true);

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'exception.missing.field'
            ));
        }
    }
}
