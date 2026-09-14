<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: naming-reference -->
<!-- source-digest: sha256:c94a26bcd23004bf9639ea17c09524830beaa260afc3b501e34c02f3e6dca411 -->
<!-- schema-versions: figma-naming=1.0.0 -->
# CUPIS Figma naming reference

This reference contains universal naming vocabulary and templates only. It does not contain component records, node IDs or a rename map.

## Object kinds

```json
[
  {
    "id": "component",
    "label": "Component"
  },
  {
    "id": "layer",
    "label": "Layer"
  },
  {
    "id": "property",
    "label": "Property"
  },
  {
    "id": "asset-owner",
    "label": "Asset Owner"
  },
  {
    "id": "page",
    "label": "Page"
  },
  {
    "id": "section",
    "label": "Section"
  },
  {
    "id": "example",
    "label": "Example"
  }
]
```

## Component name template

```json
{
  "approved_abbreviations": [
    "NPS",
    "QR",
    "VK"
  ],
  "segment_case": "title-kebab",
  "separator": "/",
  "slash_count": 1
}
```

## Namespaces and semantic roles

```json
[
  {
    "id": "email",
    "label": "Email",
    "responsibility": "email-shell"
  },
  {
    "id": "banner",
    "label": "Banner",
    "responsibility": "large-standalone-module"
  },
  {
    "id": "block",
    "label": "Block",
    "responsibility": "standalone-content-block"
  },
  {
    "id": "card",
    "label": "Card",
    "responsibility": "repeated-card"
  },
  {
    "id": "item",
    "label": "Item",
    "responsibility": "nested-repeated-item"
  },
  {
    "id": "button",
    "label": "Button",
    "responsibility": "action"
  },
  {
    "id": "badge",
    "label": "Badge",
    "responsibility": "live-compact-ui"
  },
  {
    "id": "details",
    "label": "Details",
    "responsibility": "structured-data-set"
  },
  {
    "id": "nps",
    "label": "NPS",
    "responsibility": "rating-block"
  },
  {
    "id": "icon",
    "label": "Icon",
    "responsibility": "reusable-vector-glyph"
  },
  {
    "id": "asset",
    "label": "Asset",
    "responsibility": "published-export-asset"
  }
]
```

## Variant axis ordering

- 1. `Viewport` (`viewport`); values: `Mobile`, `Desktop`
- 2. `Layout` (`layout`)
- 3. `Style` (`style`)
- 4. `State` (`state`)
- 5. `Count` (`count`)
- 6. `Context` (`context`)

## Property names

```json
{
  "boolean": {
    "pattern": "Show <Role>",
    "positive_form_required": true,
    "prefix": "Show"
  },
  "case": "title-case",
  "instance_swap_roles": [
    "Icon",
    "Image",
    "Button"
  ],
  "text_roles": [
    "Heading",
    "Body",
    "Caption",
    "Supporting Text",
    "Button Label"
  ],
  "values": {
    "count_format": "digits",
    "word_case": "title-case"
  }
}
```

## Layer semantic roles

```json
{
  "case": "lower-kebab",
  "controlled_roles": [
    "image-area",
    "content-area",
    "text-content",
    "heading",
    "body",
    "caption",
    "supporting-text",
    "label",
    "link",
    "actions",
    "cards",
    "items",
    "steps",
    "bullets",
    "rows",
    "divider",
    "social-links",
    "background",
    "glyph",
    "artwork"
  ],
  "extension_forms": [
    "role",
    "role-qualifier",
    "role-two-digit-index"
  ],
  "forbidden_categories": [
    "color",
    "size",
    "padding",
    "gap",
    "position",
    "state",
    "html-tag",
    "viewport"
  ],
  "forbidden_patterns": [
    {
      "id": "figma-default",
      "pattern": "^(?:Frame|Group|Rectangle|Vector|Ellipse|Line|Subtract)(?: [0-9]+)?$"
    },
    {
      "id": "generic-container",
      "pattern": "^(?:Wrapper|Container)(?: [0-9]+)?$"
    }
  ],
  "repeater_index": {
    "digits": 2,
    "starts_at": 1
  }
}
```

## Asset owner names

```json
{
  "component_pattern": "Asset/<Semantic-Name> @<scale>x",
  "extension_in_name": "forbidden",
  "file_basename": {
    "remove_space_before_suffix": true
  },
  "internal_pattern": "<semantic-name> @<scale>x",
  "scale_suffixes": [
    {
      "scale": 2,
      "suffix": "@2x"
    },
    {
      "scale": 4,
      "suffix": "@4x"
    }
  ],
  "semantic_case": "lower-kebab",
  "suffix_position": "end",
  "viewport_words_in_name": "forbidden"
}
```

## Organizational and service names

```json
{
  "example": {
    "pattern": "Example · <Family> · <Semantic-Name> · <Viewport>"
  },
  "page": {
    "consolidated_default": "Email Components",
    "numeric_prefix": "allowed-only-for-stable-manual-sorting"
  },
  "section": {
    "avoid_namespace_duplication": true,
    "preferred_broad_label": "Shared"
  },
  "template": {
    "component_name": "Email/Template",
    "content_slot_name": "Content",
    "viewport_axis_id": "viewport"
  }
}
```
