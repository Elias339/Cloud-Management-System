<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServerResource extends JsonResource
{
    public function toArray(Request $request) {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'ip_address' => $this->ip_address,
            'provider' => $this->provider,
            'status' => $this->status,
            'cpu_cores' => $this->cpu_cores,
            'ram_mb' => $this->ram_mb,
            'storage_gb' => $this->storage_gb,
            'version' => $this->version,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
