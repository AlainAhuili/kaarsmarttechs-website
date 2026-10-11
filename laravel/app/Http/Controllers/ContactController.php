<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ContactController extends Controller
{
    public function show(): View
    {
        return view('pages.contact');
    }

    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        // Bots fill the hidden "website" field; they get the same answer but nothing is stored.
        if (! $request->isSpam()) {
            ContactMessage::create($request->safe()->only(['name', 'email', 'company', 'message']));
        }

        return redirect('/contact/')->with('sent', true);
    }
}
