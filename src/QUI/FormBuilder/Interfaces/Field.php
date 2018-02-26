<?php

/**
 * This file contains \QUI\FormBuilder\Interfaces\Field
 */
namespace QUI\FormBuilder\Interfaces;

use QUI;
use QUI\FormBuilder\Builder;

/**
 * Interface Field
 * @package QUI\FormBuilder\Interfaces
 */
interface Field
{
    /**
     * Field constructor.
     * @param $Form
     */
    public function __construct(QUI\FormBuilder\Builder $Form);

    /**
     * Return the Body of the Field
     * @return mixed
     */
    public function getBody();

    /**
     * Return the html of the element for the mail body
     * @return string
     */
    public function getHtmlForMail();

    /**
     * Check tha value data of the field
     * @throws QUI\Exception
     */
    public function checkValue();

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText();

    /**
     * Parse form data and put it in the right format for evaluation / display
     *
     * @param array $data
     * @return mixed
     */
    public function parseFormData($data);

    /**
     * Set the field parent
     *
     * @param Builder $Form
     */
    public function setParent(Builder $Form);

    /**
     * Return the field parent
     *
     * @return null|Builder
     */
    public function getParent();

    /**
     * Set internal name id
     *
     * @param int $id
     */
    public function setNameId($id);

    /**
     * Get name
     *
     * @return string
     */
    public function getName();

    public function getAttribute($k);
    public function setAttribute($k, $v);
    public function getAttributes();
}
