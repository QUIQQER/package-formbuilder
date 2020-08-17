<?php

/**
 * This file contains \QUI\FormBuilder\Field
 */

namespace QUI\FormBuilder;

use QUI;
use QUI\Utils\Security\Orthos;

/**
 * Class Field
 *
 * @package QUI\FormBuilder
 * @author www.pcsg.de (Henning Leutz)
 */
abstract class Field extends QUI\QDOM implements Interfaces\Field
{
    /**
     * @var null|QUI\FormBuilder\Builder
     */
    protected $Parent = null;

    /**
     * Internal name
     *
     * @var string
     */
    protected $name = 0;

    /**
     * Field constructor.
     * @param Builder $Form
     */
    public function __construct(QUI\FormBuilder\Builder $Form)
    {
        $this->setParent($Form);
    }

    /**
     * Create the field
     *
     * @return string
     */
    public function create()
    {
        $cssClasses = $this->getAttribute('cssClasses');
        $body       = $this->getBody();

        if (empty($body)) {
            return '';
        }

        if ($cssClasses) {
            $result = '<fieldset class="qui-formfield '.$cssClasses.'">';
        } else {
            $result = '<fieldset class="qui-formfield">';
        }

        // legend
        if ($this->getAttribute('label')) {
            $label  = $this->getAttribute('label');
            $result .= '<legend>'.$label;

            // Add asterisk (*) for required fields if not part of the label
            if (!empty($this->getAttribute('required')) && \mb_strpos($label, '*') === false) {
                $result .= ' *';
            }

            $result .= '</legend>';
        }

        // content
        $jsControl = $this->getJavaScriptControlPath();
        $result    .= '<div class="qui-formfield-body"';

        if (!empty($jsControl)) {
            $result .= ' data-control="1"';
            $result .= ' data-qui="'.$jsControl.'"';

            $Project = $this->Parent->Site->getProject();

            $result .= ' data-qui-options-projectname="'.$Project->getName().'"';
            $result .= ' data-qui-options-projectlang="'.$Project->getLang().'"';
            $result .= ' data-qui-options-siteid="'.$this->Parent->Site->getId().'"';
        } else {
            $result .= ' data-control="0"';
        }

        $result .= '>';

        $result .= $body;
        $result .= '</div>';

        $result .= '</fieldset>';

        return $result;
    }

    /**
     * Return the css files
     *
     * @return array
     */
    public function getCSSFiles()
    {
        return [];
    }

    /**
     * Check value for the input
     */
    public function checkValue()
    {
        $data = $this->getAttribute('data');
        $this->setAttribute('error', false);

        if ($data === false) {
            $this->setAttribute('error', true);

            throw new QUI\Exception([
                'quiqqer/formbuilder',
                'missing.field'
            ]);
        }
    }

    /**
     * Return the html of the element for the mail body
     * @return string
     * @throws QUI\Exception
     */
    public function getHtmlForMail()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $name   = $this->getAttribute('label');

        if (!$name) {
            $name = $this->name;
        }

        $Engine->assign([
            'title' => $name,
            'value' => $this->getValueText(),
            'this'  => $this
        ]);

        return $Engine->fetch(dirname(__FILE__).'/Field.html');
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $value = false;

        if ($this->getAttribute('data')) {
            $value = Orthos::clearFormRequest($this->getAttribute('data'));
        }

        if (is_array($value)) {
            $value = implode(', ', $value);
        }

        if (empty($value)) {
            $value = '-';
        }

        return $value;
    }

    /**
     * Parse form data and put it in the right format for evaluation / display
     *
     * @param array $data
     * @return mixed
     */
    public function parseFormData($data)
    {
        return $data;
    }

    /**
     * Set the field parent
     *
     * @param Builder $Form
     */
    public function setParent(Builder $Form)
    {
        $this->Parent = $Form;
    }

    /**
     * Return the field parent
     *
     * @return null|Builder
     */
    public function getParent()
    {
        return $this->Parent;
    }

    /**
     * Set internal name id
     *
     * @param int $id
     */
    public function setNameId($id)
    {
        $this->name = 'field-'.$id;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get requireJS path to form field JavaScript control
     *
     * @return string|false - Control path or false if no control is used
     */
    public function getJavaScriptControlPath()
    {
        return false;
    }
}
