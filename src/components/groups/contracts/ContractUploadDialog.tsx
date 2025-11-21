import { useState } from "react";
import { Loader2, UploadCloud, FileText } from "lucide-react";
import type { GroupSchema } from "../../../types/group";
import { fileToBase64 } from "../../../lib/utils";
import { generateContract } from "../../../api/contractApi";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

interface ContractUploadDialogProps {
  group: GroupSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ContractUploadDialog = ({
  group,
  open,
  onOpenChange,
  onSuccess,
}: ContractUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!group || !file) return;

    try {
      setIsSubmitting(true);
      const content = await fileToBase64(file);
      
      const success = await generateContract({
        coOwnerGroupId: group.coOwnerGroupId,
        content: content,
      });

      if (success) {
        setFile(null);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Upload Hợp Đồng</DialogTitle>
          <DialogDescription>
            Tải lên file hợp đồng cho nhóm{" "}
            <span className="font-semibold text-slate-900">
              {group?.groupName}
            </span>
            . Hỗ trợ định dạng .doc, .docx, .pdf.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="contractFile">Chọn file</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
              {!file ? (
                <>
                  <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">
                    Click để chọn file hoặc kéo thả vào đây
                  </span>
                </>
              ) : (
                <>
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-slate-700 text-center break-all">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </>
              )}
              <Input
                id="contractFile"
                type="file"
                accept=".doc,.docx,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className="bg-[#78B3CE] hover:bg-[#5a93ac] text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};