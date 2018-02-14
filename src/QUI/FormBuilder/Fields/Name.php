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
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(array(
            'titleLabel'  => $this->getAttribute('title'),
            'firstLabel'  => $this->getAttribute('first'),
            'lastLabel'   => $this->getAttribute('last'),
            'suffixLabel' => $this->getAttribute('suffix'),
            'extended'    => $this->getAttribute('extend'),
            'required'    => $this->getAttribute('required'),
            'fieldname'   => $this->name,
        ));

        return $Engine->fetch(dirname(__FILE__) . '/Name.html');
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
     * Parse form data and put it in the right format for evaluation / display
     *
     * @param array $data
     * @return mixed
     */
    public function parseFormData($data)
    {
        $fields = array(
            'firstname',
            'lastname'
        );

        if ($this->getAttribute('extend')) {
            $fields[] = 'title';
            $fields[] = 'suffix';
        }

        foreach ($fields as $field) {
            $fieldName = $this->name . '-' . $field;

            if (isset($data[$fieldName])) {
                $data[$field] = $_REQUEST[$fieldName];
                unset($data[$fieldName]);
            }
        }

        return $data;
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $data  = $this->getAttribute('data');
        $value = '';

        if (is_array($data)) {
            $value = implode(' ', $data);
        }

        return $value;
    }

    /**
     * Check value for the input
     *
     * @throws QUI\Exception
     */
    public function checkValue()
    {
        $data = $this->getAttribute('data');

        if (empty($data['firstname']) || empty($data['lastname'])) {
            $this->setAttribute('error', true);

            throw new QUI\Exception(array(
                'quiqqer/formbuilder',
                'missing.field'
            ));
        }
    }
}
