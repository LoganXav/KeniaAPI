export interface IResult {
  statusCode: number | string
  success: boolean
  message: string
  error: string
  data: { message: string; data: unknown }
  setStatusCode(statusCode: number | string, success: boolean): void
  setMessage(message: string, statusCode: number | string): void
  setError(status: string, statusCode: number | string, message: string): void
  hasError(): boolean
  hasMessage(): boolean
  toResultDto(): ResultDto
  setMetadata(headers: Metadata): void
  addMetadata(key: string, value: string | number): void
  getMetadata(): Metadata
  hasMetadata(): boolean
}
type Metadata = Record<string, any>

export interface ResultDto {
  status: string
  statusCode: number | string
  data: {
    message: string
    data: unknown
  }
}
