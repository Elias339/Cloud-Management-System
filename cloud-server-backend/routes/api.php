<?php

use App\Http\Controllers\Api\ServerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', function(\Illuminate\Http\Request $req){
    $credentials = $req->only(['email','password']);
    if (!auth()->attempt($credentials)) {
        return response()->json(['error'=>'invalid_credentials'], 401);
    }
    $user = auth()->user();
    $token = $user->createToken('api-token')->plainTextToken;
    return response()->json(['token'=>$token]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    });
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function(){
    Route::apiResource('servers', ServerController::class);
    Route::post('servers/bulk-delete', [ServerController::class,'bulkDelete']);
});

