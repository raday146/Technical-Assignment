export class ValidationError extends Error {
  readonly code = "VALIDATION_ERROR" as const;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
