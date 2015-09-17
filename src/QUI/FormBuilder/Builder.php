<?php

/**
 * This file contains \QUI\FormBuilder\Builder
 */
namespace QUI\FormBuilder;

use QUI;

/**
 * Class Builder
 * @package QUI\FormBuilder
 */
class Builder extends QUI\QDOM
{
    /**
     * list of form elements
     * @var array
     */
    protected $_elements = array();

    /**
     * @param array $formData
     */
    public function load(array $formData)
    {
        if (isset($formData['settings'])) {
            $this->setAttributes($formData['settings']);
        }


        if (!isset($formData['elements'])) {
            return;
        }

        $elements = $formData['elements'];

        foreach ($elements as $element) {

            if (!isset($element['type'])) {
                continue;
            }

            $Field = false;

            switch ($element['type']) {

                case 'package/quiqqer/formbuilder/bin/fields/Input':
                    $Field = new Fields\Input();
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Checkbox':
                    $Field = new Fields\Checkbox();
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Radiobox':
                    $Field = new Fields\Radiobox();
                    break;
            }

            if (!$Field) {
                continue;
            }

            $Field->setAttributes($element['attributes']);
            $this->_elements[] = $Field;
        }
    }

    /**
     * Create the formular and return the HTML
     *
     * @return string
     */
    public function create()
    {
        $result = '<form>';

        foreach ($this->_elements as $Element) {
            /* @var $Element Field */
            $result .= $Element->create();
        }

        $result .= '</form>';

        return $result;
    }
}