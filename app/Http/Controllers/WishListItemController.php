<?php

namespace App\Http\Controllers;

use App\Models\WishListItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishListItemController extends Controller
{
    public function index(): Response
    {
        $wishListItems = WishListItem::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('WishList/Index', [
            'wishListItems' => $wishListItems,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'completed' => 'boolean',
            'completion_date' => 'nullable|date',
        ]);

        auth()->user()->wishListItems()->create([
            'description' => $validated['description'],
            'completed' => (isset($validated['completed']) ? (bool)$validated['completed'] : false) ? 'true' : 'false',
            'completion_date' => $validated['completion_date'] ?? null,
        ]);

        return redirect()->route('wishlist.index');
    }

    public function update(Request $request, WishListItem $wishListItem)
    {
        if ($wishListItem->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'description' => 'nullable|string|max:255',
            'completed' => 'boolean',
            'completion_date' => 'nullable|date',
        ]);

        $completedValue = (isset($validated['completed']) ? (bool)$validated['completed'] : $wishListItem->completed);
        $completionDateValue = $validated['completion_date'] ?? null;

        $wishListItem->update([
            'description' => $validated['description'] ?? $wishListItem->description,
            'completed' => $completedValue ? 'true' : 'false',
            'completion_date' => $completionDateValue,
        ]);

        return redirect()->route('wishlist.index');
    }

    public function destroy(WishListItem $wishListItem)
    {
        if ($wishListItem->user_id !== auth()->id()) {
            abort(403);
        }

        $wishListItem->delete();

        return redirect()->route('wishlist.index');
    }
}
