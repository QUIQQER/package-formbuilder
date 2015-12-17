<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Select
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
class Select extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $name    = '';
        $entries = $this->getAttribute('entries');
        $content = '<select';

        if ($this->getAttribute('label')) {
            $name = $this->getAttribute('label');
        }

        $name = FormBuilder\Builder::parseFieldName($name);

        $content .= ' name="' . $name . '"';
        $content .= '>';

        foreach ($entries as $entry) {
            $selected = '';
            $value    = '';

            if (isset($entry['selected']) && $entry['selected']) {
                $selected = ' selected="selected"';
            }

            $content .= '<option name="" value="' . $value . '" ' . $selected . '>';
            $content .= $entry['text'];
            $content .= '</option>';
        }


        $content .= '</select>';

        return $content;
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

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'exception.missing.field'
            ));
        }
    }
}
