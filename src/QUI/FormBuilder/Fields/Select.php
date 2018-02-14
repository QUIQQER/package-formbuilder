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

        $content .= ' name="' . $this->name . '"';
        $content .= '>';

        if ($this->getAttribute('placeholder')) {
            $content .= '<option value="">';
            $content .= htmlspecialchars($this->getAttribute('placeholder'));
            $content .= '</option>';
        }

        foreach ($entries as $k => $entry) {
            $selected = '';

            if (isset($entry['selected']) && $entry['selected']) {
                $selected = ' selected="selected"';
            }

            $optionName = $this->name . '-' . $k;

            $content .= '<option name="' . $optionName . '" value="' . $optionName . '" ' . $selected . '>';
            $content .= htmlspecialchars($entry['text']);
            $content .= '</option>';
        }


        $content .= '</select>';

        return $content;
    }

    /**
     * Return the html of the element for the mail body
     * @return string
     * @throws QUI\Exception
     */
    public function getHtmlForMail()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $name   = $this->getAttribute('name');
        $value  = '';

        if (!$name) {
            $name = $this->getAttribute('label');
        }

        if ($this->getAttribute('data')) {
            $entries = $this->getAttribute('entries');
            $data    = Orthos::clearFormRequest($this->getAttribute('data'));
            $data    = explode('-', $data);

            if (!empty($data[2])) {
                $valueIndex = (int)$data[2];

                if (!empty($entries[$valueIndex]['text'])) {
                    $value = $entries[$valueIndex]['text'];
                }
            }
        }

        if (empty($value)) {
            $value = '-';
        }

        $Engine->assign(array(
            'title' => $name,
            'value' => $value,
            'this'  => $this
        ));

        return $Engine->fetch(dirname(__FILE__, 2) . '/Field.html');
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
