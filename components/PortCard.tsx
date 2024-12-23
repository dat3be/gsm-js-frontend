import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Port } from '../types/port';
import { getOperatorInfo } from '../utils/countryUtils';

interface PortCardProps {
  port: Port;
  onClick: () => void;
  loading?: boolean;
}

export default function PortCard({ port, onClick, loading }: PortCardProps) {
  const getBackgroundColor = (status: string) => {
    return status === 'Online'
      ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
      : 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800';
  };

  const operatorInfo = port.phoneNumber ? getOperatorInfo(port.phoneNumber) : undefined;

  return (
    <Card
      className={`relative cursor-pointer transition-colors ${getBackgroundColor(port.status)} h-full flex flex-col`}
      onClick={onClick}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg z-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {/* Port Info */}
      <CardHeader className="p-3 flex-grow">
        <CardTitle className="text-lg">{port.port}</CardTitle>
      </CardHeader>

      {/* Port Details */}
      <CardContent className="p-3 pt-0 space-y-2">
        {/* Status Badge */}
        <Badge variant={port.status === 'Online' ? 'success' : 'destructive'}>
          {port.status}
        </Badge>

        {/* Online Details */}
        {port.status === 'Online' && (
          <>
            {/* Phone Number */}
            {port.phoneNumber && (
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">📱</span>
                  <span className="text-sm font-medium">{port.phoneNumber}</span>
                </div>
                {operatorInfo && (
                  <span className="text-xs text-muted-foreground">{operatorInfo.name}</span>
                )}
              </div>
            )}

            {/* Balance */}
            {port.balance !== undefined && (
              <p className="text-sm font-medium">💰 {port.balance?.toLocaleString('vi-VN')}đ</p>
            )}
          </>
        )}

        {/* Offline Details */}
        {port.status !== 'Online' && (
          <p className="text-sm text-muted-foreground">Port is currently offline.</p>
        )}
      </CardContent>
    </Card>
  );
}
