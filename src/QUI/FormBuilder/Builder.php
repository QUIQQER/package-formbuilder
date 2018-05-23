<?php

/**
 * This file contains \QUI\FormBuilder\Builder
 */

namespace QUI\FormBuilder;

use QUI;
use QUI\FormBuilder\Exception as FormBuilderException;
use QUI\Captcha\Handler as CaptchaHandler;

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
    protected $elements = [];

    /**
     * internal send status
     * @var
     */
    protected $status;

    /**
     * internal mail recipient adresses
     * @var array
     */
    protected $addresses = [];

    /**
     * @var QUI\Events\Event
     */
    public $Events = null;

    /**
     * The Site this form belongs to
     *
     * @var QUI\Projects\Site
     */
    public $Site = null;

    /**
     * Custom form fields
     *
     * @var array
     */
    protected $customFields = [];

    /**
     * Builder constructor.
     *
     * @param array $customFields (optional) - Add custom fields to the form that are not
     * defined via the Form Site [default: no custom fields]
     *
     * Example for $customFields:
     * [
     *   [
     *     'type'       => 'package/quiqqer/formbuilder/bin/fields/GDPRCheckbox',
     *     'attributes' => [
     *       'text' => 'My label text'
     *     ]
     *   ]
     * [
     */
    public function __construct($customFields = [])
    {
        $this->Events       = new QUI\Events\Event();
        $this->customFields = $customFields;
    }

    /**
     * @param array $formData
     * @throws QUI\ExceptionStack
     */
    public function load(array $formData)
    {
        if (isset($formData['settings'])) {
            $this->setAttributes($formData['settings']);
        }

        // parse receivers
        $receivers = $this->getAttribute('receivers');

        if (!empty($receivers)) {
            // fallback for old API
            if (!isset($receivers['users'])) {
                $receivers = [
                    'users'          => $receivers,
                    'emailaddresses' => []
                ];
            }

            // add receiver users
            $Users = QUI::getUsers();

            foreach ($receivers['users'] as $userId) {
                if (empty($userId)) {
                    continue;
                }

                try {
                    $User  = $Users->get((int)$userId);
                    $email = $User->getAttribute('email');

                    if (empty($email)) {
                        continue;
                    }

                    $this->addAddress($email, $User->getName());
                } catch (\Exception $Exception) {
                    continue;
                }
            }

            // add receiver email addresses
            foreach ($receivers['emailaddresses'] as $emailaddress) {
                if (empty($emailaddress)) {
                    continue;
                }

                $this->addAddress($emailaddress, $emailaddress);
            }
        }

        if (!isset($formData['elements'])) {
            return;
        }

        $elements = array_merge(
            $formData['elements'],
            $this->customFields
        );

        foreach ($elements as $element) {
            if (!isset($element['type'])) {
                continue;
            }

            $Field = $this->getField($element);

            if (!$Field) {
                continue;
            }

            $this->elements[] = $Field;
        }

        $this->Events->fireEvent('loaded');
    }

    /**
     * Get Field with attributes by fieldData
     *
     * @param array $fieldData
     * @return QUI\FormBuilder\Interfaces\Field|false
     */
    public function getField($fieldData)
    {
        switch ($fieldData['type']) {
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

            case 'package/quiqqer/formbuilder/bin/fields/Text':
                $Field = new Fields\Text($this);
                break;

            case 'package/quiqqer/formbuilder/bin/fields/GDPRCheckbox':
                $Field = new Fields\GDPRCheckbox($this);
                break;

            default:
                return false;
        }

        $Field->setAttributes($fieldData['attributes']);

        return $Field;
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


        $result = '<form name="'.$formName.'"
                         action="'.$formAction.'"
                         method="'.$method.'"';

        $formCss    = $this->getAttribute('formCss');
        $cssClasses = [
            'qui-form'
        ];

        if (!empty($formCss)) {
            $formCss = explode(' ', $formCss);

            foreach ($formCss as $formCssEntry) {
                $formCssEntry = ltrim($formCssEntry, '.');
                $cssClasses[] = $formCssEntry;
            }
        }

        $result .= ' class="'.implode(' ', $cssClasses).'">';

        $Template = $this->getAttribute('Template');

        if ($Template) {
            $Template->extendHeaderWithCSSFile(
                URL_OPT_DIR.'quiqqer/formbuilder/bin/Builder.css'
            );
        }

        $fieldIdCounter = 0;

        foreach ($this->elements as $Element) {
            /* @var $Element Field */
            $Element->setNameId($fieldIdCounter++);

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

        // CAPTCHA
        if ($this->getAttribute('captcha')) {
            $CaptchaDisplay = new QUI\Captcha\Controls\CaptchaDisplay();

            $result .= '<fieldset class="qui-formfield">';

            // legend
            $result .= '<legend>'.QUI::getLocale()->get('quiqqer/formbuilder', 'captcha.label').'</legend>';

            // content
            $result .= '<div class="qui-formfield-body">';
            $result .= $CaptchaDisplay->create();
            $result .= '</div>';

            $result .= '</fieldset>';
        }

        // submit button
        if ($this->getAttribute('submit')) {
            $result .= '<input type="submit" name="submit" value="'.$this->getAttribute('submit').'" />';
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

        // validate CAPTCHA
        if ($this->getAttribute('captcha')) {
            if (empty($_REQUEST['quiqqer-captcha-response'])) {
                throw new FormBuilderException([
                    'quiqqer/formbuilder',
                    'exception.Builder.wrong_captcha'
                ]);
            }

            if (!CaptchaHandler::isResponseValid($_REQUEST['quiqqer-captcha-response'])) {
                throw new FormBuilderException([
                    'quiqqer/formbuilder',
                    'exception.Builder.wrong_captcha'
                ]);
            }
        }

        $missing        = [];
        $this->status   = self::STATUS_SEND;
        $fieldIdCounter = 0;

        foreach ($this->elements as $k => $Element) {
            /* @var $Element Field */
            $Element->setNameId($fieldIdCounter);

            $name = $Element->getAttribute('label');

            if (!$name) {
                $name = $Element->getName();
            }

            $name    = self::parseFieldName($name);
            $fieldId = 'field-'.$fieldIdCounter++;

            if (isset($_REQUEST[$fieldId])) {
                $Element->setAttribute('data', $Element->parseFormData($_REQUEST[$fieldId]));
            } else {
                $elementData = [];

                foreach ($_REQUEST as $field => $data) {
                    if (mb_strpos($field, $fieldId.'-') !== false) {
                        $elementData[$field] = $data;
                    }
                }

                if (!empty($elementData)) {
                    $Element->setAttribute('data', $Element->parseFormData($elementData));
                }
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

            throw new QUI\Exception([
                'quiqqer/formbuilder',
                'exception.missing.fields'
            ]);
        }

        $this->Events->fireEvent('statusSuccess');
        $this->status = self::STATUS_SUCCESS;
    }

    /**
     * @return String
     */
    public function getMailBody()
    {
        $template = dirname(__FILE__).'/mailBody.html';
        $Engine   = QUI::getTemplateManager()->getEngine();

        $Engine->assign([
            'elements' => $this->elements,
            'this'     => $this
        ]);

        return $Engine->fetch($template);
    }

    /**
     * @return array
     */
    public function getElements()
    {
        return $this->elements;
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
        $this->addresses[] = [
            'email' => $email,
            'name'  => $name
        ];
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
     * Set Site this Form belongs to
     *
     * @param QUI\Projects\Site $Site
     */
    public function setSite(QUI\Projects\Site $Site)
    {
        $this->Site = $Site;
    }

    /**
     * Replace unwanted signs for field names
     *
     * @param string $str
     * @return string
     */
    public static function parseFieldName($str)
    {
        return htmlspecialchars(str_replace([' ', '-'], '_', $str));
    }
}
