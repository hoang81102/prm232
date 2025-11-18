import { useState } from "react";

import { VehicleStatusBadge } from "./VehicleStatusBadge";
import { Eye, Pencil, Trash2, Search, MoreHorizontal, Pen } from "lucide-react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import type { Vehicle } from "../../types/vehicle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleTable = ({
  vehicles,
  onView,
  onEdit,
  onDelete,
}: VehicleTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by license plate, VIN, make, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-gray-500"
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-300">
              <TableHead>License Plate</TableHead>
              <TableHead>Make & Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Battery (kWh)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No vehicles found
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.vehicleId} className="hover:bg-gray-200">
                  <TableCell className="font-medium">
                    {vehicle.licensePlate}
                  </TableCell>
                  <TableCell>
                    {vehicle.make && vehicle.model
                      ? `${vehicle.make} ${vehicle.model}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{vehicle.year || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {vehicle.vin}
                  </TableCell>
                  <TableCell>{vehicle.batteryCapacityKwh || "N/A"}</TableCell>
                  <TableCell>
                    <VehicleStatusBadge status={vehicle.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => {
                            onView(vehicle);
                          }}
                          className="hover:bg-gray-300"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(vehicle)}
                          className="hover:bg-gray-300"
                        >
                          <Pen className="mr-2 h-4 w-4" />
                          Tải xuống
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(vehicle)}
                          className="text-red-500 hover:bg-gray-300"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
