import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Account, AccountDetail } from "../../types/account";
import { GroupForm } from "./GroupForm";
import type { GroupSchema } from "../../types/group";

interface GroupFormDialogProps {
  group: GroupSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
   users: Account[];
}

export const GroupFormDialog = ({
  group,
  open,
  onOpenChange,
  onSubmit,
  users
}: GroupFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white max-w-4xl!">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {group ? "Chỉnh sửa nhóm" : "Thêm nhóm mới"}
          </DialogTitle>
        </DialogHeader>

        <GroupForm
          group={group}
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          users={users}
        />
      </DialogContent>
    </Dialog>
  );
};
