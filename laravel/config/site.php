<?php

return [

    'name' => 'Kaar Smart Techs',

    'contact_email' => env('SITE_CONTACT_EMAIL', 'hello@kaarsmarttechs.com'),

    // The Markdown project entries shared with the Astro site; the seeder loads them into MySQL.
    'projects_path' => env('SITE_PROJECTS_PATH', base_path('../src/content/projects')),

    // Contact messages are deleted after this many days (see the privacy policy).
    'contact_retention_days' => (int) env('SITE_CONTACT_RETENTION_DAYS', 180),

    'statuses' => ['In development', 'Internal', 'Client work'],

    'categories' => [
        'Computer Vision',
        'Embedded Systems',
        'Cloud & DevOps',
        'AI & Agentic Tooling',
        'Code Quality',
    ],

];
