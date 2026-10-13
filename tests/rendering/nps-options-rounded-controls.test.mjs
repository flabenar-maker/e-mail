import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRendererRegistry, resolveRendererCoverage } from "../../scripts/lib/renderer-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const content = {
  "root-content-area-heading": { text: "Понравилось это письмо?" },
  "root-content-area-emoji-buttons-good": { href: "https://example.test/nps/good" },
  "root-content-area-emoji-buttons-neutral": { href: "https://example.test/nps/neutral" },
  "root-content-area-emoji-buttons-bad": { href: "https://example.test/nps/bad" },
  "root-content-area-emoji-buttons-good-happy-face-icon": { alt: "Хорошо" },
  "root-content-area-emoji-buttons-neutral-neutral-face-icon": { alt: "Нейтрально" },
  "root-content-area-emoji-buttons-bad-sad-face-icon": { alt: "Плохо" },
};
const assets = {
  "happy-face-icon": { src: "images/happy-face-icon.png" },
  "neutral-face-icon": { src: "images/neutral-face-icon.png" },
  "sad-face-icon": { src: "images/sad-face-icon.png" },
};

for (const count of [2, 3]) {
  test(`NPS/Options Desktop Count=${count} has rounded controls without square painted cells`, async () => {
    const registries = await loadComponentRegistries({ repoRoot });
    const component = registries.marketing.components.find(({ id }) => id === "nps-options");
    assert.ok(component);
    const coverage = resolveRendererCoverage(
      await loadRendererRegistry({ repoRoot }),
      component.id,
    );
    const foundations = {
      rendering: await readStrictYaml(join(repoRoot, "data/foundations/rendering.yaml")),
    };
    const result = renderContractTree({
      component,
      coverage,
      content,
      assets,
      variantAxes: { Count: String(count) },
      foundations,
    });

    assert.deepEqual(result.diagnostics, []);
    const desktop = result.html.match(/<div class="cupis-root-desktop">([\s\S]*?)<\/div>/u)?.[1];
    assert.ok(desktop, "desktop NPS variant must be rendered");
    const roundedButtons = [...desktop.matchAll(/<table\b[^>]*>/gu)]
      .map(([tag]) => tag)
      .filter((tag) => tag.includes("background-color:#F8F8FA") &&
        tag.includes("border-radius:32px"));
    assert.equal(roundedButtons.length, count);

    const squarePaintedCells = [...desktop.matchAll(/<td\b[^>]*>/gu)]
      .map(([tag]) => tag)
      .filter((tag) => tag.includes('bgcolor="#F8F8FA"') ||
        tag.includes("background-color:#F8F8FA"));
    assert.deepEqual(squarePaintedCells, []);
  });
}

// Task11: selected facts are independent literal expectations, not renderer output-derived.
for(const count of [2,3])test("Task11 NPS Count="+count+" standalone whole-area anchors own each option padding",async()=>{
  const registries=await loadComponentRegistries({repoRoot});const component=registries.marketing.components.find(c=>c.id==="nps-options");
  const coverage=resolveRendererCoverage(await loadRendererRegistry({repoRoot}),component.id);
  const result=renderContractTree({component,coverage,content,assets,variantAxes:{Count:String(count)},foundations:{rendering:await readStrictYaml(join(repoRoot,"data/foundations/rendering.yaml"))}});
  assert.deepEqual(result.diagnostics,[]);
  for(const viewport of ["mobile","desktop"]){
    const branch=result.html.match(new RegExp('<div class="cupis-root-'+viewport+'">([\\s\\S]*?)</div>','u'))?.[1];assert.ok(branch);
    const order=count===2?["good","bad"]:["good","neutral","bad"];
    const links=[...branch.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gu)].map(m=>m[0]);assert.equal(links.length,count);
    assert.deepEqual(links.map(a=>a.match(/href="([^"]+)"/u)[1]),order.map(o=>"https://example.test/nps/"+o));
    for(const [i,option] of order.entries()){
      const opening=links[i].slice(0,links[i].indexOf(">")+1);const inline=option==="good"||(viewport==="mobile"&&count===2&&option==="bad")?24:23;
      assert.match(opening,/display:block/u);for(const [side,value] of [["top",6],["right",inline],["bottom",6],["left",inline]])assert.ok(opening.includes("padding-"+side+":"+value+"px"),viewport+" Count="+count+" "+option+" "+side);
      assert.match(links[i],/<img\b/u);assert.doesNotMatch(links[i],/<table\b|<a\b[^>]*>[\s\S]*<a\b/u);
    }
    const painted=[...branch.matchAll(/<table\b[^>]*>/gu)].filter(m=>m[0].includes("background-color:#F8F8FA")&&m[0].includes("border-radius:32px"));assert.equal(painted.length,count);
    assert.doesNotMatch(branch,/<td\b[^>]*(?:bgcolor="#F8F8FA"|background-color:#F8F8FA)/u);
    if(count===2)assert.doesNotMatch(branch,/nps\/neutral|neutral-face-icon/u);
  }
});

test("Task11 standalone different viewport URL asset and alt keep native pairing",async()=>{
  const component=(await loadComponentRegistries({repoRoot})).marketing.components.find(c=>c.id==="nps-options");
  const coverage=resolveRendererCoverage(await loadRendererRegistry({repoRoot}),component.id);
  const scopedContent={...content},scopedAssets={...assets};
  for(const viewport of ["mobile","desktop"]){
    scopedContent[viewport]={};scopedAssets[viewport]={};
    for(const [option,icon] of [["good","happy-face-icon"],["neutral","neutral-face-icon"],["bad","sad-face-icon"]]){
      const id="root-content-area-emoji-buttons-"+option;
      scopedContent[viewport][id]={href:"https://example.test/task11-native/"+viewport+"/"+option};
      scopedContent[viewport][id+"-"+icon]={alt:viewport+" "+option+" artwork"};
      scopedAssets[viewport][icon]={src:"images/task11-native-"+viewport+"-"+option+".png"};
    }
  }
  const r=renderContractTree({component,coverage,content:scopedContent,assets:scopedAssets,foundations:{rendering:await readStrictYaml(join(repoRoot,"data/foundations/rendering.yaml"))}});assert.deepEqual(r.diagnostics,[]);
  for(const viewport of ["mobile","desktop"])for(const option of ["good","neutral","bad"]){
    const href="https://example.test/task11-native/"+viewport+"/"+option;const anchors=[...r.html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gu)].map(m=>m[0]).filter(a=>a.includes('href="'+href+'"'));assert.equal(anchors.length,1);const a=anchors[0];
    assert.match(a,/display:block/u);assert.ok(a.includes('src="images/task11-native-'+viewport+"-"+option+'.png"'));assert.ok(a.includes('alt="'+viewport+" "+option+' artwork"'));
    assert.ok(!a.includes("task11-native-"+(viewport==="mobile"?"desktop":"mobile")),"opposite image must remain in its own native branch");assert.doesNotMatch(a,/<table\b/u);
  }
});
