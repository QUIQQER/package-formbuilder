<?php

/**
 * This file contains \QUI\FormBuilder\Fields\PrivacyPolicyCheckbox
 */

namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;

/**
 * Class PrivacyPolicyCheckbox
 */
class PrivacyPolicyCheckbox extends FormBuilder\Field
{
    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $text   = $this->getAttribute('text');

        if (empty($text)) {
            $text = QUI::getLocale()->get(
                'quiqqer/formbuilder',
                'field.settings.PrivacyPolicyCheckbox.label.default'
            );
        }

        $PrivacyPolicySite = $this->getPrivacyPolicySite();

        if ($PrivacyPolicySite) {
            $url = $PrivacyPolicySite->getUrlRewrittenWithHost();

            $text = preg_replace(
                '#\[([^\]]*)\]#i',
                '<a href="'.$url.'" target="_blank">$1</a>',
                $text
            );

            $Project = QUI::getRewrite()->getProject();

            $Engine->assign([
                'projectName' => $Project->getName(),
                'projectLang' => $Project->getLang(),
                'siteId'      => $PrivacyPolicySite->getId()
            ]);
        }

        $text = str_replace(['[', ']'], '', $text);

        $Engine->assign([
            'label'                     => $text,
            'name'                      => $this->getName(),
            'required'                  => $this->getAttribute('required'),
            'showPrivacyPolicyCheckbox' => $PrivacyPolicySite !== false
        ]);

        return $Engine->fetch(dirname(__FILE__).'/PrivacyPolicyCheckbox.html');
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $data = $this->getAttribute('data');
        $L    = QUI::getLocale();

        if (!empty($data)) {
            return $L->get('quiqqer/formbuilder', 'fields.PrivacyPolicyCheckbox.value.accepted');
        }

        return $L->get('quiqqer/formbuilder', 'fields.PrivacyPolicyCheckbox.value.not_accepted');
    }

    /**
     * Get Privacy Policy Site of the current Project
     *
     * @return QUI\Projects\Site|false
     */
    protected function getPrivacyPolicySite()
    {
        try {
            $Project = QUI::getRewrite()->getProject();

            $result = $Project->getSites([
                'where' => [
                    'type' => 'quiqqer/sitetypes:types/privacypolicy'
                ],
                'limit' => 1
            ]);
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);
            return false;
        }

        if (empty($result)) {
            return false;
        }

        return current($result);
    }
}
