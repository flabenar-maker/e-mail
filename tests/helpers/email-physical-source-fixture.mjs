// Independent literal regression graph, not a saved/private Figma capture.
// IDs below are fixtures; registered owner/main IDs are pinned registry facts.
export function physicalEmailSourceFixture() {
  const nps = { instance_id: 'nps-1', component_id: 'nps-options',
    variants: { mobile: 'mobile', desktop: 'desktop' },
    variant_axes: { mobile: { Count: '2' }, desktop: { Count: '2' } },
    property_values: [], content_values: [], asset_files: [], slots: [] };
  const model = { schema_version: '1.1.0', id: 'physical-source',
    metadata: { language: 'ru', direction: 'ltr' },
    root: { instance_id: 'letter', component_id: 'email-template',
      variants: { mobile: 'mobile', desktop: 'desktop' },
      property_values: [], content_values: [], asset_files: [],
      visibility_values: [{ element_id: 'content', scope: 'all', value: false }],
      slots: [{ element_id: 'content', instances: [nps] }] } };
  const readings = { capture_id: 'physical-capture', file_key: '8zka5bHkcrJVK9I9dKjnhC',
    captured_at: '2026-10-13T00:00:00Z', complete: true,
    selection: {
      mobile: { root_node_id: '2021:4164', terminal: true, truncated: false, scope: 'full-email', expected_top_level_count: 0 },
      desktop: { root_node_id: '2021:4163', terminal: true, truncated: false, scope: 'full-email', expected_top_level_count: 0 },
    }, instances: [
      { viewport: 'mobile', node_id: '2021:4164', parent_node_id: null, order: 0, relation: null, variant_id: 'mobile' },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1', parent_node_id: '2021:4164', order: 0, relation: { kind: 'slot', element_id: 'content' }, variant_id: 'mobile-2' },
      { viewport: 'desktop', node_id: '2021:4163', parent_node_id: null, order: 0, relation: null, variant_id: 'desktop' },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2', parent_node_id: '2021:4163', order: 0, relation: { kind: 'slot', element_id: 'content' }, variant_id: 'desktop-2' },
    ], fields: [
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1348', owner_node_id: 'I2021:4164;1103:7;1104:1', field: 'characters', value: 'Понравилось это письмо?' },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3978', owner_node_id: 'I2021:4163;1103:8;1104:2', field: 'characters', value: 'Понравилось это письмо?' },
    ], assets: [
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1351', owner_node_id: 'I2021:4164;1103:7;1104:1', evidence_id: 'hidden-mobile-happy-face' },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1355', owner_node_id: 'I2021:4164;1103:7;1104:1', evidence_id: 'hidden-mobile-sad-face' },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3981', owner_node_id: 'I2021:4163;1103:8;1104:2', evidence_id: 'hidden-desktop-happy-face' },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3985', owner_node_id: 'I2021:4163;1103:8;1104:2', evidence_id: 'hidden-desktop-sad-face' },
    ], nodes: [
      { viewport: 'mobile', node_id: '2021:4164', parent_node_id: null, visible: true, owner_component_id: '1102:8', main_component_id: '1102:6' },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7', parent_node_id: '2021:4164', visible: false },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1', parent_node_id: 'I2021:4164;1103:7', visible: true, owner_component_id: '1084:16995', main_component_id: '260:1346' },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1347', parent_node_id: 'I2021:4164;1103:7;1104:1', visible: true },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1348', parent_node_id: 'I2021:4164;1103:7;1104:1;260:1347', visible: true },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1349', parent_node_id: 'I2021:4164;1103:7;1104:1;260:1347', visible: true },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1350', parent_node_id: 'I2021:4164;1103:7;1104:1;260:1349', visible: true },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1351', parent_node_id: 'I2021:4164;1103:7;1104:1;260:1350', visible: true },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1354', parent_node_id: 'I2021:4164;1103:7;1104:1;260:1349', visible: true },
      { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;260:1355', parent_node_id: 'I2021:4164;1103:7;1104:1;260:1354', visible: true },
      { viewport: 'desktop', node_id: '2021:4163', parent_node_id: null, visible: true, owner_component_id: '1102:8', main_component_id: '1102:7' },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8', parent_node_id: '2021:4163', visible: false },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2', parent_node_id: 'I2021:4163;1103:8', visible: true, owner_component_id: '1084:16995', main_component_id: '260:3976' },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3977', parent_node_id: 'I2021:4163;1103:8;1104:2', visible: true },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3978', parent_node_id: 'I2021:4163;1103:8;1104:2;260:3977', visible: true },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3979', parent_node_id: 'I2021:4163;1103:8;1104:2;260:3977', visible: true },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3980', parent_node_id: 'I2021:4163;1103:8;1104:2;260:3979', visible: true },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3981', parent_node_id: 'I2021:4163;1103:8;1104:2;260:3980', visible: true },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3984', parent_node_id: 'I2021:4163;1103:8;1104:2;260:3979', visible: true },
      { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;260:3985', parent_node_id: 'I2021:4163;1103:8;1104:2;260:3984', visible: true },
    ] };
  const correspondence = { capture_id: 'physical-capture', file_key: '8zka5bHkcrJVK9I9dKjnhC',
    instances: [
      { instance_id: 'letter', nodes: { mobile: '2021:4164', desktop: '2021:4163' } },
      { instance_id: 'nps-1', nodes: { mobile: 'I2021:4164;1103:7;1104:1', desktop: 'I2021:4163;1103:8;1104:2' } },
    ], fields: [], assets: [], visibility: [
      { instance_id: 'letter', element_id: 'content', viewport: 'mobile', node_id: 'I2021:4164;1103:7' },
      { instance_id: 'letter', element_id: 'content', viewport: 'desktop', node_id: 'I2021:4163;1103:8' },
    ] };
  return { model, readings, correspondence, authorizedInputs: [], assetEvidence: [] };
}
