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

                case 'package/quiqqer/formbuilder/bin/fields/Name':
                    $Field = new Fields\Name();
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
        $result   = '<form name="" action="" class="qui-form">';
        $Template = $this->getAttribute('Template');

        if ($Template) {
            $Template->extendHeaderWithCSSFile(
                URL_OPT_DIR . 'quiqqer/formbuilder/bin/Builder.css'
            );
        }

        foreach ($this->_elements as $Element) {
            /* @var $Element Field */
            /* @var $Template QUI\Template */
            $result .= $Element->create();

            // add css files to the template
            if ($Template) {
                $cssFiles = $Element->getCSSFiles();

                foreach ($cssFiles as $cssFile) {
                    $Template->extendHeaderWithCSSFile($cssFile);
                }
            }
        }

        $result .= '</form>';

        return $result;
    }
}