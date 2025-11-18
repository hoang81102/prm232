import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import type { Vehicle } from "../../types/vehicle";
import { VehicleForm } from "./VehicleForm";

interface VehicleFormDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const VehicleFormDialog = ({
  vehicle,
  open,
  onOpenChange,
  onSubmit,
}: VehicleFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>

        <VehicleForm
          vehicle={vehicle}
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
