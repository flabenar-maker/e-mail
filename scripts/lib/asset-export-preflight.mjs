const CROP_TOLERANCE_PX = 0.01;

function issue(code, detail) {
  return { code, detail };
}

function positiveSize(size) {
  return Number.isFinite(size?.width) && size.width > 0 &&
    Number.isFinite(size?.height) && size.height > 0;
}

function identityTransform(transform) {
  return Array.isArray(transform) && transform.length === 2 &&
    transform[0]?.length === 3 && transform[1]?.length === 3 &&
    transform[0][0] === 1 && transform[0][1] === 0 && transform[0][2] === 0 &&
    transform[1][0] === 0 && transform[1][1] === 1 && transform[1][2] === 0;
}

function centeredFillCrop(source, ratio) {
  const sourceRatio = source.width / source.height;
  if (sourceRatio > ratio) {
    const width = source.height * ratio;
    return { x: (source.width - width) / 2, y: 0, width, height: source.height };
  }
  const height = source.width / ratio;
  return { x: 0, y: (source.height - height) / 2, width: source.width, height };
}

function sameRect(left, right) {
  return ["x", "y", "width", "height"].every((key) =>
    Number.isFinite(left?.[key]) &&
    Math.abs(left[key] - right[key]) <= CROP_TOLERANCE_PX
  );
}

function validDecision(decision, asset, evidence) {
  return decision?.action === "continue" &&
    decision.emailId === evidence.emailId &&
    decision.assetId === asset.id &&
    decision.sourceHash === evidence.sourceHash &&
    decision.targetWidth === asset.pixel_dimensions.width &&
    decision.targetHeight === asset.pixel_dimensions.height;
}

/**
 * Check one concrete email instance's export evidence before the file is used.
 * It does not read Figma or perform raster processing; callers must record the
 * real Fill hash, transform, crop and exported file properties from MCP/export.
 */
export function assessAssetExport({ asset, evidence, lowResolutionDecision } = {}) {
  const issues = [];
  if (!asset || !evidence) {
    return { status: "blocked", issues: [issue("evidence-missing", "Asset contract and export evidence are required.")] };
  }

  const target = asset.pixel_dimensions;
  const ratio = asset.aspect_ratio;
  if (!positiveSize(target) || !positiveSize(ratio)) {
    issues.push(issue("contract-geometry-invalid", "Target dimensions and aspect ratio must be positive."));
  }
  if (!evidence.emailId || !evidence.concreteInstanceId || !evidence.sourceHash) {
    issues.push(issue("concrete-source-missing", "The concrete email, instance ID and Fill hash must be recorded."));
  }
  if (evidence.assetId !== asset.id) {
    issues.push(issue("asset-id-mismatch", "The evidence belongs to a different asset."));
  }
  if (evidence.sourceViewport !== asset.source_viewport) {
    issues.push(issue("source-viewport-mismatch", "The source viewport differs from the asset contract."));
  }
  if (evidence.sourceNodeName !== asset.export_boundary?.semantic_node_name) {
    issues.push(issue("source-node-mismatch", "The selected source node differs from the export boundary."));
  }
  if (!positiveSize(evidence.outputPixelDimensions) ||
      evidence.outputPixelDimensions.width !== target?.width ||
      evidence.outputPixelDimensions.height !== target?.height) {
    issues.push(issue("output-dimensions-mismatch", "The exported file does not have the exact contract pixel dimensions."));
  }
  if (evidence.outputHasBakedPresentationRadius !== false) {
    issues.push(issue("presentation-radius-baked", "The export must have rectangular corners; the HTML container owns presentation radius."));
  }

  let effectiveSourcePixels;
  if (asset.source_mode_id === "image-fill") {
    const source = evidence.sourcePixelDimensions;
    if (!positiveSize(source)) {
      issues.push(issue("source-dimensions-missing", "The concrete Fill raster dimensions are required."));
    } else if (asset.crop?.mode === "figma-fill") {
      if (evidence.fillScaleMode !== "FILL" ||
          !identityTransform(evidence.imageTransform)) {
        issues.push(issue("fill-transform-unresolved", "This preflight can derive only FILL with identity imageTransform; resolve other transforms separately."));
      } else if (positiveSize(ratio)) {
        const expected = centeredFillCrop(source, ratio.width / ratio.height);
        if (!sameRect(evidence.cropRect, expected)) {
          issues.push(issue("crop-ratio-mismatch", "The recorded rectangular crop differs from the concrete Fill crop."));
        } else {
          effectiveSourcePixels = { width: expected.width, height: expected.height };
        }
      }
    } else if (asset.crop?.mode === "none") {
      if (positiveSize(ratio) &&
          Math.abs(source.width / source.height - ratio.width / ratio.height) > 0.001) {
        issues.push(issue("crop-ratio-mismatch", "Uncropped source ratio differs from the export ratio."));
      } else {
        effectiveSourcePixels = source;
      }
    } else {
      issues.push(issue("crop-mode-unresolved", "The asset crop mode is not supported."));
    }
  } else if (asset.source_mode_id === "rendered-node") {
    if (!positiveSize(evidence.effectiveSourcePixelDimensions)) {
      issues.push(issue("source-dimensions-missing", "Measure the limiting raster inside the rendered node."));
    } else {
      effectiveSourcePixels = evidence.effectiveSourcePixelDimensions;
    }
  } else {
    issues.push(issue("source-mode-unresolved", "The source mode is not supported."));
  }

  if (issues.length) return { status: "blocked", issues };

  const sourceShortfall = {
    width: Math.max(0, Math.ceil(target.width - effectiveSourcePixels.width)),
    height: Math.max(0, Math.ceil(target.height - effectiveSourcePixels.height)),
  };
  if (sourceShortfall.width || sourceShortfall.height) {
    if (validDecision(lowResolutionDecision, asset, evidence)) {
      return { status: "ready", issues: [], sourceShortfall, lowResolutionAccepted: true };
    }
    return {
      status: "needs-user-decision",
      issues: [issue("source-resolution-shortfall", "Replace the concrete source Fill or approve this shortfall for this email and asset only.")],
      sourceShortfall,
    };
  }
  return { status: "ready", issues: [] };
}