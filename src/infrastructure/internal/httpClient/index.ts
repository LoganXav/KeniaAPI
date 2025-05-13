import axios from "axios";
import { IGetRequest, IPostRequest } from "~/infrastructure/internal/types/httpTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

export class HttpClient {
  public static async get(getRequestDto: IGetRequest) {
    const { url, headers } = getRequestDto;

    const axiosInstance = axios.create({ headers });

    try {
      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public static async post(postRequestDto: IPostRequest) {
    const { url, headers, body } = postRequestDto;

    const axiosInstance = axios.create({ headers });

    try {
      const response = await axiosInstance.post(url, body);

      return response.data;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
