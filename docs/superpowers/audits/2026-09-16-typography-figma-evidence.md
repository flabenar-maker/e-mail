# Typography Figma evidence — 2026-09-16

Status: evidence record only. The machine-checkable read-only capture is [`tests/fixtures/figma/typography-capture.json`](../../../tests/fixtures/figma/typography-capture.json). Neither document is a normative typography source, replaces `data/foundations/typography.yaml`, or may be used to infer values absent from that foundation.

## Capture boundary

- Figma file: `8zka5bHkcrJVK9I9dKjnhC`.
- Read-only Figma MCP capture: 2026-09-16.
- Component roots inspected: Marketing `538:17236`; Service `538:17235`.
- Binding form: every reported use is a direct Figma `TEXT.textStyleId` binding to the listed local text style. Owners below are component owners computed from the two inspected roots; counts are the captured number of bound text layers.
- Figma serializes percentage values with floating-point noise (`120.00000476837158` and `139.9999976158142`). The metrics table records the design values shown by the style. This is not a change to the structured source.

## Style facts

| Foundation ID | Figma style name | Exact Figma style ID | Font / weight | Size | Line-height | Letter-spacing | Capture result |
|---|---|---|---|---:|---:|---:|---|
| `desktop-display` | `Desktop/Display` | `S:4d43ca77a0bc52ca7e43f97a078a4d69cee87651,` | Roboto Bold / 700 | 32px | 120% | 0% | exact match |
| `desktop-heading` | `Desktop/Heading` | `S:2d908d3c1b5ff810b297f4a37aac1ab4161bbdb5,` | Roboto SemiBold / 600 | 26px | 120% | 0% | exact match |
| `desktop-title` | `Desktop/Title` | `S:105e0e8a189848d91c13bf0f2887665713de21ca,` | Roboto Medium / 500 | 20px | 120% | 0% | exact match |
| `desktop-heading-compact` | `Desktop/Heading/Compact` | `S:19f62229647b1872179c0b08e87bc09081f758ec,` | Roboto SemiBold / 600 | 20px | 120% | **0px** | unresolved — see below |
| `desktop-body-large` | `Desktop/Body/Large` | `S:2dbbae937ad03f37307425810b92a1abedcfb705,` | Roboto Regular / 400 | 18px | 140% | 0% | exact match |
| `desktop-body-medium` | `Desktop/Body/Medium` | `S:0eb6b02f56ee5f02f09611af5a13a41b6121e78d,` | Roboto Regular / 400 | 16px | 140% | 0% | exact match |
| `desktop-caption` | `Desktop/Caption` | `S:3d171f9763dcbcd3a181c50411d876e67e072e75,` | Roboto Regular / 400 | 14px | 140% | 0% | exact match |
| `desktop-action` | `Desktop/Action` | `S:80178ed95ee94439436fb7ea36e3eb926f986be2,` | Roboto Medium / 500 | 16px | 140% | 0% | exact match |
| `mobile-display` | `Mobile/Display` | `S:ca236b65a83eef2e55e95564b051765d4fbe7c60,` | Roboto Bold / 700 | 20px | 120% | 0% | exact match |
| `mobile-heading` | `Mobile/Heading` | `S:31421a8c479c960e9e5fcdf32b0717960340b772,` | Roboto SemiBold / 600 | 18px | 120% | 0% | exact match |
| `mobile-title` | `Mobile/Title` | `S:348cad38e7e2918d2bc09859e1c0ac3f9b5afbb0,` | Roboto Medium / 500 | 16px | 120% | 0% | exact match |
| `mobile-body-medium` | `Mobile/Body/Medium` | `S:8ad84dd262e81c148a758758a15bb9b15e8f30fe,` | Roboto Regular / 400 | 12px | 140% | 0% | exact match |
| `mobile-body-large` | `Mobile/Body/Large` | `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,` | Roboto Regular / 400 | 14px | 140% | 0% | exact match |
| `mobile-caption` | `Mobile/Caption` | `S:374419cb8d39f8db69f1e4fa2fd20dcdc72abcce,` | Roboto Regular / 400 | 12px | 140% | 0% | exact match |
| `mobile-action` | `Mobile/Action` | `S:780f997658bfc56dc4db512b20c92d16c415c3f3,` | Roboto Medium / 500 | 14px | 140% | 0% | exact match |

## Captured owners and bindings

