import { Badge } from "../ui/badge";


interface VehicleStatusBadgeProps {
  status: string;
}

export const VehicleStatusBadge = ({ status }: VehicleStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Inactive":
        return { label: "Dừng hoạt động", variant: "destructive" as const };
      case 'Active':
        return { label: "Đang hoạt động", variant: "default" as const };
      case 'Maintenance':
        return { label: "Đang bảo dưỡng", variant: "warning" as const };
      default:
        return { label: "Unknown", variant: "secondary" as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge variant={variant}>{label}</Badge>;
};
