<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: asset-registry -->
<!-- source-digest: sha256:3a6aa5b31a7665b7eb7de9927606adb47ce53770852938622129a23e641aed8b -->
<!-- schema-versions: components=2.1.0, assets=1.0.0 -->
# CUPIS asset registry

General export definitions are listed first. Component-specific choices remain owned by component contracts.

## Source modes

### IMAGE FILL

- Stable ID: `image-fill`
- Description: Export the original source raster from the Fill of the concrete Desktop email instance without its container, nested graphics or live HTML.
- Contract:

```json
{
  "concrete_desktop_instance_required": true,
  "live_html_included": false,
  "own_visible_fill_included": true,
  "parent_fill_included": false,
  "source_content": "source-raster-only",
  "unrelated_layout_included": false,
  "visible_nested_graphics_included": false
}
```

### RENDERED NODE

- Stable ID: `rendered-node`
- Description: Export the exact selected node from the concrete Desktop email instance after overrides, including its own visible Fill and visible nested graphics but excluding parent Fill and unrelated layout.
- Contract:

```json
{
  "concrete_desktop_instance_required": true,
  "live_html_included": false,
  "own_visible_fill_included": true,
  "parent_fill_included": false,
  "source_content": "exact-node-after-overrides",
  "unrelated_layout_included": false,
  "visible_nested_graphics_included": true
}
```

## Display modes

### DIRECT IMAGE

- Stable ID: `direct-image`
- Description: Render the file as a proportional image. Mobile may use width 100% only with automatic height; the image does not inherit a crop container.
- Contract:

```json
{
  "crop_owner": "none",
  "deformation_forbidden": true,
  "fixed_mobile_height_forbidden": true,
  "html_height_attribute_forbidden": true,
  "image_height_100_percent_forbidden": true,
  "intrinsic_ratio_required": true,
  "mobile_height_behavior": "auto",
  "mobile_width_behavior": "fluid-to-container"
}
```

### FILL IMAGE

- Stable ID: `fill-image`
- Description: Preserve the source-file ratio while a separate HTML wrapper owns the crop. Mobile remains proportional and never stretches the raster.
- Contract:

```json
{
  "crop_owner": "html-wrapper",
  "deformation_forbidden": true,
  "fixed_mobile_height_forbidden": true,
  "html_height_attribute_forbidden": true,
  "image_height_100_percent_forbidden": true,
  "intrinsic_ratio_required": true,
  "mobile_height_behavior": "auto",
  "mobile_width_behavior": "fluid-to-container"
}
```

## Export profiles

### JPEG @2x

- Stable ID: `jpeg-2x`
- Description: Export an sRGB JPEG at scale 2. Start at quality 82 and increase to 90 only when visible artifacts remain; rendered nodes use a lossless PNG intermediate before JPEG conversion.
- Contract:

```json
{
  "alpha_mode": "none",
  "color_space": "sRGB",
  "extension": ".jpg",
  "format": "JPEG",
  "quality": {
    "base_percent": 82,
    "escalation_condition": "visible-artifacts-only",
    "escalation_percent": 90
  },
  "rendered_node_intermediate": "lossless-png",
  "scale": 2,
  "suffix": "@2x"
}
```

### PNG @4x

- Stable ID: `png-4x`
- Description: Export an sRGB PNG at scale 4 with the declared alpha expectation and node contentsOnly behavior.
- Contract:

```json
{
  "allowed_alpha_modes": [
    "transparent",
    "opaque",
    "source"
  ],
  "color_space": "sRGB",
  "extension": ".png",
  "format": "PNG",
  "node_export_contents_only": true,
  "scale": 4,
  "suffix": "@4x"
}
```

## Alpha modes

### none

- Stable ID: `none`
- Description: JPEG output has no alpha channel.
- Contract:

```json
{
  "expectation": "no-alpha",
  "permits_alpha": false
}
```

### opaque

- Stable ID: `opaque`
- Description: The owned visual intentionally produces a fully opaque PNG.
- Contract:

```json
{
  "expectation": "fully-opaque",
  "permits_alpha": false
}
```

### source

- Stable ID: `source`
- Description: Preserve the source node's own alpha behavior without a matte.
- Contract:

```json
{
  "expectation": "preserve-source",
  "permits_alpha": true
}
```

### transparent

