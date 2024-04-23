import { IResult, ResultDto } from "./IResult"

export class Result implements IResult {
  public statusCode: number | string
  public success: boolean
  public message: string
  public error: string
  public data: string
  private metadata: Metadata = {}
  
  setStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode
    this.success = success
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
      data: this.data,
      message: this.message,
      error: this.error,
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
