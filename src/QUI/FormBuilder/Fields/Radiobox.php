<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Radiobox
 */
namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

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
        $name    = $this->getAttribute('label');
        $require = '';

        $name = FormBuilder\Builder::parseFieldName($name);

        if (isset($choice['require']) && $choice['require']) {
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

            $result .= '<label>' .
                       '<input type="radio" name="' . $name . '" ' .
                       'value="' . htmlspecialchars($text) . '" ' .
                       $checked . $require . '/>' .
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
            URL_OPT_DIR . 'quiqqer/formbuilder/bin/fields/Radiobox.css'
        );
    }
}
