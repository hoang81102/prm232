import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import { createVote } from "../../api/voteApi";
import { getGroups } from "../../api/groupApi";
import type { GroupSchema } from "../../types/group";

// Schema validation
const voteFormSchema = z.object({
  coOwnerGroupId: z.string().min(1, "Vui lòng chọn nhóm"),
  topic: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().optional(),
});

export type VoteFormValues = z.infer<typeof voteFormSchema>;

interface CreateVoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateVoteDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateVoteDialogProps) => {
  const [groups, setGroups] = useState<GroupSchema[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteFormSchema),
    defaultValues: {
      coOwnerGroupId: "",
      topic: "",
      description: "",
    },
  });

  // Load danh sách nhóm khi mở dialog
  useEffect(() => {
    if (open) {
      const fetchGroups = async () => {
        try {
          setLoadingGroups(true);
          const res = await getGroups();
          if (res) setGroups(res);
        } catch (error) {
          console.error("Failed to load groups", error);
        } finally {
          setLoadingGroups(false);
        }
      };
      fetchGroups();
      form.reset(); // Reset form khi mở lại
    }
  }, [open, form]);

  const onSubmit = async (data: VoteFormValues) => {
    try {
      setIsSubmitting(true);
      

      const result = await createVote(data);
      
      if (result) {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo cuộc bình chọn mới</DialogTitle>
          <DialogDescription>
            Tạo chủ đề để các thành viên trong nhóm biểu quyết.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Chọn Group */}
            <FormField
              control={form.control}
              name="coOwnerGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn nhóm <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingGroups ? "Đang tải nhóm..." : "Chọn nhóm xe"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white max-h-[200px]">
                      {groups.map((g) => (
                        <SelectItem
                          key={g.coOwnerGroupId}
                          value={String(g.coOwnerGroupId)}
                          className="cursor-pointer hover:bg-emerald-50"
                        >
                          {g.groupName || `Group #${g.coOwnerGroupId}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Topic */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chủ đề (Topic) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Bảo dưỡng xe định kỳ tháng 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nhập chi tiết nội dung cần biểu quyết..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#78B3CE] hover:bg-[#5a93ac] text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo bình chọn
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};