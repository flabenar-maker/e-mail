

test("schema requires exact client resilience policies and rejects removed shell naming", async () => {
  const [rendering, schema] = await Promise.all([
    canonicalRendering(),
    readSchema(),
  ]);
  rendering.embedded_css = { max_bytes_exclusive: 0 };
  rendering.color_scheme = { declaration: "dark", dark_variant: "none" };
  rendering.responsive_fallback = {
    without_embedded_css: "desktop",
    validation: "required-before-change",
  };
  rendering.shell.min_supported_viewport_px = 300;
  rendering.shell.min_width_px = 300;

  const errors = validateRenderingShape(rendering, schema);

  assert.ok(
    hasDiagnostic(
      errors,
      "rendering-schema",
      "/embedded_css/max_bytes_exclusive",
    ),
  );
  assert.ok(
    hasDiagnostic(errors, "rendering-schema", "/color_scheme/declaration"),
  );
  assert.ok(hasDiagnostic(errors, "rendering-schema", "/shell"));
});

test("semantic validation rejects a viewport consumed by horizontal shell insets", async () => {
  const rendering = await canonicalRendering();
  delete rendering.shell.min_width_px;
  rendering.shell.min_supported_viewport_px = 30;

  const errors = validateRenderingSemantics(rendering);

  assert.ok(
    hasDiagnostic(
      errors,
      "RENDERING_SHELL_VIEWPORT_IMPOSSIBLE",
      "/shell/min_supported_viewport_px",
    ),
  );
});
