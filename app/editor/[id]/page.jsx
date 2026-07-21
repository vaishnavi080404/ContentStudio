"use client";

import { use } from "react";
import { MousePointer2, Type, Shapes, Undo2, Redo2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CanvasEditor from "@/components/editor/CanvasEditor";
import templates from "@/lib/template";
import { shapeOptions } from "@/lib/shapeOptions";
import ShapePreview from "@/components/editor/ShapePreview";
import { googleFonts } from "@/lib/fonts";
import CropModal from "@/components/editor/CropModal";
import { undrawIllustrations } from "@/lib/undrawList";
import useEditorStore from "@/store/editorStore";
import ColorControl from "@/components/editor/ColorControl";
import { toAppGradient } from "@/lib/gradientUtils";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

const tools = [
  { id: "select", icon: MousePointer2 },
  { id: "text", icon: Type },
  { id: "elements", icon: Shapes },
];

const elementTabs = [
  { id: "shapes", label: "Shapes" },
  { id: "photos", label: "Photos" },
  { id: "graphics", label: "Graphics" },
];
const actions = [
  { id: "undo", icon: Undo2 },
  { id: "redo", icon: Redo2 },
];

export default function EditorPage({ params }) {
  // read designId from URL
  const searchParams = useSearchParams(); // import from "next/navigation"
  const designId = searchParams.get("designId");
  const aiGenerated = searchParams.get("aiGenerated");

  const { id } = use(params);

  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const [activeElementTab, setActiveElementTab] = useState("shapes");
  const [selectedShapeCategory, setSelectedShapeCategory] = useState(null);
  const bgColor = useEditorStore((state) => state.bgColor);
  const setBgColor = useEditorStore((state) => state.setBgColor);
  const headline = useEditorStore((state) => state.headline);
  const setHeadline = useEditorStore((state) => state.setHeadline);
  const subheading = useEditorStore((state) => state.subheading);
  const setSubheading = useEditorStore((state) => state.setSubheading);
  const bodyText = useEditorStore((state) => state.bodyText);
  const setBodyText = useEditorStore((state) => state.setBodyText);

  const saveSnapshotRef = useRef(null);

  const undoTriggerRef = useRef(null);
  const redoTriggerRef = useRef(null);

  const selectedObject = useEditorStore((state) => state.selectedObject);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);
  const bringToFrontRef = useRef(null);
  const sendToBackRef = useRef(null);
  const deleteObjectRef = useRef(null);
  const addShapeRef = useRef(null);
  const addImageRef = useRef(null);
  const addIconRef = useRef(null);

  const setObjectPropRef = useRef(null);
  const commitObjectPropRef = useRef(null);

  const fillColor = useEditorStore((state) => state.fillColor);
  const setFillColor = useEditorStore((state) => state.setFillColor);
  const textColor = useEditorStore((state) => state.textColor);
  const setTextColor = useEditorStore((state) => state.setTextColor);
  const illustrationColor = useEditorStore((state) => state.illustrationColor);
  const setIllustrationColor = useEditorStore(
    (state) => state.setIllustrationColor,
  );

  const fontSize = useEditorStore((state) => state.fontSize);
  const setFontSize = useEditorStore((state) => state.setFontSize);
  const strokeColor = useEditorStore((state) => state.strokeColor);
  const setStrokeColor = useEditorStore((state) => state.setStrokeColor);
  const strokeWidth = useEditorStore((state) => state.strokeWidth);
  const setStrokeWidth = useEditorStore((state) => state.setStrokeWidth);
  const cornerRadius = useEditorStore((state) => state.cornerRadius);
  const setCornerRadius = useEditorStore((state) => state.setCornerRadius);
  const opacity = useEditorStore((state) => state.opacity);
  const setOpacity = useEditorStore((state) => state.setOpacity);
  const [fontSearch, setFontSearch] = useState("");
  const rotation = useEditorStore((state) => state.rotation);
  const setRotation = useEditorStore((state) => state.setRotation);

  const [copied, setCopied] = useState(false);
  const copyRef = useRef(null);
  const pasteRef = useRef(null);

  const [activeGraphicTab, setActiveGraphicTab] = useState("icons");

  const [iconSearch, setIconSearch] = useState("");
  const [iconResults, setIconResults] = useState([]);
  const [iconSearchLoading, setIconSearchLoading] = useState(false);
  const [undrawResults, setUndrawResults] = useState([]);
  const addIllustrationRef = useRef(null);
  const setIllustrationColorRef = useRef(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageData, setCropImageData] = useState(null);
  const applyCropRef = useRef(null);

  const getCanvasDataRef = useRef(null);
  const loadCanvasRef = useRef(null);

  const applyAIDesignRef = useRef(null);

  const [pendingAIDesign, setPendingAIDesign] = useState(null);
  const [pendingAIImage, setPendingAIImage] = useState(null);

  const customWidth = searchParams.get("w");
  const customHeight = searchParams.get("h");

  const [designTitle, setDesignTitle] = useState("");

  const template = templates.find((t) => t.id === id);
  const systemFonts = [
    "Arial",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
  ];

  const suggestedSearches = ["party", "arrow", "heart", "star", "rocket"];

  const COLORFUL_PREFIXES = [
    "fluent-emoji-flat",
    "noto",
    "twemoji",
    "emojione",
    "flat-color-icons",
  ].join(",");

  const handleFontChange = async (fontName) => {
    if (!systemFonts.includes(fontName)) {
      if (!document.querySelector(`link[data-font="${fontName}"]`)) {
        await new Promise((resolve) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;700&display=swap`;
          link.setAttribute("data-font", fontName);
          link.onload = resolve;
          document.head.appendChild(link);
        });
      }
    }
    setObjectPropRef.current?.("fontFamily", fontName);
    commitObjectPropRef.current?.();
  };

  useEffect(() => {
    if (!selectedObject) return;

    setStrokeColor(toAppGradient(selectedObject.stroke) || "#333333");
    setStrokeWidth(selectedObject.strokeWidth || 0);
    setCornerRadius(selectedObject.rx || 0);
    setOpacity(selectedObject.opacity ?? 1);
    setRotation(Math.round(selectedObject.angle || 0)); // fabric's own rotation angle, unrelated to gradient angle

    if (selectedObject.isIllustration) {
      const primaryChild = selectedObject
        .getObjects?.()
        .find((c) => c.isPrimaryFill);
      setIllustrationColor(toAppGradient(primaryChild?.fill) || "#000000");
    } else if (
      selectedObject.type === "i-text" ||
      selectedObject.type === "textbox"
    ) {
      setTextColor(toAppGradient(selectedObject.fill) || "#000000");
      setFontSize(selectedObject.fontSize || 16);
    } else {
      setFillColor(toAppGradient(selectedObject.fill) || "lightblue");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject]);

  useEffect(() => {
    if (!iconSearch.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIconResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIconSearchLoading(true);
      try {
        const res = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(iconSearch)}&limit=48&prefixes=${COLORFUL_PREFIXES}`,
        );
        const data = await res.json();
        setIconResults(data.icons || []);
      } catch (err) {
        console.log("icon search failed:", err);
        setIconResults([]);
      } finally {
        setIconSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconSearch]);

  useEffect(() => {
    if (!iconSearch.trim()) {
      // show a default set so the panel isn't empty before the user types anything
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUndrawResults(undrawIllustrations.slice(0, 22));
      return;
    }
    const q = iconSearch.toLowerCase();
    setUndrawResults(undrawIllustrations.filter((name) => name.includes(q)));
  }, [iconSearch]);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const exportImageRef = useRef(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");

    //  check if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // : get canvas JSON + thumbnail data URL from CanvasEditor
    const { json, thumbnail } = getCanvasDataRef.current?.() || {};
    if (!json) {
      setSaveMsg("Nothing to save");
      setSaving(false);
      return;
    }

    // upload the thumbnail to S3 (or LocalStack in dev), get back a URL.
    // the filename just needs to be unique — it doesn't need to match the
    // design's real id, so a plain random string is enough here.
    let thumbnailUrl = thumbnail;
    if (thumbnail) {
      try {
        const randomName = Math.random().toString(36).slice(2);

        const res = await fetch("/api/thumbnail/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: thumbnail, designId: randomName }),
        });
        const result = await res.json();
        if (res.ok) {
          thumbnailUrl = result.url;
        } else {
          console.log("thumbnail upload failed:", result.error);
        }
      } catch (err) {
        console.log("thumbnail upload error:", err.message);
      }
    }

    // step 4: save to designs table
    let error;
    if (designId) {
      // update existing design
      ({ error } = await supabase
        .from("Designs")
        .update({
          canvas_json: json,
          thumbnail: thumbnailUrl,
          title: designTitle || "Untitled Design",
          updated_at: new Date().toISOString(),
        })
        .eq("id", designId));
    } else {
      // insert new design
      const { data: newDesign, error: insertError } = await supabase
        .from("Designs")
        .insert({
          user_id: user.id,
          template_id: id,
          title: headline || "Untitled Design",
          canvas_json: json,
          thumbnail: thumbnailUrl,
        })
        .select()
        .single();

      error = insertError;

      // update URL to reflect the new design id so refreshing works
      if (newDesign) {
        window.history.replaceState(
          {},
          "",
          `/editor/${id}?designId=${newDesign.id}`,
        );
      }
    }

    if (error) {
      console.log("save error:", error);
      setSaveMsg("Failed to save");
    } else {
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
    }

    setSaving(false);
  };

  const handleExport = async () => {
    setShowSaveMenu(false);

    // save to Designs table first, same as the Save button does
    await handleSave();

    // then trigger a browser download of the full-res PNG
    const dataUrl = exportImageRef.current?.();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${headline || "design"}.png`;
    link.click();
  };

  useEffect(() => {
    if (!designId) return;

    const loadDesign = async () => {
      const { data, error } = await supabase
        .from("Designs")
        .select("*")
        .eq("id", designId)
        .single();

      if (error || !data) return;

      setDesignTitle(data.title || ""); // ← add this line
      setHeadline(data.canvas_json?.headline || "");
      setSubheading(data.canvas_json?.subheading || "");
      setBodyText(data.canvas_json?.bodyText || "");
      setBgColor(data.canvas_json?.bgColor || "#ffffff");

      loadCanvasRef.current?.(data.canvas_json);
    };

    loadDesign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designId]);

  useEffect(() => {
    if (aiGenerated !== "true") return;
    console.log("1. aiGenerated detected");

    const stored = sessionStorage.getItem("aiDesign");
    console.log("2. stored design:", stored ? "found" : "NOT FOUND");
    if (!stored) return;

    const design = JSON.parse(stored);
    console.log("3. setting pendingAIDesign");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingAIDesign(design);

    const aiImage = sessionStorage.getItem("aiImage");
    setPendingAIImage(aiImage || null);

    sessionStorage.removeItem("aiDesign");
    sessionStorage.removeItem("aiImage");
  }, [aiGenerated]);

  useEffect(() => {
    if (aiGenerated === "true" || designId) return;
    if (!template?.canvasData) return;
    if (loadCanvasRef.current) {
      loadCanvasRef.current(template.canvasData);
    }
  }, [template, aiGenerated, designId, loadCanvasRef]);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* top bar — matches the homepage nav: dark, violet-branded, blurred */}
      <div className="flex items-center h-14 bg-[#181622] border-b border-white/5 px-5 shrink-0">
        <input
          value={designTitle}
          onChange={(e) => setDesignTitle(e.target.value)}
          placeholder="Untitled Design"
          className="text-sm font-semibold text-neutral-200 bg-transparent border border-neutral-500 outline-none placeholder:text-neutral-500 focus:bg-white/5 rounded-md px-2 py-1 -ml-2 transition-colors"
        />

        <div className="relative ml-auto">
          <button
            onClick={() => setShowSaveMenu((prev) => !prev)}
            disabled={saving}
            className="h-9 px-4 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : saveMsg || "Save"}
          </button>

          {showSaveMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-10">
              <button
                onClick={() => {
                  setShowSaveMenu(false);
                  handleSave();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-violet-50 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleExport}
                className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-violet-50 transition-colors"
              >
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* left toolbar — dark like the homepage's editor mock, but not pure black */}
        <div className="w-16 bg-[#181622] border-r border-white/5 flex flex-col items-center py-4 shrink-0">
          <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest mb-2">
            Tools
          </p>
          <div className="flex flex-col gap-1.5">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                    activeTool === tool.id
                      ? "bg-violet-600 text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                  }`}
                  onClick={() =>
                    setActiveTool(activeTool === tool.id ? null : tool.id)
                  }
                >
                  <Icon className="w-5 h-5" />
                </div>
              );
            })}
          </div>

          <div className="mt-auto mb-6 flex flex-col items-center gap-1.5">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  onClick={() => {
                    console.log(`${action.id} clicked`);
                    if (action.id === "undo") undoTriggerRef.current?.();
                    if (action.id === "redo") redoTriggerRef.current?.();
                  }}
                  className="p-2.5 rounded-lg cursor-pointer text-neutral-400 hover:bg-white/5 hover:text-neutral-200 transition-colors"
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              );
            })}

            {selectedObject && (
              <div className="flex flex-col gap-1.5 mt-2 w-full px-2">
                <button
                  onClick={() => {
                    copyRef.current?.();
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="w-full text-center px-1.5 py-2 rounded-lg text-[10px] font-medium text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
                >
                  {copied ? "✓ Copied" : "⎘ Copy"}
                </button>

                <button
                  onClick={() => bringToFrontRef.current?.()}
                  className="w-full text-center px-1.5 py-2 rounded-lg text-[10px] font-medium text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
                >
                  ↑ Front
                </button>
                <button
                  onClick={() => sendToBackRef.current?.()}
                  className="w-full text-center px-1.5 py-2 rounded-lg text-[10px] font-medium text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
                >
                  ↓ Back
                </button>
                <button
                  onClick={() => deleteObjectRef.current?.()}
                  className="w-full text-center px-1.5 py-2 rounded-lg text-[10px] font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  ✕ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* elements panel — kept light so it doesn't compete with the canvas, violet accents throughout */}
        {activeTool === "elements" && (
          <div className="relative w-64 bg-white border-r border-neutral-200 p-4 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                Elements
              </p>
              <button
                onClick={() => setActiveTool(null)}
                className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-1.5 mb-4 flex-wrap">
              {elementTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveElementTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeElementTab === tab.id
                      ? "bg-violet-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeElementTab === "shapes" && (
              <div>
                {!selectedShapeCategory ? (
                  <div className="flex flex-col gap-4">
                    {shapeOptions.map((cat) => (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-neutral-600">
                            {cat.label}
                          </p>
                          <button
                            onClick={() =>
                              setSelectedShapeCategory(cat.category)
                            }
                            className="text-xs text-violet-600 hover:underline"
                          >
                            See all
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {cat.variants.slice(0, 4).map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => addShapeRef.current?.(variant.id)}
                              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-transparent hover:border-violet-300 hover:bg-violet-50 transition-colors"
                            >
                              <ShapePreview variant={variant} />
                              <span className="text-[10px] text-neutral-500">
                                {variant.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setSelectedShapeCategory(null)}
                      className="text-xs text-violet-600 mb-3 flex items-center gap-1 hover:underline"
                    >
                      ← Back
                    </button>
                    <p className="text-xs font-semibold text-neutral-600 mb-3">
                      {
                        shapeOptions.find(
                          (cat) => cat.category === selectedShapeCategory,
                        )?.label
                      }
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {shapeOptions
                        .find((cat) => cat.category === selectedShapeCategory)
                        ?.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => addShapeRef.current?.(variant.id)}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-transparent hover:border-violet-300 hover:bg-violet-50 transition-colors"
                          >
                            <ShapePreview variant={variant} />
                            <span className="text-[10px] text-neutral-500">
                              {variant.label}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeElementTab === "photos" && (
              <div className="flex flex-col items-center justify-center gap-3 mt-6">
                <p className="text-xs text-neutral-400 text-center">
                  Upload a photo from your device
                </p>
                <label className="cursor-pointer px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 transition-colors">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        addImageRef.current?.(ev.target.result);
                      reader.readAsDataURL(file);
                      // reset so same file can be uploaded again
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            )}

            {activeElementTab === "graphics" && (
              <div>
                <div className="flex gap-2 mb-4">
                  {["icons", "graphics"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveGraphicTab(tab)}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                        activeGraphicTab === tab
                          ? "bg-violet-600 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeGraphicTab === "icons" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Search icons & graphics..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-violet-400 transition-colors"
                    />

                    {iconSearchLoading && (
                      <p className="text-xs text-neutral-400 text-center mt-4">
                        Searching...
                      </p>
                    )}

                    {!iconSearchLoading &&
                      iconSearch &&
                      iconResults.length === 0 && (
                        <p className="text-xs text-neutral-400 text-center mt-4">
                          No results
                        </p>
                      )}

                    {!iconSearch && (
                      <div className="mt-4">
                        <p className="text-xs text-neutral-400 mb-2">
                          Try searching for:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestedSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => setIconSearch(term)}
                              className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2">
                      {iconResults.map((iconRef) => (
                        <button
                          key={iconRef}
                          onClick={() => addIconRef.current?.(iconRef)}
                          className="flex items-center justify-center p-2 rounded-lg border border-neutral-200 hover:border-violet-400 hover:bg-violet-50 transition-colors"
                          title={iconRef}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://api.iconify.design/${iconRef.replace(":", "/")}.svg?height=32`}
                            alt={iconRef}
                            className="w-6 h-6"
                            onError={(e) => {
                              e.target.closest("button").style.display = "none";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeGraphicTab === "graphics" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Search graphics..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-violet-400 transition-colors"
                    />

                    {undrawResults.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-neutral-600 mb-2">
                          Graphics
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {undrawResults.map((name) => (
                            <button
                              key={name}
                              onClick={() => addIllustrationRef.current?.(name)}
                              className="flex items-center justify-center p-2 rounded-lg border border-neutral-200 hover:border-violet-400 hover:bg-violet-50 transition-colors"
                              title={name}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/undraw/${name}.svg`}
                                alt={name}
                                className="w-16 h-16"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* canvas stage — soft neutral, not stark white or black, so the design itself stands out */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto">
          <CanvasEditor
            width={customWidth ? Number(customWidth) : template?.width || 800}
            height={
              customHeight ? Number(customHeight) : template?.height || 450
            }
            onSaveSnapshot={saveSnapshotRef}
            onUndo={undoTriggerRef}
            onRedo={redoTriggerRef}
            onBringToFront={bringToFrontRef}
            onSendToBack={sendToBackRef}
            onDeleteObject={deleteObjectRef}
            onAddShape={addShapeRef}
            onSetObjectProp={setObjectPropRef}
            onCommitObjectProp={commitObjectPropRef}
            onAddImage={addImageRef}
            onAddIcon={addIconRef}
            onAddIllustration={addIllustrationRef}
            onSetIllustrationColor={setIllustrationColorRef}
            onApplyCrop={applyCropRef}
            onCopy={copyRef}
            onPaste={pasteRef}
            onGetCanvasData={getCanvasDataRef}
            onLoadCanvas={loadCanvasRef}
            onApplyAIDesign={applyAIDesignRef}
            pendingAIDesign={pendingAIDesign}
            pendingAIImage={pendingAIImage}
            onExportImage={exportImageRef}
            templateData={
              aiGenerated === "true" || designId ? null : template?.canvasData
            }
          />
        </div>

        {/* right properties panel — kept light/neutral, violet as the only accent */}
        {selectedObject ? (
          <div className="w-64 bg-white border-l border-neutral-200 p-4 overflow-y-auto shrink-0">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
              Properties
            </p>

            {!selectedObject.isIllustration &&
              selectedObject.type !== "i-text" &&
              selectedObject.type !== "textbox" && (
                <ColorControl
                  label="Fill Color"
                  value={fillColor}
                  onChange={(val) => {
                    setFillColor(val);
                    setObjectPropRef.current?.("fill", val);
                  }}
                  onCommit={() => commitObjectPropRef.current?.()}
                />
              )}

            {selectedObject.isIllustration && (
              <ColorControl
                label="Graphic Color"
                value={illustrationColor}
                onChange={(val) => {
                  setIllustrationColor(val);
                  setIllustrationColorRef.current?.(val);
                }}
                onCommit={() => commitObjectPropRef.current?.()}
              />
            )}

            {!selectedObject.isIllustration && (
              <ColorControl
                label="Border Color"
                value={strokeColor}
                onChange={(val) => {
                  setStrokeColor(val);
                  setObjectPropRef.current?.("stroke", val);
                }}
                onCommit={() => commitObjectPropRef.current?.()}
              />
            )}

            {!selectedObject.isIllustration && (
              <div className="mb-4">
                <label className="text-xs text-neutral-500 font-medium block mb-1">
                  Border Width: {strokeWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setStrokeWidth(val);
                    setObjectPropRef.current?.("strokeWidth", val);
                  }}
                  onMouseUp={() => commitObjectPropRef.current?.()}
                  className="w-full accent-violet-600"
                />
              </div>
            )}

            {selectedObject.type === "rect" && (
              <div className="mb-4">
                <label className="text-xs text-neutral-500 font-medium block mb-1">
                  Corner Radius: {cornerRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cornerRadius}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCornerRadius(val);
                    setObjectPropRef.current?.("rx", val);
                    setObjectPropRef.current?.("ry", val);
                  }}
                  onMouseUp={() => commitObjectPropRef.current?.()}
                  className="w-full accent-violet-600"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs text-neutral-500 font-medium block mb-1">
                Opacity: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setOpacity(val);
                  setObjectPropRef.current?.("opacity", val);
                }}
                onMouseUp={() => commitObjectPropRef.current?.()}
                className="w-full accent-violet-600"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs text-neutral-500 font-medium block mb-1">
                Rotate: {rotation}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setRotation(val);
                  setObjectPropRef.current?.("angle", val);
                }}
                onMouseUp={() => commitObjectPropRef.current?.()}
                className="w-full accent-violet-600"
              />
            </div>

            {(selectedObject.type === "i-text" ||
              selectedObject.type === "textbox") && (
              <div>
                <ColorControl
                  label="Text Color"
                  value={textColor}
                  onChange={(val) => {
                    setTextColor(val);
                    setObjectPropRef.current?.("fill", val);
                  }}
                  onCommit={() => commitObjectPropRef.current?.()}
                />

                <div className="mt-4 mb-2">
                  <label className="text-xs text-neutral-500 font-medium block mb-1">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="120"
                    value={fontSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFontSize(val);
                      setObjectPropRef.current?.("fontSize", val);
                    }}
                    onMouseUp={() => commitObjectPropRef.current?.()}
                    className="w-full accent-violet-600"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs text-neutral-500 font-medium block mb-1">
                    Font Family
                  </label>
                  <input
                    type="text"
                    placeholder="Search fonts..."
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-2 py-1.5 text-sm mb-1 outline-none focus:border-violet-400 transition-colors"
                  />
                  <div className="max-h-40 overflow-y-auto border border-neutral-200 rounded-lg">
                    {googleFonts
                      .filter((f) =>
                        f.toLowerCase().includes(fontSearch.toLowerCase()),
                      )
                      .map((f) => (
                        <div
                          key={f}
                          onClick={() => handleFontChange(f)}
                          className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-violet-50 transition-colors ${
                            selectedObject?.fontFamily === f
                              ? "bg-violet-100 text-violet-700"
                              : "text-neutral-700"
                          }`}
                          style={{ fontFamily: f }}
                        >
                          {f}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      const val =
                        selectedObject.fontWeight === "bold"
                          ? "normal"
                          : "bold";
                      setObjectPropRef.current?.("fontWeight", val);
                      commitObjectPropRef.current?.();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedObject.fontWeight === "bold"
                        ? "bg-violet-100 border-violet-400 text-violet-700"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => {
                      const val =
                        selectedObject.fontStyle === "italic"
                          ? "normal"
                          : "italic";
                      setObjectPropRef.current?.("fontStyle", val);
                      commitObjectPropRef.current?.();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs italic border transition-colors ${
                      selectedObject.fontStyle === "italic"
                        ? "bg-violet-100 border-violet-400 text-violet-700"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    I
                  </button>
                  <button
                    onClick={() => {
                      const val = selectedObject.underline ? false : true;
                      setObjectPropRef.current?.("underline", val);
                      commitObjectPropRef.current?.();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs underline border transition-colors ${
                      selectedObject.underline
                        ? "bg-violet-100 border-violet-400 text-violet-700"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    U
                  </button>
                </div>

                <div className="flex gap-2 mt-3">
                  {["left", "center", "right"].map((align) => (
                    <button
                      key={align}
                      onClick={() => {
                        setObjectPropRef.current?.("textAlign", align);
                        commitObjectPropRef.current?.();
                      }}
                      className={`px-3 py-1 rounded-lg text-xs border capitalize transition-colors ${
                        selectedObject.textAlign === align
                          ? "bg-violet-100 border-violet-400 text-violet-700"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedObject?.type === "image" && (
              <button
                onClick={() => {
                  const obj = selectedObject;
                  setCropImageData({
                    url: obj._element?.src || obj.getSrc?.(),
                    naturalWidth: obj._element?.naturalWidth || obj.width,
                    naturalHeight: obj._element?.naturalHeight || obj.height,
                  });
                  setShowCropModal(true);
                }}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 mb-4 transition-colors"
              >
                ✂ Crop
              </button>
            )}
          </div>
        ) : (
          <div className="w-64 bg-white border-l border-neutral-200 p-4 overflow-y-auto shrink-0">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
              Properties
            </p>
            <div>
              <label className="text-xs text-neutral-600 font-semibold block mb-1 mt-2">
                Heading
              </label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                onBlur={() => saveSnapshotRef.current?.()}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-500 font-semibold block mb-1 mt-3">
                SubHeading
              </label>
              <input
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                onBlur={() => saveSnapshotRef.current?.()}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 font-medium block mb-1 mt-3">
                Add a little bit of body text
              </label>
              <input
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                onBlur={() => saveSnapshotRef.current?.()}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            <div className="mt-3">
              <ColorControl
                label="Background Color"
                value={bgColor}
                onChange={setBgColor}
                onCommit={() => saveSnapshotRef.current?.()}
              />
            </div>
          </div>
        )}
      </div>

      {showCropModal && cropImageData && (
        <CropModal
          imageUrl={cropImageData.url}
          naturalWidth={cropImageData.naturalWidth}
          naturalHeight={cropImageData.naturalHeight}
          onConfirm={(cropData) => {
            applyCropRef.current?.(cropData);
            setShowCropModal(false);
          }}
          onCancel={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}
