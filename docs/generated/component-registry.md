<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: component-registry -->
<!-- source-digest: sha256:0bd70aafe5f52d65f397aa2c40bfe06a1ce57eafe0886b8e1311d208cd91ba82 -->
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
- Structure fingerprint: `sha256:4ea96e98980233ade86e540914b44ef5069f6895c8061619545b6237c18aa854`
- Purpose: Составной растровый ассет карточки, включающий изображение и графические наложения.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Card-Image @2x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
  - Aspect ratio: 232:148
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `card-image` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `card-image` as `direct-image`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составной прозрачный графический ассет функциональной иконки.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Feature-Icon @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:53d9db07d895b91700fb17155a254cdadf7aa9a0d02e9cf572db422f2df93647`
- Purpose: Живой HTML-бейдж с номером шага для пошаговых блоков.
- Baseline: `registry/email-component-descriptions-registry.md` → `Badge/Step-Number` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:aeb50018c4411ea2752ab4c99aab86f095b51454b33a38ff659b58d65637b978`
- Purpose: Промоблок приложения с логотипом, живым текстом и кнопками магазинов.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/App-Download` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:adf95c6eaaf49c1b030ebe1a2a6cb3d3f043443b9ee158b40268bc1257182e48`
- Purpose: Главный промобаннер с изображением, живым текстом и необязательным основным CTA.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Hero` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
  - Aspect ratio: 552:353
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `hero-image` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `hero-image` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/3/component_id` → component `button-primary` (`Button/Primary`)
- Dependency: `/contracts/desktop/root/children/3/component_id` → component `button-primary` (`Button/Primary`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:6b60ab0bafd0817f0afb5223b652c20100f23a0eb388d4a2ffcf2f74a03a1248`
- Purpose: Компактный информационный баннер с живым текстом и ссылкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Inline` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:48d9b7a570ffefeeeac38e01469297b1d356d364e5b36b06a713a2a47f4edbed`
- Purpose: Вторичный промобаннер с текстовой и визуальной областями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Secondary` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
  - Aspect ratio: 296:188
  - Crop: `figma-fill`; position `concrete-desktop-instance`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `secondary-image` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/1` → `secondary-image` as `background-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/children/1/component_id` → component `button-secondary` (`Button/Secondary`)
- Dependency: `/contracts/desktop/root/children/0/children/1/component_id` → component `button-secondary` (`Button/Secondary`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:bf0c0c00cf94fdfb6a41a869fe60701489dafb252f2cd01515ef5e5b5aa39635`
- Purpose: Контентный блок с заголовком, маркированным списком и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Bullet-List` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:1e99c3cea4bfd175c368c3a843dc694a1c945a2c9848af1666811119e49da1bc`
- Purpose: Контентный блок с заголовком, вертикальным списком карточек с изображениями и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Cards-Images` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `card-image` (`Card/Image`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `card-image` (`Card/Image`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:8df9797f5fe6579a653ed86f9d4e28a35dbf0be89861ae0f1bd683eb8ae86c19`
- Purpose: Универсальный контентный блок с заголовком, текстом и управляемыми дополнительными элементами.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Content` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:c63c3dc20a045beeaba79ba062390ade2ee8608a623dc74a12efde6266651e92`
- Purpose: Контентный блок с заголовком, вертикальным списком карточек с иконками и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Icon-Cards` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `card-icon` (`Card/Icon`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `card-icon` (`Card/Icon`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:758ae01e42519336077861f93e6c60cd8cfaec0784c8b97bc0d2017ea295f547`
- Purpose: Контентный блок со списком строк, каждая из которых использует графическую иконку и живой текст.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Icon-List` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:43e70af5f806c9820271f1726193d14bd61010f1fbe7ca4240cb7efe7a662012`
- Purpose: Контентный информационный блок с выделенным сообщением.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Info-Alert` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:b3063c5e60fb157eb3997b2764a39b27662f58de1223efb1c46ec069dc3e18b4`
- Purpose: Контентный блок с последовательностью шагов и управляемыми дополнительными секциями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Steps` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:f72b837d30fd626373d960ba021ccc7d184765092d8a14d19052aa445533d4b3`
- Purpose: Основная градиентная HTML-кнопка для главного действия письма.
- Baseline: `registry/email-component-descriptions-registry.md` → `Button/Primary` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `button`; render `presentation-table`; visibility `always`
  - Fact `button-padding-block`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `button-padding-inline`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `button-border-radius`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-fallback`: `#18B037`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-start`: `#18B037`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `background-gradient-end`: `#3DD55C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
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
  - Fact `background-replacement-forbidden`: `#00991F`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `link` — role `button-link`; render `html-link`; visibility `always`
    - Fact `button-text-size`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)

