import {isDeepStrictEqual as equal} from 'node:util';
import {auditContractFactProofs} from './contract-fact-proofs.mjs';
import {auditNativeRelationProofs} from './native-relationship-coverage.mjs';
import {verifyHtmlGradientPaintContext, verifyHtmlMixedTextPaintContext} from './native-html-paint-context.mjs';

// Evidence locations come from direct native paint aliases, never aggregate
// list order or color equality. They add no fields to the original paints/runs.
export const NATIVE_PAINT_COLOR_PATH = /^\/(?:fills\/\d+\/stops\/\d+|styled_text_segments\/\d+\/fills\/\d+)\/color$/u;
const NODE = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const closed = (value, keys) => object(value) && keys.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => keys.includes(key));
const text = value => typeof value === 'string' && !!value.trim() && !/[\r\n]/u.test(value);
const pointer = (root, path) => path.split('/').slice(1).reduce((value, key) => value?.[key], root);
const hex = value => typeof value === 'string' && /^#[A-Fa-f0-9]{6}$/u.test(value);

export function readNativePaintLocations(packet, variables) {
  if (!Object.hasOwn(packet.binding_evidence, 'paint_locations')) return null;
  const profile = packet.binding_evidence.paint_locations;
  if (!closed(profile, ['schema_version', 'items']) || profile.schema_version !== '1.0.0' || !Array.isArray(profile.items)) throw Error('closed versioned direct paint locations required');
  const nodes = new Map(), locations = new Set();
  const visit = node => {nodes.set(node.node_id, node); for (const child of node.children ?? []) visit(child);};
  for (const variant of packet.variants) visit(variant.source_node);
  for (const item of profile.items) {
    if (!closed(item, ['node_id', 'source_path', 'variable_id']) || !text(item.node_id) || !NODE.test(item.node_id) || !text(item.source_path) || !NATIVE_PAINT_COLOR_PATH.test(item.source_path) || !text(item.variable_id) || variables.get(item.variable_id)?.resolved_type !== 'COLOR') throw Error('closed own direct COLOR alias location required');
    const node = nodes.get(item.node_id), key = JSON.stringify([item.node_id, item.source_path]);
    if (!node || !hex(pointer(node, item.source_path)) || locations.has(key)) throw Error('unique existing same-packet native paint location required');
    locations.add(key);
  }
  return profile.items;
}

export function createNativePaintVariableVerifier({record, model, session}) {
  let relationReport, contractReport;
  const qualified = new Map();
  function qualify(proof, node, packet, kind) {
    const elementPath = proof.contract_path.replace(/\/facts\/\d+\/value$/u, ''), key = JSON.stringify([proof.source, elementPath, kind]);
    if (qualified.has(key)) return qualified.get(key);
    const relations = (record.evidence_links.native_relation_proofs ?? []).filter(item => item.kind === 'element-structure' && item.element_path === elementPath && equal(item.source, proof.source));
    relationReport ??= auditNativeRelationProofs({record, model, session});
    if (relations.length !== 1 || relationReport.results.filter(item => item.proof_id === relations[0].id && item.status === 'verified').length !== 1) throw Error('independent exact owned paint element structure required');
    const relation = relations[0], noop = () => {};
    if (kind === 'gradient') {
      contractReport ??= auditContractFactProofs({record, model, session});
      verifyHtmlGradientPaintContext({record, relation, node, contractProofs: contractReport, add: noop, addNotRequired: noop});
    } else verifyHtmlMixedTextPaintContext({record, relation, node, packet, add: noop});
    const result = {element: pointer(record, elementPath), elementPath};
    qualified.set(key, result);
    return result;
  }
  return ({proof, node, packet, locations, value}) => {
    if (!locations) throw Error('direct native paint locations unavailable');
    const anchor = locations.filter(item => item.node_id === node.node_id && item.source_path === proof.paint_source_path);
    if (anchor.length !== 1 || anchor[0].variable_id !== proof.variable.id) throw Error('exact direct alias anchor required, not aggregate index inference');
    const ownLocations = locations.filter(item => item.node_id === node.node_id && item.variable_id === proof.variable.id);
    for (const item of ownLocations) {
      const kind = item.source_path.startsWith('/fills/') ? 'gradient' : 'mixed';
      const {element, elementPath} = qualify(proof, node, packet, kind);
      let parentPath, colorPath;
      if (kind === 'gradient') {
        const index = /^\/fills\/0\/stops\/([01])\/color$/u.exec(item.source_path)?.[1];
        const matches = element.facts.map((fact, index) => ({fact, index})).filter(({fact}) => fact.id === (index === '0' ? 'background-gradient-start' : 'background-gradient-end'));
        if (index === undefined || matches.length !== 1) throw Error('qualified exact endpoint fact required');
        parentPath = `${elementPath}/facts/${matches[0].index}/value`; colorPath = `${parentPath}/value`;
      } else {
        const matches = element.facts.map((fact, index) => ({fact, index})).filter(({fact}) => fact.id === 'styled-text-segments');
        if (matches.length !== 1) throw Error('qualified own styled ranges fact required');
        parentPath = `${elementPath}/facts/${matches[0].index}/value`;
        colorPath = `${parentPath}/items${item.source_path.slice('/styled_text_segments'.length)}`;
      }
      const links = (record.contracts.figma_fact_links ?? []).filter(link => link.contract_path === colorPath);
      if (links.length !== 1 || links[0].variant_node_id !== proof.source.variant_node_id || links[0].node_id !== node.node_id || links[0].source_path !== item.source_path || links[0].transform !== 'identity' || pointer(node, item.source_path) !== value || pointer(record, colorPath) !== value) throw Error('every captured same-ID color location needs exact native/typed value and independent mapping');
      if (item.source_path === proof.paint_source_path && parentPath !== proof.contract_path) throw Error('paint anchor must select the existing own typed fact');
    }
  };
}
