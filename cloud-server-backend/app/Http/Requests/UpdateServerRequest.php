<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('server');
        return [
            'name' => ['sometimes','string','max:191'],
            'ip_address' => ['sometimes','ipv4','max:45', Rule::unique('servers','ip_address')->ignore($id)],
            'provider' => ['sometimes', Rule::in(['aws','digitalocean','vultr','other'])],
            'status' => ['sometimes', Rule::in(['active','inactive','maintenance'])],
            'cpu_cores' => ['sometimes','integer','min:1','max:128'],
            'ram_mb' => ['sometimes','integer','min:512','max:1048576'],
            'storage_gb' => ['sometimes','integer','min:10','max:1048576'],
            'version' => ['sometimes','integer']
        ];
    }
}
