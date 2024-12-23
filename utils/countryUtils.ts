import { operatorCodeMap, OperatorInfo } from '../types/port';

export function getOperatorInfo(phoneNumber: string | undefined): OperatorInfo | undefined {
  if (!phoneNumber) return undefined;
  const prefix = phoneNumber.slice(0, 3);
  return operatorCodeMap[prefix];
}

