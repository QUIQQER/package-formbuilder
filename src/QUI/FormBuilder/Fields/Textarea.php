<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Textarea
 */
namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

/**
 * Class Textarea
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Textarea extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $textarea = '<texarea';
        $name     = '';

        if ($this->getAttribute('label')) {
            $name = $this->getAttribute('label');
        }

        $textarea .= ' name="' . $name . '"';

        if ($this->getAttribute('required')) {
            $textarea .= ' required="required"';
        }

        $textarea .= '>' . $this->getAttribute('data') . '</textarea>';

        return $textarea;
    }
}
