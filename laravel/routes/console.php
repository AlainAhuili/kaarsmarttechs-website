<?php

use Illuminate\Support\Facades\Schedule;

// Deletes contact messages past the retention period (ContactMessage::prunable()).
Schedule::command('model:prune')->daily();
