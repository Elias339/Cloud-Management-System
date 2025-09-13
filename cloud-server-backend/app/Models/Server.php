<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'ip_address',
        'provider',
        'status',
        'cpu_cores',
        'ram_mb',
        'storage_gb',
        'version'
    ];

    protected $casts = [
        'cpu_cores' => 'integer',
        'ram_mb' => 'integer',
        'storage_gb' => 'integer',
        'version' => 'integer',
    ];
}
