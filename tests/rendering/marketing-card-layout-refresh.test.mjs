import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { renderComponent } from "../../scripts/lib/email-renderer.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const fixture = JSON.parse(await readFile(new URL("../foundation/fixtures/marketing-card-layout-figma-capture.json", import.meta.url), "utf8"));
const registry = JSON.parse(await readFile(new URL("../../data/components/marketing.yaml", import.meta.url), "utf8"));
const records = new Map(registry.components.map(record => [record.id, record]));
const foundations = { rendering: { breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 660, unit: "px" }] } };
const deps = { componentIndex: { bySystemId: records }, rendererRegistry: { coverage: registry.components.map(c => ({ component_id: c.id, mode: "interpreter" })) }, foundations };
const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const flat = node => [node, ...(node.children ?? []).flatMap(flat)];
const fact = (node,id) => node.facts?.find(f => f.id === id)?.value;
const value = (node,id) => fact(node,id)?.value;
const sourceId = node => node.facts?.find(f => f.id === "reference-size")?.provenance?.node_id;
const ptr = (o,p) => p.slice(1).split("/").reduce((v,k) => v?.[k.replaceAll("~1","/").replaceAll("~0","~")],o);
const nativeOwner = id => fixture.owners.find(owner => owner.id === id);
const nativeRoot = (id,viewport) => nativeOwner(id).packet.variants.find(v => v.axes.some(a => a.name === "Viewport" && a.value.toLowerCase() === viewport)).source_node;
const ownRoot = (id,viewport) => records.get(id).contracts[viewport].root;
const nativeNumber = n => typeof n === "number" && Math.abs(n-Math.round(n)) < 0.0001 ? Math.round(n) : n;
const sourceNode = (id,viewport,nodeId) => flat(nativeRoot(id,viewport)).find(n => n.node_id === nodeId);
const ownerNode = (id,viewport,nodeId) => flat(ownRoot(id,viewport)).find(n => sourceId(n) === nodeId);

