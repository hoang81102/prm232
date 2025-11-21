import { Badge } from "../ui/badge";


interface AccountStatusBadgeProps {
  status: boolean;
}

export const AccountStatusBadge = ({ status }: AccountStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case false:
        return { label: "Bị khóa", variant: "destructive" as const };
      case true:
        return { label: "Đang hoạt động", variant: "default" as const };
      default:
        return { label: "Unknown", variant: "secondary" as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge variant={variant}>{label}</Badge>;
};
