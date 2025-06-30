<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Plan::with('features')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:plans|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'features' => 'array',
            'features.*.feature_code' => 'required|string',
            'features.*.value' => 'required|string',
        ]);

        $plan = Plan::create($request->only(['name', 'slug', 'price', 'description']));

        foreach ($request->features as $feature) {
            $plan->features()->create([
                'feature_code' => $feature['feature_code'],
                'value' => $feature['value'],
            ]);
        }

        return redirect()->route('admin.plans.index')->with('success', 'Plan creado exitosamente!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Plan $plan)
    {
        return response()->json($plan->load('features'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plan $plan)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:plans,slug,' . $plan->id . '|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'features' => 'array',
            'features.*.feature_code' => 'required|string',
            'features.*.value' => 'required|string',
        ]);

        $plan->update($request->only(['name', 'slug', 'price', 'description']));

        $plan->features()->delete(); // Remove existing features

        foreach ($request->features as $feature) {
            $plan->features()->create([
                'feature_code' => $feature['feature_code'],
                'value' => $feature['value'],
            ]);
        }

        return redirect()->route('admin.plans.index')->with('success', 'Plan actualizado exitosamente!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plan $plan)
    {
        $plan->delete();

        return response()->json(null, 204);
    }
}
