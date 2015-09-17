<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Checkbox
 */
namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Checkbox extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $result  = '';
        $choices = $this->getAttribute('choices');

        foreach ($choices as $choice) {

            $text    = '';
            $checked = '';

            if (isset($choice['text']) && !empty($choice['text'])) {
                $text = $choice['text'];
            }

            if (isset($choice['checked']) && $choice['checked']) {
                $checked = 'checked="checked"';
            }

            $result .= '<label>' .
                       '<input type="checkbox" name="" value="" ' . $checked . ' /> ' .
                       '<span>' . $text . '</span>' .
                       '</label>';
        }

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
}
