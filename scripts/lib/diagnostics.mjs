export class SystemValidationError extends Error {
  constructor(code, path, message) {
    super(message);
    this.name = "SystemValidationError";
    this.code = code;
    this.path = path;
  }
}

export function formatDiagnostic(error) {
  return `${error.path}: [${error.code}] ${error.message}`;
}
