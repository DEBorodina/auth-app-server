export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors: unknown[] = []
  ) {
    super();
  }

  static UnauthorizedError() {
    return new ApiError(401, "Not authorized");
  }

  static BadRequest(message: string, errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }
}
