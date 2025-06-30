<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plan;

class DefaultPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Free Plan
        $freePlan = Plan::firstOrCreate(
            ['slug' => 'free'],
            [
                'name' => 'Free',
                'price' => 0.00,
                'description' => 'Plan gratuito con funcionalidades básicas.',
            ]
        );

        $freePlan->features()->delete(); // Clear existing features
        $freePlan->features()->createMany([
            ['feature_code' => 'max_messages', 'value' => '1'],
            ['feature_code' => 'max_documents', 'value' => '1'],
            ['feature_code' => 'max_memories', 'value' => '1'],
            ['feature_code' => 'video_recording', 'value' => 'false'],
            ['feature_code' => 'max_trusted_contacts', 'value' => '2'],
        ]);

        // Light Plan
        $lightPlan = Plan::firstOrCreate(
            ['slug' => 'light'],
            [
                'name' => 'Light',
                'price' => 5.00,
                'description' => 'Plan ligero con más funcionalidades.',
            ]
        );

        $lightPlan->features()->delete(); // Clear existing features
        $lightPlan->features()->createMany([
            ['feature_code' => 'max_messages', 'value' => '5'],
            ['feature_code' => 'max_documents', 'value' => '5'],
            ['feature_code' => 'max_memories', 'value' => '5'],
            ['feature_code' => 'video_recording', 'value' => 'true'],
            ['feature_code' => 'video_duration', 'value' => '120'], // 2 minutes in seconds
            ['feature_code' => 'max_trusted_contacts', 'value' => '5'],
        ]);
    }
}
