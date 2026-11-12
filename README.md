# MAT148 — test prep checklists

A single static page for tracking revision before the MAT148H1 term
tests (Calculus I with Proofs, Fall 2026), with a tab per test. Link
straight to one with `index.html#t1` or `index.html#t2`; otherwise the
page reopens on the last tab used.

The Test 1 announcement turned into one set of checkboxes: the nine prep
steps, the Unit 1 and Unit 2 coverage, and the definitions, theorems and
proofs that have to be written from memory. Test 2 (Units 3–5, up to
5.9) has the same shape. Ticks and which groups are open are kept in
localStorage, separately for each test, so closing the tab doesn't lose
them.

Set in OpenDyslexic, bundled in `fonts/` so the page has no network
dependency. Licensed under the SIL Open Font License — see
`fonts/OFL.txt`.

`astuces.html` collects the tricks that only turn up once you're working
problems. `weaknesses.html` collects what keeps going wrong. Both are the
same widget — one line each, the way subtasks work in Aced: enter starts
the next, backspace on an empty line removes it, and the tick marks the
ones you are done with. Copy all puts a list on the clipboard when you
want it somewhere safer than a browser.

No build step and no dependencies — three HTML files, one stylesheet,
one script, a font and an icon.

## Running it

Open `index.html`, or serve the folder:

    python3 -m http.server 8000

## Notes

Content is transcribed from the course's Test 1 and Test 2 announcements. Check
Quercus before relying on anything here — the test details are the
instructor's to change.
