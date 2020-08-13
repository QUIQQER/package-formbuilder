<?php

namespace QUI\FormBuilder\Fields\Upload;

use QUI;
use QUI\Upload\Form;
use QUI\Utils\Security\Orthos;

class UploadForm extends Form
{
    /**
     * @var QUI\Projects\Project
     */
    protected $Project = null;

    /**
     * @var QUI\Projects\Site
     */
    protected $Site = null;

    /**
     * @var Upload
     */
    protected $UploadField = null;

    /**
     * Form constructor.
     *
     * @param array $params
     */
    public function __construct($params = [])
    {
        /**
         * If a file is uploaded and this class is called during the process
         * the upload settings (set in the form field) have to be read from the
         * file parameters.
         */
        if (!empty($_REQUEST['fileparams'])) {
            $fileParams = \json_decode($_REQUEST['fileparams'], true);

            if (!empty($fileParams['projectname']) && \is_string($fileParams['projectname']) &&
                !empty($fileParams['projectlang']) && \is_string($fileParams['projectlang']) &&
                !empty($fileParams['siteid']) && \is_numeric($fileParams['siteid'])) {
                try {
                    $Project = QUI::getProject(
                        Orthos::clear($fileParams['projectname']),
                        Orthos::clear($fileParams['projectlang'])
                    );

                    $Site        = $Project->get((int)$fileParams['siteid']);
                    $Form        = QUI\FormBuilder\Builder::getFormBuilderBySite($Site);
                    $UploadField = false;

                    foreach ($Form->getElements() as $Element) {
                        if ($Element instanceof Upload) {
                            $UploadField = $Element;
                            break;
                        }
                    }

                    if ($UploadField) {
                        $params['uploads']          = (int)$UploadField->getAttribute('file_count');
                        $params['allowedFileTypes'] = $UploadField->getAttribute('file_types');
                        $params['maxFileSize']      = (int)$UploadField->getAttribute('file_size');
                    }

                    $this->Project     = $Project;
                    $this->Site        = $Site;
                    $this->UploadField = $UploadField;
                } catch (\Exception $Exception) {
                    QUI\System\Log::writeException($Exception);
                }
            }
        }

        parent::__construct($params);
    }

    /**
     * Can be overwritten - will be called if the upload is finished
     *
     * @param string $file - File path
     * @param array $params - File params
     */
    public function onFileFinish($file, $params)
    {
        // Save upload in specific folder
        if (empty($params['params'])) {
            return;
        }

        $uploadParams = $params['params'];

        if (empty($uploadParams['upload_csrf_token']) || !\is_string($uploadParams['upload_csrf_token']) ||
            empty($uploadParams['projectname']) || !\is_string($uploadParams['projectname']) ||
            empty($uploadParams['projectlang']) || !is_string($uploadParams['projectlang']) ||
            empty($uploadParams['siteid']) && !\is_numeric($uploadParams['siteid'])) {
            return;
        }

        // Validate token
        $token = $uploadParams['upload_csrf_token'];

        if (!Upload::validateUploadToken($token)) {
            return;
        }

        // Check if project and site exist
        try {
            $Project = QUI::getProject(
                Orthos::clear($uploadParams['projectname']),
                Orthos::clear($uploadParams['projectlang'])
            );

            $Site      = $Project->get((int)$uploadParams['siteid']);
            $uploadDir = Upload::getUploadDir($Site, $token);

            QUI\Utils\System\File::mkdir($uploadDir);
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);
            return;
        }

        $filename = \str_replace(' ', '_', $params['file']);
        $filename = \preg_replace('#[^A-Za-z0-9_\-\.]#i', '_', $filename);
        $filename = $token.'_'.$filename;

        \rename($file, $uploadDir.$filename);
    }
}
