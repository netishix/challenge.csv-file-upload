export default class HttpResponseError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpResponseError.prototype);
  }
}
