<?php

/**
 * This file contains \QUI\FormBuilder\Field
 */
namespace QUI\FormBuilder;

use QUI;

/**
 * Class Field
 *
 * @package QUI\FormBuilder
 * @author www.pcsg.de (Henning Leutz)
 */
abstract class Field extends QUI\QDOM implements Interfaces\Field
{
    /**
     * @var null
     */
    protected $_Parent = null;

    /**
     * Create the field
     *
     * @return string
     */
    public function create()
    {
        $result = '<fieldset class="qui-formfield">';

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
     * Set the field parent
     *
     * @param Builder $Form
     */
    public function setParent(Builder $Form)
    {
        $this->_Parent = $Form;
    }

    /**
     * Return the field parent
     *
     * @return null|Builder
     */
    public function getParent()
    {
        return $this->_Parent;
    }
}
