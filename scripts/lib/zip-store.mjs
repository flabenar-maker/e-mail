const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
export function validateZipEntryPath(path) {
  return typeof path==='string' && path.length>0 && !/[\\\x00-\x1f<>:"|?*]/u.test(path) && !path.startsWith('/') && path.split('/').every(part=>part&&part!=='.'&&part!=='..'&&!/[. ]$/u.test(part)&&!/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/iu.test(part));
}
export function encodeZipStore(entries) {
  if(!Array.isArray(entries)||entries.length>65535)throw new Error('ZIP_ENTRY_LIMIT');
  const names=new Set(), folded=new Set(),local=[],central=[];let offset=0;
  for(const entry of [...entries].sort((a,b)=>a.path.localeCompare(b.path,'en'))) {
    if(!validateZipEntryPath(entry.path)||names.has(entry.path)||folded.has(entry.path.toLowerCase()))throw new Error('ZIP_ENTRY_PATH_INVALID');
    names.add(entry.path);folded.add(entry.path.toLowerCase());
    const name=Buffer.from(entry.path,'utf8'),bytes=Buffer.from(entry.bytes),crc=crc32(bytes);
    if(name.length>65535||bytes.length>0xffffffff||offset+30+name.length+bytes.length>0xffffffff)throw new Error('ZIP64_UNSUPPORTED');
    const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x0800,6);header.writeUInt16LE(0,8);header.writeUInt16LE(0,10);header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(bytes.length,18);header.writeUInt32LE(bytes.length,22);header.writeUInt16LE(name.length,26);
    local.push(header,name,bytes);
    const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x0800,8);record.writeUInt16LE(33,14);record.writeUInt32LE(crc,16);record.writeUInt32LE(bytes.length,20);record.writeUInt32LE(bytes.length,24);record.writeUInt16LE(name.length,28);record.writeUInt32LE(offset,42);
    central.push(record,name);offset+=header.length+name.length+bytes.length;
  }
  const directory=Buffer.concat(central);
  if(offset+directory.length>0xffffffff)throw new Error('ZIP64_UNSUPPORTED');
  const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}
