<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: component-registry -->
<!-- source-digest: sha256:7fb97e8709bfbed5d71604588a76657a2fd2314450885333991ebb82650739d5 -->
<!-- schema-versions: components=2.1.0, typography=1.0.0, spacing=1.0.0, assets=1.0.0 -->
# CUPIS component registry

61 component records.

| Library | Records |
|---|---:|
| shared | 17 |
| marketing | 26 |
| service | 18 |

<!-- library: shared; component-id: asset-header-logo-4x -->
## Asset/Header-Logo @4x

### Identity and purpose

- CUPIS ID: `asset-header-logo-4x`
- Status: `active`
- Library: `shared`
- Semantic role: `asset`
- Category: `header-logo-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1008:1476` (`component-set`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:6f44cba3b08f72d9d9089c639dba40b89db37ed2a5cb2e49f87d324ba1cf9694`
- Purpose: Канонический составной логотип хедера с защитной подложкой для обоих viewport.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Header-Logo @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `header-logo` — role `image`; render `direct-image`; visibility `always`; asset `header-logo`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `#F3F3F5`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: asset `header-logo`
  - Fact `description-3`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `322×50px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `212×33px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `header-logo` — role `image`; render `direct-image`; visibility `always`; asset `header-logo`

### Properties and variants

- Variant `product-cupis` — Figma node `1008:1473`; axes: `Product=CUPIS`
- Variant `product-card` — Figma node `1008:1474`; axes: `Product=Card`
- Variant `product-wallet` — Figma node `1008:1475`; axes: `Product=Wallet`

### Assets and interaction

- Asset contract: `header-logo`
  - Owner layer: `header-logo @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `opaque` — `fully-opaque`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `header-logo @4x`
  - Pixel dimensions: 1288×200px
  - Aspect ratio: 322:50
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `header-logo` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `header-logo` as `direct-image`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-header-logo-4x
PURPOSE: Канонический составной логотип хедера с защитной подложкой для обоих viewport.
RENDER: ASSET
```

<!-- library: shared; component-id: asset-header-logo-compact-4x -->
## Asset/Header-Logo-Compact @4x

### Identity and purpose

- CUPIS ID: `asset-header-logo-compact-4x`
- Status: `active`
- Library: `shared`
- Semantic role: `asset`
- Category: `header-logo-compact-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1008:1708` (`component-set`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:766014ceb8fc33ec9b577b3ebaec7f343603d31bc7bf75b3ed3a633e087e688a`
- Purpose: Вспомогательный компактный источник раскладки логотипа для мобильного варианта хедера.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Header-Logo-Compact @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `asset`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `asset`; render `figma-source-only`; visibility `always`
  - Fact `description-1`: `212×33px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Properties and variants

- Variant `product-cupis` — Figma node `1008:1686`; axes: `Product=CUPIS`
- Variant `product-card` — Figma node `1008:1687`; axes: `Product=Card`
- Variant `product-wallet` — Figma node `1008:1688`; axes: `Product=Wallet`

### Constraints and dependencies

- Constraint `compact-source-is-not-separate-export` — scope `mobile`; kind `asset-export`; severity `critical`; Description critical: Компактный мобильный источник используется только для раскладки и не создаёт отдельный файл письма.

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-header-logo-compact-4x
PURPOSE: Вспомогательный компактный источник раскладки логотипа для мобильного варианта хедера.
RENDER: ASSET

CRITICAL
- Компактный мобильный источник используется только для раскладки и не создаёт отдельный файл письма.
```

<!-- library: shared; component-id: asset-product-logo -->
## Asset/Product-Logo

### Identity and purpose

- CUPIS ID: `asset-product-logo`
- Status: `active`
- Library: `shared`
- Semantic role: `asset`
- Category: `product-logo`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1008:874` (`component-set`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:df4f25d0ac253d1fbe3dea7f8a8b91ba7ed14fbd200e2107d7eeecdb12475192`
- Purpose: Источник вариантов продуктового логотипа для сборки производных визуальных ассетов.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Product-Logo` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `asset`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `asset`; render `figma-source-only`; visibility `always`

### Properties and variants

- Variant `product-cupis` — Figma node `1008:871`; axes: `Product=CUPIS`
- Variant `product-card` — Figma node `1008:872`; axes: `Product=Card`
- Variant `product-wallet` — Figma node `1008:873`; axes: `Product=Wallet`

### Constraints and dependencies

- Constraint `nested-source-is-not-export-owner` — scope `all`; kind `asset-export`; severity `critical`; Description critical: Этот вложенный источник нельзя экспортировать отдельно, когда родительский компонент задаёт внешний составной asset owner.

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-product-logo
PURPOSE: Источник вариантов продуктового логотипа для сборки производных визуальных ассетов.
RENDER: ASSET

CRITICAL
- Этот вложенный источник нельзя экспортировать отдельно, когда родительский компонент задаёт внешний составной asset owner.
```

<!-- library: shared; component-id: email-template -->
## Email/Template

### Identity and purpose

- CUPIS ID: `email-template`
- Status: `active`
- Library: `shared`
- Semantic role: `template`
- Category: `template`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1102:8` (`component-set`)
- Source root: `1084:34055`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:acc896330ffe161f25f4bbc4e3e430aba2accd4d934045ad8e5af1ab516cddbd`
- Purpose: Корневая оболочка письма, которая задаёт состав и порядок верхнеуровневых компонентов для выбранного viewport.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Template` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `template`; render `presentation-table`; visibility `always`
  - `content` — role `content`; render `slot`; visibility `always`

### Mobile

- `root` — role `template`; render `presentation-table`; visibility `always`
  - `content` — role `content`; render `slot`; visibility `always`

### Properties and variants

- Variant `mobile` — Figma node `1102:6`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `1102:7`; axes: `Viewport=Desktop`
- Property `content` (`Content`) — `slot`; default `null`

### Constraints and dependencies

- Constraint `slot-does-not-create-visual-geometry` — scope `all`; kind `dependency`; severity `critical`; Description critical: Слот задаёт только состав и порядок верхнеуровневых компонентов и не создаёт собственные padding, gap, background или визуальные слои.

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: email-template
PURPOSE: Корневая оболочка письма, которая задаёт состав и порядок верхнеуровневых компонентов для выбранного viewport.
RENDER: HTML

CRITICAL
- Слот задаёт только состав и порядок верхнеуровневых компонентов и не создаёт собственные padding, gap, background или визуальные слои.
```

<!-- library: shared; component-id: icon-bank-card-2-line -->
## Icon/Bank-Card-2-Line

### Identity and purpose

- CUPIS ID: `icon-bank-card-2-line`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `bank-card-2-line`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1009:2505` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак банковской карты для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-bank-card-2-line
PURPOSE: Исходный векторный знак банковской карты для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-fingerprint-2-line -->
## Icon/Fingerprint-2-Line

### Identity and purpose

- CUPIS ID: `icon-fingerprint-2-line`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `fingerprint-2-line`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22370` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак отпечатка пальца для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-fingerprint-2-line
PURPOSE: Исходный векторный знак отпечатка пальца для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-gift-2-line -->
## Icon/Gift-2-Line

### Identity and purpose

- CUPIS ID: `icon-gift-2-line`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `gift-2-line`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#946:25576` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак подарка для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-gift-2-line
PURPOSE: Исходный векторный знак подарка для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-global-line -->
## Icon/Global-Line

### Identity and purpose

- CUPIS ID: `icon-global-line`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `global-line`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1009:2506` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак глобуса для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-global-line
PURPOSE: Исходный векторный знак глобуса для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-lock-password-fill -->
## Icon/Lock-Password-Fill

### Identity and purpose

- CUPIS ID: `icon-lock-password-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `lock-password-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22369` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак защиты пароля для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-lock-password-fill
PURPOSE: Исходный векторный знак защиты пароля для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-mail-fill -->
## Icon/Mail-Fill

### Identity and purpose

- CUPIS ID: `icon-mail-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `mail-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22372` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак почты для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-mail-fill
PURPOSE: Исходный векторный знак почты для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-mir-logo -->
## Icon/MIR-Logo

### Identity and purpose

- CUPIS ID: `icon-mir-logo`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `mir-logo`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#946:25485` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный логотип платёжной системы «Мир» для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-mir-logo
PURPOSE: Исходный векторный логотип платёжной системы «Мир» для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-receipt-fill -->
## Icon/Receipt-Fill

### Identity and purpose

- CUPIS ID: `icon-receipt-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `receipt-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22374` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак чека для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-receipt-fill
PURPOSE: Исходный векторный знак чека для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-shopping-basket-2-line -->
## Icon/Shopping-Basket-2-Line

### Identity and purpose

- CUPIS ID: `icon-shopping-basket-2-line`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `shopping-basket-2-line`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#946:25480` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак корзины покупок для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-shopping-basket-2-line
PURPOSE: Исходный векторный знак корзины покупок для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-smartphone-fill -->
## Icon/Smartphone-Fill

### Identity and purpose

- CUPIS ID: `icon-smartphone-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `smartphone-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22371` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак смартфона для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-smartphone-fill
PURPOSE: Исходный векторный знак смартфона для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-user-follow-fill -->
## Icon/User-Follow-Fill

### Identity and purpose

- CUPIS ID: `icon-user-follow-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `user-follow-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22375` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак добавления пользователя для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-user-follow-fill
PURPOSE: Исходный векторный знак добавления пользователя для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-user-forbid-fill -->
## Icon/User-Forbid-Fill

### Identity and purpose

- CUPIS ID: `icon-user-forbid-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `user-forbid-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22373` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак блокировки пользователя для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-user-forbid-fill
PURPOSE: Исходный векторный знак блокировки пользователя для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: shared; component-id: icon-user-unfollow-fill -->
## Icon/User-Unfollow-Fill

### Identity and purpose

- CUPIS ID: `icon-user-unfollow-fill`
- Status: `active`
- Library: `shared`
- Semantic role: `icon`
- Category: `user-unfollow-fill`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22376` (`component`)
- Source root: `539:38025`
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Исходный векторный знак удаления пользователя для вложенного использования в визуальных ассетах.
- Baseline: `undefined` → `undefined` (`undefined`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `figma-source-only`
- Mobile root: `root` — `figma-source-only`

### Desktop

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Mobile

- `root` — role `icon`; render `figma-source-only`; visibility `always`

### Output contract classification

- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: icon-user-unfollow-fill
PURPOSE: Исходный векторный знак удаления пользователя для вложенного использования в визуальных ассетах.
RENDER: ASSET
```

<!-- library: marketing; component-id: asset-card-image-2x -->
## Asset/Card-Image @2x

### Identity and purpose

- CUPIS ID: `asset-card-image-2x`
- Status: `active`
- Library: `marketing`
- Semantic role: `asset`
- Category: `card-image-2x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#911:3992` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:4ea96e98980233ade86e540914b44ef5069f6895c8061619545b6237c18aa854`
- Purpose: Составной растровый ассет карточки, включающий изображение и графические наложения.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Card-Image @2x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `card-image` — role `image`; render `direct-image`; visibility `always`; asset `card-image`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `@2x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `232×148px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `464×296px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `232:148`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `card-image` — role `image`; render `direct-image`; visibility `always`; asset `card-image`

### Properties and variants

- Variant `numbered` — Figma node `911:3991`; axes: `Style=Numbered`
- Variant `plain` — Figma node `911:3990`; axes: `Style=Plain`
- Direct Figma source: `911:3991`; `Style=Numbered`; reference frame 232×148px
- Direct Figma source: `911:3990`; `Style=Plain`; reference frame 232×148px

### Assets and interaction

- Asset contract: `card-image`
  - Owner layer: `Asset/Card-Image @2x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `jpeg-2x` — JPEG, `.jpg`, scale 2, suffix `@2x`, sRGB
  - Alpha: `none` — `no-alpha`
  - Clipping: `neutralize-presentation-only`
  - Export boundary: `node` `Asset/Card-Image @2x`
  - Pixel dimensions: 464×296px
  - Raw Figma Fill dimensions: 888×480px
  - Aspect ratio: 232:148
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `card-image` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `card-image` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-card-image-2x
PURPOSE: Составной растровый ассет карточки, включающий изображение и графические наложения.
RENDER: ASSET
```

<!-- library: marketing; component-id: asset-feature-icon-4x -->
## Asset/Feature-Icon @4x

### Identity and purpose

- CUPIS ID: `asset-feature-icon-4x`
- Status: `active`
- Library: `marketing`
- Semantic role: `asset`
- Category: `feature-icon-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#946:25769` (`component`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составной прозрачный графический ассет функциональной иконки.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Feature-Icon @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `direct-image`
- Mobile root: `root` — `direct-image`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `feature-icon`
  - Fact `reference-size`: `64×64px`; provenance: `figma-literal` at `946:25769`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `946:25769`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `946:25769`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:25769`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:25769`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:25769`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:25769`

### Mobile

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `feature-icon`
  - Fact `reference-size`: `64×64px`; provenance: `figma-literal` at `946:25769`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `946:25769`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `946:25769`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:25769`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:25769`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:25769`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:25769`

### Assets and interaction

- Asset contract: `feature-icon`
  - Owner layer: `Asset/Feature-Icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `Asset/Feature-Icon @4x`
  - Pixel dimensions: 256×256px
  - Aspect ratio: 64:64
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root` → `feature-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-feature-icon-4x
PURPOSE: Составной прозрачный графический ассет функциональной иконки.
RENDER: ASSET
```

<!-- library: marketing; component-id: badge-step-number -->
## Badge/Step-Number

### Identity and purpose

- CUPIS ID: `badge-step-number`
- Status: `active`
- Library: `marketing`
- Semantic role: `badge`
- Category: `step-number`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#18:2948` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:53d9db07d895b91700fb17155a254cdadf7aa9a0d02e9cf572db422f2df93647`
- Purpose: Живой HTML-бейдж с номером шага для пошаговых блоков.
- Baseline: `registry/email-component-descriptions-registry.md` → `Badge/Step-Number` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `badge`; render `presentation-table`; visibility `always`
  - `number` — role `step-number`; render `html-text`; visibility `always`

### Mobile

- `root` — role `badge`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `19px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `number` — role `step-number`; render `html-text`; visibility `always`

### Properties and variants

- Variant `mobile-neutral` — Figma node `18:2942`; axes: `Viewport=Mobile`, `Style=Neutral`
- Variant `mobile-accent` — Figma node `18:2947`; axes: `Viewport=Mobile`, `Style=Accent`
- Variant `desktop-accent` — Figma node `230:3849`; axes: `Viewport=Desktop`, `Style=Accent`
- Variant `desktop-neutral` — Figma node `230:3850`; axes: `Viewport=Desktop`, `Style=Neutral`
- Direct Figma source: `18:2942`; `Viewport=Mobile, Style=Neutral`; reference frame 56×20px
- Direct Figma source: `18:2947`; `Viewport=Mobile, Style=Accent`; reference frame 56×20px
- Direct Figma source: `230:3849`; `Viewport=Desktop, Style=Accent`; reference frame 62×22px
- Direct Figma source: `230:3850`; `Viewport=Desktop, Style=Neutral`; reference frame 62×22px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: badge-step-number
PURPOSE: Живой HTML-бейдж с номером шага для пошаговых блоков.
RENDER: HTML
```

<!-- library: marketing; component-id: banner-app-download -->
## Banner/App-Download

### Identity and purpose

- CUPIS ID: `banner-app-download`
- Status: `active`
- Library: `marketing`
- Semantic role: `banner`
- Category: `app-download`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:6569` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно из Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:aeb50018c4411ea2752ab4c99aab86f095b51454b33a38ff659b58d65637b978`
- Purpose: Промоблок приложения с логотипом, живым текстом и кнопками магазинов.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/App-Download` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `banner-top-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `card-border-radius`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `app-card-width`: `552px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `root-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `content-area-padding`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `text-qr` — role `text-qr`; render `presentation-table`; visibility `always`
      - Fact `text-qr-layout-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - Fact `text-qr-layout-axis`: `horizontal`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `header-row` — role `header-row`; render `presentation-table`; visibility `always`
        - Fact `header-row-layout-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `header-row-width`: `334px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `header-row-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `app-logo` — role `logo`; render `direct-image`; visibility `always`; asset `app-logo`
          - Fact `logo-display-dimensions`: `219×62px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `description` — role `description`; render `html-text`; visibility `always`
          - Fact `description-font-size`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `qr-code` — role `qr-code`; render `direct-image`; visibility `always`; asset `qr-code`
        - Fact `qr-display-dimensions`: `130×130px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `store-buttons` — role `store-buttons`; render `presentation-table`; visibility `always`
      - Fact `store-buttons-layout-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - Fact `store-buttons-layout-axis`: `horizontal`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `rustore-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `rustore-link-dimensions`: `116×56px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `rustore-link-border-radius`: `50px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `rustore-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `rustore-icon`
          - Fact `rustore-icon-display-dimensions`: `32×32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `rustore-text` — role `store-text`; render `html-text`; visibility `always`
      - `google-play-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `google-play-link-dimensions`: `116×56px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `google-play-link-border-radius`: `50px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `google-play-link-background`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `google-play-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `google-play-icon`
          - Fact `google-play-icon-display-dimensions`: `32×32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `google-play-text` — role `store-text`; render `html-text`; visibility `always`
      - `appgallery-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `appgallery-link-dimensions`: `116×56px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `appgallery-link-border-radius`: `50px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `appgallery-link-background`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `appgallery-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `appgallery-icon`
          - Fact `appgallery-icon-display-dimensions`: `32×32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `appgallery-text` — role `store-text`; render `html-text`; visibility `always`
      - `getapps-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `getapps-link-dimensions`: `116×56px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `getapps-link-border-radius`: `50px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `getapps-link-background`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `getapps-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `getapps-icon`
          - Fact `getapps-icon-display-dimensions`: `32×32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `getapps-text` — role `store-text`; render `html-text`; visibility `always`

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `banner-top-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `card-border-radius`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `store-grid-layout-forbidden`: `2×2`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `root-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `content-area-padding`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `app-logo` — role `logo`; render `direct-image`; visibility `always`; asset `app-logo`
      - Fact `logo-display-dimensions`: `163×46px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `description` — role `description`; render `html-text`; visibility `always`
      - Fact `description-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `store-buttons` — role `store-buttons`; render `presentation-table`; visibility `always`
      - Fact `store-buttons-layout-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - Fact `store-buttons-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `rustore-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `rustore-link-height`: `44px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `rustore-link-border-radius`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `rustore-icon-text-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `rustore-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `rustore-icon`
          - Fact `rustore-icon-display-dimensions`: `26×26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `rustore-text` — role `store-text`; render `html-text`; visibility `always`
          - Fact `rustore-text-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `google-play-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `google-play-link-height`: `44px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `google-play-link-border-radius`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `google-play-icon-text-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `google-play-link-background`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `google-play-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `google-play-icon`
          - Fact `google-play-icon-display-dimensions`: `26×26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `google-play-text` — role `store-text`; render `html-text`; visibility `always`
          - Fact `google-play-text-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `appgallery-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `appgallery-link-height`: `44px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `appgallery-link-border-radius`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `appgallery-icon-text-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `appgallery-link-background`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `appgallery-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `appgallery-icon`
          - Fact `appgallery-icon-display-dimensions`: `26×26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `appgallery-text` — role `store-text`; render `html-text`; visibility `always`
          - Fact `appgallery-text-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `getapps-link` — role `store-link`; render `html-link`; visibility `always`
        - Fact `getapps-link-height`: `44px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `getapps-link-border-radius`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `getapps-icon-text-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - Fact `getapps-link-background`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `getapps-icon` — role `store-icon`; render `direct-image`; visibility `always`; asset `getapps-icon`
          - Fact `getapps-icon-display-dimensions`: `26×26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
        - `getapps-text` — role `store-text`; render `html-text`; visibility `always`
          - Fact `getapps-text-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Properties and variants

- Variant `mobile` — Figma node `15:2586`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `260:1494`; axes: `Viewport=Desktop`
- Direct Figma source: `15:2586`; `Viewport=Mobile`; reference frame 328×378px
- Direct Figma source: `260:1494`; `Viewport=Desktop`; reference frame 600×298px

### Assets and interaction

- Asset contract: `app-logo`
  - Owner layer: `app-logo @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `source` — `preserve-source`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `app-logo @4x`
  - Pixel dimensions: 876×248px
  - Aspect ratio: 219:62
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `qr-code`
  - Owner layer: `qr-code @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `opaque` — `fully-opaque`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `qr-code @4x`
  - Pixel dimensions: 520×520px
  - Aspect ratio: 130:130
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `rustore-icon`
  - Owner layer: `rustore-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `rustore-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `google-play-icon`
  - Owner layer: `google-play-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `google-play-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `appgallery-icon`
  - Owner layer: `appgallery-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `appgallery-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `getapps-icon`
  - Owner layer: `getapps-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `getapps-icon @4x`
  - Pixel dimensions: 128×128px
  - Aspect ratio: 32:32
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0` → `app-logo` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/2/children/0`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/2/children/0/children/0` → `rustore-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/2/children/1`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/2/children/1/children/0` → `google-play-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/2/children/2`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/2/children/2/children/0` → `appgallery-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/2/children/3`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/2/children/3/children/0` → `getapps-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0/children/0` → `app-logo` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/1` → `qr-code` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/0/children/0` → `rustore-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1/children/1`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/1/children/0` → `google-play-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/2/children/0` → `appgallery-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1/children/3`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/3/children/0` → `getapps-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: banner-app-download
PURPOSE: Промоблок приложения с логотипом, живым текстом и кнопками магазинов.
RENDER: HYBRID
```

<!-- library: marketing; component-id: banner-hero -->
## Banner/Hero

### Identity and purpose

- CUPIS ID: `banner-hero`
- Status: `active`
- Library: `marketing`
- Semantic role: `banner`
- Category: `hero`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4460` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:adf95c6eaaf49c1b030ebe1a2a6cb3d3f043443b9ee158b40268bc1257182e48`
- Purpose: Главный промобаннер с изображением, живым текстом и необязательным основным CTA.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Hero` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - `hero-image` — role `image`; render `direct-image`; visibility `always`; asset `hero-image`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `body` — role `body`; render `html-text`; visibility property `show-body` (`Show Body`)
  - `cta` — role `cta`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-primary` (`Button/Primary`)

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `width-behavior`: `fluid-to-container`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `height-behavior`: `auto`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `fixed-height-forbidden`: `true`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `296:190`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `20px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `552×353px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `@2x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-12`: asset `hero-image`
  - `hero-image` — role `image`; render `direct-image`; visibility `always`; asset `hero-image`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `body` — role `body`; render `html-text`; visibility property `show-body` (`Show Body`)
  - `cta` — role `cta`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-primary` (`Button/Primary`)

### Properties and variants

- Variant `mobile` — Figma node `337:4359`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `230:3680`; axes: `Viewport=Desktop`
- Direct Figma source: `337:4359`; `Viewport=Mobile`; reference frame 328×410px
- Direct Figma source: `230:3680`; `Viewport=Desktop`; reference frame 600×636px
- Property `show-body` (`Show Body`) — `boolean`; default `true`
- Property `show-button` (`Show Button`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `hero-image`
  - Owner layer: `hero-image @2x`
  - Source viewport: `desktop`
  - Source mode: `image-fill`
  - Display mode: `direct-image`
  - Export profile: `jpeg-2x` — JPEG, `.jpg`, scale 2, suffix `@2x`, sRGB
  - Alpha: `none` — `no-alpha`
  - Clipping: `preserve-artwork`
  - Export boundary: `fill` `hero-image @2x`
  - Pixel dimensions: 1104×706px
  - Raw Figma Fill dimensions: 984×696px
  - Aspect ratio: 552:353
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `hero-image` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `hero-image` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/3/component_id` → component `button-primary` (`Button/Primary`)
- Dependency: `/contracts/desktop/root/children/3/component_id` → component `button-primary` (`Button/Primary`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: banner-hero
PURPOSE: Главный промобаннер с изображением, живым текстом и необязательным основным CTA.
RENDER: HYBRID
```

<!-- library: marketing; component-id: banner-inline -->
## Banner/Inline

### Identity and purpose

- CUPIS ID: `banner-inline`
- Status: `active`
- Library: `marketing`
- Semantic role: `banner`
- Category: `inline`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:5040` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:6b60ab0bafd0817f0afb5223b652c20100f23a0eb388d4a2ffcf2f74a03a1248`
- Purpose: Компактный информационный баннер с живым текстом и ссылкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Inline` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`
  - `text` — role `text`; render `html-text`; visibility `always`
  - `chevron-icon` — role `icon`; render `direct-image`; visibility `always`; asset `chevron-icon`

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `42×42px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `24×24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `48×48px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: asset `chevron-icon`
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`
  - `text` — role `text`; render `html-text`; visibility `always`
  - `chevron-icon` — role `icon`; render `direct-image`; visibility `always`; asset `chevron-icon`

### Properties and variants

- Variant `mobile` — Figma node `13:353`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `260:591`; axes: `Viewport=Desktop`
- Direct Figma source: `13:353`; `Viewport=Mobile`; reference frame 328×108px
- Direct Figma source: `260:591`; `Viewport=Desktop`; reference frame 600×122px

### Assets and interaction

- Asset contract: `feature-icon`
  - Owner layer: `feature-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `feature-icon @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `chevron-icon`
  - Owner layer: `chevron-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `chevron-icon @4x`
  - Pixel dimensions: 96×96px
  - Aspect ratio: 24:24
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `feature-icon` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/2` → `chevron-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/2` → `chevron-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: banner-inline
PURPOSE: Компактный информационный баннер с живым текстом и ссылкой.
RENDER: HYBRID
```

<!-- library: marketing; component-id: banner-secondary -->
## Banner/Secondary

### Identity and purpose

- CUPIS ID: `banner-secondary`
- Status: `active`
- Library: `marketing`
- Semantic role: `banner`
- Category: `secondary`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4870` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:48d9b7a570ffefeeeac38e01469297b1d356d364e5b36b06a713a2a47f4edbed`
- Purpose: Вторичный промобаннер с текстовой и визуальной областями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Secondary` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `banner-top-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `banner-inner-width`: `552px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `root-layout-axis`: `horizontal`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `content-area-padding`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-width`: `300px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `text-content` — role `text-content`; render `presentation-table`; visibility `always`
      - Fact `text-content-layout-gap`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - Fact `text-content-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - Fact `content-inner-width`: `236px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `heading-font-size`: `20px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `body` — role `body`; render `html-text`; visibility property `show-body` (`Show Body`)
        - Fact `body-font-size`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `secondary-image` — role `image`; render `background-image`; visibility `always`; asset `secondary-image`
    - Fact `image-area-width`: `252px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `banner-top-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `root-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `secondary-image` — role `image`; render `direct-image`; visibility `always`; asset `secondary-image`
    - Fact `width-behavior`: `fluid-to-container`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `height-behavior`: `auto`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `fixed-height-forbidden`: `true`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `content-area-padding`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `content-area-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `text-content` — role `text-content`; render `presentation-table`; visibility `always`
      - Fact `text-content-layout-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - Fact `text-content-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `heading-font-size`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
      - `body` — role `body`; render `html-text`; visibility property `show-body` (`Show Body`)
        - Fact `body-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)

### Properties and variants

- Variant `mobile` — Figma node `11:1218`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `337:4844`; axes: `Viewport=Desktop`
- Direct Figma source: `11:1218`; `Viewport=Mobile`; reference frame 328×400px
- Direct Figma source: `337:4844`; `Viewport=Desktop`; reference frame 600×262px
- Property `show-body` (`Show Body`) — `boolean`; default `true`
- Property `show-button` (`Show Button`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `secondary-image`
  - Owner layer: `secondary-image @2x`
  - Source viewport: `desktop`
  - Source mode: `image-fill`
  - Display mode: `fill-image`
  - Export profile: `jpeg-2x` — JPEG, `.jpg`, scale 2, suffix `@2x`, sRGB
  - Alpha: `none` — `no-alpha`
  - Clipping: `preserve-artwork`
  - Export boundary: `fill` `secondary-image @2x`
  - Pixel dimensions: 592×376px
  - Raw Figma Fill dimensions: 984×696px
  - Aspect ratio: 296:188
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `secondary-image` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/1` → `secondary-image` as `background-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/children/1/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/0/children/1/component_id` → component `button-secondary` (`Button/Secondary`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: banner-secondary
PURPOSE: Вторичный промобаннер с текстовой и визуальной областями.
RENDER: HYBRID
```

<!-- library: marketing; component-id: block-bullet-list -->
## Block/Bullet-List

### Identity and purpose

- CUPIS ID: `block-bullet-list`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `bullet-list`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4898` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:bf0c0c00cf94fdfb6a41a869fe60701489dafb252f2cd01515ef5e5b5aa39635`
- Purpose: Контентный блок с заголовком, маркированным списком и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Bullet-List` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×761px`; provenance: `figma-literal` at `234:607`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `234:607`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `234:607`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `234:607`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `234:607`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:607`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `234:607`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `234:607`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:607`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:607`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:607`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `234:607`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:607`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×737px`; provenance: `figma-literal` at `234:543`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `234:543`
    - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `234:543`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `234:543`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `234:543`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `234:543`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `234:543`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `234:543`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:543`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:543`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:543`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:543`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `234:543`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `234:543`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `488×62px`; provenance: `figma-literal` at `234:544`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `234:544`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `234:544`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `234:544`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `234:544`
      - Fact `font-size`: `26px`; provenance: `figma-literal` at `234:544`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `234:544`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `234:544`
      - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `234:544`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `234:544`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `234:544`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `234:544`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `234:544`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `234:544`
      - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `234:544`
    - `root-content-area-bullets` — role `bullets`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×375px`; provenance: `figma-literal` at `234:545`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `234:545`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `234:545`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `234:545`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:545`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:545`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:545`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `234:545`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:545`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:545`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:545`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:545`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:545`
      - `root-content-area-bullets-bullet-01` — role `bullet-01`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
        - Fact `reference-size`: `488×109px`; provenance: `figma-literal` at `234:587`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `234:587`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `234:587`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `234:587`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:587`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:587`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:587`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `234:587`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:587`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:587`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:587`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:587`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:587`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `234:587`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `234:587`
      - `root-content-area-bullets-bullet-02` — role `bullet-02`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
        - Fact `reference-size`: `488×109px`; provenance: `figma-literal` at `234:600`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `234:600`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `234:600`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `234:600`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:600`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:600`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:600`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `234:600`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:600`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:600`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:600`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:600`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:600`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `234:600`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `234:600`
      - `root-content-area-bullets-bullet-03` — role `bullet-03`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
        - Fact `reference-size`: `488×109px`; provenance: `figma-literal` at `234:593`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `234:593`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `234:593`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `234:593`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:593`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:593`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:593`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `234:593`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:593`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:593`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:593`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:593`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:593`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `234:593`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `234:593`
    - `root-content-area-alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
      - Fact `reference-size`: `488×74px`; provenance: `figma-literal` at `1024:19259`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19259`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19259`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19259`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19259`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19259`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19259`
      - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19259`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19259`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19259`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19259`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19259`
      - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19259`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19259`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1024:19259`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `230×46px`; provenance: `figma-literal` at `337:4886`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `337:4886`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `337:4886`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `337:4886`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `337:4886`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `337:4886`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `337:4886`
      - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `337:4886`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `337:4886`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `337:4886`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `337:4886`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `337:4886`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `337:4886`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `337:4886`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `337:4886`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×20px`; provenance: `figma-literal` at `911:20957`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20957`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20957`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20957`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20957`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `911:20957`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20957`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20957`
      - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `911:20957`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20957`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20957`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20957`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20957`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20957`
      - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `911:20957`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×645px`; provenance: `figma-literal` at `222:786`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `222:786`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `222:786`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `222:786`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `222:786`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `222:786`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `222:786`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `222:786`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `222:786`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `222:786`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `222:786`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `222:786`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `222:786`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×629px`; provenance: `figma-literal` at `222:750`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `222:750`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `222:750`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `222:750`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `222:750`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `222:750`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `222:750`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `222:750`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `222:750`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `222:750`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `222:750`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `222:750`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `222:750`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `222:750`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `222:751`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `222:751`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `222:751`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `222:751`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `222:751`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `222:751`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `222:751`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `222:751`
      - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `222:751`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `222:751`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `222:751`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `222:751`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `222:751`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `222:751`
      - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `222:751`
    - `root-content-area-bullets` — role `bullets`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×350px`; provenance: `figma-literal` at `222:752`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `222:752`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `222:752`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `222:752`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `222:752`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `222:752`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `222:752`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `222:752`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `222:752`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `222:752`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `222:752`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `222:752`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `222:752`
      - `root-content-area-bullets-bullet-01` — role `bullet-01`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
        - Fact `reference-size`: `252×106px`; provenance: `figma-literal` at `230:3871`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `230:3871`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `230:3871`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3871`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3871`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3871`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3871`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3871`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3871`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3871`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3871`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3871`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3871`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `230:3871`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `230:3871`
      - `root-content-area-bullets-bullet-02` — role `bullet-02`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
        - Fact `reference-size`: `252×106px`; provenance: `figma-literal` at `230:3883`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `230:3883`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `230:3883`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3883`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3883`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3883`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3883`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3883`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3883`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3883`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3883`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3883`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3883`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `230:3883`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `230:3883`
      - `root-content-area-bullets-bullet-03` — role `bullet-03`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
        - Fact `reference-size`: `252×106px`; provenance: `figma-literal` at `230:3896`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `230:3896`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `230:3896`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3896`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3896`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3896`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3896`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3896`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3896`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3896`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3896`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3896`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3896`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `230:3896`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `230:3896`
    - `root-content-area-alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
      - Fact `reference-size`: `252×66px`; provenance: `figma-literal` at `1024:19267`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19267`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `1024:19267`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19267`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19267`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19267`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19267`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19267`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19267`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19267`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19267`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19267`
      - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19267`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19267`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1024:19267`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `337:4892`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `337:4892`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `337:4892`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `337:4892`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `337:4892`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `337:4892`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `337:4892`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `337:4892`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `337:4892`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `337:4892`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `337:4892`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `337:4892`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `337:4892`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `337:4892`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `337:4892`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `911:20958`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20958`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20958`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20958`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20958`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `911:20958`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20958`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20958`
      - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `911:20958`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20958`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20958`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20958`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20958`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20958`
      - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `911:20958`

### Properties and variants

- Variant `mobile` — Figma node `222:786`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `234:607`; axes: `Viewport=Desktop`
- Direct Figma source: `222:786`; `Viewport=Mobile`; reference frame 328×645px
- Direct Figma source: `234:607`; `Viewport=Desktop`; reference frame 600×761px
- Property `show-alert` (`Show Alert`) — `boolean`; default `true`
- Property `show-button` (`Show Button`) — `boolean`; default `true`
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/1/children/0/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/mobile/root/children/0/children/1/children/1/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/mobile/root/children/0/children/1/children/2/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/mobile/root/children/0/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/mobile/root/children/0/children/3/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/0/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/1/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/2/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/desktop/root/children/0/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/desktop/root/children/0/children/3/component_id` → component `button-secondary` (`Button/Secondary`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-bullet-list
PURPOSE: Контентный блок с заголовком, маркированным списком и необязательной подписью.
RENDER: HTML
```

<!-- library: marketing; component-id: block-cards-images -->
## Block/Cards-Images

### Identity and purpose

- CUPIS ID: `block-cards-images`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `cards-images`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#326:5806` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно из Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:1e99c3cea4bfd175c368c3a843dc694a1c945a2c9848af1666811119e49da1bc`
- Purpose: Контентный блок с заголовком, вертикальным списком карточек с изображениями и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Cards-Images` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×1242px`; provenance: `figma-literal` at `398:7570`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7570`
  - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `398:7570`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `398:7570`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `398:7570`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7570`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `398:7570`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `398:7570`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7570`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7570`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7570`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7570`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7570`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×1218px`; provenance: `figma-literal` at `398:7571`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7571`
    - Fact `layout-gap`: `32px`; provenance: `figma-literal` at `398:7571`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `398:7571`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `398:7571`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `398:7571`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `398:7571`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7571`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7571`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7571`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7571`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7571`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `398:7571`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `398:7571`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `488×62px`; provenance: `figma-literal` at `398:7572`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `398:7572`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `398:7572`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `398:7572`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `398:7572`
      - Fact `font-size`: `26px`; provenance: `figma-literal` at `398:7572`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `398:7572`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `398:7572`
      - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `398:7572`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `398:7572`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `398:7572`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `398:7572`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `398:7572`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `398:7572`
      - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `398:7572`
    - `root-content-area-cards` — role `cards`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×1008px`; provenance: `figma-literal` at `398:7573`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7573`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `398:7573`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7573`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7573`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7573`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7573`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7573`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7573`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7573`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7573`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7573`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7573`
      - `root-content-area-cards-card-01` — role `card-01`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
        - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `911:4137`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `911:4137`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `911:4137`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4137`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4137`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4137`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4137`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4137`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4137`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4137`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4137`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4137`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4137`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `911:4137`
      - `root-content-area-cards-card-02` — role `card-02`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
        - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `911:4157`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `911:4157`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `911:4157`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4157`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4157`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4157`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4157`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4157`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4157`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4157`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4157`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4157`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4157`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `911:4157`
      - `root-content-area-cards-card-03` — role `card-03`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
        - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `1015:18296`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18296`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18296`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18296`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18296`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18296`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18296`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18296`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18296`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18296`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18296`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18296`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18296`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18296`
      - `root-content-area-cards-card-04` — role `card-04`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
        - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `1015:18309`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18309`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18309`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18309`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18309`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18309`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18309`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18309`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18309`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18309`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18309`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18309`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18309`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18309`
      - `root-content-area-cards-card-05` — role `card-05`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
        - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `1015:18322`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18322`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18322`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18322`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18322`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18322`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18322`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18322`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18322`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18322`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18322`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18322`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18322`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18322`
      - `root-content-area-cards-card-06` — role `card-06`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
        - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `1015:18335`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18335`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18335`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18335`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18335`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18335`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18335`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18335`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18335`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18335`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18335`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18335`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18335`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18335`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×20px`; provenance: `figma-literal` at `911:20880`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20880`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20880`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20880`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20880`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `911:20880`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20880`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20880`
      - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `911:20880`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20880`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20880`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20880`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20880`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20880`
      - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `911:20880`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×2021px`; provenance: `figma-literal` at `398:7598`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7598`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7598`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `398:7598`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `398:7598`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7598`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `398:7598`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `398:7598`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7598`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7598`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7598`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7598`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7598`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×2005px`; provenance: `figma-literal` at `398:7599`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7599`
    - Fact `layout-gap`: `22px`; provenance: `figma-literal` at `398:7599`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `398:7599`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `398:7599`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `398:7599`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `398:7599`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7599`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7599`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7599`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7599`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7599`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `398:7599`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `398:7599`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `398:7600`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `398:7600`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `398:7600`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `398:7600`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `398:7600`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `398:7600`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `398:7600`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `398:7600`
      - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `398:7600`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `398:7600`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `398:7600`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `398:7600`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `398:7600`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `398:7600`
      - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `398:7600`
    - `root-content-area-card-01` — role `card-01`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
      - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `911:4178`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `911:4178`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `911:4178`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4178`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4178`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4178`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4178`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4178`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4178`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4178`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4178`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4178`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4178`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `911:4178`
    - `root-content-area-card-02` — role `card-02`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
      - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `911:4188`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `911:4188`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `911:4188`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4188`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4188`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4188`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4188`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4188`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4188`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4188`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4188`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4188`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4188`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `911:4188`
    - `root-content-area-card-03` — role `card-03`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
      - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `1015:18352`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `1015:18352`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1015:18352`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18352`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18352`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18352`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18352`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18352`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18352`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18352`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18352`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18352`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18352`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1015:18352`
    - `root-content-area-card-04` — role `card-04`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
      - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `1015:18363`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `1015:18363`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1015:18363`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18363`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18363`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18363`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18363`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18363`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18363`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18363`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18363`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18363`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18363`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1015:18363`
    - `root-content-area-card-05` — role `card-05`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
      - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `1015:18374`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `1015:18374`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1015:18374`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18374`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18374`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18374`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18374`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18374`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18374`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18374`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18374`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18374`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18374`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1015:18374`
    - `root-content-area-card-06` — role `card-06`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
      - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `1015:18385`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `1015:18385`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1015:18385`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18385`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18385`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18385`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18385`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18385`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18385`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18385`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1015:18385`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18385`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18385`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1015:18385`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `911:20877`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20877`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20877`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20877`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20877`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `911:20877`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20877`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20877`
      - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `911:20877`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20877`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20877`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20877`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20877`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20877`
      - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `911:20877`

### Properties and variants

- Variant `desktop` — Figma node `398:7570`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `398:7598`; axes: `Viewport=Mobile`
- Direct Figma source: `398:7570`; `Viewport=Desktop`; reference frame 600×1242px
- Direct Figma source: `398:7598`; `Viewport=Mobile`; reference frame 328×2021px
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/1/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/mobile/root/children/0/children/2/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/mobile/root/children/0/children/3/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/mobile/root/children/0/children/4/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/mobile/root/children/0/children/5/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/mobile/root/children/0/children/6/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/0/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/1/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/2/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/3/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/4/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/5/component_id` → component `card-image` (`Card/Image`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-cards-images
PURPOSE: Контентный блок с заголовком, вертикальным списком карточек с изображениями и необязательной подписью.
RENDER: HTML
```

<!-- library: marketing; component-id: block-content -->
## Block/Content

### Identity and purpose

- CUPIS ID: `block-content`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `content`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4766` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:8df9797f5fe6579a653ed86f9d4e28a35dbf0be89861ae0f1bd683eb8ae86c19`
- Purpose: Универсальный контентный блок с заголовком, текстом и управляемыми дополнительными элементами.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Content` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×667px`; provenance: `figma-literal` at `230:3770`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3770`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `230:3770`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `230:3770`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `230:3770`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3770`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `230:3770`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `230:3770`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3770`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3770`
  - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `230:3770`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `230:3770`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3770`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×643px`; provenance: `figma-literal` at `230:3756`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3756`
    - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `230:3756`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `230:3756`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `230:3756`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `230:3756`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `230:3756`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3756`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3756`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3756`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3756`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3756`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `230:3756`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `230:3756`
    - `root-content-area-text-content` — role `text-content`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×247px`; provenance: `figma-literal` at `230:3757`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3757`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `230:3757`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3757`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3757`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3757`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3757`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3757`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3757`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3757`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3757`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3757`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3757`
      - `root-content-area-text-content-heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×62px`; provenance: `figma-literal` at `230:3758`
        - Fact `text-color`: `#000000`; provenance: `figma-literal` at `230:3758`
        - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `230:3758`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `230:3758`
        - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `230:3758`
        - Fact `font-size`: `26px`; provenance: `figma-literal` at `230:3758`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `230:3758`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `230:3758`
        - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `230:3758`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `230:3758`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `230:3758`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `230:3758`
        - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `230:3758`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `230:3758`
        - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `230:3758`
      - `root-content-area-text-content-body-01` — role `body-01`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `230:3759`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `230:3759`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `230:3759`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `230:3759`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `230:3759`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `230:3759`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `230:3759`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `230:3759`
        - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `230:3759`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `230:3759`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `230:3759`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `230:3759`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `230:3759`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `230:3759`
        - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `230:3759`
      - `root-content-area-text-content-body-02` — role `body-02`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `394:9140`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9140`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9140`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9140`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9140`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `394:9140`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9140`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9140`
        - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `394:9140`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9140`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9140`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9140`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9140`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9140`
        - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `394:9140`
      - `root-content-area-text-content-body-03` — role `body-03`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `394:9148`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9148`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9148`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9148`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9148`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `394:9148`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9148`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9148`
        - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `394:9148`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9148`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9148`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9148`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9148`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9148`
        - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `394:9148`
      - `root-content-area-text-content-body-04` — role `body-04`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `394:9156`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9156`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9156`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9156`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9156`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `394:9156`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9156`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9156`
        - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `394:9156`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9156`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9156`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9156`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9156`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9156`
        - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `394:9156`
      - `root-content-area-text-content-body-05` — role `body-05`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `394:9164`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9164`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9164`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9164`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9164`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `394:9164`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9164`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9164`
        - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `394:9164`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9164`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9164`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9164`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9164`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9164`
        - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `394:9164`
    - `root-content-area-notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
      - Fact `reference-size`: `488×96px`; provenance: `figma-literal` at `1024:19286`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19286`
      - Fact `layout-gap`: `20px`; provenance: `figma-literal` at `1024:19286`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19286`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19286`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19286`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19286`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19286`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19286`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19286`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19286`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19286`
      - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19286`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19286`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1024:19286`
    - `root-content-area-alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
      - Fact `reference-size`: `488×74px`; provenance: `figma-literal` at `1024:19243`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19243`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19243`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19243`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19243`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19243`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19243`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19243`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19243`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19243`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19243`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19243`
      - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19243`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19243`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1024:19243`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `230×46px`; provenance: `figma-literal` at `337:4756`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `337:4756`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `337:4756`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `337:4756`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `337:4756`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `337:4756`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `337:4756`
      - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `337:4756`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `337:4756`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `337:4756`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `337:4756`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `337:4756`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `337:4756`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `337:4756`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `337:4756`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×20px`; provenance: `figma-literal` at `911:20952`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20952`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20952`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20952`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20952`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `911:20952`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20952`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20952`
      - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `911:20952`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20952`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20952`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20952`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20952`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20952`
      - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `911:20952`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×635px`; provenance: `figma-literal` at `11:861`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `11:861`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `11:861`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `11:861`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `11:861`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `11:861`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `11:861`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `11:861`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `11:861`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `11:861`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `11:861`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `11:861`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `11:861`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×619px`; provenance: `figma-literal` at `11:773`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `11:773`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `11:773`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `11:773`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `11:773`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `11:773`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `11:773`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `11:773`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `11:773`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `11:773`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `11:773`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `11:773`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `11:773`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `11:773`
    - `root-content-area-text-content` — role `text-content`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×284px`; provenance: `figma-literal` at `11:774`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `11:774`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `11:774`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `11:774`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `11:774`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `11:774`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `11:774`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `11:774`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `11:774`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `11:774`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `11:774`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `11:774`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `11:774`
      - `root-content-area-text-content-heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `11:775`
        - Fact `text-color`: `#000000`; provenance: `figma-literal` at `11:775`
        - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `11:775`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `11:775`
        - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `11:775`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `11:775`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `11:775`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `11:775`
        - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `11:775`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `11:775`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `11:775`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `11:775`
        - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `11:775`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `11:775`
        - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `11:775`
      - `root-content-area-text-content-body-01` — role `body-01`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `11:776`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `11:776`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `11:776`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `11:776`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `11:776`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `11:776`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `11:776`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `11:776`
        - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `11:776`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `11:776`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `11:776`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `11:776`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `11:776`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `11:776`
        - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `11:776`
      - `root-content-area-text-content-body-02` — role `body-02`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `394:9112`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9112`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9112`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9112`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9112`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `394:9112`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9112`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9112`
        - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `394:9112`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9112`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9112`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9112`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9112`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9112`
        - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `394:9112`
      - `root-content-area-text-content-body-03` — role `body-03`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `394:9119`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9119`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9119`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9119`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9119`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `394:9119`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9119`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9119`
        - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `394:9119`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9119`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9119`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9119`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9119`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9119`
        - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `394:9119`
      - `root-content-area-text-content-body-04` — role `body-04`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `394:9126`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9126`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9126`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9126`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9126`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `394:9126`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9126`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9126`
        - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `394:9126`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9126`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9126`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9126`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9126`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9126`
        - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `394:9126`
      - `root-content-area-text-content-body-05` — role `body-05`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `394:9133`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `394:9133`
        - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `394:9133`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `394:9133`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `394:9133`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `394:9133`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `394:9133`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `394:9133`
        - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `394:9133`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `394:9133`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `394:9133`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `394:9133`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `394:9133`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `394:9133`
        - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `394:9133`
    - `root-content-area-notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
      - Fact `reference-size`: `252×100px`; provenance: `figma-literal` at `1024:19304`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19304`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19304`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19304`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19304`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19304`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19304`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19304`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19304`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19304`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19304`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19304`
      - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19304`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19304`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1024:19304`
    - `root-content-area-alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
      - Fact `reference-size`: `252×66px`; provenance: `figma-literal` at `1024:19251`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19251`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `1024:19251`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19251`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19251`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19251`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19251`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19251`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19251`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19251`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19251`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19251`
      - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19251`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19251`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1024:19251`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `337:4714`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `337:4714`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `337:4714`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `337:4714`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `337:4714`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `337:4714`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `337:4714`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `337:4714`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `337:4714`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `337:4714`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `337:4714`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `337:4714`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `337:4714`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `337:4714`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `337:4714`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `911:20955`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20955`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20955`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20955`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20955`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `911:20955`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20955`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20955`
      - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `911:20955`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20955`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20955`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20955`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20955`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20955`
      - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `911:20955`

### Properties and variants

- Variant `mobile` — Figma node `11:861`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `230:3770`; axes: `Viewport=Desktop`
- Direct Figma source: `11:861`; `Viewport=Mobile`; reference frame 328×635px
- Direct Figma source: `230:3770`; `Viewport=Desktop`; reference frame 600×667px
- Property `show-button` (`Show Button`) — `boolean`; default `true`
- Property `show-notification` (`Show Notification`) — `boolean`; default `true`
- Property `show-alert` (`Show Alert`) — `boolean`; default `true`
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/1/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/mobile/root/children/0/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/mobile/root/children/0/children/3/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/0/children/1/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/desktop/root/children/0/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/desktop/root/children/0/children/3/component_id` → component `button-secondary` (`Button/Secondary`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-content
PURPOSE: Универсальный контентный блок с заголовком, текстом и управляемыми дополнительными элементами.
RENDER: HTML
```

<!-- library: marketing; component-id: block-icon-cards -->
## Block/Icon-Cards

### Identity and purpose

- CUPIS ID: `block-icon-cards`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `icon-cards`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#326:6342` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно из Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:c63c3dc20a045beeaba79ba062390ade2ee8608a623dc74a12efde6266651e92`
- Purpose: Контентный блок с заголовком, вертикальным списком карточек с иконками и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Icon-Cards` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×1182px`; provenance: `figma-literal` at `398:7759`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7759`
  - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `398:7759`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `398:7759`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `398:7759`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7759`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `398:7759`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `398:7759`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7759`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7759`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7759`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7759`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7759`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×1158px`; provenance: `figma-literal` at `398:7760`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7760`
    - Fact `layout-gap`: `32px`; provenance: `figma-literal` at `398:7760`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `398:7760`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `398:7760`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `398:7760`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `398:7760`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7760`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7760`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7760`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7760`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7760`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `398:7760`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `398:7760`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `488×62px`; provenance: `figma-literal` at `398:7761`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `398:7761`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `398:7761`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `398:7761`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `398:7761`
      - Fact `font-size`: `26px`; provenance: `figma-literal` at `398:7761`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `398:7761`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `398:7761`
      - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `398:7761`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `398:7761`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `398:7761`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `398:7761`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `398:7761`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `398:7761`
      - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `398:7761`
    - `root-content-area-cards` — role `cards`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×948px`; provenance: `figma-literal` at `398:7762`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7762`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `398:7762`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7762`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7762`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7762`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7762`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7762`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7762`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7762`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7762`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7762`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7762`
      - `root-content-area-cards-card-01` — role `card-01`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
        - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `398:7763`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `398:7763`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `398:7763`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7763`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7763`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7763`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7763`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7763`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7763`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7763`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `398:7763`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7763`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7763`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7763`
        - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7763`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `398:7763`
      - `root-content-area-cards-card-02` — role `card-02`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
        - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `398:7764`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `398:7764`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `398:7764`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7764`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7764`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7764`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7764`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7764`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7764`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7764`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `398:7764`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7764`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7764`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7764`
        - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7764`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `398:7764`
      - `root-content-area-cards-card-03` — role `card-03`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
        - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `1015:18859`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18859`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18859`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18859`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18859`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18859`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18859`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18859`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18859`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18859`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `1015:18859`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18859`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18859`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `1015:18859`
        - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `1015:18859`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18859`
      - `root-content-area-cards-card-04` — role `card-04`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
        - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `1015:18869`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18869`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18869`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18869`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18869`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18869`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18869`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18869`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18869`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18869`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `1015:18869`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18869`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18869`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `1015:18869`
        - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `1015:18869`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18869`
      - `root-content-area-cards-card-05` — role `card-05`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
        - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `1015:18879`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18879`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18879`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18879`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18879`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18879`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18879`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18879`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18879`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18879`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `1015:18879`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18879`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18879`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `1015:18879`
        - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `1015:18879`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18879`
      - `root-content-area-cards-card-06` — role `card-06`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
        - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `1015:18899`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1015:18899`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `1015:18899`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `1015:18899`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `1015:18899`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `1015:18899`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `1015:18899`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1015:18899`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1015:18899`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1015:18899`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `1015:18899`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1015:18899`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18899`
        - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `1015:18899`
        - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `1015:18899`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1015:18899`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×20px`; provenance: `figma-literal` at `911:4006`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:4006`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:4006`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:4006`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:4006`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `911:4006`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:4006`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:4006`
      - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `911:4006`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:4006`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:4006`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:4006`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:4006`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:4006`
      - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `911:4006`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×1367px`; provenance: `figma-literal` at `398:7953`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7953`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7953`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `398:7953`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `398:7953`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7953`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `398:7953`
  - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `398:7953`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7953`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7953`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7953`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7953`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7953`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×1351px`; provenance: `figma-literal` at `398:7954`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7954`
    - Fact `layout-gap`: `22px`; provenance: `figma-literal` at `398:7954`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `398:7954`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `398:7954`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `398:7954`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `398:7954`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7954`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7954`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7954`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7954`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `398:7954`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `398:7954`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `398:7954`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `398:7955`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `398:7955`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `398:7955`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `398:7955`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `398:7955`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `398:7955`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `398:7955`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `398:7955`
      - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `398:7955`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `398:7955`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `398:7955`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `398:7955`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `398:7955`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `398:7955`
      - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `398:7955`
    - `root-content-area-card-01` — role `card-01`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
      - Fact `reference-size`: `252×182px`; provenance: `figma-literal` at `398:7956`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7956`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7956`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7956`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7956`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7956`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7956`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7956`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7956`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7956`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7956`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7956`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7956`
      - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7956`
      - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7956`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `398:7956`
    - `root-content-area-card-02` — role `card-02`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
      - Fact `reference-size`: `252×182px`; provenance: `figma-literal` at `398:7957`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7957`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7957`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7957`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7957`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7957`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7957`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7957`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7957`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7957`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7957`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7957`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7957`
      - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7957`
      - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7957`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `398:7957`
    - `root-content-area-card-03` — role `card-03`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
      - Fact `reference-size`: `252×182px`; provenance: `figma-literal` at `398:7958`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7958`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7958`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7958`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7958`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7958`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7958`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7958`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7958`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7958`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7958`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7958`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7958`
      - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7958`
      - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7958`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `398:7958`
    - `root-content-area-card-04` — role `card-04`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
      - Fact `reference-size`: `252×182px`; provenance: `figma-literal` at `398:7959`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7959`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7959`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7959`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7959`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7959`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7959`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7959`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7959`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7959`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7959`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7959`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7959`
      - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7959`
      - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7959`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `398:7959`
    - `root-content-area-card-05` — role `card-05`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
      - Fact `reference-size`: `252×182px`; provenance: `figma-literal` at `398:7988`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7988`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7988`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7988`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7988`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7988`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7988`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7988`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7988`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7988`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7988`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7988`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7988`
      - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7988`
      - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7988`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `398:7988`
    - `root-content-area-card-06` — role `card-06`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
      - Fact `reference-size`: `252×182px`; provenance: `figma-literal` at `398:7996`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `398:7996`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `398:7996`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `398:7996`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `398:7996`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `398:7996`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `398:7996`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `398:7996`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `398:7996`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `398:7996`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `398:7996`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `398:7996`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `398:7996`
      - Fact `instance-show-link`: `true`; provenance: `figma-literal` at `398:7996`
      - Fact `instance-show-description`: `true`; provenance: `figma-literal` at `398:7996`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `398:7996`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `911:4073`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:4073`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:4073`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:4073`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:4073`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `911:4073`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:4073`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:4073`
      - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `911:4073`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:4073`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:4073`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:4073`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:4073`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:4073`
      - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `911:4073`

### Properties and variants

- Variant `desktop` — Figma node `398:7759`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `398:7953`; axes: `Viewport=Mobile`
- Direct Figma source: `398:7759`; `Viewport=Desktop`; reference frame 600×1182px
- Direct Figma source: `398:7953`; `Viewport=Mobile`; reference frame 328×1367px
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/1/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/mobile/root/children/0/children/2/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/mobile/root/children/0/children/3/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/mobile/root/children/0/children/4/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/mobile/root/children/0/children/5/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/mobile/root/children/0/children/6/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/0/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/1/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/2/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/3/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/4/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/5/component_id` → component `card-icon` (`Card/Icon`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-icon-cards
PURPOSE: Контентный блок с заголовком, вертикальным списком карточек с иконками и необязательной подписью.
RENDER: HTML
```

<!-- library: marketing; component-id: block-icon-list -->
## Block/Icon-List

### Identity and purpose

- CUPIS ID: `block-icon-list`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `icon-list`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#946:26516` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно из Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:758ae01e42519336077861f93e6c60cd8cfaec0784c8b97bc0d2017ea295f547`
- Purpose: Контентный блок со списком строк, каждая из которых использует графическую иконку и живой текст.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Icon-List` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×768px`; provenance: `figma-literal` at `946:26515`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26515`
  - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26515`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `946:26515`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `946:26515`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26515`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `946:26515`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `946:26515`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26515`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26515`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26515`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26515`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26515`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×744px`; provenance: `figma-literal` at `946:26215`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26215`
    - Fact `layout-gap`: `32px`; provenance: `figma-literal` at `946:26215`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `946:26215`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `946:26215`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `946:26215`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `946:26215`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26215`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26215`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26215`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26215`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26215`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `946:26215`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `946:26215`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `488×62px`; provenance: `figma-literal` at `946:26216`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26216`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `946:26216`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26216`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `946:26216`
      - Fact `font-size`: `26px`; provenance: `figma-literal` at `946:26216`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26216`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26216`
      - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `946:26216`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `946:26216`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26216`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26216`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `946:26216`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26216`
      - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `946:26216`
    - `root-content-area-items` — role `items`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×456px`; provenance: `figma-literal` at `946:26217`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26217`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26217`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26217`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26217`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26217`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26217`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26217`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26217`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26217`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26217`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26217`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26217`
      - `root-content-area-items-item-01` — role `item-01`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×56px`; provenance: `figma-literal` at `946:26218`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26218`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26218`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26218`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26218`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26218`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26218`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26218`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26218`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26218`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26218`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26218`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26218`
        - `root-content-area-items-item-01-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
          - Fact `reference-size`: `56×56px`; provenance: `figma-literal` at `1015:18565`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18565`
        - `root-content-area-items-item-01-text-content` — role `text-content`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26220`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26220`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `946:26220`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26220`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26220`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26220`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26220`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26220`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26220`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26220`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26220`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26220`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26220`
          - `root-content-area-items-item-01-text-content-body` — role `body`; render `html-text`; visibility `always`
            - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26222`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26222`
            - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26222`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26222`
            - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26222`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26222`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26222`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26222`
            - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `946:26222`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26222`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26222`
            - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26222`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26222`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26222`
            - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `946:26222`
      - `root-content-area-items-item-02` — role `item-02`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×56px`; provenance: `figma-literal` at `946:26368`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26368`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26368`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26368`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26368`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26368`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26368`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26368`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26368`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26368`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26368`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26368`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26368`
        - `root-content-area-items-item-02-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
          - Fact `reference-size`: `56×56px`; provenance: `figma-literal` at `1015:18569`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18569`
        - `root-content-area-items-item-02-text-content` — role `text-content`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26370`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26370`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `946:26370`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26370`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26370`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26370`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26370`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26370`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26370`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26370`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26370`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26370`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26370`
          - `root-content-area-items-item-02-text-content-body` — role `body`; render `html-text`; visibility `always`
            - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26371`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26371`
            - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26371`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26371`
            - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26371`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26371`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26371`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26371`
            - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `946:26371`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26371`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26371`
            - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26371`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26371`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26371`
            - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `946:26371`
      - `root-content-area-items-item-03` — role `item-03`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×56px`; provenance: `figma-literal` at `946:26468`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26468`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26468`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26468`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26468`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26468`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26468`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26468`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26468`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26468`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26468`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26468`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26468`
        - `root-content-area-items-item-03-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
          - Fact `reference-size`: `56×56px`; provenance: `figma-literal` at `1015:18573`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18573`
        - `root-content-area-items-item-03-text-content` — role `text-content`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26470`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26470`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `946:26470`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26470`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26470`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26470`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26470`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26470`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26470`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26470`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26470`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26470`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26470`
          - `root-content-area-items-item-03-text-content-body` — role `body`; render `html-text`; visibility `always`
            - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26471`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26471`
            - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26471`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26471`
            - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26471`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26471`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26471`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26471`
            - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `946:26471`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26471`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26471`
            - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26471`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26471`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26471`
            - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `946:26471`
      - `root-content-area-items-item-04` — role `item-04`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×56px`; provenance: `figma-literal` at `946:26478`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26478`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26478`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26478`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26478`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26478`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26478`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26478`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26478`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26478`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26478`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26478`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26478`
        - `root-content-area-items-item-04-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
          - Fact `reference-size`: `56×56px`; provenance: `figma-literal` at `1015:18577`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18577`
        - `root-content-area-items-item-04-text-content` — role `text-content`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26480`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26480`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `946:26480`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26480`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26480`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26480`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26480`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26480`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26480`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26480`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26480`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26480`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26480`
          - `root-content-area-items-item-04-text-content-body` — role `body`; render `html-text`; visibility `always`
            - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26481`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26481`
            - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26481`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26481`
            - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26481`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26481`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26481`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26481`
            - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `946:26481`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26481`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26481`
            - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26481`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26481`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26481`
            - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `946:26481`
      - `root-content-area-items-item-05` — role `item-05`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×56px`; provenance: `figma-literal` at `946:26488`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26488`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26488`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26488`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26488`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26488`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26488`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26488`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26488`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26488`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26488`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26488`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26488`
        - `root-content-area-items-item-05-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
          - Fact `reference-size`: `56×56px`; provenance: `figma-literal` at `1015:18581`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18581`
        - `root-content-area-items-item-05-text-content` — role `text-content`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26490`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26490`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `946:26490`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26490`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26490`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26490`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26490`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26490`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26490`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26490`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26490`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26490`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26490`
          - `root-content-area-items-item-05-text-content-body` — role `body`; render `html-text`; visibility `always`
            - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26491`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26491`
            - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26491`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26491`
            - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26491`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26491`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26491`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26491`
            - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `946:26491`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26491`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26491`
            - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26491`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26491`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26491`
            - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `946:26491`
      - `root-content-area-items-item-06` — role `item-06`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×56px`; provenance: `figma-literal` at `946:26498`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26498`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `946:26498`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26498`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26498`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26498`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26498`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26498`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26498`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26498`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26498`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26498`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26498`
        - `root-content-area-items-item-06-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
          - Fact `reference-size`: `56×56px`; provenance: `figma-literal` at `1015:18585`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18585`
        - `root-content-area-items-item-06-text-content` — role `text-content`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26500`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26500`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `946:26500`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26500`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26500`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26500`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26500`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26500`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26500`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26500`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26500`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26500`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26500`
          - `root-content-area-items-item-06-text-content-body` — role `body`; render `html-text`; visibility `always`
            - Fact `reference-size`: `408×50px`; provenance: `figma-literal` at `946:26501`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26501`
            - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26501`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26501`
            - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26501`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26501`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26501`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26501`
            - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `946:26501`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26501`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26501`
            - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26501`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26501`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26501`
            - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `946:26501`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `230×46px`; provenance: `figma-literal` at `946:26508`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26508`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `946:26508`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `946:26508`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `946:26508`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `946:26508`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `946:26508`
      - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `946:26508`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26508`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26508`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `946:26508`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26508`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `946:26508`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `946:26508`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `946:26508`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×20px`; provenance: `figma-literal` at `946:26512`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `946:26512`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `946:26512`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26512`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26512`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26512`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26512`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26512`
      - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `946:26512`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26512`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26512`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26512`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26512`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26512`
      - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `946:26512`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×593px`; provenance: `figma-literal` at `946:26514`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26514`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26514`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `946:26514`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `946:26514`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26514`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `946:26514`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `946:26514`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26514`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26514`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26514`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26514`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26514`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×577px`; provenance: `figma-literal` at `946:26087`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26087`
    - Fact `layout-gap`: `22px`; provenance: `figma-literal` at `946:26087`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `946:26087`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `946:26087`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `946:26087`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `946:26087`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26087`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26087`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26087`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26087`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26087`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `946:26087`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `946:26087`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `946:26088`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26088`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `946:26088`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26088`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `946:26088`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `946:26088`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26088`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26088`
      - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `946:26088`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `946:26088`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26088`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26088`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `946:26088`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26088`
      - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `946:26088`
    - `root-content-area-item-01` — role `item-01`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×42px`; provenance: `figma-literal` at `946:26090`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26090`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26090`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26090`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26090`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26090`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26090`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26090`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26090`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26090`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26090`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26090`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26090`
      - `root-content-area-item-01-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
        - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1015:18589`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18589`
      - `root-content-area-item-01-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26092`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26092`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `946:26092`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26092`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26092`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26092`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26092`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26092`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26092`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26092`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26092`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26092`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26092`
        - `root-content-area-item-01-text-content-body` — role `body`; render `html-text`; visibility `always`
          - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26094`
          - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26094`
          - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26094`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26094`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26094`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26094`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26094`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26094`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `946:26094`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26094`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26094`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26094`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26094`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26094`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `946:26094`
    - `root-content-area-item-02` — role `item-02`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×42px`; provenance: `figma-literal` at `946:26418`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26418`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26418`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26418`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26418`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26418`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26418`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26418`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26418`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26418`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26418`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26418`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26418`
      - `root-content-area-item-02-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
        - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1015:18593`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18593`
      - `root-content-area-item-02-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26420`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26420`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `946:26420`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26420`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26420`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26420`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26420`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26420`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26420`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26420`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26420`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26420`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26420`
        - `root-content-area-item-02-text-content-body` — role `body`; render `html-text`; visibility `always`
          - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26421`
          - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26421`
          - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26421`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26421`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26421`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26421`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26421`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26421`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `946:26421`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26421`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26421`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26421`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26421`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26421`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `946:26421`
    - `root-content-area-item-03` — role `item-03`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×42px`; provenance: `figma-literal` at `946:26428`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26428`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26428`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26428`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26428`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26428`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26428`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26428`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26428`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26428`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26428`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26428`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26428`
      - `root-content-area-item-03-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
        - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1015:18597`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18597`
      - `root-content-area-item-03-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26430`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26430`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `946:26430`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26430`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26430`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26430`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26430`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26430`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26430`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26430`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26430`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26430`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26430`
        - `root-content-area-item-03-text-content-body` — role `body`; render `html-text`; visibility `always`
          - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26431`
          - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26431`
          - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26431`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26431`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26431`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26431`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26431`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26431`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `946:26431`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26431`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26431`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26431`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26431`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26431`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `946:26431`
    - `root-content-area-item-04` — role `item-04`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×42px`; provenance: `figma-literal` at `946:26438`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26438`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26438`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26438`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26438`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26438`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26438`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26438`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26438`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26438`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26438`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26438`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26438`
      - `root-content-area-item-04-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
        - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1015:18601`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18601`
      - `root-content-area-item-04-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26440`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26440`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `946:26440`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26440`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26440`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26440`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26440`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26440`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26440`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26440`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26440`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26440`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26440`
        - `root-content-area-item-04-text-content-body` — role `body`; render `html-text`; visibility `always`
          - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26441`
          - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26441`
          - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26441`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26441`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26441`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26441`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26441`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26441`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `946:26441`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26441`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26441`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26441`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26441`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26441`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `946:26441`
    - `root-content-area-item-05` — role `item-05`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×42px`; provenance: `figma-literal` at `946:26458`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26458`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26458`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26458`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26458`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26458`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26458`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26458`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26458`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26458`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26458`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26458`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26458`
      - `root-content-area-item-05-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
        - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1015:18605`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18605`
      - `root-content-area-item-05-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26460`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26460`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `946:26460`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26460`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26460`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26460`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26460`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26460`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26460`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26460`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26460`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26460`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26460`
        - `root-content-area-item-05-text-content-body` — role `body`; render `html-text`; visibility `always`
          - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26461`
          - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26461`
          - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26461`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26461`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26461`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26461`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26461`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26461`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `946:26461`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26461`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26461`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26461`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26461`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26461`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `946:26461`
    - `root-content-area-item-06` — role `item-06`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×42px`; provenance: `figma-literal` at `946:26448`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26448`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `946:26448`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26448`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26448`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26448`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26448`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26448`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26448`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26448`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26448`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26448`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26448`
      - `root-content-area-item-06-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
        - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1015:18609`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1015:18609`
      - `root-content-area-item-06-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26450`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `946:26450`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `946:26450`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `946:26450`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `946:26450`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `946:26450`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `946:26450`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26450`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26450`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26450`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:26450`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:26450`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:26450`
        - `root-content-area-item-06-text-content-body` — role `body`; render `html-text`; visibility `always`
          - Fact `reference-size`: `194×40px`; provenance: `figma-literal` at `946:26451`
          - Fact `text-color`: `#000000`; provenance: `figma-literal` at `946:26451`
          - Fact `source-text`: `Поясняющая подпись на одну или две строки`; provenance: `figma-literal` at `946:26451`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26451`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26451`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26451`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26451`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26451`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `946:26451`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26451`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26451`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26451`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26451`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26451`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `946:26451`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `946:26510`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `946:26510`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `946:26510`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `946:26510`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `946:26510`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `946:26510`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `946:26510`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `946:26510`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `946:26510`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:26510`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `946:26510`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `946:26510`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `946:26510`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `946:26510`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `946:26510`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `946:26513`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `946:26513`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `946:26513`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26513`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26513`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `946:26513`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26513`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26513`
      - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `946:26513`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26513`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26513`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26513`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26513`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26513`
      - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `946:26513`

### Properties and variants

- Variant `desktop` — Figma node `946:26515`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `946:26514`; axes: `Viewport=Mobile`
- Direct Figma source: `946:26515`; `Viewport=Desktop`; reference frame 600×768px
- Direct Figma source: `946:26514`; `Viewport=Mobile`; reference frame 328×593px
- Property `show-button` (`Show Button`) — `boolean`; default `true`
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `feature-icon`
  - Owner layer: `feature-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `feature-icon @4x`
  - Pixel dimensions: 224×224px
  - Aspect ratio: 56:56
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/1/children/0` → `feature-icon` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/2/children/0` → `feature-icon` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/3/children/0` → `feature-icon` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/4/children/0` → `feature-icon` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/5/children/0` → `feature-icon` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/6/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/0/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/1/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/2/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/3/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/4/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/5/children/0` → `feature-icon` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/7/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/0/children/2/component_id` → component `button-secondary` (`Button/Secondary`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-icon-list
PURPOSE: Контентный блок со списком строк, каждая из которых использует графическую иконку и живой текст.
RENDER: HYBRID
```

<!-- library: marketing; component-id: block-info-alert -->
## Block/Info-Alert

### Identity and purpose

- CUPIS ID: `block-info-alert`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `info-alert`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:5041` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:43e70af5f806c9820271f1726193d14bd61010f1fbe7ca4240cb7efe7a662012`
- Purpose: Контентный информационный блок с выделенным сообщением.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Info-Alert` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×98px`; provenance: `figma-literal` at `260:571`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `260:571`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `260:571`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `260:571`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `260:571`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `260:571`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `260:571`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `260:571`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `260:571`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `260:571`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `260:571`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `260:571`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `260:571`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×74px`; provenance: `figma-literal` at `260:562`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `260:562`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `260:562`
    - Fact `padding-top`: `24px`; provenance: `figma-literal` at `260:562`
    - Fact `padding-right`: `24px`; provenance: `figma-literal` at `260:562`
    - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `260:562`
    - Fact `padding-left`: `24px`; provenance: `figma-literal` at `260:562`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `260:562`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `260:562`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `260:562`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `260:562`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `260:562`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `260:562`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `260:562`
    - `root-content-area-alert-icon` — role `alert-icon`; render `direct-image`; visibility `always`; asset `alert-icon`
      - Fact `reference-size`: `26×26px`; provenance: `figma-literal` at `260:563`
      - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `260:563`
      - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `260:563`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `260:563`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `260:563`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `260:563`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `260:563`
    - `root-content-area-body` — role `body`; render `html-text`; visibility `always`
      - Fact `reference-size`: `462×25px`; provenance: `figma-literal` at `260:565`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `260:565`
      - Fact `source-text`: `Небольшой текст с пояснением чего-либо`; provenance: `figma-literal` at `260:565`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `260:565`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `260:565`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `260:565`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `260:565`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `260:565`
      - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `260:565`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `260:565`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `260:565`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `260:565`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `260:565`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×88px`; provenance: `figma-literal` at `16:2738`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `16:2738`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `16:2738`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `16:2738`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `16:2738`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `16:2738`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `16:2738`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `16:2738`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `16:2738`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `16:2738`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `16:2738`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `16:2738`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `16:2738`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×72px`; provenance: `figma-literal` at `16:2734`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `16:2734`
    - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `16:2734`
    - Fact `padding-top`: `16px`; provenance: `figma-literal` at `16:2734`
    - Fact `padding-right`: `16px`; provenance: `figma-literal` at `16:2734`
    - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `16:2734`
    - Fact `padding-left`: `16px`; provenance: `figma-literal` at `16:2734`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `16:2734`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `16:2734`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `16:2734`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `16:2734`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `16:2734`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `16:2734`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `16:2734`
    - `root-content-area-alert-icon` — role `alert-icon`; render `direct-image`; visibility `always`; asset `alert-icon`
      - Fact `reference-size`: `24×24px`; provenance: `figma-literal` at `16:2735`
      - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `16:2735`
      - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `16:2735`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `16:2735`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `16:2735`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `16:2735`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `16:2735`
    - `root-content-area-body` — role `body`; render `html-text`; visibility `always`
      - Fact `reference-size`: `228×40px`; provenance: `figma-literal` at `16:2737`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `16:2737`
      - Fact `source-text`: `Небольшой текст с пояснением чего-либо`; provenance: `figma-literal` at `16:2737`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `16:2737`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `16:2737`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `16:2737`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `16:2737`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `16:2737`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `16:2737`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `16:2737`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `16:2737`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `16:2737`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `16:2737`

### Properties and variants

- Variant `mobile` — Figma node `16:2738`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `260:571`; axes: `Viewport=Desktop`
- Direct Figma source: `16:2738`; `Viewport=Mobile`; reference frame 328×88px
- Direct Figma source: `260:571`; `Viewport=Desktop`; reference frame 600×98px

### Assets and interaction

- Asset contract: `alert-icon`
  - Owner layer: `alert-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `alert-icon @4x`
  - Pixel dimensions: 104×104px
  - Aspect ratio: 26:26
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0` → `alert-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0` → `alert-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-info-alert
PURPOSE: Контентный информационный блок с выделенным сообщением.
RENDER: HYBRID
```

<!-- library: marketing; component-id: block-steps -->
## Block/Steps

### Identity and purpose

- CUPIS ID: `block-steps`
- Status: `active`
- Library: `marketing`
- Semantic role: `block`
- Category: `steps`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4491` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:b3063c5e60fb157eb3997b2764a39b27662f58de1223efb1c46ec069dc3e18b4`
- Purpose: Контентный блок с последовательностью шагов и управляемыми дополнительными секциями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Steps` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×1037px`; provenance: `figma-literal` at `230:3832`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3832`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `230:3832`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `230:3832`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `230:3832`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3832`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `230:3832`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `230:3832`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3832`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3832`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3832`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `230:3832`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3832`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×1013px`; provenance: `figma-literal` at `230:3807`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3807`
    - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `230:3807`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `230:3807`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `230:3807`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `230:3807`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `230:3807`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3807`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3807`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3807`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3807`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3807`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `230:3807`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `230:3807`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `488×62px`; provenance: `figma-literal` at `230:3808`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `230:3808`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `230:3808`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `230:3808`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `230:3808`
      - Fact `font-size`: `26px`; provenance: `figma-literal` at `230:3808`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `230:3808`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `230:3808`
      - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `230:3808`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `230:3808`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `230:3808`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `230:3808`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `230:3808`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `230:3808`
      - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `230:3808`
    - `root-content-area-steps` — role `steps`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×531px`; provenance: `figma-literal` at `230:3809`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3809`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `230:3809`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3809`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3809`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3809`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3809`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3809`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3809`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3809`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3809`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3809`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3809`
      - `root-content-area-steps-step-01` — role `step-01`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `488×87px`; provenance: `figma-literal` at `230:3909`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3909`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `230:3909`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3909`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3909`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3909`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3909`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3909`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3909`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3909`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3909`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3909`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3909`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `230:3909`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `230:3909`
      - `root-content-area-steps-step-02` — role `step-02`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `488×87px`; provenance: `figma-literal` at `230:3915`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3915`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `230:3915`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3915`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3915`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3915`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3915`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3915`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3915`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3915`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3915`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3915`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3915`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `230:3915`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `230:3915`
      - `root-content-area-steps-step-03` — role `step-03`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `488×87px`; provenance: `figma-literal` at `230:3922`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3922`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `230:3922`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3922`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3922`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3922`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3922`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3922`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3922`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3922`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3922`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3922`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3922`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `230:3922`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `230:3922`
      - `root-content-area-steps-step-04` — role `step-04`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `488×87px`; provenance: `figma-literal` at `394:7184`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `394:7184`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `394:7184`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `394:7184`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `394:7184`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `394:7184`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `394:7184`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `394:7184`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `394:7184`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `394:7184`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `394:7184`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `394:7184`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `394:7184`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `394:7184`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `394:7184`
      - `root-content-area-steps-step-05` — role `step-05`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `488×87px`; provenance: `figma-literal` at `394:7197`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `394:7197`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `394:7197`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `394:7197`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `394:7197`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `394:7197`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `394:7197`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `394:7197`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `394:7197`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `394:7197`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `394:7197`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `394:7197`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `394:7197`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `394:7197`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `394:7197`
    - `root-content-area-notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
      - Fact `reference-size`: `488×96px`; provenance: `figma-literal` at `1024:19316`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19316`
      - Fact `layout-gap`: `20px`; provenance: `figma-literal` at `1024:19316`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19316`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19316`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19316`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19316`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19316`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19316`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19316`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19316`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19316`
      - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19316`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19316`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1024:19316`
    - `root-content-area-alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
      - Fact `reference-size`: `488×74px`; provenance: `figma-literal` at `1024:19227`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19227`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19227`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19227`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19227`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19227`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19227`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19227`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19227`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19227`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19227`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19227`
      - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19227`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19227`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `1024:19227`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `230×46px`; provenance: `figma-literal` at `337:4788`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `337:4788`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `337:4788`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `337:4788`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `337:4788`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `337:4788`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `337:4788`
      - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `337:4788`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `337:4788`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `337:4788`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `337:4788`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `337:4788`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `337:4788`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `337:4788`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `337:4788`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×20px`; provenance: `figma-literal` at `911:20885`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20885`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20885`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20885`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20885`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `911:20885`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20885`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20885`
      - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `911:20885`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20885`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20885`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20885`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20885`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20885`
      - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `911:20885`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×920px`; provenance: `figma-literal` at `12:1347`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `12:1347`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `12:1347`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `12:1347`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `12:1347`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `12:1347`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `12:1347`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `12:1347`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `12:1347`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `12:1347`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `12:1347`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `12:1347`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `12:1347`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×904px`; provenance: `figma-literal` at `12:1277`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `12:1277`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `12:1277`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `12:1277`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `12:1277`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `12:1277`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `12:1277`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `12:1277`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `12:1277`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `12:1277`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `12:1277`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `12:1277`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `12:1277`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `12:1277`
    - `root-content-area-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `12:1278`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `12:1278`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `12:1278`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `12:1278`
      - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `12:1278`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `12:1278`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `12:1278`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `12:1278`
      - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `12:1278`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `12:1278`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `12:1278`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `12:1278`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `12:1278`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `12:1278`
      - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `12:1278`
    - `root-content-area-steps` — role `steps`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×509px`; provenance: `figma-literal` at `12:1279`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `12:1279`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `12:1279`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `12:1279`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `12:1279`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `12:1279`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `12:1279`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `12:1279`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `12:1279`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `12:1279`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `12:1279`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `12:1279`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `12:1279`
      - `root-content-area-steps-step-01` — role `step-01`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `252×89px`; provenance: `figma-literal` at `18:2951`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `18:2951`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `18:2951`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2951`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `18:2951`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2951`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `18:2951`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `18:2951`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2951`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2951`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `18:2951`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `18:2951`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `18:2951`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `18:2951`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `18:2951`
      - `root-content-area-steps-step-02` — role `step-02`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `252×89px`; provenance: `figma-literal` at `18:2969`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `18:2969`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `18:2969`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2969`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `18:2969`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2969`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `18:2969`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `18:2969`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2969`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2969`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `18:2969`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `18:2969`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `18:2969`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `18:2969`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `18:2969`
      - `root-content-area-steps-step-03` — role `step-03`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `252×89px`; provenance: `figma-literal` at `18:2982`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `18:2982`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `18:2982`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2982`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `18:2982`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2982`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `18:2982`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `18:2982`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2982`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2982`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `18:2982`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `18:2982`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `18:2982`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `18:2982`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `18:2982`
      - `root-content-area-steps-step-04` — role `step-04`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `252×89px`; provenance: `figma-literal` at `18:2995`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `18:2995`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `18:2995`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2995`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `18:2995`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2995`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `18:2995`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `18:2995`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2995`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2995`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `18:2995`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `18:2995`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `18:2995`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `18:2995`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `18:2995`
      - `root-content-area-steps-step-05` — role `step-05`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
        - Fact `reference-size`: `252×89px`; provenance: `figma-literal` at `394:7210`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `394:7210`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `394:7210`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `394:7210`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `394:7210`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `394:7210`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `394:7210`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `394:7210`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `394:7210`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `394:7210`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `394:7210`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `394:7210`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `394:7210`
        - Fact `instance-show-caption`: `true`; provenance: `figma-literal` at `394:7210`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `394:7210`
    - `root-content-area-notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
      - Fact `reference-size`: `252×100px`; provenance: `figma-literal` at `1024:19328`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19328`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19328`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19328`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19328`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19328`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19328`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19328`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19328`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19328`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19328`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19328`
      - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19328`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19328`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1024:19328`
    - `root-content-area-alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
      - Fact `reference-size`: `252×66px`; provenance: `figma-literal` at `1024:19235`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19235`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `1024:19235`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19235`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19235`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19235`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19235`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `1024:19235`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19235`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19235`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19235`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19235`
      - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19235`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19235`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `1024:19235`
    - `root-content-area-button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
      - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `337:4794`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `337:4794`
      - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `337:4794`
      - Fact `padding-top`: `12px`; provenance: `figma-literal` at `337:4794`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `337:4794`
      - Fact `padding-bottom`: `12px`; provenance: `figma-literal` at `337:4794`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `337:4794`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `337:4794`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `337:4794`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `337:4794`
      - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `337:4794`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `337:4794`
      - Fact `border-radius`: `26px`; provenance: `figma-literal` at `337:4794`
      - Fact `background`: `#48494A`; provenance: `figma-literal` at `337:4794`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `337:4794`
    - `root-content-area-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `911:20889`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `911:20889`
      - Fact `source-text`: `*очень маленькое примечание`; provenance: `figma-literal` at `911:20889`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:20889`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:20889`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `911:20889`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:20889`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:20889`
      - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `911:20889`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:20889`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:20889`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:20889`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:20889`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:20889`
      - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `911:20889`

### Properties and variants

- Variant `mobile` — Figma node `12:1347`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `230:3832`; axes: `Viewport=Desktop`
- Direct Figma source: `12:1347`; `Viewport=Mobile`; reference frame 328×920px
- Direct Figma source: `230:3832`; `Viewport=Desktop`; reference frame 600×1037px
- Property `show-alert` (`Show Alert`) — `boolean`; default `true`
- Property `show-button` (`Show Button`) — `boolean`; default `true`
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`
- Property `show-notification` (`Show Notification`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/1/children/0/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/mobile/root/children/0/children/1/children/1/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/mobile/root/children/0/children/1/children/2/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/mobile/root/children/0/children/1/children/3/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/mobile/root/children/0/children/1/children/4/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/mobile/root/children/0/children/2/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/mobile/root/children/0/children/3/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/mobile/root/children/0/children/4/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/0/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/1/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/2/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/3/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/desktop/root/children/0/children/1/children/4/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/desktop/root/children/0/children/2/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/desktop/root/children/0/children/3/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/desktop/root/children/0/children/4/component_id` → component `button-secondary` (`Button/Secondary`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-steps
PURPOSE: Контентный блок с последовательностью шагов и управляемыми дополнительными секциями.
RENDER: HTML
```

<!-- library: marketing; component-id: button-primary -->
## Button/Primary

### Identity and purpose

- CUPIS ID: `button-primary`
- Status: `active`
- Library: `marketing`
- Semantic role: `button`
- Category: `primary`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4713` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры обоих вариантов записаны непосредственно из Figma; CSS-угол 25° отдельно утверждён для HTML и не выдаётся за угол Fill. HTML-проекция проверяется отдельно.
- Structure fingerprint: `sha256:f72b837d30fd626373d960ba021ccc7d184765092d8a14d19052aa445533d4b3`
- Purpose: Основная градиентная HTML-кнопка для главного действия письма.
- Baseline: `registry/email-component-descriptions-registry.md` → `Button/Primary` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `button`; render `presentation-table`; visibility `always`
  - Fact `button-padding-block`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `button-padding-inline`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `button-border-radius`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-fallback`: `#18B037`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-start`: `#18B037`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-end`: `#3DD55C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-css-angle-degrees`: `25`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-replacement-forbidden`: `#00991F`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `link` — role `button-link`; render `html-link`; visibility `always`
    - Fact `button-text-size`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Mobile

- `root` — role `button`; render `presentation-table`; visibility `always`
  - Fact `button-padding-block`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `button-padding-inline`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `button-border-radius`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-fallback`: `#18B037`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-start`: `#18B037`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-end`: `#3DD55C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-css-angle-degrees`: `25`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-replacement-forbidden`: `#00991F`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `link` — role `button-link`; render `html-link`; visibility `always`
    - Fact `button-text-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Properties and variants

- Variant `desktop` — Figma node `337:4694`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `337:4691`; axes: `Viewport=Mobile`
- Direct Figma source: `337:4694`; `Viewport=Desktop`; reference frame 230×54px
- Direct Figma source: `337:4691`; `Viewport=Mobile`; reference frame 158×44px

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0`
- Link: `desktop` `/contracts/desktop/root/children/0`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: button-primary
PURPOSE: Основная градиентная HTML-кнопка для главного действия письма.
RENDER: HTML
```

<!-- library: marketing; component-id: button-secondary -->
## Button/Secondary

### Identity and purpose

- CUPIS ID: `button-secondary`
- Status: `active`
- Library: `marketing`
- Semantic role: `button`
- Category: `secondary`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4710` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно из Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:d2451da399ffb1e0a67a979bae64ad7442aac2617ee5ee95a2e94fe767283e81`
- Purpose: Вторичная кликабельная HTML-кнопка для действий внутри письма.
- Baseline: `registry/email-component-descriptions-registry.md` → `Button/Secondary` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `button`; render `presentation-table`; visibility `always`
  - `link` — role `button-link`; render `html-link`; visibility `always`

### Mobile

- `root` — role `button`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `#48494A`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `link` — role `button-link`; render `html-link`; visibility `always`

### Properties and variants

- Variant `mobile` — Figma node `337:4576`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `337:4699`; axes: `Viewport=Desktop`
- Direct Figma source: `337:4576`; `Viewport=Mobile`; reference frame 158×44px
- Direct Figma source: `337:4699`; `Viewport=Desktop`; reference frame 230×46px

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0`
- Link: `desktop` `/contracts/desktop/root/children/0`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: button-secondary
PURPOSE: Вторичная кликабельная HTML-кнопка для действий внутри письма.
RENDER: HTML
```

<!-- library: marketing; component-id: card-icon -->
## Card/Icon

### Identity and purpose

- CUPIS ID: `card-icon`
- Status: `active`
- Library: `marketing`
- Semantic role: `card`
- Category: `icon`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#326:5580` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:a36c2a891344e693c283d021aca44c4eea77cc087823eec968327605d84f7a6c`
- Purpose: Карточка с графической иконкой, живым текстом и необязательной ссылкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Card/Icon` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `card`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×138px`; provenance: `figma-literal` at `260:662`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `260:662`
  - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `260:662`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `260:662`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `260:662`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `260:662`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `260:662`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `260:662`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `260:662`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `260:662`
  - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `260:662`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `260:662`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `260:662`
  - `root-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
    - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `946:25834`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `946:25834`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `946:25834`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:25834`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:25834`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:25834`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:25834`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `392×138px`; provenance: `figma-literal` at `260:658`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `260:658`
    - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `260:658`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `260:658`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `260:658`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `260:658`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `260:658`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `260:658`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `260:658`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `260:658`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `260:658`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `260:658`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `260:658`
    - `root-text-content-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `392×48px`; provenance: `figma-literal` at `260:659`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `260:659`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `260:659`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `260:659`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `260:659`
      - Fact `font-size`: `20px`; provenance: `figma-literal` at `260:659`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `260:659`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `260:659`
      - Fact `figma-style-id`: `S:105e0e8a189848d91c13bf0f2887665713de21ca,`; provenance: `figma-literal` at `260:659`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `260:659`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `260:659`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `260:659`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `260:659`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `260:659`
      - Fact `figma-style-name`: `Desktop/Title`; provenance: `figma-literal` at `260:659`
    - `root-text-content-description` — role `description`; render `html-text`; visibility property `show-description` (`Show Description`)
      - Fact `reference-size`: `392×44px`; provenance: `figma-literal` at `260:660`
      - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `260:660`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `260:660`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `260:660`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `260:660`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `260:660`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `260:660`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `260:660`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `260:660`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `260:660`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `260:660`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `260:660`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `260:660`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `260:660`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `260:660`
    - `root-text-content-link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)
      - Fact `reference-size`: `392×22px`; provenance: `figma-literal` at `1015:18846`
      - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `1015:18846`
      - Fact `source-text`: `Ссылка >`; provenance: `figma-literal` at `1015:18846`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1015:18846`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `1015:18846`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `1015:18846`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `1015:18846`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1015:18846`
      - Fact `figma-style-id`: `S:80178ed95ee94439436fb7ea36e3eb926f986be2,`; provenance: `figma-literal` at `1015:18846`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `1015:18846`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1015:18846`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1015:18846`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1015:18846`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `1015:18846`
      - Fact `figma-style-name`: `Desktop/Action`; provenance: `figma-literal` at `1015:18846`

### Mobile

- `root` — role `card`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `271×182px`; provenance: `figma-literal` at `11:1020`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `11:1020`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `11:1020`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `11:1020`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `11:1020`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `11:1020`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `11:1020`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `11:1020`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `11:1020`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `11:1020`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `11:1020`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `11:1020`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `11:1020`
  - `root-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
    - Fact `reference-size`: `52×52px`; provenance: `figma-literal` at `946:25770`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `946:25770`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `946:25770`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `946:25770`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `946:25770`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `946:25770`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `946:25770`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `271×114px`; provenance: `figma-literal` at `11:1014`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `11:1014`
    - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `11:1014`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `11:1014`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `11:1014`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `11:1014`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `11:1014`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `11:1014`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `11:1014`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `11:1014`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `11:1014`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `11:1014`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `11:1014`
    - `root-text-content-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `271×38px`; provenance: `figma-literal` at `11:1015`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `11:1015`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `11:1015`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `11:1015`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `11:1015`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `11:1015`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `11:1015`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `11:1015`
      - Fact `figma-style-id`: `S:348cad38e7e2918d2bc09859e1c0ac3f9b5afbb0,`; provenance: `figma-literal` at `11:1015`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `11:1015`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `11:1015`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `11:1015`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `11:1015`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `11:1015`
      - Fact `figma-style-name`: `Mobile/Title`; provenance: `figma-literal` at `11:1015`
    - `root-text-content-description` — role `description`; render `html-text`; visibility property `show-description` (`Show Description`)
      - Fact `reference-size`: `271×40px`; provenance: `figma-literal` at `11:1016`
      - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `11:1016`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `11:1016`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `11:1016`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `11:1016`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `11:1016`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `11:1016`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `11:1016`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `11:1016`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `11:1016`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `11:1016`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `11:1016`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `11:1016`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `11:1016`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `11:1016`
    - `root-text-content-link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)
      - Fact `reference-size`: `271×20px`; provenance: `figma-literal` at `1015:18749`
      - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `1015:18749`
      - Fact `source-text`: `Ссылка >`; provenance: `figma-literal` at `1015:18749`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1015:18749`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `1015:18749`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `1015:18749`
      - Fact `text-align`: `center`; provenance: `figma-literal` at `1015:18749`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1015:18749`
      - Fact `figma-style-id`: `S:780f997658bfc56dc4db512b20c92d16c415c3f3,`; provenance: `figma-literal` at `1015:18749`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `1015:18749`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1015:18749`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1015:18749`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1015:18749`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `1015:18749`
      - Fact `figma-style-name`: `Mobile/Action`; provenance: `figma-literal` at `1015:18749`

### Properties and variants

- Variant `mobile` — Figma node `11:1020`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `260:662`; axes: `Viewport=Desktop`
- Direct Figma source: `11:1020`; `Viewport=Mobile`; reference frame 271×182px
- Direct Figma source: `260:662`; `Viewport=Desktop`; reference frame 488×138px
- Property `show-description` (`Show Description`) — `boolean`; default `true`
- Property `show-link` (`Show Link`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `feature-icon`
  - Owner layer: `feature-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `feature-icon @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `feature-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `feature-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/2`

### Constraints and dependencies

- Constraint `link-remains-live-html` — scope `all`; kind `interaction`; severity `required`: Слой link — отдельная HTML-ссылка: видимый текст остаётся живым, адрес передаётся письмом в content slot href; не растрировать ссылку и не переносить её на всю карточку.

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: card-icon
PURPOSE: Карточка с графической иконкой, живым текстом и необязательной ссылкой.
RENDER: HYBRID
```

<!-- library: marketing; component-id: card-image -->
## Card/Image

### Identity and purpose

- CUPIS ID: `card-image`
- Status: `active`
- Library: `marketing`
- Semantic role: `card`
- Category: `image`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#911:4132` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:e45ebbe8c07207092e26b3712d88d65bbc5d7d560f4b8daee20e1f4dfc6a2ab6`
- Purpose: Карточка с составным изображением, живым текстом и необязательной ссылкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Card/Image` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `card`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×148px`; provenance: `figma-literal` at `911:4131`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `911:4131`
  - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `911:4131`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4131`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4131`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4131`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4131`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `911:4131`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4131`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4131`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4131`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4131`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4131`
  - `root-card-image` — role `card-image`; render `direct-image`; visibility `always`; asset `card-image`
    - Fact `reference-size`: `232×148px`; provenance: `figma-literal` at `911:4005`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4005`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `911:4005`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4005`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4005`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4005`
    - Fact `border-radius`: `18px`; provenance: `figma-literal` at `911:4005`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `232×126px`; provenance: `figma-literal` at `911:4002`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `911:4002`
    - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `911:4002`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4002`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4002`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4002`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4002`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4002`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4002`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4002`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4002`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4002`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4002`
    - `root-text-content-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `232×48px`; provenance: `figma-literal` at `911:4003`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `911:4003`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `911:4003`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:4003`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `911:4003`
      - Fact `font-size`: `20px`; provenance: `figma-literal` at `911:4003`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:4003`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:4003`
      - Fact `figma-style-id`: `S:105e0e8a189848d91c13bf0f2887665713de21ca,`; provenance: `figma-literal` at `911:4003`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `911:4003`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:4003`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:4003`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `911:4003`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:4003`
      - Fact `figma-style-name`: `Desktop/Title`; provenance: `figma-literal` at `911:4003`
    - `root-text-content-description` — role `description`; render `html-text`; visibility `always`
      - Fact `reference-size`: `232×44px`; provenance: `figma-literal` at `911:4004`
      - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `911:4004`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `911:4004`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:4004`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:4004`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `911:4004`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:4004`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:4004`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `911:4004`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:4004`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:4004`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:4004`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:4004`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:4004`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `911:4004`
    - `root-text-content-link` — role `link`; render `html-link`; visibility `always`
      - Fact `reference-size`: `176×22px`; provenance: `figma-literal` at `1015:18276`
      - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `1015:18276`
      - Fact `source-text`: `Ссылка >`; provenance: `figma-literal` at `1015:18276`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1015:18276`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `1015:18276`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `1015:18276`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `1015:18276`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1015:18276`
      - Fact `figma-style-id`: `S:80178ed95ee94439436fb7ea36e3eb926f986be2,`; provenance: `figma-literal` at `1015:18276`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `1015:18276`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1015:18276`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1015:18276`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1015:18276`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `1015:18276`
      - Fact `figma-style-name`: `Desktop/Action`; provenance: `figma-literal` at `1015:18276`

### Mobile

- `root` — role `card`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×291px`; provenance: `figma-literal` at `911:4130`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `911:4130`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `911:4130`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4130`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4130`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4130`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4130`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `911:4130`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4130`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4130`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4130`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4130`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4130`
  - `root-card-image` — role `card-image`; render `direct-image`; visibility `always`; asset `card-image`
    - Fact `reference-size`: `252×161px`; provenance: `figma-literal` at `911:4120`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4120`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `911:4120`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4120`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4120`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4120`
    - Fact `border-radius`: `14px`; provenance: `figma-literal` at `911:4120`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×114px`; provenance: `figma-literal` at `911:4121`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `911:4121`
    - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `911:4121`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `911:4121`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `911:4121`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `911:4121`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `911:4121`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `911:4121`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `911:4121`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `911:4121`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `911:4121`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `911:4121`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `911:4121`
    - `root-text-content-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×38px`; provenance: `figma-literal` at `911:4122`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `911:4122`
      - Fact `source-text`: `Небольшой заголовок на пару строк`; provenance: `figma-literal` at `911:4122`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:4122`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `911:4122`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `911:4122`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:4122`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:4122`
      - Fact `figma-style-id`: `S:348cad38e7e2918d2bc09859e1c0ac3f9b5afbb0,`; provenance: `figma-literal` at `911:4122`
      - Fact `line-height`: `120%`; provenance: `figma-literal` at `911:4122`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:4122`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:4122`
      - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `911:4122`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:4122`
      - Fact `figma-style-name`: `Mobile/Title`; provenance: `figma-literal` at `911:4122`
    - `root-text-content-description` — role `description`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `911:4123`
      - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `911:4123`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `911:4123`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `911:4123`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `911:4123`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `911:4123`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `911:4123`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `911:4123`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `911:4123`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `911:4123`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `911:4123`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `911:4123`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `911:4123`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `911:4123`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `911:4123`
    - `root-text-content-link` — role `link`; render `html-link`; visibility `always`
      - Fact `reference-size`: `236×20px`; provenance: `figma-literal` at `1015:18459`
      - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `1015:18459`
      - Fact `source-text`: `Ссылка >`; provenance: `figma-literal` at `1015:18459`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1015:18459`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `1015:18459`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `1015:18459`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `1015:18459`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1015:18459`
      - Fact `figma-style-id`: `S:780f997658bfc56dc4db512b20c92d16c415c3f3,`; provenance: `figma-literal` at `1015:18459`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `1015:18459`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1015:18459`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1015:18459`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1015:18459`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `1015:18459`
      - Fact `figma-style-name`: `Mobile/Action`; provenance: `figma-literal` at `1015:18459`

### Properties and variants

- Variant `desktop` — Figma node `911:4131`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `911:4130`; axes: `Viewport=Mobile`
- Direct Figma source: `911:4131`; `Viewport=Desktop`; reference frame 488×148px
- Direct Figma source: `911:4130`; `Viewport=Mobile`; reference frame 252×291px

### Assets and interaction

- Asset contract: `card-image`
  - Owner layer: `card-image @2x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `jpeg-2x` — JPEG, `.jpg`, scale 2, suffix `@2x`, sRGB
  - Alpha: `none` — `no-alpha`
  - Clipping: `neutralize-presentation-only`
  - Export boundary: `node` `card-image @2x`
  - Pixel dimensions: 464×296px
  - Raw Figma Fill dimensions: 888×480px
  - Aspect ratio: 232:148
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `card-image` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `card-image` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/2`

### Constraints and dependencies

- Constraint `link-remains-live-html` — scope `all`; kind `interaction`; severity `required`: Слой link — отдельная HTML-ссылка: видимый текст остаётся живым, адрес передаётся письмом в content slot href; не растрировать ссылку и не переносить её на всю карточку.

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: card-image
PURPOSE: Карточка с составным изображением, живым текстом и необязательной ссылкой.
RENDER: HYBRID
```

<!-- library: marketing; component-id: email-footer -->
## Email/Footer

### Identity and purpose

- CUPIS ID: `email-footer`
- Status: `active`
- Library: `marketing`
- Semantic role: `email`
- Category: `footer`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#333:7477` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:f08c19aedc8e2a9da2c0bf8a0a130e89f725143ac215b53bb5db4fe53842f536`
- Purpose: Основной полноширинный футер с дисклеймером, отпиской и управляемой секцией социальных ссылок.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Footer` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `email`; render `presentation-table`; visibility `always`
  - Fact `email-wrapper-width`: `600px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-top-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-body-padding-inline`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-body-padding-bottom`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-section-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-background`: `#F3F3F5`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
    - Fact `caption-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `caption-text-color`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `disclaimer` — role `disclaimer`; render `html-text`; visibility `always`
    - Fact `disclaimer-text-gap`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `disclaimer-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `disclaimer-text-color`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `social-links` — role `social-links`; render `presentation-table`; visibility property `show-social-links` (`Show Social Links`)
    - Fact `social-icon-gap`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `vk-link` — role `social-link`; render `html-link`; visibility `always`
      - `vk-icon` — role `social-icon`; render `direct-image`; visibility `always`; asset `vk-icon`
        - Fact `social-icon-display-dimensions`: `42×42px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `telegram-link` — role `social-link`; render `html-link`; visibility `always`
      - `telegram-icon` — role `social-icon`; render `direct-image`; visibility `always`; asset `telegram-icon`

### Mobile

- `root` — role `email`; render `presentation-table`; visibility `always`
  - Fact `email-wrapper-width`: `600px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-top-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-body-padding-inline`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-body-padding-bottom`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-section-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `footer-background`: `#F3F3F5`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
    - Fact `caption-font-size`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `caption-text-color`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `disclaimer` — role `disclaimer`; render `html-text`; visibility `always`
    - Fact `disclaimer-text-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `disclaimer-font-size`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `disclaimer-text-color`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `social-links` — role `social-links`; render `presentation-table`; visibility property `show-social-links` (`Show Social Links`)
    - Fact `social-icon-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `vk-link` — role `social-link`; render `html-link`; visibility `always`
      - `vk-icon` — role `social-icon`; render `direct-image`; visibility `always`; asset `vk-icon`
        - Fact `social-icon-display-dimensions`: `32×32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `telegram-link` — role `social-link`; render `html-link`; visibility `always`
      - `telegram-icon` — role `social-icon`; render `direct-image`; visibility `always`; asset `telegram-icon`

### Properties and variants

- Variant `mobile` — Figma node `17:2763`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `261:4020`; axes: `Viewport=Desktop`
- Direct Figma source: `17:2763`; `Viewport=Mobile`; reference frame 328×249px
- Direct Figma source: `261:4020`; `Viewport=Desktop`; reference frame 600×258px
- Property `show-caption` (`Show Caption`) — `boolean`; default `false`
- Property `show-social-links` (`Show Social Links`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `vk-icon`
  - Owner layer: `vk-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `vk-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `telegram-icon`
  - Owner layer: `telegram-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `telegram-icon @4x`
  - Pixel dimensions: 168×168px
  - Aspect ratio: 42:42
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Link: `mobile` `/contracts/mobile/root/children/2/children/0`
- Asset usage: `mobile` `/contracts/mobile/root/children/2/children/0/children/0` → `vk-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/2/children/1`
- Asset usage: `mobile` `/contracts/mobile/root/children/2/children/1/children/0` → `telegram-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/2/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/2/children/0/children/0` → `vk-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/2/children/1`
- Asset usage: `desktop` `/contracts/desktop/root/children/2/children/1/children/0` → `telegram-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: email-footer
PURPOSE: Основной полноширинный футер с дисклеймером, отпиской и управляемой секцией социальных ссылок.
RENDER: HYBRID
```

<!-- library: marketing; component-id: email-footer-legal -->
## Email/Footer-Legal

### Identity and purpose

- CUPIS ID: `email-footer-legal`
- Status: `active`
- Library: `marketing`
- Semantic role: `email`
- Category: `footer-legal`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#499:2431` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:4d2316dd74a0fe278cb20d3278ac6d89a09ae087c9208792c4b01c9800a0b651`
- Purpose: Юридический полноширинный футер письма.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Footer-Legal` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `email`; render `presentation-table`; visibility `always`
  - `disclaimer` — role `disclaimer`; render `html-text`; visibility `always`

### Mobile

- `root` — role `email`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `600px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `#F3F3F5`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `disclaimer` — role `disclaimer`; render `html-text`; visibility `always`

### Properties and variants

- Variant `mobile` — Figma node `499:2430`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `499:2429`; axes: `Viewport=Desktop`
- Direct Figma source: `499:2430`; `Viewport=Mobile`; reference frame 328×176px
- Direct Figma source: `499:2429`; `Viewport=Desktop`; reference frame 600×180px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: email-footer-legal
PURPOSE: Юридический полноширинный футер письма.
RENDER: HTML
```

<!-- library: marketing; component-id: email-header -->
## Email/Header

### Identity and purpose

- CUPIS ID: `email-header`
- Status: `active`
- Library: `marketing`
- Semantic role: `email`
- Category: `header`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#326:5159` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:2f6357a800cc5fd2cedc0181ce7c28f1cf0ce3b131044b9754809b0e83936ff0`
- Purpose: Полноширинный хедер письма с центрированным составным логотипом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Header` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `email`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×74px`; provenance: `figma-literal` at `230:3679`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3679`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `230:3679`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `230:3679`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3679`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3679`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3679`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `230:3679`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3679`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3679`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3679`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `230:3679`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3679`
  - `root-header-logo` — role `header-logo`; render `direct-image`; visibility `always`; asset `header-logo`
    - Fact `reference-size`: `322×50px`; provenance: `figma-literal` at `1008:1823`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `1008:1823`
    - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `1008:1823`
    - Fact `padding-top`: `6px`; provenance: `figma-literal` at `1008:1823`
    - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1008:1823`
    - Fact `padding-bottom`: `6px`; provenance: `figma-literal` at `1008:1823`
    - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1008:1823`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1008:1823`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `1008:1823`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1008:1823`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1008:1823`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1008:1823`
    - Fact `border-radius`: `55px`; provenance: `figma-literal` at `1008:1823`
    - Fact `background`: `#F3F3F5`; provenance: `figma-literal` at `1008:1823`

### Mobile

- `root` — role `email`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×49px`; provenance: `figma-literal` at `15:2037`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `15:2037`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `15:2037`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `15:2037`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `15:2037`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `15:2037`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `15:2037`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `15:2037`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `15:2037`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `15:2037`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `15:2037`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `15:2037`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `15:2037`
  - `root-header-logo-compact` — role `header-logo-compact`; render `direct-image`; visibility `always`; asset `header-logo`
    - Fact `reference-size`: `212×33px`; provenance: `figma-literal` at `1008:1709`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `1008:1709`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `1008:1709`
    - Fact `padding-top`: `4px`; provenance: `figma-literal` at `1008:1709`
    - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1008:1709`
    - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `1008:1709`
    - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1008:1709`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1008:1709`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1008:1709`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1008:1709`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1008:1709`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1008:1709`
    - Fact `border-radius`: `35.96730041503906px`; provenance: `figma-literal` at `1008:1709`
    - Fact `background`: `#F3F3F5`; provenance: `figma-literal` at `1008:1709`

### Properties and variants

- Variant `mobile` — Figma node `15:2037`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `230:3679`; axes: `Viewport=Desktop`
- Direct Figma source: `15:2037`; `Viewport=Mobile`; reference frame 328×49px
- Direct Figma source: `230:3679`; `Viewport=Desktop`; reference frame 600×74px

### Assets and interaction

- Asset contract: `header-logo`
  - Owner layer: `header-logo @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `opaque` — `fully-opaque`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `header-logo @4x`
  - Pixel dimensions: 1288×200px
  - Aspect ratio: 322:50
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `header-logo` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `header-logo` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: email-header
PURPOSE: Полноширинный хедер письма с центрированным составным логотипом.
RENDER: ASSET
```

<!-- library: marketing; component-id: item-alert -->
## Item/Alert

### Identity and purpose

- CUPIS ID: `item-alert`
- Status: `active`
- Library: `marketing`
- Semantic role: `item`
- Category: `alert`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1024:19226` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:e94cc1564d7af39565a7707ef19f6fa71f8605016d888f8cb528072288a3c139`
- Purpose: Вложенный предупреждающий элемент с живым текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Alert` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×74px`; provenance: `figma-literal` at `1024:19225`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19225`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19225`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19225`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19225`
  - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19225`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19225`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19225`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19225`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19225`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19225`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19225`
  - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19225`
  - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19225`
  - `root-alert-icon` — role `alert-icon`; render `direct-image`; visibility `always`; asset `alert-icon`
    - Fact `reference-size`: `26×26px`; provenance: `figma-literal` at `1024:19217`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19217`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `1024:19217`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19217`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19217`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1024:19217`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1024:19217`
  - `root-body` — role `body`; render `html-text`; visibility `always`
    - Fact `reference-size`: `398×22px`; provenance: `figma-literal` at `1024:19219`
    - Fact `text-color`: `#000000`; provenance: `figma-literal` at `1024:19219`
    - Fact `source-text`: `Небольшой текст со смыслом «Обрати внимание!»`; provenance: `figma-literal` at `1024:19219`
    - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1024:19219`
    - Fact `font-style`: `Regular`; provenance: `figma-literal` at `1024:19219`
    - Fact `font-size`: `16px`; provenance: `figma-literal` at `1024:19219`
    - Fact `text-align`: `left`; provenance: `figma-literal` at `1024:19219`
    - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1024:19219`
    - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `1024:19219`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `1024:19219`
    - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1024:19219`
    - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1024:19219`
    - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1024:19219`
    - Fact `text-case`: `original`; provenance: `figma-literal` at `1024:19219`
    - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `1024:19219`

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×66px`; provenance: `figma-literal` at `1024:19224`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19224`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `1024:19224`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19224`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19224`
  - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19224`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19224`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19224`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19224`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19224`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19224`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19224`
  - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19224`
  - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19224`
  - `root-alert-icon` — role `alert-icon`; render `direct-image`; visibility `always`; asset `alert-icon`
    - Fact `reference-size`: `24×24px`; provenance: `figma-literal` at `1024:19221`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19221`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `1024:19221`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19221`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19221`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1024:19221`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1024:19221`
  - `root-body` — role `body`; render `html-text`; visibility `always`
    - Fact `reference-size`: `184×34px`; provenance: `figma-literal` at `1024:19223`
    - Fact `text-color`: `#000000`; provenance: `figma-literal` at `1024:19223`
    - Fact `source-text`: `Небольшой текст со смыслом «Обрати внимание!»`; provenance: `figma-literal` at `1024:19223`
    - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1024:19223`
    - Fact `font-style`: `Regular`; provenance: `figma-literal` at `1024:19223`
    - Fact `font-size`: `12px`; provenance: `figma-literal` at `1024:19223`
    - Fact `text-align`: `left`; provenance: `figma-literal` at `1024:19223`
    - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1024:19223`
    - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `1024:19223`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `1024:19223`
    - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1024:19223`
    - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1024:19223`
    - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1024:19223`
    - Fact `text-case`: `original`; provenance: `figma-literal` at `1024:19223`
    - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `1024:19223`

### Properties and variants

- Variant `mobile` — Figma node `1024:19224`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `1024:19225`; axes: `Viewport=Desktop`
- Direct Figma source: `1024:19224`; `Viewport=Mobile`; reference frame 252×66px
- Direct Figma source: `1024:19225`; `Viewport=Desktop`; reference frame 488×74px

### Assets and interaction

- Asset contract: `alert-icon`
  - Owner layer: `alert-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `alert-icon @4x`
  - Pixel dimensions: 104×104px
  - Aspect ratio: 26:26
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `alert-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `alert-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: item-alert
PURPOSE: Вложенный предупреждающий элемент с живым текстом.
RENDER: HYBRID
```

<!-- library: marketing; component-id: item-bullet -->
## Item/Bullet

### Identity and purpose

- CUPIS ID: `item-bullet`
- Status: `active`
- Library: `marketing`
- Semantic role: `item`
- Category: `bullet`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:4958` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно из Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:00506a80bff7fc52a80ed872823de640d3932e0045e416de034f2d38ab0c0899`
- Purpose: Отдельный пункт маркированного списка с живым текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Bullet` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×109px`; provenance: `figma-literal` at `234:580`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `234:580`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `234:580`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `234:580`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:580`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:580`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:580`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `234:580`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:580`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:580`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:580`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:580`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:580`
  - `root-bullet-indicator` — role `bullet-indicator`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `8×16px`; provenance: `figma-literal` at `234:575`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `234:575`
    - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `234:575`
    - Fact `padding-top`: `8px`; provenance: `figma-literal` at `234:575`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:575`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:575`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:575`
    - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `234:575`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:575`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:575`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:575`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `234:575`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:575`
    - `root-bullet-indicator-bullet-dot` — role `bullet-dot`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `8×8px`; provenance: `figma-literal` at `234:576`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:576`
      - Fact `background`: `#18B037`; provenance: `figma-literal` at `234:576`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `468×109px`; provenance: `figma-literal` at `234:577`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `234:577`
    - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `234:577`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `234:577`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `234:577`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `234:577`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `234:577`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `234:577`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `234:577`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `234:577`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `234:577`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `234:577`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `234:577`
    - `root-text-content-primary-text` — role `primary-text`; render `html-text`; visibility `always`
      - Fact `reference-size`: `468×25px`; provenance: `figma-literal` at `234:578`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `234:578`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `234:578`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `234:578`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `234:578`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `234:578`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `234:578`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `234:578`
      - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `234:578`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `234:578`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `234:578`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `234:578`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `234:578`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `234:578`
      - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `234:578`
    - `root-text-content-supporting-text-01` — role `supporting-text-01`; render `html-text`; visibility `always`
      - Fact `reference-size`: `468×22px`; provenance: `figma-literal` at `234:579`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `234:579`
      - Fact `source-text`: `Очень маленькое примечание`; provenance: `figma-literal` at `234:579`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `234:579`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `234:579`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `234:579`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `234:579`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `234:579`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `234:579`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `234:579`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `234:579`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `234:579`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `234:579`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `234:579`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `234:579`
    - `root-text-content-supporting-text-02` — role `supporting-text-02`; render `html-text`; visibility `always`
      - Fact `reference-size`: `468×22px`; provenance: `figma-literal` at `946:26194`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `946:26194`
      - Fact `source-text`: `Очень маленькое примечание`; provenance: `figma-literal` at `946:26194`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26194`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26194`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `946:26194`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26194`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26194`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `946:26194`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26194`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26194`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26194`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26194`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26194`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `946:26194`
    - `root-text-content-link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)
      - Fact `reference-size`: `468×22px`; provenance: `figma-literal` at `946:26517`
      - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `946:26517`
      - Fact `source-text`: `Ссылка >`; provenance: `figma-literal` at `946:26517`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26517`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `946:26517`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `946:26517`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26517`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26517`
      - Fact `figma-style-id`: `S:80178ed95ee94439436fb7ea36e3eb926f986be2,`; provenance: `figma-literal` at `946:26517`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26517`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26517`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26517`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26517`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26517`
      - Fact `figma-style-name`: `Desktop/Action`; provenance: `figma-literal` at `946:26517`

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×106px`; provenance: `figma-literal` at `222:702`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `222:702`
  - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `222:702`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `222:702`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `222:702`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `222:702`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `222:702`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `222:702`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `222:702`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `222:702`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `222:702`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `222:702`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `222:702`
  - `root-bullet-indicator` — role `bullet-indicator`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `8×14px`; provenance: `figma-literal` at `222:697`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `222:697`
    - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `222:697`
    - Fact `padding-top`: `6px`; provenance: `figma-literal` at `222:697`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `222:697`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `222:697`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `222:697`
    - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `222:697`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `222:697`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `222:697`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `222:697`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `222:697`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `222:697`
    - `root-bullet-indicator-bullet-dot` — role `bullet-dot`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `8×8px`; provenance: `figma-literal` at `222:698`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `222:698`
      - Fact `background`: `#18B037`; provenance: `figma-literal` at `222:698`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `236×106px`; provenance: `figma-literal` at `222:699`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `222:699`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `222:699`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `222:699`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `222:699`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `222:699`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `222:699`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `222:699`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `222:699`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `222:699`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `222:699`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `222:699`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `222:699`
    - `root-text-content-primary-text` — role `primary-text`; render `html-text`; visibility `always`
      - Fact `reference-size`: `236×40px`; provenance: `figma-literal` at `222:700`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `222:700`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `222:700`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `222:700`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `222:700`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `222:700`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `222:700`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `222:700`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `222:700`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `222:700`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `222:700`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `222:700`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `222:700`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `222:700`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `222:700`
    - `root-text-content-supporting-text-01` — role `supporting-text-01`; render `html-text`; visibility `always`
      - Fact `reference-size`: `236×17px`; provenance: `figma-literal` at `222:701`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `222:701`
      - Fact `source-text`: `Очень маленькое примечание`; provenance: `figma-literal` at `222:701`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `222:701`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `222:701`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `222:701`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `222:701`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `222:701`
      - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `222:701`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `222:701`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `222:701`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `222:701`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `222:701`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `222:701`
      - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `222:701`
    - `root-text-content-supporting-text-02` — role `supporting-text-02`; render `html-text`; visibility `always`
      - Fact `reference-size`: `236×17px`; provenance: `figma-literal` at `946:26202`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `946:26202`
      - Fact `source-text`: `Очень маленькое примечание`; provenance: `figma-literal` at `946:26202`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26202`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `946:26202`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `946:26202`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26202`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26202`
      - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `946:26202`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26202`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26202`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26202`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26202`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26202`
      - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `946:26202`
    - `root-text-content-link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)
      - Fact `reference-size`: `236×20px`; provenance: `figma-literal` at `946:26525`
      - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `946:26525`
      - Fact `source-text`: `Ссылка >`; provenance: `figma-literal` at `946:26525`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `946:26525`
      - Fact `font-style`: `Medium`; provenance: `figma-literal` at `946:26525`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `946:26525`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `946:26525`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `946:26525`
      - Fact `figma-style-id`: `S:780f997658bfc56dc4db512b20c92d16c415c3f3,`; provenance: `figma-literal` at `946:26525`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `946:26525`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `946:26525`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `946:26525`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `946:26525`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `946:26525`
      - Fact `figma-style-name`: `Mobile/Action`; provenance: `figma-literal` at `946:26525`

### Properties and variants

- Variant `mobile` — Figma node `222:702`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `234:580`; axes: `Viewport=Desktop`
- Direct Figma source: `222:702`; `Viewport=Mobile`; reference frame 252×106px
- Direct Figma source: `234:580`; `Viewport=Desktop`; reference frame 488×109px
- Property `show-link` (`Show Link`) — `boolean`; default `true`

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/1/children/3`
- Link: `desktop` `/contracts/desktop/root/children/1/children/3`

### Constraints and dependencies

- Constraint `link-remains-live-html` — scope `all`; kind `interaction`; severity `required`: Слой link — отдельная HTML-ссылка: видимый текст остаётся живым, адрес передаётся письмом в content slot href; не растрировать ссылку и не переносить её на всю карточку.

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: item-bullet
PURPOSE: Отдельный пункт маркированного списка с живым текстом.
RENDER: HTML
```

<!-- library: marketing; component-id: item-notification -->
## Item/Notification

### Identity and purpose

- CUPIS ID: `item-notification`
- Status: `active`
- Library: `marketing`
- Semantic role: `item`
- Category: `notification`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1024:19285` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:46c60d5dc21992117cf67f770fea05d1b295bf932ee8763ab3a30f66044dd6e9`
- Purpose: Вложенный информационный элемент с живым текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Notification` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×96px`; provenance: `figma-literal` at `1024:19284`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19284`
  - Fact `layout-gap`: `20px`; provenance: `figma-literal` at `1024:19284`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `1024:19284`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `1024:19284`
  - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `1024:19284`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `1024:19284`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19284`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19284`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19284`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19284`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19284`
  - Fact `border-radius`: `18px`; provenance: `figma-literal` at `1024:19284`
  - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19284`
  - `root-body` — role `body`; render `html-text`; visibility `always`
    - Fact `reference-size`: `372×44px`; provenance: `figma-literal` at `1024:19272`
    - Fact `text-color`: `#000000`; provenance: `figma-literal` at `1024:19272`
    - Fact `source-text`: `Пожалуйста, напишите здесь текст, на который клиенту нужно обратить внимание!`; provenance: `figma-literal` at `1024:19272`
    - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1024:19272`
    - Fact `font-style`: `Regular`; provenance: `figma-literal` at `1024:19272`
    - Fact `font-size`: `16px`; provenance: `figma-literal` at `1024:19272`
    - Fact `text-align`: `left`; provenance: `figma-literal` at `1024:19272`
    - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1024:19272`
    - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `1024:19272`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `1024:19272`
    - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1024:19272`
    - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1024:19272`
    - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1024:19272`
    - Fact `text-case`: `original`; provenance: `figma-literal` at `1024:19272`
    - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `1024:19272`
  - `root-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
    - Fact `reference-size`: `48×48px`; provenance: `figma-literal` at `1024:19273`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19273`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `1024:19273`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19273`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19273`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1024:19273`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1024:19273`

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×100px`; provenance: `figma-literal` at `1024:19283`
  - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `1024:19283`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `1024:19283`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `1024:19283`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `1024:19283`
  - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `1024:19283`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `1024:19283`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19283`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `1024:19283`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19283`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19283`
  - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `1024:19283`
  - Fact `border-radius`: `14px`; provenance: `figma-literal` at `1024:19283`
  - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `1024:19283`
  - `root-body` — role `body`; render `html-text`; visibility `always`
    - Fact `reference-size`: `162×68px`; provenance: `figma-literal` at `1024:19278`
    - Fact `text-color`: `#000000`; provenance: `figma-literal` at `1024:19278`
    - Fact `source-text`: `Пожалуйста, напишите здесь текст, на который клиенту нужно обратить внимание!`; provenance: `figma-literal` at `1024:19278`
    - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `1024:19278`
    - Fact `font-style`: `Regular`; provenance: `figma-literal` at `1024:19278`
    - Fact `font-size`: `12px`; provenance: `figma-literal` at `1024:19278`
    - Fact `text-align`: `left`; provenance: `figma-literal` at `1024:19278`
    - Fact `text-decoration`: `none`; provenance: `figma-literal` at `1024:19278`
    - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `1024:19278`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `1024:19278`
    - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `1024:19278`
    - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `1024:19278`
    - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `1024:19278`
    - Fact `text-case`: `original`; provenance: `figma-literal` at `1024:19278`
    - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `1024:19278`
  - `root-feature-icon` — role `feature-icon`; render `direct-image`; visibility `always`; asset `feature-icon`
    - Fact `reference-size`: `42×42px`; provenance: `figma-literal` at `1024:19279`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `1024:19279`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `1024:19279`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `1024:19279`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `1024:19279`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `1024:19279`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `1024:19279`

### Properties and variants

- Variant `mobile` — Figma node `1024:19283`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `1024:19284`; axes: `Viewport=Desktop`
- Direct Figma source: `1024:19283`; `Viewport=Mobile`; reference frame 252×100px
- Direct Figma source: `1024:19284`; `Viewport=Desktop`; reference frame 488×96px

### Assets and interaction

- Asset contract: `feature-icon`
  - Owner layer: `feature-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `feature-icon @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/1` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/1` → `feature-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: item-notification
PURPOSE: Вложенный информационный элемент с живым текстом.
RENDER: HYBRID
```

<!-- library: marketing; component-id: item-step -->
## Item/Step

### Identity and purpose

- CUPIS ID: `item-step`
- Status: `active`
- Library: `marketing`
- Semantic role: `item`
- Category: `step`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#337:5039` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:5cb7ff9481e6dc20d956a64dd93afc3d39fe966a952cfb51f4159905a9543c04`
- Purpose: Отдельный пронумерованный шаг с живым текстом и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Step` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×87px`; provenance: `figma-literal` at `230:3839`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3839`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `230:3839`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3839`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3839`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3839`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3839`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `230:3839`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3839`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3839`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3839`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3839`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3839`
  - `root-step-number` — role `step-number`; render `nested-component`; visibility `always`; component `badge-step-number` (`Badge/Step-Number`)
    - Fact `reference-size`: `58×22px`; provenance: `figma-literal` at `230:3852`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `230:3852`
    - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `230:3852`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3852`
    - Fact `padding-right`: `8px`; provenance: `figma-literal` at `230:3852`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3852`
    - Fact `padding-left`: `8px`; provenance: `figma-literal` at `230:3852`
    - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `230:3852`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3852`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3852`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `230:3852`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `230:3852`
    - Fact `border-radius`: `19px`; provenance: `figma-literal` at `230:3852`
    - Fact `background`: `#B0FCC0`; provenance: `figma-literal` at `230:3852`
    - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `230:3852`
    - Fact `instance-style`: `accent`; provenance: `figma-literal` at `230:3852`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×53px`; provenance: `figma-literal` at `230:3836`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `230:3836`
    - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `230:3836`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `230:3836`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `230:3836`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `230:3836`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `230:3836`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `230:3836`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `230:3836`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `230:3836`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `230:3836`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `230:3836`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `230:3836`
    - `root-text-content-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `230:3837`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `230:3837`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `230:3837`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `230:3837`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `230:3837`
      - Fact `font-size`: `18px`; provenance: `figma-literal` at `230:3837`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `230:3837`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `230:3837`
      - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `230:3837`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `230:3837`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `230:3837`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `230:3837`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `230:3837`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `230:3837`
      - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `230:3837`
    - `root-text-content-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `230:3838`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `230:3838`
      - Fact `source-text`: `Очень маленькое примечание`; provenance: `figma-literal` at `230:3838`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `230:3838`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `230:3838`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `230:3838`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `230:3838`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `230:3838`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `230:3838`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `230:3838`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `230:3838`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `230:3838`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `230:3838`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `230:3838`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `230:3838`

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×89px`; provenance: `figma-literal` at `18:2939`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `18:2939`
  - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `18:2939`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2939`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `18:2939`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2939`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `18:2939`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `18:2939`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2939`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2939`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `18:2939`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `18:2939`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `18:2939`
  - `root-step-number` — role `step-number`; render `nested-component`; visibility `always`; component `badge-step-number` (`Badge/Step-Number`)
    - Fact `reference-size`: `53×20px`; provenance: `figma-literal` at `18:2949`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `18:2949`
    - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `18:2949`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2949`
    - Fact `padding-right`: `8px`; provenance: `figma-literal` at `18:2949`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2949`
    - Fact `padding-left`: `8px`; provenance: `figma-literal` at `18:2949`
    - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `18:2949`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2949`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2949`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `18:2949`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `18:2949`
    - Fact `border-radius`: `19px`; provenance: `figma-literal` at `18:2949`
    - Fact `background`: `#B0FCC0`; provenance: `figma-literal` at `18:2949`
    - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `18:2949`
    - Fact `instance-style`: `accent`; provenance: `figma-literal` at `18:2949`
  - `root-text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×61px`; provenance: `figma-literal` at `18:2936`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `18:2936`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `18:2936`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `18:2936`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `18:2936`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `18:2936`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `18:2936`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `18:2936`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `18:2936`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `18:2936`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `18:2936`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `18:2936`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `18:2936`
    - `root-text-content-heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `18:2937`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `18:2937`
      - Fact `source-text`: `Поясняющая подпись на несколько красивых строк`; provenance: `figma-literal` at `18:2937`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `18:2937`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `18:2937`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `18:2937`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `18:2937`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `18:2937`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `18:2937`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `18:2937`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `18:2937`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `18:2937`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `18:2937`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `18:2937`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `18:2937`
    - `root-text-content-caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)
      - Fact `reference-size`: `252×17px`; provenance: `figma-literal` at `18:2938`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `18:2938`
      - Fact `source-text`: `Очень маленькое примечание`; provenance: `figma-literal` at `18:2938`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `18:2938`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `18:2938`
      - Fact `font-size`: `12px`; provenance: `figma-literal` at `18:2938`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `18:2938`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `18:2938`
      - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `18:2938`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `18:2938`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `18:2938`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `18:2938`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `18:2938`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `18:2938`
      - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `18:2938`

### Properties and variants

- Variant `mobile` — Figma node `18:2939`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `230:3839`; axes: `Viewport=Desktop`
- Direct Figma source: `18:2939`; `Viewport=Mobile`; reference frame 252×89px
- Direct Figma source: `230:3839`; `Viewport=Desktop`; reference frame 488×87px
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/component_id` → component `badge-step-number` (`Badge/Step-Number`)
- Dependency: `/contracts/desktop/root/children/0/component_id` → component `badge-step-number` (`Badge/Step-Number`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: item-step
PURPOSE: Отдельный пронумерованный шаг с живым текстом и необязательной подписью.
RENDER: HTML
```

<!-- library: marketing; component-id: nps-options -->
## NPS/Options

### Identity and purpose

- CUPIS ID: `nps-options`
- Status: `active`
- Library: `marketing`
- Semantic role: `nps`
- Category: `options`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1084:16995` (`component-set`)
- Source root: `538:17236`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры вариантов записаны непосредственно по компонентам Figma; HTML-интерпретация проверяется отдельно.
- Structure fingerprint: `sha256:359fbab0689fef703cd244bffd17d3623916ac46e053fe0c45091fa03a1a4234`
- Purpose: Адаптивная группа кликабельных вариантов оценки NPS.
- Baseline: `registry/email-component-descriptions-registry.md` → `NPS/Options` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `nps`; render `presentation-table`; visibility `always`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `options` — role `options`; render `presentation-table`; visibility `always`
    - `happy-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `happy-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `happy-face-icon`
    - `neutral-face-link` — role `rating-link`; render `html-link`; visibility variant `Count=3`
      - `neutral-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `neutral-face-icon`
    - `sad-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `sad-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `sad-face-icon`

### Mobile

- `root` — role `nps`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `296px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `552px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `44px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `32×32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-12`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-13`: `54px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-14`: `42×42px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `options` — role `options`; render `presentation-table`; visibility `always`
    - `happy-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `happy-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `happy-face-icon`
    - `neutral-face-link` — role `rating-link`; render `html-link`; visibility variant `Count=3`
      - `neutral-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `neutral-face-icon`
    - `sad-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `sad-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `sad-face-icon`

### Properties and variants

- Variant `mobile-3` — Figma node `15:599`; axes: `Viewport=Mobile`, `Count=3`
- Variant `desktop-3` — Figma node `260:3974`; axes: `Viewport=Desktop`, `Count=3`
- Variant `mobile-2` — Figma node `260:1346`; axes: `Viewport=Mobile`, `Count=2`
- Variant `desktop-2` — Figma node `260:3976`; axes: `Viewport=Desktop`, `Count=2`
- Direct Figma source: `15:599`; `Viewport=Mobile, Count=3`; reference frame 328×246px
- Direct Figma source: `260:3974`; `Viewport=Desktop, Count=3`; reference frame 600×197px
- Direct Figma source: `260:1346`; `Viewport=Mobile, Count=2`; reference frame 328×194px
- Direct Figma source: `260:3976`; `Viewport=Desktop, Count=2`; reference frame 600×197px

### Assets and interaction

- Asset contract: `happy-face-icon`
  - Owner layer: `happy-face-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `image-fill`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `source` — `preserve-source`
  - Clipping: `preserve-artwork`
  - Export boundary: `fill` `happy-face-icon @4x`
  - Pixel dimensions: 168×168px
  - Raw Figma Fill dimensions: 1024×1024px
  - Aspect ratio: 42:42
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `neutral-face-icon`
  - Owner layer: `neutral-face-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `image-fill`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `source` — `preserve-source`
  - Clipping: `preserve-artwork`
  - Export boundary: `fill` `neutral-face-icon @4x`
  - Pixel dimensions: 168×168px
  - Raw Figma Fill dimensions: 1024×1024px
  - Aspect ratio: 42:42
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `sad-face-icon`
  - Owner layer: `sad-face-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `image-fill`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `source` — `preserve-source`
  - Clipping: `preserve-artwork`
  - Export boundary: `fill` `sad-face-icon @4x`
  - Pixel dimensions: 168×168px
  - Raw Figma Fill dimensions: 1024×1024px
  - Aspect ratio: 42:42
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Link: `mobile` `/contracts/mobile/root/children/1/children/0`
- Asset usage: `mobile` `/contracts/mobile/root/children/1/children/0/children/0` → `happy-face-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/1`
- Asset usage: `mobile` `/contracts/mobile/root/children/1/children/1/children/0` → `neutral-face-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/2`
- Asset usage: `mobile` `/contracts/mobile/root/children/1/children/2/children/0` → `sad-face-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/1/children/0/children/0` → `happy-face-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/1`
- Asset usage: `desktop` `/contracts/desktop/root/children/1/children/1/children/0` → `neutral-face-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/1/children/2/children/0` → `sad-face-icon` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: nps-options
PURPOSE: Адаптивная группа кликабельных вариантов оценки NPS.
RENDER: HYBRID
```

<!-- library: service; component-id: asset-bank-badge-4x -->
## Asset/Bank-Badge @4x

### Identity and purpose

- CUPIS ID: `asset-bank-badge-4x`
- Status: `active`
- Library: `service`
- Semantic role: `asset`
- Category: `bank-badge-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#481:19664` (`component`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составной графический бейдж банка для использования в сервисных блоках.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Bank-Badge @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `direct-image`
- Mobile root: `root` — `direct-image`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `bank-badge`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `481:19664`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `481:19664`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `481:19664`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `481:19664`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `481:19664`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `481:19664`
  - Fact `border-radius`: `72px`; provenance: `figma-literal` at `481:19664`
  - Fact `stroke-color-1`: `#DFDFE0`; provenance: `figma-literal` at `481:19664`
  - Fact `stroke-weight`: `0.5625px`; provenance: `figma-literal` at `481:19664`

### Mobile

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `bank-badge`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `481:19664`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `481:19664`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `481:19664`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `481:19664`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `481:19664`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `481:19664`
  - Fact `border-radius`: `72px`; provenance: `figma-literal` at `481:19664`
  - Fact `stroke-color-1`: `#DFDFE0`; provenance: `figma-literal` at `481:19664`
  - Fact `stroke-weight`: `0.5625px`; provenance: `figma-literal` at `481:19664`

### Assets and interaction

- Asset contract: `bank-badge`
  - Owner layer: `Asset/Bank-Badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `Asset/Bank-Badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root` → `bank-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root` → `bank-badge` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-bank-badge-4x
PURPOSE: Составной графический бейдж банка для использования в сервисных блоках.
RENDER: ASSET
```

<!-- library: service; component-id: asset-icon-badge-4x -->
## Asset/Icon-Badge @4x

### Identity and purpose

- CUPIS ID: `asset-icon-badge-4x`
- Status: `active`
- Library: `service`
- Semantic role: `asset`
- Category: `icon-badge-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#484:20039` (`component`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Универсальный составной графический бейдж с иконкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Icon-Badge @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `direct-image`
- Mobile root: `root` — `direct-image`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `icon-badge`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `484:20039`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `484:20039`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `484:20039`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20039`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `484:20039`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20039`
  - Fact `border-radius`: `72px`; provenance: `figma-literal` at `484:20039`
  - Fact `stroke-color-1`: `#DFDFE0`; provenance: `figma-literal` at `484:20039`
  - Fact `stroke-weight`: `0.5625px`; provenance: `figma-literal` at `484:20039`

### Mobile

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `icon-badge`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `484:20039`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `484:20039`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `484:20039`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20039`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `484:20039`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20039`
  - Fact `border-radius`: `72px`; provenance: `figma-literal` at `484:20039`
  - Fact `stroke-color-1`: `#DFDFE0`; provenance: `figma-literal` at `484:20039`
  - Fact `stroke-weight`: `0.5625px`; provenance: `figma-literal` at `484:20039`

### Assets and interaction

- Asset contract: `icon-badge`
  - Owner layer: `Asset/Icon-Badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `Asset/Icon-Badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root` → `icon-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root` → `icon-badge` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-icon-badge-4x
PURPOSE: Универсальный составной графический бейдж с иконкой.
RENDER: ASSET
```

<!-- library: service; component-id: asset-partner-badge-4x -->
## Asset/Partner-Badge @4x

### Identity and purpose

- CUPIS ID: `asset-partner-badge-4x`
- Status: `active`
- Library: `service`
- Semantic role: `asset`
- Category: `partner-badge-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#481:19665` (`component`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составной графический бейдж партнёра для использования в сервисных блоках.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Partner-Badge @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `direct-image`
- Mobile root: `root` — `direct-image`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `partner-badge`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `481:19665`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `481:19665`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `481:19665`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `481:19665`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `481:19665`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `481:19665`
  - Fact `border-radius`: `72px`; provenance: `figma-literal` at `481:19665`

### Mobile

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `partner-badge`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `481:19665`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `481:19665`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `481:19665`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `481:19665`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `481:19665`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `481:19665`
  - Fact `border-radius`: `72px`; provenance: `figma-literal` at `481:19665`

### Assets and interaction

- Asset contract: `partner-badge`
  - Owner layer: `Asset/Partner-Badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `Asset/Partner-Badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root` → `partner-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root` → `partner-badge` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-partner-badge-4x
PURPOSE: Составной графический бейдж партнёра для использования в сервисных блоках.
RENDER: ASSET
```

<!-- library: service; component-id: asset-status-badge-negative-4x -->
## Asset/Status-Badge-Negative @4x

### Identity and purpose

- CUPIS ID: `asset-status-badge-negative-4x`
- Status: `active`
- Library: `service`
- Semantic role: `asset`
- Category: `status-badge-negative-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22178` (`component`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составная графическая иконка отрицательного статуса.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Status-Badge-Negative @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `direct-image`
- Mobile root: `root` — `direct-image`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `status-badge-negative`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `491:22178`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `491:22178`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `491:22178`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `491:22178`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `491:22178`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `491:22178`
  - Fact `border-radius`: `56px`; provenance: `figma-literal` at `491:22178`

### Mobile

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `status-badge-negative`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `491:22178`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `491:22178`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `491:22178`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `491:22178`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `491:22178`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `491:22178`
  - Fact `border-radius`: `56px`; provenance: `figma-literal` at `491:22178`

### Assets and interaction

- Asset contract: `status-badge-negative`
  - Owner layer: `Asset/Status-Badge-Negative @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `Asset/Status-Badge-Negative @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root` → `status-badge-negative` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root` → `status-badge-negative` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-status-badge-negative-4x
PURPOSE: Составная графическая иконка отрицательного статуса.
RENDER: ASSET
```

<!-- library: service; component-id: asset-status-badge-positive-4x -->
## Asset/Status-Badge-Positive @4x

### Identity and purpose

- CUPIS ID: `asset-status-badge-positive-4x`
- Status: `active`
- Library: `service`
- Semantic role: `asset`
- Category: `status-badge-positive-4x`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#491:22074` (`component`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составная графическая иконка положительного статуса.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Status-Badge-Positive @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `direct-image`
- Mobile root: `root` — `direct-image`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `status-badge-positive`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `491:22074`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `491:22074`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `491:22074`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `491:22074`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `491:22074`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `491:22074`
  - Fact `border-radius`: `56px`; provenance: `figma-literal` at `491:22074`

### Mobile

- `root` — role `asset`; render `direct-image`; visibility `always`; asset `status-badge-positive`
  - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `491:22074`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `491:22074`
  - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `491:22074`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `491:22074`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `491:22074`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `491:22074`
  - Fact `border-radius`: `56px`; provenance: `figma-literal` at `491:22074`

### Assets and interaction

- Asset contract: `status-badge-positive`
  - Owner layer: `Asset/Status-Badge-Positive @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `Asset/Status-Badge-Positive @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root` → `status-badge-positive` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root` → `status-badge-positive` as `direct-image`

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: asset-status-badge-positive-4x
PURPOSE: Составная графическая иконка положительного статуса.
RENDER: ASSET
```

<!-- library: service; component-id: badge-operation-status -->
## Badge/Operation-Status

### Identity and purpose

- CUPIS ID: `badge-operation-status`
- Status: `active`
- Library: `service`
- Semantic role: `badge`
- Category: `operation-status`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#1084:16996` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:1cca4ddcec78df7b41644071d3118e82d7795b4f4a7e4c28ea46ef6afb5666cf`
- Purpose: Живой HTML-бейдж состояния операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Badge/Operation-Status` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `badge`; render `presentation-table`; visibility `always`
  - `status` — role `status-text`; render `html-text`; visibility `always`

### Mobile

- `root` — role `badge`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `63px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `#FAE6AF`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `#8C5D00`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `#B0FCC0`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `#00991F`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `#FFC7C8`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `#CC2944`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `status` — role `status-text`; render `html-text`; visibility `always`

### Properties and variants

- Variant `mobile-pending` — Figma node `459:29367`; axes: `Viewport=Mobile`, `State=Pending`
- Variant `mobile-success` — Figma node `459:29369`; axes: `Viewport=Mobile`, `State=Success`
- Variant `mobile-error` — Figma node `459:29371`; axes: `Viewport=Mobile`, `State=Error`
- Variant `desktop-pending` — Figma node `466:13290`; axes: `Viewport=Desktop`, `State=Pending`
- Variant `desktop-success` — Figma node `466:13292`; axes: `Viewport=Desktop`, `State=Success`
- Variant `desktop-error` — Figma node `466:13294`; axes: `Viewport=Desktop`, `State=Error`
- Direct Figma source: `459:29367`; `Viewport=Mobile, State=Pending`; reference frame 94×25px
- Direct Figma source: `459:29369`; `Viewport=Mobile, State=Success`; reference frame 75×25px
- Direct Figma source: `459:29371`; `Viewport=Mobile, State=Error`; reference frame 86×25px
- Direct Figma source: `466:13290`; `Viewport=Desktop, State=Pending`; reference frame 117×30px
- Direct Figma source: `466:13292`; `Viewport=Desktop, State=Success`; reference frame 91×30px
- Direct Figma source: `466:13294`; `Viewport=Desktop, State=Error`; reference frame 106×30px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: badge-operation-status
PURPOSE: Живой HTML-бейдж состояния операции.
RENDER: HTML
```

<!-- library: service; component-id: banner-fiscal-check-link -->
## Banner/Fiscal-Check-Link

### Identity and purpose

- CUPIS ID: `banner-fiscal-check-link`
- Status: `active`
- Library: `service`
- Semantic role: `banner`
- Category: `fiscal-check-link`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#502:25048` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:fcd5e01eac540388fdbf90ce1003e2e7a8833d073c83276cbfc130c10a971079`
- Purpose: Группа кликабельных строк со ссылками на проверку фискального чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Fiscal-Check-Link` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `root-layout-direction`: `vertical`; provenance: `figma-literal` at `502:25046`
  - Fact `root-item-gap`: `12px`; provenance: `figma-literal` at `502:25046`
  - Fact `root-padding-top`: `24px`; provenance: `figma-literal` at `502:25046`
  - Fact `root-padding-right`: `24px`; provenance: `figma-literal` at `502:25046`
  - Fact `root-padding-left`: `24px`; provenance: `figma-literal` at `502:25046`
  - `root-item-01` — role `item-01`; render `presentation-table`; visibility `always`
    - Fact `root-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-item-gap`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-padding-top`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-padding-right`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-padding-bottom`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-padding-left`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-corner-radius`: `26px`; provenance: `figma-literal` at `497:19958`
    - Fact `root-item-01-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:19958`
    - `root-item-01-logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `root-item-01-logo-cell-ofd-badge` — role `ofd-badge`; render `direct-image`; visibility `always`; asset `ofd-badge`
        - Fact `root-item-01-logo-cell-ofd-badge-corner-radius`: `48px`; provenance: `figma-literal` at `497:19959`
        - Fact `root-item-01-logo-cell-ofd-badge-clips-content`: `true`; provenance: `figma-literal` at `497:19959`
        - Fact `root-item-01-logo-cell-ofd-badge-display-width`: `48px`; provenance: `figma-literal` at `497:19959`
        - Fact `root-item-01-logo-cell-ofd-badge-display-height`: `48px`; provenance: `figma-literal` at `497:19959`
    - `root-item-01-text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `root-item-01-text-cell-link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `root-item-01-text-cell-link-text-fill-color`: `#000000`; provenance: `figma-literal` at `497:19960`
        - Fact `root-item-01-text-cell-link-text-font-size`: `18px`; provenance: `figma-literal` at `497:19960`
        - Fact `root-item-01-text-cell-link-text-line-height`: `140%`; provenance: `figma-literal` at `497:19960`
        - Fact `root-item-01-text-cell-link-text-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `497:19960`
    - `root-item-01-chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `root-item-01-chevron-cell-chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `root-item-01-chevron-cell-chevron-icon-clips-content`: `true`; provenance: `figma-literal` at `497:19961`
        - Fact `root-item-01-chevron-cell-chevron-icon-display-width`: `24px`; provenance: `figma-literal` at `497:19961`
        - Fact `root-item-01-chevron-cell-chevron-icon-display-height`: `24px`; provenance: `figma-literal` at `497:19961`
  - `root-item-02` — role `item-02`; render `presentation-table`; visibility `always`
    - Fact `root-item-02-layout-direction`: `horizontal`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-item-gap`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-padding-top`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-padding-right`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-padding-bottom`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-padding-left`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-corner-radius`: `26px`; provenance: `figma-literal` at `497:19963`
    - Fact `root-item-02-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:19963`
    - `root-item-02-logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `root-item-02-logo-cell-fns-badge` — role `fns-badge`; render `direct-image`; visibility `always`; asset `fns-badge`
        - Fact `root-item-02-logo-cell-fns-badge-corner-radius`: `48px`; provenance: `figma-literal` at `497:19964`
        - Fact `root-item-02-logo-cell-fns-badge-clips-content`: `true`; provenance: `figma-literal` at `497:19964`
        - Fact `root-item-02-logo-cell-fns-badge-display-width`: `48px`; provenance: `figma-literal` at `497:19964`
        - Fact `root-item-02-logo-cell-fns-badge-display-height`: `48px`; provenance: `figma-literal` at `497:19964`
    - `root-item-02-text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `root-item-02-text-cell-link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `root-item-02-text-cell-link-text-fill-color`: `#000000`; provenance: `figma-literal` at `497:19965`
        - Fact `root-item-02-text-cell-link-text-font-size`: `18px`; provenance: `figma-literal` at `497:19965`
        - Fact `root-item-02-text-cell-link-text-line-height`: `140%`; provenance: `figma-literal` at `497:19965`
        - Fact `root-item-02-text-cell-link-text-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `497:19965`
    - `root-item-02-chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `root-item-02-chevron-cell-chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `root-item-02-chevron-cell-chevron-icon-clips-content`: `true`; provenance: `figma-literal` at `497:19966`
        - Fact `root-item-02-chevron-cell-chevron-icon-display-width`: `24px`; provenance: `figma-literal` at `497:19966`
        - Fact `root-item-02-chevron-cell-chevron-icon-display-height`: `24px`; provenance: `figma-literal` at `497:19966`

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `root-layout-direction`: `vertical`; provenance: `figma-literal` at `502:25047`
  - Fact `root-item-gap`: `8px`; provenance: `figma-literal` at `502:25047`
  - Fact `root-padding-top`: `16px`; provenance: `figma-literal` at `502:25047`
  - Fact `root-padding-right`: `16px`; provenance: `figma-literal` at `502:25047`
  - Fact `root-padding-left`: `16px`; provenance: `figma-literal` at `502:25047`
  - `root-item-01` — role `item-01`; render `presentation-table`; visibility `always`
    - Fact `root-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-item-gap`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-padding-top`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-padding-right`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-padding-bottom`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-padding-left`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-corner-radius`: `22px`; provenance: `figma-literal` at `502:25000`
    - Fact `root-item-01-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:25000`
    - `root-item-01-logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `root-item-01-logo-cell-ofd-badge` — role `ofd-badge`; render `direct-image`; visibility `always`; asset `ofd-badge`
        - Fact `root-item-01-logo-cell-ofd-badge-corner-radius`: `48px`; provenance: `figma-literal` at `502:25001`
        - Fact `root-item-01-logo-cell-ofd-badge-clips-content`: `true`; provenance: `figma-literal` at `502:25001`
        - Fact `root-item-01-logo-cell-ofd-badge-display-width`: `48px`; provenance: `figma-literal` at `502:25001`
        - Fact `root-item-01-logo-cell-ofd-badge-display-height`: `48px`; provenance: `figma-literal` at `502:25001`
    - `root-item-01-text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `root-item-01-text-cell-link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `root-item-01-text-cell-link-text-fill-color`: `#000000`; provenance: `figma-literal` at `502:25002`
        - Fact `root-item-01-text-cell-link-text-font-size`: `14px`; provenance: `figma-literal` at `502:25002`
        - Fact `root-item-01-text-cell-link-text-line-height`: `140%`; provenance: `figma-literal` at `502:25002`
        - Fact `root-item-01-text-cell-link-text-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:25002`
    - `root-item-01-chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `root-item-01-chevron-cell-chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `root-item-01-chevron-cell-chevron-icon-clips-content`: `true`; provenance: `figma-literal` at `502:25003`
        - Fact `root-item-01-chevron-cell-chevron-icon-display-width`: `24px`; provenance: `figma-literal` at `502:25003`
        - Fact `root-item-01-chevron-cell-chevron-icon-display-height`: `24px`; provenance: `figma-literal` at `502:25003`
  - `root-item-02` — role `item-02`; render `presentation-table`; visibility `always`
    - Fact `root-item-02-layout-direction`: `horizontal`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-item-gap`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-padding-top`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-padding-right`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-padding-bottom`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-padding-left`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-corner-radius`: `22px`; provenance: `figma-literal` at `502:25005`
    - Fact `root-item-02-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:25005`
    - `root-item-02-logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `root-item-02-logo-cell-fns-badge` — role `fns-badge`; render `direct-image`; visibility `always`; asset `fns-badge`
        - Fact `root-item-02-logo-cell-fns-badge-corner-radius`: `48px`; provenance: `figma-literal` at `502:25006`
        - Fact `root-item-02-logo-cell-fns-badge-clips-content`: `true`; provenance: `figma-literal` at `502:25006`
        - Fact `root-item-02-logo-cell-fns-badge-display-width`: `48px`; provenance: `figma-literal` at `502:25006`
        - Fact `root-item-02-logo-cell-fns-badge-display-height`: `48px`; provenance: `figma-literal` at `502:25006`
    - `root-item-02-text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `root-item-02-text-cell-link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `root-item-02-text-cell-link-text-fill-color`: `#000000`; provenance: `figma-literal` at `502:25007`
        - Fact `root-item-02-text-cell-link-text-font-size`: `14px`; provenance: `figma-literal` at `502:25007`
        - Fact `root-item-02-text-cell-link-text-line-height`: `140%`; provenance: `figma-literal` at `502:25007`
        - Fact `root-item-02-text-cell-link-text-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:25007`
    - `root-item-02-chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `root-item-02-chevron-cell-chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `root-item-02-chevron-cell-chevron-icon-clips-content`: `true`; provenance: `figma-literal` at `502:25008`
        - Fact `root-item-02-chevron-cell-chevron-icon-display-width`: `24px`; provenance: `figma-literal` at `502:25008`
        - Fact `root-item-02-chevron-cell-chevron-icon-display-height`: `24px`; provenance: `figma-literal` at `502:25008`

### Properties and variants

- Variant `desktop` — Figma node `502:25046`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `502:25047`; axes: `Viewport=Mobile`
- Direct Figma source: `502:25046`; `Viewport=Desktop`; reference frame 600×228px
- Direct Figma source: `502:25047`; `Viewport=Mobile`; reference frame 328×196px

### Assets and interaction

- Asset contract: `ofd-badge`
  - Owner layer: `ofd-badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `ofd-badge @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `fns-badge`
  - Owner layer: `fns-badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `fns-badge @4x`
  - Pixel dimensions: 192×192px
  - Aspect ratio: 48:48
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset contract: `chevron-icon`
  - Owner layer: `chevron-icon @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `chevron-icon @4x`
  - Pixel dimensions: 96×96px
  - Aspect ratio: 24:24
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Link: `mobile` `/contracts/mobile/root/children/0/children/0`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0` → `ofd-badge` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/1`
- Link: `mobile` `/contracts/mobile/root/children/0/children/2`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/2/children/0` → `chevron-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/0`
- Asset usage: `mobile` `/contracts/mobile/root/children/1/children/0/children/0` → `fns-badge` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/1`
- Link: `mobile` `/contracts/mobile/root/children/1/children/2`
- Asset usage: `mobile` `/contracts/mobile/root/children/1/children/2/children/0` → `chevron-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0` → `ofd-badge` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1`
- Link: `desktop` `/contracts/desktop/root/children/0/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/2/children/0` → `chevron-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/1/children/0/children/0` → `fns-badge` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/1`
- Link: `desktop` `/contracts/desktop/root/children/1/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/1/children/2/children/0` → `chevron-icon` as `direct-image`

### Constraints and dependencies

- Constraint `linked-cells-cover-entire-row` — scope `all`; kind `email-rendering`; severity `critical`; Description critical: Каждая видимая ячейка строки содержит ссылку с одним URL, чтобы кликабельной оставалась вся площадь строки без помещения таблицы внутрь ссылки.
- Constraint `two-distinct-logos` — scope `all`; kind `asset-export`; severity `critical`; Description critical: item-01 использует отдельный ofd-badge @4x, item-02 отдельный fns-badge @4x; эти изображения не заменяются общим bank-badge.
- Constraint `row-gap-is-auto-layout` — scope `all`; kind `layout`; severity `required`: Зазор между строками равен itemSpacing корня 8px Mobile / 12px Desktop; отдельного spacer-слоя нет.

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: banner-fiscal-check-link
PURPOSE: Группа кликабельных строк со ссылками на проверку фискального чека.
RENDER: HYBRID

CRITICAL
- Каждая видимая ячейка строки содержит ссылку с одним URL, чтобы кликабельной оставалась вся площадь строки без помещения таблицы внутрь ссылки.
- item-01 использует отдельный ofd-badge @4x, item-02 отдельный fns-badge @4x; эти изображения не заменяются общим bank-badge.
```

<!-- library: service; component-id: block-contact-support -->
## Block/Contact-Support

### Identity and purpose

- CUPIS ID: `block-contact-support`
- Status: `active`
- Library: `service`
- Semantic role: `block`
- Category: `contact-support`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#472:16999` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:83cc9a3777560f86d4b8f2857116055235772a3f7980571590220a8f4884639a`
- Purpose: Контактный блок поддержки с телефонным действием и ссылкой на раздел помощи.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Contact-Support` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×272px`; provenance: `figma-literal` at `472:16997`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `472:16997`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `472:16997`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `472:16997`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `472:16997`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `472:16997`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `472:16997`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `472:16997`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `472:16997`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×248px`; provenance: `figma-literal` at `459:27581`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27581`
    - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27581`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27581`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27581`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27581`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:27581`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `459:27581`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:27581`
    - `root-content-area-phone-cta` — role `phone-cta`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×68px`; provenance: `figma-literal` at `459:27582`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27582`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `459:27582`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:27582`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:27582`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:27582`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:27582`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27582`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27582`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27582`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27582`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:27582`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:27582`
      - `root-content-area-phone-cta-heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `459:27583`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `459:27583`
        - Fact `source-text`: `Возникли вопросы? Позвоните нам:`; provenance: `figma-literal` at `459:27583`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27583`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `459:27583`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `459:27583`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27583`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27583`
        - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `459:27583`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27583`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27583`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27583`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27583`
      - `root-content-area-phone-cta-phone-number` — role `phone-number`; render `html-link`; visibility `always`
        - Fact `reference-size`: `488×31px`; provenance: `figma-literal` at `459:27584`
        - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `459:27584`
        - Fact `source-text`: `+7 (495) 122-20-88`; provenance: `figma-literal` at `459:27584`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27584`
        - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `459:27584`
        - Fact `font-size`: `26px`; provenance: `figma-literal` at `459:27584`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27584`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27584`
        - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `459:27584`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27584`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27584`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27584`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27584`
    - `root-content-area-help-notice` — role `help-notice`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×92px`; provenance: `figma-literal` at `459:27585`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27585`
      - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27585`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27585`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27585`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27585`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:27585`
      - Fact `border-radius`: `18px`; provenance: `figma-literal` at `459:27585`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `459:27585`
      - `root-content-area-help-notice-help-text` — role `help-text`; render `html-text`; visibility `always`
        - Fact `reference-size`: `440×44px`; provenance: `figma-literal` at `459:27586`
        - Fact `source-text`: `Как снизить риски операций без согласия, читайте на нашем сайте в разделе «Помощь»`; provenance: `figma-literal` at `459:27586`
        - Fact `font-size`: `16px`; provenance: `figma-literal` at `459:27586`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27586`
        - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `459:27586`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27586`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27586`
        - Fact `styled-text-segments`: `[{"start":0,"end":74,"characters":"Как снизить риски операций без согласия, читайте на нашем сайте в разделе ","font_family":"Roboto","font_style":"Regular","font_size_px":16,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"NONE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#757678"}]},{"start":74,"end":82,"characters":"«Помощь»","font_family":"Roboto","font_style":"Regular","font_size_px":16,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"UNDERLINE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#00991F"}]}]`; provenance: `figma-literal` at `459:27586`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27586`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27586`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×233px`; provenance: `figma-literal` at `472:16998`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `472:16998`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `472:16998`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `472:16998`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `472:16998`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `472:16998`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `472:16998`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `472:16998`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `472:16998`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×217px`; provenance: `figma-literal` at `459:27602`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27602`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27602`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27602`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27602`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27602`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:27602`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:27602`
    - `root-content-area-phone-cta` — role `phone-cta`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×74px`; provenance: `figma-literal` at `459:27603`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27603`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `459:27603`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:27603`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:27603`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:27603`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:27603`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27603`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27603`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27603`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27603`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:27603`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:27603`
      - `root-content-area-phone-cta-heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×40px`; provenance: `figma-literal` at `459:27604`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `459:27604`
        - Fact `source-text`: `Возникли вопросы? Позвоните нам:`; provenance: `figma-literal` at `459:27604`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27604`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `459:27604`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `459:27604`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27604`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27604`
        - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `459:27604`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27604`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27604`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27604`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27604`
      - `root-content-area-phone-cta-phone-number` — role `phone-number`; render `html-link`; visibility `always`
        - Fact `reference-size`: `252×22px`; provenance: `figma-literal` at `459:27605`
        - Fact `text-color`: `#00991F`; provenance: `figma-literal` at `459:27605`
        - Fact `source-text`: `+7 (495) 122-20-88`; provenance: `figma-literal` at `459:27605`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27605`
        - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `459:27605`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `459:27605`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27605`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27605`
        - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `459:27605`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27605`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27605`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27605`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27605`
    - `root-content-area-help-notice` — role `help-notice`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×83px`; provenance: `figma-literal` at `459:27606`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27606`
      - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27606`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27606`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27606`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27606`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:27606`
      - Fact `border-radius`: `14px`; provenance: `figma-literal` at `459:27606`
      - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `459:27606`
      - `root-content-area-help-notice-help-text` — role `help-text`; render `html-text`; visibility `always`
        - Fact `reference-size`: `220×51px`; provenance: `figma-literal` at `459:27607`
        - Fact `source-text`: `Как снизить риски операций без согласия, читайте на нашем сайте в разделе «Помощь»`; provenance: `figma-literal` at `459:27607`
        - Fact `font-size`: `12px`; provenance: `figma-literal` at `459:27607`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27607`
        - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `459:27607`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27607`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27607`
        - Fact `styled-text-segments`: `[{"start":0,"end":74,"characters":"Как снизить риски операций без согласия, читайте на нашем сайте в разделе ","font_family":"Roboto","font_style":"Regular","font_size_px":12,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"NONE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#757678"}]},{"start":74,"end":82,"characters":"«Помощь»","font_family":"Roboto","font_style":"Regular","font_size_px":12,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"UNDERLINE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#00991F"}]}]`; provenance: `figma-literal` at `459:27607`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27607`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27607`

### Properties and variants

- Variant `desktop` — Figma node `472:16997`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `472:16998`; axes: `Viewport=Mobile`
- Direct Figma source: `472:16997`; `Viewport=Desktop`; reference frame 600×272px
- Direct Figma source: `472:16998`; `Viewport=Mobile`; reference frame 328×233px

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0/children/0/children/1`
- Link: `desktop` `/contracts/desktop/root/children/0/children/0/children/1`

### Constraints and dependencies

- Constraint `inline-help-link` — scope `all`; kind `interaction`; severity `critical`; Description critical: Ссылка «Помощь» находится внутри одного help-text: базовый цвет #757678, встроенная ссылка #00991F с underline; URL поступает из данных письма.
- Constraint `phone-link` — scope `all`; kind `interaction`; severity `critical`: Номер +7 (495) 122-20-88 — HTML-ссылка tel:+74951222088 в обеих версиях; href не придумывать и не заменять URL сайта.

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-contact-support
PURPOSE: Контактный блок поддержки с телефонным действием и ссылкой на раздел помощи.
RENDER: HTML

CRITICAL
- Ссылка «Помощь» находится внутри одного help-text: базовый цвет #757678, встроенная ссылка #00991F с underline; URL поступает из данных письма.
```

<!-- library: service; component-id: block-instruction-steps -->
## Block/Instruction-Steps

### Identity and purpose

- CUPIS ID: `block-instruction-steps`
- Status: `active`
- Library: `service`
- Semantic role: `block`
- Category: `instruction-steps`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#510:16701` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:0a9f3fccc21ca769c773281f0afc5bf8aa6f756731c1642fa1a9acc6a7106f93`
- Purpose: Сервисный блок с инструкцией, нумерованными шагами и управляемыми предупреждениями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Instruction-Steps` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `root-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16699`
  - Fact `root-padding-top`: `24px`; provenance: `figma-literal` at `510:16699`
  - Fact `root-padding-right`: `24px`; provenance: `figma-literal` at `510:16699`
  - Fact `root-padding-left`: `24px`; provenance: `figma-literal` at `510:16699`
  - Fact `root-clips-content`: `true`; provenance: `figma-literal` at `510:16699`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `root-content-area-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-item-gap`: `24px`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-padding-top`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-padding-right`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-padding-bottom`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-padding-left`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-corner-radius`: `26px`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-clips-content`: `true`; provenance: `figma-literal` at `510:16433`
    - Fact `root-content-area-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `510:16433`
    - `root-content-area-warning` — role `warning`; render `presentation-table`; visibility property `show-warning` (`Show Warning`)
      - Fact `root-content-area-warning-layout-direction`: `horizontal`; provenance: `figma-literal` at `531:13984`
      - Fact `root-content-area-warning-item-gap`: `6px`; provenance: `figma-literal` at `531:13984`
      - `root-content-area-warning-error-warning-line` — role `error-warning-line`; render `direct-image`; visibility `always`; asset `error-warning-line`
        - Fact `root-content-area-warning-error-warning-line-clips-content`: `true`; provenance: `figma-literal` at `531:13974`
        - Fact `root-content-area-warning-error-warning-line-display-width`: `24px`; provenance: `figma-literal` at `531:13974`
        - Fact `root-content-area-warning-error-warning-line-display-height`: `24px`; provenance: `figma-literal` at `531:13974`
      - `root-content-area-warning-warning-text` — role `warning-text`; render `html-text`; visibility `always`
        - Fact `root-content-area-warning-warning-text-fill-color`: `#DE2141`; provenance: `figma-literal` at `531:13896`
        - Fact `root-content-area-warning-warning-text-font-size`: `18px`; provenance: `figma-literal` at `531:13896`
        - Fact `root-content-area-warning-warning-text-line-height`: `140%`; provenance: `figma-literal` at `531:13896`
        - Fact `root-content-area-warning-warning-text-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `531:13896`
    - `root-content-area-numbered-list` — role `numbered-list`; render `presentation-table`; visibility `always`
      - Fact `root-content-area-numbered-list-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16442`
      - Fact `root-content-area-numbered-list-item-gap`: `12px`; provenance: `figma-literal` at `510:16442`
      - Fact `root-content-area-numbered-list-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16442`
      - `root-content-area-numbered-list-intro-01` — role `intro-01`; render `html-text`; visibility `always`
        - Fact `root-content-area-numbered-list-intro-01-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16443`
        - Fact `root-content-area-numbered-list-intro-01-font-size`: `18px`; provenance: `figma-literal` at `510:16443`
        - Fact `root-content-area-numbered-list-intro-01-line-height`: `140%`; provenance: `figma-literal` at `510:16443`
        - Fact `root-content-area-numbered-list-intro-01-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16443`
      - `root-content-area-numbered-list-intro-02` — role `intro-02`; render `html-text`; visibility `always`
        - Fact `root-content-area-numbered-list-intro-02-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16517`
        - Fact `root-content-area-numbered-list-intro-02-font-size`: `18px`; provenance: `figma-literal` at `510:16517`
        - Fact `root-content-area-numbered-list-intro-02-line-height`: `140%`; provenance: `figma-literal` at `510:16517`
        - Fact `root-content-area-numbered-list-intro-02-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16517`
      - `root-content-area-numbered-list-item-01` — role `item-01`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-01-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16444`
        - Fact `root-content-area-numbered-list-item-01-item-gap`: `6px`; provenance: `figma-literal` at `510:16444`
        - Fact `root-content-area-numbered-list-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16444`
        - `root-content-area-numbered-list-item-01-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-01-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16445`
          - Fact `root-content-area-numbered-list-item-01-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16445`
          - Fact `root-content-area-numbered-list-item-01-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16445`
          - `root-content-area-numbered-list-item-01-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16446`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-font-size`: `18px`; provenance: `figma-literal` at `510:16446`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16446`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16446`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16446`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-fixed-width`: `32px`; provenance: `figma-literal` at `510:16446`
          - `root-content-area-numbered-list-item-01-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16447`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-font-size`: `18px`; provenance: `figma-literal` at `510:16447`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16447`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16447`
        - `root-content-area-numbered-list-item-01-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-01-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16448`
          - Fact `root-content-area-numbered-list-item-01-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16448`
          - Fact `root-content-area-numbered-list-item-01-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16448`
          - `root-content-area-numbered-list-item-01-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16449`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-font-size`: `18px`; provenance: `figma-literal` at `510:16449`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16449`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16449`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16449`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-fixed-width`: `64px`; provenance: `figma-literal` at `510:16449`
          - `root-content-area-numbered-list-item-01-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16450`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-font-size`: `18px`; provenance: `figma-literal` at `510:16450`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16450`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16450`
      - `root-content-area-numbered-list-item-02` — role `item-02`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-02-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16457`
        - Fact `root-content-area-numbered-list-item-02-item-gap`: `6px`; provenance: `figma-literal` at `510:16457`
        - Fact `root-content-area-numbered-list-item-02-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16457`
        - `root-content-area-numbered-list-item-02-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-02-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16458`
          - Fact `root-content-area-numbered-list-item-02-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16458`
          - Fact `root-content-area-numbered-list-item-02-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16458`
          - `root-content-area-numbered-list-item-02-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16459`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-font-size`: `18px`; provenance: `figma-literal` at `510:16459`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16459`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16459`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16459`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-fixed-width`: `32px`; provenance: `figma-literal` at `510:16459`
          - `root-content-area-numbered-list-item-02-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16460`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-font-size`: `18px`; provenance: `figma-literal` at `510:16460`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16460`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16460`
        - `root-content-area-numbered-list-item-02-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-02-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16461`
          - Fact `root-content-area-numbered-list-item-02-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16461`
          - Fact `root-content-area-numbered-list-item-02-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16461`
          - `root-content-area-numbered-list-item-02-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16462`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-font-size`: `18px`; provenance: `figma-literal` at `510:16462`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16462`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16462`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16462`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-fixed-width`: `64px`; provenance: `figma-literal` at `510:16462`
          - `root-content-area-numbered-list-item-02-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16463`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-font-size`: `18px`; provenance: `figma-literal` at `510:16463`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16463`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16463`
      - `root-content-area-numbered-list-item-03` — role `item-03`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-03-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16470`
        - Fact `root-content-area-numbered-list-item-03-item-gap`: `6px`; provenance: `figma-literal` at `510:16470`
        - Fact `root-content-area-numbered-list-item-03-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16470`
        - `root-content-area-numbered-list-item-03-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-03-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16471`
          - Fact `root-content-area-numbered-list-item-03-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16471`
          - Fact `root-content-area-numbered-list-item-03-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16471`
          - `root-content-area-numbered-list-item-03-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16472`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-font-size`: `18px`; provenance: `figma-literal` at `510:16472`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16472`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16472`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16472`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-fixed-width`: `32px`; provenance: `figma-literal` at `510:16472`
          - `root-content-area-numbered-list-item-03-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16473`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-font-size`: `18px`; provenance: `figma-literal` at `510:16473`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16473`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16473`
        - `root-content-area-numbered-list-item-03-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-03-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16474`
          - Fact `root-content-area-numbered-list-item-03-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16474`
          - Fact `root-content-area-numbered-list-item-03-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16474`
          - `root-content-area-numbered-list-item-03-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16475`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-font-size`: `18px`; provenance: `figma-literal` at `510:16475`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16475`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16475`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16475`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-fixed-width`: `64px`; provenance: `figma-literal` at `510:16475`
          - `root-content-area-numbered-list-item-03-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16476`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-font-size`: `18px`; provenance: `figma-literal` at `510:16476`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16476`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16476`
      - `root-content-area-numbered-list-item-04` — role `item-04`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-04-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16483`
        - Fact `root-content-area-numbered-list-item-04-item-gap`: `6px`; provenance: `figma-literal` at `510:16483`
        - Fact `root-content-area-numbered-list-item-04-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16483`
        - `root-content-area-numbered-list-item-04-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-04-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16484`
          - Fact `root-content-area-numbered-list-item-04-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16484`
          - Fact `root-content-area-numbered-list-item-04-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16484`
          - `root-content-area-numbered-list-item-04-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16485`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-font-size`: `18px`; provenance: `figma-literal` at `510:16485`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16485`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16485`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16485`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-fixed-width`: `32px`; provenance: `figma-literal` at `510:16485`
          - `root-content-area-numbered-list-item-04-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16486`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-font-size`: `18px`; provenance: `figma-literal` at `510:16486`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16486`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16486`
        - `root-content-area-numbered-list-item-04-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-04-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16487`
          - Fact `root-content-area-numbered-list-item-04-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16487`
          - Fact `root-content-area-numbered-list-item-04-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16487`
          - `root-content-area-numbered-list-item-04-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16488`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-font-size`: `18px`; provenance: `figma-literal` at `510:16488`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16488`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16488`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16488`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-fixed-width`: `64px`; provenance: `figma-literal` at `510:16488`
          - `root-content-area-numbered-list-item-04-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16489`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-font-size`: `18px`; provenance: `figma-literal` at `510:16489`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16489`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16489`
    - `root-content-area-alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
      - Fact `root-content-area-alert-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16497`
      - Fact `root-content-area-alert-padding-top`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `root-content-area-alert-padding-right`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `root-content-area-alert-padding-bottom`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `root-content-area-alert-padding-left`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `root-content-area-alert-corner-radius`: `18px`; provenance: `figma-literal` at `510:16497`
      - Fact `root-content-area-alert-fill-color`: `#FFF1C9`; provenance: `figma-literal` at `510:16497`
      - `root-content-area-alert-notice-link` — role `notice-link`; render `html-text`; visibility `always`
        - Fact `root-content-area-alert-notice-link-fill-color`: `#AA7100`; provenance: `figma-literal` at `510:16498`
        - Fact `root-content-area-alert-notice-link-text-style`: `Desktop/Caption`; provenance: `figma-literal` at `510:16498`
        - Fact `root-content-area-alert-notice-link-segment-1-color`: `#AA7100`; provenance: `figma-literal` at `510:16498`
        - Fact `root-content-area-alert-notice-link-segment-2-color`: `#AA7100`; provenance: `figma-literal` at `510:16498`
        - Fact `root-content-area-alert-notice-link-segment-2-decoration`: `underline`; provenance: `figma-literal` at `510:16498`
    - `root-content-area-disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
      - Fact `root-content-area-disclaimer-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16499`
      - Fact `root-content-area-disclaimer-item-gap`: `12px`; provenance: `figma-literal` at `510:16499`
      - Fact `root-content-area-disclaimer-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16499`
      - `root-content-area-disclaimer-disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
        - Fact `root-content-area-disclaimer-disclaimer-text-fill-color`: `#98999C`; provenance: `figma-literal` at `510:16501`
        - Fact `root-content-area-disclaimer-disclaimer-text-font-size`: `14px`; provenance: `figma-literal` at `510:16501`
        - Fact `root-content-area-disclaimer-disclaimer-text-line-height`: `140%`; provenance: `figma-literal` at `510:16501`
        - Fact `root-content-area-disclaimer-disclaimer-text-text-style`: `Desktop/Caption`; provenance: `figma-literal` at `510:16501`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `root-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16700`
  - Fact `root-padding-top`: `16px`; provenance: `figma-literal` at `510:16700`
  - Fact `root-padding-right`: `16px`; provenance: `figma-literal` at `510:16700`
  - Fact `root-padding-left`: `16px`; provenance: `figma-literal` at `510:16700`
  - Fact `root-clips-content`: `true`; provenance: `figma-literal` at `510:16700`
  - `root-content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `root-content-area-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-item-gap`: `16px`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-padding-top`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-padding-right`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-padding-bottom`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-padding-left`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-corner-radius`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-clips-content`: `true`; provenance: `figma-literal` at `510:16615`
    - Fact `root-content-area-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `510:16615`
    - `root-content-area-warning` — role `warning`; render `presentation-table`; visibility property `show-warning` (`Show Warning`)
      - Fact `root-content-area-warning-layout-direction`: `horizontal`; provenance: `figma-literal` at `531:14001`
      - Fact `root-content-area-warning-item-gap`: `4px`; provenance: `figma-literal` at `531:14001`
      - `root-content-area-warning-error-warning-line` — role `error-warning-line`; render `direct-image`; visibility `always`; asset `error-warning-line`
        - Fact `root-content-area-warning-error-warning-line-clips-content`: `true`; provenance: `figma-literal` at `531:14002`
        - Fact `root-content-area-warning-error-warning-line-display-width`: `20px`; provenance: `figma-literal` at `531:14002`
        - Fact `root-content-area-warning-error-warning-line-display-height`: `20px`; provenance: `figma-literal` at `531:14002`
      - `root-content-area-warning-warning-text` — role `warning-text`; render `html-text`; visibility `always`
        - Fact `root-content-area-warning-warning-text-fill-color`: `#DE2141`; provenance: `figma-literal` at `531:14004`
        - Fact `root-content-area-warning-warning-text-font-size`: `14px`; provenance: `figma-literal` at `531:14004`
        - Fact `root-content-area-warning-warning-text-line-height`: `140%`; provenance: `figma-literal` at `531:14004`
        - Fact `root-content-area-warning-warning-text-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `531:14004`
    - `root-content-area-numbered-list` — role `numbered-list`; render `presentation-table`; visibility `always`
      - Fact `root-content-area-numbered-list-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16624`
      - Fact `root-content-area-numbered-list-item-gap`: `8px`; provenance: `figma-literal` at `510:16624`
      - Fact `root-content-area-numbered-list-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16624`
      - `root-content-area-numbered-list-intro-01` — role `intro-01`; render `html-text`; visibility `always`
        - Fact `root-content-area-numbered-list-intro-01-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16625`
        - Fact `root-content-area-numbered-list-intro-01-font-size`: `14px`; provenance: `figma-literal` at `510:16625`
        - Fact `root-content-area-numbered-list-intro-01-line-height`: `140%`; provenance: `figma-literal` at `510:16625`
        - Fact `root-content-area-numbered-list-intro-01-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16625`
      - `root-content-area-numbered-list-intro-02` — role `intro-02`; render `html-text`; visibility `always`
        - Fact `root-content-area-numbered-list-intro-02-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16959`
        - Fact `root-content-area-numbered-list-intro-02-font-size`: `14px`; provenance: `figma-literal` at `510:16959`
        - Fact `root-content-area-numbered-list-intro-02-line-height`: `140%`; provenance: `figma-literal` at `510:16959`
        - Fact `root-content-area-numbered-list-intro-02-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16959`
      - `root-content-area-numbered-list-item-01` — role `item-01`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-01-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16626`
        - Fact `root-content-area-numbered-list-item-01-item-gap`: `4px`; provenance: `figma-literal` at `510:16626`
        - Fact `root-content-area-numbered-list-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16626`
        - `root-content-area-numbered-list-item-01-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-01-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16627`
          - Fact `root-content-area-numbered-list-item-01-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16627`
          - Fact `root-content-area-numbered-list-item-01-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16627`
          - `root-content-area-numbered-list-item-01-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16628`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-font-size`: `14px`; provenance: `figma-literal` at `510:16628`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16628`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16628`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16628`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-number-fixed-width`: `22px`; provenance: `figma-literal` at `510:16628`
          - `root-content-area-numbered-list-item-01-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16629`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-font-size`: `14px`; provenance: `figma-literal` at `510:16629`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16629`
            - Fact `root-content-area-numbered-list-item-01-numbered-row-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16629`
        - `root-content-area-numbered-list-item-01-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-01-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16630`
          - Fact `root-content-area-numbered-list-item-01-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16630`
          - Fact `root-content-area-numbered-list-item-01-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16630`
          - `root-content-area-numbered-list-item-01-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16631`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-font-size`: `12px`; provenance: `figma-literal` at `510:16631`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16631`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16631`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16631`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-dash-fixed-width`: `42px`; provenance: `figma-literal` at `510:16631`
          - `root-content-area-numbered-list-item-01-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16632`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-font-size`: `14px`; provenance: `figma-literal` at `510:16632`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16632`
            - Fact `root-content-area-numbered-list-item-01-sub-item-01-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16632`
      - `root-content-area-numbered-list-item-02` — role `item-02`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-02-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16639`
        - Fact `root-content-area-numbered-list-item-02-item-gap`: `4px`; provenance: `figma-literal` at `510:16639`
        - Fact `root-content-area-numbered-list-item-02-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16639`
        - `root-content-area-numbered-list-item-02-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-02-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16640`
          - Fact `root-content-area-numbered-list-item-02-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16640`
          - Fact `root-content-area-numbered-list-item-02-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16640`
          - `root-content-area-numbered-list-item-02-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16641`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-font-size`: `14px`; provenance: `figma-literal` at `510:16641`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16641`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16641`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16641`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-number-fixed-width`: `22px`; provenance: `figma-literal` at `510:16641`
          - `root-content-area-numbered-list-item-02-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16642`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-font-size`: `14px`; provenance: `figma-literal` at `510:16642`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16642`
            - Fact `root-content-area-numbered-list-item-02-numbered-row-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16642`
        - `root-content-area-numbered-list-item-02-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-02-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16643`
          - Fact `root-content-area-numbered-list-item-02-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16643`
          - Fact `root-content-area-numbered-list-item-02-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16643`
          - `root-content-area-numbered-list-item-02-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16644`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-font-size`: `12px`; provenance: `figma-literal` at `510:16644`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16644`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16644`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16644`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-dash-fixed-width`: `42px`; provenance: `figma-literal` at `510:16644`
          - `root-content-area-numbered-list-item-02-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16645`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-font-size`: `14px`; provenance: `figma-literal` at `510:16645`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16645`
            - Fact `root-content-area-numbered-list-item-02-sub-item-01-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16645`
      - `root-content-area-numbered-list-item-03` — role `item-03`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-03-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16652`
        - Fact `root-content-area-numbered-list-item-03-item-gap`: `4px`; provenance: `figma-literal` at `510:16652`
        - Fact `root-content-area-numbered-list-item-03-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16652`
        - `root-content-area-numbered-list-item-03-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-03-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16653`
          - Fact `root-content-area-numbered-list-item-03-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16653`
          - Fact `root-content-area-numbered-list-item-03-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16653`
          - `root-content-area-numbered-list-item-03-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16654`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-font-size`: `14px`; provenance: `figma-literal` at `510:16654`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16654`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16654`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16654`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-number-fixed-width`: `22px`; provenance: `figma-literal` at `510:16654`
          - `root-content-area-numbered-list-item-03-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16655`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-font-size`: `14px`; provenance: `figma-literal` at `510:16655`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16655`
            - Fact `root-content-area-numbered-list-item-03-numbered-row-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16655`
        - `root-content-area-numbered-list-item-03-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-03-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16656`
          - Fact `root-content-area-numbered-list-item-03-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16656`
          - Fact `root-content-area-numbered-list-item-03-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16656`
          - `root-content-area-numbered-list-item-03-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16657`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-font-size`: `12px`; provenance: `figma-literal` at `510:16657`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16657`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16657`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16657`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-dash-fixed-width`: `42px`; provenance: `figma-literal` at `510:16657`
          - `root-content-area-numbered-list-item-03-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16658`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-font-size`: `14px`; provenance: `figma-literal` at `510:16658`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16658`
            - Fact `root-content-area-numbered-list-item-03-sub-item-01-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16658`
      - `root-content-area-numbered-list-item-04` — role `item-04`; render `presentation-table`; visibility `always`
        - Fact `root-content-area-numbered-list-item-04-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16665`
        - Fact `root-content-area-numbered-list-item-04-item-gap`: `4px`; provenance: `figma-literal` at `510:16665`
        - Fact `root-content-area-numbered-list-item-04-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16665`
        - `root-content-area-numbered-list-item-04-numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-04-numbered-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16666`
          - Fact `root-content-area-numbered-list-item-04-numbered-row-item-gap`: `12px`; provenance: `figma-literal` at `510:16666`
          - Fact `root-content-area-numbered-list-item-04-numbered-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16666`
          - `root-content-area-numbered-list-item-04-numbered-row-number` — role `number`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16667`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-font-size`: `14px`; provenance: `figma-literal` at `510:16667`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-line-height`: `140%`; provenance: `figma-literal` at `510:16667`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16667`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-text-align`: `right`; provenance: `figma-literal` at `510:16667`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-number-fixed-width`: `22px`; provenance: `figma-literal` at `510:16667`
          - `root-content-area-numbered-list-item-04-numbered-row-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16668`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-font-size`: `14px`; provenance: `figma-literal` at `510:16668`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-line-height`: `140%`; provenance: `figma-literal` at `510:16668`
            - Fact `root-content-area-numbered-list-item-04-numbered-row-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16668`
        - `root-content-area-numbered-list-item-04-sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `root-content-area-numbered-list-item-04-sub-item-01-layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16669`
          - Fact `root-content-area-numbered-list-item-04-sub-item-01-item-gap`: `12px`; provenance: `figma-literal` at `510:16669`
          - Fact `root-content-area-numbered-list-item-04-sub-item-01-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16669`
          - `root-content-area-numbered-list-item-04-sub-item-01-dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-fill-color`: `#00991F`; provenance: `figma-literal` at `510:16670`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-font-size`: `12px`; provenance: `figma-literal` at `510:16670`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-line-height`: `140%`; provenance: `figma-literal` at `510:16670`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16670`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-text-align`: `right`; provenance: `figma-literal` at `510:16670`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-dash-fixed-width`: `42px`; provenance: `figma-literal` at `510:16670`
          - `root-content-area-numbered-list-item-04-sub-item-01-content` — role `content`; render `html-text`; visibility `always`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-fill-color`: `#48494A`; provenance: `figma-literal` at `510:16671`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-font-size`: `14px`; provenance: `figma-literal` at `510:16671`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-line-height`: `140%`; provenance: `figma-literal` at `510:16671`
            - Fact `root-content-area-numbered-list-item-04-sub-item-01-content-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16671`
    - `root-content-area-alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
      - Fact `root-content-area-alert-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-item-gap`: `4px`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-padding-top`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-padding-right`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-padding-bottom`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-padding-left`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-corner-radius`: `14px`; provenance: `figma-literal` at `510:16679`
      - Fact `root-content-area-alert-fill-color`: `#FFF1C9`; provenance: `figma-literal` at `510:16679`
      - `root-content-area-alert-notice-link` — role `notice-link`; render `html-text`; visibility `always`
        - Fact `root-content-area-alert-notice-link-fill-color`: `#AA7100`; provenance: `figma-literal` at `510:16680`
        - Fact `root-content-area-alert-notice-link-text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16680`
        - Fact `root-content-area-alert-notice-link-segment-1-color`: `#AA7100`; provenance: `figma-literal` at `510:16680`
        - Fact `root-content-area-alert-notice-link-segment-2-color`: `#AA7100`; provenance: `figma-literal` at `510:16680`
        - Fact `root-content-area-alert-notice-link-segment-2-decoration`: `underline`; provenance: `figma-literal` at `510:16680`
    - `root-content-area-disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
      - Fact `root-content-area-disclaimer-layout-direction`: `vertical`; provenance: `figma-literal` at `510:16681`
      - Fact `root-content-area-disclaimer-item-gap`: `12px`; provenance: `figma-literal` at `510:16681`
      - Fact `root-content-area-disclaimer-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16681`
      - `root-content-area-disclaimer-disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
        - Fact `root-content-area-disclaimer-disclaimer-text-fill-color`: `#98999C`; provenance: `figma-literal` at `510:16683`
        - Fact `root-content-area-disclaimer-disclaimer-text-font-size`: `12px`; provenance: `figma-literal` at `510:16683`
        - Fact `root-content-area-disclaimer-disclaimer-text-line-height`: `140%`; provenance: `figma-literal` at `510:16683`
        - Fact `root-content-area-disclaimer-disclaimer-text-text-style`: `Mobile/Caption`; provenance: `figma-literal` at `510:16683`

### Properties and variants

- Variant `mobile` — Figma node `510:16700`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `510:16699`; axes: `Viewport=Desktop`
- Direct Figma source: `510:16699`; `Viewport=Desktop`; reference frame 600×912px
- Direct Figma source: `510:16700`; `Viewport=Mobile`; reference frame 328×906px
- Property `show-alert` (`Show Alert`) — `boolean`; default `true`
- Property `show-disclaimer` (`Show Disclaimer`) — `boolean`; default `true`
- Property `show-warning` (`Show Warning`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `error-warning-line`
  - Owner layer: `error-warning-line @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `error-warning-line @4x`
  - Pixel dimensions: 96×96px
  - Aspect ratio: 24:24
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0` → `error-warning-line` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0` → `error-warning-line` as `direct-image`

### Constraints and dependencies

- Constraint `fixed-list-marker-columns` — scope `all`; kind `email-rendering`; severity `critical`; Description critical: Number и dash занимают фиксированные колонки 22px и 42px Mobile / 32px и 64px Desktop; промежуток до HTML-текста 12px в обеих версиях.

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-instruction-steps
PURPOSE: Сервисный блок с инструкцией, нумерованными шагами и управляемыми предупреждениями.
RENDER: HYBRID

CRITICAL
- Number и dash занимают фиксированные колонки 22px и 42px Mobile / 32px и 64px Desktop; промежуток до HTML-текста 12px в обеих версиях.
```

<!-- library: service; component-id: block-personal-data-update -->
## Block/Personal-Data-Update

### Identity and purpose

- CUPIS ID: `block-personal-data-update`
- Status: `active`
- Library: `service`
- Semantic role: `block`
- Category: `personal-data-update`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#497:26055` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:a1e6fa18f8b2f7f709222227f8eea53f772ab48abed4485d5ec1aecd04e77c28`
- Purpose: Сервисный блок обновления персональных данных со статусом и управляемыми пояснениями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Personal-Data-Update` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `root-layout-direction`: `vertical`; provenance: `figma-literal` at `491:22454`
  - Fact `root-padding-top`: `24px`; provenance: `figma-literal` at `491:22454`
  - Fact `root-padding-right`: `24px`; provenance: `figma-literal` at `491:22454`
  - Fact `root-padding-left`: `24px`; provenance: `figma-literal` at `491:22454`
  - Fact `root-clips-content`: `true`; provenance: `figma-literal` at `491:22454`
  - `root-card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `root-card-layout-direction`: `vertical`; provenance: `figma-literal` at `619:21431`
    - Fact `root-card-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21431`
    - Fact `root-card-corner-radius`: `26px`; provenance: `figma-literal` at `619:21431`
    - Fact `root-card-clips-content`: `true`; provenance: `figma-literal` at `619:21431`
    - `root-card-status-area` — role `status-area`; render `presentation-table`; visibility `always`
      - Fact `root-card-status-area-layout-direction`: `vertical`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-item-gap`: `24px`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-padding-top`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-padding-right`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-padding-bottom`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-padding-left`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-clips-content`: `true`; provenance: `figma-literal` at `491:22404`
      - Fact `root-card-status-area-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `491:22404`
      - `root-card-status-area-status-row` — role `status-row`; render `presentation-table`; visibility `always`
        - Fact `root-card-status-area-status-row-layout-direction`: `horizontal`; provenance: `figma-literal` at `491:22405`
        - Fact `root-card-status-area-status-row-item-gap`: `24px`; provenance: `figma-literal` at `491:22405`
        - Fact `root-card-status-area-status-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22405`
        - `root-card-status-area-status-row-status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
          - Fact `root-card-status-area-status-row-status-badge-positive-corner-radius`: `56.000003814697266px`; provenance: `figma-literal` at `491:22406`
          - Fact `root-card-status-area-status-row-status-badge-positive-clips-content`: `true`; provenance: `figma-literal` at `491:22406`
          - Fact `root-card-status-area-status-row-status-badge-positive-display-width`: `72px`; provenance: `figma-literal` at `491:22406`
          - Fact `root-card-status-area-status-row-status-badge-positive-display-height`: `72px`; provenance: `figma-literal` at `491:22406`
        - `root-card-status-area-status-row-heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `root-card-status-area-status-row-heading-fill-color`: `#000000`; provenance: `figma-literal` at `491:22407`
          - Fact `root-card-status-area-status-row-heading-font-size`: `26px`; provenance: `figma-literal` at `491:22407`
          - Fact `root-card-status-area-status-row-heading-line-height`: `120%`; provenance: `figma-literal` at `491:22407`
          - Fact `root-card-status-area-status-row-heading-text-style`: `Desktop/Heading`; provenance: `figma-literal` at `491:22407`
    - `root-card-divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `root-card-divider-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22408`
      - Fact `root-card-divider-clips-content`: `true`; provenance: `figma-literal` at `491:22408`
      - Fact `root-card-divider-fill-color`: `#DFDFE0`; provenance: `figma-literal` at `491:22408`
      - Fact `root-card-divider-height`: `1px`; provenance: `figma-literal` at `491:22408`
    - `root-card-body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `root-card-body-area-layout-direction`: `vertical`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-item-gap`: `24px`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-padding-top`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-padding-right`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-padding-bottom`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-padding-left`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-clips-content`: `true`; provenance: `figma-literal` at `491:22409`
      - Fact `root-card-body-area-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `491:22409`
      - `root-card-body-area-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `root-card-body-area-text-content-layout-direction`: `vertical`; provenance: `figma-literal` at `491:22410`
        - Fact `root-card-body-area-text-content-item-gap`: `12px`; provenance: `figma-literal` at `491:22410`
        - Fact `root-card-body-area-text-content-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22410`
        - `root-card-body-area-text-content-greeting` — role `greeting`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-greeting-fill-color`: `#48494A`; provenance: `figma-literal` at `491:22411`
          - Fact `root-card-body-area-text-content-greeting-font-size`: `18px`; provenance: `figma-literal` at `491:22411`
          - Fact `root-card-body-area-text-content-greeting-line-height`: `140%`; provenance: `figma-literal` at `491:22411`
          - Fact `root-card-body-area-text-content-greeting-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22411`
        - `root-card-body-area-text-content-body-01` — role `body-01`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-body-01-fill-color`: `#48494A`; provenance: `figma-literal` at `491:22412`
          - Fact `root-card-body-area-text-content-body-01-font-size`: `18px`; provenance: `figma-literal` at `491:22412`
          - Fact `root-card-body-area-text-content-body-01-line-height`: `140%`; provenance: `figma-literal` at `491:22412`
          - Fact `root-card-body-area-text-content-body-01-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22412`
        - `root-card-body-area-text-content-body-02` — role `body-02`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-body-02-fill-color`: `#48494A`; provenance: `figma-literal` at `491:22413`
          - Fact `root-card-body-area-text-content-body-02-font-size`: `18px`; provenance: `figma-literal` at `491:22413`
          - Fact `root-card-body-area-text-content-body-02-line-height`: `140%`; provenance: `figma-literal` at `491:22413`
          - Fact `root-card-body-area-text-content-body-02-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22413`
        - `root-card-body-area-text-content-warning-text` — role `warning-text`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-warning-text-fill-color`: `#48494A`; provenance: `figma-literal` at `491:22414`
          - Fact `root-card-body-area-text-content-warning-text-font-size`: `18px`; provenance: `figma-literal` at `491:22414`
          - Fact `root-card-body-area-text-content-warning-text-line-height`: `140%`; provenance: `figma-literal` at `491:22414`
          - Fact `root-card-body-area-text-content-warning-text-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22414`
        - `root-card-body-area-text-content-sign-off` — role `sign-off`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-sign-off-fill-color`: `#48494A`; provenance: `figma-literal` at `491:22415`
          - Fact `root-card-body-area-text-content-sign-off-font-size`: `18px`; provenance: `figma-literal` at `491:22415`
          - Fact `root-card-body-area-text-content-sign-off-line-height`: `140%`; provenance: `figma-literal` at `491:22415`
          - Fact `root-card-body-area-text-content-sign-off-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22415`
        - `root-card-body-area-text-content-action-link` — role `action-link`; render `html-link`; visibility `always`
          - Fact `root-card-body-area-text-content-action-link-fill-color`: `#18B037`; provenance: `figma-literal` at `494:19991`
          - Fact `root-card-body-area-text-content-action-link-font-size`: `18px`; provenance: `figma-literal` at `494:19991`
          - Fact `root-card-body-area-text-content-action-link-line-height`: `140%`; provenance: `figma-literal` at `494:19991`
          - Fact `root-card-body-area-text-content-action-link-text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `494:19991`
        - `root-card-body-area-text-content-link-expiry` — role `link-expiry`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-link-expiry-fill-color`: `#98999C`; provenance: `figma-literal` at `494:19985`
          - Fact `root-card-body-area-text-content-link-expiry-font-size`: `14px`; provenance: `figma-literal` at `494:19985`
          - Fact `root-card-body-area-text-content-link-expiry-line-height`: `140%`; provenance: `figma-literal` at `494:19985`
          - Fact `root-card-body-area-text-content-link-expiry-text-style`: `Desktop/Caption`; provenance: `figma-literal` at `494:19985`
      - `root-card-body-area-suspicious-operation-details` — role `suspicious-operation-details`; render `nested-component`; visibility property `show-operation-description` (`Show Operation Description`); component `details-suspicious-operation` (`Details/Suspicious-Operation`)
        - Fact `root-card-body-area-suspicious-operation-details-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-item-gap`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-padding-top`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-padding-right`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-padding-bottom`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-padding-left`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-corner-radius`: `18px`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-fill-color`: `#F8F8FA`; provenance: `figma-literal` at `497:25970`
        - Fact `root-card-body-area-suspicious-operation-details-instance-viewport`: `Desktop`; provenance: `figma-literal` at `497:25970`
      - `root-card-body-area-alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
        - Fact `root-card-body-area-alert-layout-direction`: `horizontal`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-padding-top`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-padding-right`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-padding-bottom`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-padding-left`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-corner-radius`: `18px`; provenance: `figma-literal` at `491:22450`
        - Fact `root-card-body-area-alert-fill-color`: `#FFF1C9`; provenance: `figma-literal` at `491:22450`
        - `root-card-body-area-alert-notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-alert-notice-link-fill-color`: `#AA7100`; provenance: `figma-literal` at `491:22451`
          - Fact `root-card-body-area-alert-notice-link-text-style`: `Desktop/Caption`; provenance: `figma-literal` at `491:22451`
          - Fact `root-card-body-area-alert-notice-link-segment-1-color`: `#AA7100`; provenance: `figma-literal` at `491:22451`
          - Fact `root-card-body-area-alert-notice-link-segment-2-color`: `#AA7100`; provenance: `figma-literal` at `491:22451`
          - Fact `root-card-body-area-alert-notice-link-segment-2-decoration`: `underline`; provenance: `figma-literal` at `491:22451`
      - `root-card-body-area-disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
        - Fact `root-card-body-area-disclaimer-layout-direction`: `vertical`; provenance: `figma-literal` at `491:22455`
        - Fact `root-card-body-area-disclaimer-item-gap`: `12px`; provenance: `figma-literal` at `491:22455`
        - Fact `root-card-body-area-disclaimer-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22455`
        - `root-card-body-area-disclaimer-disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-fill-color`: `#98999C`; provenance: `figma-literal` at `491:22417`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-font-size`: `14px`; provenance: `figma-literal` at `491:22417`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-line-height`: `140%`; provenance: `figma-literal` at `491:22417`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-text-style`: `Desktop/Caption`; provenance: `figma-literal` at `491:22417`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `root-layout-direction`: `vertical`; provenance: `figma-literal` at `497:26054`
  - Fact `root-padding-top`: `16px`; provenance: `figma-literal` at `497:26054`
  - Fact `root-padding-right`: `16px`; provenance: `figma-literal` at `497:26054`
  - Fact `root-padding-left`: `16px`; provenance: `figma-literal` at `497:26054`
  - Fact `root-clips-content`: `true`; provenance: `figma-literal` at `497:26054`
  - `root-card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `root-card-layout-direction`: `vertical`; provenance: `figma-literal` at `619:21432`
    - Fact `root-card-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21432`
    - Fact `root-card-corner-radius`: `22px`; provenance: `figma-literal` at `619:21432`
    - Fact `root-card-clips-content`: `true`; provenance: `figma-literal` at `619:21432`
    - `root-card-status-area` — role `status-area`; render `presentation-table`; visibility `always`
      - Fact `root-card-status-area-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-item-gap`: `16px`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-padding-top`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-padding-right`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-padding-bottom`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-padding-left`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-clips-content`: `true`; provenance: `figma-literal` at `497:25764`
      - Fact `root-card-status-area-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:25764`
      - `root-card-status-area-status-row` — role `status-row`; render `presentation-table`; visibility `always`
        - Fact `root-card-status-area-status-row-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25765`
        - Fact `root-card-status-area-status-row-item-gap`: `16px`; provenance: `figma-literal` at `497:25765`
        - Fact `root-card-status-area-status-row-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25765`
        - `root-card-status-area-status-row-status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
          - Fact `root-card-status-area-status-row-status-badge-positive-corner-radius`: `56.000003814697266px`; provenance: `figma-literal` at `497:25809`
          - Fact `root-card-status-area-status-row-status-badge-positive-clips-content`: `true`; provenance: `figma-literal` at `497:25809`
          - Fact `root-card-status-area-status-row-status-badge-positive-display-width`: `72px`; provenance: `figma-literal` at `497:25809`
          - Fact `root-card-status-area-status-row-status-badge-positive-display-height`: `72px`; provenance: `figma-literal` at `497:25809`
        - `root-card-status-area-status-row-heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `root-card-status-area-status-row-heading-fill-color`: `#000000`; provenance: `figma-literal` at `497:25770`
          - Fact `root-card-status-area-status-row-heading-font-size`: `18px`; provenance: `figma-literal` at `497:25770`
          - Fact `root-card-status-area-status-row-heading-line-height`: `120%`; provenance: `figma-literal` at `497:25770`
          - Fact `root-card-status-area-status-row-heading-text-style`: `Mobile/Heading`; provenance: `figma-literal` at `497:25770`
          - Fact `root-card-status-area-status-row-heading-text-align`: `center`; provenance: `figma-literal` at `497:25770`
    - `root-card-divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `root-card-divider-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25773`
      - Fact `root-card-divider-clips-content`: `true`; provenance: `figma-literal` at `497:25773`
      - Fact `root-card-divider-fill-color`: `#DFDFE0`; provenance: `figma-literal` at `497:25773`
      - Fact `root-card-divider-height`: `1px`; provenance: `figma-literal` at `497:25773`
    - `root-card-body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `root-card-body-area-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-item-gap`: `16px`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-padding-top`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-padding-right`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-padding-bottom`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-padding-left`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-clips-content`: `true`; provenance: `figma-literal` at `497:25774`
      - Fact `root-card-body-area-fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:25774`
      - `root-card-body-area-text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `root-card-body-area-text-content-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25821`
        - Fact `root-card-body-area-text-content-item-gap`: `8px`; provenance: `figma-literal` at `497:25821`
        - Fact `root-card-body-area-text-content-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25821`
        - `root-card-body-area-text-content-greeting` — role `greeting`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-greeting-fill-color`: `#48494A`; provenance: `figma-literal` at `497:25822`
          - Fact `root-card-body-area-text-content-greeting-font-size`: `14px`; provenance: `figma-literal` at `497:25822`
          - Fact `root-card-body-area-text-content-greeting-line-height`: `140%`; provenance: `figma-literal` at `497:25822`
          - Fact `root-card-body-area-text-content-greeting-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25822`
        - `root-card-body-area-text-content-body-01` — role `body-01`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-body-01-fill-color`: `#48494A`; provenance: `figma-literal` at `497:25823`
          - Fact `root-card-body-area-text-content-body-01-font-size`: `14px`; provenance: `figma-literal` at `497:25823`
          - Fact `root-card-body-area-text-content-body-01-line-height`: `140%`; provenance: `figma-literal` at `497:25823`
          - Fact `root-card-body-area-text-content-body-01-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25823`
        - `root-card-body-area-text-content-body-02` — role `body-02`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-body-02-fill-color`: `#48494A`; provenance: `figma-literal` at `497:25824`
          - Fact `root-card-body-area-text-content-body-02-font-size`: `14px`; provenance: `figma-literal` at `497:25824`
          - Fact `root-card-body-area-text-content-body-02-line-height`: `140%`; provenance: `figma-literal` at `497:25824`
          - Fact `root-card-body-area-text-content-body-02-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25824`
        - `root-card-body-area-text-content-warning-text` — role `warning-text`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-warning-text-fill-color`: `#48494A`; provenance: `figma-literal` at `497:25826`
          - Fact `root-card-body-area-text-content-warning-text-font-size`: `14px`; provenance: `figma-literal` at `497:25826`
          - Fact `root-card-body-area-text-content-warning-text-line-height`: `140%`; provenance: `figma-literal` at `497:25826`
          - Fact `root-card-body-area-text-content-warning-text-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25826`
        - `root-card-body-area-text-content-sign-off` — role `sign-off`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-sign-off-fill-color`: `#48494A`; provenance: `figma-literal` at `497:25828`
          - Fact `root-card-body-area-text-content-sign-off-font-size`: `14px`; provenance: `figma-literal` at `497:25828`
          - Fact `root-card-body-area-text-content-sign-off-line-height`: `140%`; provenance: `figma-literal` at `497:25828`
          - Fact `root-card-body-area-text-content-sign-off-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25828`
        - `root-card-body-area-text-content-action-link` — role `action-link`; render `html-link`; visibility `always`
          - Fact `root-card-body-area-text-content-action-link-fill-color`: `#18B037`; provenance: `figma-literal` at `497:25830`
          - Fact `root-card-body-area-text-content-action-link-font-size`: `14px`; provenance: `figma-literal` at `497:25830`
          - Fact `root-card-body-area-text-content-action-link-line-height`: `140%`; provenance: `figma-literal` at `497:25830`
          - Fact `root-card-body-area-text-content-action-link-text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25830`
        - `root-card-body-area-text-content-link-expiry` — role `link-expiry`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-text-content-link-expiry-fill-color`: `#98999C`; provenance: `figma-literal` at `497:25832`
          - Fact `root-card-body-area-text-content-link-expiry-font-size`: `12px`; provenance: `figma-literal` at `497:25832`
          - Fact `root-card-body-area-text-content-link-expiry-line-height`: `140%`; provenance: `figma-literal` at `497:25832`
          - Fact `root-card-body-area-text-content-link-expiry-text-style`: `Mobile/Caption`; provenance: `figma-literal` at `497:25832`
      - `root-card-body-area-suspicious-operation-details` — role `suspicious-operation-details`; render `nested-component`; visibility property `show-operation-description` (`Show Operation Description`); component `details-suspicious-operation` (`Details/Suspicious-Operation`)
        - Fact `root-card-body-area-suspicious-operation-details-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-item-gap`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-padding-top`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-padding-right`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-padding-bottom`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-padding-left`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-corner-radius`: `14px`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-fill-color`: `#F8F8FA`; provenance: `figma-literal` at `497:25956`
        - Fact `root-card-body-area-suspicious-operation-details-instance-viewport`: `Mobile`; provenance: `figma-literal` at `497:25956`
      - `root-card-body-area-alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
        - Fact `root-card-body-area-alert-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-item-gap`: `4px`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-padding-top`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-padding-right`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-padding-bottom`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-padding-left`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-corner-radius`: `14px`; provenance: `figma-literal` at `497:25776`
        - Fact `root-card-body-area-alert-fill-color`: `#FFF1C9`; provenance: `figma-literal` at `497:25776`
        - `root-card-body-area-alert-notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-alert-notice-link-fill-color`: `#AA7100`; provenance: `figma-literal` at `497:25778`
          - Fact `root-card-body-area-alert-notice-link-text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `497:25778`
          - Fact `root-card-body-area-alert-notice-link-segment-1-color`: `#AA7100`; provenance: `figma-literal` at `497:25778`
          - Fact `root-card-body-area-alert-notice-link-segment-2-color`: `#AA7100`; provenance: `figma-literal` at `497:25778`
          - Fact `root-card-body-area-alert-notice-link-segment-2-decoration`: `underline`; provenance: `figma-literal` at `497:25778`
      - `root-card-body-area-disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
        - Fact `root-card-body-area-disclaimer-layout-direction`: `vertical`; provenance: `figma-literal` at `497:25834`
        - Fact `root-card-body-area-disclaimer-item-gap`: `12px`; provenance: `figma-literal` at `497:25834`
        - Fact `root-card-body-area-disclaimer-horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25834`
        - `root-card-body-area-disclaimer-disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-fill-color`: `#98999C`; provenance: `figma-literal` at `497:25836`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-font-size`: `12px`; provenance: `figma-literal` at `497:25836`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-line-height`: `140%`; provenance: `figma-literal` at `497:25836`
          - Fact `root-card-body-area-disclaimer-disclaimer-text-text-style`: `Mobile/Caption`; provenance: `figma-literal` at `497:25836`

### Properties and variants

- Variant `desktop` — Figma node `491:22454`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `497:26054`; axes: `Viewport=Mobile`
- Direct Figma source: `491:22454`; `Viewport=Desktop`; reference frame 600×1204px
- Direct Figma source: `497:26054`; `Viewport=Mobile`; reference frame 328×1375px
- Property `show-alert` (`Show Alert`) — `boolean`; default `true`
- Property `show-disclaimer` (`Show Disclaimer`) — `boolean`; default `true`
- Property `show-operation-description` (`Show Operation Description`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `status-badge-positive`
  - Owner layer: `status-badge-positive @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `status-badge-positive @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0/children/0` → `status-badge-positive` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/2/children/0/children/5`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0/children/0` → `status-badge-positive` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/2/children/0/children/5`

### Constraints and dependencies

- Constraint `operation-description-toggles-entire-details` — scope `all`; kind `property-behavior`; severity `critical`; Description critical: Show Operation Description управляет видимостью всего вложенного инстанса Details/Suspicious-Operation, а не отдельной строки его текста.
- Dependency: `/contracts/mobile/root/children/0/children/2/children/1/component_id` → component `details-suspicious-operation` (`Details/Suspicious-Operation`)
- Dependency: `/contracts/desktop/root/children/0/children/2/children/1/component_id` → component `details-suspicious-operation` (`Details/Suspicious-Operation`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-personal-data-update
PURPOSE: Сервисный блок обновления персональных данных со статусом и управляемыми пояснениями.
RENDER: HYBRID

CRITICAL
- Show Operation Description управляет видимостью всего вложенного инстанса Details/Suspicious-Operation, а не отдельной строки его текста.
```

<!-- library: service; component-id: block-receipt-info -->
## Block/Receipt-Info

### Identity and purpose

- CUPIS ID: `block-receipt-info`
- Status: `active`
- Library: `service`
- Semantic role: `block`
- Category: `receipt-info`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#502:24695` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:bbd25b8f3dbe51c1fe6582e6188201b60b63330123364f27ea3f24557d5fe681`
- Purpose: Сервисный блок со статусом и реквизитами чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Receipt-Info` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×513px`; provenance: `figma-literal` at `502:24693`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24693`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `502:24693`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24693`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24693`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24693`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24693`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24693`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24693`
  - `root-status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×136px`; provenance: `figma-literal` at `502:24253`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24253`
    - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24253`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24253`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24253`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24253`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24253`
    - Fact `border-radius-top-left`: `26px`; provenance: `figma-literal` at `502:24253`
    - Fact `border-radius-top-right`: `26px`; provenance: `figma-literal` at `502:24253`
    - Fact `border-radius-bottom-right`: `0px`; provenance: `figma-literal` at `502:24253`
    - Fact `border-radius-bottom-left`: `0px`; provenance: `figma-literal` at `502:24253`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `502:24253`
    - `root-status-area-status-row` — role `status-row`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `488×72px`; provenance: `figma-literal` at `502:24254`
      - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24254`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `502:24254`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24254`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24254`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24254`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24254`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24254`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24254`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24254`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24254`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24254`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24254`
      - `root-status-area-status-row-status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
        - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `502:24255`
        - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24255`
        - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `502:24255`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24255`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24255`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24255`
        - Fact `border-radius`: `56px`; provenance: `figma-literal` at `502:24255`
      - `root-status-area-status-row-heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `reference-size`: `392×62px`; provenance: `figma-literal` at `502:24256`
        - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24256`
        - Fact `source-text`: `Результат платежа (информация о чеке) `; provenance: `figma-literal` at `502:24256`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24256`
        - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `502:24256`
        - Fact `font-size`: `26px`; provenance: `figma-literal` at `502:24256`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24256`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24256`
        - Fact `figma-style-id`: `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,`; provenance: `figma-literal` at `502:24256`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `502:24256`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24256`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24256`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24256`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24256`
        - Fact `figma-style-name`: `Desktop/Heading`; provenance: `figma-literal` at `502:24256`
  - `root-divider` — role `divider`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×1px`; provenance: `figma-literal` at `502:24257`
    - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24257`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `502:24257`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24257`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24257`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24257`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24257`
    - Fact `background`: `#DFDFE0`; provenance: `figma-literal` at `502:24257`
  - `root-receipt-area` — role `receipt-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×352px`; provenance: `figma-literal` at `502:24258`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24258`
    - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24258`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24258`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24258`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24258`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24258`
    - Fact `border-radius-top-left`: `0px`; provenance: `figma-literal` at `502:24258`
    - Fact `border-radius-top-right`: `0px`; provenance: `figma-literal` at `502:24258`
    - Fact `border-radius-bottom-right`: `26px`; provenance: `figma-literal` at `502:24258`
    - Fact `border-radius-bottom-left`: `26px`; provenance: `figma-literal` at `502:24258`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `502:24258`
    - `root-receipt-area-receipt-details` — role `receipt-details`; render `nested-component`; visibility `always`; component `details-receipt` (`Details/Receipt`)
      - Fact `reference-size`: `488×288px`; provenance: `figma-literal` at `559:19391`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `559:19391`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `559:19391`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `559:19391`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `559:19391`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `559:19391`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `559:19391`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `559:19391`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `559:19391`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `559:19391`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `559:19391`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `559:19391`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `559:19391`
      - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `559:19391`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×673px`; provenance: `figma-literal` at `502:24694`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24694`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `502:24694`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24694`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24694`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24694`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24694`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24694`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24694`
  - `root-status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×176px`; provenance: `figma-literal` at `502:24531`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24531`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24531`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24531`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24531`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24531`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24531`
    - Fact `border-radius-top-left`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `border-radius-top-right`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `border-radius-bottom-right`: `0px`; provenance: `figma-literal` at `502:24531`
    - Fact `border-radius-bottom-left`: `0px`; provenance: `figma-literal` at `502:24531`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `502:24531`
    - `root-status-area-status-row` — role `status-row`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `252×132px`; provenance: `figma-literal` at `502:24532`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24532`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `502:24532`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24532`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24532`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24532`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24532`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24532`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24532`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24532`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24532`
      - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24532`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24532`
      - `root-status-area-status-row-status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
        - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `502:24533`
        - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24533`
        - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `502:24533`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24533`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24533`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24533`
        - Fact `border-radius`: `56px`; provenance: `figma-literal` at `502:24533`
      - `root-status-area-status-row-heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24534`
        - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24534`
        - Fact `source-text`: `Результат платежа (информация о чеке) `; provenance: `figma-literal` at `502:24534`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24534`
        - Fact `font-style`: `SemiBold`; provenance: `figma-literal` at `502:24534`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `502:24534`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `502:24534`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24534`
        - Fact `figma-style-id`: `S:31421a8c479c960e9e5fcdf32b0717960340b772,`; provenance: `figma-literal` at `502:24534`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `502:24534`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24534`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24534`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24534`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24534`
        - Fact `figma-style-name`: `Mobile/Heading`; provenance: `figma-literal` at `502:24534`
  - `root-divider` — role `divider`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×1px`; provenance: `figma-literal` at `502:24535`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24535`
    - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `502:24535`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24535`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24535`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24535`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24535`
    - Fact `background`: `#DFDFE0`; provenance: `figma-literal` at `502:24535`
  - `root-receipt-area` — role `receipt-area`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×480px`; provenance: `figma-literal` at `502:24536`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24536`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24536`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24536`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24536`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24536`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24536`
    - Fact `border-radius-top-left`: `0px`; provenance: `figma-literal` at `502:24536`
    - Fact `border-radius-top-right`: `0px`; provenance: `figma-literal` at `502:24536`
    - Fact `border-radius-bottom-right`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `border-radius-bottom-left`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `502:24536`
    - `root-receipt-area-receipt-details` — role `receipt-details`; render `nested-component`; visibility `always`; component `details-receipt` (`Details/Receipt`)
      - Fact `reference-size`: `252×436px`; provenance: `figma-literal` at `502:24641`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24641`
      - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `502:24641`
      - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24641`
      - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24641`
      - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24641`
      - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24641`
      - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24641`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24641`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24641`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24641`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24641`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24641`
      - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `502:24641`

### Properties and variants

- Variant `desktop` — Figma node `502:24693`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `502:24694`; axes: `Viewport=Mobile`
- Direct Figma source: `502:24693`; `Viewport=Desktop`; reference frame 600×513px
- Direct Figma source: `502:24694`; `Viewport=Mobile`; reference frame 328×673px

### Assets and interaction

- Asset contract: `status-badge-positive`
  - Owner layer: `status-badge-positive @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `status-badge-positive @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0` → `status-badge-positive` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0` → `status-badge-positive` as `direct-image`

### Constraints and dependencies

- Constraint `split-corner-radii` — scope `all`; kind `layout`; severity `critical`; Description critical: Нет внешнего белого card: status-area скруглена только сверху, receipt-area только снизу; величина видимых углов 22px Mobile / 26px Desktop, промежуточные углы 0px.
- Dependency: `/contracts/mobile/root/children/2/children/0/component_id` → component `details-receipt` (`Details/Receipt`)
- Dependency: `/contracts/desktop/root/children/2/children/0/component_id` → component `details-receipt` (`Details/Receipt`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-receipt-info
PURPOSE: Сервисный блок со статусом и реквизитами чека.
RENDER: HYBRID

CRITICAL
- Нет внешнего белого card: status-area скруглена только сверху, receipt-area только снизу; величина видимых углов 22px Mobile / 26px Desktop, промежуточные углы 0px.
```

<!-- library: service; component-id: block-transaction-error -->
## Block/Transaction-Error

### Identity and purpose

- CUPIS ID: `block-transaction-error`
- Status: `active`
- Library: `service`
- Semantic role: `block`
- Category: `transaction-error`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#459:30151` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:ff00ea2b989536c132fc0243770ee1e3b669bbafa9bf326c47d1113f7c5212e3`
- Purpose: Сервисный блок неуспешной операции с партнёром, статусом и поясняющим текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Transaction-Error` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×739px`; provenance: `figma-literal` at `459:29443`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:29443`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:29443`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `459:29443`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29443`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29443`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:29443`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:29443`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29443`
  - `root-card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×715px`; provenance: `figma-literal` at `619:21429`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `619:21429`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `619:21429`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `619:21429`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `619:21429`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `619:21429`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `619:21429`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `619:21429`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `619:21429`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `619:21429`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `619:21429`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `619:21429`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `619:21429`
    - `root-card-summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `552×136px`; provenance: `figma-literal` at `459:29385`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:29385`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:29385`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29385`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29385`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:29385`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:29385`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29385`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:29385`
      - `root-card-summary-area-partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×72px`; provenance: `figma-literal` at `459:29386`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `459:29386`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `459:29386`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:29386`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:29386`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:29386`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:29386`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:29386`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29386`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29386`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:29386`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:29386`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29386`
        - `root-card-summary-area-partner-info-row-partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
          - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `494:22359`
          - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `494:22359`
          - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `494:22359`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `494:22359`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `494:22359`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `494:22359`
          - Fact `border-radius`: `72px`; provenance: `figma-literal` at `494:22359`
        - `root-card-summary-area-partner-info-row-text-details` — role `text-details`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `262×68px`; provenance: `figma-literal` at `459:29388`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:29388`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `459:29388`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:29388`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:29388`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:29388`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:29388`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:29388`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29388`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29388`
          - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:29388`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:29388`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29388`
          - `root-card-summary-area-partner-info-row-text-details-partner-name` — role `partner-name`; render `html-text`; visibility `always`
            - Fact `reference-size`: `51×24px`; provenance: `figma-literal` at `459:29389`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `459:29389`
            - Fact `source-text`: `1xbet`; provenance: `figma-literal` at `459:29389`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:29389`
            - Fact `font-style`: `Medium`; provenance: `figma-literal` at `459:29389`
            - Fact `font-size`: `20px`; provenance: `figma-literal` at `459:29389`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `459:29389`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:29389`
            - Fact `figma-style-id`: `S:105e0e8a189848d91c13bf0f2887665713de21ca,`; provenance: `figma-literal` at `459:29389`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:29389`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:29389`
            - Fact `text-auto-resize`: `width_and_height`; provenance: `figma-literal` at `459:29389`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:29389`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `459:29389`
            - Fact `figma-style-name`: `Desktop/Title`; provenance: `figma-literal` at `459:29389`
          - `root-card-summary-area-partner-info-row-text-details-amount` — role `amount`; render `html-text`; visibility `always`
            - Fact `reference-size`: `131×38px`; provenance: `figma-literal` at `459:29390`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `459:29390`
            - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `459:29390`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:29390`
            - Fact `font-style`: `Bold`; provenance: `figma-literal` at `459:29390`
            - Fact `font-size`: `32px`; provenance: `figma-literal` at `459:29390`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `459:29390`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:29390`
            - Fact `figma-style-id`: `S:4d43ca77a0bc52ca7e43f97a078a4d69cee87651,`; provenance: `figma-literal` at `459:29390`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:29390`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:29390`
            - Fact `text-auto-resize`: `width_and_height`; provenance: `figma-literal` at `459:29390`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:29390`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `459:29390`
            - Fact `figma-style-name`: `Desktop/Display`; provenance: `figma-literal` at `459:29390`
        - `root-card-summary-area-partner-info-row-status-container` — role `status-container`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `106×72px`; provenance: `figma-literal` at `459:29391`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:29391`
          - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `459:29391`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:29391`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:29391`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:29391`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:29391`
          - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `459:29391`
          - Fact `vertical-sizing`: `fill`; provenance: `figma-literal` at `459:29391`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29391`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:29391`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:29391`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29391`
          - `root-card-summary-area-partner-info-row-status-container-status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
            - Fact `reference-size`: `106×30px`; provenance: `figma-literal` at `517:15697`
            - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `517:15697`
            - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-top`: `4px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-right`: `12px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-left`: `12px`; provenance: `figma-literal` at `517:15697`
            - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `517:15697`
            - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `517:15697`
            - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `517:15697`
            - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `517:15697`
            - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `517:15697`
            - Fact `border-radius`: `63px`; provenance: `figma-literal` at `517:15697`
            - Fact `background`: `#FFC7C8`; provenance: `figma-literal` at `517:15697`
            - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `517:15697`
            - Fact `instance-state`: `error`; provenance: `figma-literal` at `517:15697`
    - `root-card-divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `552×1px`; provenance: `figma-literal` at `477:19997`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:19997`
      - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `477:19997`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:19997`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:19997`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:19997`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:19997`
      - Fact `background`: `#DFDFE0`; provenance: `figma-literal` at `477:19997`
    - `root-card-body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `552×578px`; provenance: `figma-literal` at `477:20040`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:20040`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `477:20040`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:20040`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20040`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20040`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20040`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20040`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `477:20040`
      - `root-card-body-area-primary-content` — role `primary-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×212px`; provenance: `figma-literal` at `477:20041`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:20041`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `477:20041`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:20041`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:20041`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:20041`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:20041`
        - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `477:20041`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:20041`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20041`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20041`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20041`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20041`
        - `root-card-body-area-primary-content-heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `reference-size`: `488×25px`; provenance: `figma-literal` at `477:20042`
          - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `477:20042`
          - Fact `source-text`: `Здравствуйте, $user$!`; provenance: `figma-literal` at `477:20042`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20042`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20042`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `477:20042`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20042`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20042`
          - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `477:20042`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20042`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20042`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20042`
          - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `477:20042`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20042`
          - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `477:20042`
        - `root-card-body-area-primary-content-error-description` — role `error-description`; render `html-text`; visibility `always`
          - Fact `reference-size`: `488×175px`; provenance: `figma-literal` at `477:20043`
          - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `477:20043`
          - Fact `source-text`: `Операция %RID% от %DD:MM:YY HH:MM:SS% на сумму %SUM% руб. была отклонена, а использование электронного средства платежа приостановлено, ввиду наличия признаков осуществления перевода денежных средств без согласия клиента в соответствии с ч. 9.1 статьи 9 Федерального закона от 27.06.2011 N 161-ФЗ «О национальной платежной системе».`; provenance: `figma-literal` at `477:20043`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20043`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20043`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `477:20043`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20043`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20043`
          - Fact `figma-style-id`: `S:2dbbae937ad03f37307425810b92a1abedcfb705,`; provenance: `figma-literal` at `477:20043`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20043`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20043`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20043`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:20043`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20043`
          - Fact `figma-style-name`: `Desktop/Body/Large`; provenance: `figma-literal` at `477:20043`
      - `root-card-body-area-attention-notice` — role `attention-notice`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×128px`; provenance: `figma-literal` at `510:17054`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `510:17054`
        - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-top`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-right`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-left`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `510:17054`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `510:17054`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `510:17054`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `510:17054`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `510:17054`
        - Fact `border-radius`: `18px`; provenance: `figma-literal` at `510:17054`
        - Fact `background`: `#FFF1C9`; provenance: `figma-literal` at `510:17054`
        - `root-card-body-area-attention-notice-notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `reference-size`: `440×80px`; provenance: `figma-literal` at `510:17055`
          - Fact `text-color`: `#AA7100`; provenance: `figma-literal` at `510:17055`
          - Fact `source-text`: `Для подтверждения операции, а также, в случае, если вы не совершали данную операцию, пожалуйста, обратитесь в службу поддержки ЕДИНЫЙ ЦУПИС по телефону +7 (495) 122-20-88 или напишите на help@1cupis.ru`; provenance: `figma-literal` at `510:17055`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:17055`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `510:17055`
          - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `510:17055`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:17055`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `510:17055`
          - Fact `styled-text-segments`: `[{"start":0,"end":187,"characters":"Для подтверждения операции, а также, в случае, если вы не совершали данную операцию, пожалуйста, обратитесь в службу поддержки ЕДИНЫЙ ЦУПИС по телефону +7 (495) 122-20-88 или напишите на ","font_family":"Roboto","font_style":"Regular","font_size_px":14,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"NONE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]},{"start":187,"end":201,"characters":"help@1cupis.ru","font_family":"Roboto","font_style":"Regular","font_size_px":14,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"UNDERLINE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]}]`; provenance: `figma-literal` at `510:17055`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `510:17055`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `510:17055`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `510:17055`
      - `root-card-body-area-supporting-content` — role `supporting-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×126px`; provenance: `figma-literal` at `477:20075`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:20075`
        - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `477:20075`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:20075`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:20075`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:20075`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:20075`
        - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `477:20075`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:20075`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20075`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20075`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20075`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20075`
        - `root-card-body-area-supporting-content-timeout-notice` — role `timeout-notice`; render `html-text`; visibility `always`
          - Fact `reference-size`: `488×60px`; provenance: `figma-literal` at `477:20077`
          - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:20077`
          - Fact `source-text`: `В случае неподтверждения операции по прошествии двух рабочих дней вы сможете повторить операцию, а использование вами электронного средства платежа будет автоматически возобновлено.`; provenance: `figma-literal` at `477:20077`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20077`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20077`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20077`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20077`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20077`
          - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `477:20077`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20077`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20077`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20077`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:20077`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20077`
          - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `477:20077`
        - `root-card-body-area-supporting-content-card-warning` — role `card-warning`; render `html-text`; visibility `always`
          - Fact `reference-size`: `488×60px`; provenance: `figma-literal` at `477:20078`
          - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:20078`
          - Fact `source-text`: `Обратите внимание, что для снижения рисков повторного отклонения платежа и приостановления электронного средства платежа вам необходимо использовать другую банковскую карту.`; provenance: `figma-literal` at `477:20078`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20078`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20078`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20078`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20078`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20078`
          - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `477:20078`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20078`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20078`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20078`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:20078`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20078`
          - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `477:20078`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×910px`; provenance: `figma-literal` at `459:30150`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:30150`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:30150`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `459:30150`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:30150`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:30150`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:30150`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:30150`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:30150`
  - `root-card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×894px`; provenance: `figma-literal` at `619:21430`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `619:21430`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `619:21430`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `619:21430`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `619:21430`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `619:21430`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `619:21430`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `619:21430`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `619:21430`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `619:21430`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `619:21430`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `619:21430`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `619:21430`
    - `root-card-summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `296×224px`; provenance: `figma-literal` at `467:16683`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `467:16683`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `467:16683`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `467:16683`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `467:16683`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `467:16683`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `467:16683`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `467:16683`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `467:16683`
      - `root-card-summary-area-partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `252×180px`; provenance: `figma-literal` at `532:14307`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `532:14307`
        - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `532:14307`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `532:14307`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `532:14307`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `532:14307`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `532:14307`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `532:14307`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `532:14307`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `532:14307`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `532:14307`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `532:14307`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `532:14307`
        - `root-card-summary-area-partner-info-row-partner-details` — role `partner-details`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `252×139px`; provenance: `figma-literal` at `532:14308`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `532:14308`
          - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `532:14308`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `532:14308`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `532:14308`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `532:14308`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `532:14308`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `532:14308`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `532:14308`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `532:14308`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `532:14308`
          - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `532:14308`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `532:14308`
          - `root-card-summary-area-partner-info-row-partner-details-partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
            - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `532:14309`
            - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `532:14309`
            - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `532:14309`
            - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `532:14309`
            - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `532:14309`
            - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `532:14309`
            - Fact `border-radius`: `72px`; provenance: `figma-literal` at `532:14309`
          - `root-card-summary-area-partner-info-row-partner-details-text-details` — role `text-details`; render `presentation-table`; visibility `always`
            - Fact `reference-size`: `252×51px`; provenance: `figma-literal` at `532:14310`
            - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `532:14310`
            - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `532:14310`
            - Fact `padding-top`: `0px`; provenance: `figma-literal` at `532:14310`
            - Fact `padding-right`: `0px`; provenance: `figma-literal` at `532:14310`
            - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `532:14310`
            - Fact `padding-left`: `0px`; provenance: `figma-literal` at `532:14310`
            - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `532:14310`
            - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `532:14310`
            - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `532:14310`
            - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `532:14310`
            - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `532:14310`
            - Fact `border-radius`: `0px`; provenance: `figma-literal` at `532:14310`
            - `root-card-summary-area-partner-info-row-partner-details-text-details-partner-name` — role `partner-name`; render `html-text`; visibility `always`
              - Fact `reference-size`: `252×19px`; provenance: `figma-literal` at `532:14311`
              - Fact `text-color`: `#000000`; provenance: `figma-literal` at `532:14311`
              - Fact `source-text`: `1xbet`; provenance: `figma-literal` at `532:14311`
              - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `532:14311`
              - Fact `font-style`: `Medium`; provenance: `figma-literal` at `532:14311`
              - Fact `font-size`: `16px`; provenance: `figma-literal` at `532:14311`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `532:14311`
              - Fact `text-decoration`: `none`; provenance: `figma-literal` at `532:14311`
              - Fact `figma-style-id`: `S:348cad38e7e2918d2bc09859e1c0ac3f9b5afbb0,`; provenance: `figma-literal` at `532:14311`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `532:14311`
              - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `532:14311`
              - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `532:14311`
              - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `532:14311`
              - Fact `text-case`: `original`; provenance: `figma-literal` at `532:14311`
              - Fact `figma-style-name`: `Mobile/Title`; provenance: `figma-literal` at `532:14311`
            - `root-card-summary-area-partner-info-row-partner-details-text-details-amount` — role `amount`; render `html-text`; visibility `always`
              - Fact `reference-size`: `252×24px`; provenance: `figma-literal` at `532:14312`
              - Fact `text-color`: `#000000`; provenance: `figma-literal` at `532:14312`
              - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `532:14312`
              - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `532:14312`
              - Fact `font-style`: `Bold`; provenance: `figma-literal` at `532:14312`
              - Fact `font-size`: `20px`; provenance: `figma-literal` at `532:14312`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `532:14312`
              - Fact `text-decoration`: `none`; provenance: `figma-literal` at `532:14312`
              - Fact `figma-style-id`: `S:ca236b65a83eef2e55e95564b051765d4fbe7c60,`; provenance: `figma-literal` at `532:14312`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `532:14312`
              - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `532:14312`
              - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `532:14312`
              - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `532:14312`
              - Fact `text-case`: `original`; provenance: `figma-literal` at `532:14312`
              - Fact `figma-style-name`: `Mobile/Display`; provenance: `figma-literal` at `532:14312`
        - `root-card-summary-area-partner-info-row-status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
          - Fact `reference-size`: `86×25px`; provenance: `figma-literal` at `532:14313`
          - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `532:14313`
          - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-top`: `4px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-right`: `12px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-left`: `12px`; provenance: `figma-literal` at `532:14313`
          - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `532:14313`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `532:14313`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `532:14313`
          - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `532:14313`
          - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `532:14313`
          - Fact `border-radius`: `63px`; provenance: `figma-literal` at `532:14313`
          - Fact `background`: `#FFC7C8`; provenance: `figma-literal` at `532:14313`
          - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `532:14313`
          - Fact `instance-state`: `error`; provenance: `figma-literal` at `532:14313`
    - `root-card-divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `296×1px`; provenance: `figma-literal` at `477:20258`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:20258`
      - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `477:20258`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20258`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20258`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20258`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20258`
      - Fact `background`: `#DFDFE0`; provenance: `figma-literal` at `477:20258`
    - `root-card-body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `296×669px`; provenance: `figma-literal` at `477:20239`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:20239`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `477:20239`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:20239`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20239`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20239`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20239`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20239`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `477:20239`
      - `root-card-body-area-primary-content` — role `primary-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `252×268px`; provenance: `figma-literal` at `477:20247`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:20247`
        - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `477:20247`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:20247`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:20247`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:20247`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:20247`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:20247`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:20247`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20247`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20247`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20247`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20247`
        - `root-card-body-area-primary-content-heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `477:20248`
          - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `477:20248`
          - Fact `source-text`: `Здравствуйте, $user$!`; provenance: `figma-literal` at `477:20248`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20248`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20248`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20248`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20248`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20248`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `477:20248`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20248`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20248`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20248`
          - Fact `vertical-text-align`: `center`; provenance: `figma-literal` at `477:20248`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20248`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `477:20248`
        - `root-card-body-area-primary-content-error-description` — role `error-description`; render `html-text`; visibility `always`
          - Fact `reference-size`: `252×240px`; provenance: `figma-literal` at `477:20249`
          - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `477:20249`
          - Fact `source-text`: `Операция %RID% от %DD:MM:YY HH:MM:SS% на сумму %SUM% руб. была отклонена, а использование электронного средства платежа приостановлено, ввиду наличия признаков осуществления перевода денежных средств без согласия клиента в соответствии с ч. 9.1 статьи 9 Федерального закона от 27.06.2011 N 161-ФЗ «О национальной платежной системе».`; provenance: `figma-literal` at `477:20249`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20249`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20249`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20249`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20249`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20249`
          - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `477:20249`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20249`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20249`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20249`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:20249`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20249`
          - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `477:20249`
      - `root-card-body-area-attention-notice` — role `attention-notice`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `252×151px`; provenance: `figma-literal` at `510:17033`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `510:17033`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-top`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-right`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-left`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `510:17033`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `510:17033`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `510:17033`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `510:17033`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `510:17033`
        - Fact `border-radius`: `14px`; provenance: `figma-literal` at `510:17033`
        - Fact `background`: `#FFF1C9`; provenance: `figma-literal` at `510:17033`
        - `root-card-body-area-attention-notice-notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `reference-size`: `220×119px`; provenance: `figma-literal` at `510:17034`
          - Fact `text-color`: `#AA7100`; provenance: `figma-literal` at `510:17034`
          - Fact `source-text`: `Для подтверждения операции, а также, в случае, если вы не совершали данную операцию, пожалуйста, обратитесь в службу поддержки ЕДИНЫЙ ЦУПИС по телефону +7 (495) 122-20-88 или напишите на help@1cupis.ru`; provenance: `figma-literal` at `510:17034`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `510:17034`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `510:17034`
          - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `510:17034`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:17034`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `510:17034`
          - Fact `styled-text-segments`: `[{"start":0,"end":187,"characters":"Для подтверждения операции, а также, в случае, если вы не совершали данную операцию, пожалуйста, обратитесь в службу поддержки ЕДИНЫЙ ЦУПИС по телефону +7 (495) 122-20-88 или напишите на ","font_family":"Roboto","font_style":"Regular","font_size_px":12,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"NONE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]},{"start":187,"end":201,"characters":"help@1cupis.ru","font_family":"Roboto","font_style":"Regular","font_size_px":12,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"UNDERLINE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]}]`; provenance: `figma-literal` at `510:17034`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `510:17034`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `510:17034`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `510:17034`
      - `root-card-body-area-supporting-content` — role `supporting-content`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `252×174px`; provenance: `figma-literal` at `477:20251`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:20251`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `477:20251`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:20251`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:20251`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:20251`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:20251`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:20251`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:20251`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:20251`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:20251`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:20251`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:20251`
        - `root-card-body-area-supporting-content-timeout-notice` — role `timeout-notice`; render `html-text`; visibility `always`
          - Fact `reference-size`: `252×85px`; provenance: `figma-literal` at `477:20253`
          - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:20253`
          - Fact `source-text`: `В случае неподтверждения операции по прошествии двух рабочих дней вы сможете повторить операцию, а использование вами электронного средства платежа будет автоматически возобновлено.`; provenance: `figma-literal` at `477:20253`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20253`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20253`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `477:20253`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20253`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20253`
          - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `477:20253`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20253`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20253`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20253`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:20253`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20253`
          - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `477:20253`
        - `root-card-body-area-supporting-content-card-warning` — role `card-warning`; render `html-text`; visibility `always`
          - Fact `reference-size`: `252×85px`; provenance: `figma-literal` at `477:20254`
          - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:20254`
          - Fact `source-text`: `Обратите внимание, что для снижения рисков повторного отклонения платежа и приостановления электронного средства платежа вам необходимо использовать другую банковскую карту.`; provenance: `figma-literal` at `477:20254`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:20254`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:20254`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `477:20254`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `477:20254`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:20254`
          - Fact `figma-style-id`: `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,`; provenance: `figma-literal` at `477:20254`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20254`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:20254`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:20254`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:20254`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `477:20254`
          - Fact `figma-style-name`: `Mobile/Caption`; provenance: `figma-literal` at `477:20254`

### Properties and variants

- Variant `desktop` — Figma node `459:29443`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `459:30150`; axes: `Viewport=Mobile`
- Direct Figma source: `459:29443`; `Viewport=Desktop`; reference frame 600×739px
- Direct Figma source: `459:30150`; `Viewport=Mobile`; reference frame 328×910px

### Assets and interaction

- Asset contract: `partner-badge`
  - Owner layer: `partner-badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `partner-badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0/children/0/children/0` → `partner-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0/children/0` → `partner-badge` as `direct-image`

### Constraints and dependencies

- Constraint `composite-white-card` — scope `all`; kind `layout`; severity `required`: Корневой card прозрачен и обрезает по radius 22px Mobile / 26px Desktop; белый Fill #FFFFFF принадлежит summary-area и body-area, разделённым divider 1px #DFDFE0.
- Dependency: `/contracts/mobile/root/children/0/children/0/children/0/children/1/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)
- Dependency: `/contracts/desktop/root/children/0/children/0/children/0/children/2/children/0/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-transaction-error
PURPOSE: Сервисный блок неуспешной операции с партнёром, статусом и поясняющим текстом.
RENDER: HYBRID
```

<!-- library: service; component-id: block-transaction-success -->
## Block/Transaction-Success

### Identity and purpose

- CUPIS ID: `block-transaction-success`
- Status: `active`
- Library: `service`
- Semantic role: `block`
- Category: `transaction-success`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#459:29177` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:a715290129fb322fb8b376478397cb5a8489df311c012363ed0fa6df05160d8e`
- Purpose: Сервисный блок успешной операции с партнёром, суммой, статусом и реквизитами.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Transaction-Success` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `600×703px`; provenance: `figma-literal` at `459:29175`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:29175`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:29175`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `459:29175`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29175`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29175`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:29175`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:29175`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29175`
  - `root-card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `552×679px`; provenance: `figma-literal` at `619:21427`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `619:21427`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `619:21427`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `619:21427`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `619:21427`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `619:21427`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `619:21427`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `619:21427`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `619:21427`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `619:21427`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `619:21427`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `619:21427`
    - Fact `border-radius`: `26px`; provenance: `figma-literal` at `619:21427`
    - `root-card-summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `552×226px`; provenance: `figma-literal` at `459:27422`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27422`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27422`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27422`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27422`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27422`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:27422`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:27422`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:27422`
      - `root-card-summary-area-partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `488×72px`; provenance: `figma-literal` at `459:27423`
        - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `459:27423`
        - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `459:27423`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:27423`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:27423`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:27423`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:27423`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27423`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27423`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27423`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27423`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:27423`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:27423`
        - `root-card-summary-area-partner-info-row-partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
          - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `481:19700`
          - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `481:19700`
          - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `481:19700`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `481:19700`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `481:19700`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `481:19700`
          - Fact `border-radius`: `72px`; provenance: `figma-literal` at `481:19700`
        - `root-card-summary-area-partner-info-row-text-details` — role `text-details`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `252×68px`; provenance: `figma-literal` at `459:27425`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27425`
          - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `459:27425`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:27425`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:27425`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:27425`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:27425`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:27425`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:27425`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27425`
          - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:27425`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:27425`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:27425`
          - `root-card-summary-area-partner-info-row-text-details-partner-name` — role `partner-name`; render `html-text`; visibility `always`
            - Fact `reference-size`: `51×24px`; provenance: `figma-literal` at `459:27426`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `459:27426`
            - Fact `source-text`: `1xbet`; provenance: `figma-literal` at `459:27426`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27426`
            - Fact `font-style`: `Medium`; provenance: `figma-literal` at `459:27426`
            - Fact `font-size`: `20px`; provenance: `figma-literal` at `459:27426`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `459:27426`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27426`
            - Fact `figma-style-id`: `S:105e0e8a189848d91c13bf0f2887665713de21ca,`; provenance: `figma-literal` at `459:27426`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27426`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27426`
            - Fact `text-auto-resize`: `width_and_height`; provenance: `figma-literal` at `459:27426`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27426`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `459:27426`
            - Fact `figma-style-name`: `Desktop/Title`; provenance: `figma-literal` at `459:27426`
          - `root-card-summary-area-partner-info-row-text-details-amount` — role `amount`; render `html-text`; visibility `always`
            - Fact `reference-size`: `131×38px`; provenance: `figma-literal` at `459:27427`
            - Fact `text-color`: `#000000`; provenance: `figma-literal` at `459:27427`
            - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `459:27427`
            - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27427`
            - Fact `font-style`: `Bold`; provenance: `figma-literal` at `459:27427`
            - Fact `font-size`: `32px`; provenance: `figma-literal` at `459:27427`
            - Fact `text-align`: `left`; provenance: `figma-literal` at `459:27427`
            - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27427`
            - Fact `figma-style-id`: `S:4d43ca77a0bc52ca7e43f97a078a4d69cee87651,`; provenance: `figma-literal` at `459:27427`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27427`
            - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27427`
            - Fact `text-auto-resize`: `width_and_height`; provenance: `figma-literal` at `459:27427`
            - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27427`
            - Fact `text-case`: `original`; provenance: `figma-literal` at `459:27427`
            - Fact `figma-style-name`: `Desktop/Display`; provenance: `figma-literal` at `459:27427`
        - `root-card-summary-area-partner-info-row-status-container` — role `status-container`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `116×72px`; provenance: `figma-literal` at `459:27428`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:27428`
          - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `459:27428`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:27428`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:27428`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:27428`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:27428`
          - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `459:27428`
          - Fact `vertical-sizing`: `fill`; provenance: `figma-literal` at `459:27428`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:27428`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:27428`
          - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:27428`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:27428`
          - `root-card-summary-area-partner-info-row-status-container-status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
            - Fact `reference-size`: `116×30px`; provenance: `figma-literal` at `459:29356`
            - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `459:29356`
            - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-top`: `4px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-right`: `12px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-left`: `12px`; provenance: `figma-literal` at `459:29356`
            - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `459:29356`
            - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29356`
            - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29356`
            - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:29356`
            - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:29356`
            - Fact `border-radius`: `63px`; provenance: `figma-literal` at `459:29356`
            - Fact `background`: `#FAE6AF`; provenance: `figma-literal` at `459:29356`
            - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `459:29356`
            - Fact `instance-state`: `pending`; provenance: `figma-literal` at `459:29356`
      - `root-card-summary-area-description-text` — role `description-text`; render `html-text`; visibility property `show-description` (`Show Description`)
        - Fact `reference-size`: `488×66px`; provenance: `figma-literal` at `459:27431`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `459:27431`
        - Fact `source-text`: `Скорее всего, перевод прошел успешно, но у нас нет подтверждения от «Лига Ставок». Пожалуйста, подождите полчаса. Если деньги не придут, обратитесь к «Лига ставок».`; provenance: `figma-literal` at `459:27431`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:27431`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `459:27431`
        - Fact `font-size`: `16px`; provenance: `figma-literal` at `459:27431`
        - Fact `text-align`: `left`; provenance: `figma-literal` at `459:27431`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:27431`
        - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `459:27431`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27431`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:27431`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:27431`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:27431`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `459:27431`
        - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `459:27431`
    - `root-card-divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `552×1px`; provenance: `figma-literal` at `459:38314`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:38314`
      - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `459:38314`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:38314`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:38314`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:38314`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:38314`
      - Fact `background`: `#DFDFE0`; provenance: `figma-literal` at `459:38314`
    - `root-card-details-area` — role `details-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `552×452px`; provenance: `figma-literal` at `459:38136`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:38136`
      - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:38136`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:38136`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:38136`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:38136`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:38136`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:38136`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:38136`
      - `root-card-details-area-operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation` (`Details/Operation`)
        - Fact `reference-size`: `488×250px`; provenance: `figma-literal` at `477:21328`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:21328`
        - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `477:21328`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21328`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21328`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21328`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21328`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21328`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21328`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21328`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:21328`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:21328`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21328`
        - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `477:21328`
      - `root-card-details-area-limit-alert` — role `limit-alert`; render `presentation-table`; visibility property `show-limit-alert` (`Show Limit Alert`)
        - Fact `reference-size`: `488×114px`; provenance: `figma-literal` at `459:38174`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:38174`
        - Fact `layout-gap`: `6px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `459:38174`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:38174`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:38174`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:38174`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:38174`
        - Fact `border-radius`: `18px`; provenance: `figma-literal` at `459:38174`
        - Fact `background`: `#FFF1C9`; provenance: `figma-literal` at `459:38174`
        - `root-card-details-area-limit-alert-notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `reference-size`: `440×20px`; provenance: `figma-literal` at `459:38175`
          - Fact `text-color`: `#AA7100`; provenance: `figma-literal` at `459:38175`
          - Fact `source-text`: `Скоро Вы достигнете лимита на проведение платежей.`; provenance: `figma-literal` at `459:38175`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:38175`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `459:38175`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `459:38175`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `459:38175`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:38175`
          - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `459:38175`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:38175`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:38175`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:38175`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:38175`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `459:38175`
          - Fact `figma-style-name`: `Desktop/Caption`; provenance: `figma-literal` at `459:38175`
        - `root-card-details-area-limit-alert-notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `reference-size`: `440×40px`; provenance: `figma-literal` at `459:38532`
          - Fact `text-color`: `#AA7100`; provenance: `figma-literal` at `459:38532`
          - Fact `source-text`: `Чтобы узнать как увеличить лимиты до 550 000 ₽ на операцию без ограничений в месяц перейдите по ссылке`; provenance: `figma-literal` at `459:38532`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `459:38532`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `459:38532`
          - Fact `figma-style-id`: `S:3d171f9763dcbcd3a181c50411d876e67e072e75,`; provenance: `figma-literal` at `459:38532`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:38532`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:38532`
          - Fact `styled-text-segments`: `[{"start":0,"end":93,"characters":"Чтобы узнать как увеличить лимиты до 550 000 ₽ на операцию без ограничений в месяц перейдите ","font_family":"Roboto","font_style":"Regular","font_size_px":14,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"NONE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]},{"start":93,"end":102,"characters":"по ссылке","font_family":"Roboto","font_style":"Regular","font_size_px":14,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"UNDERLINE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]}]`; provenance: `figma-literal` at `459:38532`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:38532`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:38532`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `459:38532`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `328×920px`; provenance: `figma-literal` at `459:29176`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:29176`
  - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:29176`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `459:29176`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29176`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29176`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:29176`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:29176`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:29176`
  - `root-card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `296×904px`; provenance: `figma-literal` at `619:21428`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `619:21428`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `619:21428`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `619:21428`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `619:21428`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `619:21428`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `619:21428`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `619:21428`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `619:21428`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `619:21428`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `619:21428`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `619:21428`
    - Fact `border-radius`: `22px`; provenance: `figma-literal` at `619:21428`
    - `root-card-summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `296×325px`; provenance: `figma-literal` at `459:28002`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:28002`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:28002`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:28002`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:28002`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:28002`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:28002`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:28002`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:28002`
      - `root-card-summary-area-partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `reference-size`: `252×180px`; provenance: `figma-literal` at `459:28003`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:28003`
        - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `459:28003`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:28003`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:28003`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:28003`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:28003`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:28003`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:28003`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:28003`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:28003`
        - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:28003`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:28003`
        - `root-card-summary-area-partner-info-row-partner-details` — role `partner-details`; render `presentation-table`; visibility `always`
          - Fact `reference-size`: `252×139px`; provenance: `figma-literal` at `459:28004`
          - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:28004`
          - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `459:28004`
          - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:28004`
          - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:28004`
          - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:28004`
          - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:28004`
          - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:28004`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:28004`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:28004`
          - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:28004`
          - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:28004`
          - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:28004`
          - `root-card-summary-area-partner-info-row-partner-details-partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
            - Fact `reference-size`: `72×72px`; provenance: `figma-literal` at `484:19677`
            - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `484:19677`
            - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `484:19677`
            - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:19677`
            - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `484:19677`
            - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:19677`
            - Fact `border-radius`: `72px`; provenance: `figma-literal` at `484:19677`
          - `root-card-summary-area-partner-info-row-partner-details-text-details` — role `text-details`; render `presentation-table`; visibility `always`
            - Fact `reference-size`: `252×51px`; provenance: `figma-literal` at `459:28006`
            - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:28006`
            - Fact `layout-gap`: `8px`; provenance: `figma-literal` at `459:28006`
            - Fact `padding-top`: `0px`; provenance: `figma-literal` at `459:28006`
            - Fact `padding-right`: `0px`; provenance: `figma-literal` at `459:28006`
            - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `459:28006`
            - Fact `padding-left`: `0px`; provenance: `figma-literal` at `459:28006`
            - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:28006`
            - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:28006`
            - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:28006`
            - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:28006`
            - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:28006`
            - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:28006`
            - `root-card-summary-area-partner-info-row-partner-details-text-details-partner-name` — role `partner-name`; render `html-text`; visibility `always`
              - Fact `reference-size`: `252×19px`; provenance: `figma-literal` at `459:28007`
              - Fact `text-color`: `#000000`; provenance: `figma-literal` at `459:28007`
              - Fact `source-text`: `1xbet`; provenance: `figma-literal` at `459:28007`
              - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:28007`
              - Fact `font-style`: `Medium`; provenance: `figma-literal` at `459:28007`
              - Fact `font-size`: `16px`; provenance: `figma-literal` at `459:28007`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `459:28007`
              - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:28007`
              - Fact `figma-style-id`: `S:348cad38e7e2918d2bc09859e1c0ac3f9b5afbb0,`; provenance: `figma-literal` at `459:28007`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:28007`
              - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:28007`
              - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:28007`
              - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:28007`
              - Fact `text-case`: `original`; provenance: `figma-literal` at `459:28007`
              - Fact `figma-style-name`: `Mobile/Title`; provenance: `figma-literal` at `459:28007`
            - `root-card-summary-area-partner-info-row-partner-details-text-details-amount` — role `amount`; render `html-text`; visibility `always`
              - Fact `reference-size`: `252×24px`; provenance: `figma-literal` at `459:28008`
              - Fact `text-color`: `#000000`; provenance: `figma-literal` at `459:28008`
              - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `459:28008`
              - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:28008`
              - Fact `font-style`: `Bold`; provenance: `figma-literal` at `459:28008`
              - Fact `font-size`: `20px`; provenance: `figma-literal` at `459:28008`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `459:28008`
              - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:28008`
              - Fact `figma-style-id`: `S:ca236b65a83eef2e55e95564b051765d4fbe7c60,`; provenance: `figma-literal` at `459:28008`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:28008`
              - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:28008`
              - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:28008`
              - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:28008`
              - Fact `text-case`: `original`; provenance: `figma-literal` at `459:28008`
              - Fact `figma-style-name`: `Mobile/Display`; provenance: `figma-literal` at `459:28008`
        - `root-card-summary-area-partner-info-row-status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
          - Fact `reference-size`: `93×25px`; provenance: `figma-literal` at `459:29376`
          - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `459:29376`
          - Fact `layout-gap`: `10px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-top`: `4px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-right`: `12px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-left`: `12px`; provenance: `figma-literal` at `459:29376`
          - Fact `horizontal-sizing`: `hug`; provenance: `figma-literal` at `459:29376`
          - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:29376`
          - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:29376`
          - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:29376`
          - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `459:29376`
          - Fact `border-radius`: `63px`; provenance: `figma-literal` at `459:29376`
          - Fact `background`: `#FAE6AF`; provenance: `figma-literal` at `459:29376`
          - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `459:29376`
          - Fact `instance-state`: `pending`; provenance: `figma-literal` at `459:29376`
      - `root-card-summary-area-description-text` — role `description-text`; render `html-text`; visibility property `show-description` (`Show Description`)
        - Fact `reference-size`: `252×85px`; provenance: `figma-literal` at `459:28011`
        - Fact `text-color`: `#48494A`; provenance: `figma-literal` at `459:28011`
        - Fact `source-text`: `Скорее всего, перевод прошел успешно, но у нас нет подтверждения от «Лига Ставок». Пожалуйста, подождите полчаса. Если деньги не придут, обратитесь к «Лига ставок».`; provenance: `figma-literal` at `459:28011`
        - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:28011`
        - Fact `font-style`: `Regular`; provenance: `figma-literal` at `459:28011`
        - Fact `font-size`: `12px`; provenance: `figma-literal` at `459:28011`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:28011`
        - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:28011`
        - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `459:28011`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:28011`
        - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:28011`
        - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:28011`
        - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:28011`
        - Fact `text-case`: `original`; provenance: `figma-literal` at `459:28011`
        - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `459:28011`
    - `root-card-divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `296×1px`; provenance: `figma-literal` at `459:38449`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:38449`
      - Fact `vertical-sizing`: `fixed`; provenance: `figma-literal` at `459:38449`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:38449`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:38449`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:38449`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:38449`
      - Fact `background`: `#DFDFE0`; provenance: `figma-literal` at `459:38449`
    - `root-card-details-area` — role `details-area`; render `presentation-table`; visibility `always`
      - Fact `reference-size`: `296×578px`; provenance: `figma-literal` at `459:38319`
      - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:38319`
      - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:38319`
      - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:38319`
      - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:38319`
      - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `459:38319`
      - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:38319`
      - Fact `border-radius`: `0px`; provenance: `figma-literal` at `459:38319`
      - Fact `background`: `#FFFFFF`; provenance: `figma-literal` at `459:38319`
      - `root-card-details-area-operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation` (`Details/Operation`)
        - Fact `reference-size`: `252×380px`; provenance: `figma-literal` at `484:20069`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20069`
        - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `484:20069`
        - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20069`
        - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20069`
        - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20069`
        - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20069`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20069`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20069`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20069`
        - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `484:20069`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20069`
        - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20069`
        - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `484:20069`
      - `root-card-details-area-limit-alert` — role `limit-alert`; render `presentation-table`; visibility property `show-limit-alert` (`Show Limit Alert`)
        - Fact `reference-size`: `252×138px`; provenance: `figma-literal` at `459:38357`
        - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `459:38357`
        - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `459:38357`
        - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `459:38357`
        - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `459:38357`
        - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `459:38357`
        - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `459:38357`
        - Fact `border-radius`: `14px`; provenance: `figma-literal` at `459:38357`
        - Fact `background`: `#FFF1C9`; provenance: `figma-literal` at `459:38357`
        - `root-card-details-area-limit-alert-notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `reference-size`: `220×34px`; provenance: `figma-literal` at `459:38358`
          - Fact `text-color`: `#AA7100`; provenance: `figma-literal` at `459:38358`
          - Fact `source-text`: `Скоро Вы достигнете лимита на проведение платежей.`; provenance: `figma-literal` at `459:38358`
          - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `459:38358`
          - Fact `font-style`: `Regular`; provenance: `figma-literal` at `459:38358`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `459:38358`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `459:38358`
          - Fact `text-decoration`: `none`; provenance: `figma-literal` at `459:38358`
          - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `459:38358`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:38358`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:38358`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:38358`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:38358`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `459:38358`
          - Fact `figma-style-name`: `Mobile/Body/Medium`; provenance: `figma-literal` at `459:38358`
        - `root-card-details-area-limit-alert-notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `reference-size`: `220×68px`; provenance: `figma-literal` at `459:38537`
          - Fact `text-color`: `#AA7100`; provenance: `figma-literal` at `459:38537`
          - Fact `source-text`: `Чтобы узнать как увеличить лимиты до 550 000 ₽ на операцию без ограничений в месяц перейдите по ссылке`; provenance: `figma-literal` at `459:38537`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `459:38537`
          - Fact `text-align`: `left`; provenance: `figma-literal` at `459:38537`
          - Fact `figma-style-id`: `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,`; provenance: `figma-literal` at `459:38537`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:38537`
          - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `459:38537`
          - Fact `styled-text-segments`: `[{"start":0,"end":93,"characters":"Чтобы узнать как увеличить лимиты до 550 000 ₽ на операцию без ограничений в месяц перейдите ","font_family":"Roboto","font_style":"Regular","font_size_px":12,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"NONE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]},{"start":93,"end":102,"characters":"по ссылке","font_family":"Roboto","font_style":"Regular","font_size_px":12,"line_height":{"unit":"PERCENT","value":140},"text_decoration":"UNDERLINE","fills":[{"type":"solid","visible":true,"opacity":1,"color":"#AA7100"}]}]`; provenance: `figma-literal` at `459:38537`
          - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `459:38537`
          - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `459:38537`
          - Fact `text-case`: `original`; provenance: `figma-literal` at `459:38537`

### Properties and variants

- Variant `desktop` — Figma node `459:29175`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `459:29176`; axes: `Viewport=Mobile`
- Direct Figma source: `459:29175`; `Viewport=Desktop`; reference frame 600×703px
- Direct Figma source: `459:29176`; `Viewport=Mobile`; reference frame 328×920px
- Property `show-limit-alert` (`Show Limit Alert`) — `boolean`; default `true`
- Property `show-description` (`Show Description`) — `boolean`; default `true`

### Assets and interaction

- Asset contract: `partner-badge`
  - Owner layer: `partner-badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `partner-badge @4x`
  - Pixel dimensions: 288×288px
  - Aspect ratio: 72:72
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0/children/0/children/0` → `partner-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0/children/0` → `partner-badge` as `direct-image`

### Constraints and dependencies

- Constraint `composite-white-card` — scope `all`; kind `layout`; severity `required`: Корневой card прозрачен и обрезает по radius 22px Mobile / 26px Desktop; белый Fill #FFFFFF принадлежит двум вложенным секциям, разделённым divider 1px #DFDFE0.
- Dependency: `/contracts/mobile/root/children/0/children/0/children/0/children/1/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)
- Dependency: `/contracts/mobile/root/children/0/children/2/children/0/component_id` → component `details-operation` (`Details/Operation`)
- Dependency: `/contracts/desktop/root/children/0/children/0/children/0/children/2/children/0/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)
- Dependency: `/contracts/desktop/root/children/0/children/2/children/0/component_id` → component `details-operation` (`Details/Operation`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-transaction-success
PURPOSE: Сервисный блок успешной операции с партнёром, суммой, статусом и реквизитами.
RENDER: HYBRID
```

<!-- library: service; component-id: details-operation -->
## Details/Operation

### Identity and purpose

- CUPIS ID: `details-operation`
- Status: `active`
- Library: `service`
- Semantic role: `details`
- Category: `operation`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#477:21327` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:704fdedacb635ee26473f02322df3336127dc96125a244f4a356bb132c033e9f`
- Purpose: Вложенная таблица реквизитов операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Operation` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×250px`; provenance: `figma-literal` at `477:21325`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:21325`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `477:21325`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21325`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21325`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21325`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21325`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `477:21325`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21325`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21325`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:21325`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:21325`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21325`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21213`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21213`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21213`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21213`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21213`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21213`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21213`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21213`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21213`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21213`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21213`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21213`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21213`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21214`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21214`
      - Fact `source-text`: `Вид операции`; provenance: `figma-literal` at `477:21214`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21214`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21214`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21214`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21214`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21214`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21214`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21214`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21214`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21214`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21214`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21214`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21214`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21215`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21215`
      - Fact `source-text`: `Пополнение баланса`; provenance: `figma-literal` at `477:21215`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21215`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21215`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21215`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21215`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21215`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21215`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21215`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21215`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21215`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21215`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21215`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21215`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21217`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21217`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21217`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21217`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21217`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21217`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21217`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21217`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21217`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21217`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21217`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21217`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21217`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21218`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21218`
      - Fact `source-text`: `Способ оплаты`; provenance: `figma-literal` at `477:21218`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21218`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21218`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21218`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21218`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21218`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21218`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21218`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21218`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21218`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21218`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21218`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21218`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21219`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21219`
      - Fact `source-text`: `Кошелек ЦУПИС`; provenance: `figma-literal` at `477:21219`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21219`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21219`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21219`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21219`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21219`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21219`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21219`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21219`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21219`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21219`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21219`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21219`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21221`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21221`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21221`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21221`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21221`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21221`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21221`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21221`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21221`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21221`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21221`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21221`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21221`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21222`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21222`
      - Fact `source-text`: `Получатель`; provenance: `figma-literal` at `477:21222`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21222`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21222`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21222`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21222`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21222`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21222`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21222`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21222`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21222`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21222`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21222`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21222`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21223`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21223`
      - Fact `source-text`: `1xbet`; provenance: `figma-literal` at `477:21223`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21223`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21223`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21223`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21223`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21223`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21223`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21223`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21223`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21223`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21223`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21223`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21223`
  - `root-row-04` — role `row-04`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21225`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21225`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21225`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21225`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21225`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21225`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21225`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21225`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21225`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21225`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21225`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21225`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21225`
    - `root-row-04-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21226`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21226`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `477:21226`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21226`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21226`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21226`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21226`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21226`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21226`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21226`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21226`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21226`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21226`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21226`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21226`
    - `root-row-04-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21227`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21227`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `477:21227`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21227`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21227`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21227`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21227`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21227`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21227`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21227`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21227`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21227`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21227`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21227`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21227`
  - `root-row-05` — role `row-05`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21229`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21229`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21229`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21229`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21229`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21229`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21229`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21229`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21229`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21229`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21229`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21229`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21229`
    - `root-row-05-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21230`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21230`
      - Fact `source-text`: `Комиссия`; provenance: `figma-literal` at `477:21230`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21230`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21230`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21230`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21230`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21230`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21230`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21230`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21230`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21230`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21230`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21230`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21230`
    - `root-row-05-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21231`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21231`
      - Fact `source-text`: `0,00 ₽`; provenance: `figma-literal` at `477:21231`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21231`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21231`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21231`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21231`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21231`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21231`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21231`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21231`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21231`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21231`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21231`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21231`
  - `root-row-06` — role `row-06`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21233`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21233`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21233`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21233`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21233`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21233`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21233`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21233`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21233`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21233`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21233`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21233`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21233`
    - `root-row-06-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21234`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21234`
      - Fact `source-text`: `Номер операции`; provenance: `figma-literal` at `477:21234`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21234`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21234`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21234`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21234`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21234`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21234`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21234`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21234`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21234`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21234`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21234`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21234`
    - `root-row-06-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21235`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21235`
      - Fact `source-text`: `0185305415324`; provenance: `figma-literal` at `477:21235`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21235`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21235`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21235`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21235`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21235`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21235`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21235`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21235`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21235`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21235`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21235`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21235`
  - `root-row-07` — role `row-07`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21237`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21237`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21237`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21237`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21237`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21237`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21237`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21237`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21237`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21237`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21237`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21237`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21237`
    - `root-row-07-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21238`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21238`
      - Fact `source-text`: `ЭСП`; provenance: `figma-literal` at `477:21238`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21238`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21238`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21238`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21238`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21238`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21238`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21238`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21238`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21238`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21238`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21238`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21238`
    - `root-row-07-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21239`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21239`
      - Fact `source-text`: `184-9006247773`; provenance: `figma-literal` at `477:21239`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21239`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21239`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21239`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21239`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21239`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21239`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21239`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21239`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21239`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21239`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21239`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21239`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×380px`; provenance: `figma-literal` at `484:20068`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20068`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `484:20068`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20068`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20068`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20068`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20068`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `484:20068`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20068`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20068`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `484:20068`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20068`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20068`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20045`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20045`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20045`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20045`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20045`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20045`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20045`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20045`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20045`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20045`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20045`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20045`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20045`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20046`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20046`
      - Fact `source-text`: `Вид операции`; provenance: `figma-literal` at `484:20046`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20046`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20046`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20046`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20046`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20046`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20046`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20046`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20046`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20046`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20046`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20046`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20046`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20047`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20047`
      - Fact `source-text`: `Пополнение баланса`; provenance: `figma-literal` at `484:20047`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20047`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20047`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20047`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20047`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20047`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20047`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20047`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20047`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20047`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20047`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20047`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20047`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20049`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20049`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20049`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20049`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20049`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20049`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20049`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20049`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20049`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20049`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20049`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20049`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20049`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20050`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20050`
      - Fact `source-text`: `Способ оплаты`; provenance: `figma-literal` at `484:20050`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20050`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20050`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20050`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20050`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20050`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20050`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20050`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20050`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20050`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20050`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20050`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20050`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20051`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20051`
      - Fact `source-text`: `Кошелек ЦУПИС`; provenance: `figma-literal` at `484:20051`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20051`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20051`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20051`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20051`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20051`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20051`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20051`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20051`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20051`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20051`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20051`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20051`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20041`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20041`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20041`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20041`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20041`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20041`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20041`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20041`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20041`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20041`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20041`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20041`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20041`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20042`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20042`
      - Fact `source-text`: `Получатель`; provenance: `figma-literal` at `484:20042`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20042`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20042`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20042`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20042`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20042`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20042`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20042`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20042`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20042`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20042`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20042`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20042`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20043`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20043`
      - Fact `source-text`: `1xbet`; provenance: `figma-literal` at `484:20043`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20043`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20043`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20043`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20043`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20043`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20043`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20043`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20043`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20043`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20043`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20043`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20043`
  - `root-row-04` — role `row-04`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20053`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20053`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20053`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20053`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20053`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20053`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20053`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20053`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20053`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20053`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20053`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20053`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20053`
    - `root-row-04-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20054`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20054`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `484:20054`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20054`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20054`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20054`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20054`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20054`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20054`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20054`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20054`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20054`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20054`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20054`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20054`
    - `root-row-04-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20055`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20055`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `484:20055`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20055`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20055`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20055`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20055`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20055`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20055`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20055`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20055`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20055`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20055`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20055`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20055`
  - `root-row-05` — role `row-05`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20057`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20057`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20057`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20057`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20057`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20057`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20057`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20057`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20057`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20057`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20057`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20057`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20057`
    - `root-row-05-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20058`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20058`
      - Fact `source-text`: `Комиссия`; provenance: `figma-literal` at `484:20058`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20058`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20058`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20058`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20058`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20058`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20058`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20058`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20058`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20058`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20058`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20058`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20058`
    - `root-row-05-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20059`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20059`
      - Fact `source-text`: `0,00 ₽`; provenance: `figma-literal` at `484:20059`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20059`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20059`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20059`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20059`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20059`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20059`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20059`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20059`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20059`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20059`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20059`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20059`
  - `root-row-06` — role `row-06`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20061`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20061`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20061`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20061`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20061`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20061`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20061`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20061`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20061`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20061`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20061`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20061`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20061`
    - `root-row-06-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20062`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20062`
      - Fact `source-text`: `Номер операции`; provenance: `figma-literal` at `484:20062`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20062`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20062`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20062`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20062`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20062`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20062`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20062`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20062`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20062`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20062`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20062`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20062`
    - `root-row-06-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20063`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20063`
      - Fact `source-text`: `0185305415324`; provenance: `figma-literal` at `484:20063`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20063`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20063`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20063`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20063`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20063`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20063`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20063`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20063`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20063`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20063`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20063`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20063`
  - `root-row-07` — role `row-07`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20065`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20065`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20065`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20065`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20065`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20065`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20065`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20065`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20065`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20065`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20065`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20065`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20065`
    - `root-row-07-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20066`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20066`
      - Fact `source-text`: `ЭСП`; provenance: `figma-literal` at `484:20066`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20066`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20066`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20066`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20066`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20066`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20066`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20066`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20066`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20066`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20066`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20066`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20066`
    - `root-row-07-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20067`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20067`
      - Fact `source-text`: `184-9006247773`; provenance: `figma-literal` at `484:20067`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20067`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20067`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20067`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20067`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20067`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20067`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20067`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20067`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20067`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20067`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20067`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20067`

### Properties and variants

- Variant `desktop` — Figma node `477:21325`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `484:20068`; axes: `Viewport=Mobile`
- Direct Figma source: `477:21325`; `Viewport=Desktop`; reference frame 488×250px
- Direct Figma source: `484:20068`; `Viewport=Mobile`; reference frame 252×380px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: details-operation
PURPOSE: Вложенная таблица реквизитов операции.
RENDER: HTML
```

<!-- library: service; component-id: details-operation-plain -->
## Details/Operation-Plain

### Identity and purpose

- CUPIS ID: `details-operation-plain`
- Status: `active`
- Library: `service`
- Semantic role: `details`
- Category: `operation-plain`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#497:26103` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:fc8ca2877c103ab0c55d68549ddd9ae0c73d6b026b3c8e9acd24d7c127a18ffd`
- Purpose: Вложенная таблица реквизитов операции без собственного визуального контейнера.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Operation-Plain` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×98px`; provenance: `figma-literal` at `497:26101`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:26101`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `497:26101`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `497:26101`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `497:26101`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `497:26101`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `497:26101`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `497:26101`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:26101`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:26101`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `497:26101`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:26101`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `497:26101`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `494:20889`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `494:20889`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `494:20889`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `494:20889`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `494:20889`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `494:20889`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `494:20889`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `494:20889`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `494:20889`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `494:20889`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `494:20889`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `494:20889`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `494:20889`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `494:20890`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `494:20890`
      - Fact `source-text`: `Номер операции`; provenance: `figma-literal` at `494:20890`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:20890`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:20890`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:20890`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `494:20890`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:20890`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:20890`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:20890`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:20890`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:20890`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:20890`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `494:20890`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:20890`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `494:20891`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `494:20891`
      - Fact `source-text`: `0185305415324`; provenance: `figma-literal` at `494:20891`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:20891`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:20891`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:20891`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `494:20891`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:20891`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:20891`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:20891`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:20891`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:20891`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:20891`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `494:20891`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:20891`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `494:20905`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `494:20905`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `494:20905`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `494:20905`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `494:20905`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `494:20905`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `494:20905`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `494:20905`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `494:20905`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `494:20905`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `494:20905`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `494:20905`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `494:20905`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `494:20906`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `494:20906`
      - Fact `source-text`: `Сумма`; provenance: `figma-literal` at `494:20906`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:20906`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:20906`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:20906`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `494:20906`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:20906`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:20906`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:20906`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:20906`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:20906`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:20906`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `494:20906`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:20906`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `494:20907`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `494:20907`
      - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `494:20907`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:20907`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:20907`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:20907`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `494:20907`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:20907`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:20907`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:20907`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:20907`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:20907`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:20907`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `494:20907`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:20907`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `494:20909`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `494:20909`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `494:20909`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `494:20909`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `494:20909`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `494:20909`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `494:20909`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `494:20909`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `494:20909`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `494:20909`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `494:20909`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `494:20909`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `494:20909`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `494:20910`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `494:20910`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `494:20910`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:20910`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:20910`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:20910`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `494:20910`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:20910`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:20910`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:20910`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:20910`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:20910`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:20910`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `494:20910`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:20910`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `494:20911`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `494:20911`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `494:20911`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:20911`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:20911`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:20911`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `494:20911`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:20911`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:20911`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:20911`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:20911`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:20911`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:20911`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `494:20911`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:20911`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×156px`; provenance: `figma-literal` at `497:26102`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:26102`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `497:26102`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `497:26102`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `497:26102`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `497:26102`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `497:26102`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `497:26102`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:26102`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:26102`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `497:26102`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:26102`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `497:26102`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `497:25852`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:25852`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `497:25852`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `497:25852`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `497:25852`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `497:25852`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `497:25852`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `497:25852`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:25852`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:25852`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `497:25852`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:25852`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `497:25852`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `497:25853`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `497:25853`
      - Fact `source-text`: `Номер операции`; provenance: `figma-literal` at `497:25853`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25853`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25853`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25853`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25853`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25853`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25853`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25853`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25853`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25853`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25853`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25853`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25853`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `497:25854`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `497:25854`
      - Fact `source-text`: `0185305415324`; provenance: `figma-literal` at `497:25854`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25854`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25854`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25854`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25854`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25854`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25854`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25854`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25854`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25854`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25854`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25854`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25854`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `497:25856`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:25856`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `497:25856`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `497:25856`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `497:25856`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `497:25856`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `497:25856`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `497:25856`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:25856`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:25856`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `497:25856`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:25856`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `497:25856`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `497:25857`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `497:25857`
      - Fact `source-text`: `Сумма`; provenance: `figma-literal` at `497:25857`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25857`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25857`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25857`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25857`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25857`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25857`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25857`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25857`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25857`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25857`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25857`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25857`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `497:25858`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `497:25858`
      - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `497:25858`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25858`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25858`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25858`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25858`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25858`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25858`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25858`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25858`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25858`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25858`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25858`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25858`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `497:25860`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:25860`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `497:25860`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `497:25860`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `497:25860`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `497:25860`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `497:25860`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `497:25860`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:25860`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:25860`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `497:25860`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:25860`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `497:25860`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `497:25861`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `497:25861`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `497:25861`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25861`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25861`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25861`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25861`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25861`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25861`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25861`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25861`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25861`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25861`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25861`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25861`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `497:25862`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `497:25862`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `497:25862`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25862`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25862`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25862`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25862`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25862`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25862`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25862`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25862`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25862`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25862`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25862`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25862`

### Properties and variants

- Variant `mobile` — Figma node `497:26102`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `497:26101`; axes: `Viewport=Desktop`
- Direct Figma source: `497:26102`; `Viewport=Mobile`; reference frame 252×156px
- Direct Figma source: `497:26101`; `Viewport=Desktop`; reference frame 488×98px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: details-operation-plain
PURPOSE: Вложенная таблица реквизитов операции без собственного визуального контейнера.
RENDER: HTML
```

<!-- library: service; component-id: details-receipt -->
## Details/Receipt

### Identity and purpose

- CUPIS ID: `details-receipt`
- Status: `active`
- Library: `service`
- Semantic role: `details`
- Category: `receipt`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#502:24640` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:3fea2963f91e1be0835f755e33c52c0f76e5d1621e072c60e8961d4c6b9993f6`
- Purpose: Вложенная таблица реквизитов чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Receipt` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×288px`; provenance: `figma-literal` at `502:24638`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24638`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `502:24638`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24638`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24638`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24638`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24638`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24638`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24638`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24638`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24638`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24638`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24638`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24389`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24389`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24389`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24389`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24389`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24389`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24389`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24389`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24389`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24389`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24389`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24389`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24389`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24390`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24390`
      - Fact `source-text`: `Результат`; provenance: `figma-literal` at `502:24390`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24390`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24390`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24390`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24390`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24390`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24390`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24390`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24390`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24390`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24390`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24390`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24390`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24391`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24391`
      - Fact `source-text`: `Прием ИС`; provenance: `figma-literal` at `502:24391`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24391`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24391`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24391`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24391`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24391`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24391`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24391`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24391`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24391`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24391`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24391`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24391`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24393`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24393`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24393`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24393`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24393`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24393`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24393`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24393`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24393`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24393`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24393`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24393`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24393`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24394`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24394`
      - Fact `source-text`: `Сумма`; provenance: `figma-literal` at `502:24394`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24394`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24394`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24394`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24394`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24394`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24394`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24394`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24394`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24394`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24394`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24394`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24394`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24395`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24395`
      - Fact `source-text`: `100,00 руб.`; provenance: `figma-literal` at `502:24395`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24395`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24395`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24395`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24395`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24395`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24395`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24395`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24395`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24395`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24395`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24395`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24395`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24397`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24397`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24397`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24397`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24397`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24397`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24397`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24397`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24397`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24397`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24397`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24397`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24397`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24398`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24398`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `502:24398`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24398`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24398`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24398`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24398`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24398`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24398`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24398`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24398`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24398`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24398`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24398`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24398`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24399`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24399`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `502:24399`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24399`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24399`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24399`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24399`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24399`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24399`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24399`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24399`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24399`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24399`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24399`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24399`
  - `root-row-04` — role `row-04`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24401`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24401`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24401`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24401`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24401`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24401`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24401`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24401`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24401`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24401`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24401`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24401`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24401`
    - `root-row-04-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24402`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24402`
      - Fact `source-text`: `ККТ`; provenance: `figma-literal` at `502:24402`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24402`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24402`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24402`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24402`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24402`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24402`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24402`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24402`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24402`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24402`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24402`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24402`
    - `root-row-04-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24403`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24403`
      - Fact `source-text`: `0002291467032296`; provenance: `figma-literal` at `502:24403`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24403`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24403`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24403`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24403`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24403`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24403`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24403`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24403`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24403`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24403`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24403`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24403`
  - `root-row-05` — role `row-05`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24405`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24405`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24405`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24405`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24405`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24405`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24405`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24405`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24405`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24405`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24405`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24405`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24405`
    - `root-row-05-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24406`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24406`
      - Fact `source-text`: `ФПД`; provenance: `figma-literal` at `502:24406`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24406`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24406`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24406`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24406`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24406`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24406`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24406`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24406`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24406`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24406`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24406`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24406`
    - `root-row-05-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24407`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24407`
      - Fact `source-text`: `3198732007`; provenance: `figma-literal` at `502:24407`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24407`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24407`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24407`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24407`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24407`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24407`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24407`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24407`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24407`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24407`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24407`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24407`
  - `root-row-06` — role `row-06`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24409`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24409`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24409`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24409`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24409`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24409`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24409`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24409`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24409`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24409`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24409`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24409`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24409`
    - `root-row-06-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24410`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24410`
      - Fact `source-text`: `ФН`; provenance: `figma-literal` at `502:24410`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24410`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24410`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24410`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24410`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24410`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24410`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24410`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24410`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24410`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24410`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24410`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24410`
    - `root-row-06-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24411`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24411`
      - Fact `source-text`: `9289440300626365`; provenance: `figma-literal` at `502:24411`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24411`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24411`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24411`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24411`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24411`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24411`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24411`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24411`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24411`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24411`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24411`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24411`
  - `root-row-07` — role `row-07`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24413`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24413`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24413`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24413`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24413`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24413`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24413`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24413`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24413`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24413`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24413`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24413`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24413`
    - `root-row-07-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24414`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24414`
      - Fact `source-text`: `ИНН организации`; provenance: `figma-literal` at `502:24414`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24414`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24414`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24414`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24414`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24414`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24414`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24414`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24414`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24414`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24414`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24414`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24414`
    - `root-row-07-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24415`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24415`
      - Fact `source-text`: `7729607406`; provenance: `figma-literal` at `502:24415`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24415`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24415`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24415`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24415`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24415`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24415`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24415`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24415`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24415`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24415`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24415`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24415`
  - `root-row-08` — role `row-08`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `502:24417`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `502:24417`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `502:24417`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24417`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24417`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24417`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24417`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24417`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24417`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24417`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `502:24417`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `502:24417`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24417`
    - `root-row-08-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `502:24418`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24418`
      - Fact `source-text`: `ФД`; provenance: `figma-literal` at `502:24418`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24418`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24418`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24418`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24418`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24418`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24418`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24418`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24418`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24418`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24418`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24418`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24418`
    - `root-row-08-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `502:24419`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24419`
      - Fact `source-text`: `26029`; provenance: `figma-literal` at `502:24419`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24419`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24419`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `502:24419`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `502:24419`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24419`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `502:24419`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24419`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24419`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24419`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24419`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24419`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `502:24419`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×436px`; provenance: `figma-literal` at `502:24639`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24639`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `502:24639`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24639`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24639`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24639`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24639`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `502:24639`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24639`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24639`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `502:24639`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24639`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24639`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24433`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24433`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24433`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24433`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24433`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24433`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24433`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24433`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24433`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24433`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24433`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24433`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24433`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24434`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24434`
      - Fact `source-text`: `Результат`; provenance: `figma-literal` at `502:24434`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24434`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24434`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24434`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24434`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24434`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24434`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24434`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24434`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24434`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24434`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24434`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24434`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24435`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24435`
      - Fact `source-text`: `Прием ИС`; provenance: `figma-literal` at `502:24435`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24435`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24435`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24435`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24435`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24435`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24435`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24435`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24435`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24435`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24435`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24435`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24435`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24437`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24437`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24437`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24437`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24437`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24437`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24437`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24437`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24437`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24437`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24437`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24437`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24437`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24438`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24438`
      - Fact `source-text`: `Сумма`; provenance: `figma-literal` at `502:24438`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24438`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24438`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24438`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24438`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24438`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24438`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24438`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24438`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24438`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24438`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24438`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24438`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24439`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24439`
      - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `502:24439`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24439`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24439`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24439`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24439`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24439`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24439`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24439`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24439`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24439`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24439`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24439`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24439`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24441`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24441`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24441`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24441`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24441`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24441`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24441`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24441`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24441`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24441`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24441`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24441`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24441`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24442`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24442`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `502:24442`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24442`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24442`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24442`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24442`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24442`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24442`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24442`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24442`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24442`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24442`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24442`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24442`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24443`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24443`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `502:24443`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24443`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24443`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24443`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24443`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24443`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24443`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24443`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24443`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24443`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24443`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24443`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24443`
  - `root-row-04` — role `row-04`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24445`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24445`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24445`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24445`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24445`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24445`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24445`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24445`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24445`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24445`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24445`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24445`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24445`
    - `root-row-04-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24446`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24446`
      - Fact `source-text`: `ККТ`; provenance: `figma-literal` at `502:24446`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24446`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24446`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24446`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24446`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24446`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24446`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24446`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24446`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24446`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24446`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24446`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24446`
    - `root-row-04-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24447`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24447`
      - Fact `source-text`: `0002291467032296`; provenance: `figma-literal` at `502:24447`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24447`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24447`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24447`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24447`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24447`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24447`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24447`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24447`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24447`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24447`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24447`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24447`
  - `root-row-05` — role `row-05`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24451`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24451`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24451`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24451`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24451`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24451`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24451`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24451`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24451`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24451`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24451`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24451`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24451`
    - `root-row-05-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24452`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24452`
      - Fact `source-text`: `ФПД`; provenance: `figma-literal` at `502:24452`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24452`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24452`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24452`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24452`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24452`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24452`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24452`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24452`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24452`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24452`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24452`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24452`
    - `root-row-05-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24453`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24453`
      - Fact `source-text`: `3198732007`; provenance: `figma-literal` at `502:24453`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24453`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24453`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24453`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24453`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24453`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24453`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24453`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24453`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24453`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24453`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24453`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24453`
  - `root-row-06` — role `row-06`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24469`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24469`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24469`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24469`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24469`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24469`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24469`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24469`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24469`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24469`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24469`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24469`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24469`
    - `root-row-06-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24470`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24470`
      - Fact `source-text`: `ФН`; provenance: `figma-literal` at `502:24470`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24470`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24470`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24470`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24470`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24470`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24470`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24470`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24470`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24470`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24470`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24470`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24470`
    - `root-row-06-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24471`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24471`
      - Fact `source-text`: `9289440300626365`; provenance: `figma-literal` at `502:24471`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24471`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24471`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24471`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24471`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24471`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24471`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24471`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24471`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24471`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24471`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24471`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24471`
  - `root-row-07` — role `row-07`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24480`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24480`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24480`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24480`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24480`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24480`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24480`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24480`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24480`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24480`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24480`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24480`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24480`
    - `root-row-07-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24481`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24481`
      - Fact `source-text`: `ИНН организации`; provenance: `figma-literal` at `502:24481`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24481`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24481`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24481`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24481`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24481`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24481`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24481`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24481`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24481`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24481`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24481`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24481`
    - `root-row-07-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24482`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24482`
      - Fact `source-text`: `7729607406`; provenance: `figma-literal` at `502:24482`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24482`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24482`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24482`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24482`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24482`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24482`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24482`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24482`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24482`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24482`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24482`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24482`
  - `root-row-08` — role `row-08`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `502:24486`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `502:24486`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `502:24486`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `502:24486`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `502:24486`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `502:24486`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `502:24486`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `502:24486`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `502:24486`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `502:24486`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `502:24486`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `502:24486`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `502:24486`
    - `root-row-08-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24487`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `502:24487`
      - Fact `source-text`: `ФД`; provenance: `figma-literal` at `502:24487`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24487`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24487`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24487`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24487`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24487`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24487`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24487`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24487`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24487`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24487`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24487`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24487`
    - `root-row-08-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `502:24488`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `502:24488`
      - Fact `source-text`: `26029`; provenance: `figma-literal` at `502:24488`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `502:24488`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `502:24488`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:24488`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `502:24488`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `502:24488`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `502:24488`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:24488`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `502:24488`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `502:24488`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `502:24488`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `502:24488`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:24488`

### Properties and variants

- Variant `desktop` — Figma node `502:24638`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `502:24639`; axes: `Viewport=Mobile`
- Direct Figma source: `502:24638`; `Viewport=Desktop`; reference frame 488×288px
- Direct Figma source: `502:24639`; `Viewport=Mobile`; reference frame 252×436px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: details-receipt
PURPOSE: Вложенная таблица реквизитов чека.
RENDER: HTML
```

<!-- library: service; component-id: details-suspicious-operation -->
## Details/Suspicious-Operation

### Identity and purpose

- CUPIS ID: `details-suspicious-operation`
- Status: `active`
- Library: `service`
- Semantic role: `details`
- Category: `suspicious-operation`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#497:25955` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-13`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Mobile и Desktop source nodes сверены непосредственно с Figma; существующие HTML-проекции остаются миграционным черновиком и не являются доказанным build contract.
- Structure fingerprint: `sha256:9fa4bdddf80567da242af9cbab1e0b8a79722cfb68e90202f6380e8e1426f116`
- Purpose: Вложенный предупреждающий блок с реквизитами подозрительной операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Suspicious-Operation` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×192px`; provenance: `figma-literal` at `497:25953`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:25953`
  - Fact `layout-gap`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `497:25953`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:25953`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:25953`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `497:25953`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:25953`
  - Fact `border-radius`: `18px`; provenance: `figma-literal` at `497:25953`
  - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `497:25953`
  - `root-heading` — role `heading`; render `html-text`; visibility `always`
    - Fact `reference-size`: `440×22px`; provenance: `figma-literal` at `494:21234`
    - Fact `text-color`: `#DE2141`; provenance: `figma-literal` at `494:21234`
    - Fact `source-text`: `Детали подозрительной операции`; provenance: `figma-literal` at `494:21234`
    - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `494:21234`
    - Fact `font-style`: `Regular`; provenance: `figma-literal` at `494:21234`
    - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:21234`
    - Fact `text-align`: `left`; provenance: `figma-literal` at `494:21234`
    - Fact `text-decoration`: `none`; provenance: `figma-literal` at `494:21234`
    - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `494:21234`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:21234`
    - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `494:21234`
    - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `494:21234`
    - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `494:21234`
    - Fact `text-case`: `original`; provenance: `figma-literal` at `494:21234`
    - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:21234`
  - `root-operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation-plain` (`Details/Operation-Plain`)
    - Fact `reference-size`: `440×98px`; provenance: `figma-literal` at `559:19331`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `559:19331`
    - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `559:19331`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `559:19331`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `559:19331`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `559:19331`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `559:19331`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `559:19331`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `559:19331`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `559:19331`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `559:19331`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `559:19331`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `559:19331`
    - Fact `instance-viewport`: `desktop`; provenance: `figma-literal` at `559:19331`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×244px`; provenance: `figma-literal` at `497:25954`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `497:25954`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `497:25954`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `497:25954`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `497:25954`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `497:25954`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `497:25954`
  - Fact `border-radius`: `14px`; provenance: `figma-literal` at `497:25954`
  - Fact `background`: `#F8F8FA`; provenance: `figma-literal` at `497:25954`
  - `root-heading` — role `heading`; render `html-text`; visibility `always`
    - Fact `reference-size`: `220×40px`; provenance: `figma-literal` at `497:25838`
    - Fact `text-color`: `#DE2141`; provenance: `figma-literal` at `497:25838`
    - Fact `source-text`: `Детали подозрительной операции`; provenance: `figma-literal` at `497:25838`
    - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `497:25838`
    - Fact `font-style`: `Regular`; provenance: `figma-literal` at `497:25838`
    - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25838`
    - Fact `text-align`: `left`; provenance: `figma-literal` at `497:25838`
    - Fact `text-decoration`: `none`; provenance: `figma-literal` at `497:25838`
    - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `497:25838`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25838`
    - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `497:25838`
    - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `497:25838`
    - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `497:25838`
    - Fact `text-case`: `original`; provenance: `figma-literal` at `497:25838`
    - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25838`
  - `root-operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation-plain` (`Details/Operation-Plain`)
    - Fact `reference-size`: `220×156px`; provenance: `figma-literal` at `559:19361`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `559:19361`
    - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `559:19361`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `559:19361`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `559:19361`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `559:19361`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `559:19361`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `559:19361`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `559:19361`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `559:19361`
    - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `559:19361`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `559:19361`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `559:19361`
    - Fact `instance-viewport`: `mobile`; provenance: `figma-literal` at `559:19361`

### Properties and variants

- Variant `desktop` — Figma node `497:25953`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `497:25954`; axes: `Viewport=Mobile`
- Direct Figma source: `497:25953`; `Viewport=Desktop`; reference frame 488×192px
- Direct Figma source: `497:25954`; `Viewport=Mobile`; reference frame 252×244px

### Constraints and dependencies

- Constraint `fixed-red-heading` — scope `all`; kind `layout`; severity `required`: Заголовок имеет цвет #DE2141; контейнер #F8F8FA со скруглением 14px Mobile / 18px Desktop.
- Dependency: `/contracts/mobile/root/children/1/component_id` → component `details-operation-plain` (`Details/Operation-Plain`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `details-operation-plain` (`Details/Operation-Plain`)

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: details-suspicious-operation
PURPOSE: Вложенный предупреждающий блок с реквизитами подозрительной операции.
RENDER: HTML
```

<!-- library: service; component-id: details-transfer -->
## Details/Transfer

### Identity and purpose

- CUPIS ID: `details-transfer`
- Status: `active`
- Library: `service`
- Semantic role: `details`
- Category: `transfer`
- Figma: `8zka5bHkcrJVK9I9dKjnhC#484:20761` (`component-set`)
- Source root: `538:17235`
- Verified: `2026-09-06`
- Figma source check: `figma-source-recorded` on `2026-09-13`; Точные параметры исходных вариантов записаны непосредственно из Figma; существующие Mobile/Desktop HTML-деревья остаются непроверенной миграционной проекцией.
- Structure fingerprint: `sha256:7c4eb3c7a891ee19421002d0e3c173a8d3d8e88d3c63f79eca96ceaa832f3133`
- Purpose: Вложенная таблица реквизитов перевода или возврата.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Transfer` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `488×364px`; provenance: `figma-literal` at `477:21326`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `477:21326`
  - Fact `layout-gap`: `16px`; provenance: `figma-literal` at `477:21326`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21326`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21326`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21326`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21326`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `477:21326`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21326`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21326`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `477:21326`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `477:21326`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21326`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21241`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21241`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21241`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21241`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21241`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21241`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21241`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21241`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21241`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21241`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21241`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21241`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21241`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21242`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21242`
      - Fact `source-text`: `Вид операции`; provenance: `figma-literal` at `477:21242`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21242`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21242`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21242`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21242`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21242`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21242`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21242`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21242`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21242`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21242`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21242`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21242`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21243`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21243`
      - Fact `source-text`: `Возврат остатка ЭДС (его части)`; provenance: `figma-literal` at `477:21243`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21243`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21243`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21243`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21243`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21243`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21243`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21243`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21243`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21243`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21243`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21243`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21243`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21245`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21245`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21245`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21245`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21245`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21245`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21245`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21245`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21245`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21245`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21245`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21245`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21245`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21246`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21246`
      - Fact `source-text`: `Способ перевода`; provenance: `figma-literal` at `477:21246`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21246`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21246`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21246`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21246`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21246`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21246`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21246`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21246`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21246`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21246`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21246`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21246`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21247`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21247`
      - Fact `source-text`: `Кошелек ЦУПИС`; provenance: `figma-literal` at `477:21247`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21247`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21247`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21247`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21247`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21247`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21247`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21247`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21247`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21247`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21247`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21247`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21247`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21249`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21249`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21249`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21249`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21249`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21249`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21249`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21249`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21249`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21249`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21249`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21249`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21249`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21250`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21250`
      - Fact `source-text`: `Получатель`; provenance: `figma-literal` at `477:21250`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21250`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21250`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21250`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21250`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21250`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21250`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21250`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21250`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21250`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21250`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21250`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21250`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21251`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21251`
      - Fact `source-text`: `Банковская карта 415481******0071`; provenance: `figma-literal` at `477:21251`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21251`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21251`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21251`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21251`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21251`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21251`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21251`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21251`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21251`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21251`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21251`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21251`
  - `root-row-04` — role `row-04`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21315`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21315`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21315`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21315`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21315`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21315`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21315`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21315`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21315`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21315`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21315`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21315`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21315`
    - `root-row-04-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21316`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21316`
      - Fact `source-text`: `ИНН получателя`; provenance: `figma-literal` at `477:21316`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21316`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21316`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21316`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21316`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21316`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21316`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21316`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21316`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21316`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21316`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21316`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21316`
    - `root-row-04-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21317`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21317`
      - Fact `source-text`: `480800951007`; provenance: `figma-literal` at `477:21317`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21317`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21317`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21317`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21317`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21317`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21317`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21317`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21317`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21317`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21317`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21317`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21317`
  - `root-row-05` — role `row-05`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21253`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21253`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21253`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21253`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21253`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21253`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21253`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21253`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21253`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21253`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21253`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21253`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21253`
    - `root-row-05-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21254`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21254`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `477:21254`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21254`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21254`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21254`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21254`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21254`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21254`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21254`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21254`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21254`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21254`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21254`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21254`
    - `root-row-05-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21255`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21255`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `477:21255`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21255`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21255`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21255`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21255`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21255`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21255`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21255`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21255`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21255`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21255`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21255`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21255`
  - `root-row-06` — role `row-06`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21257`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21257`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21257`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21257`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21257`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21257`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21257`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21257`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21257`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21257`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21257`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21257`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21257`
    - `root-row-06-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21258`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21258`
      - Fact `source-text`: `Сумма перевода`; provenance: `figma-literal` at `477:21258`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21258`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21258`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21258`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21258`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21258`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21258`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21258`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21258`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21258`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21258`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21258`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21258`
    - `root-row-06-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21259`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21259`
      - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `477:21259`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21259`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21259`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21259`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21259`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21259`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21259`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21259`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21259`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21259`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21259`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21259`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21259`
  - `root-row-07` — role `row-07`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21309`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21309`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21309`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21309`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21309`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21309`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21309`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21309`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21309`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21309`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21309`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21309`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21309`
    - `root-row-07-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21310`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21310`
      - Fact `source-text`: `Комиссия`; provenance: `figma-literal` at `477:21310`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21310`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21310`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21310`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21310`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21310`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21310`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21310`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21310`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21310`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21310`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21310`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21310`
    - `root-row-07-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21311`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21311`
      - Fact `source-text`: `32,90 ₽`; provenance: `figma-literal` at `477:21311`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21311`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21311`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21311`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21311`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21311`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21311`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21311`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21311`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21311`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21311`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21311`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21311`
  - `root-row-08` — role `row-08`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21320`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21320`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21320`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21320`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21320`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21320`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21320`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21320`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21320`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21320`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21320`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21320`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21320`
    - `root-row-08-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21321`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21321`
      - Fact `source-text`: `Общая сумма`; provenance: `figma-literal` at `477:21321`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21321`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21321`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21321`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21321`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21321`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21321`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21321`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21321`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21321`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21321`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21321`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21321`
    - `root-row-08-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21322`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21322`
      - Fact `source-text`: `132,90 ₽`; provenance: `figma-literal` at `477:21322`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21322`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21322`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21322`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21322`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21322`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21322`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21322`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21322`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21322`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21322`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21322`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21322`
  - `root-row-09` — role `row-09`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21261`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21261`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21261`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21261`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21261`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21261`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21261`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21261`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21261`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21261`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21261`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21261`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21261`
    - `root-row-09-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21262`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21262`
      - Fact `source-text`: `Номер операции`; provenance: `figma-literal` at `477:21262`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21262`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21262`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21262`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21262`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21262`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21262`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21262`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21262`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21262`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21262`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21262`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21262`
    - `root-row-09-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21263`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21263`
      - Fact `source-text`: `0185305415324`; provenance: `figma-literal` at `477:21263`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21263`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21263`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21263`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21263`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21263`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21263`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21263`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21263`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21263`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21263`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21263`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21263`
  - `root-row-10` — role `row-10`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `488×22px`; provenance: `figma-literal` at `477:21265`
    - Fact `layout-axis`: `horizontal`; provenance: `figma-literal` at `477:21265`
    - Fact `layout-gap`: `0px`; provenance: `figma-literal` at `477:21265`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `477:21265`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `477:21265`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `477:21265`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `477:21265`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `477:21265`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `477:21265`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `477:21265`
    - Fact `primary-alignment`: `space_between`; provenance: `figma-literal` at `477:21265`
    - Fact `counter-alignment`: `center`; provenance: `figma-literal` at `477:21265`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `477:21265`
    - `root-row-10-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `200×22px`; provenance: `figma-literal` at `477:21266`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `477:21266`
      - Fact `source-text`: `ЭСП`; provenance: `figma-literal` at `477:21266`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21266`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21266`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21266`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `477:21266`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21266`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21266`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21266`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21266`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21266`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21266`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21266`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21266`
    - `root-row-10-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `288×22px`; provenance: `figma-literal` at `477:21267`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `477:21267`
      - Fact `source-text`: `184-9006247773`; provenance: `figma-literal` at `477:21267`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `477:21267`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `477:21267`
      - Fact `font-size`: `16px`; provenance: `figma-literal` at `477:21267`
      - Fact `text-align`: `right`; provenance: `figma-literal` at `477:21267`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `477:21267`
      - Fact `figma-style-id`: `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,`; provenance: `figma-literal` at `477:21267`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:21267`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `477:21267`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `477:21267`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `477:21267`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `477:21267`
      - Fact `figma-style-name`: `Desktop/Body/Medium`; provenance: `figma-literal` at `477:21267`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `reference-size`: `252×492px`; provenance: `figma-literal` at `484:20760`
  - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20760`
  - Fact `layout-gap`: `12px`; provenance: `figma-literal` at `484:20760`
  - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20760`
  - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20760`
  - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20760`
  - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20760`
  - Fact `horizontal-sizing`: `fixed`; provenance: `figma-literal` at `484:20760`
  - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20760`
  - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20760`
  - Fact `primary-alignment`: `min`; provenance: `figma-literal` at `484:20760`
  - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20760`
  - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20760`
  - `root-row-01` — role `row-01`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20722`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20722`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20722`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20722`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20722`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20722`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20722`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20722`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20722`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20722`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20722`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20722`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20722`
    - `root-row-01-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20723`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20723`
      - Fact `source-text`: `Вид операции`; provenance: `figma-literal` at `484:20723`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20723`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20723`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20723`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20723`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20723`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20723`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20723`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20723`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20723`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20723`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20723`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20723`
    - `root-row-01-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20724`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20724`
      - Fact `source-text`: `Возврат остатка ЭДС (его части)`; provenance: `figma-literal` at `484:20724`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20724`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20724`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20724`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20724`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20724`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20724`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20724`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20724`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20724`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20724`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20724`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20724`
  - `root-row-02` — role `row-02`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20726`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20726`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20726`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20726`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20726`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20726`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20726`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20726`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20726`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20726`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20726`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20726`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20726`
    - `root-row-02-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20727`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20727`
      - Fact `source-text`: `Способ оплаты`; provenance: `figma-literal` at `484:20727`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20727`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20727`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20727`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20727`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20727`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20727`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20727`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20727`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20727`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20727`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20727`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20727`
    - `root-row-02-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20728`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20728`
      - Fact `source-text`: `Кошелек ЦУПИС`; provenance: `figma-literal` at `484:20728`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20728`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20728`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20728`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20728`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20728`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20728`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20728`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20728`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20728`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20728`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20728`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20728`
  - `root-row-03` — role `row-03`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20730`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20730`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20730`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20730`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20730`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20730`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20730`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20730`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20730`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20730`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20730`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20730`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20730`
    - `root-row-03-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20731`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20731`
      - Fact `source-text`: `Получатель`; provenance: `figma-literal` at `484:20731`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20731`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20731`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20731`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20731`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20731`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20731`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20731`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20731`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20731`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20731`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20731`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20731`
    - `root-row-03-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20732`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20732`
      - Fact `source-text`: `Банковская карта 415481******0071`; provenance: `figma-literal` at `484:20732`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20732`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20732`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20732`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20732`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20732`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20732`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20732`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20732`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20732`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20732`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20732`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20732`
  - `root-row-04` — role `row-04`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20734`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20734`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20734`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20734`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20734`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20734`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20734`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20734`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20734`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20734`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20734`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20734`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20734`
    - `root-row-04-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20735`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20735`
      - Fact `source-text`: `Дата и время`; provenance: `figma-literal` at `484:20735`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20735`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20735`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20735`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20735`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20735`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20735`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20735`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20735`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20735`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20735`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20735`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20735`
    - `root-row-04-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20736`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20736`
      - Fact `source-text`: `26.03.2021, 12:45 МСК`; provenance: `figma-literal` at `484:20736`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20736`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20736`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20736`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20736`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20736`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20736`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20736`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20736`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20736`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20736`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20736`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20736`
  - `root-row-05` — role `row-05`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20738`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20738`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20738`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20738`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20738`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20738`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20738`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20738`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20738`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20738`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20738`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20738`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20738`
    - `root-row-05-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20739`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20739`
      - Fact `source-text`: `Сумма перевода`; provenance: `figma-literal` at `484:20739`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20739`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20739`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20739`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20739`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20739`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20739`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20739`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20739`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20739`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20739`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20739`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20739`
    - `root-row-05-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20740`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20740`
      - Fact `source-text`: `100,00 ₽`; provenance: `figma-literal` at `484:20740`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20740`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20740`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20740`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20740`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20740`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20740`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20740`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20740`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20740`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20740`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20740`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20740`
  - `root-row-06` — role `row-06`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20749`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20749`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20749`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20749`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20749`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20749`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20749`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20749`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20749`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20749`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20749`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20749`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20749`
    - `root-row-06-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20750`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20750`
      - Fact `source-text`: `Комиссия`; provenance: `figma-literal` at `484:20750`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20750`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20750`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20750`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20750`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20750`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20750`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20750`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20750`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20750`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20750`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20750`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20750`
    - `root-row-06-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20751`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20751`
      - Fact `source-text`: `32,90 ₽`; provenance: `figma-literal` at `484:20751`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20751`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20751`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20751`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20751`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20751`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20751`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20751`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20751`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20751`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20751`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20751`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20751`
  - `root-row-07` — role `row-07`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20755`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20755`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20755`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20755`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20755`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20755`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20755`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20755`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20755`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20755`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20755`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20755`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20755`
    - `root-row-07-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20756`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20756`
      - Fact `source-text`: `Общая сумма`; provenance: `figma-literal` at `484:20756`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20756`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20756`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20756`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20756`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20756`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20756`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20756`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20756`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20756`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20756`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20756`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20756`
    - `root-row-07-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20757`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20757`
      - Fact `source-text`: `132,90 ₽`; provenance: `figma-literal` at `484:20757`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20757`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20757`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20757`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20757`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20757`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20757`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20757`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20757`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20757`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20757`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20757`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20757`
  - `root-row-08` — role `row-08`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20742`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20742`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20742`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20742`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20742`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20742`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20742`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20742`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20742`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20742`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20742`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20742`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20742`
    - `root-row-08-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20743`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20743`
      - Fact `source-text`: `Номер операции`; provenance: `figma-literal` at `484:20743`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20743`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20743`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20743`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20743`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20743`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20743`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20743`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20743`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20743`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20743`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20743`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20743`
    - `root-row-08-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20744`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20744`
      - Fact `source-text`: `0185305415324`; provenance: `figma-literal` at `484:20744`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20744`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20744`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20744`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20744`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20744`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20744`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20744`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20744`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20744`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20744`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20744`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20744`
  - `root-row-09` — role `row-09`; render `presentation-table`; visibility `always`
    - Fact `reference-size`: `252×44px`; provenance: `figma-literal` at `484:20746`
    - Fact `layout-axis`: `vertical`; provenance: `figma-literal` at `484:20746`
    - Fact `layout-gap`: `4px`; provenance: `figma-literal` at `484:20746`
    - Fact `padding-top`: `0px`; provenance: `figma-literal` at `484:20746`
    - Fact `padding-right`: `0px`; provenance: `figma-literal` at `484:20746`
    - Fact `padding-bottom`: `0px`; provenance: `figma-literal` at `484:20746`
    - Fact `padding-left`: `0px`; provenance: `figma-literal` at `484:20746`
    - Fact `horizontal-sizing`: `fill`; provenance: `figma-literal` at `484:20746`
    - Fact `vertical-sizing`: `hug`; provenance: `figma-literal` at `484:20746`
    - Fact `layout-wrap`: `no_wrap`; provenance: `figma-literal` at `484:20746`
    - Fact `primary-alignment`: `center`; provenance: `figma-literal` at `484:20746`
    - Fact `counter-alignment`: `min`; provenance: `figma-literal` at `484:20746`
    - Fact `border-radius`: `0px`; provenance: `figma-literal` at `484:20746`
    - `root-row-09-label` — role `label`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20747`
      - Fact `text-color`: `#98999C`; provenance: `figma-literal` at `484:20747`
      - Fact `source-text`: `ЭСП`; provenance: `figma-literal` at `484:20747`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20747`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20747`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20747`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20747`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20747`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20747`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20747`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20747`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20747`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20747`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20747`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20747`
    - `root-row-09-value` — role `value`; render `html-text`; visibility `always`
      - Fact `reference-size`: `252×20px`; provenance: `figma-literal` at `484:20748`
      - Fact `text-color`: `#000000`; provenance: `figma-literal` at `484:20748`
      - Fact `source-text`: `184-9006247773`; provenance: `figma-literal` at `484:20748`
      - Fact `font-family`: `Roboto`; provenance: `figma-literal` at `484:20748`
      - Fact `font-style`: `Regular`; provenance: `figma-literal` at `484:20748`
      - Fact `font-size`: `14px`; provenance: `figma-literal` at `484:20748`
      - Fact `text-align`: `left`; provenance: `figma-literal` at `484:20748`
      - Fact `text-decoration`: `none`; provenance: `figma-literal` at `484:20748`
      - Fact `figma-style-id`: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`; provenance: `figma-literal` at `484:20748`
      - Fact `line-height`: `140%`; provenance: `figma-literal` at `484:20748`
      - Fact `letter-spacing`: `0%`; provenance: `figma-literal` at `484:20748`
      - Fact `text-auto-resize`: `height`; provenance: `figma-literal` at `484:20748`
      - Fact `vertical-text-align`: `top`; provenance: `figma-literal` at `484:20748`
      - Fact `text-case`: `original`; provenance: `figma-literal` at `484:20748`
      - Fact `figma-style-name`: `Mobile/Body/Large`; provenance: `figma-literal` at `484:20748`

### Properties and variants

- Variant `mobile` — Figma node `484:20760`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `477:21326`; axes: `Viewport=Desktop`
- Direct Figma source: `484:20760`; `Viewport=Mobile`; reference frame 252×492px
- Direct Figma source: `477:21326`; `Viewport=Desktop`; reference frame 488×364px

### Output contract classification

- Mobile/Desktop output trees are migration drafts; direct Figma source variants are recorded in the machine contract and must be mapped before build use.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: details-transfer
PURPOSE: Вложенная таблица реквизитов перевода или возврата.
RENDER: HTML
```
