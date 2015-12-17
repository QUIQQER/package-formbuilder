<?php

/**
 * This file contains \QUI\FormBuilder\Builder
 */
namespace QUI\FormBuilder;

use QUI;
use QUI\Utils\Security\Orthos;

/**
 * Class Builder
 *
 * @package QUI\FormBuilder
 *
 * @event onLoaded
 * @event onStatusSuccess
 * @event onStatusError
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
    protected $elements = array();

    /**
     * internal send status
     * @var
     */
    protected $status;

    /**
     * internal mail recipient adresses
     * @var array
     */
    protected $addresses = array();

    /**
     * @var QUI\Events\Event
     */
    public $Events = null;

    /**
     * Builder constructor.
     */
    public function __construct()
    {
        $this->Events = new QUI\Events\Event();
    }

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
                    $Field = new Fields\Input($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Checkbox':
                    $Field = new Fields\Checkbox($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Radiobox':
                    $Field = new Fields\Radiobox($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Name':
                    $Field = new Fields\Name($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Textarea':
                    $Field = new Fields\Textarea($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Users':
                    $Field = new Fields\Users($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/EMail':
                    $Field = new Fields\EMail($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Phone':
                    $Field = new Fields\Phone($this);
                    break;

                case 'package/quiqqer/formbuilder/bin/fields/Select':
                    $Field = new Fields\Select($this);
                    break;
            }

            if (!$Field) {
                continue;
            }

            $Field->setAttributes($element['attributes']);

            $this->elements[] = $Field;
        }

        $this->Events->fireEvent('loaded');
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

        foreach ($this->elements as $Element) {
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

        $missing      = array();
        $this->status = self::STATUS_SEND;

        foreach ($this->elements as $Element) {
            /* @var $Element Field */
            $name = $Element->getAttribute('name');

            if (!$name) {
                $name = $Element->getAttribute('label');
            }

            $name = self::parseFieldName($name);

            if (isset($_REQUEST[$name])) {
                $Element->setAttribute('data', $_REQUEST[$name]);
            }

            if ($Element->getAttribute('required')) {
                try {
                    $Element->checkValue();
                } catch (QUI\Exception $Exception) {
                    $missing[] = $name;
                }
            }
        }

        if (!empty($missing)) {
            $this->Events->fireEvent('statusError');

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'exception.missing.fields'
            ));
        }

        $this->Events->fireEvent('statusSuccess');

        $this->status = self::STATUS_SUCCESS;
    }

    /**
     * @return String
     */
    public function getMailBody()
    {
        $result = '';

        foreach ($this->elements as $Element) {
            /* @var $Element Field */
            $result .= $Element->getHtmlForMail();
            $result .= '<p></p>';
        }

        return $result;
    }

    /**
     * was the form sent successfully?
     *
     * @return bool
     */
    public function isSuccess()
    {
        return $this->status == self::STATUS_SUCCESS;
    }

    /**
     * is the formular in submit status?
     *
     * @return bool
     */
    public function isSend()
    {
        if ($this->status == self::STATUS_SUCCESS) {
            return true;
        }

        if ($this->status == self::STATUS_SEND) {
            return true;
        }

        return false;
    }

    /**
     * Add an e-mail Address
     *
     * @param string $email - E-Mail Address
     * @param string|boolean $name - E-Mail Name
     */
    public function addAddress($email, $name = false)
    {
        $this->addresses[] = array(
            'email' => $email,
            'name' => $name
        );
    }

    /**
     * Return the form addresses
     * @return array
     */
    public function getAddresses()
    {
        return $this->addresses;
    }

    /**
     * Replace unwanted signs for field names
     *
     * @param string $str
     * @return string
     */
    public static function parseFieldName($str)
    {
        return str_replace(array(' ', '-'), '_', $str);
    }
}
