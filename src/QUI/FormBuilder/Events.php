<?php

namespace QUI\FormBuilder;

use QUI;
use QUI\FormBuilder\Fields\Upload\Upload;
use QUI\Projects\Site;
use QUI\Utils\System\File;

/**
 * Class Events
 *
 * Main event handler for quiqqer/formbuilder
 */
class Events
{
    /**
     * quiqqer/contact: onQuiqqerContactDeleteFormRequest
     *
     * Remove uploaded files if request is deleted
     *
     * @param $requestId
     * @param array $requestData
     * @param Site $Site
     * @return void
     */
    public static function onQuiqqerContactDeleteFormRequest($requestId, array $requestData, Site $Site)
    {
        $Builder = Builder::getFormBuilderBySite($Site);

        foreach ($Builder->getElements() as $Element) {
            if (!($Element instanceof Upload)) {
                continue;
            }

            if (empty($requestData['field-'.$Element->getAttribute('pos')])) {
                continue;
            }

            $fieldValueText = $requestData['field-'.$Element->getAttribute('pos')];

            try {
                $uploadDir = Upload::getUploadDir($Site);
                $files     = File::readDir($uploadDir);

                foreach ($files as $file) {
                    if (!\is_dir($uploadDir.$file)) {
                        continue;
                    }

                    foreach (File::readDir($uploadDir.$file) as $uploadFile) {
                        if (\mb_strpos($fieldValueText, $uploadFile) !== false) {
                            File::deleteDir($uploadDir.$file);
                            break;
                        }
                    }
                }
            } catch (\Exception $Exception) {
                QUI\System\Log::writeException($Exception);
            }
        }
    }
}
