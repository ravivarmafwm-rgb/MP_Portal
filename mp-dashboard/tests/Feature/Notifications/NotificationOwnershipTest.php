<?php

namespace Tests\Feature\Notifications;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationOwnershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_only_list_and_mark_their_own_notifications(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $own = $this->notification($user, 'Own notification');
        $foreign = $this->notification($other, 'Foreign notification');
        Sanctum::actingAs($user);

        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonFragment(['id' => $own->id])
            ->assertJsonMissing(['id' => $foreign->id]);

        $this->putJson("/api/notifications/{$foreign->id}/read")->assertNotFound();
        $this->assertDatabaseHas('notifications', ['id' => $foreign->id, 'is_read' => false]);

        $this->putJson("/api/notifications/{$own->id}/read")
            ->assertOk()
            ->assertJsonPath('is_read', true);
    }

    private function notification(User $user, string $title): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => 'Test notification content',
        ]);
    }
}