### Properties and variants

- Variant `desktop` — Figma node `337:4694`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `337:4691`; axes: `Viewport=Mobile`

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0`
- Link: `desktop` `/contracts/desktop/root/children/0`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:d2451da399ffb1e0a67a979bae64ad7442aac2617ee5ee95a2e94fe767283e81`
- Purpose: Вторичная кликабельная HTML-кнопка для действий внутри письма.
- Baseline: `registry/email-component-descriptions-registry.md` → `Button/Secondary` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0`
- Link: `desktop` `/contracts/desktop/root/children/0`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:a36c2a891344e693c283d021aca44c4eea77cc087823eec968327605d84f7a6c`
- Purpose: Карточка с графической иконкой, живым текстом и необязательной ссылкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Card/Icon` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:e45ebbe8c07207092e26b3712d88d65bbc5d7d560f4b8daee20e1f4dfc6a2ab6`
- Purpose: Карточка с составным изображением, живым текстом и необязательной ссылкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Card/Image` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
  - Aspect ratio: 232:148
  - Crop: `none`; position `exact-node-after-overrides`
  - Background: own fill `preserve`; artificial matte `forbid`
- Asset usage: `mobile` `/contracts/mobile/root/children/0` → `card-image` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/1/children/2`
- Asset usage: `desktop` `/contracts/desktop/root/children/0` → `card-image` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/1/children/2`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:f08c19aedc8e2a9da2c0bf8a0a130e89f725143ac215b53bb5db4fe53842f536`
- Purpose: Основной полноширинный футер с дисклеймером, отпиской и управляемой секцией социальных ссылок.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Footer` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Properties and variants

- Variant `mobile` — Figma node `17:2763`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `261:4020`; axes: `Viewport=Desktop`
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
- Link: `mobile` `/contracts/mobile/root/children/2/children/0`
- Asset usage: `mobile` `/contracts/mobile/root/children/2/children/0/children/0` → `vk-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/2/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/2/children/0/children/0` → `vk-icon` as `direct-image`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:4d2316dd74a0fe278cb20d3278ac6d89a09ae087c9208792c4b01c9800a0b651`
- Purpose: Юридический полноширинный футер письма.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Footer-Legal` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:2f6357a800cc5fd2cedc0181ce7c28f1cf0ce3b131044b9754809b0e83936ff0`
- Purpose: Полноширинный хедер письма с центрированным составным логотипом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Email/Header` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
- Structure fingerprint: `sha256:e94cc1564d7af39565a7707ef19f6fa71f8605016d888f8cb528072288a3c139`
- Purpose: Вложенный предупреждающий элемент с живым текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Alert` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:00506a80bff7fc52a80ed872823de640d3932e0045e416de034f2d38ab0c0899`
- Purpose: Отдельный пункт маркированного списка с живым текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Bullet` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
- Property `show-link` (`Show Link`) — `boolean`; default `true`

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/2`
- Link: `desktop` `/contracts/desktop/root/children/2`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:46c60d5dc21992117cf67f770fea05d1b295bf932ee8763ab3a30f66044dd6e9`
- Purpose: Вложенный информационный элемент с живым текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Notification` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:5cb7ff9481e6dc20d956a64dd93afc3d39fe966a952cfb51f4159905a9543c04`
- Purpose: Отдельный пронумерованный шаг с живым текстом и необязательной подписью.
- Baseline: `registry/email-component-descriptions-registry.md` → `Item/Step` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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
- Property `show-caption` (`Show Caption`) — `boolean`; default `true`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/component_id` → component `badge-step-number` (`Badge/Step-Number`)
- Dependency: `/contracts/desktop/root/children/0/component_id` → component `badge-step-number` (`Badge/Step-Number`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:359fbab0689fef703cd244bffd17d3623916ac46e053fe0c45091fa03a1a4234`
- Purpose: Адаптивная группа кликабельных вариантов оценки NPS.
- Baseline: `registry/email-component-descriptions-registry.md` → `NPS/Options` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `nps`; render `presentation-table`; visibility `always`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `options` — role `options`; render `presentation-table`; visibility `always`
    - `happy-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `happy-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `happy-face-icon`
    - `neutral-face-link` — role `rating-link`; render `html-link`; visibility `always`
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
    - `neutral-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `neutral-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `neutral-face-icon`
    - `sad-face-link` — role `rating-link`; render `html-link`; visibility `always`
      - `sad-face-icon` — role `rating-icon`; render `direct-image`; visibility `always`; asset `sad-face-icon`

