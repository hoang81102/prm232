import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { VehicleStatus, type Vehicle } from "../../types/vehicle";
import { Select } from "../ui/select";

const vehicleFormSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required").max(255),
  vin: z.string().min(17, "VIN must be 17 characters").max(17),
  make: z.string().max(255).optional(),
  model: z.string().max(255).optional(),
  year: z.coerce
    .number()
    .min(2000, "Year must be between 2000 and 2100")
    .max(2100)
    .optional()
    .nullable(),
  color: z.string().max(255).optional(),
  batteryCapacityKwh: z.coerce.number().positive().optional().nullable(),
  chargingPortType: z.string().max(50).optional(),
  purchaseDate: z.string().optional().nullable(),
  purchasePrice: z.coerce.number().positive().optional().nullable(),
  contractId: z.coerce.number().optional().nullable(),
  status: z.nativeEnum(VehicleStatus),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  vehicle: Vehicle | null;
  onSubmit: (data: VehicleFormValues) => void;
  onCancel: () => void;
}

export const VehicleForm = ({
  vehicle,
  onSubmit,
  onCancel,
}: VehicleFormProps) => {
  const mapVehicleToFormValues = (v: Vehicle): VehicleFormValues => ({
    licensePlate: v.licensePlate ?? "",
    vin: v.vin ?? "",
    make: v.make ?? undefined,
    model: v.model ?? undefined,
    year: v.year ?? new Date().getFullYear(),
    color: v.color ?? undefined,
    batteryCapacityKwh: v.batteryCapacityKwh ?? undefined,
    chargingPortType: v.chargingPortType ?? "",
    purchaseDate: v.purchaseDate ?? "",
    purchasePrice: v.purchasePrice ?? undefined,
    contractId: v.contractId ?? undefined,

    status: v.status,
  });

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema) as any,
    defaultValues: vehicle
      ? mapVehicleToFormValues(vehicle)
      : {
          licensePlate: "",
          vin: "",
          make: "",
          model: "",
          year: new Date().getFullYear(),
          color: "",
          batteryCapacityKwh: undefined,
          chargingPortType: "",
          purchaseDate: "",
          purchasePrice: undefined,
          contractId: undefined,
          status: VehicleStatus.Active,
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate <span className="text-red-500">*</span> </FormLabel>
                <FormControl>
                  <Input placeholder="ABC-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tesla"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Model 3"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2024"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pearl White"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="batteryCapacityKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery Capacity (kWh)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="75.5"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chargingPortType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charging Port Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select port type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem className="hover:bg-emerald-300" value="CCS2">CCS2</SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value="NACS">NACS</SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value="CHAdeMO">CHAdeMO</SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value="Type2">Type 2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="45000.00"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem className="hover:bg-emerald-300" value={String(VehicleStatus.Active)}>
                      Active
                    </SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value={String(VehicleStatus.Inactive)}>
                      Inactive
                    </SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value={String(VehicleStatus.Maintenance)}>
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ContractId</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" className="bg-non hover:bg-slate-300" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {vehicle ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
