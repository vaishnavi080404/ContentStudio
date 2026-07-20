"use client";
import { useState } from "react";

// fields per template category
const categoryFields = {
  banner: [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      placeholder: "e.g. TechCorp Solutions",
    },
    {
      name: "tagline",
      label: "Tagline",
      type: "text",
      placeholder: "e.g. Building Tomorrow, Today",
    },
    {
      name: "industry",
      label: "Industry",
      type: "select",
      options: [
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Retail",
        "Food & Beverage",
        "Fashion",
        "Real Estate",
        "Other",
      ],
    },
    {
      name: "mood",
      label: "Mood",
      type: "select",
      options: [
        "Professional",
        "Bold",
        "Minimal",
        "Luxurious",
        "Friendly",
        "Energetic",
      ],
    },
    {
      name: "colorPreference",
      label: "Color Preference",
      type: "select",
      options: [
        "AI suggests based on industry",
        "Blue tones (trust/tech)",
        "Green tones (health/nature)",
        "Red tones (energy/food)",
        "Purple tones (luxury/creative)",
        "Orange tones (friendly/retail)",
        "Monochrome (minimal/elegant)",
      ],
    },
    {
      name: "image",
      label: "Logo / Image",
      type: "image",
      placeholder: "Upload your logo or brand image",
    },
  ],
  instagram: [
    {
      name: "brandName",
      label: "Brand Name",
      type: "text",
      placeholder: "e.g. Glow Skincare",
    },
    {
      name: "offer",
      label: "Product / Offer",
      type: "text",
      placeholder: "e.g. 50% off Summer Collection",
    },
    {
      name: "caption",
      label: "Caption",
      type: "text",
      placeholder: "e.g. Summer is here!",
    },
    {
      name: "targetAudience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g. Young women 18-30",
    },
    {
      name: "mood",
      label: "Mood",
      type: "select",
      options: [
        "Vibrant",
        "Minimal",
        "Luxurious",
        "Playful",
        "Bold",
        "Elegant",
      ],
    },
    {
      name: "colorPreference",
      label: "Color Preference",
      type: "select",
      options: [
        "AI suggests based on brand",
        "Warm tones",
        "Cool tones",
        "Pastel",
        "Dark/Moody",
        "Bright/Neon",
        "Monochrome",
      ],
    },
    {
      name: "image",
      label: "Product Image",
      type: "image",
      placeholder: "Upload your product image",
    },
  ],
  poster: [
    {
      name: "brandName",
      label: "Brand / Event Name",
      type: "text",
      placeholder: "e.g. Summer Music Festival",
    },
    {
      name: "offer",
      label: "Key Message",
      type: "text",
      placeholder: "e.g. Live performances every weekend",
    },
    {
      name: "caption",
      label: "Details",
      type: "text",
      placeholder: "e.g. Date, venue, price",
    },
    {
      name: "targetAudience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g. Music lovers",
    },
    {
      name: "mood",
      label: "Mood",
      type: "select",
      options: [
        "Vibrant",
        "Minimal",
        "Luxurious",
        "Playful",
        "Bold",
        "Elegant",
      ],
    },
    {
      name: "colorPreference",
      label: "Color Preference",
      type: "select",
      options: [
        "AI suggests",
        "Warm tones",
        "Cool tones",
        "Pastel",
        "Dark/Moody",
        "Bright/Neon",
        "Monochrome",
      ],
    },
    {
      name: "image",
      label: "Image",
      type: "image",
      placeholder: "Upload an image",
    },
  ],
  "festival card": [
    {
      name: "festivalName",
      label: "Festival / Occasion",
      type: "text",
      placeholder: "e.g. Diwali, Christmas, Birthday",
    },
    {
      name: "senderName",
      label: "From",
      type: "text",
      placeholder: "e.g. The Sharma Family",
    },
    {
      name: "recipientName",
      label: "To",
      type: "text",
      placeholder: "e.g. All our friends & family",
    },
    {
      name: "language",
      label: "Language",
      type: "select",
      options: [
        "English",
        "Hindi",
        "Marathi",
        "Gujarati",
        "Tamil",
        "Telugu",
        "Bengali",
      ],
    },
    {
      name: "mood",
      label: "Mood",
      type: "select",
      options: [
        "Warm & Festive",
        "Traditional",
        "Modern",
        "Minimal",
        "Luxurious",
        "Playful",
      ],
    },
    {
      name: "colorPreference",
      label: "Color Preference",
      type: "select",
      options: [
        "AI suggests based on festival",
        "Warm gold & orange",
        "Red & green",
        "Purple & gold",
        "Blue & white",
        "Pink & yellow",
      ],
    },
    {
      name: "image",
      label: "Photo (optional)",
      type: "image",
      placeholder: "Upload a family/personal photo",
    },
  ],
  invitation: [
    {
      name: "eventName",
      label: "Event Name",
      type: "text",
      placeholder: "e.g. Sarah's Wedding",
    },
    {
      name: "senderName",
      label: "Hosted By",
      type: "text",
      placeholder: "e.g. John & Mary Smith",
    },
    {
      name: "recipientName",
      label: "Guest Name",
      type: "text",
      placeholder: "e.g. The Patel Family",
    },
    {
      name: "language",
      label: "Language",
      type: "select",
      options: [
        "English",
        "Hindi",
        "Marathi",
        "Gujarati",
        "Tamil",
        "Telugu",
        "Bengali",
      ],
    },
    {
      name: "mood",
      label: "Mood",
      type: "select",
      options: [
        "Elegant",
        "Traditional",
        "Modern",
        "Playful",
        "Minimal",
        "Luxurious",
      ],
    },
    {
      name: "colorPreference",
      label: "Color Preference",
      type: "select",
      options: [
        "AI suggests",
        "Warm gold & cream",
        "Royal blue & gold",
        "Pink & rose gold",
        "Red & green",
        "Purple & silver",
        "Monochrome",
      ],
    },
    {
      name: "image",
      label: "Photo (optional)",
      type: "image",
      placeholder: "Upload a photo",
    },
  ],
};

