<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;

class UploadSchemeApplicationDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('citizen') === true;
    }

    public function rules(): array
    {
        return [
            'requirement_id' => ['required', 'uuid', 'exists:scheme_required_documents,id'],
            'file' => ['required', 'file', 'max:10240', 'mimetypes:application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'document_date' => ['required', 'date', 'before_or_equal:today'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
