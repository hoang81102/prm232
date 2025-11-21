import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import type { GroupSchema } from "../../types/group";
import { Checkbox } from "../ui/checkbox";

interface GroupFormProps {
  group: GroupSchema | null;
  onSubmit: (data: GroupFormValues) => void;
  onCancel: () => void;
  users: Account[];
}

const groupMemberSchema = z.object({
  userId: z.number().min(1, "Vui lòng chọn thành viên"),
  sharePercent: z.coerce.number().min(0).max(1, "Tỉ lệ phải từ 0 đến 1"),
  isAdmin: z.boolean(),
});

const groupFormSchema = z.object({
  groupName: z.string().min(1, "Tên nhóm không được để trống"),
  initialMembers: z
    .array(groupMemberSchema)
    .min(1, "Nhóm phải có ít nhất 1 thành viên"),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;

export const GroupForm = ({
  group,
  onSubmit,
  onCancel,
  users,
}: GroupFormProps) => {
  const form = useForm({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      groupName: group?.groupName ?? "",
      initialMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "initialMembers",
  });

  console.log("Users:", users);
  console.log("Fields:", fields);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Group Name */}
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhóm</FormLabel>
              <FormControl>
                <Input placeholder="Nhóm ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="font-semibold text-sm">Thành viên nhóm</div>
          {fields.length === 0 ? (
            <div className="text-gray-500 text-sm p-2">
              Chưa có thành viên nào. Click "Thêm thành viên" để bắt đầu.
            </div>
          ) : (
            fields.map((member, index) => (
              <div
                key={member.id}
                className="grid grid-cols-4 gap-2 items-end p-3 border rounded"
              >
                {/* User Select */}
                <FormField
                  control={form.control}
                  name={`initialMembers.${index}.userId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Thành viên</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[9999] bg-white">
                          {users.length === 0 ? (
                            <div className="text-gray-500 p-2 text-sm text-center">
                              Chưa có user nào
                            </div>
                          ) : (
                            users.map((u) => (
                              <SelectItem
                                key={u.userId}
                                value={String(u.userId)}
                                className="hover:bg-emerald-300"
                              >
                                {u.email}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Share Percent */}
                <FormField
                  control={form.control}
                  name={`initialMembers.${index}.sharePercent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Share %</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          max={1}
                          placeholder="0.3"
                          {...field}
                          value={field.value ? Number(field.value) : 0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Checkbox */}
                <FormField
                  control={form.control}
                  name={`initialMembers.${index}.isAdmin`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs mb-0">Admin</FormLabel>
                    </FormItem>
                  )}
                />

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Xóa
                </Button>
              </div>
            ))
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ userId: 0, sharePercent: 0, isAdmin: false })
            }
          >
            + Thêm thành viên
          </Button>
        </div>

        {/* Submit / Cancel */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {group ? "Cập nhật nhóm" : "Tạo nhóm mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
