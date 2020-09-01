<?php

namespace QUI\FormBuilder\Fields\Upload;

use QUI;
use QUI\FormBuilder;
use QUI\FormBuilder\Exception as FormBuilderException;

/**
 * Class Upload
 *
 * Represents a form file upload field
 */
class Upload extends FormBuilder\Field
{
    const SESSION_UPLOAD_CSRF_TOKENS = 'quiqqer_formbuilder_upload_csrf_tokens';
    const UPLOAD_CSRF_TOKEN_LENGTH   = 10;

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $fileTypes       = $this->getAttribute('file_types');
        $maxFileSize     = (int)$this->getAttribute('file_size');
        $fileCount       = (int)$this->getAttribute('file_count');
        $fileTypesCustom = $this->getAttribute('file_endings_custom');
        $layout          = $this->getAttribute('layout');

        switch ($layout) {
            case 'Single':
            case 'Icon':
                if ($fileCount > 1) {
                    $layout = 'DragDrop';
                }
                break;

            default:
                $layout = 'DragDrop';
        }

        if (!empty($fileTypesCustom)) {
            $fileTypesCustom = \explode(',', $fileTypesCustom);
            \array_walk($fileTypesCustom, function (&$v) {
                $v = \trim($v);
            });

            foreach ($fileTypesCustom as $k => $v) {
                $fileEnding = \ltrim(\trim($v), '.');

                if (isset(UploadForm::$fileEndingToMimeType[$fileEnding])) {
                    $fileTypes[] = UploadForm::$fileEndingToMimeType[$fileEnding];
                }
            }
        } else {
            $fileTypesCustom = [];
        }

        $UploadForm = new UploadForm([
            'contextMenu' => true,
            'multiple'    => true,
            'sendbutton'  => false,
            'uploads'     => $fileCount,
            'hasFile'     => false,
            'deleteFile'  => true,

            'allowedFileTypes'  => $fileTypes,
            // eq: ['image/jpeg', 'image/png'] - nur nutzbar mit eigener Klasse
            'allowedFileEnding' => false,
            // eq: ['.gif', '.jpg']  - nur nutzbar mit eigener Klasse
            'maxFileSize'       => $maxFileSize,
            // eq: 20000000 = 20mb  - nur nutzbar mit eigener Klasse

            'typeOfLook'     => $layout,
            // DragDrop, Icon, Single
            'typeOfLookIcon' => 'fa fa-upload'
        ]);

        $allowedTypesLabels = [];

        foreach ($fileTypes as $fileType) {
            $keys        = \array_keys(UploadForm::$fileEndingToMimeType, $fileType);
            $foundInList = false;

            if (!empty($keys)) {
                foreach ($keys as $fileEnding) {
                    if (\in_array('.'.$fileEnding, $fileTypesCustom)) {
                        $allowedTypesLabels[] = '.'.$fileEnding;
                        $foundInList          = true;
                    }
                }
            }

            if (!$foundInList) {
                $fileType = \preg_replace('#[^A-Za-z]#i', '_', $fileType);

                $allowedTypesLabels[] = QUI::getLocale()->get(
                    'quiqqer/formbuilder',
                    'field.Upload.file_type.'.$fileType
                );
            }
        }

        $Engine->assign([
            'UploadForm'       => $UploadForm,
            'token'            => $this->generateSessionUploadCSRFToken(),
            'maxFileCount'     => $fileCount,
            'allowedFileTypes' => \implode(', ', $allowedTypesLabels),
            'maxFileSize'      => $maxFileSize,
            'fieldName'        => $this->getName()
        ]);

