<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Role;
use App\Models\User;

class NotificationService
{
    public static function notifyUser(
        User $user,
        string $title,
        string $message,
        string $type = 'info',
        ?string $actionUrl = null,
        ?object $notifiable = null,
        string $priority = 'normal',
    ): Notification {
        return Notification::create([
            'user_id'         => $user->id,
            'notifiable_type' => $notifiable ? get_class($notifiable) : null,
            'notifiable_id'   => $notifiable?->id,
            'title'           => $title,
            'message'         => $message,
            'type'            => $type,
            'priority'        => $priority,
            'is_read'         => false,
            'action_url'      => $actionUrl,
            'created_by'      => $user->id,
        ]);
    }

    /**
     * Notify all users with any of the given role slugs.
     *
     * @param  string[]  $roleSlugs
     */
    public static function notifyRoles(
        array $roleSlugs,
        string $title,
        string $message,
        string $type = 'info',
        ?string $actionUrl = null,
        ?object $notifiable = null,
        string $priority = 'normal',
    ): void {
        $roleIds = Role::whereIn('slug', $roleSlugs)->pluck('id');

        User::whereIn('role_id', $roleIds)->each(function (User $user) use (
            $title, $message, $type, $actionUrl, $notifiable, $priority
        ) {
            Notification::create([
                'user_id'         => $user->id,
                'notifiable_type' => $notifiable ? get_class($notifiable) : null,
                'notifiable_id'   => $notifiable?->id,
                'title'           => $title,
                'message'         => $message,
                'type'            => $type,
                'priority'        => $priority,
                'is_read'         => false,
                'action_url'      => $actionUrl,
            ]);
        });
    }
}
