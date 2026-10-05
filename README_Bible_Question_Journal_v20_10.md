# Bible Question Journal

A private, cloud-connected Progressive Web App (PWA) for structured
Bible reading, question collection, research, and reading-progress
tracking.

The project was built as a personal Bible study journal and evolved from
a local browser-based prototype into a multi-device application using
GitHub Pages, Supabase Authentication, and Supabase PostgreSQL.

> **Current stable version:** `v20.10`

------------------------------------------------------------------------

## Overview

Bible Question Journal is designed around one main idea:

> Read the Bible → notice a question → record it precisely → research it
> → keep the result connected to the original question.

The application separates **Bible reading progress** from
**question/research data**, so completing a chapter does not mean that
questions from that chapter are automatically considered answered.

The current version supports:

-   Google authentication
-   Cloud-synchronized personal data
-   Bible reading in Urdu and English
-   Reading progress across all 66 books
-   Chapter and verse-level reading position
-   Structured question creation
-   Question categories and statuses
-   Question filtering and search
-   Question editing, deletion, and ordering
-   Research attached to individual questions
-   Online research/search interface
-   Research minimization and restoration
-   Responsive desktop and mobile UI
-   PWA installation
-   Cross-device access through Supabase

------------------------------------------------------------------------

## Current Version

**v20.10**

### v20.10 focus

The current release preserves the complete cloud-connected application
while refining the mobile Bible-reading interface.

On mobile, the Bible page uses the reading controls:

-   **Reset this book**
-   **Reset all books**

The mobile layout does not display the separate Book Progress and
Study/Add Question containers. Verse interaction remains available for
creating questions.

The desktop interface retains its existing Bible-reading layout.

------------------------------------------------------------------------

# Technology Stack

  Layer                     Technology
  ------------------------- -------------------------------------
  Frontend                  HTML5, CSS3, Vanilla JavaScript
  Application type          Progressive Web App (PWA)
  Hosting                   GitHub Pages
  Authentication            Supabase Auth
  Social login              Google OAuth
  Database                  Supabase PostgreSQL
  Authorization             Supabase Row Level Security (RLS)
  Supabase client           `@supabase/supabase-js` v2 via CDN
  Urdu Bible                WordProject Urdu Bible JSON dataset
  Urdu hosting              GitHub Pages
  English Bible             Midvash Bible API
  Offline Bible caching     Service Worker / browser cache
  Local application cache   Browser `localStorage`
  Icons / branding          Custom project assets

GitHub Pages hosts the static HTML/CSS/JavaScript application directly
from the repository. GitHub documents project sites as being published
from a repository and served under the repository path. GitHub Pages
sites on the `github.io` domain support HTTPS.

------------------------------------------------------------------------

# Architecture

The current application follows this general architecture:

``` text
                    ┌─────────────────────────┐
                    │     GitHub Pages        │
                    │                         │
                    │  Bible Question Journal │
                    │     HTML/CSS/JS PWA     │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
        ┌─────────────────┐             ┌─────────────────┐
        │  Supabase Auth  │             │  Bible Sources  │
        │                 │             │                 │
        │ Google OAuth    │             │ Urdu → GitHub   │
        │ User sessions   │             │ English →       │
        │ JWT sessions    │             │ Midvash API     │
        └────────┬────────┘             └─────────────────┘
                 │
                 ▼
        ┌─────────────────────────────┐
        │    Supabase PostgreSQL      │
        │                             │
        │ profiles                    │
        │ questions                   │
        │ reading_progress            │
        │ research                    │
        │                             │
        │ Row Level Security (RLS)    │
        └─────────────────────────────┘
```

------------------------------------------------------------------------

# Authentication

## Supabase Auth

Authentication is handled by **Supabase Auth**.

The current application uses **Google Sign-In** as the login method.

The frontend creates a Supabase client using:

-   Supabase project URL
-   Supabase publishable key

The publishable key is intended for frontend use. The application must
**never** contain a Supabase secret/service-role key.

Supabase Auth supports social login and uses JWT-based sessions.
Supabase integrates these sessions with PostgreSQL Row Level Security so
database access can be restricted to the authenticated user.

### Google OAuth flow

The login process is:

``` text
User opens PWA
       ↓
Continue with Google
       ↓
Google authentication
       ↓
Supabase OAuth callback
       ↓
OAuth authorization code
       ↓
Session exchange
       ↓
Supabase user session
       ↓
Cloud data loaded
       ↓
Bible Question Journal opens
```

The application explicitly handles the OAuth authorization-code callback
before restoring the authenticated session.

------------------------------------------------------------------------

# User Data Isolation

Each authenticated user has their own data.

The important database relationship is:

``` text
Google account
      ↓
Supabase Auth user
      ↓
user_id
      ↓
User's database rows
```

