<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class UploadSecurityService
{
    public function validate(UploadedFile $file): void
    {
        $extension = strtolower((string) $file->extension());
        if (!in_array($extension, ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'], true)) $this->reject('Unsupported file type.');
        $mime = strtolower((string) $file->getMimeType());
        if (str_contains($mime, 'php') || str_contains($mime, 'executable') || str_contains($mime, 'javascript')) $this->reject('Executable files are not allowed.');
        $sample = @file_get_contents($file->getRealPath(), false, null, 0, 4096) ?: '';
        if (preg_match('/<\?(php|=)|<script\b|\x00(?:MZ|PK)/i', $sample)) $this->reject('The uploaded file failed security scanning.');
        if (in_array($extension, ['jpg', 'jpeg', 'png'], true) && @getimagesize($file->getRealPath()) === false) $this->reject('The uploaded image is invalid.');
    }
    private function reject(string $message): never { throw ValidationException::withMessages(['file' => [$message]]); }
}