        return $Engine->fetch(dirname(__FILE__).'/Upload.html');
    }

    /**
     * Check value for the input
     *
     * @return void
     * @throws FormBuilder\Exception
     */
    public function checkValue()
    {
        // If no file upload is required, nothing needs to be validated
        if (!$this->getAttribute('required')) {
            $this->setAttribute(
                'value',
                \json_encode([
                    'files' => [],
                    'token' => false
                ])
            );
            return;
        }

        // Check if a file was uploaded
        $requestTokenField = 'formbuilder_upload_token__'.$this->getName();

        if (empty($_REQUEST[$requestTokenField])
            || !self::validateUploadToken($_REQUEST[$requestTokenField])) {
            throw new FormBuilderException([
                'quiqqer/formbuilder',
                'missing.field.upload'
            ]);
        }

        try {
            $Site    = $this->Parent->Site;
            $Project = $Site->getProject();

            $uploadDir = QUI::getPackage('quiqqer/formbuilder')->getVarDir().'uploads/';
            $uploadDir .= $Project->getName().'_'.$Project->getLang().'_'.$Site->getId().'/';
            $uploadDir .= $_REQUEST[$requestTokenField].'/bin/';
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            throw new FormBuilderException([
                'quiqqer/formbuilder',
                'missing.field.upload'
            ]);
        }

        $getMissingFilesExceptionText = function () {
            $count = (int)$this->getAttribute('file_count');

            if ($count <= 1) {
                return QUI::getLocale()->get(
                    'quiqqer/formbuilder',
                    'missing.field.missing_file'
                );
            }

            return QUI::getLocale()->get(
                'quiqqer/formbuilder',
                'missing.field.missing_files',
                [
                    'file_count' => $count
                ]
            );
        };

        if (!\file_exists($uploadDir)) {
            throw new FormBuilderException($getMissingFilesExceptionText());
        }

        $files = QUI\Utils\System\File::readDir($uploadDir);

        if (empty($files)) {
            throw new FormBuilderException($getMissingFilesExceptionText());
        }

        // Parse token from filename
        $value = [
            'files' => $files,
            'token' => $_REQUEST[$requestTokenField]
        ];

        $this->setAttribute('value', \json_encode($value));
    }

    /**
     * Get text for the current value of the form field
     *
     * @return string
     */
    public function getValueText()
    {
        $value = \json_decode($this->getAttribute('value'), true);

        if (empty($value['files'])) {
            return QUI::getLocale()->get(
                'quiqqer/formbuilder',
                'field.Upload.no_files_uploaded'
            );
        }

        $files = $value['files'];

        try {
            $uploadDir = self::getUploadDir($this->Parent->Site, $value['token']);
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return QUI::getLocale()->get(
                'quiqqer/formbuilder',
                'field.Upload.file_load_error'
            );
        }

        $value       = [];
        $downloadDir = \str_replace(CMS_DIR, '', $uploadDir);
        $downloadDir = QUI::conf('globals', 'host').'/'.$downloadDir;

        foreach ($files as $file) {
            $value[] = '<li><a target="_blank" href="'.$downloadDir.$file.'">'.$file.'</a></li>';
        }

        return '<ul>'.\implode('', $value).'</ul>';
    }

    /**
     * Get requireJS path to form field JavaScript control
     *
     * @return string|false - Control path or false if no control is used
     */
    public function getJavaScriptControlPath()
    {
        return 'package/quiqqer/formbuilder/bin/frontend/controls/Upload';
    }

    /**
     * Get file upload dir
     *
     * @param QUI\Projects\Site $FormSite
     * @param string $uploadToken (optional) - If omitted the main folder (not request specific) is returned
     * @return string
     *
     * @throws QUI\Exception
     */
    public static function getUploadDir(QUI\Projects\Site $FormSite, string $uploadToken = null)
    {
        $Project = $FormSite->getProject();

        $uploadDir = QUI::getPackage('quiqqer/formbuilder')->getVarDir().'uploads/';
        $uploadDir .= $Project->getName().'_'.$Project->getLang().'_'.$FormSite->getId().'/';

        if (!empty($uploadToken)) {
            $uploadDir .= $uploadToken.'/bin/';
        }

        return $uploadDir;
    }

    /**
     * Generate new CSRF upload token for the current session
     *
     * @return string
     */
    public static function generateSessionUploadCSRFToken()
    {
        $token         = \mb_substr(\hash('sha256', \random_bytes(128)), 0, self::UPLOAD_CSRF_TOKEN_LENGTH);
        $sessionTokens = self::getSessionUploadCSRFTokens();

        $sessionTokens[] = $token;

        QUI::getSession()->set(self::SESSION_UPLOAD_CSRF_TOKENS, \json_encode($sessionTokens));

        return $token;
    }

    /**
     * Get all CSRF upload tokens from the current session
     *
     * @return string[]
     */
    public static function getSessionUploadCSRFTokens()
    {
        $tokens = QUI::getSession()->get(self::SESSION_UPLOAD_CSRF_TOKENS);

        if (empty($tokens)) {
            return [];
        }

        return \json_decode($tokens, true);
    }

    /**
     * Validate a CSRF upload token
     *
     * @param string $token
     * @return bool
     */
    public static function validateUploadToken(string $token)
    {
        return \in_array($token, self::getSessionUploadCSRFTokens());
    }
}
