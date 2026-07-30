<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('documents.manage') ?? false; }
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240', 'mimetypes:application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'title' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string', 'max:2000'],
            'documentable_type' => ['required', 'in:citizen,volunteer,project'], 'documentable_id' => ['required', 'uuid'],
            'document_category_id' => ['required', 'uuid', 'exists:document_categories,id'],
            'document_date' => ['nullable', 'date', 'before_or_equal:today'], 'expiry_date' => ['nullable', 'date', 'after:document_date'],
            'is_confidential' => ['sometimes', 'boolean'],
        ];
    }
}