Application data is associated with the authenticated Supabase user's
ID.

The main user-owned tables are:

### `profiles`

Stores the application profile associated with the Supabase Auth user.

### `questions`

Stores the user's Bible questions and their structured information.

### `reading_progress`

Stores the user's Bible-reading positions and completed chapters.

### `research`

Stores research information associated with the user's questions.

Supabase Row Level Security is used so that authenticated users can only
access rows belonging to their own account.

Supabase Auth tokens are JWTs, and those tokens can be used by
PostgreSQL RLS policies to enforce row-level authorization.

------------------------------------------------------------------------

# Database Structure

## Questions

The question records include information such as:

-   Question ID
-   User ID
-   Book
-   Book code
-   Chapter
-   Verse/reference
-   Additional references
-   Question
-   Why the question was asked
-   Category
-   Related question IDs
-   Status
-   Investigation/answer
-   Sources
-   Conclusion
-   Sort order
-   Creation date
-   Update date

Question IDs use the project's Roman-Urdu book codes, for example:

``` text
PYD 001
PYD 002
KHU 001
```

------------------------------------------------------------------------

## Reading Progress

Reading progress is stored separately from questions.

The application stores:

-   Current book
-   Current chapter
-   Current verse
-   Completed chapters
-   Last-reading marker
-   Update time

The database uses a `completed_chapters` integer array to preserve
individual completed chapters and an `is_last` marker to identify the
user's last reading location.

This allows the application to resume the user at the exact
book/chapter/verse position across devices.

------------------------------------------------------------------------

## Research

Research is attached to individual questions.

Research information can include:

-   Research status
-   Research notes
-   Sources
-   Conclusion
-   Generated search query
-   Research floating-window position

The original question remains separate from its research so that the
original wording is not silently changed by later investigation.

------------------------------------------------------------------------

# Bible Reader

The Bible Reader currently supports:

-   66 Bible books
-   Chapter selection
-   Verse-level reading
-   Urdu
-   English
-   Translation selection
-   Reading progress
-   Last-reading position
-   Chapter navigation
-   Verse interaction
-   Question creation from the reader
-   Search/research workflows
-   Previously opened chapter caching

------------------------------------------------------------------------

# Urdu Bible

The Urdu reader uses a **WordProject Urdu Bible dataset** converted into
JSON.

The dataset is hosted through the project's separate GitHub Pages
repository:

``` text
https://hebron10.github.io/urdu-bible-json/
```

The application loads book/chapter JSON files as required.

The Urdu reading area uses a web-optimized Urdu typography setup based
on:

-   Noto Nastaliq Urdu
-   Noto Naskh Arabic fallback
-   Noto Sans Arabic fallback

Only the Scripture reading area switches to RTL. The overall application
interface remains LTR.

------------------------------------------------------------------------

# English Bible

The English Bible reader currently uses the **Midvash Bible API**.

Midvash provides a free, read-only Bible API without an API key and
supports direct browser access through CORS. Its current API provides
Bible versions, books, chapters, verses, and passages.

The application discovers available English versions from:

``` text
/v1/versions?language=en
```

and has fallback English versions including:

-   King James Version (KJV)
-   World English Bible (WEB)
-   American Standard Version (ASV)

The application only relies on versions available through the Midvash
API.

### Why Midvash instead of YouVersion?

Earlier development used the YouVersion Platform API.

The YouVersion API requires an application key and its browser/API
behavior makes direct static GitHub Pages access unsuitable for the
current implementation. A server-side proxy would be required for a
reliable direct YouVersion content integration.

For this reason, the current public PWA uses:

``` text
Urdu    → WordProject JSON
English → Midvash API
```

This keeps the Bible reader compatible with the static GitHub Pages
architecture.

------------------------------------------------------------------------

# Question System

Questions are structured rather than stored as simple notes.

## Categories

The current categories include:

-   Critical / Objection
-   Theological
-   Moral / Ethical
-   Historical
-   Cultural
-   Scientific / Natural
-   Translation / Language
-   Contradiction / Tension
-   Chronology / Timeline
-   Genealogy
-   Prophecy
-   Symbolism
-   Interpretation
-   Cross-reference
-   Personal / Application
-   Other

## Statuses

Questions can have statuses such as:

-   Unanswered
-   Investigating
-   Partially answered
-   Answered
-   Need further investigation

------------------------------------------------------------------------

# Research Workflow

The Research system is connected to individual questions.

The intended workflow is:

``` text
Question
   ↓
Research
   ↓
Online search
   ↓
Sources / notes
   ↓
Investigation
   ↓
Conclusion / current understanding
```

Research can be minimized and restored without intentionally creating a
new research session.