// Only inputs are assembled from records. All behavioral expectations below are
// literal source observations or independently frozen native facts, not renderer output.
function instance(id, options = {}, instanceId = id) {
  const record = records.get(id);
  const result = { instance_id: instanceId, component_id: id, variants: { mobile: "mobile", desktop: "desktop" },
    property_values: (record.properties ?? []).map(p => ({ property_id: p.id, scope: "all", value: options[p.id] ?? p.default })),
    content_values: [], asset_files: (record.asset_contracts ?? []).map(a => ({ asset_contract_id: a.id, path: "images/" + a.id + ".png" })), slots: [], nested_components: [] };
  const nested = new Map();
  for (const viewport of ["mobile","desktop"]) {
    for (const node of flat(record.contracts[viewport].root)) {
      for (const slot of node.content_slots ?? []) {
        if (slot.type === "slot") continue;
        const marker = node.semantic_role === "caption" ? "CAPTION" : id === "button-secondary" ? "BUTTON" : node.semantic_role.toUpperCase();
        const content = slot.type === "url" || /href|url/u.test(slot.id) ? "https://example.test/" + (id === "button-secondary" ? "button" : "card")
          : slot.type === "alt-text" ? "ICON" : node.render_mode === "html-link" && options.long ? "https://long.example/" + "long-link-segment".repeat(20) : marker + " " + (options.long ? "Длинный текст для проверки переноса ".repeat(20) : "Текст");
        result.content_values.push({ element_id: node.id, slot_id: slot.id, scope: viewport, value: { type: slot.type, value: content } });
      }
      if (node.render_mode === "nested-component") {
        if (!nested.has(node.id)) nested.set(node.id, { element_id: node.id, instance: instance(node.component_id, options, node.id) });
      }
    }
  }
  result.nested_components = [...nested.values()];
  return result;
}
function render(id,options={}) {
  const output = renderComponent({ componentId:id, viewportData:instance(id,options), ...deps });
  assert.deepEqual(output.diagnostics, [], id + " renders complete explicit inputs");
  return output;
}
function viewportHtml(html, viewport) {
  const start = html.indexOf('<div class="cupis-root-' + viewport + '"');
  assert.ok(start >= 0, "separate viewport root is rendered");
  return html.slice(html.indexOf(">",start)+1,html.indexOf("</div>",start));
}
// A small structural reader is sufficient for generated table markup and avoids
// matching a distant ancestor's valign or counting gaps in nested components.
function parse(html) {
  const root={tag:"root",attrs:{},children:[],parent:null}, stack=[root];
  for(const token of html.match(/<[^>]+>|[^<]+/gu)??[]) {
    if(token.startsWith("</")){const tag=token.match(/^<\/([^ >]+)/u)?.[1];while(stack.length>1){if(stack.pop().tag===tag)break;}continue;}
    if(token.startsWith("<!"))continue;
    if(token.startsWith("<")){const tag=token.match(/^<([^ >]+)/u)?.[1];const attrs=Object.fromEntries([...token.matchAll(/([\w-]+)="([^"]*)"/gu)].map(m=>[m[1],m[2]]));const n={tag,attrs,children:[],parent:stack.at(-1),opening:token};stack.at(-1).children.push(n);if(!["img","br","meta","input","hr"].includes(tag))stack.push(n);}
    else stack.at(-1).children.push({tag:"#text",text:token,parent:stack.at(-1),children:[]});
  }
  return root;
}
const domNodes = node => [node,...node.children.flatMap(domNodes)];
const textOf = node => node.tag==="#text" ? node.text : node.children.map(textOf).join("");
function ancestor(node,tag){for(let p=node.parent;p;p=p.parent)if(p.tag===tag)return p;return null;}
function contentArea(tree){const padded=domNodes(tree).find(n=>n.tag==="td" && /padding-top:(?:22|32)px/u.test(n.attrs.style??""));return padded?.children.find(n=>n.tag==="table");}
function gapCells(table, gap){return domNodes(table).filter(n=>n.tag==="td"&&n.attrs.height===String(gap)&&ancestor(n,"table")===table);}

for (const id of ["block-cards-images","block-icon-cards","block-icon-list"]) {
  test(id + " exposes both Boolean controls with fresh defaults and button placement", () => {
    const c=records.get(id);
    for(const [property,name] of [["show-button","Show Button"],["show-caption","Show Caption"]]) assert.deepEqual(c.properties.find(p=>p.id===property),{id:property,figma_name:name,type:"boolean",default:true});
    for(const viewport of ["mobile","desktop"]){
      const area=ownRoot(id,viewport).children[0], button=area.children.find(n=>n.component_id==="button-secondary");
      assert.ok(button,"one actual nested secondary button");
      assert.equal(area.children.filter(n=>n.component_id==="button-secondary").length,1);
      assert.equal(area.children.at(-2),button);assert.equal(area.children.at(-1).semantic_role,"caption");
      assert.deepEqual(button.visibility,{mode:"property",property_id:"show-button"});
      assert.equal(value(button,"instance-viewport"),viewport);
      assert.equal(value(button,"horizontal-sizing"),viewport==="mobile"?"fill":"hug");
      assert.equal(value(button,"vertical-sizing"),"hug");
      assert.deepEqual(fact(button,"reference-size"),{type:"dimensions",width:viewport==="mobile"?252:230,height:viewport==="mobile"?44:46,unit:"px"});
      assert.equal(button.children.length,0,"canonical child remains the implementation owner");
    }
  });
  for(const showButton of [false,true])for(const showCaption of [false,true]) {
    test(id+" renders Button="+showButton+" Caption="+showCaption+" with exactly the surviving section gaps",()=>{
      const output=render(id,{"show-button":showButton,"show-caption":showCaption});
      for(const viewport of ["mobile","desktop"]){
        const html=viewportHtml(output.html,viewport),tree=parse(html),area=contentArea(tree);
        assert.ok(area,"content area table");
        const anchors=domNodes(tree).filter(n=>n.tag==="a"&&n.attrs.href==="https://example.test/button");
        assert.equal(anchors.length,Number(showButton));
        assert.equal(html.includes("CAPTION"),showCaption);
        const expectedGaps=(viewport==="mobile"?6:1)+Number(showButton)+Number(showCaption);
        assert.equal(gapCells(area,viewport==="mobile"?22:32).length,expectedGaps);
        if(showButton){
          const a=anchors[0];for(const edge of ["top","bottom"])assert.match(a.attrs.style,new RegExp("padding-"+edge+":12px","u"));for(const edge of ["left","right"])assert.match(a.attrs.style,new RegExp("padding-"+edge+":24px","u"));
          const table=ancestor(a,"table");
          assert.match(table.attrs.style,/border-radius:26px/u);assert.match(table.attrs.style,/background-color:#48494A/u);
          if(viewport==="mobile")assert.match(table.opening,/width="100%"/u);
          else {assert.match(table.attrs.style,/min-width:230px/u);assert.doesNotMatch(table.opening,/width="100%"/u);}
          assert.equal(domNodes(a).filter(n=>n.tag==="a").length,1,"single whole-element action");
          if(showCaption)assert.ok(html.indexOf("BUTTON")<html.indexOf("CAPTION"));
        }
      }
    });
  }
}

test("Card/Image links consume both fresh Fill widths while keeping one live href",()=>{
  for(const long of [false,true]){
    const output=render("card-image",{long});
    for(const [viewport,nodeId,width]of [["mobile","1015:18459",252],["desktop","1015:18276",232]]){
      const link=ownerNode("card-image",viewport,nodeId);
      assert.equal(fact(link,"reference-size").width,width);assert.equal(value(link,"horizontal-sizing"),"fill");
      const native=nativeOwner("card-image").native_text_sizing.find(n=>n.node_id===nodeId);
      assert.equal(native.horizontal_sizing,"FILL");assert.equal(native.vertical_sizing,"HUG");
      const html=viewportHtml(output.html,viewport),tree=parse(html),anchors=domNodes(tree).filter(n=>n.tag==="a");
      assert.equal(anchors.length,1);assert.equal(anchors[0].attrs.href,"https://example.test/card");
      assert.match(anchors[0].attrs.style,/width:100%/u);
      assert.equal(domNodes(anchors[0]).filter(n=>n.tag==="img").length,0);
      assert.doesNotMatch(anchors[0].attrs.style,/(?:^|;)height:|max-width:(?:176|236)px/u);
    }
  }
});

test("generic native Fill html-link spans its text column while Fixed remains bounded",()=>{
  for(const sizing of ["fill","fixed"]){
    const root={id:"root",semantic_role:"text-content",render_mode:"presentation-table",visibility:{mode:"always"},facts:[{id:"reference-size",value:{type:"dimensions",width:252,height:20,unit:"px"}}],children:[{
      id:"link",semantic_role:"link",render_mode:"html-link",visibility:{mode:"always"},facts:[
        {id:"reference-size",value:{type:"dimensions",width:252,height:20,unit:"px"}},
        {id:"horizontal-sizing",value:{type:"keyword",value:sizing}},
        {id:"vertical-sizing",value:{type:"keyword",value:"hug"}},
      ],children:[],content_slots:[{id:"text",type:"plain-text",required:true},{id:"href",type:"url",required:true}],
    }]};
    const output=renderContractTree({component:{id:"native-link-sizing",contracts:{mobile:{root},desktop:{root:structuredClone(root)}}},coverage:{component_id:"native-link-sizing",mode:"interpreter"},foundations,content:{link:{text:"Live link",href:"https://example.test/card"}}});
    assert.deepEqual(output.diagnostics,[]);
    const anchor=domNodes(parse(output.html)).find(n=>n.tag==="a");
    if(sizing==="fill"){assert.match(anchor.attrs.style??"",/width:100%/u);assert.match(anchor.attrs.style??"",/display:(?:block|inline-block)/u);}
    else assert.doesNotMatch(anchor.attrs.style??"",/width:100%/u);
  }
});

function assertIconRows(html, count) {
  const rows=domNodes(parse(html)).filter(n=>n.tag==="tr").map(row=>({row,cells:row.children.filter(n=>n.tag==="td")})).filter(({cells})=>cells.length===3&&cells[1].attrs.width&&domNodes(cells[0]).some(n=>n.tag==="img")&&domNodes(cells[2]).some(n=>n.tag==="p"||n.tag==="a"));
  assert.equal(rows.length,count,"icon/text rows");
  for(const {cells}of rows){assert.equal(cells[0].attrs.valign,"top");assert.equal(cells[2].attrs.valign,"middle");assert.ok(domNodes(cells[0]).some(n=>n.tag==="table"),"icon is in a layout wrapper");}
}
test("Card/Icon Desktop wrapper is exactly native Hug/Fill, with master gap10 and top icon/middle text",()=>{
  const root=ownRoot("card-icon","desktop"),wrapper=ownerNode("card-icon","desktop","1802:3992");
  assert.ok(wrapper);assert.equal(root.children[0],wrapper);assert.equal(value(root,"primary-alignment"),"min");assert.equal(value(root,"counter-alignment"),"center");
  assert.equal(value(wrapper,"horizontal-sizing"),"hug");assert.equal(value(wrapper,"vertical-sizing"),"fill");assert.equal(value(wrapper,"layout-gap"),10);
  assert.equal(wrapper.children.length,1);assert.equal(sourceId(wrapper.children[0]),"946:25834");
  for(const long of [false,true]){
    const html=viewportHtml(render("card-icon",{long}).html,"desktop");assertIconRows(html,1);
    assert.doesNotMatch(html,/<table[^>]*height="138"|(?:^|;)height:138px/u);
  }
});

test("Icon-List maps all twelve wrappers to current actual asset identities and keeps viewport-specific row containers",()=>{
  const expected={mobile:[["1817:4786","1015:18589"],["1817:4787","1015:18593"],["1817:4788","1015:18597"],["1817:4789","1015:18601"],["1817:4790","1015:18605"],["1817:4791","1015:18609"]],desktop:[["1802:3506","1015:18565"],["1802:3512","1802:3513"],["1802:3522","1802:3523"],["1802:3532","1802:3533"],["1802:3566","1802:3567"],["1802:3576","1802:3577"]]};
  for(const viewport of ["mobile","desktop"]){
    const area=ownRoot("block-icon-list",viewport).children[0];
    if(viewport==="desktop"){assert.equal(area.children[1].semantic_role,"items");assert.equal(value(area.children[1],"layout-gap"),24);}
    else assert.equal(area.children.filter(n=>/^item-/u.test(n.semantic_role)).length,6);
    for(const [wrapperId,assetId]of expected[viewport]){
      const wrapper=ownerNode("block-icon-list",viewport,wrapperId);assert.ok(wrapper,wrapperId);
      assert.equal(value(wrapper,"horizontal-sizing"),"hug");assert.equal(value(wrapper,"vertical-sizing"),"fill");assert.equal(value(wrapper,"layout-gap"),0);
      assert.equal(value(wrapper,"primary-alignment"),"min");assert.equal(value(wrapper,"counter-alignment"),"min");
      assert.equal(wrapper.children.length,1);assert.equal(sourceId(wrapper.children[0]),assetId);
      assert.equal(wrapper.children[0].asset_contract_id,"feature-icon");assert.equal(fact(wrapper.children[0],"reference-size").width,viewport==="mobile"?42:56);
    }
    for(const long of [false,true])assertIconRows(viewportHtml(render("block-icon-list",{long}).html,viewport),6);
  }
});

test("six Desktop Icon-Cards placements use current source alignment without copying child contracts",()=>{
  const cards=ownRoot("block-icon-cards","desktop").children[0].children[1].children;
  assert.equal(cards.length,6);
  assert.deepEqual(cards.map(sourceId),["398:7763","398:7764","1015:18859","1015:18869","1015:18879","1015:18899"]);
  for(const card of cards){assert.equal(card.component_id,"card-icon");assert.equal(card.children.length,0);assert.equal(value(card,"primary-alignment"),"min");assert.equal(value(card,"counter-alignment"),"center");}
  assertIconRows(viewportHtml(render("block-icon-cards").html,"desktop"),6);
});

test("master10 and projected0 one-child gap disposition is bounded by exact native topology",()=>{
  const master=sourceNode("card-icon","desktop","1802:3992");
  const projected=flat(nativeRoot("block-icon-cards","desktop")).filter(n=>n.node_id.endsWith(";1802:3992"));
  assert.equal(master.layout.item_spacing,10);assert.equal(projected.length,6);
  for(const n of [master,...projected]){
    assert.equal(n.children.length,1);assert.equal(n.children[0].visible,true);assert.equal(n.children[0].name,"feature-icon @4x");
    assert.equal(n.children[0].node_id.endsWith("946:25834"),true);
    assert.deepEqual(n.layout.padding,{top:0,right:0,bottom:0,left:0});assert.deepEqual(n.fills,[]);assert.deepEqual(n.strokes,[]);assert.equal(n.corner_radius,0);
    if(n!==master)assert.equal(n.layout.item_spacing,0);
  }
  const canonical=ownerNode("card-icon","desktop","1802:3992");assert.ok(canonical);assert.equal(canonical.children.length,1);
  function isolated(gap,second=false){
    const root=structuredClone(canonical);root.facts.find(f=>f.id==="layout-gap").value.value=gap;
    if(second){const copy=structuredClone(root.children[0]);copy.id+="-second";root.children.push(copy);}
    const input={component:{id:"one-child-gap",contracts:{mobile:{root},desktop:{root:structuredClone(root)}}},coverage:{component_id:"one-child-gap",mode:"interpreter"},foundations,assets:{"feature-icon":{src:"icon.png"}},content:Object.fromEntries(root.children.map(n=>[n.id,{alt:"icon"}]))};
    const output=renderContractTree(input);assert.deepEqual(output.diagnostics,[]);return output.html;
  }
  assert.equal(isolated(10),isolated(0),"no inter-item boundary exists");
  assert.notEqual(isolated(10,true),isolated(0,true),"second child invalidates the inert-gap disposition");
});

test("Card/Icon Show Description and Show Link retain independent live visibility",()=>{
  for(const description of [false,true])for(const link of [false,true])for(const viewport of ["mobile","desktop"]){
    const html=viewportHtml(render("card-icon",{"show-description":description,"show-link":link}).html,viewport);
    assert.equal(html.includes("DESCRIPTION"),description);assert.equal((html.match(/href="https:\/\/example.test\/card"/gu)??[]).length,Number(link));
    assert.equal((html.match(/<img\b/gu)??[]).length,1);
  }
});

test("Mobile Card/Icon stays fluid as a nested child and asset/Description/outside records are preserved",()=>{
  assert.equal(hash(records.get("card-icon").contracts.mobile),fixture.preserved_mobile_card_icon);
  const html=viewportHtml(render("block-icon-cards",{long:true}).html,"mobile");
  assert.doesNotMatch(html,/<table[^>]*(?:width="271"|max-width:271px)/u);
  for(const [id,expected]of Object.entries(fixture.preserved_records))assert.equal(hash(records.get(id)),expected,id);
  for(const [id,expected]of Object.entries(fixture.preserved_assets))assert.equal(hash(records.get(id).asset_contracts),expected,id+" assets");
  for(const [id,expected]of Object.entries(fixture.preserved_documentation))assert.equal(hash(records.get(id).documentation),expected,id+" Description");
  for(const id of ["block-steps","block-content","banner-secondary","block-bullet-list"]){
    const output=render(id);
    assert.ok(output.html.length>0,id+" unchanged outside consumer remains renderable");
  }
});

test("all existing direct scalar links of changed owners point to exact frozen native values",()=>{
  for(const owner of fixture.owners.filter(o=>o.id!=="button-secondary")){
    const record=records.get(owner.id),nodes=new Map(owner.packet.variants.flatMap(v=>flat(v.source_node)).map(n=>[n.node_id,n]));
    for(const link of record.contracts.figma_fact_links){
      const node=nodes.get(link.node_id);assert.ok(node,owner.id+" stale source identity "+link.node_id);
      // TEXT sizing did not exist in the old producer: use the independently
      // returned native sidecar only for these two exact source fields.
      let actual=link.source_path==="/children_order"?node.children?.map(n=>n.node_id):ptr(node,link.source_path);
      if(actual===undefined&&["/layout/horizontal_sizing","/layout/vertical_sizing"].includes(link.source_path)&&node.node_type==="TEXT")actual=owner.native_text_sizing.find(n=>n.node_id===node.node_id)?.[link.source_path.split("/").at(-1)];
      assert.notEqual(actual,undefined,owner.id+" "+link.node_id+link.source_path);
      actual=link.transform==="lowercase"&&typeof actual==="string"?actual.toLowerCase():nativeNumber(actual);
      assert.deepEqual(ptr(record,link.contract_path),actual,owner.id+" "+link.node_id+link.source_path);
    }
  }
});
