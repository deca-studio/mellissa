const EVENT_CONFIG = {
  title: 'Melissa • 3 anos',
  description: 'Aniversário de 3 anos da Melissa',
  address: '', // Ex.: "Rua ..., 123 - Bairro, Cidade - UF"
  start: '',   // UTC: YYYYMMDDTHHMMSSZ, ex.: 20260912T180000Z
  end: ''      // UTC: YYYYMMDDTHHMMSSZ
};

const FORM_DESTINATION = 'gener4ligris@gmail.com';

function showModal(title, message, options = []) {
  const modal = document.getElementById('choiceModal');
  if (!modal) return;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  const holder = document.getElementById('modalOptions');
  holder.replaceChildren();
  options.forEach(({ label, href, download }) => {
    const a = document.createElement('a');
    a.className = 'modal-option';
    a.textContent = label;
    a.href = href;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    if (download) a.download = download;
    holder.appendChild(a);
  });
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('choiceModal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

function openLocation() {
  if (!EVENT_CONFIG.address) {
    showModal('Localização', 'O endereço ainda não foi inserido nesta versão do protótipo. Assim que for definido, este botão abrirá Google Maps ou Waze.');
    return;
  }
  const q = encodeURIComponent(EVENT_CONFIG.address);
  showModal('Como deseja chegar?', EVENT_CONFIG.address, [
    { label: 'Google Maps →', href: `https://www.google.com/maps/search/?api=1&query=${q}` },
    { label: 'Waze →', href: `https://waze.com/ul?q=${q}&navigate=yes` }
  ]);
}

function makeICS() {
  if (!EVENT_CONFIG.start || !EVENT_CONFIG.end) return null;
  const lines = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Melissa 3 anos//PT-BR','CALSCALE:GREGORIAN','BEGIN:VEVENT',
    `DTSTART:${EVENT_CONFIG.start}`,`DTEND:${EVENT_CONFIG.end}`,
    `SUMMARY:${EVENT_CONFIG.title}`,`DESCRIPTION:${EVENT_CONFIG.description}`,
    `LOCATION:${EVENT_CONFIG.address || ''}`,'END:VEVENT','END:VCALENDAR'
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
}

function openCalendar() {
  if (!EVENT_CONFIG.start || !EVENT_CONFIG.end) {
    showModal('Horário', 'A data e o horário ainda não foram inseridos nesta versão do protótipo. Quando definidos, será possível adicionar a festa diretamente à agenda.');
    return;
  }
  const u = new URL('https://calendar.google.com/calendar/render');
  u.searchParams.set('action','TEMPLATE');
  u.searchParams.set('text',EVENT_CONFIG.title);
  u.searchParams.set('dates',`${EVENT_CONFIG.start}/${EVENT_CONFIG.end}`);
  u.searchParams.set('details',EVENT_CONFIG.description);
  u.searchParams.set('location',EVENT_CONFIG.address || '');
  const ics = makeICS();
  showModal('Adicionar à agenda', 'Escolha como deseja salvar a festa.', [
    { label:'Google Agenda →', href:u.toString() },
    { label:'Apple / Outlook (.ics) ↓', href:ics, download:'melissa-3-anos.ics' }
  ]);
}

document.querySelector('[data-action="location"]')?.addEventListener('click', openLocation);
document.querySelector('[data-action="calendar"]')?.addEventListener('click', openCalendar);
document.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
document.getElementById('choiceModal')?.addEventListener('click', e => { if (e.target.id === 'choiceModal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function maskPhone(value) {
  const d = value.replace(/\D/g,'').slice(0,11);
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 3) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2,3)} ${d.slice(3)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,3)} ${d.slice(3,7)}-${d.slice(7)}`;
}

const phone = document.getElementById('telefone');
phone?.addEventListener('input', () => { phone.value = maskPhone(phone.value); });

const companionRadios = document.querySelectorAll('input[name="tem_acompanhante"]');
const companionFields = document.getElementById('companionFields');
const companionName = document.getElementById('acompanhante');
const companionType = document.getElementById('tipoAcompanhante');
function syncCompanion() {
  const yes = document.querySelector('input[name="tem_acompanhante"]:checked')?.value === 'Sim';
  if (companionFields) companionFields.hidden = !yes;
  if (companionName) companionName.required = yes;
  if (companionType) companionType.required = yes;
  if (!yes) { if (companionName) companionName.value=''; if (companionType) companionType.value=''; }
}
companionRadios.forEach(r => r.addEventListener('change', syncCompanion));
syncCompanion();

function setError(id, message='') {
  const el = document.getElementById(id);
  const target = document.querySelector(`[data-error-for="${id}"]`);
  if (target) target.textContent = message;
  el?.closest('.field')?.classList.toggle('invalid', Boolean(message));
}

function validateForm(form) {
  ['nome','email','telefone','acompanhante','tipoAcompanhante','consent'].forEach(id => setError(id,''));
  let ok = true;
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const digits = form.telefone.value.replace(/\D/g,'');
  if (nome.length < 2) { setError('nome','Informe seu nome.'); ok=false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email','Informe um e-mail válido.'); ok=false; }
  if (digits.length !== 11) { setError('telefone','Informe DDD + celular com 11 dígitos.'); ok=false; }
  const hasCompanion = form.tem_acompanhante.value === 'Sim';
  if (hasCompanion && form.nome_acompanhante.value.trim().length < 2) { setError('acompanhante','Informe o nome do acompanhante.'); ok=false; }
  if (hasCompanion && !form.tipo_acompanhante.value) { setError('tipoAcompanhante','Selecione adulto ou criança.'); ok=false; }
  if (!document.getElementById('consent').checked) { setError('consent','É necessário autorizar o uso dos dados para enviar.'); ok=false; }
  return ok;
}

const form = document.getElementById('rsvpForm');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  if (!validateForm(form)) { status.textContent='Confira os campos destacados.'; status.className='form-status error'; return; }
  if (form._honey?.value) return;
  button.disabled = true;
  status.textContent = 'Enviando confirmação…'; status.className='form-status';
  const data = new FormData(form);
  data.append('_subject','Nova confirmação • Melissa 3 anos');
  data.append('_template','table');
  data.append('_captcha','false');
  data.append('_replyto',data.get('email'));
  data.append('evento','Melissa • 3 anos');
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${FORM_DESTINATION}`, {
      method:'POST', headers:{'Accept':'application/json'}, body:data
    });
    if (!response.ok) throw new Error('Falha no envio');
    form.reset(); syncCompanion();
    status.textContent='Presença confirmada. Obrigado!'; status.className='form-status success';
  } catch (error) {
    status.textContent='Não foi possível enviar agora. Tente novamente em instantes.'; status.className='form-status error';
  } finally { button.disabled=false; }
});
