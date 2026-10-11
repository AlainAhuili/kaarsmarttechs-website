<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class ContactMessage extends Model
{
    use Prunable;

    protected $fillable = ['name', 'email', 'company', 'message'];

    /** Messages past the retention period stated in the privacy policy. */
    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subDays(config('site.contact_retention_days')));
    }
}
