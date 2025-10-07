# school_tool_extension
Tweak the functionality and CSS of SchoolTool
SchoolTool Tweaks

Small MV3 extension for Brave/Chrome that fixes Grade Book UI quirks in SchoolTool.

Features

Stops auto-centering when a cell gets focus.
Keeps the edit button inline with the score input.
Highlights a chosen non-interactive column.
Hides student IDs next to names.
Forces and locks name order to “Last, First”.
Optional wider left gutter on the header.
No data leaves your browser. No background scripts. No heavy observers.

Repo layout
schooltool-tweaks/
├─ manifest.json
├─ observe.js
└─ README.md

<u>Install (load unpacked)</u>

Clone this repo.
git clone https://github.com/rlawry/schooltool-tweaks.git

Open brave://extensions or chrome://extensions.
Enable Developer mode.
Click Load unpacked → select the cloned folder.
Open SchoolTool and hard refresh (Ctrl+Shift+R).

Tip: If your SchoolTool domain differs, edit the matches in manifest.json.

Config

Open observe.js. Edit the constants at the top:

var GUTTER_REM = 2.5;            // left gutter width
var HIDE_STUDENT_IDS = true;     // hide "ID: 123..."
var FORCE_LAST_FIRST = true;     // enforce "Last, First"
var HIDE_NAME_TOGGLE = false;    // hide the name order toggle control
var HIGHLIGHT_COL = 1;           // column index to highlight (0-based)
var HIGHLIGHT_COLOR = '#fff8d6'; // highlight color
var STOP_AUTO_CENTER = true;     // prevent scroll centering on focus


Save. Go to the Extensions page and click Reload on this extension. Hard refresh SchoolTool.

Manifest

manifest.json (MV3, minimal):

{
  "manifest_version": 3,
  "name": "SchoolTool Tweaks",
  "version": "1.0.0",
  "description": "UI and behavior fixes for SchoolTool Grade Book.",
  "content_scripts": [
    {
      "matches": ["*://*.schooltool.com/*", "*://home.schooltool.com/*"],
      "js": ["observe.js"],
      "run_at": "document_start"
    }
  ]
}

How it works

Patches HTMLElement.prototype.focus to use preventScroll inside grid areas.
Downgrades Element.prototype.scrollIntoView to {block:'nearest', inline:'nearest'} so cells are not centered.
Injects one stylesheet to:
Flex the edit cell so the action button stays on the same row.
Hide student IDs via a sibling selector.
Optionally hide the “First/Last” toggle control.
Highlight one column’s non-interactive cells.
Add an optional left gutter on grading pages.
One small retry loop clicks the name-order toggle once, then disables it.

No MutationObserver. No storage. Low memory footprint.

Troubleshooting

No effect: confirm the extension is enabled, Site access is allowed for your SchoolTool domain, and run_at is document_start. Hard refresh the page.
Still recenters: ensure STOP_AUTO_CENTER = true, then reload the extension and the page.
Only some pages affected: add your domain to matches in manifest.json.

Notes

Tested on Brave and Chrome with MV3.
This is client-side CSS/JS only. It does not modify SchoolTool servers.

License
MIT.
