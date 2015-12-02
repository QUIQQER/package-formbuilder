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

        if ($cssClasses) {
            $result = '<fieldset class="qui-formfield ' . $cssClasses . '">';
        } else {
            $result = '<fieldset class="qui-formfield">';
        }

        // legend
        if ($this->getAttribute('label')) {
            $result .= '<legend>' . $this->getAttribute('label') . '</legend>';
        }

        // content
        $result .= '<div class="qui-formfield-body">';
        $result .= $this->getBody();
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
        return array();
    }

    /**
     * Check value for the input
     *
     * @param String $value
     * @return Boolean
     */
    public function checkValue($value)
    {
        return true;
    }

    /**
     * Return the html of the element for the mail body
     * @return string
     */
    public function getHtmlForMail()
    {
        $name   = $this->getAttribute('name');
        $value  = '';
        $result = '';

        if (!$name) {
            $name = $this->getAttribute('label');
        }

        if ($this->getAttribute('data')) {
            $value = Orthos::clearFormRequest($this->getAttribute('data'));
        }

        if (is_array($value)) {
            $value = implode(', ', $value);
        }

        if (empty($value)) {
            $value = '-';
        }

        $result .= '<p><span class="title">' . $name . '</span><br />';
        $result .= $value . '</p>';

        return $result;
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
}
