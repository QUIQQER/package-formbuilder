<?php

/**
 * This file contains \QUI\FormBuilder\Builder
 */
namespace QUI\FormBuilder;

use QUI;
use Symfony\Component\Form\Forms;

/**
 * Class Builder
 * @package QUI\FormBuilder
 */
class Builder extends QUI\QDOM
{
    /**
     * Status = Success
     */
    const STATUS_SUCCESS = 1;

    /**
     * Status = Error
     */
    const STATUS_ERROR = 0;

    /**
     * Status = send
     */
    const STATUS_SEND = 1;

    /**
     * list of form elements
     * @var array
     */
    protected $_elements = array();

    /**
     * internal send status
     * @var
     */
    protected $_status;

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
            $Field->setParent($this);

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
        $formName   = '';
        $formAction = '';

        if ($this->getAttribute('name')) {
            $formName = $this->getAttribute('name');
        }

        if ($this->getAttribute('action')) {
            $formAction = $this->getAttribute('action');
        }

        switch ($this->getAttribute('method')) {
            case 'GET':
            case 'get':
                $method = 'GET';
                break;

            case 'POST':
            case 'post':
                $method = 'POST';
                break;

            default:
                $method = 'POST';
        }


        $result = '<form name="' . $formName . '"
                         action="' . $formAction . '"
                         method="' . $method . '"
                         class="qui-form">';

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

        // submit button
        if ($this->getAttribute('submit')) {
            $result .= '<input type="submit" name="submit" value="' . $this->getAttribute('submit') . '" />';
        }

        $result .= '</form>';

        return $result;
    }

    /**
     * Request handling
     *
     * @throws QUI\Exception
     */
    public function handleRequest()
    {
        if (!isset($_REQUEST['submit'])) {
            return;
        }

        $missing = array();
        $this->_status = self::STATUS_SEND;

        foreach ($this->_elements as $Element) {
            /* @var $Element Field */
            if (!$Element->getAttribute('required')) {
                continue;
            }

            $name = $Element->getAttribute('name');

            if (!$name) {
                $name = $Element->getAttribute('label');
            }

            if (!isset($_REQUEST[$name])) {
                $missing[] = $name;
                continue;
            }

            $Element->setAttribute('data', $_REQUEST[$name]);
        }

        if (!empty($missing)) {
            throw new QUI\Exception(
                'Bitte füllen Sie alle Pflichtfelder aus'
            );
        }

        $this->_status = self::STATUS_SUCCESS;
    }

    /**
     * was the form sent successfully?
     *
     * @return bool
     */
    public function isSuccess()
    {
        return $this->_status == self::STATUS_SUCCESS;
    }

    /**
     * is the formular in submit status?
     *
     * @return bool
     */
    public function isSend()
    {
        if ($this->_status == self::STATUS_SUCCESS) {
            return true;
        }

        if ($this->_status == self::STATUS_SEND) {
            return true;
        }

        return false;
    }
}