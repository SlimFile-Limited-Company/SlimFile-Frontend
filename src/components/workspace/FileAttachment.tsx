import { useState } from 'react';
import { FileText, Download, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { MessageAttachment } from '@/services/workspaceService';

interface FileAttachmentProps {
  attachment: MessageAttachment;
  isOwnMessage?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileAttachment({ attachment, isOwnMessage = false }: FileAttachmentProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Image attachment
  if (attachment.type === 'image') {
    return (
      <>
        <div
          className="relative cursor-pointer rounded-lg overflow-hidden max-w-[250px] group"
          onClick={() => setIsPreviewOpen(true)}
        >
          <img
            src={attachment.thumbnailUrl || attachment.url}
            alt={attachment.filename}
            className="w-full h-auto max-h-[200px] object-cover rounded-lg"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
            <div className="relative">
              <img
                src={attachment.url}
                alt={attachment.filename}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-sm">
                <span className="truncate">{attachment.filename}</span>
                <a
                  href={attachment.url}
                  download={attachment.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Document attachment (PDF, PPTX, DOCX, XLSX)
  return (
    <a
      href={attachment.url}
      download={attachment.filename}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isOwnMessage
          ? 'bg-blue-500/30 hover:bg-blue-500/40'
          : 'bg-slate-100 hover:bg-slate-200'
      }`}
    >
      <div className={`p-2 rounded-lg ${isOwnMessage ? 'bg-blue-500' : 'bg-red-500'}`}>
        <FileText className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${isOwnMessage ? 'text-white' : 'text-slate-700'}`}>
          {attachment.filename}
        </div>
        <div className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-slate-500'}`}>
          {formatFileSize(attachment.size)}
        </div>
      </div>
      <Download className={`h-5 w-5 flex-shrink-0 ${isOwnMessage ? 'text-blue-100' : 'text-slate-400'}`} />
    </a>
  );
}

interface FileAttachmentsListProps {
  attachments: MessageAttachment[];
  isOwnMessage?: boolean;
}

export function FileAttachmentsList({ attachments, isOwnMessage = false }: FileAttachmentsListProps) {
  if (!attachments || attachments.length === 0) return null;

  // Group attachments by type for better display
  const images = attachments.filter(a => a.type === 'image');
  const others = attachments.filter(a => a.type !== 'image');

  return (
    <div className="space-y-2">
      {/* Display images in a grid */}
      {images.length > 0 && (
        <div className={`grid gap-2 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {images.map((attachment, index) => (
            <FileAttachment key={index} attachment={attachment} isOwnMessage={isOwnMessage} />
          ))}
        </div>
      )}

      {/* Display other files in a list */}
      {others.map((attachment, index) => (
        <FileAttachment key={`other-${index}`} attachment={attachment} isOwnMessage={isOwnMessage} />
      ))}
    </div>
  );
}