- `desktop-display`: `Banner/Hero` (1), `Block/Transaction-Success` (1), `Block/Transaction-Error` (1).
- `desktop-heading`: `Block/Cards-Images` (1), `Block/Icon-Cards` (1), `Block/Steps` (1), `Block/Content` (1), `Block/Bullet-List` (1), `Block/Icon-List` (1), `NPS/Options` (2), `Block/Contact-Support` (1), `Block/Personal-Data-Update` (1), `Block/Receipt-Info` (1).
- `desktop-title`: `Block/Cards-Images` (6), `Block/Icon-Cards` (6), `Card/Image` (1), `Card/Icon` (1), `Block/Transaction-Success` (1), `Block/Transaction-Error` (1).
- `desktop-heading-compact`: `Banner/Secondary` (1).
- `desktop-body-large`: `Banner/Hero` (1), `Block/Steps` (5), `Block/Content` (5), `Block/Bullet-List` (3), `Item/Bullet` (1), `Item/Step` (1), `Banner/Inline` (1), `Block/Info-Alert` (1), `Banner/App-Download` (1), `Block/Icon-List` (6), `Block/Transaction-Error` (2), `Block/Contact-Support` (1), `Block/Personal-Data-Update` (6), `Banner/Fiscal-Check-Link` (2), `Block/Instruction-Steps` (35).
- `desktop-body-medium`: `Badge/Step-Number` (2), `Block/Cards-Images` (6), `Block/Icon-Cards` (6), `Block/Steps` (12), `Block/Content` (2), `Banner/Secondary` (1), `Block/Bullet-List` (7), `Item/Bullet` (2), `Item/Step` (2), `Card/Image` (1), `Card/Icon` (1), `Item/Alert` (1), `Item/Notification` (1), `Block/Transaction-Success` (16), `Block/Transaction-Error` (1), `Block/Contact-Support` (1), `Details/Transfer` (20), `Details/Suspicious-Operation` (7), `Block/Personal-Data-Update` (7), `Details/Operation-Plain` (6), `Details/Receipt` (16), `Block/Receipt-Info` (16), `Details/Operation` (14), `Badge/Operation-Status` (3).
- `desktop-caption`: `Block/Cards-Images` (1), `Block/Icon-Cards` (1), `Email/Footer` (4), `Block/Steps` (1), `Block/Content` (1), `Block/Bullet-List` (1), `Email/Footer-Legal` (2), `Block/Icon-List` (1), `Block/Transaction-Success` (2), `Block/Transaction-Error` (3), `Block/Personal-Data-Update` (3), `Block/Instruction-Steps` (2).
- `desktop-action`: `Block/Cards-Images` (6), `Block/Icon-Cards` (6), `Banner/Hero` (1), `Block/Steps` (1), `Button/Secondary` (1), `Button/Primary` (1), `Block/Content` (1), `Banner/Secondary` (1), `Block/Bullet-List` (4), `Item/Bullet` (1), `Card/Image` (1), `Block/Icon-List` (1), `Card/Icon` (1).
- `mobile-display`: `Banner/Hero` (1), `Block/Transaction-Success` (1), `Block/Transaction-Error` (1).
- `mobile-heading`: `Block/Cards-Images` (1), `Block/Icon-Cards` (1), `Block/Steps` (1), `Block/Content` (1), `Banner/Secondary` (1), `Block/Bullet-List` (1), `Block/Icon-List` (1), `NPS/Options` (2), `Block/Contact-Support` (1), `Block/Personal-Data-Update` (1), `Block/Receipt-Info` (1).
- `mobile-title`: `Block/Cards-Images` (6), `Block/Icon-Cards` (6), `Card/Image` (1), `Card/Icon` (1), `Block/Transaction-Success` (1), `Block/Transaction-Error` (1).
- `mobile-body-medium`: `Block/Steps` (7), `Block/Content` (2), `Block/Bullet-List` (7), `Item/Bullet` (2), `Item/Step` (1), `Item/Alert` (1), `Item/Notification` (1), `Block/Transaction-Success` (4), `Block/Transaction-Error` (2), `Block/Contact-Support` (1), `Block/Personal-Data-Update` (1), `Block/Instruction-Steps` (21), `Badge/Operation-Status` (3).
- `mobile-body-large`: `Badge/Step-Number` (2), `Block/Cards-Images` (6), `Block/Icon-Cards` (6), `Banner/Hero` (1), `Block/Steps` (10), `Block/Content` (5), `Banner/Secondary` (1), `Block/Bullet-List` (3), `Item/Bullet` (1), `Item/Step` (2), `Banner/Inline` (1), `Block/Info-Alert` (1), `Banner/App-Download` (1), `Card/Image` (1), `Block/Icon-List` (6), `Card/Icon` (1), `Block/Transaction-Success` (14), `Block/Transaction-Error` (2), `Block/Contact-Support` (1), `Details/Transfer` (18), `Details/Suspicious-Operation` (7), `Block/Personal-Data-Update` (13), `Details/Operation-Plain` (6), `Details/Receipt` (16), `Block/Receipt-Info` (16), `Banner/Fiscal-Check-Link` (2), `Block/Instruction-Steps` (15), `Details/Operation` (14).
- `mobile-caption`: `Block/Cards-Images` (1), `Block/Icon-Cards` (1), `Email/Footer` (4), `Block/Steps` (1), `Block/Content` (1), `Block/Bullet-List` (1), `Email/Footer-Legal` (2), `Block/Icon-List` (1), `Block/Transaction-Error` (2), `Block/Personal-Data-Update` (2), `Block/Instruction-Steps` (1).
- `mobile-action`: `Block/Cards-Images` (6), `Block/Icon-Cards` (6), `Banner/Hero` (1), `Block/Steps` (1), `Button/Secondary` (1), `Button/Primary` (1), `Block/Content` (1), `Banner/Secondary` (1), `Block/Bullet-List` (4), `Item/Bullet` (1), `Banner/App-Download` (4), `Card/Image` (1), `Block/Icon-List` (1), `Card/Icon` (1).

## Resolved typed evidence

`desktop-heading-compact` is stored exactly as observed in Figma: `letterSpacing: { unit: "PIXELS", value: 0 }`. The structured foundation now uses `letter_spacing: { unit: px, value: 0 }`; the numeric value and unit both match. All 15 typography styles therefore have exact read-only Figma evidence, and `foundation.source.verified_at` is advanced to `2026-09-16`.