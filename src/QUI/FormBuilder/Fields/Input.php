<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Input
 */
namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Input extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $file    = OPT_DIR . 'quiqqer/formbuilder/bin/fields/Input.html';
        $content = file_get_contents($file);

        if ($this->getAttribute('required')) {
            $content = str_replace(' />', ' required="required" />', $content);
        }

        return $content;
    }
}
