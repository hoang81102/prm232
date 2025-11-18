import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { VehicleStatus, type Vehicle } from "../../types/vehicle";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { VehicleTable } from "../vehicle/VehicleTable";
import { VehicleDetailsDialog } from "../vehicle/VehicleDetail";
import { VehicleFormDialog } from "../vehicle/VehicleDetailFormDialog";
import { getVehicles } from "../../api/vehicleApi";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await getVehicles();
      if (res) {
        setVehicles(res);
      } else {
        setVehicles([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormDialogOpen(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(
        vehicles.filter((v) => v.vehicleId !== vehicleToDelete.vehicleId)
      );
      toast.success(
        `Vehicle ${vehicleToDelete.licensePlate} deleted successfully`
      );
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedVehicle) {
      setVehicles(
        vehicles.map((v) =>
          v.vehicleId === selectedVehicle.vehicleId
            ? { ...data, vehicleId: selectedVehicle.vehicleId }
            : v
        )
      );
      toast.success(`Vehicle ${data.licensePlate} updated successfully`);
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        ...data,
        vehicleId: Math.max(...vehicles.map((v) => v.vehicleId), 0) + 1,
      };
      setVehicles([...vehicles, newVehicle]);
      toast.success(`Vehicle ${data.licensePlate} added successfully`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Vehicle Management</h1>
            <p className="text-muted-foreground">
              Manage your electric vehicle fleet
            </p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Vehicle
          </Button>
        </div>

        <VehicleTable
          vehicles={vehicles}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />

        <VehicleFormDialog
          vehicle={selectedVehicle}
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSubmit={handleFormSubmit}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the vehicle{" "}
                <span className="font-semibold">
                  {vehicleToDelete?.licensePlate}
                </span>
                . This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Vehicles;
