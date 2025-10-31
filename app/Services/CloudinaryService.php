<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    /**
     * Upload a sighting image. Returns basic info for DB.
     */
    public function uploadSighting(UploadedFile $file, int $userId): array
    {
        $folder = "sightings/{$userId}";

        // Works across SDK v2 and v3 once Configuration::instance(...) is set
        $res = (new UploadApi())->upload($file->getRealPath(), [
            'folder'        => $folder,
            'resource_type' => 'image',
            'overwrite'     => false,
        ]);

        return [
            'url'       => $res['secure_url'] ?? $res['url'] ?? null,
            'format'    => $res['format']     ?? null,
            'bytes'     => $res['bytes']      ?? null,
            'width'     => $res['width']      ?? null,
            'height'    => $res['height']     ?? null,
            'public_id' => $res['public_id']  ?? null,
        ];
    }
}
