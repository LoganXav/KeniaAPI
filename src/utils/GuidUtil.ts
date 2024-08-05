import { v4 } from "uuid";
import { StringUtil } from "./StringUtil";

export interface IGuidUtil {
  getV4(): string;
  getV4WithoutDashes(): string;
}

export class GuidUtil implements IGuidUtil {
  getV4(): string {
    return v4();
  }

  getV4WithoutDashes(): string {
    return v4().replace(/-/g, StringUtil.EMPTY);
  }
}

export default new GuidUtil();
