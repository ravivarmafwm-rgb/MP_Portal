<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Crypt;

class TotpService
{
    public function provision(User $user): array
    {
        $secret = $this->base32Encode(random_bytes(20));
        $user->forceFill(['mfa_secret' => Crypt::encryptString($secret), 'mfa_enabled' => false])->save();
        $issuer = rawurlencode((string) config('app.name', 'MP Connect'));
        $label = rawurlencode($issuer.':'.$user->email);
        return ['secret' => $secret, 'otpauth_url' => "otpauth://totp/{$label}?secret={$secret}&issuer={$issuer}&algorithm=SHA1&digits=6&period=30"];
    }

    public function confirm(User $user, string $code): bool
    {
        if (!$this->verify($user, $code)) return false;
        $user->forceFill(['mfa_enabled' => true, 'mfa_confirmed_at' => now()])->save();
        return true;
    }

    public function verify(User $user, string $code): bool
    {
        if (!$user->mfa_secret || !preg_match('/^\d{6}$/', $code)) return false;
        try { $secret = Crypt::decryptString($user->mfa_secret); } catch (\Throwable) { return false; }
        $counter = intdiv(time(), 30);
        foreach ([-1, 0, 1] as $offset) {
            $binary = pack('N*', 0).pack('N*', $counter + $offset);
            $hash = hash_hmac('sha1', $binary, $this->base32Decode($secret), true);
            $index = ord($hash[19]) & 0x0f;
            $value = ((ord($hash[$index]) & 0x7f) << 24) | ((ord($hash[$index + 1]) & 0xff) << 16) | ((ord($hash[$index + 2]) & 0xff) << 8) | (ord($hash[$index + 3]) & 0xff);
            if (hash_equals(str_pad((string) ($value % 1000000), 6, '0', STR_PAD_LEFT), $code)) return true;
        }
        return false;
    }

    private function base32Encode(string $input): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; $bits = ''; $output = '';
        foreach (str_split($input) as $char) $bits .= str_pad(decbin(ord($char)), 8, '0', STR_PAD_LEFT);
        foreach (str_split($bits, 5) as $chunk) $output .= $alphabet[bindec(str_pad($chunk, 5, '0'))];
        return $output;
    }

    private function base32Decode(string $input): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; $bits = '';
        foreach (str_split(strtoupper($input)) as $char) { $pos = strpos($alphabet, $char); if ($pos !== false) $bits .= str_pad(decbin($pos), 5, '0', STR_PAD_LEFT); }
        $output = ''; foreach (str_split($bits, 8) as $chunk) if (strlen($chunk) === 8) $output .= chr(bindec($chunk));
        return $output;
    }
}
