import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, X } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  fileData: Blob;
  onClose: () => void;
  onDownload: () => void;
}

export default function ResumeViewer({ fileData, onClose, onDownload }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!fileData) return;
    const url = URL.createObjectURL(fileData);
    urlRef.current = url;
    setObjectUrl(url);
    setPage(1); // reset page

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [fileData]);

  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center backdrop-blur-sm">
      <div
        className="w-[90vw] h-[92vh] rounded-xl flex flex-col shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)", border: "1px solid var(--color-primaryBorder)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: "var(--color-primaryBorder)" }}
        >
          <h2 className="font-semibold text-sm tracking-wide" style={{ color: "var(--color-text)" }}>
            Resume Preview
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Zoom in"
              style={{ color: "var(--color-text)" }}
            >
              <ZoomIn size={17} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.2).toFixed(1)))}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Zoom out"
              style={{ color: "var(--color-text)" }}
            >
              <ZoomOut size={17} />
            </button>
            <span className="text-[11px] font-mono opacity-40 w-10 text-center" style={{ color: "var(--color-text)" }}>
              {Math.round(zoom * 100)}%
            </span>
            <div className="w-px h-5 opacity-20" style={{ backgroundColor: "var(--color-text)" }} />
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
              style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
            >
              <Download size={14} />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: "var(--color-text)" }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center p-6" style={{ backgroundColor: "var(--color-secondary)" }}>
          {objectUrl ? (
            <Document
              file={objectUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(err) => console.error("PDF Load Error:", err)}
              loading={
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm font-medium animate-pulse opacity-50" style={{ color: "var(--color-text)" }}>
                    Loading resume…
                  </p>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm font-medium text-red-500">Failed to load PDF.</p>
                </div>
              }
            >
              <Page
                pageNumber={page}
                scale={zoom}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-xl rounded-sm"
              />
            </Document>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm opacity-40" style={{ color: "var(--color-text)" }}>Preparing preview…</p>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-center gap-4 border-t px-5 py-3 shrink-0"
          style={{ borderColor: "var(--color-primaryBorder)" }}
        >
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
            style={{ color: "var(--color-text)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium opacity-60" style={{ color: "var(--color-text)" }}>
            Page {page} of {numPages || "—"}
          </span>
          <button
            disabled={page >= numPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
            style={{ color: "var(--color-text)" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}