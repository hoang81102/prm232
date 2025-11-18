import { useState } from "react";
import { Vehicle, VehicleStatus } from "@/types/vehicle";
import { Button } from "../components/ui/button";
import { VehicleDetailsDialog } from "@/components/vehicles/VehicleDetailsDialog";
import { VehicleFormDialog } from "@/components/vehicles/VehicleFormDialog";
import {

  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

import { Plus } from "lucide-react";
import { VehicleTable } from "../components/vehicle/VehicleTable";

// Mock data
const mockVehicles: Vehicle[] = [
  {
    vehicleId: 1,
    contractId: 101,
    licensePlate: "ABC-1234",
    vin: "1HGBH41JXMN109186",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    color: "Pearl White",
    batteryCapacityKwh: 75.5,
    chargingPortType: "NACS",
    purchaseDate: "2023-05-15",
    purchasePrice: 45000,
    coOwnerGroupId: null,
    status: VehicleStatus.Active,
  },
  {
    vehicleId: 2,
    contractId: 102,
    licensePlate: "XYZ-5678",
    vin: "2HGBH41JXMN109187",
    make: "Nissan",
    model: "Leaf",
    year: 2022,
    color: "Electric Blue",
    batteryCapacityKwh: 62.0,
    chargingPortType: "CCS2",
    purchaseDate: "2022-08-20",
    purchasePrice: 32000,
    coOwnerGroupId: null,
    status: VehicleStatus.Maintenance,
  },
  {
    vehicleId: 3,
    contractId: null,
    licensePlate: "DEF-9012",
    vin: "3HGBH41JXMN109188",
    make: "BMW",
    model: "i4",
    year: 2024,
    color: "Mineral Gray",
    batteryCapacityKwh: 83.9,
    chargingPortType: "CCS2",
    purchaseDate: "2024-01-10",
    purchasePrice: 58000,
    coOwnerGroupId: 5,
    status: VehicleStatus.Active,
  },
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

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
      setVehicles(vehicles.filter((v) => v.vehicleId !== vehicleToDelete.vehicleId));
      toast.success(`Vehicle ${vehicleToDelete.licensePlate} deleted successfully`);
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
      // Edit existing vehicle
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
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
