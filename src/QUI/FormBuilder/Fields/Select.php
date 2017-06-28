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

        if ($this->getAttribute('placeholder')) {
            $content .= '<option value="">';
            $content .= htmlspecialchars($this->getAttribute('placeholder'));
            $content .= '</option>';
        }

        foreach ($entries as $entry) {
            $selected = '';

            if (isset($entry['selected']) && $entry['selected']) {
                $selected = ' selected="selected"';
            }

            $content .= '<option name="" value="' . htmlspecialchars($entry['text']) . '" ' . $selected . '>';
            $content .= htmlspecialchars($entry['text']);
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
        $data    = $this->getAttribute('data');
        $entries = $this->getAttribute('entries');

        $this->setAttribute('error', false);

        if (empty($entries)) {
            return;
        }

        $existsValues = function () use ($entries) {
            foreach ($entries as $entry) {
                if (!empty($entry['text'])) {
                    return true;
                }
            }

            return false;
        };

        if ($existsValues() === false) {
            return;
        }


        if (empty($data)) {
            $this->setAttribute('error', true);

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'exception.missing.field'
            ));
        }
    }
}
