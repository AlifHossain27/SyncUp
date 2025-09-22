import { useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Upload } from 'lucide-react';
import { toast } from "sonner"
import { uploadSubscribersFile } from "@/actions/subscribers";

const UploadFile = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const resp = await uploadSubscribersFile(file);
      if (resp.ok) {
        toast.success(`Successfully Uploaded File`);
        await router.refresh();
      } else {
        toast.error(`${resp.body?.detail || "Upload failed"} (Status ${resp.status})`);
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button
        type="button"
        variant="default"
        size="lg"
        onClick={handleClick}
        disabled={loading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {loading ? "Uploading..." : "Upload Data"}
      </Button>
    </div>
  );
};

export default UploadFile;
