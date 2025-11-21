import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { VehicleStatusBadge } from "./VehicleStatusBadge";
import { Separator } from "../../components/ui/separator";
import type { VehicleSchema } from "../../api/vehicleApi";

interface VehicleDetailsDialogProps {
  vehicle: VehicleSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VehicleDetailsDialog = ({
  vehicle,
  open,
  onOpenChange,
}: VehicleDetailsDialogProps) => {
  if (!vehicle) return null;

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className="flex justify-between py-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-medium text-orange-400">{value || "N/A"}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-4xl! w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">Vehicle Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-orange-400 ">
                {vehicle.make && vehicle.model
                  ? `${vehicle.make} ${vehicle.model}`
                  : "Unknown Vehicle"}
              </h3>
              <p className="text-sm text-orange-400">{vehicle.licensePlate}</p>
            </div>
            <VehicleStatusBadge status={vehicle.status} />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Basic Information</h4>
              <DetailRow label="VIN" value={vehicle.vin} />
              {/* <DetailRow label="Year" value={vehicle.year} /> */}
              <DetailRow label="Color" value={vehicle.color} />
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Technical Specs</h4>
              <DetailRow
                label="Battery Capacity"
                value={
                  vehicle.batteryCapacityKwh
                    ? `${vehicle.batteryCapacityKwh} kWh`
                    : null
                }
              />
              {/* <DetailRow
                label="Charging Port"
                value={vehicle.chargingPortType}
              /> */}
            </div>

            {/* <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Purchase Information</h4>
              <DetailRow label="Purchase Date" value={vehicle.purchaseDate} />
              <DetailRow
                label="Purchase Price"
                value={
                  vehicle.purchasePrice
                    ? `$${vehicle.purchasePrice.toLocaleString()}`
                    : null
                }
              />
            </div> */}

            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">References</h4>
              {/* <DetailRow label="Contract ID" value={vehicle.contractId} /> */}
              <DetailRow
                label="Co-Owner Group ID"
                value={vehicle.coOwnerGroupId}
              />
              <DetailRow label="Vehicle ID" value={vehicle.vehicleId} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
