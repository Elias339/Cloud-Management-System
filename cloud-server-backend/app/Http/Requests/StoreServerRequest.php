<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:191'],
            'ip_address' => ['required','ipv4','max:45','unique:servers,ip_address'],
            'provider' => ['required', Rule::in(['aws','digitalocean','vultr','other'])],
            'status' => ['sometimes', Rule::in(['active','inactive','maintenance'])],
            'cpu_cores' => ['required','integer','min:1','max:128'],
            'ram_mb' => ['required','integer','min:512','max:1048576'],
            'storage_gb' => ['required','integer','min:10','max:1048576'],
        ];
    }
}
