import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import type { GroupSchema } from "../../types/group";
import { createGroup, getGroupById, getGroups } from "../../api/groupApi";
import { Button } from "../ui/button";
import { GroupTable } from "../groups/GroupTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { GroupFormDialog } from "../groups/GroupFormDialog";
import type { Account } from "../../types/account";
import { getAccounts } from "../../api/authApi";

const GroupManagement = () => {
  const [groups, setGroups] = useState<GroupSchema[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupSchema | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupSchema | null>(null);
  const [users, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const res = await getGroups();
      if (res) {
        setGroups(res);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading groups");
    } finally {
      setLoading(false);
    }
  };

 const fetchUsers = async () => {
  try {
    const res = await getAccounts();
    console.log("Users fetched:", res);  // ← Thêm log để debug
    if (res && Array.isArray(res)) {
      setUsers(res);
    }
  } catch (err) {
    console.error("Error fetching users:", err);  // ← Log error chi tiết
    toast.error("Không thể tải danh sách user");
  }
};

  useEffect(() => {
    fetchGroup();
     fetchUsers();
  }, []);

  const handleView = async (group: GroupSchema) => {
    try {
      const res = await getGroupById(group.coOwnerGroupId);
      if (!res) throw new Error("Failed to load group details");
      setSelectedGroup(res);
      setViewDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (group: GroupSchema) => {
    // setSelectedGroup(group);
    setFormDialogOpen(true);
  };

  const handleDelete = (group: GroupSchema) => {
    // setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    // if (!groupToDelete) return;
    // try {
    //   toast.success(
    //     `Vehicle ${accountToDelete.phoneNumber} deleted successfully`
    //   );
    // } catch (error: any) {
    //   toast.error(error.message);
    // } finally {
    //   setAccountToDelete(null);
    //   setDeleteDialogOpen(false);
    // }
  };

 const handleAdd =  () => {
    setSelectedGroup(null);
    setFormDialogOpen(true);
};

  const handleFormSubmit = async (data: any) => {
    if (selectedGroup) {
      toast.success(`Vehicle ${data.licensePlate} updated successfully`);
    } else {
      const res = await createGroup(data);
      if (!res) throw new Error("Failed to create group");
      toast.success(`Group added successfully`);
      await fetchGroup();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Quản lí nhóm đồng sở hữu
            </h1>
            <p className="text-muted-foreground">
              Quản lí nhóm xe của người dùng
            </p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Tạo nhóm mới
          </Button>
        </div>

        <GroupTable
          groups={groups}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <GroupFormDialog
          group={selectedGroup}
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSubmit={handleFormSubmit}
          users={users}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
              <AlertDialogDescription>
                Nó sẽ bị xóa{" "}
                <span className="font-semibold">
                  {groupToDelete?.groupName}
                </span>
                . Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-0 !border-0 shadow-none !shadow-none hover:bg-slate-300">
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-500 text-destructive-foreground hover:bg-red-500 hover:text-white"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default GroupManagement;
