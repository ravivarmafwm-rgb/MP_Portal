<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Notification::where('user_id', $request->user()->id);

            if ($request->boolean('unread_only')) {
                $query->where('is_read', false);
            }

            $perPage = min((int) $request->get('per_page', 20), 100);
            $results = $query->orderByDesc('created_at')->paginate($perPage);

            return response()->json([
                'data' => $results->items(),
                'meta' => [
                    'total'        => $results->total(),
                    'per_page'     => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page'    => $results->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'data' => [],
                'meta' => [
                    'total'        => 0,
                    'per_page'     => 20,
                    'current_page' => 1,
                    'last_page'    => 1,
                ],
            ]);
        }
    }

    public function unreadCount(Request $request): JsonResponse
    {
        try {
            $count = Notification::where('user_id', $request->user()->id)
                ->where('is_read', false)
                ->count();
        } catch (\Exception $e) {
            $count = 0;
        }

        return response()->json(['count' => $count]);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->update(['is_read' => true, 'read_at' => now()]);

        return response()->json($notification);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
