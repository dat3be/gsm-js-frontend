import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Port } from '../types/port'
import { getOperatorInfo } from '../utils/countryUtils'

interface PortModalProps {
  port: Port
  onClose: () => void
}

export default function PortModal({ port, onClose }: PortModalProps) {
  const operatorInfo = port.phoneNumber ? getOperatorInfo(port.phoneNumber) : undefined

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{port.port} Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Status</h3>
            <Badge 
              variant={port.status === 'Online' ? 'success' : 'destructive'}
            >
              {port.status}
            </Badge>
          </div>
          {port.status === 'Online' && (
            <>
              {port.phoneNumber && (
                <div>
                  <h3 className="font-semibold mb-1">Phone Number</h3>
                  <p className="text-sm text-muted-foreground">
                    {port.phoneNumber}
                  </p>
                  {operatorInfo && (
                    <p className="text-sm text-muted-foreground">
                      Operator: {operatorInfo.name}
                    </p>
                  )}
                </div>
              )}
              {port.balance !== undefined && (
                <div>
                  <h3 className="font-semibold mb-1">Balance</h3>
                  <p className="text-sm text-muted-foreground">{port.balance?.toLocaleString('vi-VN')}đ</p>
                </div>
              )}
            </>
          )}
          <div>
            <h3 className="font-semibold mb-1">Zone</h3>
            <p className="text-sm text-muted-foreground">Zone {port.zoneId}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Last Updated</h3>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

