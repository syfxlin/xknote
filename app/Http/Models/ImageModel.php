<?php

namespace App\Http\Models;

use Chumper\Zipper\Zipper;
use Illuminate\Support\Facades\Storage;

class ImageModel
{
    public function getAll($id)
    {
        $images_s = Storage::allFiles('/public/images/uid_' . $id);
        $images = [];
        foreach ($images_s as $image) {
            $images[] = str_replace('public', '/storage', $image);
        }
        return $images;
    }

    public function save($file, $id)
    {
        $path = Storage::putFile('/public/images/uid_' . $id, $file);
        return str_replace('public', '/storage', $path);
    }

    public function delete($name, $id)
    {
        Storage::delete('/public/images/uid_' . $id . '/' . $name);
        return 200;
    }

    public function zip($path, $zip_path)
    {
        if (file_exists($zip_path)) {
            unlink($zip_path);
        }
        $zipper = new Zipper();
        $zipper
            ->make($zip_path)
            ->add($path)
            ->close();
        return 200;
    }
}
