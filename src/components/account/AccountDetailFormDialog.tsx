import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Vehicle } from "../../types/vehicle";
import { AccountForm, VehicleForm } from "./AccountForm";
import type { Account, AccountDetail } from "../../types/account";

interface AccountFormDialogProps {
  account: AccountDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const AccountFormDialog = ({
  account,
  open,
  onOpenChange,
  onSubmit,
}: AccountFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white max-w-4xl!">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {account ? "Edit Account" : "Add New Account"}
          </DialogTitle>
        </DialogHeader>

        <AccountForm
          account={account}
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
