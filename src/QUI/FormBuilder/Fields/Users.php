<?php

/**
 * This file contains \QUI\FormBuilder\Fields\Users
 */
namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;

/**
 * Class Users
 *
 * @package QUI\FormBuilder\Fields
 */
class Users extends FormBuilder\Field
{
    /**
     * Field constructor.
     * @param FormBuilder\Builder $Form
     */
    public function __construct(FormBuilder\Builder $Form)
    {
        parent::__construct($Form);

        $self = $this;
        $Form = $this->getParent();

        $Form->Events->addEvent('onLoaded', function () use ($self, $Form) {
            $mailusers = $self->getAttribute('mailusers');

            if (!$mailusers) {
                return;
            }

            $users = $self->getAttribute('users');

            foreach ($users as $uid) {
                try {
                    $User = QUI::getUsers()->get($uid);

                    if ($User->getAttribute('email')) {
                        $Form->addAddress(
                            $User->getAttribute('email'),
                            $User->getName()
                        );
                    }

                } catch (QUI\Exception $Exception) {
                    QUI\System\Log::addDebug($Exception->getMessage());
                }
            }
        });
    }

    /**
     * @return string
     */
    public function getBody()
    {
        $selectable = $this->getAttribute('selectable');
var_dump($this->getAttributes()); exit;
        if (!$selectable) {
            return '';
        }

        $users  = $this->getAttribute('users');
        $result = '<select>';

        foreach ($users as $uid) {
            try {
                $User = QUI::getUsers()->get($uid);

                $result .= '<option value="' . $uid . '">' .
                           $User->getName() .
                           '</option>';

            } catch (QUI\Exception $Exception) {
                QUI\System\Log::addDebug($Exception->getMessage());
            }
        }

        $result .= '</select>';

        return $result;
    }
}
