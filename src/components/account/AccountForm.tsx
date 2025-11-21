import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { z } from "zod";
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
import type { Account, AccountDetail } from "../../types/account";

const accountFormSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be 10 characters").max(11),
  password: z.string().min(8, "Password must be 17 characters").max(50),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  roleId: z.number().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  account: Account | null;
  onSubmit: (data: AccountFormValues) => void;
  onCancel: () => void;
}

export const AccountForm = ({
  account,
  onSubmit,
  onCancel,
}: AccountFormProps) => {
  const mapAccountToFormValues = (v: Account): AccountFormValues => ({
    phoneNumber: v.phoneNumber,
    password: "",
    firstName: v.firstName ?? "",
    lastName: v.lastName ?? "",
    roleId: v.status ?? 1,
  });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema) as any,
    defaultValues: account
      ? mapAccountToFormValues(account)
      : {
          phoneNumber: "",
          password: "",
          firstName: "",
          lastName: "",
          roleId: 1,
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số điện thoại <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input placeholder="0933880434" {...field} />
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
                <FormLabel>
                  Mật Khẩu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="**********"
                    maxLength={17}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ly"
                    {...field}
                    value={field.value || ""}
                  />
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
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Luan"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vai trò</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn role" />
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
            Hủy
          </Button>
          <Button type="submit">
            {account ? "Cập nhật tài khoản" : "Thêm tài khoản"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
