export interface Port {
  port: string;
  status: 'Online' | 'Offline';
  phoneNumber?: string;
  balance?: number;
  zoneId: string;
  operator?: string;
}

export interface PortsResponse {
  ports: Port[]
}

export interface PortInfo {
  phoneNumber: string;
  status: 'Online' | 'Offline';
  balance: number;
}

export interface PortInfoResponse {
  success: boolean;
  data?: PortInfo;
  error?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  portNumber: string;
  event: string;
}

export interface Zone {
  id: string;
  name: string;
  apiEndpoint: string;
  portCount: number;
}

export interface OperatorInfo {
  name: string;
  code: string;
}

export const operatorCodeMap: { [key: string]: OperatorInfo } = {
  // Viettel
  '096': { name: 'Viettel', code: 'VTT' },
  '097': { name: 'Viettel', code: 'VTT' },
  '098': { name: 'Viettel', code: 'VTT' },
  '032': { name: 'Viettel', code: 'VTT' },
  '033': { name: 'Viettel', code: 'VTT' },
  '034': { name: 'Viettel', code: 'VTT' },
  '035': { name: 'Viettel', code: 'VTT' },
  '036': { name: 'Viettel', code: 'VTT' },
  '037': { name: 'Viettel', code: 'VTT' },
  '038': { name: 'Viettel', code: 'VTT' },
  '039': { name: 'Viettel', code: 'VTT' },
  // Vinaphone
  '091': { name: 'Vinaphone', code: 'VNP' },
  '094': { name: 'Vinaphone', code: 'VNP' },
  '088': { name: 'Vinaphone', code: 'VNP' },
  '083': { name: 'Vinaphone', code: 'VNP' },
  '084': { name: 'Vinaphone', code: 'VNP' },
  '085': { name: 'Vinaphone', code: 'VNP' },
  '081': { name: 'Vinaphone', code: 'VNP' },
  '082': { name: 'Vinaphone', code: 'VNP' },
  // Mobifone
  '089': { name: 'Mobifone', code: 'VMS' },
  '090': { name: 'Mobifone', code: 'VMS' },
  '093': { name: 'Mobifone', code: 'VMS' },
  '070': { name: 'Mobifone', code: 'VMS' },
  '076': { name: 'Mobifone', code: 'VMS' },
  '077': { name: 'Mobifone', code: 'VMS' },
  '078': { name: 'Mobifone', code: 'VMS' },
  '079': { name: 'Mobifone', code: 'VMS' },
  // Vietnamobile
  '092': { name: 'Vietnamobile', code: 'VNM' },
  '056': { name: 'Vietnamobile', code: 'VNM' },
  '058': { name: 'Vietnamobile', code: 'VNM' },
  // Gmobile
  '059': { name: 'Gmobile', code: 'GMB' },
  '099': { name: 'Gmobile', code: 'GMB' },
};

// Sample data
export const samplePorts: Port[] = Array.from({ length: 192 }, (_, i) => {
  const operatorKeys = Object.keys(operatorCodeMap);
  const randomOperatorKey = operatorKeys[Math.floor(Math.random() * operatorKeys.length)];
  const phoneNumber = `${randomOperatorKey}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
  const operator = operatorCodeMap[randomOperatorKey].name;
  return {
    port: `COM${i + 1}`,
    status: Math.random() > 0.5 ? 'Online' : 'Offline',
    phoneNumber,
    balance: Math.random() > 0.5 ? Math.floor(Math.random() * 500000 / 1000) * 1000 : undefined,
    zoneId: i < 64 ? '1' : i < 128 ? '2' : i < 160 ? '3' : '4',
    operator,
  };
});

export const sampleNotifications: Notification[] = [
  { id: "1", message: "Port COM3 is now online", type: "success" },
  { id: "2", message: "Port COM4 is offline", type: "error" },
  { id: "3", message: "New port COM8 detected", type: "info" },
];

export const sampleLogEntries: LogEntry[] = [
  { id: "1", timestamp: "2023-05-10T10:30:00Z", portNumber: "COM3", event: "Port came online" },
  { id: "2", timestamp: "2023-05-10T11:15:00Z", portNumber: "COM4", event: "Port went offline" },
  { id: "3", timestamp: "2023-05-10T12:00:00Z", portNumber: "COM5", event: "Phone number changed" },
  { id: "4", timestamp: "2023-05-10T13:45:00Z", portNumber: "COM6", event: "Port reset" },
  { id: "5", timestamp: "2023-05-10T14:30:00Z", portNumber: "COM7", event: "New SIM card detected" },
];

export const sampleZones: Zone[] = [
  { id: '1', name: 'Hanoi Data Center', apiEndpoint: 'https://api.hanoi.example.com', portCount: 64 },
  { id: '2', name: 'Ho Chi Minh City Data Center', apiEndpoint: 'https://api.hcmc.example.com', portCount: 128 },
  { id: '3', name: 'Da Nang Data Center', apiEndpoint: 'https://api.danang.example.com', portCount: 32 },
  { id: '4', name: 'Can Tho Data Center', apiEndpoint: 'https://api.cantho.example.com', portCount: 96 },
];

