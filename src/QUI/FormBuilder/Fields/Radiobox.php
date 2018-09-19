<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Radiobox
 */

namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;
use QUI\Utils\Security\Orthos;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Radiobox extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $result  = '';
        $choices = $this->getAttribute('choices');
        $require = '';

        if ($this->getAttribute('required')) {
            $require = 'required="required" ';
        }

        $data = $this->getAttribute('data');

        foreach ($choices as $k => $choice) {
            $text    = '';
            $checked = '';

            if (isset($choice['text']) && !empty($choice['text'])) {
                $text = $choice['text'];
            }

            if ((isset($choice['checked']) && $choice['checked']) || $k === $data) {
                $checked = 'checked="checked" ';
            }

            $choiceValue = $this->name.'-'.$k;

            $result .= '<label>'.
                       '<input type="radio" name="'.$this->name.'" '.
                       'value="'.$choiceValue.'" '.
                       $checked.$require.'/>'.
                       '<span>'.htmlspecialchars($text).'</span>'.
                       '</label>';
        }

        return $result;
    }

    /**
     * Parse form data and put it in the right format for evaluation / display
     *
     * @param array $data
     * @return mixed
     */
    public function parseFormData($data)
    {
        if (empty($data) || !is_string($data)) {
            return false;
        }

        $parts           = explode('-', $data);
        $selectedFieldId = array_pop($parts);

        return (int)$selectedFieldId;
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $value = '';

        if ($this->getAttribute('data')) {
            $choices = $this->getAttribute('choices');

            $data = Orthos::clearFormRequest($this->getAttribute('data'));
            $data = explode('-', $data);

            if (isset($data[2])) {
                $valueIndex = (int)$data[2];

                if (!empty($choices[$valueIndex]['text'])) {
                    $value = $choices[$valueIndex]['text'];
                }
            }
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
        return [
            URL_OPT_DIR.'quiqqer/formbuilder/bin/fields/Radiobox.css'
        ];
    }
}
