const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

export function createDeliveryDraft({ emailId, sourceSha, profile, inventory, deliveryMetadata = {} }) {
  const reusableAnswers = deliveryMetadata.source_sha === sourceSha && deliveryMetadata.inventory_digest === inventory.inventory_digest ? deliveryMetadata.answers : undefined;
  return {
    schema_version:'1.0.0', email_id:emailId, profile_id:profile.id, profile_version:profile.version,
    source_sha:sourceSha, inventory_digest:inventory.inventory_digest,
    subject:deliveryMetadata.subject ?? '', preheader:deliveryMetadata.preheader ?? '',
    sender:structuredClone(deliveryMetadata.sender ?? {mode:'inherit'}),
    reply_to:structuredClone(deliveryMetadata.reply_to ?? {mode:'inherit'}),
    plain_text:structuredClone(deliveryMetadata.plain_text ?? {mode:'auto'}),
    answers:Object.fromEntries(inventory.fields.map(field => [field.id, field.managed ? field.value ?? '' : reusableAnswers?.[field.id] ?? field.value ?? '']))
  };
}

export function missingDeliveryFields({ inventory, deliveryDraft }) {
  return inventory.fields.filter(field => !field.managed && !(deliveryDraft.answers?.[field.id] ?? field.value ?? '').trim());
}

function presentationGroups(fields) {
  const groups = new Map();
  for (const [index, field] of fields.entries()) {
    const id = field.display_group?.id ?? field.bindings?.[0]?.instance_path ?? field.id;
    const group = groups.get(id) ?? { label: field.display_group?.label ?? field.block_label ?? 'Ссылки', fields: [] };
    group.fields.push({ field, index }); groups.set(id, group);
  }
  return [...groups.values()];
}

export function renderDeliveryForm({ inventory, deliveryDraft }) {
  const pending = missingDeliveryFields({ inventory, deliveryDraft });
  const groups = presentationGroups(pending);
  const links = groups.map((group, groupIndex) => {
    const headingId = 'group-' + groupIndex;
    const rows = group.fields.map(({ field, index }) => {
      const context = field.display_context && field.display_context !== group.label ? field.display_context : '';
      const contextId = 'context-' + index;
      const labelId = 'caption-' + index;
      const nameIds = [labelId, context ? contextId : field.display_context === group.label ? headingId : null].filter(Boolean).join(' ');
      return `<div class="link-row">${context ? `<p class="row-context" id="${contextId}">${escapeHtml(context)}</p>` : ''}<label id="${labelId}" for="link-${index}">${escapeHtml(field.label)}${field.viewport_hint ? ` <span class="viewport-hint">${escapeHtml(field.viewport_hint)}</span>` : ''}</label><div class="link-input"><span class="mobile-column" aria-hidden="true">Ссылка</span><input id="link-${index}" type="text" value="" aria-labelledby="${nameIds}" aria-describedby="hint-${index}"><small id="hint-${index}">${field.required ? '(обязательно)' : '(необязательно)'}</small></div></div>`;
    }).join('');
    return `<section><h2 id="${headingId}">${escapeHtml(group.label)}</h2><div class="column-headings" aria-hidden="true"><span>Текст кнопки</span><span>Ссылка</span></div>${rows}</section>`;
  }).join('');
  const pendingIds = new Set(pending.map(field => field.id));
  const known = inventory.fields.filter(field => !pendingIds.has(field.id));
  const review = known.length ? `<details><summary>Просмотреть заданные ссылки</summary>${presentationGroups(known).map(group => `<div class="review-group"><h3>${escapeHtml(group.label)}</h3>${group.fields.map(({ field }) => {
    const context = field.display_context && field.display_context !== group.label ? field.display_context : '';
    const value = deliveryDraft.answers?.[field.id] ?? field.value ?? '';
    return `<div class="review-row"><div>${context ? `<p class="row-context">${escapeHtml(context)}</p>` : ''}<p class="action-caption">${escapeHtml(field.label)}${field.viewport_hint ? ` <span class="viewport-hint">${escapeHtml(field.viewport_hint)}</span>` : ''}</p>${field.managed ? '<small>Системная ссылка профиля</small>' : ''}</div><p class="review-value">${escapeHtml(value)}</p></div>`;
  }).join('')}</div>`).join('')}</details>` : '';
  const state = JSON.stringify({ document:deliveryDraft, fields:pending.map(field => ({id:field.id,required:field.required})) }).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
  const form = pending.length ? `<p>Заполните только недостающие адреса. Прикрепите скачанный delivery.json в чат, чтобы продолжить сборку письма.</p><form id="delivery-form">${links}<button type="submit">Скачать заполненные ссылки</button><p id="status" aria-live="polite"></p></form><script type="application/json" id="delivery-state">${state}</script><script>
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
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ссылки в письме</title><style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#222;background:#fff}main{max-width:880px;margin:32px auto;padding:0 20px}h1{font-size:28px;line-height:1.2;margin:0 0 16px}h2{font-size:20px;margin:24px 0 8px}h3{font-size:18px;margin:16px 0 8px}p{margin:0 0 16px}.column-headings,.link-row,.review-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:16px}.column-headings{color:#666;padding:8px 0;border-bottom:1px solid #ddd}.link-row,.review-row{row-gap:8px;padding:12px 0;border-bottom:1px solid #ddd}label{align-self:center;white-space:pre-wrap;overflow-wrap:anywhere}.row-context{grid-column:1/-1;margin:0;font-weight:600;overflow-wrap:anywhere}.viewport-hint{display:inline-block;font-size:16px;color:#555}.link-input{min-width:0}input[type=text]{width:100%;min-height:44px;padding:9px 12px;font:inherit;border:1px solid #999;border-radius:4px}small{display:block;font-size:16px;color:#666;margin-top:4px}button{min-height:44px;padding:10px 20px;margin-top:20px;font:inherit;border:1px solid #555;border-radius:4px;background:#f4f4f4;color:inherit;cursor:pointer}input:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid #1769aa;outline-offset:2px}.mobile-column{display:none}details{margin-top:24px;padding-top:12px;border-top:1px solid #ddd}summary{min-height:44px;padding:10px 0;cursor:pointer;overflow-wrap:anywhere}.review-value,.action-caption{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}#status{margin-top:12px;overflow-wrap:anywhere}@media(max-width:600px){main{margin:24px auto;padding:0 16px}.column-headings{display:none}.link-row,.review-row{grid-template-columns:minmax(0,1fr)}.mobile-column{display:block;margin-bottom:4px}.row-context{grid-column:1}button{max-width:100%;white-space:normal}}
</style></head><body><main><h1>Ссылки в письме</h1>${form}${review}</main></body></html>`;
}
