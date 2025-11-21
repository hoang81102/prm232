import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import {
  addVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
} from "../api/vehicleApi";
import {
  AccountStatus,
  type Account,
  type AccountDetail,
} from "../types/account";
import { AccountTable } from "../components/account/AccountTable";
import { AccountrDetailsDialog } from "../components/account/AccountDetail";
import { AccountFormDialog } from "../components/account/AccountDetailFormDialog";
import { getAccount, getAccounts } from "../api/authApi";

export const mockAccounts: Account[] = [
  {
    u: 1,
    email: "nguyen.anh@example.com",
    phone: "0901234567",
    role: "RESIDENT",
    address: "Tầng 5, Block A, Khu chung cư Sunshine",
    status: AccountStatus.Active,
  },
  {
    accountId: 2,
    email: "tran.hoa@example.com",
    phone: "0912345678",
    role: "MANAGER",
    address: "Phòng 302, Khu B, Green Park",
    status: AccountStatus.Inactive,
  },
  {
    accountId: 3,
    email: null,
    phone: "0987654321",
    role: "GUARD",
    address: null,
    status: AccountStatus.Active,
  },
  {
    accountId: 4,
    email: "le.tuan@example.com",
    phone: "0978123456",
    role: "ADMIN",
    address: "12 Nguyễn Văn Cừ, Q.5, TP.HCM",
    status: AccountStatus.Active,
  },
];

export const mockAccountDetail: AccountDetail = {
  accountId: 2,
  email: "tran.hoa@example.com",
  phoneNumber: "0912345678",
  password: "hashed_password_example",
  role: "MANAGER",
  address: "Phòng 302, Khu B, Green Park",
  status: AccountStatus.Inactive,
  firstName: "Hòa",
  lastName: "Trần",
  gender: "Female",
  dateOfBirth: "1990-05-12",
};
const UsersManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const res = await getAccounts();
      if (res) {
        setAccounts(res);
      } else {
        setAccounts([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleView = async (account: Account) => {
    try {
      const res = await getAccount(account.userId);
      if (!res) throw new Error("Failed to load vehicle details");
      setSelectedAccount(res);
      setViewDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setFormDialogOpen(true);
  };

  const handleDelete = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      const res = await deleteVehicle(accountToDelete.accountId);
      if (!res) throw new Error("Failed to delete vehicle");
      toast.success(`Vehicle ${accountToDelete.phone} deleted successfully`);
      setAccounts((prev) =>
        prev.filter((v) => v.accountId !== accountToDelete.accountId)
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAccountToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAdd = () => {
    selectedAccount(null);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedAccount) {
      setAccounts(
        accounts.map((v) =>
          v.accountId === selectedAccount.accountId
            ? { ...data, vehicleId: selectedAccount.accountId }
            : v
        )
      );
      toast.success(`Vehicle ${data.licensePlate} updated successfully`);
    } else {
      // Add new vehicle
      const res = await addVehicle(data);
      if (!res) throw new Error("Failed to delete account");
      setAccounts([...accounts, res]);
      toast.success(`Account ${data.licensePlate} added successfully`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quản lí tài khoản</h1>
            <p className="text-muted-foreground">
              Quản lí tài khoản của người dùng
            </p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Tạo tài khoản
          </Button>
        </div>

        <AccountTable
          accounts={accounts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AccountrDetailsDialog
          account={selectedAccount}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />

        <AccountFormDialog
          account={selectedAccount}
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSubmit={handleFormSubmit}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
              <AlertDialogDescription>
                Nó sẽ bị xóa{" "}
                <span className="font-semibold">{accountToDelete?.phone}</span>.
                Hành động này không thể hoàn tác.
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

export default UsersManagement;
