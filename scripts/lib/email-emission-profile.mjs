export function resolveEmissionProfile({ deliveryProfile, renderingFoundation } = {}) {
  if (!deliveryProfile) return {id:'desktop-default',version:'1.0.0',fallback_viewport:'desktop'};
  if (deliveryProfile.id !== 'altcraft-mobile-base-v1' || !['1.0.0','1.0.1'].includes(deliveryProfile.version)) {
    const error=new Error('Unknown emission profile.'); error.code='EMISSION_PROFILE_UNKNOWN'; throw error;
  }
  const emission=deliveryProfile.emission;
  if (emission?.fallback_viewport !== 'mobile' || emission.desktop_condition?.viewport_min_px !== 660 || emission.desktop_condition?.device_min_px !== 660 || emission.mso_desktop !== true || emission.preserve_structural_splits !== true) {
    const error=new Error('Invalid Altcraft emission policy.'); error.code='EMISSION_PROFILE_INVALID'; throw error;
  }
  return {id:deliveryProfile.id,version:deliveryProfile.version,...structuredClone(emission)};
}
export function createViewportRules({profile,classes,mobileDisplay='block',desktopDisplay='block'}) {
  if (!['block','table','table-row','table-cell','inline','inline-block'].includes(mobileDisplay) || !['block','table','table-row','table-cell','inline','inline-block'].includes(desktopDisplay)) throw new Error('EMISSION_DISPLAY_INVALID');
  const show=(name,display)=>`.${name}{display:${display}!important;max-height:none!important;overflow:visible!important}`;
  const hide=name=>`.${name}{display:none!important;max-height:0!important;overflow:hidden!important}`;
  if (profile.fallback_viewport === 'mobile') {
    // Build readable CSS from known declarations; never parse opaque CSS values.
    const rule=(name,declarations,indent='')=>`${indent}.${name} {\n${declarations.map(([property,value])=>`${indent}  ${property}:${value}!important;`).join('\n')}\n${indent}}`;
    const hidden=[['display','none'],['max-height','0'],['overflow','hidden']];
    const visible=[['display',desktopDisplay],['max-height','none'],['overflow','visible']];
    return {
      ordinaryRules:[`@media only screen and (min-width:${profile.desktop_condition.viewport_min_px}px) and (min-device-width:${profile.desktop_condition.device_min_px}px) {\n${rule(classes.mobile,hidden,'  ')}\n${rule(classes.desktop,visible,'  ')}\n}`],
      msoRules:[rule(classes.desktop,visible)],
    };
  }
  return {ordinaryRules:[hide(classes.desktop)+show(classes.mobile,mobileDisplay)],msoRules:[]};
}