// fallback for any category not explicitly listed above
const defaultFields = [
  {
    name: "title",
    label: "Title / Heading",
    type: "text",
    placeholder: "Main heading for your design",
  },
  {
    name: "subtitle",
    label: "Subtitle",
    type: "text",
    placeholder: "Secondary text",
  },
  {
    name: "mood",
    label: "Mood",
    type: "select",
    options: [
      "Professional",
      "Bold",
      "Minimal",
      "Luxurious",
      "Friendly",
      "Energetic",
    ],
  },
  {
    name: "colorPreference",
    label: "Color Preference",
    type: "select",
    options: [
      "AI suggests",
      "Warm tones",
      "Cool tones",
      "Pastel",
      "Dark/Moody",
      "Monochrome",
    ],
  },
  {
    name: "image",
    label: "Image (optional)",
    type: "image",
    placeholder: "Upload an image",
  },
];

export default function AIGenerateModal({ template, onConfirm, onCancel }) {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // pick fields based on template category
  const fields = categoryFields[template?.category] || defaultFields;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target.result);
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateCategory: template?.category,
          templateId: template?.id,
          canvasWidth: template?.width || 800,
          canvasHeight: template?.height || 450,
          formData: { ...formData },
        }),
      });

      const { design, error: apiError } = await res.json();
      if (apiError) {
        // check if it's a 503 overload
        if (apiError.includes("503") || apiError.includes("high demand")) {
          throw new Error(
            "Gemini is busy right now — please try again in a few seconds",
          );
        }
        throw new Error(apiError);
      }

      // pass design JSON + uploaded image back to parent
      onConfirm({ design, imageDataUrl });
    } catch (err) {
      setError(err.message || "Failed to generate design. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#0d0d14] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-50 mb-1">
            ✨ Generate with AI
          </h2>
          <p className="text-xs text-gray-100 mb-5">
            Fill in your details and AI will create a professional design for
            you
          </p>

          <div className="flex flex-col gap-4">
            {fields.map((field) => {
              if (field.type === "image") {
                return (
                  <div key={field.name}>
                    <label className="text-xs font-medium text-gray-50 block mb-1">
                      {field.label}
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          className="h-full object-contain p-2"
                          alt="preview"
                        />
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-gray-100">
                            {field.placeholder}
                          </p>
                          <p className="text-xs text-violet-500 mt-1">
                            Click to upload
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <label className="text-xs font-medium text-gray-50 block mb-1">
                      {field.label}
                    </label>
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="text-xs font-medium text-gray-50 block mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              );
            })}
          </div>

          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

          <div className="flex gap-2 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg text-sm text-red-600 border border-red-400 hover:bg-red-100"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-sm text-white bg-violet-500 hover:bg-violet-600 disabled:opacity-50"
            >
              {loading ? "✨ Generating..." : "✨ Generate Design"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
