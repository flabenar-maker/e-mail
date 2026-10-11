import { matchesTemplateTarget } from './email-template-rules.mjs';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function buildEmailServiceFragments({deliveryDocument,profile}) {
  const fragment=html=>({html,protected:true,plain_text:''});
  return {
    preheader:fragment('<div style="display:none;max-height:0;max-width:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;opacity:0;mso-hide:all;">'+escape(deliveryDocument.preheader.replace(/\r\n?/gu,'\n'))+'</div>'),
    padding:fragment('<div style="display:none;max-height:0;max-width:0;overflow:hidden;font-size:0;line-height:0;color:transparent;opacity:0;mso-hide:all;">'+('&nbsp;&#8204;'.repeat(250))+'</div>'),
    snippetEnd:fragment('<div style="font-size:0px;color:transparent;opacity:0;">\u034f\u200c <vk-snippet-end></vk-snippet-end></div>'),
  };
}
export function applyOutputLink({html,origin,outputBindings=[],existingAnchorContext}) {
  const matches=outputBindings.filter(binding=>binding.kind==='managed-output-link'&&matchesTemplateTarget(binding.target,origin));
  if(!matches.length)return {html,diagnostics:[]};
  if(matches.length!==1)return {html,diagnostics:[{code:'EMAIL_OUTPUT_LINK_CONFLICT',path:'/outputBindings',message:'Multiple output links address one origin.'}]};
  const href=matches[0].href;
  if(existingAnchorContext) {
    if(existingAnchorContext.href===href)return {html,diagnostics:[]};
    return {html,diagnostics:[{code:'EMAIL_OUTPUT_LINK_CONFLICT',path:'/outputBindings',message:'An existing anchor has a different address.'}]};
  }
  if(/<a\b/iu.test(html))return {html,diagnostics:[{code:'EMAIL_OUTPUT_LINK_NESTED',path:'/outputBindings',message:'Output link would contain another anchor.'}]};
  return {html:`<a href="${escape(href)}" target="_blank" style="display:block;color:inherit;text-decoration:none;">${html}</a>`,diagnostics:[]};
}
