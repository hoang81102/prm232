import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AccountStatusBadge } from "./AccountStatusBadge";
import { Separator } from "../ui/separator";
import type { AccountDetail } from "../../types/account";

interface AccountDetailsDialogProps {
  account: AccountDetail | null;
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
      <DialogContent className="bg-white max-w-4xl! w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">Vehicle Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-orange-400 ">
                {account.accountId
                  ? `${account.accountId}`
                  : "N/A"}
              </h3>
            
            </div>
            <AccountStatusBadge status={account.status} />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Basic Information</h4>
              <DetailRow label="First Name" value={account.firstName} />
              <DetailRow label="Last Name" value={account.lastName} />
              <DetailRow label="Date of birth" value={account.dob} />
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Additional Information</h4>
              <DetailRow
                label="Gender"
                value={
                  account.gender
                }
              />
              <DetailRow
                label="Role"
                value={account.role}
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold mb-2 bg-gray-200 rounded pl-2">Contact Information</h4>
              <DetailRow label="Phone" value={account.phone} />
              <DetailRow
                label="Email"
                value={
                account.email
                }
              />
              <DetailRow
                label="Address"
                value={
                account.address
                }
              />
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
