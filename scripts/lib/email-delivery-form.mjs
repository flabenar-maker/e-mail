const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function createDeliveryDraft({ emailId, sourceSha, profile, inventory }) {
  return { schema_version:'1.0.0',email_id:emailId,profile_id:profile.id,profile_version:profile.version,source_sha:sourceSha,inventory_digest:inventory.inventory_digest,subject:'',preheader:'',sender:{mode:'inherit'},reply_to:{mode:'inherit'},plain_text:{mode:'auto'},answers:Object.fromEntries(inventory.fields.map(field => [field.id,field.value ?? ''])) };
}
export function renderDeliveryForm({ inventory, deliveryDraft }) {
  const input = (id,label,value,type='text') => `<label for="${id}">${escapeHtml(label)}</label><input id="${id}" type="${type}" value="${escapeHtml(value)}">`;
  const sender = (id,label) => `<fieldset><legend>${label}</legend><label><input type="checkbox" id="${id}-inherit" ${deliveryDraft[id]?.mode === 'inherit' ? 'checked' : ''}> Использовать настройки Альткрафта</label><div>${input(id+'-name','Имя',deliveryDraft[id]?.name)}${input(id+'-address','Адрес почты',deliveryDraft[id]?.address,'email')}</div></fieldset>`;
  const links = inventory.fields.map((field,index) => `<div class="link-field"><strong>${escapeHtml(field.block_label)} — ${escapeHtml(field.instance_label)}</strong><label for="link-${index}">${escapeHtml(field.label)}${field.required ? ' (обязательно)' : ' (необязательно)'}</label><input id="link-${index}" type="text" value="${escapeHtml(deliveryDraft.answers[field.id] ?? field.value)}" ${field.managed ? 'readonly' : ''}><small>${field.managed ? 'Адрес задан системой' : 'Вставьте адрес для этого действия'}</small></div>`).join('');
  const state = JSON.stringify({ document:deliveryDraft, fields:inventory.fields.map(field => ({id:field.id,required:field.required,managed:field.managed})) }).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Данные для выпуска письма</title><style>body{font-family:Arial,sans-serif;max-width:880px;margin:32px auto;padding:0 20px;color:#222}label,strong,small{display:block;margin:8px 0}input[type=text],input[type=email],textarea{box-sizing:border-box;width:100%;padding:10px}fieldset,.link-field{margin:18px 0;padding:16px;border:1px solid #ddd}input[readonly]{background:#f2f2f2}button{padding:12px 20px;cursor:pointer}small{color:#666}</style></head><body><h1>Данные для выпуска письма</h1><p>Заполните параметры и адреса. Сохраните файл ответов, чтобы продолжить сборку письма.</p><form id="delivery-form"><h2>Параметры письма</h2>${input('subject','Тема письма',deliveryDraft.subject)}${input('preheader','Прехедер — текст рядом с темой в списке писем',deliveryDraft.preheader)}${sender('sender','Отправитель')}${sender('reply_to','Куда отправлять ответы')}<fieldset><legend>Текстовая версия письма</legend><label><input type="checkbox" id="text-auto" ${deliveryDraft.plain_text?.mode === 'auto' ? 'checked' : ''}> Создать автоматически</label><label for="plain-text">Свой текст, если автоматическое создание отключено</label><textarea id="plain-text" rows="6">${escapeHtml(deliveryDraft.plain_text?.value)}</textarea></fieldset><h2>Ссылки в письме</h2>${links || '<p>Действий с адресами в письме нет.</p>'}<button type="submit">Сохранить ответы</button><p id="status" aria-live="polite"></p></form><script type="application/json" id="delivery-state">${state}</script><script>
const state = JSON.parse(document.getElementById('delivery-state').textContent);
const form = document.getElementById('delivery-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const doc = structuredClone(state.document);
  doc.subject = document.getElementById('subject').value;
  doc.preheader = document.getElementById('preheader').value;
  for (const key of ['sender','reply_to']) doc[key] = document.getElementById(key+'-inherit').checked ? {mode:'inherit'} : {mode:'explicit',name:document.getElementById(key+'-name').value,address:document.getElementById(key+'-address').value.trim()};
  doc.plain_text = document.getElementById('text-auto').checked ? {mode:'auto'} : {mode:'manual',value:document.getElementById('plain-text').value};
  doc.answers = Object.fromEntries(state.fields.map((field,index) => [field.id,document.getElementById('link-'+index).value.trim()]));
  const blob = new Blob([JSON.stringify(doc,null,2)+'\\n'],{type:'application/json;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href=url; anchor.download='delivery.json'; anchor.click();
  URL.revokeObjectURL(url); document.getElementById('status').textContent='Ответы сохранены. Проверка готовности выполняется при сборке письма.';
});
</script></body></html>`;
}
