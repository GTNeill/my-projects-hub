import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  RefreshCw,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  useClearShot,
  useMoveProject,
  useRefreshScreenshot,
  useRemoveProject,
  useUpdateProject,
  useUploadShot,
} from "../queries/projects";

export interface AdminProject {
  id: number;
  title: string;
  url: string;
  host: string;
  tagline: string;
  description: string;
  image: string | null;
  shotSource: "auto" | "upload";
  imageUrl: string;
  hidden: boolean;
  featured: boolean;
  screenshotUpdatedAt: Date | null;
}

const field =
  "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent/60";

export function ProjectEditor({ project }: { project: AdminProject }) {
  const update = useUpdateProject();
  const remove = useRemoveProject();
  const move = useMoveProject();
  const refresh = useRefreshScreenshot();
  const upload = useUploadShot();
  const clear = useClearShot();

  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pickFile = async (file: File) => {
    setUploadError(null);
    try {
      await upload.mutateAsync({ id: project.id, file });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const [title, setTitle] = useState(project.title);
  const [url, setUrl] = useState(project.url);
  const [tagline, setTagline] = useState(project.tagline);
  const [description, setDescription] = useState(project.description);
  const [imageUrl, setImageUrl] = useState(project.imageUrl);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTitle(project.title);
    setUrl(project.url);
    setTagline(project.tagline);
    setDescription(project.description);
    setImageUrl(project.imageUrl);
  }, [project.id, project.title, project.url, project.tagline, project.description, project.imageUrl]);

  const dirty =
    title !== project.title ||
    url !== project.url ||
    tagline !== project.tagline ||
    description !== project.description ||
    imageUrl !== project.imageUrl;

  const save = async () => {
    await update.mutateAsync({ id: project.id, title, url, tagline, description, imageUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full shrink-0 space-y-2 md:w-56">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) pickFile(file);
            }}
            className={`overflow-hidden rounded-lg border bg-surface-2 transition-colors ${
              dragging ? "border-accent" : "border-border"
            }`}
          >
            <div className="relative aspect-[16/10]">
              {project.image ? (
                <img src={project.image} alt="" className="size-full object-cover object-top" />
              ) : (
                <span className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <ImageIcon className="size-4" />
                  <span className="label-mono">none</span>
                </span>
              )}
              {upload.isPending ? (
                <span className="absolute inset-0 grid place-items-center bg-[color:var(--surface)]/80 label-mono">
                  Uploading…
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInput}
              type="file"
              aria-label={`Upload an image for ${project.title}`}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) pickFile(file);
                e.target.value = "";
              }}
            />
            <IconAction
              onClick={() => fileInput.current?.click()}
              icon={<Upload className="size-3.5" />}
              label={upload.isPending ? "Uploading" : "Upload"}
              active
            />
            {project.image ? (
              <IconAction
                onClick={() => {
                  if (confirm("Remove the current image?")) clear.mutate({ id: project.id });
                }}
                icon={<X className="size-3.5" />}
                label="Remove"
              />
            ) : null}
          </div>

          <p className="label-mono !normal-case text-muted-foreground">
            {project.shotSource === "upload"
              ? "Uploaded image — auto-capture won't replace it."
              : project.image
                ? "Auto-captured from the live URL."
                : "Drop a PNG/JPG here, or upload one."}
          </p>

          {uploadError ? (
            <p className="font-mono text-[11px] text-[color:var(--destructive)]">{uploadError}</p>
          ) : null}
        </div>

        <div className="flex-1 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="label-mono">Title</span>
              <input
                aria-label="Project title"
                className={field}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className="label-mono">URL</span>
              <input
                aria-label="Project URL"
                className={field}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="label-mono">Tagline (short, shown in accent)</span>
            <input
              aria-label="Project tagline"
              className={field}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="label-mono">Description</span>
            <textarea
              aria-label="Project description"
              className={`${field} min-h-20 resize-y`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="label-mono">Image override URL (optional)</span>
            <input
              aria-label="Image override URL"
              className={field}
              value={imageUrl}
              placeholder="leave blank to use the auto screenshot"
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={!dirty || update.isPending}
              className="rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--accent-foreground)] transition-opacity disabled:opacity-40"
            >
              {update.isPending ? "Saving" : saved ? "Saved" : "Save"}
            </button>

            <IconAction
              onClick={() => update.mutate({ id: project.id, hidden: !project.hidden })}
              active={!project.hidden}
              icon={project.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              label={project.hidden ? "Hidden" : "Visible"}
            />
            <IconAction
              onClick={() => update.mutate({ id: project.id, featured: !project.featured })}
              active={project.featured}
              icon={<Star className="size-3.5" />}
              label={project.featured ? "Featured" : "Feature"}
            />
            <IconAction
              onClick={() => refresh.mutate({ id: project.id })}
              icon={<RefreshCw className={`size-3.5 ${refresh.isPending ? "animate-spin" : ""}`} />}
              label={refresh.isPending ? "Capturing" : "Screenshot"}
            />
            <IconAction
              onClick={() => move.mutate({ id: project.id, direction: "up" })}
              icon={<ArrowUp className="size-3.5" />}
              label="Up"
            />
            <IconAction
              onClick={() => move.mutate({ id: project.id, direction: "down" })}
              icon={<ArrowDown className="size-3.5" />}
              label="Down"
            />
            <IconAction
              onClick={() => {
                if (confirm(`Delete "${project.title}"?`)) remove.mutate({ id: project.id });
              }}
              icon={<Trash2 className="size-3.5" />}
              label="Delete"
              danger
            />
          </div>

          {refresh.data && !refresh.data.ok ? (
            <p className="font-mono text-[11px] text-[color:var(--destructive)]">
              {refresh.data.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function IconAction({
  onClick,
  icon,
  label,
  active,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
        danger
          ? "border-border text-muted-foreground hover:border-[color:var(--destructive)] hover:text-[color:var(--destructive)]"
          : active
            ? "border-accent/60 text-foreground"
            : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
