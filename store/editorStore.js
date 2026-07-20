import { create } from "zustand";

const useEditorStore = create((set) => ({

    activeTool: "select",
    setActiveTool: (tool) => set({ activeTool: tool }),

    bgColor: "#ffffff",
    setBgColor: (color) => set({ bgColor: color }),

    headline: "",
    setHeadline: (text) => set({ headline: text }),

    subheading: "",
    setSubheading: (text) => set({ subheading: text }),

    bodyText: "",
    setBodyText: (text) => set({ bodyText: text }),

    selectedObject: null,
    setSelectedObject: (object) => set({ selectedObject: object }),


    fillColor: "lightblue",
    setFillColor: (color) => set({ fillColor: color }),

    textColor: "#000000",
    setTextColor: (color) => set({ textColor: color }),

    illustrationColor: "#000000",
    setIllustrationColor: (color) => set({ illustrationColor: color }),

    fontSize: 16,
    setFontSize: (size) => set({ fontSize: size }),

    strokeColor: "#333333",
    setStrokeColor: (color) => set({ strokeColor: color }),

    strokeWidth: 0,
    setStrokeWidth: (width) => set({ strokeWidth: width }),

    cornerRadius: 0,
    setCornerRadius: (radius) => set({ cornerRadius: radius }),

    opacity: 1,
    setOpacity: (opacity) => set({ opacity: opacity }),

    rotation: 0,
    setRotation: (rotation) => set({ rotation: rotation }),

    


}));

export default useEditorStore