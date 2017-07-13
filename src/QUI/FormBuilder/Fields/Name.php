<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Name
 */

namespace QUI\FormBuilder\Fields;

use QUI;
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

        $firstnameName = $this->name . '-firstname';
        $lastnameName  = $this->name . '-lastname';

        if ($this->getAttribute('required')) {
            $content = str_replace('name="firstname"', 'name="' . $firstnameName . '" required="required"', $content);
            $content = str_replace('name="lastname"', 'name="' . $lastnameName . '" required="required"', $content);
        } else {
            $content = str_replace('name="firstname"', 'name="' . $firstnameName . '"', $content);
            $content = str_replace('name="lastname"', 'name="' . $lastnameName . '"', $content);
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

    /**
     * Check value for the input
     */
    public function checkValue()
    {
        $data = $this->getAttribute('data');

        $firstnameName = $this->name . '-firstname';
        $lastnameName  = $this->name . '-lastname';

        // workaround, da das Namenfeld mehrere input fields hat
        if (isset($_REQUEST[$firstnameName]) && empty($data['firstname'])) {
            $data['firstname'] = $_REQUEST[$firstnameName];
        }

        if (isset($_REQUEST[$lastnameName]) && empty($data['lastname'])) {
            $data['lastname'] = $_REQUEST[$lastnameName];
        }

        if (empty($data['firstname']) || empty($data['lastname'])) {
            $this->setAttribute('error', true);

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'missing.field'
            ));
        }

        $this->setAttribute('data', $data);
    }
}