The application also remembers research UI positioning for supported
research states.

> The current implementation provides a research/search interface. It
> does not include a secure server-side Gemini/LLM API integration.
> Adding a private AI API key directly to this static frontend would not
> be secure.

------------------------------------------------------------------------

# Local Storage + Cloud Storage

The application uses a hybrid storage model.

## Local storage

The browser's `localStorage` is used for local application state and
caching.

This helps the application remain responsive and retain local
UI/application state.

## Cloud storage

Supabase is the cloud source for authenticated user data.

The application synchronizes:

-   Questions
-   Research
-   Reading progress

with Supabase.

The general model is:

``` text
Browser state
     ↕
Supabase cloud state
```

This allows the same authenticated account to access its journal from
different devices.

------------------------------------------------------------------------

# Offline Behavior

The PWA uses a Service Worker.

Previously opened Bible chapters can be cached so that they remain
available when the network is unavailable.

However, this is **not a completely offline-first cloud application**.

Important distinction:

-   Cached Bible content can remain available offline.
-   Local application state can remain in browser storage.
-   Cloud synchronization requires network access.
-   A newly opened Bible chapter may require an internet connection.
-   A new device requires internet access to authenticate and retrieve
    cloud data.

------------------------------------------------------------------------

# Progressive Web App

The application is installable as a PWA when served through an
appropriate HTTPS environment.

The manifest defines:

-   Application name
-   Short name
-   Start URL
-   Standalone display
-   Theme color
-   Background color
-   192px icon
-   512px icon
-   Maskable icons
-   Application scope

The service worker handles application/Bible resource caching.

GitHub Pages is suitable for this static PWA architecture and provides
HTTPS for `github.io` sites.

------------------------------------------------------------------------

# Deployment

The production application is hosted through:

**GitHub Pages**

Repository:

``` text
https://github.com/Hebron10/bible-question-journal
```

The GitHub Pages project URL follows the standard project-site
structure:

``` text
https://hebron10.github.io/bible-question-journal/
```

The deployment process is:

``` text
Local project
     ↓
GitHub repository
     ↓
main branch
     ↓
GitHub Pages
     ↓
HTTPS PWA
```

------------------------------------------------------------------------

# Development Process

The project was developed incrementally rather than being created as one
large application.

The major development stages were:

1.  Initial Bible Question Journal UI
2.  Bible Reader integration
3.  Urdu Bible dataset preparation
4.  GitHub-hosted Urdu JSON API
5.  English Bible API integration
6.  Reading progress system
7.  Question management system
8.  Research system
9.  PWA installability
10. Branding and application icons
11. Supabase cloud database
12. Google authentication
13. Cross-device synchronization
14. OAuth callback fixes
15. Mobile interface refinement

The application was repeatedly tested and corrected against actual
browser behavior during development.

------------------------------------------------------------------------

# Current User Capacity / Service Limits

The application itself does **not impose a hard application-level limit
on the number of registered users**.

The practical limits currently come primarily from the services being
used.

## Supabase Free Plan

Current Supabase Free Plan limits include:

  Resource                               Free Plan
  --------------------------- --------------------
  Database                      500 MB per project
  Monthly Active Users                      50,000
  Storage                                     1 GB
  Egress                             5 GB included
  Edge Function invocations                500,000
  Realtime messages                      2 million
  Realtime peak connections                    200

Supabase currently lists the Free Plan at \$0/month. Free projects can
also be paused after a period of inactivity.
citeturn0search2turn0search8

These are **service quotas, not the application's own design limit**.

For this project, the 500 MB PostgreSQL database limit is unlikely to be
reached quickly because the application primarily stores structured text
records rather than large media files.

## GitHub Pages

GitHub Pages is being used as static hosting rather than as an
application backend. It is therefore not responsible for storing the
user's questions or reading progress.

User data is stored in Supabase, not inside the GitHub repository.

------------------------------------------------------------------------

# Current Security Model

The frontend contains the Supabase project URL and publishable key
required for the client-side Supabase SDK.

This is expected for a frontend Supabase application.

The following must **never** be committed to this repository:

``` text
service_role key
Supabase secret key
Google OAuth client secret
private API keys
server credentials
```

The application relies on Supabase Auth + RLS rather than hiding
database credentials inside frontend JavaScript.

Supabase specifically recommends using the frontend Data API with a
publishable key and Row Level Security, while secret/service-role
credentials must remain server-side. citeturn0search1turn0search13

------------------------------------------------------------------------

# Current Limitations

## 1. Static frontend architecture

The application is currently a static PWA hosted through GitHub Pages.

There is no dedicated application server.

This limits features that require secret credentials or server-side
processing.

------------------------------------------------------------------------

## 2. No secure server-side AI integration

There is currently no private Gemini/OpenAI API integration.

