import { IResult, ResultDto } from "./IResult"

export class Result implements IResult {
  public statusCode: number | string
  public success: boolean
  public message: string
  public status: string
  public error: string
  public data: unknown
  private metadata: Metadata = {}

  setStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode
    this.success = success
  }
  setData(
    status: string,
    statusCode: number | string,
    message: string,
    data: unknown
  ): void {
    this.status = status
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
  setMessage(message: string, statusCode: number | string): void {
    this.message = message
    this.statusCode = statusCode
  }
  setError(error: string, statusCode: number | string): void {
    this.error = error
    this.statusCode = statusCode
  }
  hasError(): boolean {
    return !!this.error
  }
  hasMessage(): boolean {
    return !!this.message
  }
  toResultDto(): ResultDto {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      error: this.error
    }
  }
  setMetadata(headers: Metadata): void {
    this.metadata = headers
  }
  addMetadata(key: string, value: string | number): void {
    this.metadata[key] = value
  }
  getMetadata(): Metadata {
    return this.metadata
  }

  hasMetadata(): boolean {
    return Object.keys(this.metadata).length > 0
  }
}

interface Metadata {
  [key: string]: string | number
}
