import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = "general", className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full h-full object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-full min-h-[80px] rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground text-xs transition-colors"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
    </div>
  );
}
