<?php

namespace App\Http\Utils;

class XkEncryption
{
    public static function encrypt($data, $key)
    {
        return openssl_encrypt($data, 'AES-256-ECB', substr(sha1($key), 0, 32));
    }
    public static function decrypt($data, $key)
    {
        return openssl_decrypt($data, 'AES-256-ECB', substr(sha1($key), 0, 32));
    }
}
