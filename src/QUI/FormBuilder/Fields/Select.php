<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Select
 */
namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Select extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $entries = $this->getAttribute('entries');
        $content = '<select>';

        foreach ($entries as $entry) {
            $selected = '';
            $value    = '';

//            if (selected) {
//
//            }

            $content .= '<option value="' . $value . '" ' . $selected . '>';
            $content .= $entry['text'];
            $content .= '</option>';
        }


        $content .= '</select>';

        return $content;
    }
}
