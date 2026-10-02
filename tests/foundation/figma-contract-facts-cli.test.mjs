import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createSystemFixture, writeFixtureFile } from "../helpers/system-fixture.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cli = await import("../../scripts/audit-figma-contract-facts.mjs").catch(() => ({}));
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

test("CLI loads canonical component and rejects an incomplete live Figma packet", async () => {
  assert.equal(typeof cli.main, "function");
  const dir = await mkdtemp(join(tmpdir(), "cupis-figma-gate-"));
  try {
    const livePath = join(dir, "live.json");
    await writeFile(livePath, JSON.stringify({
      file_key: "8zka5bHkcrJVK9I9dKjnhC",
      component_node_id: "497:26103",
      variants: [],
    }));
    const lines = [];
    const oldLog = console.log;
    console.log = (value) => lines.push(value);
    let code;
    try {
      code = await cli.main([
        "--repo-root", repoRoot,
        "--component-id", "details-operation-plain",
        "--live", livePath,
      ]);
    } finally {
      console.log = oldLog;
    }
    assert.equal(code, 1);
    const report = JSON.parse(lines.join(""));
    assert.equal(report.ok, false);
    assert.ok(report.issues.some((issue) => issue.code === "FIGMA_VARIANT_MISSING"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("CLI cannot run without separately supplied live Figma data", async () => {
  const result = await cli.main([
    "--repo-root", repoRoot,
    "--component-id", "details-operation-plain",
  ]);
  assert.equal(result, 1);
});


test("CLI refuses an externally supplied fact map", async () => {
  const result = await cli.main([
    "--repo-root", repoRoot,
    "--component-id", "details-operation-plain",
    "--live", "unused.json",
    "--mappings", "outside-contract.json",
  ]);
  assert.equal(result, 1);
});

// Controlled synthetic capture. Real library records are read, never rewritten.
const TEST_SHA = "a".repeat(40);
async function evidenceCliFixture(t) {
  const dir = await createSystemFixture(); t.after(()=>dir.cleanup());
  const registry = await readStrictYaml(join(repoRoot,"data/components/shared.yaml"));
  const record = registry.components.find(r=>r.id==="email-template");
  const packet={capture_version:"1.1.0",file_key:record.figma.file_key,component_node_id:record.figma.node_id,component_properties:[],capture_errors:[],
    capture_meta:{started_at:"2026-10-02T09:00:01.000Z",completed_at:"2026-10-02T09:00:02.000Z",tree_complete:true,node_count:record.variants.length*2},
    variants:record.variants.map((v,i)=>{
      const width=v.axes.some(a=>a.value==="Desktop")?600:328;
      const n=(id,type)=>({node_id:id,node_type:type,visible:true,opacity:1,reference_dimensions:{width,height:1000,unit:"px"},
        fills:[{type:"solid",visible:true,opacity:1,color:"#F3F3F5"}],layout:{mode:"VERTICAL",horizontal_sizing:"FIXED",vertical_sizing:"HUG",padding:{top:0,right:0,bottom:0,left:0}},children:[]});
      const root=n(v.node_id,"COMPONENT");root.children=[n(`99001:${i+1}`,"SLOT")];
      return{variant_node_id:v.node_id,axes:v.axes,source_node:root};
    })};
  const bytes=JSON.stringify(packet), livePath=await writeFixtureFile(dir.root,"packet.json",bytes);
  const session={schema_version:"1.0.0",canonical_git_sha:TEST_SHA,started_at:"2026-10-02T09:00:00.000Z",completed_at:"2026-10-02T09:00:04.000Z",component_ids:[record.id],
    captures:[{component_id:record.id,receipt_id:"synthetic-cli",tool:"use_figma",received_at:"2026-10-02T09:00:03.000Z",packet_path:"packet.json",packet_sha256:createHash("sha256").update(bytes).digest("hex")}]};
  const sessionPath=await writeFixtureFile(dir.root,"session.json",JSON.stringify(session));
  return {root:dir.root,packet,session,livePath,sessionPath,args:["--repo-root",repoRoot,"--component-id",record.id,"--live",livePath,"--canonical-sha",TEST_SHA,"--evidence-session",sessionPath]};
}
async function runEvidenceCli(args) {
  const output=[],oldLog=console.log,oldError=console.error;
  console.log=console.error=value=>output.push(value);
  try{return{code:await cli.main(args),report:JSON.parse(output.at(-1))};}
  finally{console.log=oldLog;console.error=oldError;}
}
const reportHas=(r,c)=>r.issues.some(i=>i.code===c);
test("CLI session binds canonical record and reports all missing Template links rather than PASS",async t=>{
  const f=await evidenceCliFixture(t),r=await runEvidenceCli(f.args);
  assert.equal(r.code,1);assert.equal(r.report.ok,false);assert.ok(r.report.facts);
  assert.equal(r.report.evidence_links.canonical_git_sha,TEST_SHA);
  assert.equal(r.report.evidence_links.required_sources.length,9);
  assert.equal(r.report.evidence_links.issues.filter(i=>i.code==="EVIDENCE_REQUIRED_LINK_MISSING").length,9);
  assert.ok(reportHas(r.report,"FIGMA_FACT_UNCOVERED"));
});
test("CLI old arguments retain scalar diagnostics and request a session for shell evidence",async t=>{
  const f=await evidenceCliFixture(t),r=await runEvidenceCli(f.args.slice(0,6));
  assert.equal(r.code,1);assert.ok(reportHas(r.report,"EVIDENCE_SESSION_REQUIRED"));assert.ok(reportHas(r.report,"FIGMA_FACT_UNCOVERED"));
});
for(const [label,change,expected] of [
  ["other live packet",async f=>{const p=structuredClone(f.packet);p.variants[0].source_node.reference_dimensions.height=999;f.args[5]=await writeFixtureFile(f.root,"other.json",JSON.stringify(p));},"EVIDENCE_LIVE_PACKET_MISMATCH"],
  ["identical JSON with different bytes",async f=>{f.args[5]=await writeFixtureFile(f.root,"formatted.json",JSON.stringify(f.packet,null,2));},"EVIDENCE_LIVE_PACKET_MISMATCH"],
  ["recorded hash mismatch",async f=>{f.session.captures[0].packet_sha256="0".repeat(64);},"EVIDENCE_PACKET_HASH_MISMATCH"],
  ["wrong session SHA",async f=>{f.session.canonical_git_sha="b".repeat(40);},"EVIDENCE_SESSION_SHA_MISMATCH"],
  ["wrong requested owner",async f=>{f.args[3]="asset-header-logo-4x";},"EVIDENCE_LIVE_PACKET_MISMATCH"],
  ["old session packet",async f=>{
    f.packet.capture_version="1.0.0";const b=JSON.stringify(f.packet);await writeFixtureFile(f.root,"packet.json",b);f.session.captures[0].packet_sha256=createHash("sha256").update(b).digest("hex");
  },"EVIDENCE_CAPTURE_VERSION_UNSUPPORTED"],
  ["unknown session packet",async f=>{
    f.packet.capture_version="9.0.0";const b=JSON.stringify(f.packet);await writeFixtureFile(f.root,"packet.json",b);f.session.captures[0].packet_sha256=createHash("sha256").update(b).digest("hex");
  },"EVIDENCE_CAPTURE_VERSION_UNSUPPORTED"],
])test(`CLI rejects ${label} with a typed issue`,async t=>{
  const f=await evidenceCliFixture(t);await change(f);await writeFixtureFile(f.root,"session.json",JSON.stringify(f.session));
  const r=await runEvidenceCli(f.args);assert.equal(r.code,1);assert.ok(reportHas(r.report,expected),JSON.stringify(r.report));
});
for(const flags of [
  ["--canonical-sha",TEST_SHA],["--evidence-session","session.json"],
  ["--canonical-sha",TEST_SHA,"--evidence-session","session.json","--mappings","outside.json"],
  ["--canonical-sha",TEST_SHA,"--evidence-session","session.json","--expected-value","600"],
  ["--canonical-sha",TEST_SHA,"--evidence-session","session.json","--canonical-target","outside.json"],
])test(`CLI rejects incomplete or externally injected flags ${flags.join(" ")}`,async()=>{
  const r=await runEvidenceCli(["--repo-root",repoRoot,"--component-id","email-template","--live","unused.json",...flags]);
  assert.equal(r.code,1);assert.ok(reportHas(r.report,"LIVE_FIGMA_REQUIRED"));
});
