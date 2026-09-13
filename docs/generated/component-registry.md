<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: component-registry -->
<!-- source-digest: sha256:cf72ecc07b1c457a44cdc48794bbaeb49bc2b11ee71731043b9bfa4c283c022d -->
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
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `feature-icon` as `direct-image`

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
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `bullets` — role `bullets`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
  - `alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `bullets` — role `bullets`; render `nested-component`; visibility `always`; component `item-bullet` (`Item/Bullet`)
  - `alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Properties and variants

- Variant `mobile` — Figma node `222:786`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `234:607`; axes: `Viewport=Desktop`
- Direct Figma source: `222:786`; `Viewport=Mobile`; reference frame 328×645px
- Direct Figma source: `234:607`; `Viewport=Desktop`; reference frame 600×761px
- Property `show-alert` (`Show Alert`) — `boolean`; default `true`
- Property `show-button` (`Show Button`) — `boolean`; default `true`
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/mobile/root/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/mobile/root/children/3/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `item-bullet` (`Item/Bullet`)
- Dependency: `/contracts/desktop/root/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/desktop/root/children/3/component_id` → component `button-secondary` (`Button/Secondary`)

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
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `cards` — role `cards`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `252px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `488px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `cards` — role `cards`; render `nested-component`; visibility `always`; component `card-image` (`Card/Image`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Properties and variants

- Variant `desktop` — Figma node `398:7570`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `398:7598`; axes: `Viewport=Mobile`
- Direct Figma source: `398:7570`; `Viewport=Desktop`; reference frame 600×1242px
- Direct Figma source: `398:7598`; `Viewport=Mobile`; reference frame 328×2021px
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `card-image` (`Card/Image`)

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
  - `text-content` — role `text-content`; render `html-text`; visibility `always`
  - `notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
  - `alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `text-content` — role `text-content`; render `html-text`; visibility `always`
  - `notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
  - `alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

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

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/mobile/root/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/mobile/root/children/3/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/desktop/root/children/2/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/desktop/root/children/3/component_id` → component `button-secondary` (`Button/Secondary`)

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
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `cards` — role `cards`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `252px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `488px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `cards` — role `cards`; render `nested-component`; visibility `always`; component `card-icon` (`Card/Icon`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Properties and variants

- Variant `desktop` — Figma node `398:7759`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `398:7953`; axes: `Viewport=Mobile`
- Direct Figma source: `398:7759`; `Viewport=Desktop`; reference frame 600×1182px
- Direct Figma source: `398:7953`; `Viewport=Mobile`; reference frame 328×1367px
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `card-icon` (`Card/Icon`)

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
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `rows` — role `rows`; render `presentation-table`; visibility `always`
    - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`
    - `text` — role `text`; render `html-text`; visibility `always`
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `42×42px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `56×56px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-12`: `6px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-13`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-14`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `rows` — role `rows`; render `presentation-table`; visibility `always`
    - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`
    - `text` — role `text`; render `html-text`; visibility `always`
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

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
- Asset usage: `mobile` `/contracts/mobile/root/children/1/children/0` → `feature-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/1/children/0` → `feature-icon` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/2/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/2/component_id` → component `button-secondary` (`Button/Secondary`)

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
  - `alert-icon` — role `icon`; render `direct-image`; visibility `always`; asset `alert-icon`
  - `text` — role `text`; render `html-text`; visibility `always`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `24×24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `26×26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: asset `alert-icon`
  - Fact `description-11`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `alert-icon` — role `icon`; render `direct-image`; visibility `always`; asset `alert-icon`
  - `text` — role `text`; render `html-text`; visibility `always`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `alert-icon` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `alert-icon` as `direct-image`

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
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `steps` — role `steps`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
  - `notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
  - `alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `6px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-12`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `steps` — role `steps`; render `nested-component`; visibility `always`; component `item-step` (`Item/Step`)
  - `notification` — role `notification`; render `nested-component`; visibility property `show-notification` (`Show Notification`); component `item-notification` (`Item/Notification`)
  - `alert` — role `alert`; render `nested-component`; visibility property `show-alert` (`Show Alert`); component `item-alert` (`Item/Alert`)
  - `button` — role `button`; render `nested-component`; visibility property `show-button` (`Show Button`); component `button-secondary` (`Button/Secondary`)
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

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

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/mobile/root/children/2/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/mobile/root/children/3/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/mobile/root/children/4/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `item-step` (`Item/Step`)
- Dependency: `/contracts/desktop/root/children/2/component_id` → component `item-notification` (`Item/Notification`)
- Dependency: `/contracts/desktop/root/children/3/component_id` → component `item-alert` (`Item/Alert`)
- Dependency: `/contracts/desktop/root/children/4/component_id` → component `button-secondary` (`Button/Secondary`)

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
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `description` — role `description`; render `html-text`; visibility property `show-description` (`Show Description`)
  - `link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)

### Mobile

- `root` — role `card`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `52×52px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `72×72px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `392px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `20px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `description` — role `description`; render `html-text`; visibility property `show-description` (`Show Description`)
  - `link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)

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
- Link: `mobile` `/contracts/mobile/root/children/3`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `feature-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/3`

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
  - Fact `root-layout-axis`: `horizontal`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `root-layout-gap`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `card-width`: `488px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `card-image` — role `image`; render `direct-image`; visibility `always`; asset `card-image`
    - Fact `image-display-dimensions`: `232×148px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `image-border-radius`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `text-content-layout-gap`: `6px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `text-content-width`: `232px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `text-content-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `heading-font-size`: `20px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `description` — role `description`; render `html-text`; visibility `always`
      - Fact `description-font-size`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `link` — role `link`; render `html-link`; visibility `always`
      - Fact `link-font-size`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Mobile

