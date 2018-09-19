<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Textarea
 */

namespace QUI\FormBuilder\Fields;

use QUI;
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
        $textarea = '<textarea';
        $height   = '200px';
        $width    = '100%';

        // defaults
        if ($this->getAttribute('width')) {
            $width = $this->getAttribute('width');
        }

        if ($this->getAttribute('height')) {
            $height = $this->getAttribute('height');
        }

        $textarea .= ' name="'.$this->name.'"';

        if ($this->getAttribute('required')) {
            $textarea .= ' required="required"';
        }

        if ($this->getAttribute('placeholder')) {
            $placeholder = htmlspecialchars($this->getAttribute('placeholder'));
            $textarea    .= ' placeholder="'.$placeholder.'"';
        }

        if ($this->getAttribute('error')) {
            $textarea .= ' class="qui-form-error"';
        }

        $textarea .= ' style="width: '.$width.'; height: '.$height.'">';

        $data = $this->getAttribute('data');

        if (is_string($data) || is_numeric($data)) {
            $textarea .= $data;
        }

        $textarea .= '</textarea>';

        return $textarea;
    }

    /**
     * Check value for the input
     */
    public function checkValue()
    {
        $data = $this->getAttribute('data');

        $this->setAttribute('error', false);

        if (empty($data)) {
            $this->setAttribute('error', true);

            throw new QUI\Exception([
                'quiqqer/formbuilder',
                'exception.missing.field'
            ]);
        }
    }
}
