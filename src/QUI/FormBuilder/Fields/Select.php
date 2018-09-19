<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Select
 */

namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;
use QUI\Utils\Security\Orthos;

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
        $content = '<select';

        $content .= ' name="'.$this->name.'"';
        $content .= '>';

        if ($this->getAttribute('placeholder')) {
            $content .= '<option value="">';
            $content .= htmlspecialchars($this->getAttribute('placeholder'));
            $content .= '</option>';
        }

        $data = $this->getAttribute('data');

        foreach ($entries as $k => $entry) {
            $selected = '';

            if ((isset($entry['selected']) && $entry['selected']) || $data === $k) {
                $selected = ' selected="selected"';
            }

            $optionName = $this->name.'-'.$k;

            $content .= '<option name="'.$optionName.'" value="'.$optionName.'" '.$selected.'>';
            $content .= htmlspecialchars($entry['text']);
            $content .= '</option>';
        }


        $content .= '</select>';

        return $content;
    }

    /**
     * Parse form data and put it in the right format for evaluation / display
     *
     * @param array $data
     * @return mixed
     */
    public function parseFormData($data)
    {
        if (empty($data) || !is_string($data)) {
            return false;
        }

        $parts           = explode('-', $data);
        $selectedFieldId = array_pop($parts);

        return (int)$selectedFieldId;
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $value = '';

        if ($this->getAttribute('data')) {
            $entries = $this->getAttribute('entries');
            $data    = Orthos::clearFormRequest($this->getAttribute('data'));
            $data    = explode('-', $data);

            if (isset($data[2])) {
                $valueIndex = (int)$data[2];

                if (!empty($entries[$valueIndex]['text'])) {
                    $value = $entries[$valueIndex]['text'];
                }
            }
        }

        if (empty($value)) {
            $value = '-';
        }

        return $value;
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

            throw new QUI\Exception([
                'quiqqer/formbuilder',
                'exception.missing.field'
            ]);
        }
    }
}