- Stable ID: `transparent`
- Description: Pixels outside the owned visual remain transparent.
- Contract:

```json
{
  "expectation": "transparent-outside-visual",
  "permits_alpha": true
}
```

## Clipping policies

### neutralize-presentation-only

- Stable ID: `neutralize-presentation-only`
- Description: On a temporary copy of a rendered node, neutralize only presentation radius or clipsContent, preserve the artwork contract, export, delete the copy and confirm the original by readback.
- Contract:

```json
{
  "allowed_source_mode_ids": [
    "rendered-node"
  ],
  "artwork_clipping_preserved": true,
  "presentation_clipping_neutralized": true,
  "preserve_fields": [
    "fill",
    "crop",
    "dimensions",
    "intrinsic-ratio",
    "variants",
    "overrides",
    "children"
  ],
  "readback_required": true,
  "temporary_copy_deleted": true,
  "temporary_copy_required": true
}
```

### preserve-artwork

- Stable ID: `preserve-artwork`
- Description: Preserve clipping and radius that belong to the artwork itself; no temporary mutation is required.
- Contract:

```json
{
  "allowed_source_mode_ids": [
    "image-fill",
    "rendered-node"
  ],
  "artwork_clipping_preserved": true,
  "presentation_clipping_neutralized": false,
  "preserve_fields": [
    "fill",
    "crop",
    "dimensions",
    "intrinsic-ratio",
    "variants",
    "overrides",
    "children"
  ],
  "readback_required": false,
  "temporary_copy_deleted": false,
  "temporary_copy_required": false
}
```

## Compatibility

### jpeg-2x-compatibility

- Stable ID: `jpeg-2x-compatibility`
- Definition:

```json
{
  "alpha_mode_ids": [
    "none"
  ],
  "clipping_policy_ids": [
    "preserve-artwork",
    "neutralize-presentation-only"
  ],
  "display_mode_ids": [
    "direct-image",
    "fill-image"
  ],
  "export_profile_id": "jpeg-2x",
  "source_mode_ids": [
    "image-fill",
    "rendered-node"
  ]
}
```

### png-4x-compatibility

- Stable ID: `png-4x-compatibility`
- Definition:

```json
{
  "alpha_mode_ids": [
    "transparent",
    "opaque",
    "source"
  ],
  "clipping_policy_ids": [
    "preserve-artwork",
    "neutralize-presentation-only"
  ],
  "display_mode_ids": [
    "direct-image",
    "fill-image"
  ],
  "export_profile_id": "png-4x",
  "source_mode_ids": [
    "image-fill",
    "rendered-node"
  ]
}
```

## Global invariants

### artificial-background-forbidden

- Stable ID: `artificial-background-forbidden`
- Definition:

```json
{
  "statement": "No matte or background absent from the owned export boundary may be added."
}
```

### component-contract-owns-specifics

- Stable ID: `component-contract-owns-specifics`
- Definition:

```json
{
  "statement": "Component owners, boundaries, display sizes and exceptions remain component-owned."
}
```

### concrete-instance-source

- Stable ID: `concrete-instance-source`
- Definition:

```json
{
  "statement": "Export uses the concrete Desktop email instance after its overrides."
}
```

### exact-component-boundary

- Stable ID: `exact-component-boundary`
- Definition:

```json
{
  "statement": "The component contract selects the exact export boundary."
}
```

### figma-export-setting-non-authoritative

- Stable ID: `figma-export-setting-non-authoritative`
- Definition:

```json
{
  "statement": "Configured Figma export settings are observational helpers; the selected foundation export profile owns final format, scale, suffix, color space and quality."
}
```

### intrinsic-ratio-preserved

- Stable ID: `intrinsic-ratio-preserved`
- Definition:

```json
{
  "statement": "Responsive width changes preserve the source raster proportions."
}
```

### one-file-one-src

- Stable ID: `one-file-one-src`
- Definition:

```json
{
  "statement": "One visual asset uses one file and one src across Mobile and Desktop."
}
```

### raster-deformation-forbidden

- Stable ID: `raster-deformation-forbidden`
- Definition:

```json
{
  "statement": "A raster must not be stretched independently on both axes."
}
```

### source-display-independent

- Stable ID: `source-display-independent`
- Definition:

```json
{
  "statement": "Source mode and display mode are independent contract choices."
}
```

## Identity policy

