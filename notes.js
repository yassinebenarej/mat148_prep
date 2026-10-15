/* One list of single-line notes, the way subtasks work on an Aced task:
 * enter starts the next line, backspace on an empty one removes it, and
 * the tick marks the ones you are done with.
 *
 * Astuces and weaknesses are the same widget pointed at different storage
 * and wearing different words, so the behaviour lives here once.
 *
 *   noteList({ key, mount, countEl, addBtn, copyBtn, placeholder, empty, noun })
 */
function noteList(opts) {
  var KEY = opts.key;
  var list = document.querySelector(opts.mount);
  var countEl = document.querySelector(opts.countEl);
  var noun = opts.noun || { one: 'note', many: 'notes' };

  var items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { items = []; }
  if (!Array.isArray(items)) items = [];

  /* An earlier version of the astuces page stored {title, body}. Fold
   * those into one line so nothing written before the shape changed is
   * lost. Harmless for a list that never had them. */
  items = items.map(function (it) {
    if (typeof it.text === 'string') return it;
    var t = (it.title || '').trim();
    var b = (it.body || '').trim();
    return { id: it.id, text: b ? t + ' — ' + b : t, done: !!it.done };
  });

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }
  function uid() {
    return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function written() {
    return items.filter(function (it) { return it.text.trim(); });
  }
  function setCount() {
    var n = written().length;
    countEl.textContent = n ? n + ' ' + (n === 1 ? noun.one : noun.many) : '';
  }
  function focusAt(i, toEnd) {
    var all = Array.prototype.slice.call(list.querySelectorAll('.astuce-text'));
    var el = all[Math.max(0, Math.min(i, all.length - 1))];
    if (!el) return;
    el.focus();
    if (toEnd) { var v = el.value || ''; el.setSelectionRange(v.length, v.length); }
  }
  function addAt(i) {
    items.splice(i, 0, { id: uid(), text: '', done: false });
    save();
    render();
    focusAt(i);
  }
  function remove(id) {
    items = items.filter(function (o) { return o.id !== id; });
    save();
  }

  function render() {
    setCount();
    list.innerHTML = '';

    if (items.length === 0) {
      var e = document.createElement('div');
      e.className = 'empty';
      e.textContent = opts.empty;
      list.appendChild(e);
      return;
    }

    items.forEach(function (it, idx) {
      var row = document.createElement('div');
      row.className = 'astuce-item' + (it.done ? ' done' : '');

      var check = document.createElement('div');
      check.className = 'astuce-check' + (it.done ? ' checked' : '');
      check.setAttribute('role', 'checkbox');
      check.setAttribute('aria-checked', String(!!it.done));
      check.setAttribute('aria-label', opts.tickLabel || 'Done');
      check.tabIndex = 0;
      check.innerHTML = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5 L6.5 12 L13 4.5" /></svg>';
      var toggle = function () {
        it.done = !it.done;
        save();
        check.classList.toggle('checked', it.done);
        check.setAttribute('aria-checked', String(it.done));
        row.classList.toggle('done', it.done);
      };
      check.addEventListener('click', toggle);
      check.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggle(); }
      });

      var input = document.createElement('input');
      input.className = 'astuce-text';
      input.type = 'text';
      input.value = it.text;
      input.placeholder = opts.placeholder;
      input.addEventListener('input', function () {
        it.text = input.value;
        save();
        setCount();
      });
      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          addAt(idx + 1);
        } else if (ev.key === 'Backspace' && input.value === '') {
          /* Deleting the line you are on puts the caret at the end of the
           * one above, so a run of empties clears by holding backspace. */
          ev.preventDefault();
          remove(it.id);
          render();
          focusAt(idx - 1, true);
        }
      });

      var del = document.createElement('button');
      del.className = 'astuce-delete';
      del.type = 'button';
      del.textContent = '×';
      del.setAttribute('aria-label', 'Delete this line');
      del.addEventListener('click', function () { remove(it.id); render(); });

      row.appendChild(check);
      row.appendChild(input);
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  document.querySelector(opts.addBtn).addEventListener('click', function () {
    addAt(items.length);
  });

  document.querySelector(opts.copyBtn).addEventListener('click', function (ev) {
    var btn = ev.currentTarget;
    var rows = written();
    if (rows.length === 0) return;
    var text = rows.map(function (it) {
      return (it.done ? '[x] ' : '[ ] ') + it.text.trim();
    }).join('\n');
    var flash = function () {
      var was = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = was; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, function () {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); flash(); } catch (err) {}
      document.body.removeChild(ta);
    }
  });

  render();
}
