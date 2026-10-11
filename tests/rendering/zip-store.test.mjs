import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import test from "node:test";
import { encodeZipStore } from "../../scripts/lib/zip-store.mjs";
import { publishFileSetAtomically } from "../../scripts/lib/email-output.mjs";
test("store ZIP rejects unsafe paths and preserves CRC-readable image bytes", async (t) => {
 const zip=encodeZipStore([{path:"email/html.html",bytes:Buffer.from("<p>x</p>")},{path:"images/logo.png",bytes:Buffer.from([0,1,2,255])}]); assert.ok(Buffer.isBuffer(zip)); assert.throws(()=>encodeZipStore([{path:"../escape",bytes:Buffer.from("x")}])) ;
 const root=await mkdtemp(join(tmpdir(),"zip-store-")); t.after(()=>rm(root,{recursive:true,force:true})); const target=join(root,"release"); await publishFileSetAtomically({outputDir:target,entries:[{path:"altcraft.zip",bytes:zip}]}); assert.deepEqual(await readFile(join(target,"altcraft.zip")),zip); const check = spawnSync(process.env.CUPIS_BUNDLED_PYTHON ?? "python", ["-c", "import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.read(\"images/logo.png\")==bytes([0,1,2,255]); assert z.getinfo(\"images/logo.png\").CRC", join(target,"altcraft.zip")], { encoding:"utf8" }); assert.equal(check.status, 0, check.stderr); await assert.rejects(publishFileSetAtomically({outputDir:target,entries:[{path:"second.txt",bytes:Buffer.from("x")}]}));
});
test("atomic publisher leaves no final version after a failed required entry", async (t) => { const root=await mkdtemp(join(tmpdir(),"zip-atomic-")); t.after(()=>rm(root,{recursive:true,force:true})); const target=join(root,"release"); await assert.rejects(publishFileSetAtomically({outputDir:target,entries:[{path:"",bytes:Buffer.from("x")}]})); await assert.rejects(readFile(target)); });