```json
{
  "base_name_source": "nearest-semantic-asset-owner",
  "concrete_desktop_instance_required": true,
  "main_component_export_forbidden": true,
  "placeholder_forbidden": true,
  "scale_suffix_required": true,
  "shared_mobile_desktop_file": true,
  "shared_mobile_desktop_src": true,
  "viewport_suffixes_forbidden": [
    "Mobile",
    "Desktop"
  ]
}
```

## Background policy

```json
{
  "artificial_matte": "forbid",
  "invisible_fill": "exclude",
  "own_visible_boundary_fill": "preserve",
  "parent_fill": "exclude"
}
```

## Component-specific asset contracts

### asset-header-logo-4x

- `asset-header-logo-4x` → `header-logo @4x` → `rendered-node` → `direct-image` → `png-4x` → `opaque`
  - Asset contract ID: `header-logo`
  - Export boundary: `node` / `header-logo @4x`
  - Pixel dimensions: 1288×200px
  - Aspect ratio: 322:50
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### asset-card-image-2x

- `asset-card-image-2x` → `Asset/Card-Image @2x` → `rendered-node` → `direct-image` → `jpeg-2x` → `none`
  - Asset contract ID: `card-image`
  - Export boundary: `node` / `Asset/Card-Image @2x`
  - Pixel dimensions: 464×296px
  - Aspect ratio: 232:148
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `neutralize-presentation-only`

### asset-feature-icon-4x

- `asset-feature-icon-4x` → `Asset/Feature-Icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `feature-icon`
  - Export boundary: `node` / `Asset/Feature-Icon @4x`
  - Pixel dimensions: 256×256px
  - Aspect ratio: 64:64
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### banner-app-download

- `banner-app-download` → `app-logo @4x` → `rendered-node` → `direct-image` → `png-4x` → `source`
  - Asset contract ID: `app-logo`
  - Export boundary: `node` / `app-logo @4x`
  - Pixel dimensions: 876×248px
  - Aspect ratio: 219:62
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-app-download` → `appgallery-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `appgallery-icon`
  - Export boundary: `node` / `appgallery-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-app-download` → `getapps-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `getapps-icon`
  - Export boundary: `node` / `getapps-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-app-download` → `google-play-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `google-play-icon`
  - Export boundary: `node` / `google-play-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-app-download` → `qr-code @4x` → `rendered-node` → `direct-image` → `png-4x` → `source`
  - Asset contract ID: `qr-code`
  - Export boundary: `node` / `qr-code @4x`
  - Pixel dimensions: 554×554px
  - Aspect ratio: 130:130
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-app-download` → `rustore-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `rustore-icon`
  - Export boundary: `node` / `rustore-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### banner-hero

- `banner-hero` → `hero-image @2x` → `image-fill` → `direct-image` → `jpeg-2x` → `none`
  - Asset contract ID: `hero-image`
  - Export boundary: `fill` / `hero-image @2x`
  - Pixel dimensions: 1104×706px
  - Aspect ratio: 552:353
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### banner-inline

- `banner-inline` → `chevron-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `chevron-icon`
  - Export boundary: `node` / `chevron-icon @4x`
  - Pixel dimensions: 96×96px
  - Aspect ratio: 24:24
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-inline` → `feature-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `feature-icon`
  - Export boundary: `node` / `feature-icon @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### banner-secondary

- `banner-secondary` → `secondary-image @2x` → `image-fill` → `fill-image` → `jpeg-2x` → `none`
  - Asset contract ID: `secondary-image`
  - Export boundary: `fill` / `secondary-image @2x`
  - Pixel dimensions: 984×696px
  - Aspect ratio: 41:29
  - Crop: `none`; position `source-raster`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-icon-list

- `block-icon-list` → `feature-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `feature-icon`
  - Export boundary: `node` / `feature-icon @4x`
  - Pixel dimensions: 224×224px
  - Aspect ratio: 56:56
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-info-alert

- `block-info-alert` → `alert-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `alert-icon`
  - Export boundary: `node` / `alert-icon @4x`
  - Pixel dimensions: 104×104px
  - Aspect ratio: 26:26
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### card-icon

- `card-icon` → `feature-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `feature-icon`
  - Export boundary: `node` / `feature-icon @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### card-image

