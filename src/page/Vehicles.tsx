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
} from "../components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { VehicleStatus, type Vehicle } from "../types/vehicle";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { VehicleTable } from "../components/vehicle/VehicleTable";
import { VehicleDetailsDialog } from "../components/vehicle/VehicleDetail";
import { VehicleFormDialog } from "../components/vehicle/VehicleDetailFormDialog";
import { addVehicle, deleteVehicle, getVehicleById, getVehicles, type VehicleSchema } from "../api/vehicleApi";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleSchema[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSchema | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleSchema | null>(null);
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


  const handleView = async (vehicle: VehicleSchema) => {
     try {
      const res = await getVehicleById(vehicle.vehicleId);
      if (!res) throw new Error("Failed to load vehicle details");
      setSelectedVehicle(res);
      setViewDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (vehicle: VehicleSchema) => {
    setSelectedVehicle(vehicle);
    toast.error("Chức năng đang phát triển");
    // setFormDialogOpen(true);
  };

  const handleDelete = (vehicle: VehicleSchema) => {
    setVehicleToDelete(vehicle);
    toast.error("Chức năng đang phát triển");
    // setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      const res = await deleteVehicle(vehicleToDelete.vehicleId);
      if (!res) throw new Error("Failed to delete vehicle");
      toast.success(`Vehicle ${vehicleToDelete.licensePlate} deleted successfully`);
      setVehicles((prev) =>
        prev.filter((v) => v.vehicleId !== vehicleToDelete.vehicleId)
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
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
      const res = await addVehicle(data);
      if (!res) throw new Error("Failed to delete vehicle");
      setVehicles([...vehicles, res]);
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
          <AlertDialogContent className="bg-white">
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
              <AlertDialogCancel className="border-0 !border-0 shadow-none !shadow-none hover:bg-slate-300">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-500 text-destructive-foreground hover:bg-red-500 hover:text-white"
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
