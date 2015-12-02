<?php

/**
 * This file contains \QUI\FormBuilder\Interfaces\Field
 */
namespace QUI\FormBuilder\Interfaces;

use QUI;

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
}
