import { Badge } from "../ui/badge";


interface AccountStatusBadgeProps {
  status: number;
}

export const AccountStatusBadge = ({ status }: AccountStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 0:
        return { label: "Maintenance", variant: "destructive" as const };
      case 1:
        return { label: "Active", variant: "default" as const };
      default:
        return { label: "Unknown", variant: "secondary" as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge variant={variant}>{label}</Badge>;
};
