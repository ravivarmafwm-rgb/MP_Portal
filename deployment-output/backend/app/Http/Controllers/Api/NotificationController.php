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
        $query = Notification::where('user_id', $request->user()->id);

        if ($request->boolean('unread_only')) $query->where('is_read', false);

        $perPage = min(max($request->integer('per_page', 20), 1), 100);
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
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)->where('is_read', false)->count();

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
