import { initCommon, initForm, mountStage, $, $$, RM } from './common.js';
initCommon({ introMs: 3300 });
const form = $('#qform'), sel = new Set();
initForm(form, d => `Hi Eddie, I found your sample website and I'd like a quote.\nName: ${d.name}\nTown: ${d.area || '-'}\nJobs: ${d.service || '-'}\nDetails: ${d.details}`);
// tabs
const tabs = $$('[role=tab]');
tabs.forEach((t, i) => {
  t.addEventListener('click', () => pick(i));
  t.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { pick((i + 1) % 3); tabs[(i + 1) % 3].focus(); } if (e.key === 'ArrowLeft') { pick((i + 2) % 3); tabs[(i + 2) % 3].focus(); } });
});
function pick(n) { tabs.forEach((t, i) => { t.setAttribute('aria-selected', i === n); t.tabIndex = i === n ? 0 : -1; const p = $('#' + t.getAttribute('aria-controls')); p.hidden = i !== n; p.classList.toggle('on', i === n); }); }
$$('.it').forEach(b => b.addEventListener('click', () => {
  const v = b.dataset.pick; sel.has(v) ? sel.delete(v) : sel.add(v); b.classList.toggle('on', sel.has(v));
  form.elements.service.value = [...sel].join(', '); $('#sel').textContent = sel.size ? [...sel].join(', ') : 'none yet';
}));
import('./scene.js').then(m => { const s = mountStage($('#fan'), m.default, { cam: [0, .4, 11.5], fov: 34, slider: '#spd' });
  const lamp = $('#lamp'); const toggle = () => { const on = s?.api.toggleLight(); lamp.setAttribute('aria-pressed', on); lamp.textContent = on ? 'Light on' : 'Light off'; };
  lamp.addEventListener('click', toggle); $('#fan').addEventListener('keydown', e => { if (e.key.toLowerCase() === 'l') toggle(); });
}).catch(() => $('#fan').classList.add('nogl'));
