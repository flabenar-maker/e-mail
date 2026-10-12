const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

export function createDeliveryDraft({ emailId, sourceSha, profile, inventory, deliveryMetadata = {} }) {
  return {
    schema_version:'1.0.0', email_id:emailId, profile_id:profile.id, profile_version:profile.version,
    source_sha:sourceSha, inventory_digest:inventory.inventory_digest,
    subject:deliveryMetadata.subject ?? '', preheader:deliveryMetadata.preheader ?? '',
    sender:structuredClone(deliveryMetadata.sender ?? {mode:'inherit'}),
    reply_to:structuredClone(deliveryMetadata.reply_to ?? {mode:'inherit'}),
    plain_text:structuredClone(deliveryMetadata.plain_text ?? {mode:'auto'}),
    answers:Object.fromEntries(inventory.fields.map(field => [field.id, field.managed ? field.value ?? '' : deliveryMetadata.answers?.[field.id] ?? field.value ?? '']))
  };
}

export function missingDeliveryFields({ inventory, deliveryDraft }) {
  return inventory.fields.filter(field => !field.managed && !(deliveryDraft.answers?.[field.id] ?? field.value ?? '').trim());
}

export function renderDeliveryForm({ inventory, deliveryDraft }) {
  const pending = missingDeliveryFields({ inventory, deliveryDraft });
  const links = pending.map((field,index) => `<div class="link-field"><strong>${escapeHtml(field.block_label)} — ${escapeHtml(field.instance_label)}</strong><label for="link-${index}">${escapeHtml(field.label)}${field.required ? ' (обязательно)' : ' (необязательно)'}</label><input id="link-${index}" type="text" value=""><small>Вставьте адрес для этого действия</small></div>`).join('');
  const state = JSON.stringify({ document:deliveryDraft, fields:pending.map(field => ({id:field.id,required:field.required})) }).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
  const form = pending.length ? `<p>Заполните только недостающие адреса. Сохраните файл ответов, чтобы продолжить сборку письма.</p><form id="delivery-form">${links}<button type="submit">Сохранить ответы</button><p id="status" aria-live="polite"></p></form><script type="application/json" id="delivery-state">${state}</script><script>
const state = JSON.parse(document.getElementById('delivery-state').textContent);
const form = document.getElementById('delivery-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const doc = structuredClone(state.document);
  doc.answers ??= {};
  for (const [index,field] of state.fields.entries()) doc.answers[field.id] = document.getElementById('link-'+index).value.trim();
  const blob = new Blob([JSON.stringify(doc,null,2)+'\\n'],{type:'application/json;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href=url; anchor.download='delivery.json'; anchor.click();
  URL.revokeObjectURL(url); document.getElementById('status').textContent='Ответы сохранены. Проверка готовности выполняется при сборке письма.';
});
</script>` : '<p>Все ссылки уже заданы. Сборка продолжается без дополнительных ответов.</p>';
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ссылки в письме</title><style>body{font-family:Arial,sans-serif;max-width:880px;margin:32px auto;padding:0 20px;color:#222}label,strong,small{display:block;margin:8px 0}input[type=text]{box-sizing:border-box;width:100%;padding:10px}.link-field{margin:18px 0;padding:16px;border:1px solid #ddd}button{padding:12px 20px;cursor:pointer}small{color:#666}</style></head><body><h1>Ссылки в письме</h1>${form}</body></html>`;
}
