<?php

/**
 * This file contains \QUI\FormBuilder\Fields\EMail
 */
namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class EMail extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $file    = OPT_DIR . 'quiqqer/formbuilder/bin/fields/EMail.html';
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

    /**
     * Check value for the input
     */
    public function checkValue()
    {
        $data = $this->getAttribute('data');

        $this->setAttribute('error', false);

        if (empty($data)
            && !QUI\Utils\Security\Orthos::checkMailSyntax($data)
        ) {
            $this->setAttribute('error', true);
            throw new QUI\Exception('Bitte füllen Sie dieses Feld aus');
        }
    }
}