- `root` — role `card`; render `presentation-table`; visibility `always`
  - Fact `root-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `root-layout-gap`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `card-image` — role `image`; render `direct-image`; visibility `always`; asset `card-image`
    - Fact `width-behavior`: `fluid-to-container`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `height-behavior`: `auto`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `fixed-height-forbidden`: `true`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `image-border-radius`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `text-content` — role `text-content`; render `presentation-table`; visibility `always`
    - Fact `text-content-layout-gap`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - Fact `text-content-layout-axis`: `vertical`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `heading` — role `heading`; render `html-text`; visibility `always`
      - Fact `heading-font-size`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `description` — role `description`; render `html-text`; visibility `always`
      - Fact `description-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
    - `link` — role `link`; render `html-link`; visibility `always`
      - Fact `link-font-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

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
  - `logo` — role `logo`; render `direct-image`; visibility `always`; asset `header-logo`

### Mobile

- `root` — role `email`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `600px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `212×33px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: asset `header-logo`
  - Fact `description-7`: `322×50px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `#F3F3F5`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `logo` — role `logo`; render `direct-image`; visibility `always`; asset `header-logo`

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
  - `alert-icon` — role `icon`; render `direct-image`; visibility `always`; asset `alert-icon`
  - `text` — role `text`; render `html-text`; visibility `always`

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `24×24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `26×26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: asset `alert-icon`
  - Fact `description-10`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `alert-icon` — role `icon`; render `direct-image`; visibility `always`; asset `alert-icon`
  - `text` — role `text`; render `html-text`; visibility `always`

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
  - `indicator` — role `bullet-indicator`; render `html-text`; visibility `always`
  - `text` — role `text`; render `html-text`; visibility `always`
  - `link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `8×8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `6px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `indicator` — role `bullet-indicator`; render `html-text`; visibility `always`
  - `text` — role `text`; render `html-text`; visibility `always`
  - `link` — role `link`; render `html-link`; visibility property `show-link` (`Show Link`)

### Properties and variants

- Variant `mobile` — Figma node `222:702`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `234:580`; axes: `Viewport=Desktop`
- Direct Figma source: `222:702`; `Viewport=Mobile`; reference frame 252×106px
- Direct Figma source: `234:580`; `Viewport=Desktop`; reference frame 488×109px
- Property `show-link` (`Show Link`) — `boolean`; default `true`

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/2`
- Link: `desktop` `/contracts/desktop/root/children/2`

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
  - `text` — role `text`; render `html-text`; visibility `always`
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `42×42px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `20px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `48×48px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `@4x`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `text` — role `text`; render `html-text`; visibility `always`
  - `feature-icon` — role `icon`; render `direct-image`; visibility `always`; asset `feature-icon`

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
  - `badge` — role `badge`; render `nested-component`; visibility `always`; component `badge-step-number` (`Badge/Step-Number`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

### Mobile

- `root` — role `item`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `6px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `badge` — role `badge`; render `nested-component`; visibility `always`; component `badge-step-number` (`Badge/Step-Number`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `caption` — role `caption`; render `html-text`; visibility property `show-caption` (`Show Caption`)

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
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `bank-badge` — role `image`; render `direct-image`; visibility `always`; asset `bank-badge`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `72×72px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `bank-badge` — role `image`; render `direct-image`; visibility `always`; asset `bank-badge`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `bank-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `bank-badge` as `direct-image`

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
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `icon-badge` — role `image`; render `direct-image`; visibility `always`; asset `icon-badge`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `72×72px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `icon-badge` — role `image`; render `direct-image`; visibility `always`; asset `icon-badge`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `icon-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `icon-badge` as `direct-image`

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
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `partner-badge` — role `image`; render `direct-image`; visibility `always`; asset `partner-badge`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `72×72px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `partner-badge` — role `image`; render `direct-image`; visibility `always`; asset `partner-badge`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `partner-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `partner-badge` as `direct-image`

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
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `status-badge-negative` — role `image`; render `direct-image`; visibility `always`; asset `status-badge-negative`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `72×72px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `status-badge-negative` — role `image`; render `direct-image`; visibility `always`; asset `status-badge-negative`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `status-badge-negative` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `status-badge-negative` as `direct-image`

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
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - `status-badge-positive` — role `image`; render `direct-image`; visibility `always`; asset `status-badge-positive`

### Mobile

- `root` — role `asset`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `72×72px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `status-badge-positive` — role `image`; render `direct-image`; visibility `always`; asset `status-badge-positive`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `status-badge-positive` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `status-badge-positive` as `direct-image`

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
- Structure fingerprint: `sha256:2a37df985838ab75a01c031e9737fb3d094f9fe0b58205d5de52d73bb4ceb604`
- Purpose: Группа кликабельных строк со ссылками на проверку фискального чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Fiscal-Check-Link` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:25046`
  - Fact `item-gap`: `12px`; provenance: `figma-literal` at `502:25046`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `502:25046`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `502:25046`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `502:25046`
  - `item-01` — role `item-01`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `497:19958`
    - Fact `item-gap`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `padding-top`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `padding-right`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `padding-left`: `24px`; provenance: `figma-literal` at `497:19958`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:19958`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `497:19958`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:19958`
    - `logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `ofd-badge` — role `ofd-badge`; render `direct-image`; visibility `always`; asset `ofd-badge`
        - Fact `corner-radius`: `48px`; provenance: `figma-literal` at `497:19959`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:19959`
        - Fact `display-width`: `48px`; provenance: `figma-literal` at `497:19959`
        - Fact `display-height`: `48px`; provenance: `figma-literal` at `497:19959`
    - `text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `497:19960`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `497:19960`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:19960`
        - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `497:19960`
    - `chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:19961`
        - Fact `display-width`: `24px`; provenance: `figma-literal` at `497:19961`
        - Fact `display-height`: `24px`; provenance: `figma-literal` at `497:19961`
  - `item-02` — role `item-02`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `497:19963`
    - Fact `item-gap`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `padding-top`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `padding-right`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `padding-left`: `24px`; provenance: `figma-literal` at `497:19963`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:19963`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `497:19963`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:19963`
    - `logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `fns-badge` — role `fns-badge`; render `direct-image`; visibility `always`; asset `fns-badge`
        - Fact `corner-radius`: `48px`; provenance: `figma-literal` at `497:19964`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:19964`
        - Fact `display-width`: `48px`; provenance: `figma-literal` at `497:19964`
        - Fact `display-height`: `48px`; provenance: `figma-literal` at `497:19964`
    - `text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `497:19965`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `497:19965`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:19965`
        - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `497:19965`
    - `chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:19966`
        - Fact `display-width`: `24px`; provenance: `figma-literal` at `497:19966`
        - Fact `display-height`: `24px`; provenance: `figma-literal` at `497:19966`

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:25047`
  - Fact `item-gap`: `8px`; provenance: `figma-literal` at `502:25047`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `502:25047`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `502:25047`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `502:25047`
  - `item-01` — role `item-01`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `502:25000`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `padding-top`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `padding-right`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `padding-left`: `16px`; provenance: `figma-literal` at `502:25000`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:25000`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `502:25000`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:25000`
    - `logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `ofd-badge` — role `ofd-badge`; render `direct-image`; visibility `always`; asset `ofd-badge`
        - Fact `corner-radius`: `48px`; provenance: `figma-literal` at `502:25001`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:25001`
        - Fact `display-width`: `48px`; provenance: `figma-literal` at `502:25001`
        - Fact `display-height`: `48px`; provenance: `figma-literal` at `502:25001`
    - `text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `502:25002`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:25002`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:25002`
        - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:25002`
    - `chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:25003`
        - Fact `display-width`: `24px`; provenance: `figma-literal` at `502:25003`
        - Fact `display-height`: `24px`; provenance: `figma-literal` at `502:25003`
  - `item-02` — role `item-02`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `502:25005`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `padding-top`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `padding-right`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `padding-left`: `16px`; provenance: `figma-literal` at `502:25005`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:25005`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `502:25005`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:25005`
    - `logo-cell` — role `logo-cell`; render `html-link`; visibility `always`
      - `fns-badge` — role `fns-badge`; render `direct-image`; visibility `always`; asset `fns-badge`
        - Fact `corner-radius`: `48px`; provenance: `figma-literal` at `502:25006`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:25006`
        - Fact `display-width`: `48px`; provenance: `figma-literal` at `502:25006`
        - Fact `display-height`: `48px`; provenance: `figma-literal` at `502:25006`
    - `text-cell` — role `text-cell`; render `html-link`; visibility `always`
      - `link-text` — role `link-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `502:25007`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `502:25007`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `502:25007`
        - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `502:25007`
    - `chevron-cell` — role `chevron-cell`; render `html-link`; visibility `always`
      - `chevron-icon` — role `chevron-icon`; render `direct-image`; visibility `always`; asset `chevron-icon`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:25008`
        - Fact `display-width`: `24px`; provenance: `figma-literal` at `502:25008`
        - Fact `display-height`: `24px`; provenance: `figma-literal` at `502:25008`

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
- Structure fingerprint: `sha256:435f50a07a3d2cc5e8a2e5571f20c849d513ad5a98847ce55078e5be5f83b254`
- Purpose: Контактный блок поддержки с телефонным действием и ссылкой на раздел помощи.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Contact-Support` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `472:16997`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `472:16997`
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27581`
    - Fact `item-gap`: `24px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:27581`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27581`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `459:27581`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:27581`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:27581`
    - `phone-cta` — role `phone-cta`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27582`
      - Fact `item-gap`: `12px`; provenance: `figma-literal` at `459:27582`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27582`
      - `heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `459:27583`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `459:27583`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27583`
        - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `459:27583`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27583`
      - `phone-number` — role `phone-number`; render `html-link`; visibility `always`
        - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `459:27584`
        - Fact `font-size`: `26px`; provenance: `figma-literal` at `459:27584`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27584`
        - Fact `text-style`: `Desktop/Heading`; provenance: `figma-literal` at `459:27584`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27584`
    - `help-notice` — role `help-notice`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:27585`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27585`
      - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `459:27585`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:27585`
      - Fact `fill-color`: `#F8F8FA`; provenance: `figma-literal` at `459:27585`
      - `help-text` — role `help-text`; render `html-text`; visibility `always`
        - Fact `text-style`: `Desktop/Body/Medium`; provenance: `figma-literal` at `459:27586`
        - Fact `segment-1-color`: `#757678`; provenance: `figma-literal` at `459:27586`
        - Fact `segment-2-color`: `#00991F`; provenance: `figma-literal` at `459:27586`
        - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `459:27586`
        - Fact `segment-2-label`: `«Помощь»`; provenance: `figma-literal` at `459:27586`
        - `inline-help-link` — role `help-link`; render `html-link`; visibility `always`
          - Fact `color`: `#00991F`; provenance: `figma-literal` at `459:27586`
          - Fact `decoration`: `underline`; provenance: `figma-literal` at `459:27586`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `472:16998`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `472:16998`
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27602`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27602`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `459:27602`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:27602`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:27602`
    - `phone-cta` — role `phone-cta`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27603`
      - Fact `item-gap`: `12px`; provenance: `figma-literal` at `459:27603`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27603`
      - `heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `459:27604`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `459:27604`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27604`
        - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `459:27604`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27604`
      - `phone-number` — role `phone-number`; render `html-link`; visibility `always`
        - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `459:27605`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `459:27605`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27605`
        - Fact `text-style`: `Mobile/Heading`; provenance: `figma-literal` at `459:27605`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:27605`
    - `help-notice` — role `help-notice`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:27606`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27606`
      - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `459:27606`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:27606`
      - Fact `fill-color`: `#F8F8FA`; provenance: `figma-literal` at `459:27606`
      - `help-text` — role `help-text`; render `html-text`; visibility `always`
        - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `459:27607`
        - Fact `segment-1-color`: `#757678`; provenance: `figma-literal` at `459:27607`
        - Fact `segment-2-color`: `#00991F`; provenance: `figma-literal` at `459:27607`
        - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `459:27607`
        - Fact `segment-2-label`: `«Помощь»`; provenance: `figma-literal` at `459:27607`
        - `inline-help-link` — role `help-link`; render `html-link`; visibility `always`
          - Fact `color`: `#00991F`; provenance: `figma-literal` at `459:27607`
          - Fact `decoration`: `underline`; provenance: `figma-literal` at `459:27607`

### Properties and variants

- Variant `desktop` — Figma node `472:16997`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `472:16998`; axes: `Viewport=Mobile`
- Direct Figma source: `472:16997`; `Viewport=Desktop`; reference frame 600×272px
- Direct Figma source: `472:16998`; `Viewport=Mobile`; reference frame 328×233px

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0/children/0/children/1`
- Link: `mobile` `/contracts/mobile/root/children/0/children/1/children/0/children/0`
- Link: `desktop` `/contracts/desktop/root/children/0/children/0/children/1`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1/children/0/children/0`

### Constraints and dependencies

- Constraint `inline-help-link` — scope `all`; kind `interaction`; severity `critical`; Description critical: Ссылка «Помощь» находится внутри одного help-text: базовый цвет #757678, встроенная ссылка #00991F с underline; URL поступает из данных письма.

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
- Structure fingerprint: `sha256:d4c16dbc69b2a9c324b43ab14d74e66a45b2b298f8177015a3593027111c2615`
- Purpose: Сервисный блок с инструкцией, нумерованными шагами и управляемыми предупреждениями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Instruction-Steps` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16699`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `510:16699`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `510:16699`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `510:16699`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `510:16699`
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16433`
    - Fact `item-gap`: `24px`; provenance: `figma-literal` at `510:16433`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `510:16433`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16433`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `510:16433`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `510:16433`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `510:16433`
    - `warning` — role `warning`; render `presentation-table`; visibility property `show-warning` (`Show Warning`)
      - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `531:13984`
      - Fact `item-gap`: `6px`; provenance: `figma-literal` at `531:13984`
      - `error-warning-line` — role `error-warning-line`; render `direct-image`; visibility `always`; asset `error-warning-line`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `531:13974`
        - Fact `display-width`: `24px`; provenance: `figma-literal` at `531:13974`
        - Fact `display-height`: `24px`; provenance: `figma-literal` at `531:13974`
      - `warning-text` — role `warning-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#DE2141`; provenance: `figma-literal` at `531:13896`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `531:13896`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `531:13896`
        - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `531:13896`
    - `numbered-list` — role `numbered-list`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16442`
      - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16442`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16442`
      - `intro-01` — role `intro-01`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16443`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16443`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16443`
        - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16443`
      - `intro-02` — role `intro-02`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16517`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16517`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16517`
        - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16517`
      - `item-01` — role `item-01`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16444`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `510:16444`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16444`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16445`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16445`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16445`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16446`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16446`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16446`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16446`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16446`
            - Fact `fixed-width`: `32px`; provenance: `figma-literal` at `510:16446`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16447`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16447`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16447`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16447`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16448`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16448`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16448`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16449`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16449`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16449`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16449`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16449`
            - Fact `fixed-width`: `64px`; provenance: `figma-literal` at `510:16449`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16450`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16450`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16450`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16450`
      - `item-02` — role `item-02`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16457`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `510:16457`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16457`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16458`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16458`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16458`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16459`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16459`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16459`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16459`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16459`
            - Fact `fixed-width`: `32px`; provenance: `figma-literal` at `510:16459`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16460`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16460`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16460`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16460`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16461`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16461`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16461`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16462`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16462`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16462`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16462`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16462`
            - Fact `fixed-width`: `64px`; provenance: `figma-literal` at `510:16462`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16463`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16463`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16463`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16463`
      - `item-03` — role `item-03`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16470`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `510:16470`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16470`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16471`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16471`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16471`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16472`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16472`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16472`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16472`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16472`
            - Fact `fixed-width`: `32px`; provenance: `figma-literal` at `510:16472`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16473`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16473`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16473`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16473`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16474`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16474`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16474`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16475`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16475`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16475`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16475`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16475`
            - Fact `fixed-width`: `64px`; provenance: `figma-literal` at `510:16475`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16476`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16476`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16476`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16476`
      - `item-04` — role `item-04`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16483`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `510:16483`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16483`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16484`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16484`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16484`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16485`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16485`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16485`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16485`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16485`
            - Fact `fixed-width`: `32px`; provenance: `figma-literal` at `510:16485`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16486`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16486`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16486`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16486`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16487`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16487`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16487`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16488`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16488`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16488`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16488`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16488`
            - Fact `fixed-width`: `64px`; provenance: `figma-literal` at `510:16488`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16489`
            - Fact `font-size`: `18px`; provenance: `figma-literal` at `510:16489`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16489`
            - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `510:16489`
    - `alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
      - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16497`
      - Fact `padding-top`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `padding-right`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `padding-left`: `24px`; provenance: `figma-literal` at `510:16497`
      - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `510:16497`
      - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `510:16497`
      - `notice-link` — role `notice-link`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `510:16498`
        - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `510:16498`
        - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `510:16498`
        - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `510:16498`
        - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `510:16498`
    - `disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16499`
      - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16499`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16499`
      - `disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `510:16501`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16501`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16501`
        - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `510:16501`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16700`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `510:16700`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `510:16700`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `510:16700`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `510:16700`
  - `content-area` — role `content-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16615`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `510:16615`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16615`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `510:16615`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `510:16615`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `510:16615`
    - `warning` — role `warning`; render `presentation-table`; visibility property `show-warning` (`Show Warning`)
      - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `531:14001`
      - Fact `item-gap`: `4px`; provenance: `figma-literal` at `531:14001`
      - `error-warning-line` — role `error-warning-line`; render `direct-image`; visibility `always`; asset `error-warning-line`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `531:14002`
        - Fact `display-width`: `20px`; provenance: `figma-literal` at `531:14002`
        - Fact `display-height`: `20px`; provenance: `figma-literal` at `531:14002`
      - `warning-text` — role `warning-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#DE2141`; provenance: `figma-literal` at `531:14004`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `531:14004`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `531:14004`
        - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `531:14004`
    - `numbered-list` — role `numbered-list`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16624`
      - Fact `item-gap`: `8px`; provenance: `figma-literal` at `510:16624`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16624`
      - `intro-01` — role `intro-01`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16625`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16625`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16625`
        - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16625`
      - `intro-02` — role `intro-02`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16959`
        - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16959`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16959`
        - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16959`
      - `item-01` — role `item-01`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16626`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `510:16626`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16626`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16627`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16627`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16627`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16628`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16628`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16628`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16628`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16628`
            - Fact `fixed-width`: `22px`; provenance: `figma-literal` at `510:16628`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16629`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16629`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16629`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16629`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16630`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16630`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16630`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16631`
            - Fact `font-size`: `12px`; provenance: `figma-literal` at `510:16631`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16631`
            - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16631`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16631`
            - Fact `fixed-width`: `42px`; provenance: `figma-literal` at `510:16631`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16632`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16632`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16632`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16632`
      - `item-02` — role `item-02`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16639`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `510:16639`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16639`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16640`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16640`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16640`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16641`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16641`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16641`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16641`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16641`
            - Fact `fixed-width`: `22px`; provenance: `figma-literal` at `510:16641`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16642`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16642`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16642`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16642`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16643`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16643`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16643`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16644`
            - Fact `font-size`: `12px`; provenance: `figma-literal` at `510:16644`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16644`
            - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16644`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16644`
            - Fact `fixed-width`: `42px`; provenance: `figma-literal` at `510:16644`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16645`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16645`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16645`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16645`
      - `item-03` — role `item-03`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16652`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `510:16652`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16652`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16653`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16653`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16653`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16654`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16654`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16654`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16654`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16654`
            - Fact `fixed-width`: `22px`; provenance: `figma-literal` at `510:16654`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16655`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16655`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16655`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16655`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16656`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16656`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16656`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16657`
            - Fact `font-size`: `12px`; provenance: `figma-literal` at `510:16657`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16657`
            - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16657`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16657`
            - Fact `fixed-width`: `42px`; provenance: `figma-literal` at `510:16657`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16658`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16658`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16658`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16658`
      - `item-04` — role `item-04`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16665`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `510:16665`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16665`
        - `numbered-row` — role `numbered-row`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16666`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16666`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16666`
          - `number` — role `number`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16667`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16667`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16667`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16667`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16667`
            - Fact `fixed-width`: `22px`; provenance: `figma-literal` at `510:16667`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16668`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16668`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16668`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16668`
        - `sub-item-01` — role `sub-item-01`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `510:16669`
          - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16669`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16669`
          - `dash` — role `dash`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#00991F`; provenance: `figma-literal` at `510:16670`
            - Fact `font-size`: `12px`; provenance: `figma-literal` at `510:16670`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16670`
            - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16670`
            - Fact `text-align`: `right`; provenance: `figma-literal` at `510:16670`
            - Fact `fixed-width`: `42px`; provenance: `figma-literal` at `510:16670`
          - `content` — role `content`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `510:16671`
            - Fact `font-size`: `14px`; provenance: `figma-literal` at `510:16671`
            - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16671`
            - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `510:16671`
    - `alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16679`
      - Fact `item-gap`: `4px`; provenance: `figma-literal` at `510:16679`
      - Fact `padding-top`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `padding-right`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `padding-left`: `16px`; provenance: `figma-literal` at `510:16679`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16679`
      - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `510:16679`
      - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `510:16679`
      - `notice-link` — role `notice-link`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `510:16680`
        - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:16680`
        - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `510:16680`
        - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `510:16680`
        - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `510:16680`
    - `disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:16681`
      - Fact `item-gap`: `12px`; provenance: `figma-literal` at `510:16681`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:16681`
      - `disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `510:16683`
        - Fact `font-size`: `12px`; provenance: `figma-literal` at `510:16683`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `510:16683`
        - Fact `text-style`: `Mobile/Caption`; provenance: `figma-literal` at `510:16683`

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
- Structure fingerprint: `sha256:36c8856dbc6576457e62f525f84310283d39929189e822ae871318242a063fa4`
- Purpose: Сервисный блок обновления персональных данных со статусом и управляемыми пояснениями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Personal-Data-Update` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `491:22454`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `491:22454`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `491:22454`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `491:22454`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `491:22454`
  - `card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `619:21431`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21431`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `619:21431`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `619:21431`
    - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `491:22404`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `491:22404`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `491:22404`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22404`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `491:22404`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `491:22404`
      - `status-row` — role `status-row`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `491:22405`
        - Fact `item-gap`: `24px`; provenance: `figma-literal` at `491:22405`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22405`
        - `status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
          - Fact `corner-radius`: `56.000003814697266px`; provenance: `figma-literal` at `491:22406`
          - Fact `clips-content`: `true`; provenance: `figma-literal` at `491:22406`
          - Fact `display-width`: `72px`; provenance: `figma-literal` at `491:22406`
          - Fact `display-height`: `72px`; provenance: `figma-literal` at `491:22406`
        - `heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `491:22407`
          - Fact `font-size`: `26px`; provenance: `figma-literal` at `491:22407`
          - Fact `line-height`: `120%`; provenance: `figma-literal` at `491:22407`
          - Fact `text-style`: `Desktop/Heading`; provenance: `figma-literal` at `491:22407`
    - `divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22408`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `491:22408`
      - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `491:22408`
      - Fact `height`: `1px`; provenance: `figma-literal` at `491:22408`
    - `body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `491:22409`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `491:22409`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `491:22409`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22409`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `491:22409`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `491:22409`
      - `text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `491:22410`
        - Fact `item-gap`: `12px`; provenance: `figma-literal` at `491:22410`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22410`
        - `greeting` — role `greeting`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `491:22411`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `491:22411`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `491:22411`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22411`
        - `body-01` — role `body-01`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `491:22412`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `491:22412`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `491:22412`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22412`
        - `body-02` — role `body-02`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `491:22413`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `491:22413`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `491:22413`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22413`
        - `warning-text` — role `warning-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `491:22414`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `491:22414`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `491:22414`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22414`
        - `sign-off` — role `sign-off`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `491:22415`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `491:22415`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `491:22415`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `491:22415`
        - `action-link` — role `action-link`; render `html-link`; visibility `always`
          - Fact `fill-color`: `#18B037`; provenance: `figma-literal` at `494:19991`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `494:19991`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:19991`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `494:19991`
        - `link-expiry` — role `link-expiry`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `494:19985`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `494:19985`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:19985`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `494:19985`
      - `suspicious-operation-details` — role `suspicious-operation-details`; render `nested-component`; visibility property `show-operation-description` (`Show Operation Description`); component `details-suspicious-operation` (`Details/Suspicious-Operation`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25970`
        - Fact `item-gap`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `padding-top`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `padding-right`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `padding-left`: `24px`; provenance: `figma-literal` at `497:25970`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25970`
        - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `497:25970`
        - Fact `fill-color`: `#F8F8FA`; provenance: `figma-literal` at `497:25970`
        - Fact `instance-viewport`: `Desktop`; provenance: `figma-literal` at `497:25970`
      - `alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
        - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `491:22450`
        - Fact `padding-top`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `padding-right`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `padding-left`: `24px`; provenance: `figma-literal` at `491:22450`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22450`
        - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `491:22450`
        - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `491:22450`
        - `notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `491:22451`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `491:22451`
          - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `491:22451`
          - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `491:22451`
          - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `491:22451`
      - `disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `491:22455`
        - Fact `item-gap`: `12px`; provenance: `figma-literal` at `491:22455`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `491:22455`
        - `disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `491:22417`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `491:22417`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `491:22417`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `491:22417`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:26054`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `497:26054`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `497:26054`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `497:26054`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:26054`
  - `card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `619:21432`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21432`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `619:21432`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `619:21432`
    - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25764`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `497:25764`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `497:25764`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25764`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:25764`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:25764`
      - `status-row` — role `status-row`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25765`
        - Fact `item-gap`: `16px`; provenance: `figma-literal` at `497:25765`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25765`
        - `status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
          - Fact `corner-radius`: `56.000003814697266px`; provenance: `figma-literal` at `497:25809`
          - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:25809`
          - Fact `display-width`: `72px`; provenance: `figma-literal` at `497:25809`
          - Fact `display-height`: `72px`; provenance: `figma-literal` at `497:25809`
        - `heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `497:25770`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `497:25770`
          - Fact `line-height`: `120%`; provenance: `figma-literal` at `497:25770`
          - Fact `text-style`: `Mobile/Heading`; provenance: `figma-literal` at `497:25770`
          - Fact `text-align`: `center`; provenance: `figma-literal` at `497:25770`
    - `divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25773`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:25773`
      - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `497:25773`
      - Fact `height`: `1px`; provenance: `figma-literal` at `497:25773`
    - `body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25774`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `497:25774`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `497:25774`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25774`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `497:25774`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `497:25774`
      - `text-content` — role `text-content`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25821`
        - Fact `item-gap`: `8px`; provenance: `figma-literal` at `497:25821`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25821`
        - `greeting` — role `greeting`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `497:25822`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25822`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25822`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25822`
        - `body-01` — role `body-01`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `497:25823`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25823`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25823`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25823`
        - `body-02` — role `body-02`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `497:25824`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25824`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25824`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25824`
        - `warning-text` — role `warning-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `497:25826`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25826`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25826`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25826`
        - `sign-off` — role `sign-off`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `497:25828`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25828`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25828`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25828`
        - `action-link` — role `action-link`; render `html-link`; visibility `always`
          - Fact `fill-color`: `#18B037`; provenance: `figma-literal` at `497:25830`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25830`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25830`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25830`
        - `link-expiry` — role `link-expiry`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `497:25832`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `497:25832`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25832`
          - Fact `text-style`: `Mobile/Caption`; provenance: `figma-literal` at `497:25832`
      - `suspicious-operation-details` — role `suspicious-operation-details`; render `nested-component`; visibility property `show-operation-description` (`Show Operation Description`); component `details-suspicious-operation` (`Details/Suspicious-Operation`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25956`
        - Fact `item-gap`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `padding-top`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `padding-right`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `padding-left`: `16px`; provenance: `figma-literal` at `497:25956`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25956`
        - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `497:25956`
        - Fact `fill-color`: `#F8F8FA`; provenance: `figma-literal` at `497:25956`
        - Fact `instance-viewport`: `Mobile`; provenance: `figma-literal` at `497:25956`
      - `alert` — role `alert`; render `presentation-table`; visibility property `show-alert` (`Show Alert`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25776`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `497:25776`
        - Fact `padding-top`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `padding-right`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `padding-left`: `16px`; provenance: `figma-literal` at `497:25776`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25776`
        - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `497:25776`
        - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `497:25776`
        - `notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `497:25778`
          - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `497:25778`
          - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `497:25778`
          - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `497:25778`
          - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `497:25778`
      - `disclaimer` — role `disclaimer`; render `presentation-table`; visibility property `show-disclaimer` (`Show Disclaimer`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25834`
        - Fact `item-gap`: `12px`; provenance: `figma-literal` at `497:25834`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `497:25834`
        - `disclaimer-text` — role `disclaimer-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `497:25836`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `497:25836`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25836`
          - Fact `text-style`: `Mobile/Caption`; provenance: `figma-literal` at `497:25836`

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
- Structure fingerprint: `sha256:625382f1c7582189c10e7c97864e69035a2be0ce59273636a55e59839a78d017`
- Purpose: Сервисный блок со статусом и реквизитами чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Receipt-Info` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `502:24693`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `502:24693`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24693`
  - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24253`
    - Fact `item-gap`: `24px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `502:24253`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24253`
    - Fact `radius-top-left`: `26px`; provenance: `figma-literal` at `502:24253`
    - Fact `radius-top-right`: `26px`; provenance: `figma-literal` at `502:24253`
    - Fact `radius-bottom-right`: `0px`; provenance: `figma-literal` at `502:24253`
    - Fact `radius-bottom-left`: `0px`; provenance: `figma-literal` at `502:24253`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24253`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:24253`
    - `status-row` — role `status-row`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `502:24254`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `502:24254`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24254`
      - `status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
        - Fact `corner-radius`: `56.000003814697266px`; provenance: `figma-literal` at `502:24255`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24255`
        - Fact `display-width`: `72px`; provenance: `figma-literal` at `502:24255`
        - Fact `display-height`: `72px`; provenance: `figma-literal` at `502:24255`
      - `heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `502:24256`
        - Fact `font-size`: `26px`; provenance: `figma-literal` at `502:24256`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `502:24256`
        - Fact `text-style`: `Desktop/Heading`; provenance: `figma-literal` at `502:24256`
  - `divider` — role `divider`; render `presentation-table`; visibility `always`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24257`
    - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `502:24257`
    - Fact `height`: `1px`; provenance: `figma-literal` at `502:24257`
  - `receipt-area` — role `receipt-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24258`
    - Fact `item-gap`: `24px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-top`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-right`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `padding-left`: `32px`; provenance: `figma-literal` at `502:24258`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24258`
    - Fact `radius-top-left`: `0px`; provenance: `figma-literal` at `502:24258`
    - Fact `radius-top-right`: `0px`; provenance: `figma-literal` at `502:24258`
    - Fact `radius-bottom-right`: `26px`; provenance: `figma-literal` at `502:24258`
    - Fact `radius-bottom-left`: `26px`; provenance: `figma-literal` at `502:24258`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24258`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:24258`
    - `receipt-details` — role `receipt-details`; render `nested-component`; visibility `always`; component `details-receipt` (`Details/Receipt`)
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `559:19391`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `559:19391`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `559:19391`
      - Fact `instance-viewport`: `Desktop`; provenance: `figma-literal` at `559:19391`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `502:24694`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `502:24694`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24694`
  - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24531`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24531`
    - Fact `radius-top-left`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `radius-top-right`: `22px`; provenance: `figma-literal` at `502:24531`
    - Fact `radius-bottom-right`: `0px`; provenance: `figma-literal` at `502:24531`
    - Fact `radius-bottom-left`: `0px`; provenance: `figma-literal` at `502:24531`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24531`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:24531`
    - `status-row` — role `status-row`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24532`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `502:24532`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24532`
      - `status-badge-positive` — role `status-badge-positive`; render `direct-image`; visibility `always`; asset `status-badge-positive`
        - Fact `corner-radius`: `56.000003814697266px`; provenance: `figma-literal` at `502:24533`
        - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24533`
        - Fact `display-width`: `72px`; provenance: `figma-literal` at `502:24533`
        - Fact `display-height`: `72px`; provenance: `figma-literal` at `502:24533`
      - `heading` — role `heading`; render `html-text`; visibility `always`
        - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `502:24534`
        - Fact `font-size`: `18px`; provenance: `figma-literal` at `502:24534`
        - Fact `line-height`: `120%`; provenance: `figma-literal` at `502:24534`
        - Fact `text-style`: `Mobile/Heading`; provenance: `figma-literal` at `502:24534`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `502:24534`
  - `divider` — role `divider`; render `presentation-table`; visibility `always`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24535`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24535`
    - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `502:24535`
    - Fact `height`: `1px`; provenance: `figma-literal` at `502:24535`
  - `receipt-area` — role `receipt-area`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24536`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-top`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-right`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `padding-left`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `502:24536`
    - Fact `radius-top-left`: `0px`; provenance: `figma-literal` at `502:24536`
    - Fact `radius-top-right`: `0px`; provenance: `figma-literal` at `502:24536`
    - Fact `radius-bottom-right`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `radius-bottom-left`: `22px`; provenance: `figma-literal` at `502:24536`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `502:24536`
    - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `502:24536`
    - `receipt-details` — role `receipt-details`; render `nested-component`; visibility `always`; component `details-receipt` (`Details/Receipt`)
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `502:24641`
      - Fact `item-gap`: `12px`; provenance: `figma-literal` at `502:24641`
      - Fact `instance-viewport`: `Mobile`; provenance: `figma-literal` at `502:24641`

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
- Structure fingerprint: `sha256:1db6ec6983e1b998d38243bb85558b2ddfb093e543cce12386a0012d15ac6b76`
- Purpose: Сервисный блок неуспешной операции с партнёром, статусом и поясняющим текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Transaction-Error` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:29443`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:29443`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:29443`
  - `card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `619:21429`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21429`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `619:21429`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `619:21429`
    - `summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:29385`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:29385`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:29385`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:29385`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:29385`
      - `partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `459:29386`
        - Fact `item-gap`: `24px`; provenance: `figma-literal` at `459:29386`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:29386`
        - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
          - Fact `corner-radius`: `72px`; provenance: `figma-literal` at `494:22359`
          - Fact `clips-content`: `true`; provenance: `figma-literal` at `494:22359`
          - Fact `display-width`: `72px`; provenance: `figma-literal` at `494:22359`
          - Fact `display-height`: `72px`; provenance: `figma-literal` at `494:22359`
        - `text-details` — role `text-details`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:29388`
          - Fact `item-gap`: `6px`; provenance: `figma-literal` at `459:29388`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:29388`
          - `partner-name` — role `partner-name`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `459:29389`
            - Fact `font-size`: `20px`; provenance: `figma-literal` at `459:29389`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:29389`
            - Fact `text-style`: `Desktop/Title`; provenance: `figma-literal` at `459:29389`
          - `amount` — role `amount`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `459:29390`
            - Fact `font-size`: `32px`; provenance: `figma-literal` at `459:29390`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:29390`
            - Fact `text-style`: `Desktop/Display`; provenance: `figma-literal` at `459:29390`
        - `status-container` — role `status-container`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:29391`
          - Fact `item-gap`: `10px`; provenance: `figma-literal` at `459:29391`
          - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
            - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `517:15697`
            - Fact `item-gap`: `10px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-top`: `4px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-right`: `12px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `517:15697`
            - Fact `padding-left`: `12px`; provenance: `figma-literal` at `517:15697`
            - Fact `corner-radius`: `63px`; provenance: `figma-literal` at `517:15697`
            - Fact `fill-color`: `#FFC7C8`; provenance: `figma-literal` at `517:15697`
            - Fact `instance-viewport`: `Desktop`; provenance: `figma-literal` at `517:15697`
            - Fact `instance-state`: `Error`; provenance: `figma-literal` at `517:15697`
    - `divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `477:19997`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `477:19997`
      - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `477:19997`
      - Fact `height`: `1px`; provenance: `figma-literal` at `477:19997`
    - `body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:20040`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `477:20040`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `477:20040`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `477:20040`
      - `primary-content` — role `primary-content`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:20041`
        - Fact `item-gap`: `12px`; provenance: `figma-literal` at `477:20041`
        - `heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `477:20042`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `477:20042`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20042`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `477:20042`
        - `error-description` — role `error-description`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `477:20043`
          - Fact `font-size`: `18px`; provenance: `figma-literal` at `477:20043`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20043`
          - Fact `text-style`: `Desktop/Body/Large`; provenance: `figma-literal` at `477:20043`
      - `attention-notice` — role `attention-notice`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:17054`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-top`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-right`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `padding-left`: `24px`; provenance: `figma-literal` at `510:17054`
        - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `510:17054`
        - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `510:17054`
        - `notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `510:17055`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `510:17055`
          - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `510:17055`
          - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `510:17055`
          - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `510:17055`
      - `supporting-content` — role `supporting-content`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:20075`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `477:20075`
        - `timeout-notice` — role `timeout-notice`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `477:20077`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20077`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20077`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `477:20077`
        - `card-warning` — role `card-warning`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `477:20078`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20078`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20078`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `477:20078`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:30150`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:30150`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:30150`
  - `card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `619:21430`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21430`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `619:21430`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `619:21430`
    - `summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `467:16683`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `467:16683`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `467:16683`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `467:16683`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `467:16683`
      - `partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `532:14307`
        - Fact `item-gap`: `16px`; provenance: `figma-literal` at `532:14307`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `532:14307`
        - `partner-details` — role `partner-details`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `532:14308`
          - Fact `item-gap`: `16px`; provenance: `figma-literal` at `532:14308`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `532:14308`
          - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
            - Fact `corner-radius`: `72px`; provenance: `figma-literal` at `532:14309`
            - Fact `clips-content`: `true`; provenance: `figma-literal` at `532:14309`
            - Fact `display-width`: `72px`; provenance: `figma-literal` at `532:14309`
            - Fact `display-height`: `72px`; provenance: `figma-literal` at `532:14309`
          - `text-details` — role `text-details`; render `presentation-table`; visibility `always`
            - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `532:14310`
            - Fact `item-gap`: `8px`; provenance: `figma-literal` at `532:14310`
            - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `532:14310`
            - `partner-name` — role `partner-name`; render `html-text`; visibility `always`
              - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `532:14311`
              - Fact `font-size`: `16px`; provenance: `figma-literal` at `532:14311`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `532:14311`
              - Fact `text-style`: `Mobile/Title`; provenance: `figma-literal` at `532:14311`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `532:14311`
            - `amount` — role `amount`; render `html-text`; visibility `always`
              - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `532:14312`
              - Fact `font-size`: `20px`; provenance: `figma-literal` at `532:14312`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `532:14312`
              - Fact `text-style`: `Mobile/Display`; provenance: `figma-literal` at `532:14312`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `532:14312`
        - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `532:14313`
          - Fact `item-gap`: `10px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-top`: `4px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-right`: `12px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `532:14313`
          - Fact `padding-left`: `12px`; provenance: `figma-literal` at `532:14313`
          - Fact `corner-radius`: `63px`; provenance: `figma-literal` at `532:14313`
          - Fact `fill-color`: `#FFC7C8`; provenance: `figma-literal` at `532:14313`
          - Fact `instance-viewport`: `Mobile`; provenance: `figma-literal` at `532:14313`
          - Fact `instance-state`: `Error`; provenance: `figma-literal` at `532:14313`
    - `divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `477:20258`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `477:20258`
      - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `477:20258`
      - Fact `height`: `1px`; provenance: `figma-literal` at `477:20258`
    - `body-area` — role `body-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:20239`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `477:20239`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `477:20239`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `477:20239`
      - `primary-content` — role `primary-content`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:20247`
        - Fact `item-gap`: `8px`; provenance: `figma-literal` at `477:20247`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `477:20247`
        - `heading` — role `heading`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `477:20248`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20248`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20248`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `477:20248`
        - `error-description` — role `error-description`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `477:20249`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `477:20249`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20249`
          - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `477:20249`
      - `attention-notice` — role `attention-notice`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `510:17033`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-top`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-right`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `padding-left`: `16px`; provenance: `figma-literal` at `510:17033`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `510:17033`
        - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `510:17033`
        - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `510:17033`
        - `notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `510:17034`
          - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `510:17034`
          - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `510:17034`
          - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `510:17034`
          - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `510:17034`
      - `supporting-content` — role `supporting-content`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:20251`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `477:20251`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `477:20251`
        - `timeout-notice` — role `timeout-notice`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `477:20253`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `477:20253`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20253`
          - Fact `text-style`: `Mobile/Caption`; provenance: `figma-literal` at `477:20253`
        - `card-warning` — role `card-warning`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#98999C`; provenance: `figma-literal` at `477:20254`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `477:20254`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `477:20254`
          - Fact `text-style`: `Mobile/Caption`; provenance: `figma-literal` at `477:20254`

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
- Structure fingerprint: `sha256:b1e91013d56f0cd124b73c9255ab78cdc165ef26f36dcb06a6d9bc8469d265b1`
- Purpose: Сервисный блок успешной операции с партнёром, суммой, статусом и реквизитами.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Transaction-Success` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:29175`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:29175`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:29175`
  - `card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `619:21427`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21427`
    - Fact `corner-radius`: `26px`; provenance: `figma-literal` at `619:21427`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `619:21427`
    - `summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27422`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:27422`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27422`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:27422`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:27422`
      - `partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `459:27423`
        - Fact `item-gap`: `24px`; provenance: `figma-literal` at `459:27423`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27423`
        - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
          - Fact `corner-radius`: `72px`; provenance: `figma-literal` at `481:19700`
          - Fact `clips-content`: `true`; provenance: `figma-literal` at `481:19700`
          - Fact `display-width`: `72px`; provenance: `figma-literal` at `481:19700`
          - Fact `display-height`: `72px`; provenance: `figma-literal` at `481:19700`
        - `text-details` — role `text-details`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27425`
          - Fact `item-gap`: `6px`; provenance: `figma-literal` at `459:27425`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:27425`
          - `partner-name` — role `partner-name`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `459:27426`
            - Fact `font-size`: `20px`; provenance: `figma-literal` at `459:27426`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27426`
            - Fact `text-style`: `Desktop/Title`; provenance: `figma-literal` at `459:27426`
          - `amount` — role `amount`; render `html-text`; visibility `always`
            - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `459:27427`
            - Fact `font-size`: `32px`; provenance: `figma-literal` at `459:27427`
            - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:27427`
            - Fact `text-style`: `Desktop/Display`; provenance: `figma-literal` at `459:27427`
        - `status-container` — role `status-container`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:27428`
          - Fact `item-gap`: `10px`; provenance: `figma-literal` at `459:27428`
          - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
            - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `459:29356`
            - Fact `item-gap`: `10px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-top`: `4px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-right`: `12px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `459:29356`
            - Fact `padding-left`: `12px`; provenance: `figma-literal` at `459:29356`
            - Fact `corner-radius`: `63px`; provenance: `figma-literal` at `459:29356`
            - Fact `fill-color`: `#FAE6AF`; provenance: `figma-literal` at `459:29356`
            - Fact `instance-viewport`: `Desktop`; provenance: `figma-literal` at `459:29356`
            - Fact `instance-state`: `Pending`; provenance: `figma-literal` at `459:29356`
      - `description-text` — role `description-text`; render `html-text`; visibility property `show-description` (`Show Description`)
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `459:27431`
        - Fact `font-size`: `16px`; provenance: `figma-literal` at `459:27431`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:27431`
        - Fact `text-style`: `Desktop/Body/Medium`; provenance: `figma-literal` at `459:27431`
    - `divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:38314`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:38314`
      - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `459:38314`
      - Fact `height`: `1px`; provenance: `figma-literal` at `459:38314`
    - `details-area` — role `details-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:38136`
      - Fact `item-gap`: `24px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-top`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-right`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-bottom`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `padding-left`: `32px`; provenance: `figma-literal` at `459:38136`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:38136`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:38136`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:38136`
      - `operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation` (`Details/Operation`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `477:21328`
        - Fact `item-gap`: `16px`; provenance: `figma-literal` at `477:21328`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `477:21328`
        - Fact `instance-viewport`: `Desktop`; provenance: `figma-literal` at `477:21328`
      - `limit-alert` — role `limit-alert`; render `presentation-table`; visibility property `show-limit-alert` (`Show Limit Alert`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:38174`
        - Fact `item-gap`: `6px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-top`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-right`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `padding-left`: `24px`; provenance: `figma-literal` at `459:38174`
        - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `459:38174`
        - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `459:38174`
        - `notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `459:38175`
          - Fact `font-size`: `14px`; provenance: `figma-literal` at `459:38175`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:38175`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `459:38175`
        - `notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `459:38532`
          - Fact `text-style`: `Desktop/Caption`; provenance: `figma-literal` at `459:38532`
          - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `459:38532`
          - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `459:38532`
          - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `459:38532`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:29176`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:29176`
  - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:29176`
  - `card` — role `card`; render `presentation-table`; visibility `always`
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `619:21428`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `619:21428`
    - Fact `corner-radius`: `22px`; provenance: `figma-literal` at `619:21428`
    - Fact `clips-content`: `true`; provenance: `figma-literal` at `619:21428`
    - `summary-area` — role `summary-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:28002`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `459:28002`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:28002`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:28002`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:28002`
      - `partner-info-row` — role `partner-info-row`; render `presentation-table`; visibility `always`
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:28003`
        - Fact `item-gap`: `16px`; provenance: `figma-literal` at `459:28003`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:28003`
        - `partner-details` — role `partner-details`; render `presentation-table`; visibility `always`
          - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:28004`
          - Fact `item-gap`: `16px`; provenance: `figma-literal` at `459:28004`
          - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:28004`
          - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
            - Fact `corner-radius`: `72px`; provenance: `figma-literal` at `484:19677`
            - Fact `clips-content`: `true`; provenance: `figma-literal` at `484:19677`
            - Fact `display-width`: `72px`; provenance: `figma-literal` at `484:19677`
            - Fact `display-height`: `72px`; provenance: `figma-literal` at `484:19677`
          - `text-details` — role `text-details`; render `presentation-table`; visibility `always`
            - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:28006`
            - Fact `item-gap`: `8px`; provenance: `figma-literal` at `459:28006`
            - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:28006`
            - `partner-name` — role `partner-name`; render `html-text`; visibility `always`
              - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `459:28007`
              - Fact `font-size`: `16px`; provenance: `figma-literal` at `459:28007`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:28007`
              - Fact `text-style`: `Mobile/Title`; provenance: `figma-literal` at `459:28007`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `459:28007`
            - `amount` — role `amount`; render `html-text`; visibility `always`
              - Fact `fill-color`: `#000000`; provenance: `figma-literal` at `459:28008`
              - Fact `font-size`: `20px`; provenance: `figma-literal` at `459:28008`
              - Fact `line-height`: `120%`; provenance: `figma-literal` at `459:28008`
              - Fact `text-style`: `Mobile/Display`; provenance: `figma-literal` at `459:28008`
              - Fact `text-align`: `center`; provenance: `figma-literal` at `459:28008`
        - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
          - Fact `layout-direction`: `horizontal`; provenance: `figma-literal` at `459:29376`
          - Fact `item-gap`: `10px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-top`: `4px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-right`: `12px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-bottom`: `4px`; provenance: `figma-literal` at `459:29376`
          - Fact `padding-left`: `12px`; provenance: `figma-literal` at `459:29376`
          - Fact `corner-radius`: `63px`; provenance: `figma-literal` at `459:29376`
          - Fact `fill-color`: `#FAE6AF`; provenance: `figma-literal` at `459:29376`
          - Fact `instance-viewport`: `Mobile`; provenance: `figma-literal` at `459:29376`
          - Fact `instance-state`: `Pending`; provenance: `figma-literal` at `459:29376`
      - `description-text` — role `description-text`; render `html-text`; visibility property `show-description` (`Show Description`)
        - Fact `fill-color`: `#48494A`; provenance: `figma-literal` at `459:28011`
        - Fact `font-size`: `12px`; provenance: `figma-literal` at `459:28011`
        - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:28011`
        - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `459:28011`
        - Fact `text-align`: `center`; provenance: `figma-literal` at `459:28011`
    - `divider` — role `divider`; render `presentation-table`; visibility `always`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:38449`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:38449`
      - Fact `fill-color`: `#DFDFE0`; provenance: `figma-literal` at `459:38449`
      - Fact `height`: `1px`; provenance: `figma-literal` at `459:38449`
    - `details-area` — role `details-area`; render `presentation-table`; visibility `always`
      - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:38319`
      - Fact `item-gap`: `16px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-top`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-right`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-bottom`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `padding-left`: `22px`; provenance: `figma-literal` at `459:38319`
      - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:38319`
      - Fact `clips-content`: `true`; provenance: `figma-literal` at `459:38319`
      - Fact `fill-color`: `#FFFFFF`; provenance: `figma-literal` at `459:38319`
      - `operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation` (`Details/Operation`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `484:20069`
        - Fact `item-gap`: `12px`; provenance: `figma-literal` at `484:20069`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `484:20069`
        - Fact `instance-viewport`: `Mobile`; provenance: `figma-literal` at `484:20069`
      - `limit-alert` — role `limit-alert`; render `presentation-table`; visibility property `show-limit-alert` (`Show Limit Alert`)
        - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `459:38357`
        - Fact `item-gap`: `4px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-top`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-right`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `padding-left`: `16px`; provenance: `figma-literal` at `459:38357`
        - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `459:38357`
        - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `459:38357`
        - Fact `fill-color`: `#FFF1C9`; provenance: `figma-literal` at `459:38357`
        - `notice-text` — role `notice-text`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `459:38358`
          - Fact `font-size`: `12px`; provenance: `figma-literal` at `459:38358`
          - Fact `line-height`: `140%`; provenance: `figma-literal` at `459:38358`
          - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `459:38358`
        - `notice-link` — role `notice-link`; render `html-text`; visibility `always`
          - Fact `fill-color`: `#AA7100`; provenance: `figma-literal` at `459:38537`
          - Fact `text-style`: `Mobile/Body/Medium`; provenance: `figma-literal` at `459:38537`
          - Fact `segment-1-color`: `#AA7100`; provenance: `figma-literal` at `459:38537`
          - Fact `segment-2-color`: `#AA7100`; provenance: `figma-literal` at `459:38537`
          - Fact `segment-2-decoration`: `underline`; provenance: `figma-literal` at `459:38537`

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
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `200px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `#000000`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

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
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `200px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `#000000`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

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
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `200px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `#000000`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

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
- Structure fingerprint: `sha256:48575b0cba20c15f5c11b3729aff0b2e63bc26d4dea7feb8cc4a1860eab6b6ee`
- Purpose: Вложенный предупреждающий блок с реквизитами подозрительной операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Suspicious-Operation` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`
- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input.

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25953`
  - Fact `item-gap`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-top`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-right`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-bottom`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `padding-left`: `24px`; provenance: `figma-literal` at `497:25953`
  - Fact `corner-radius`: `18px`; provenance: `figma-literal` at `497:25953`
  - Fact `fill-color`: `#F8F8FA`; provenance: `figma-literal` at `497:25953`
  - `heading` — role `heading`; render `html-text`; visibility `always`
    - Fact `fill-color`: `#DE2141`; provenance: `figma-literal` at `494:21234`
    - Fact `font-size`: `16px`; provenance: `figma-literal` at `494:21234`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `494:21234`
    - Fact `text-style`: `Desktop/Body/Medium`; provenance: `figma-literal` at `494:21234`
  - `operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation-plain` (`Details/Operation-Plain`)
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `559:19331`
    - Fact `item-gap`: `16px`; provenance: `figma-literal` at `559:19331`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `559:19331`
    - Fact `instance-viewport`: `Desktop`; provenance: `figma-literal` at `559:19331`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `497:25954`
  - Fact `item-gap`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-top`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-right`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-bottom`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `padding-left`: `16px`; provenance: `figma-literal` at `497:25954`
  - Fact `corner-radius`: `14px`; provenance: `figma-literal` at `497:25954`
  - Fact `fill-color`: `#F8F8FA`; provenance: `figma-literal` at `497:25954`
  - `heading` — role `heading`; render `html-text`; visibility `always`
    - Fact `fill-color`: `#DE2141`; provenance: `figma-literal` at `497:25838`
    - Fact `font-size`: `14px`; provenance: `figma-literal` at `497:25838`
    - Fact `line-height`: `140%`; provenance: `figma-literal` at `497:25838`
    - Fact `text-style`: `Mobile/Body/Large`; provenance: `figma-literal` at `497:25838`
  - `operation-details` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation-plain` (`Details/Operation-Plain`)
    - Fact `layout-direction`: `vertical`; provenance: `figma-literal` at `559:19361`
    - Fact `item-gap`: `12px`; provenance: `figma-literal` at `559:19361`
    - Fact `horizontal-sizing`: `fill-parent`; provenance: `figma-literal` at `559:19361`
    - Fact `instance-viewport`: `Mobile`; provenance: `figma-literal` at `559:19361`

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
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `200px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `#000000`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `rows` — role `details-rows`; render `presentation-table`; visibility `always`
    - `label` — role `label`; render `html-text`; visibility `always`
    - `value` — role `value`; render `html-text`; visibility `always`

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
