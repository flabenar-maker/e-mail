export class SystemValidationError extends Error {
  constructor(code, path, message) {
    super(message);
    this.name = "SystemValidationError";
    this.code = code;
    this.path = path;
  }
}

export function formatDiagnostic(error) {
  return error.path + ": [" + error.code + "] " + error.message;
}

export function formatRendererDiagnostics(errors) {
  const unique = new Map();
  for (const error of errors ?? []) {
    const item = {
      component_id: error?.component_id ?? "<email>",
      path: error?.path ?? "/",
      code: error?.code ?? "EMAIL_RENDER_FAILED",
      message: error?.message ?? String(error),
    };
    const key =
      item.component_id + "\0" + item.path + "\0" + item.code + "\0" + item.message;
    unique.set(key, item);
  }
  return [...unique.values()]
    .sort(
      (left, right) =>
        left.component_id.localeCompare(right.component_id) ||
        left.path.localeCompare(right.path) ||
        left.code.localeCompare(right.code) ||
        left.message.localeCompare(right.message),
    )
    .map(
      (item) =>
        "component=" +
        item.component_id +
        " path=" +
        item.path +
        " [" +
        item.code +
        "] " +
        item.message,
    )
    .join("\n");
}
