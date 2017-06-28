<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Name
 */

namespace QUI\FormBuilder\Fields;

use QUI\FormBuilder;

/**
 * Class Name
 *
 * @package QUI\FormBuilder\Fields
 *
 */
class Name extends FormBuilder\Field
{
    /**
     * @return string
     */
    public function getBody()
    {
        $file    = OPT_DIR . 'quiqqer/formbuilder/bin/fields/Name.html';
        $content = file_get_contents($file);

        $content = str_replace('{{title}}', $this->getAttribute('title'), $content);
        $content = str_replace('{{first}}', $this->getAttribute('first'), $content);
        $content = str_replace('{{last}}', $this->getAttribute('last'), $content);
        $content = str_replace('{{suffix}}', $this->getAttribute('suffix'), $content);

        if ($this->getAttribute('extend')) {
            $content = '<div class="form-name--extend">' . $content . '</div>';
        }

        return $content;
    }

    /**
     * @return array
     */
    public function getCSSFiles()
    {
        return array(
            URL_OPT_DIR . 'quiqqer/formbuilder/bin/fields/Name.css'
        );
    }
}