### Properties and variants

- Variant `mobile-3` — Figma node `15:599`; axes: `Viewport=Mobile`, `Count=3`
- Variant `desktop-3` — Figma node `260:3974`; axes: `Viewport=Desktop`, `Count=3`
- Variant `mobile-2` — Figma node `260:1346`; axes: `Viewport=Mobile`, `Count=2`
- Variant `desktop-2` — Figma node `260:3976`; axes: `Viewport=Desktop`, `Count=2`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составной графический бейдж банка для использования в сервисных блоках.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Bank-Badge @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Универсальный составной графический бейдж с иконкой.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Icon-Badge @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составной графический бейдж партнёра для использования в сервисных блоках.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Partner-Badge @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составная графическая иконка отрицательного статуса.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Status-Badge-Negative @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:422aaa33e22aab19999c7a1292d8a8a1d2ada2a1711a43fe13acdc2aeabd37bd`
- Purpose: Составная графическая иконка положительного статуса.
- Baseline: `registry/email-component-descriptions-registry.md` → `Asset/Status-Badge-Positive @4x` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `ASSET`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:1cca4ddcec78df7b41644071d3118e82d7795b4f4a7e4c28ea46ef6afb5666cf`
- Purpose: Живой HTML-бейдж состояния операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Badge/Operation-Status` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:ebab5d9ad57aa7c7a286c68e6b707ea7313421dde2452429aa0d7b38e686bd5e`
- Purpose: Группа кликабельных строк со ссылками на проверку фискального чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Banner/Fiscal-Check-Link` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - `rows` — role `link-rows`; render `presentation-table`; visibility `always`
    - `first-row` — role `linked-row`; render `html-link`; visibility `always`
      - `first-bank-badge` — role `bank-badge`; render `direct-image`; visibility `always`; asset `bank-badge`
      - `first-text` — role `text`; render `html-text`; visibility `always`
      - `first-chevron` — role `chevron`; render `direct-image`; visibility `always`; asset `chevron-icon`
    - `second-row` — role `linked-row`; render `html-link`; visibility `always`
      - `second-bank-badge` — role `bank-badge`; render `direct-image`; visibility `always`; asset `bank-badge`
      - `second-text` — role `text`; render `html-text`; visibility `always`
      - `second-chevron` — role `chevron`; render `direct-image`; visibility `always`; asset `chevron-icon`

### Mobile

- `root` — role `banner`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `48×48`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `24×24`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `rows` — role `link-rows`; render `presentation-table`; visibility `always`
    - `first-row` — role `linked-row`; render `html-link`; visibility `always`
      - `first-bank-badge` — role `bank-badge`; render `direct-image`; visibility `always`; asset `bank-badge`
      - `first-text` — role `text`; render `html-text`; visibility `always`
      - `first-chevron` — role `chevron`; render `direct-image`; visibility `always`; asset `chevron-icon`
    - `second-row` — role `linked-row`; render `html-link`; visibility `always`
      - `second-bank-badge` — role `bank-badge`; render `direct-image`; visibility `always`; asset `bank-badge`
      - `second-text` — role `text`; render `html-text`; visibility `always`
      - `second-chevron` — role `chevron`; render `direct-image`; visibility `always`; asset `chevron-icon`

### Properties and variants

- Variant `desktop` — Figma node `502:25046`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `502:25047`; axes: `Viewport=Mobile`

### Assets and interaction

- Asset contract: `bank-badge`
  - Owner layer: `bank-badge @4x`
  - Source viewport: `desktop`
  - Source mode: `rendered-node`
  - Display mode: `direct-image`
  - Export profile: `png-4x` — PNG, `.png`, scale 4, suffix `@4x`, sRGB
  - Alpha: `transparent` — `transparent-outside-visual`
  - Clipping: `preserve-artwork`
  - Export boundary: `node` `bank-badge @4x`
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
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/0` → `bank-badge` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0/children/2` → `chevron-icon` as `direct-image`
- Link: `mobile` `/contracts/mobile/root/children/0/children/1`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/1/children/0` → `bank-badge` as `direct-image`
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/1/children/2` → `chevron-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/0`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/0` → `bank-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0/children/2` → `chevron-icon` as `direct-image`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/0` → `bank-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/1/children/2` → `chevron-icon` as `direct-image`

### Constraints and dependencies

- Constraint `linked-cells-cover-entire-row` — scope `all`; kind `email-rendering`; severity `critical`; Description critical: Каждая видимая ячейка строки содержит ссылку с одним URL, чтобы кликабельной оставалась вся площадь строки без помещения таблицы внутрь ссылки.

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: banner-fiscal-check-link
PURPOSE: Группа кликабельных строк со ссылками на проверку фискального чека.
RENDER: HYBRID

CRITICAL
- Каждая видимая ячейка строки содержит ссылку с одним URL, чтобы кликабельной оставалась вся площадь строки без помещения таблицы внутрь ссылки.
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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:95a24da336f01d7ab5dc9da2a78d6965eea4e62eb86f296221eedd7a214f0d03`
- Purpose: Контактный блок поддержки с телефонным действием и ссылкой на раздел помощи.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Contact-Support` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - `phone-cta` — role `phone-cta`; render `presentation-table`; visibility `always`
    - `heading` — role `heading`; render `html-text`; visibility `always`
    - `phone` — role `phone-link`; render `html-link`; visibility `always`
  - `help-notice` — role `help-notice`; render `presentation-table`; visibility `always`
    - `text` — role `text`; render `html-text`; visibility `always`
    - `link` — role `help-link`; render `html-link`; visibility `always`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `phone-cta` — role `phone-cta`; render `presentation-table`; visibility `always`
    - `heading` — role `heading`; render `html-text`; visibility `always`
    - `phone` — role `phone-link`; render `html-link`; visibility `always`
  - `help-notice` — role `help-notice`; render `presentation-table`; visibility `always`
    - `text` — role `text`; render `html-text`; visibility `always`
    - `link` — role `help-link`; render `html-link`; visibility `always`

### Properties and variants

- Variant `desktop` — Figma node `472:16997`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `472:16998`; axes: `Viewport=Mobile`

### Assets and interaction

- Link: `mobile` `/contracts/mobile/root/children/0/children/1`
- Link: `mobile` `/contracts/mobile/root/children/1/children/1`
- Link: `desktop` `/contracts/desktop/root/children/0/children/1`
- Link: `desktop` `/contracts/desktop/root/children/1/children/1`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-contact-support
PURPOSE: Контактный блок поддержки с телефонным действием и ссылкой на раздел помощи.
RENDER: HTML
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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:e4c35712ed239f9c53da103500f69f1ede6fdfd9f8857321bba2a3df2f198bbd`
- Purpose: Сервисный блок с инструкцией, нумерованными шагами и управляемыми предупреждениями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Instruction-Steps` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `steps` — role `steps`; render `presentation-table`; visibility `always`
    - `step-number` — role `step-number`; render `html-text`; visibility `always`
    - `step-text` — role `step-text`; render `html-text`; visibility `always`
  - `warning` — role `warning`; render `presentation-table`; visibility property `show-warning` (`Show Warning`)
    - `error-warning-line` — role `warning-icon`; render `direct-image`; visibility `always`; asset `error-warning-line`
    - `warning-text` — role `warning-text`; render `html-text`; visibility `always`
  - `alert` — role `alert`; render `html-text`; visibility property `show-alert` (`Show Alert`)
  - `disclaimer` — role `disclaimer`; render `html-text`; visibility property `show-disclaimer` (`Show Disclaimer`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `20px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `6px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `18px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-11`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-12`: `42px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-13`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-14`: `#FFF1C9`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-15`: `#AA7100`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-16`: `#98999C`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `steps` — role `steps`; render `presentation-table`; visibility `always`
    - `step-number` — role `step-number`; render `html-text`; visibility `always`
    - `step-text` — role `step-text`; render `html-text`; visibility `always`
  - `warning` — role `warning`; render `presentation-table`; visibility property `show-warning` (`Show Warning`)
    - `error-warning-line` — role `warning-icon`; render `direct-image`; visibility `always`; asset `error-warning-line`
    - `warning-text` — role `warning-text`; render `html-text`; visibility `always`
  - `alert` — role `alert`; render `html-text`; visibility property `show-alert` (`Show Alert`)
  - `disclaimer` — role `disclaimer`; render `html-text`; visibility property `show-disclaimer` (`Show Disclaimer`)

