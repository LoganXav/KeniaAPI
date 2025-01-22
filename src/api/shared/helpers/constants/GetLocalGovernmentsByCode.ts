import NigerianLocalGovernmentsConstant from "./NigerianLocalGovernments.constant";

export function GetLgasByCodeValue(codeValue: number): { id: number; codeValue: number; name: string }[] {
  return NigerianLocalGovernmentsConstant.filter((lga) => lga.codeValue === codeValue);
}
