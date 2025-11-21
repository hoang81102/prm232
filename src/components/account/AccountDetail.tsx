import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AccountStatusBadge } from "./AccountStatusBadge";
import { Separator } from "../ui/separator";
import type { Account } from "../../types/account";

interface AccountDetailsDialogProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountrDetailsDialog = ({
  account,
  open,
  onOpenChange,
}: AccountDetailsDialogProps) => {
  if (!account) return null;

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className="flex justify-between py-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-medium text-orange-400">{value || "N/A"}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-3xl! w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">Vehicle Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-orange-400 ">
                {account.userId
                  ? `${account.userId}`
                  : "N/A"}
              </h3>
            
            </div>
            <AccountStatusBadge status={account.isActive} />
          </div>

          <Separator />

          <div className=" gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Thông tin cơ bản</h4>
              <DetailRow label="Họ" value={account.firstName} />
              <DetailRow label="Tên" value={account.lastName} />
              <DetailRow label="Vai trò" value={account.roleName} />
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Thông tin liên hệ</h4>
              <DetailRow label="Phone" value={account.phoneNumber} />
              <DetailRow
                label="Email"
                value={
                account.email
                }
              />
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
