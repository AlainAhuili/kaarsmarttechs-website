<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\View\View;

class PageController extends Controller
{
    public function home(): View
    {
        $projects = Project::ordered()->get();

        return view('pages.home', [
            'flagship' => $projects->firstWhere('flagship', true) ?? $projects->first(),
            'others' => $projects->where('flagship', false)->take(3),
        ]);
    }

    public function services(): View
    {
        return view('pages.services');
    }

    public function impressum(): View
    {
        return view('pages.impressum');
    }

    public function privacy(): View
    {
        return view('pages.privacy');
    }
}
