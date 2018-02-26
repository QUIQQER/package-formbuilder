<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Checkbox
 */

namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;

/**
 * Class Input
 *
 * @package QUI\FormBuilder\Fields
 */
class Text extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        return $this->getAttribute('content');
    }

    /**
     * Create the field
     *
     * @return string
     */
    public function create()
    {
        $this->setAttribute('label', false);

        $html = parent::create();
        $html = str_replace('</fieldset>', '', $html);
        $html = preg_replace('#(<fieldset[^>]*>)#i', '', $html);

        $html = str_replace(
            'qui-formfield-body',
            'qui-formfield-body quiqqer-formbuilder-text',
            $html
        );

        return $html;
    }

    /**
     * Return the html of the element for the mail body
     * @return string
     */
    public function getHtmlForMail()
    {
        return '';
    }

    /**
     * placeholder method
     */
    public function checkValue()
    {
        $this->setAttribute('error', false);
    }
}
