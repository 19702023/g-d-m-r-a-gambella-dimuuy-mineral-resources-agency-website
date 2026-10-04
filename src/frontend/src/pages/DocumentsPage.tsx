import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Download,
  Eye,
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useFileDelete,
  useFileList,
  useFileUpload,
  useFileUrl,
} from "../blob-storage/FileStorage";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return "An unexpected error occurred";
}

export default function DocumentsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: files, isLoading: filesLoading } = useFileList();
  const { uploadFile, isUploading } = useFileUpload();

  // Filter for PDF files
  const pdfFiles =
    files?.filter((file) => file.path.toLowerCase().endsWith(".pdf")) || [];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error(
        "Only PDF files can be uploaded. Please choose a .pdf document.",
      );
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const path = `documents/${selectedFile.name}`;
      await uploadFile(path, selectedFile, setUploadProgress);
      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(`Upload failed: ${errorMessage(error)}`);
      console.error("Upload error:", error);
    }
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    try {
      if (!fileUrl) {
        toast.error("File URL not available");
        return;
      }

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download started");
    } catch (error) {
      toast.error("Error downloading file");
      console.error("Download error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Documents & Upload</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here you can view and download important documents related to our gold
          mining activities, and upload new PDF documents to make them available
          for customers.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDF Document
          </CardTitle>
          <CardDescription>
            Upload a PDF document to make it available for customers to
            download.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PDF document to make it available for customers to
                download
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
                data-ocid="documents.upload_input"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {selectedFile && (
              <div className="space-y-3 p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="text-sm truncate">
                      {selectedFile.name}
                    </span>
                    <Badge variant="secondary">PDF</Badge>
                  </div>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    size="sm"
                    data-ocid="documents.upload_button"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                {isUploading && (
                  <div
                    className="space-y-1"
                    data-ocid="documents.upload_progress"
                  >
                    <Progress value={uploadProgress} />
                    <p className="text-xs text-muted-foreground text-right">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Documents List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Available Documents</h2>

        {filesLoading ? (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="documents.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading documents...</span>
          </div>
        ) : pdfFiles.length === 0 ? (
          <Alert data-ocid="documents.empty_state">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No PDF documents available for download at this time. Upload a
              document above to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4">
            {pdfFiles.map((file, index) => (
              <DocumentCard
                key={file.path}
                file={file}
                index={index}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Document Information</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• All documents are in PDF format for optimal compatibility</p>
          <p>
            • Documents contain official information about gold mining
            activities
          </p>
          <p>
            • Upload new documents using the form above to make them available
            for download
          </p>
          <p>
            • For questions about specific documents, contact our
            representatives
          </p>
          <p>• Documents are regularly updated with the latest information</p>
        </div>
      </div>
    </div>
  );
}

interface DocumentCardProps {
  file: { path: string; hash: string };
  index: number;
  onDownload: (fileUrl: string, filename: string) => void;
}

function DocumentCard({ file, index, onDownload }: DocumentCardProps) {
  const { data: fileUrl } = useFileUrl(file.path);
  const { deleteFile, isDeleting } = useFileDelete();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const filename = file.path.split("/").pop() || "document.pdf";

  const handleConfirmDelete = async () => {
    try {
      await deleteFile(file.path);
      toast.success(`"${filename}" was deleted`);
      setConfirmOpen(false);
    } catch (error) {
      toast.error(`Could not delete "${filename}": ${errorMessage(error)}`);
      console.error("Delete error:", error);
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow"
      data-ocid={`documents.item.${index + 1}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
              <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 truncate">
                {filename}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">PDF Document</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">PDF</Badge>
                <span className="text-xs text-muted-foreground">
                  Hash: {file.hash.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-4">
            {fileUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(fileUrl, "_blank")}
                data-ocid={`documents.view_button.${index + 1}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onDownload(fileUrl || "", filename)}
              disabled={!fileUrl}
              data-ocid={`documents.download_button.${index + 1}`}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isDeleting}
              data-ocid={`documents.delete_button.${index + 1}`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent data-ocid={`documents.delete_dialog.${index + 1}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">{filename}</span>{" "}
              from the available documents. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              data-ocid={`documents.cancel_button.${index + 1}`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid={`documents.confirm_button.${index + 1}`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