A future AI research assistant would require a backend or secure
server-side function so that the private API credential is not exposed
in browser JavaScript.

------------------------------------------------------------------------

## 3. Bible translation licensing

The application cannot simply provide every commercial Bible
translation.

The English reader currently uses translations available through the
Midvash API and the Urdu reader uses the project's WordProject dataset.

Adding another translation depends on:

-   availability
-   licensing
-   redistribution rights
-   API access
-   technical compatibility

------------------------------------------------------------------------

## 4. Cloud sync requires internet

Supabase synchronization requires an internet connection.

The PWA can retain local state/cache, but it should not be treated as a
fully offline cloud database.

------------------------------------------------------------------------

## 5. Supabase Free Plan dependency

The current project is suitable for personal use and small-scale
testing.

If usage grows substantially, the Supabase project may eventually need a
paid plan or architectural changes.

------------------------------------------------------------------------

## 6. No advanced multi-user collaboration

Users are isolated from one another.

The current application is a **personal journal**, not a collaborative
Bible-study platform.

There is currently no:

-   shared question library
-   public profile
-   group Bible study
-   team workspace
-   administrator dashboard
-   public question sharing system

------------------------------------------------------------------------

## 7. Browser/PWA dependency

Some behavior depends on browser support for:

-   Service Workers
-   Web App Manifest
-   localStorage
-   browser cache
-   OAuth redirects
-   PWA installation

The recommended production environment is a modern browser over HTTPS.

------------------------------------------------------------------------

# Privacy Model

The application is designed so that authenticated journal data belongs
to the user's Supabase account.

The GitHub repository contains the application code and public/static
resources.

It does **not** serve as the database for personal journal entries.

The intended separation is:

``` text
Public
├── Application code
├── PWA assets
├── Bible reader code
└── Public Bible resources

Private per-user
├── Questions
├── Reading progress
├── Research
└── Profile/account data
```

------------------------------------------------------------------------

# Project Repositories

### Main PWA

``` text
https://github.com/Hebron10/bible-question-journal
```

### Urdu Bible JSON

``` text
https://github.com/Hebron10/urdu-bible-json
```

The Urdu repository is used as a public static JSON source for the Bible
Reader.

------------------------------------------------------------------------

# Future Development

Possible future improvements include:

-   Secure server-side AI research assistant
-   Better offline synchronization queue
-   Conflict resolution for simultaneous multi-device edits
-   Export/import of journal data
-   Question backup files
-   Additional licensed Bible translations
-   More detailed research source management
-   User settings and preferences stored in the cloud
-   Advanced analytics
-   Optional custom domain
-   Automated deployment/versioning
-   Database backups and recovery strategy
-   More granular account/security controls

These are future possibilities, not requirements of the current v20.10
release.

------------------------------------------------------------------------

# Version History

  ------------------------------------------------------------------------
  Version                             Major change
  ----------------------------------- ------------------------------------
  v14.x                               Stable Bible Reader architecture
                                      using WordProject Urdu + Midvash
                                      English

  v15                                 Major
                                      dashboard/questions/Bible/research
                                      redesign

  v16                                 Reading completion and research UI
                                      refinements

  v17                                 Dialog, reset-reading and Urdu
                                      typography refinements

  v18                                 Dialog visibility and question-ID UI
                                      fixes

  v19                                 Research interface redesign

  v20                                 Research session restoration

  v20.1                               Preserved research browser session

  v20.3                               PWA installation improvements

  v20.4                               Supabase cloud data + Google
                                      authentication

  v20.5--v20.7                        OAuth callback and
                                      authentication-screen fixes

  v20.8--v20.9                        Mobile reading/content scroll
                                      refinements

  **v20.10**                          Mobile Bible reading controls
                                      refinement
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# Status

**Current status: Stable personal-use release**

The current application has working:

-   Google authentication
-   Supabase cloud storage
-   User-specific data
-   Cross-device journal access
-   Bible reading
-   Reading progress
-   Question management
-   Research management
-   PWA installation
-   Responsive desktop/mobile interface

The project is still actively extensible and should be considered a
personal/small-scale application rather than a production SaaS platform.

------------------------------------------------------------------------

# License

The application code is a personal project.

Bible text, Bible datasets, APIs, fonts, icons, and third-party services
remain subject to their respective licenses and terms.

Before redistributing Bible content or adding another translation,
verify that its license permits the intended use.

------------------------------------------------------------------------

## Acknowledgements

This project relies on several external technologies and resources:

-   GitHub / GitHub Pages
-   Supabase
-   Google OAuth
-   Midvash Bible API
-   WordProject Urdu Bible dataset
-   Noto font family

Their respective documentation, licenses, and service terms apply
independently of this project.
