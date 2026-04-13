import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import type { StudentCreate } from "@/api/client";

interface FileUploadProps {
  onUpload: (students: StudentCreate[]) => void;
}

interface PreviewRow {
  name: string;
  phone: string;
  cetScore: number;
  branch: string;
}

const BRANCHES = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics & Comm.", "Information Technology"];

function normalizeHeaders(row: Record<string, unknown>): PreviewRow | null {
  const keys = Object.keys(row);
  const find = (patterns: string[]) =>
    keys.find((k) => patterns.some((p) => k.toLowerCase().replace(/[_\s-]/g, "").includes(p)));

  const nameKey = find(["name", "studentname", "fullname"]);
  const phoneKey = find(["phone", "mobile", "contact", "whatsapp"]);
  const cetKey = find(["cet", "score", "marks", "cetscore"]);
  const branchKey = find(["branch", "course", "department", "interest", "branchinterest", "courseinterest"]);

  if (!nameKey || !phoneKey) return null;

  const name = String(row[nameKey] || "").trim();
  const phone = String(row[phoneKey] || "").trim();
  const cetScore = Number(row[cetKey || ""] || 0);
  const branchRaw = String(row[branchKey || ""] || "").trim();
  const branch = BRANCHES.find((b) => b.toLowerCase().includes(branchRaw.toLowerCase())) || branchRaw || "Computer Science";

  if (!name || !phone) return null;
  return { name, phone, cetScore, branch };
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processData = (rows: Record<string, unknown>[]) => {
    const parsed = rows.map(normalizeHeaders).filter(Boolean) as PreviewRow[];
    setPreview(parsed);
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => processData(result.data as Record<string, unknown>[]),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];
        processData(data);
      };
      reader.readAsBinaryString(file);
    } else if (ext === "pdf") {
      // PDF parsing would require a PDF library - show placeholder
      setPreview([]);
      setFileName(file.name + " (PDF parsing not supported in browser — use CSV or Excel)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const confirmUpload = () => {
    const mapped: StudentCreate[] = preview.map((r) => ({
      name: r.name,
      phone: r.phone,
      course_interest: r.branch,
      lead_status: "new",
      lead_score: r.cetScore ? Math.round((r.cetScore / 200) * 100) : 0,
    }));
    onUpload(mapped);
    setPreview([]);
    setFileName("");
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="glass-card flex flex-col items-center justify-center gap-3 p-8 cursor-pointer border-2 border-dashed border-border/60 hover:border-primary/40 transition-colors duration-200"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">Supports CSV, Excel (.xlsx/.xls), and PDF</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">
            <FileSpreadsheet className="h-3 w-3" /> CSV
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">
            <FileSpreadsheet className="h-3 w-3" /> Excel
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">
            <FileText className="h-3 w-3" /> PDF
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {fileName && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileSpreadsheet className="h-4 w-4" />
          <span className="flex-1 truncate">{fileName}</span>
          <button onClick={() => { setPreview([]); setFileName(""); }} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{preview.length} students found</p>
            <Button size="sm" onClick={confirmUpload} className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Import {preview.length} Students
            </Button>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CET Score</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Branch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {preview.slice(0, 20).map((r, i) => (
                    <tr key={i} className="hover:bg-secondary/30">
                      <td className="px-4 py-2 text-foreground">{r.name}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.phone}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.cetScore}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
