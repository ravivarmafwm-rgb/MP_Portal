<?php

namespace App\Http\Requests\Citizen;

use App\Models\CitizenImportBatch;
use Illuminate\Foundation\Http\FormRequest;

class ImportCitizensRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('create', CitizenImportBatch::class) ?? false; }
    public function rules(): array
    {
        return ['file' => ['required', 'file', 'mimes:csv,txt', 'max:51200']];
    }
}