### Properties and variants

- Variant `mobile` — Figma node `510:16700`; axes: `Viewport=Mobile`
- Variant `desktop` — Figma node `510:16699`; axes: `Viewport=Desktop`
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
- Asset usage: `mobile` `/contracts/mobile/root/children/2/children/0` → `error-warning-line` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/2/children/0` → `error-warning-line` as `direct-image`

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-instruction-steps
PURPOSE: Сервисный блок с инструкцией, нумерованными шагами и управляемыми предупреждениями.
RENDER: HYBRID
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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:aaac8d95e15a432bd03a8a15bcf7649d6a5fdf0c663112a094a20cf1ac3d95ee`
- Purpose: Сервисный блок обновления персональных данных со статусом и управляемыми пояснениями.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Personal-Data-Update` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - `status-badge-positive` — role `status-icon`; render `direct-image`; visibility `always`; asset `status-badge-positive`
    - `heading` — role `heading`; render `html-text`; visibility `always`
  - `body-area` — role `body-area`; render `presentation-table`; visibility `always`
    - `text-content` — role `text-content`; render `html-text`; visibility `always`
    - `operation-description` — role `operation-description`; render `html-text`; visibility property `show-operation-description` (`Show Operation Description`)
    - `suspicious-operation` — role `suspicious-operation`; render `nested-component`; visibility `always`; component `details-suspicious-operation` (`Details/Suspicious-Operation`)
    - `alert` — role `alert`; render `html-text`; visibility property `show-alert` (`Show Alert`)
    - `disclaimer` — role `legal-disclaimer`; render `html-text`; visibility property `show-disclaimer` (`Show Disclaimer`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `1px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `#DFDFE0`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `72×72`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `8px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - `status-badge-positive` — role `status-icon`; render `direct-image`; visibility `always`; asset `status-badge-positive`
    - `heading` — role `heading`; render `html-text`; visibility `always`
  - `body-area` — role `body-area`; render `presentation-table`; visibility `always`
    - `text-content` — role `text-content`; render `html-text`; visibility `always`
    - `operation-description` — role `operation-description`; render `html-text`; visibility property `show-operation-description` (`Show Operation Description`)
    - `suspicious-operation` — role `suspicious-operation`; render `nested-component`; visibility `always`; component `details-suspicious-operation` (`Details/Suspicious-Operation`)
    - `alert` — role `alert`; render `html-text`; visibility property `show-alert` (`Show Alert`)
    - `disclaimer` — role `legal-disclaimer`; render `html-text`; visibility property `show-disclaimer` (`Show Disclaimer`)

### Properties and variants

- Variant `desktop` — Figma node `491:22454`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `497:26054`; axes: `Viewport=Mobile`
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
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0` → `status-badge-positive` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0` → `status-badge-positive` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/children/2/component_id` → component `details-suspicious-operation` (`Details/Suspicious-Operation`)
- Dependency: `/contracts/desktop/root/children/1/children/2/component_id` → component `details-suspicious-operation` (`Details/Suspicious-Operation`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-personal-data-update
PURPOSE: Сервисный блок обновления персональных данных со статусом и управляемыми пояснениями.
RENDER: HYBRID
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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:30944ab19aba46ba7c110429cda55b57c4facf8431dda88faf8d64f7fc6b90cc`
- Purpose: Сервисный блок со статусом и реквизитами чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Receipt-Info` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - `status-badge-positive` — role `status-icon`; render `direct-image`; visibility `always`; asset `status-badge-positive`
    - `heading` — role `heading`; render `html-text`; visibility `always`
  - `receipt-area` — role `receipt-area`; render `nested-component`; visibility `always`; component `details-receipt` (`Details/Receipt`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `1px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `#DFDFE0`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: asset `status-badge-positive`
  - Fact `description-8`: `72×72`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-9`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `status-area` — role `status-area`; render `presentation-table`; visibility `always`
    - `status-badge-positive` — role `status-icon`; render `direct-image`; visibility `always`; asset `status-badge-positive`
    - `heading` — role `heading`; render `html-text`; visibility `always`
  - `receipt-area` — role `receipt-area`; render `nested-component`; visibility `always`; component `details-receipt` (`Details/Receipt`)

### Properties and variants

- Variant `desktop` — Figma node `502:24693`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `502:24694`; axes: `Viewport=Mobile`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0` → `status-badge-positive` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0` → `status-badge-positive` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `details-receipt` (`Details/Receipt`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `details-receipt` (`Details/Receipt`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: block-receipt-info
PURPOSE: Сервисный блок со статусом и реквизитами чека.
RENDER: HYBRID
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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:75987410fc1c2c86234378a0beaba82438776ded423032b7b5ae179cbd000f82`
- Purpose: Сервисный блок неуспешной операции с партнёром, статусом и поясняющим текстом.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Transaction-Error` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - `summary` — role `summary-area`; render `presentation-table`; visibility `always`
    - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
    - `partner-details` — role `partner-details`; render `html-text`; visibility `always`
    - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
  - `body` — role `body-area`; render `html-text`; visibility `always`

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `1px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `#DFDFE0`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: asset `partner-badge`
  - Fact `description-9`: `72×72`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-10`: `14px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `summary` — role `summary-area`; render `presentation-table`; visibility `always`
    - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
    - `partner-details` — role `partner-details`; render `html-text`; visibility `always`
    - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
  - `body` — role `body-area`; render `html-text`; visibility `always`

### Properties and variants

- Variant `desktop` — Figma node `459:29443`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `459:30150`; axes: `Viewport=Mobile`

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
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0` → `partner-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0` → `partner-badge` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/2/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)
- Dependency: `/contracts/desktop/root/children/0/children/2/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:618e456ac9b5a2723c7c5dec1cd02c8fda01aaf35d9efbe07e75664a02668b9c`
- Purpose: Сервисный блок успешной операции с партнёром, суммой, статусом и реквизитами.
- Baseline: `registry/email-component-descriptions-registry.md` → `Block/Transaction-Success` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HYBRID`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `block`; render `presentation-table`; visibility `always`
  - `summary` — role `summary-area`; render `presentation-table`; visibility `always`
    - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
    - `partner-details` — role `partner-details`; render `html-text`; visibility `always`
    - `description` — role `description`; render `html-text`; visibility property `show-description` (`Show Description`)
    - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
  - `details` — role `details-area`; render `nested-component`; visibility `always`; component `details-operation` (`Details/Operation`)
  - `limit-alert` — role `limit-alert`; render `html-text`; visibility property `show-limit-alert` (`Show Limit Alert`)

### Mobile

- `root` — role `block`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `22px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `26px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `1px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-6`: `#DFDFE0`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-7`: `32px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-8`: asset `partner-badge`
  - Fact `description-9`: `72×72`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `summary` — role `summary-area`; render `presentation-table`; visibility `always`
    - `partner-badge` — role `partner-badge`; render `direct-image`; visibility `always`; asset `partner-badge`
    - `partner-details` — role `partner-details`; render `html-text`; visibility `always`
    - `description` — role `description`; render `html-text`; visibility property `show-description` (`Show Description`)
    - `status` — role `status`; render `nested-component`; visibility `always`; component `badge-operation-status` (`Badge/Operation-Status`)
  - `details` — role `details-area`; render `nested-component`; visibility `always`; component `details-operation` (`Details/Operation`)
  - `limit-alert` — role `limit-alert`; render `html-text`; visibility property `show-limit-alert` (`Show Limit Alert`)

### Properties and variants

- Variant `desktop` — Figma node `459:29175`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `459:29176`; axes: `Viewport=Mobile`
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
- Asset usage: `mobile` `/contracts/mobile/root/children/0/children/0` → `partner-badge` as `direct-image`
- Asset usage: `desktop` `/contracts/desktop/root/children/0/children/0` → `partner-badge` as `direct-image`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/0/children/3/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)
- Dependency: `/contracts/mobile/root/children/1/component_id` → component `details-operation` (`Details/Operation`)
- Dependency: `/contracts/desktop/root/children/0/children/3/component_id` → component `badge-operation-status` (`Badge/Operation-Status`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `details-operation` (`Details/Operation`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:704fdedacb635ee26473f02322df3336127dc96125a244f4a356bb132c033e9f`
- Purpose: Вложенная таблица реквизитов операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Operation` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:fc8ca2877c103ab0c55d68549ddd9ae0c73d6b026b3c8e9acd24d7c127a18ffd`
- Purpose: Вложенная таблица реквизитов операции без собственного визуального контейнера.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Operation-Plain` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:3fea2963f91e1be0835f755e33c52c0f76e5d1621e072c60e8961d4c6b9993f6`
- Purpose: Вложенная таблица реквизитов чека.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Receipt` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Verified: `2026-09-06`
- Structure fingerprint: `sha256:934a451407ca42c240afb643574d709cf7ad0a1d52a1be900a040e879ca2a8cb`
- Purpose: Вложенный предупреждающий блок с реквизитами подозрительной операции.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Suspicious-Operation` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

### Desktop

- `root` — role `details`; render `presentation-table`; visibility `always`
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `operation` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation-plain` (`Details/Operation-Plain`)

### Mobile

- `root` — role `details`; render `presentation-table`; visibility `always`
  - Fact `description-1`: `#F8F8FA`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-2`: `24px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-3`: `16px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-4`: `4px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - Fact `description-5`: `12px`; provenance: `registry-literal` (`registry/email-component-descriptions-registry.md`)
  - `heading` — role `heading`; render `html-text`; visibility `always`
  - `operation` — role `operation-details`; render `nested-component`; visibility `always`; component `details-operation-plain` (`Details/Operation-Plain`)

### Properties and variants

- Variant `desktop` — Figma node `497:25953`; axes: `Viewport=Desktop`
- Variant `mobile` — Figma node `497:25954`; axes: `Viewport=Mobile`

### Constraints and dependencies

- Dependency: `/contracts/mobile/root/children/1/component_id` → component `details-operation-plain` (`Details/Operation-Plain`)
- Dependency: `/contracts/desktop/root/children/1/component_id` → component `details-operation-plain` (`Details/Operation-Plain`)

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

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
- Structure fingerprint: `sha256:7c4eb3c7a891ee19421002d0e3c173a8d3d8e88d3c63f79eca96ceaa832f3133`
- Purpose: Вложенная таблица реквизитов перевода или возврата.
- Baseline: `registry/email-component-descriptions-registry.md` → `Details/Transfer` (`52893694e97a8751517f9174a90376e1eb849e0c`)

### Structure and rendering

- Render type: `HTML`
- Desktop root: `root` — `presentation-table`
- Mobile root: `root` — `presentation-table`

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

### Output contract classification

- Standalone output is defined by the Mobile and Desktop contracts above.

### Auxiliary Figma Description

This compact projection is metadata only and is not an HTML-build input.

```text
CUPIS ID: details-transfer
PURPOSE: Вложенная таблица реквизитов перевода или возврата.
RENDER: HTML
```
