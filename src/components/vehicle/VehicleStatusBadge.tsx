import { Badge } from "../ui/badge";


interface VehicleStatusBadgeProps {
  status: number;
}

export const VehicleStatusBadge = ({ status }: VehicleStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 0:
        return { label: "Maintenance", variant: "default" as const };
      case 1:
        return { label: "Active", variant: "destructive" as const };
      case 2:
        return { label: "Inactive", variant: "secondary" as const };
      default:
        return { label: "Unknown", variant: "secondary" as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge variant={variant}>{label}</Badge>;
};