- `card-image` → `card-image @2x` → `rendered-node` → `direct-image` → `jpeg-2x` → `none`
  - Asset contract ID: `card-image`
  - Export boundary: `node` / `card-image @2x`
  - Pixel dimensions: 464×296px
  - Aspect ratio: 232:148
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `neutralize-presentation-only`

### email-footer

- `email-footer` → `telegram-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `telegram-icon`
  - Export boundary: `node` / `telegram-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `email-footer` → `vk-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `vk-icon`
  - Export boundary: `node` / `vk-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### email-header

- `email-header` → `header-logo @4x` → `rendered-node` → `direct-image` → `png-4x` → `opaque`
  - Asset contract ID: `header-logo`
  - Export boundary: `node` / `header-logo @4x`
  - Pixel dimensions: 1288×200px
  - Aspect ratio: 322:50
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### item-alert

- `item-alert` → `alert-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `alert-icon`
  - Export boundary: `node` / `alert-icon @4x`
  - Pixel dimensions: 104×104px
  - Aspect ratio: 26:26
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### item-notification

- `item-notification` → `feature-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `feature-icon`
  - Export boundary: `node` / `feature-icon @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### nps-options

- `nps-options` → `happy-face-icon @4x` → `image-fill` → `direct-image` → `png-4x` → `source`
  - Asset contract ID: `happy-face-icon`
  - Export boundary: `fill` / `happy-face-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `nps-options` → `neutral-face-icon @4x` → `image-fill` → `direct-image` → `png-4x` → `source`
  - Asset contract ID: `neutral-face-icon`
  - Export boundary: `fill` / `neutral-face-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `nps-options` → `sad-face-icon @4x` → `image-fill` → `direct-image` → `png-4x` → `source`
  - Asset contract ID: `sad-face-icon`
  - Export boundary: `fill` / `sad-face-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### asset-bank-badge-4x

- `asset-bank-badge-4x` → `Asset/Bank-Badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `bank-badge`
  - Export boundary: `node` / `Asset/Bank-Badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### asset-icon-badge-4x

- `asset-icon-badge-4x` → `Asset/Icon-Badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `icon-badge`
  - Export boundary: `node` / `Asset/Icon-Badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### asset-partner-badge-4x

- `asset-partner-badge-4x` → `Asset/Partner-Badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `partner-badge`
  - Export boundary: `node` / `Asset/Partner-Badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### asset-status-badge-negative-4x

- `asset-status-badge-negative-4x` → `Asset/Status-Badge-Negative @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `status-badge-negative`
  - Export boundary: `node` / `Asset/Status-Badge-Negative @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### asset-status-badge-positive-4x

- `asset-status-badge-positive-4x` → `Asset/Status-Badge-Positive @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `status-badge-positive`
  - Export boundary: `node` / `Asset/Status-Badge-Positive @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### banner-fiscal-check-link

- `banner-fiscal-check-link` → `chevron-icon @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `chevron-icon`
  - Export boundary: `node` / `chevron-icon @4x`
  - Pixel dimensions: 96×96px
  - Aspect ratio: 24:24
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-fiscal-check-link` → `fns-badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `fns-badge`
  - Export boundary: `node` / `fns-badge @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
- `banner-fiscal-check-link` → `ofd-badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `ofd-badge`
  - Export boundary: `node` / `ofd-badge @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-instruction-steps

- `block-instruction-steps` → `error-warning-line @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `error-warning-line`
  - Export boundary: `node` / `error-warning-line @4x`
  - Pixel dimensions: 96×96px
  - Aspect ratio: 24:24
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-personal-data-update

- `block-personal-data-update` → `status-badge-positive @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `status-badge-positive`
  - Export boundary: `node` / `status-badge-positive @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-receipt-info

- `block-receipt-info` → `status-badge-positive @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `status-badge-positive`
  - Export boundary: `node` / `status-badge-positive @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-transaction-error

- `block-transaction-error` → `partner-badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `partner-badge`
  - Export boundary: `node` / `partner-badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`

### block-transaction-success

- `block-transaction-success` → `partner-badge @4x` → `rendered-node` → `direct-image` → `png-4x` → `transparent`
  - Asset contract ID: `partner-badge`
  - Export boundary: `node` / `partner-badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own visible boundary fill `preserve`; artificial matte `forbid`
  - Clipping policy: `preserve-artwork`
