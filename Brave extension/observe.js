// observe.js — lean, no storage, no heavy observers
(function () {
  'use strict';

  /* ====== SETTINGS ====== */
  var GUTTER_REM = 2.5;                 // left gutter
  var HIDE_STUDENT_IDS = true;          // hide "ID: 123..."
  var FORCE_LAST_FIRST = true;          // enforce "Last, First"
  var HIDE_NAME_TOGGLE = false;         // hide the toggle control
  var HIGHLIGHT_COL = 1;                // column index to mark non-interactive
  var HIGHLIGHT_COLOR = '#fff8d6';      // pale yellow
  var STOP_AUTO_CENTER = true;          // kill scroll centering on focus

  /* ====== CORE PATCHES (cheap) ====== */
  if (STOP_AUTO_CENTER && !window.__stPatched) {
    window.__stPatched = true;

    // 1) focus() without scrolling in grids
    var nativeFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (arg) {
      if (this.closest('.k-grid,.telerik-grid-gradebook-editor,#grid-container')) {
        try { return nativeFocus.call(this, Object.assign({}, arg || {}, { preventScroll: true })); }
        catch (e) { /* old engines */ }
      }
      return nativeFocus.call(this, arg);
    };

    // 2) scrollIntoView() ⇒ "nearest" (never center)
    var nativeSIV = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (arg) {
      var inGrid = this.closest && this.closest('.k-grid,.telerik-grid-gradebook-editor,#grid-container');
      var wantsCenter = arg && typeof arg === 'object' && (arg.block === 'center' || arg.inline === 'center');
      if (inGrid || wantsCenter) {
        var opts = Object.assign({}, (arg && typeof arg === 'object') ? arg : null, {
          block: 'nearest', inline: 'nearest', behavior: 'auto'
        });
        return nativeSIV.call(this, opts);
      }
      return nativeSIV.call(this, arg);
    };
  }

  /* ====== CSS ONLY (no DOM scans) ====== */
  var STYLE_ID = 'st-lite-style';
  if (!document.getElementById(STYLE_ID)) {
    var css = `
:root{--st-gutter:${GUTTER_REM}rem;--st-hl:${HIGHLIGHT_COLOR};}

/* widen header gutter only on grading pages */
.grading-header-breadcrumbs{ padding-left: var(--st-gutter) !important; }

/* keep edit button inline with input using flex; no DOM moves */
.telerik-grid-gradebook-editor .k-grid-edit-cell > .h-100{ display:flex; align-items:center; }
.telerik-grid-gradebook-editor .k-grid-edit-cell > .h-100 > .d-flex.align-items-center{ flex:1 1 auto; }
.telerik-grid-gradebook-editor .k-grid-edit-cell > .h-100 > .text-truncate{ flex:0 0 auto; margin-left:.25rem; }

/* hide student IDs next to names */
${HIDE_STUDENT_IDS ? `.telerik-grid-gradebook-editor h4[id^="H4_StudentName_"]+h6{display:none!important;}` : ''}

/* hide the name toggle control if desired */
${HIDE_NAME_TOGGLE ? `.telerik-grid-gradebook-editor .k-grid-header .icon.arrows-right-left{display:none!important;}` : ''}

/* non-interactive highlight for chosen column (CSS-only) */
.telerik-grid-gradebook-editor td.k-table-td[data-col-index="${HIGHLIGHT_COL}"]:not(.k-grid-edit-cell):not(:has(input,button,select,textarea,a,.k-button)){
  background-color: var(--st-hl) !important; cursor:not-allowed;
}
`.trim();
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  /* ====== ENFORCE "LAST, FIRST" (light check; no MutationObserver) ====== */
  if (FORCE_LAST_FIRST) {
    var tries = 0, maxTries = 20;
    var timer = setInterval(function () {
      tries++;
      var tog = document.querySelector('.telerik-grid-gradebook-editor .k-grid-header .icon.arrows-right-left');
      if (tog) {
        var label = (tog.textContent || '').toLowerCase().replace(/\s+/g,' ').trim();
        if (/^first\s+last$/.test(label)) { try { tog.click(); } catch(e){} }
        // lock by disabling pointer events; zero extra listeners
        tog.style.pointerEvents = 'none';
        tog.classList.remove('clickable');
        clearInterval(timer);
      }
      if (tries >= maxTries) clearInterval(timer);
    }, 300);
  }

  // done. zero MutationObserver, zero large DOM scans.
})();
