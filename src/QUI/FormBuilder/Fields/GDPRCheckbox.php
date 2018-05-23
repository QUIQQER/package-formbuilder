<?php

/**
 * This file contains \QUI\FormBuilder\Fields\GDPRCheckbox
 */

namespace QUI\FormBuilder\Fields;

use QUI;
use QUI\FormBuilder;

/**
 * Class GDPRCheckbox
 */
class GDPRCheckbox extends FormBuilder\Field
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
                'field.settings.GDPRCheckbox.label.default'
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
        }

        $text    = str_replace(['[', ']'], '', $text);
        $Project = QUI::getRewrite()->getProject();

        $Engine->assign([
            'label'       => $text,
            'name'        => $this->getName(),
            'required'    => $this->getAttribute('required'),
            'projectName' => $Project->getName(),
            'projectLang' => $Project->getLang(),
            'siteId'      => $PrivacyPolicySite->getId()
        ]);

        return $Engine->fetch(dirname(__FILE__).'/GDPRCheckbox.html');
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
