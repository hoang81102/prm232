import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Select } from "../ui/select";
import type { Account } from "../../types/account";

interface AccountFormProps {
  account: Account | null;
  onSubmit: (data: AccountFormValues) => void;
  onCancel: () => void;
}

const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

// Factory function tạo schema dựa vào việc có account hay không
const getAccountFormSchema = (isEdit: boolean) =>
  isEdit
    ? z.object({
        email: z.string().email("Email không hợp lệ"),
        firstName: z.string().trim().min(1, "Họ (First Name) là bắt buộc"),
        lastName: z.string().trim().min(1, "Tên (Last Name) là bắt buộc"),
        roleId: z.number().int().positive("Role ID phải là số dương"),
      })
    : z.object({
        phoneNumber: z
          .string()
          .min(1, "Số điện thoại không được để trống")
          .regex(phoneRegex, "Số điện thoại không hợp lệ (VD: 09...)"),
        password: z.string().min(6, "Mật khẩu từ 6 ký tự trở lên"),
        firstName: z.string().trim().min(1, "Họ (First Name) là bắt buộc"),
        lastName: z.string().trim().min(1, "Tên (Last Name) là bắt buộc"),
        roleId: z.number().int().positive("Role ID phải là số dương"),
      });

export type AccountFormValues = z.infer<
  ReturnType<typeof getAccountFormSchema>
>;

export const roleStringToNumber = (role: string): number => {
  switch (role.toLowerCase()) {
    case "admin":
      return 1;
    case "staff":
      return 2;
    case "coowner":
      return 3;
    default:
      return 0; // hoặc ném lỗi nếu muốn
  }
};

export const AccountForm = ({
  account,
  onSubmit,
  onCancel,
}: AccountFormProps) => {
  const isEdit = !!account;
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(getAccountFormSchema(isEdit)),
    defaultValues: isEdit
      ? {
          email: account?.email ?? "",
          firstName: account?.firstName ?? "",
          lastName: account?.lastName ?? "",
          roleId: roleStringToNumber(account.roleName),
        }
      : {
          phoneNumber: "",
          password: "",
          firstName: "",
          lastName: "",
          roleId: 0,
        },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ly" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Luan" maxLength={17} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEdit ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="09xxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vai trò</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem className="hover:bg-emerald-300" value="1">
                      Admin
                    </SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value="2">
                      Staff
                    </SelectItem>
                    <SelectItem className="hover:bg-emerald-300" value="3">
                      CoOwner
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            className="bg-non hover:bg-slate-300"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {account ? "Update Account" : "Add Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
