<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\View\View;

class ProjectController extends Controller
{
    public function index(): View
    {
        return view('projects.index', [
            'projects' => Project::ordered()->get(),
            'categories' => config('site.categories'),
        ]);
    }

    public function show(Project $project): View
    {
        return view('projects.show', ['project' => $project]);
    }
}
