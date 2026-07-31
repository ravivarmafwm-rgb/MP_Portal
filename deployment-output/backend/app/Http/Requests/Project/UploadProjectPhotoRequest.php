<?php

namespace App\Http\Requests\Project;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class UploadProjectPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $project = Project::find($this->route('project'));
        return $project && ($this->user()?->can('update', $project) ?? false);
    }

    public function rules(): array
    {
        return [
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'photo_date' => ['required', 'date', 'before_or_equal:today'],
            'captured_by' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_before' => ['sometimes', 'boolean'],
            'is_after' => ['sometimes', 'boolean'],
        ];
    }
}
