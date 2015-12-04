<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Phone
 */
namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Phone extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $file    = OPT_DIR . 'quiqqer/formbuilder/bin/fields/Phone.html';
        $content = file_get_contents($file);
        $name    = '';

        if ($this->getAttribute('label')) {
            $name = $this->getAttribute('label');
        }

        $content = str_replace(
            'value=""',
            'value="' . $this->getAttribute('data') . '"',
            $content
        );

        $content = str_replace(
            'name=""',
            'name="' . $name . '"',
            $content
        );

        if ($this->getAttribute('placeholder')) {
            $placeholder = htmlspecialchars($this->getAttribute('placeholder'));
            $content     = str_replace(
                ' />',
                ' placeholder="' . $placeholder . '" />',
                $content
            );
        }

        if ($this->setAttribute('error', true)) {
            $content = str_replace(
                ' />',
                'class="qui-form-error" />',
                $content
            );
        }

        if ($this->getAttribute('required')) {
            $content = str_replace(' />', ' required="required" />', $content);
        }

        return $content;
    }
}
