"use client";
import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import templates from "@/lib/template";
import AIGenerateModal from "@/components/editor/AIGenerateModal";
import TemplateThumbnail from "@/components/templates/TemplateThumbnail";
import CustomSizeModal from "@/components/editor/CustomSizeModal";
import { Sparkles } from "lucide-react";

const tabs = [
  { value: "all", label: "All" },
  { value: "banner", label: "Banner" },
  { value: "instagram", label: "Instagram" },
  { value: "festival card", label: "Festival Card" },
  { value: "poster", label: "Poster" },
  { value: "invitation", label: "Invitation Card" },
];

const page = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const filteredTemplates = templates.filter(
    (t) => t.category === activeTab || activeTab === "all",
  );

  const handleAIConfirm = ({ design, imageDataUrl }) => {
    sessionStorage.setItem("aiDesign", JSON.stringify(design));
    if (imageDataUrl) sessionStorage.setItem("aiImage", imageDataUrl);
    window.location.href = `/editor/${selectedTemplate.id}?aiGenerated=true`;
    setShowAIModal(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0d0d14]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* page header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-1">
            ContentStudio
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Templates
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Pick a starting point — or generate one with AI.
          </p>
        </div>

        <div className="px-8 py-6">
          {/* tabs */}
          <div className="flex items-center gap-1.5 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                    : "text-neutral-500 hover:text-neutral-300 bg-white/5 hover:bg-white/8 border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* grid */}
          <div className="grid grid-cols-4 gap-5">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative rounded-2xl overflow-hidden cursor-pointer
                  bg-white/[0.03] border border-white/[0.06]
                  transition-all duration-300
                  hover:-translate-y-1 hover:border-violet-500/40
                  hover:shadow-[0_8px_32px_rgba(124,92,255,0.2)]"
              >
                {/* thumbnail area */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.label}
                      className="w-full h-full object-cover"
                    />
                  ) : template.canvasData ? (
                    <TemplateThumbnail
                      canvasData={template.canvasData}
                      fullWidth={template.width}
                      fullHeight={template.height}
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: template.color }}
                    />
                  )}

                  {/* hover overlay — slides up from bottom */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        if (template.id === "custom") {
                          setSelectedTemplate(template); // you already have this state for the AI modal
                          setShowSizeModal(true);
                        } else {
                          window.location.href = `/editor/${template.id}`;
                        }
                      }}
                      className="px-5 py-2 bg-white text-gray-900 rounded-lg text-xs font-semibold
                        hover:bg-gray-100 transition-colors
                        translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Start from scratch
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                        setShowAIModal(true);
                      }}
                      className="px-5 py-2 bg-violet-600 text-white rounded-lg text-xs font-semibold
                        hover:bg-violet-500 transition-colors flex items-center gap-1.5
                        translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                    >
                      ✨ Generate with AI
                    </button>
                  </div>
                </div>

                {/* card footer */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      {template.label}
                    </p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {template.size}
                    </p>
                  </div>
                  {/* category pill */}
                  <span className="text-[10px] text-violet-400 border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 rounded-full capitalize">
                    {template.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* empty state */}
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-neutral-600 text-sm">
                No templates in this category yet.
              </p>
              <p className="text-neutral-700 text-xs mt-1">
                Try generating one with AI.
              </p>
            </div>
          )}
        </div>
      </div>

      {showAIModal && selectedTemplate && (
        <AIGenerateModal
          template={selectedTemplate}
          onConfirm={handleAIConfirm}
          onCancel={() => setShowAIModal(false)}
        />
      )}

      {showSizeModal && (
        <CustomSizeModal
          onConfirm={({ width, height }) => {
            window.location.href = `/editor/custom?w=${width}&h=${height}`;
          }}
          onCancel={() => setShowSizeModal(false)}
        />
      )}
    </div>
  );
};

export default page;
