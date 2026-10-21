import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Download,
  UploadCloud,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  MonitorPlay,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Lock,
} from "lucide-react";
import { CATEGORIES, TOOLS_LIST } from "../data/initialProjects";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];
const MAX_VIDEO_BYTES = 20 * 1024 * 1024; // videos are uploaded as they are
const MAX_IMAGE_BYTES = 50 * 1024 * 1024; // images are shrunk automatically before upload

export default function AdminModal({
  isOpen,
  onClose,
  projects,
  usingSamples,
  session,
  onSignIn,
  onSignOut,
  onAddProject,
  onDeleteProject,
  onImportProjects,
}) {
  const [activeTab, setActiveTab] = useState("upload"); // 'upload', 'manage', 'backup'

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState(
    CATEGORIES[1] || "Branding & Graphics",
  );
  const [selectedTools, setSelectedTools] = useState(["Photoshop"]);
  const [mediaType, setMediaType] = useState("image"); // 'image', 'interactive', 'video'
  const [interactiveType, setInteractiveType] = useState("figma"); // 'figma', 'lunacy'
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("Auto");
  const [detectedRatio, setDetectedRatio] = useState(null);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [statusMsg, setStatusMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setSigningIn(true);
    const message = await onSignIn(loginEmail.trim(), loginPassword);
    setSigningIn(false);
    if (message) {
      setLoginError(message);
    } else {
      setLoginPassword("");
    }
  };

  if (!session) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        <div className="fixed inset-0" onClick={onClose} />

        <div className="relative w-full max-w-sm z-10 bg-white dark:bg-[#0D0E13] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F1521] p-1 flex items-center justify-center border border-sky-500/20 shadow-sm">
                <img
                  src="./logo-emblem-transparent.png"
                  alt="WorkSphere"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">
                Studio Sign In
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              Studio management is for the WorkSphere team only. Sign in with
              your team account.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gray-900 hover:bg-black text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
            >
              {signingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{signingIn ? "Signing in…" : "Sign In"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers (signed-in view)
  // ---------------------------------------------------------------------------
  const handleToggleTool = (toolName) => {
    if (selectedTools.includes(toolName)) {
      if (selectedTools.length > 1) {
        setSelectedTools(selectedTools.filter((t) => t !== toolName));
      }
    } else {
      setSelectedTools([...selectedTools, toolName]);
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setMediaFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to determine common aspect ratio name
  const calculateRatio = (w, h) => {
    const ratio = w / h;
    let label = `${w}:${h}`;

    if (Math.abs(ratio - 1) < 0.05) label = "1:1";
    else if (Math.abs(ratio - 16 / 9) < 0.08) label = "16:9";
    else if (Math.abs(ratio - 9 / 16) < 0.08) label = "9:16";
    else if (Math.abs(ratio - 4 / 5) < 0.05) label = "4:5";
    else if (Math.abs(ratio - 5 / 4) < 0.05) label = "5:4";
    else if (Math.abs(ratio - 3 / 2) < 0.05) label = "3:2";
    else if (Math.abs(ratio - 2 / 3) < 0.05) label = "2:3";
    else if (Math.abs(ratio - 4 / 3) < 0.05) label = "4:3";
    else if (Math.abs(ratio - 21 / 9) < 0.08) label = "21:9";

    setAspectRatio(label);
    setDetectedRatio({ width: w, height: h, label });
  };

  // Choosing a file: check it, preview it, and detect its true aspect ratio
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatusMsg({
        type: "error",
        text: "Unsupported file type. Please use JPG, PNG, WebP, GIF, MP4 or WebM.",
      });
      e.target.value = "";
      return;
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setStatusMsg({
        type: "error",
        text: "Videos must be 20 MB or smaller. Please compress it and try again.",
      });
      e.target.value = "";
      return;
    }
    if (!isVideo && file.size > MAX_IMAGE_BYTES) {
      setStatusMsg({
        type: "error",
        text: "That image is very large (over 50 MB). Please export a smaller version.",
      });
      e.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setMediaFile(file);
    setMediaUrl(""); // a chosen file replaces any pasted link
    setStatusMsg(null);

    if (isVideo) {
      setMediaType("video");
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        calculateRatio(video.videoWidth, video.videoHeight);
      video.src = objectUrl;
    } else {
      setMediaType((prev) =>
        prev === "interactive" ? "interactive" : "image",
      );
      const img = new Image();
      img.onload = () => calculateRatio(img.width, img.height);
      img.src = objectUrl;
    }
  };

  // Pasting an image link instead of uploading a file
  const handleMediaUrlChange = (url) => {
    if (mediaFile) clearFile();
    setMediaUrl(url);
    if (!url) return;

    if (mediaType !== "video") {
      const img = new Image();
      img.onload = () => calculateRatio(img.width, img.height);
      img.src = url;
    }
  };

  // Auto-convert standard Figma share URL to embed URL
  const handleFigmaUrlChange = (url) => {
    setEmbedUrl(url);
    if (url.includes("figma.com") && !url.includes("figma.com/embed")) {
      const converted = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
      setEmbedUrl(converted);
    }
  };

  const resetForm = () => {
    setTitle("");
    setClient("");
    clearFile();
    setMediaUrl("");
    setEmbedUrl("");
    setDescription("");
    setTagsInput("");
    setDetectedRatio(null);
    setAspectRatio("Auto");
  };

  // ---------------------------------------------------------------------------
  // Publish a new project
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!title.trim()) {
      setStatusMsg({ type: "error", text: "Please enter a project title." });
      return;
    }
    const hasMedia = !!mediaFile || !!mediaUrl;
    if (mediaType === "video" && !hasMedia) {
      setStatusMsg({
        type: "error",
        text: "Please upload a video file or paste a video link.",
      });
      return;
    }
    if (!hasMedia && !(mediaType === "interactive" && embedUrl)) {
      setStatusMsg({
        type: "error",
        text: "Please upload a file, paste an image link, or add a Figma / Lunacy link.",
      });
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const fields = {
      title: title.trim(),
      client: client.trim() || "Internal Studio Spec",
      year: year || new Date().getFullYear().toString(),
      category,
      tools: selectedTools,
      mediaType,
      interactiveType:
        mediaType === "interactive" ? interactiveType : undefined,
      aspectRatio:
        aspectRatio && aspectRatio !== "Auto" ? aspectRatio : "Native",
      aspectRatioValue: detectedRatio
        ? detectedRatio.width / detectedRatio.height
        : undefined,
      mediaUrl: mediaFile ? "" : mediaUrl,
      embedUrl: mediaType === "interactive" ? embedUrl : undefined,
      description:
        description.trim() ||
        "Visual and interactive work crafted for WorkSphere.design.",
      tags: tags.length > 0 ? tags : ["Design", "WorkSphere"],
      featured: false,
    };

    setSaving(true);
    setStatusMsg(null);
    try {
      await onAddProject(fields, mediaFile);
      setStatusMsg({
        type: "success",
        text: `Project "${fields.title}" published to the portfolio!`,
      });
      resetForm();
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete a project
  // ---------------------------------------------------------------------------
  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}" from the portfolio? Its uploaded files will be removed too.`,
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    try {
      await onDeleteProject(project);
      setStatusMsg({
        type: "success",
        text: `"${project.title}" was deleted.`,
      });
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "Could not delete that project.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Backup: export / import JSON
  // ---------------------------------------------------------------------------
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `worksphere-portfolio-backup-${new Date().toISOString().split("T")[0]}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData)) {
          setStatusMsg({
            type: "error",
            text: "Invalid JSON format. Expected an array of projects.",
          });
          return;
        }
        const count = await onImportProjects(importedData);
        setStatusMsg({
          type: "success",
          text: `Successfully imported ${count} projects!`,
        });
      } catch (err) {
        setStatusMsg({
          type: "error",
          text:
            err instanceof SyntaxError
              ? "Failed to parse JSON file."
              : err.message || "Import failed.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const tabClass = (name) =>
    `pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
      activeTab === name
        ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
        : "border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    }`;

  const formatButtonClass = (name) =>
    `flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
      mediaType === name
        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 shadow-sm"
        : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
    }`;

  const realCount = usingSamples ? 0 : projects.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl z-10 bg-white dark:bg-[#0D0E13] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-white/70 dark:bg-[#0D0E13]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0F1521] p-1 flex items-center justify-center border border-sky-500/20 shadow-sm">
              <img
                src="./logo-emblem-transparent.png"
                alt="WorkSphere"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                Work<span className="text-[#38BDF8]">Sphere</span> Studio
                Management
              </h2>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Signed in as {session.user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <button
            onClick={() => setActiveTab("upload")}
            className={tabClass("upload")}
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Design</span>
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={tabClass("manage")}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Designs ({realCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("backup")}
            className={tabClass("backup")}
          >
            <Download className="w-4 h-4" />
            <span>JSON Backup & Sync</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl flex items-center justify-between text-xs font-medium ${
              statusMsg.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{statusMsg.text}</span>
            </div>
            <button
              onClick={() => setStatusMsg(null)}
              className="hover:opacity-75"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 1: Upload New Design */}
        {activeTab === "upload" && (
          <div className="overflow-y-auto p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Type Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  1. Design / Output Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={formatButtonClass("image")}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Static Image / Graphic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType("interactive")}
                    className={formatButtonClass("interactive")}
                  >
                    <MonitorPlay className="w-4 h-4" />
                    <span>Figma / Lunacy Live</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={formatButtonClass("video")}
                  >
                    <VideoIcon className="w-4 h-4" />
                    <span>Motion / Video MP4</span>
                  </button>
                </div>
              </div>

              {/* Media File Upload or URL input */}
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 font-medium">
                  2. Upload Media or Provide Embed Link
                </label>

                {/* File Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-white/[0.02]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Click to browse your graphic design or video file
                  </p>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1">
                    JPG, PNG, WebP, GIF, MP4, WebM. Images are shrunk
                    automatically; videos must be 20 MB or less.
                  </p>
                </div>

                {/* Preview of the chosen file */}
                {mediaFile && previewUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                    {mediaFile.type.startsWith("video/") ? (
                      <video
                        src={previewUrl}
                        muted
                        className="w-16 h-16 rounded-lg object-cover bg-black/20"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-white/5"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {mediaFile.name}
                      </p>
                      <p className="text-[11px] font-mono text-gray-700 dark:text-gray-300">
                        {(mediaFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* URL Alternative */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-700 dark:text-gray-300 mb-1">
                      Or Paste Image / Video URL
                    </label>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => handleMediaUrlChange(e.target.value)}
                      placeholder="https://.../design.png"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {mediaType === "interactive" && (
                    <div>
                      <label className="block text-[11px] font-mono text-gray-700 dark:text-gray-300 mb-1">
                        Figma Share Link or Embed URL
                      </label>
                      <input
                        type="url"
                        value={embedUrl}
                        onChange={(e) => handleFigmaUrlChange(e.target.value)}
                        placeholder="https://www.figma.com/file/..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                {/* Detected Aspect Ratio Badge */}
                {detectedRatio && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs font-mono text-indigo-700 dark:text-indigo-300">
                    <span>
                      ✓ Detected Natural Dimensions:{" "}
                      <strong>
                        {detectedRatio.width} × {detectedRatio.height} px
                      </strong>
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                      Ratio: {detectedRatio.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Obelisk Typographic Monograph"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Client / Brand
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Studio Architrave"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121318] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All Work").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Aspect Ratio Label
                  </label>
                  <input
                    type="text"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    placeholder="e.g. 4:5 Poster, 16:9, 1:1"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Tools Selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Tools Used (Multi-select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOOLS_LIST.map((tool) => {
                    const isSelected = selectedTools.includes(tool.name);
                    return (
                      <button
                        type="button"
                        key={tool.name}
                        onClick={() => handleToggleTool(tool.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded text-[9px] font-mono font-bold flex items-center justify-center text-white"
                          style={{
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.3)"
                              : tool.color,
                          }}
                        >
                          {tool.short}
                        </span>
                        <span>{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Design Narrative & Technique
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the creative direction, the problem you solved, and the tools and techniques you used..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Brand Identity, Vector, CMYK, Offset Print, UI/UX"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {saving ? "Uploading…" : "Publish Design to Portfolio"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Manage Existing Designs */}
        {activeTab === "manage" && (
          <div className="overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                Total Works In Portfolio: <strong>{realCount}</strong>
              </span>
            </div>

            {usingSamples && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200">
                Visitors are currently seeing the sample projects. As soon as
                you publish your first real design, the samples are replaced by
                your own work.
              </div>
            )}

            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {project.mediaType === "video" && !project.thumbnailUrl ? (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500">
                        <VideoIcon className="w-5 h-5" />
                      </div>
                    ) : (
                      <img
                        src={project.thumbnailUrl || project.mediaUrl}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {project.title}
                      </h4>
                      <p className="text-[11px] text-gray-700 dark:text-gray-300">
                        {project.client} • {project.category} • Ratio:{" "}
                        {project.aspectRatio}
                      </p>
                    </div>
                  </div>

                  {!usingSamples && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(project)}
                        disabled={deletingId === project.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                        title="Delete design"
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: JSON Backup & Sync */}
        {activeTab === "backup" && (
          <div className="overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-gray-700 dark:text-gray-300 space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Portfolio Backup
              </h4>
              <p>
                Your designs are saved in the WorkSphere database, and every
                visitor sees them. Free projects are not backed up
                automatically, so download a JSON backup regularly. Importing a
                backup adds its projects to the portfolio, so only import into
                an empty portfolio to avoid duplicates. Backups store links to
                your image files, not the image files themselves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Export Box */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 space-y-3">
                <Download className="w-6 h-6 text-indigo-500" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Export Portfolio Database
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Download all {projects.length} designs, aspect ratios, and
                  metadata as a standard JSON backup.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json Backup</span>
                </button>
              </div>

              {/* Import Box */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 space-y-3">
                <UploadCloud className="w-6 h-6 text-emerald-500" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Import Portfolio Database
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Restore a previously exported portfolio JSON file into
                  WorkSphere.
                </p>
                <input
                  ref={jsonInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <button
                  onClick={() => jsonInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-900 dark:text-white transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Select .json to Restore</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
