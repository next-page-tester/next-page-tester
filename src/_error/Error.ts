export class InternalError extends Error {
  public static NAME = 'InternalError';

  constructor(message: string) {
    super(message);
    this.name = InternalError.NAME;
  }
}

export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}
