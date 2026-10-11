const sourceSha = "8f4648681bd7ac72c5217190f1d523c0cb5f85f4";
const binding = (viewport, element_id, slot_id, kind = "slot-link") => ({ viewport, element_id, slot_id, kind });
const both = (element_id, slot_id, kind) => [binding("mobile", element_id, slot_id, kind), binding("desktop", element_id, slot_id, kind)];
export const profile = {
  id: "altcraft-mobile-base-v1", version: "1.0.0", label: "Altcraft mobile base",
  roles: [
    { id: "header-logo", label: "Логотип", component_id: "email-header", bindings: [binding("mobile", "root-header-logo-compact", "href", "output-link"), binding("desktop", "root-header-logo", "href", "output-link")], href: "https://1cupis.ru/?utm_source=crm&utm_medium=email&utm_campaign=logo" },
    { id: "store-rustore", label: "RuStore", component_id: "banner-app-download", bindings: both("root-content-area-store-buttons-rustore-button", "href"), href: "https://redirect.appmetrica.yandex.com/serve/461821467231807192" },
    { id: "store-google-play", label: "Google Play", component_id: "banner-app-download", bindings: both("root-content-area-store-buttons-google-play-button", "href"), href: "https://redirect.appmetrica.yandex.com/serve/533879077140969685" },
    { id: "store-appgallery", label: "AppGallery", component_id: "banner-app-download", bindings: both("root-content-area-store-buttons-appgallery-button", "href"), href: "https://redirect.appmetrica.yandex.com/serve/1038282229081536966" },
    { id: "store-getapps", label: "GetApps", component_id: "banner-app-download", bindings: both("root-content-area-store-buttons-getapps-button", "href"), href: "https://redirect.appmetrica.yandex.com/serve/29475923791277577" },
    { id: "footer-unsubscribe", label: "Отписка", component_id: "email-footer", bindings: both("root-footer-body-disclaimer-section-disclaimer-text-03", "href"), href: "{unsubscribe}" },
    { id: "footer-site", label: "Сайт", component_id: "email-footer", bindings: both("root-footer-body-disclaimer-section-disclaimer-text-02", "link-2-url") },
    { id: "footer-support", label: "Поддержка", component_id: "email-footer", bindings: both("root-footer-body-disclaimer-section-disclaimer-text-02", "link-4-url") },
    ...["good", "neutral", "bad"].map((id) => ({ id: `nps-${id}`, label: `NPS ${id}`, component_id: "nps-options", bindings: both(`root-content-area-emoji-buttons-${id}`, "href") }))
  ],
  allowed_templates: ["{unsubscribe}"], emission: { fallback_viewport: "mobile", desktop_condition: { viewport_min_px: 660, device_min_px: 660 }, mso_desktop: true, preserve_structural_splits: true }, package: { id: "altcraft-full-v1", html_entry: "email/html.html", asset_root_entry: "images", is_amp: false, is_not_inline: true }, service_rules: { enabled: false }
};
export const profileDocument = { schema_version: "1.0.0", profiles: [profile] };
const always = { mode: "always" };
const root = (id, children = []) => ({ id, semantic_role: id, render_mode: "presentation-table", visibility: always, facts: [], children });
const link = (id, role = id, visibility = always) => ({ id, semantic_role: role, render_mode: "html-link", visibility, facts: [], content_slots: [{ id: "href", type: "url", required: true }, { id: "text", type: "plain-text", required: true }], children: [] });
const npsAction = (id, role) => ({ id, semantic_role: role, render_mode: "presentation-table", visibility: always, facts: [], content_slots: [{ id: "href", type: "url", required: true }], children: [] });
const nested = (id, component_id, visibility = always) => ({ id, semantic_role: id, render_mode: "nested-component", component_id, visibility, facts: [], children: [] });
const contract = (rootNode) => ({ mobile: { root: rootNode }, desktop: { root: structuredClone(rootNode) } });
export const actionComponents = { bySystemId: new Map([
  ["email", { id: "email", properties: [{ id: "show-second-card", type: "boolean", default: true }, { id: "show-nps", type: "boolean", default: false }], contracts: contract(root("email-root", [nested("first-card", "card"), nested("second-card", "card", { mode: "property", property_id: "show-second-card" }), nested("nps", "nps-options", { mode: "property", property_id: "show-nps" })])) }],
  ["card", { id: "card", properties: [{ id: "show-cta", type: "boolean", default: true }], contracts: contract(root("card-root", [link("card-link"), nested("cta", "button", { mode: "property", property_id: "show-cta" })])) }],
  ["button", { id: "button", properties: [], contracts: contract(link("button-root", "cta")) }],
  ["nps-options", { id: "nps-options", properties: [], contracts: contract(root("nps-root", [npsAction("root-content-area-emoji-buttons-good", "good"), npsAction("root-content-area-emoji-buttons-neutral", "neutral"), npsAction("root-content-area-emoji-buttons-bad", "bad")])) }]
]) };
const cta = () => ({ instance_id: "cta", component_id: "button", variants: { mobile: "mobile", desktop: "desktop" }, property_values: [], content_values: [{ element_id: "button-root", slot_id: "text", scope: "all", value: { type: "plain-text", value: "Подробнее" } }], asset_files: [], slots: [] });
const card = (instance_id, { ambiguousViewport = false } = {}) => ({ instance_id, component_id: "card", variants: { mobile: "mobile", desktop: "desktop" }, property_values: [{ property_id: "show-cta", scope: "all", value: true }], content_values: [{ element_id: "card-link", slot_id: "text", scope: "all", value: { type: "plain-text", value: "Подробнее" } }, ...(ambiguousViewport ? [{ element_id: "card-link", slot_id: "href", scope: "mobile", value: { type: "url", value: "" } }, { element_id: "card-link", slot_id: "href", scope: "desktop", value: { type: "url", value: "" } }] : [{ element_id: "card-link", slot_id: "href", scope: "all", value: { type: "url", value: "" } }])], asset_files: [], slots: [], nested_components: [{ element_id: "cta", instance: cta() }] });
export const actionModel = ({ includeNps = false, hiddenSecondCard = false, ambiguousViewport = false } = {}) => ({ schema_version: "1.1.0", id: "release-42", metadata: { language: "ru", direction: "ltr" }, root: { instance_id: "email", component_id: "email", variants: { mobile: "mobile", desktop: "desktop" }, property_values: [{ property_id: "show-second-card", scope: "all", value: !hiddenSecondCard }, { property_id: "show-nps", scope: "all", value: includeNps }], content_values: [], asset_files: [], slots: [], nested_components: [{ element_id: "first-card", instance: card("card", { ambiguousViewport }) }, { element_id: "second-card", instance: card("card-2") }, ...(includeNps ? [{ element_id: "nps", instance: { instance_id: "nps", component_id: "nps-options", variants: { mobile: "mobile", desktop: "desktop" }, property_values: [], content_values: ["good", "neutral", "bad"].map((id) => ({ element_id: `root-content-area-emoji-buttons-${id}`, slot_id: "href", scope: "all", value: { type: "url", value: "" } })), asset_files: [], slots: [] } }] : [])] } });
export const inventory = { fields: [{ id: "email/card/card-link/href", label: "Подробнее", block_label: "Карточка", instance_label: "Карточка", kind: "url", required: true, managed: false, value: "", bindings: [{ instance_path: "email/card", component_id: "card", viewport: "mobile", element_id: "card-link", slot_id: "href" }, { instance_path: "email/card", component_id: "card", viewport: "desktop", element_id: "card-link", slot_id: "href" }] }], inventory_digest: "digest-v1", diagnostics: [] };
export const draft = { schema_version: "1.0.0", email_id: "release-42", profile_id: profile.id, profile_version: profile.version, source_sha: sourceSha, inventory_digest: "digest-v1", subject: "Тема", preheader: "Прехедер", sender: { mode: "inherit" }, reply_to: { mode: "inherit" }, plain_text: { mode: "auto" }, answers: {} };




