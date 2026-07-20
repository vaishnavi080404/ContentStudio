// All SVG paths are normalized to a ~200x200 viewBox for consistency
// Fabric Path takes standard SVG path strings directly

export const shapeOptions = [
  {
    category: "rect",
    label: "Rectangles",
    variants: [
      {
        id: "rect-filled",
        label: "Filled",
        fabricType: "rect",
        props: { width: 200, height: 120, fill: "lightblue" },
      },
      {
        id: "rect-outline",
        label: "Outline",
        fabricType: "rect",
        props: {
          width: 200,
          height: 120,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "rect-rounded",
        label: "Rounded",
        fabricType: "rect",
        props: { width: 200, height: 120, fill: "lightblue", rx: 20, ry: 20 },
      },
      {
        id: "rect-rounded-outline",
        label: "Rounded Outline",
        fabricType: "rect",
        props: {
          width: 200,
          height: 120,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
          rx: 20,
          ry: 20,
        },
      },
      {
        id: "rect-wide",
        label: "Wide",
        fabricType: "rect",
        props: { width: 260, height: 80, fill: "lightblue" },
      },
      {
        id: "rect-tall",
        label: "Tall",
        fabricType: "rect",
        props: { width: 100, height: 200, fill: "lightblue" },
      },
    ],
  },
  {
    category: "square",
    label: "Squares",
    variants: [
      {
        id: "square-filled",
        label: "Filled",
        fabricType: "rect",
        props: { width: 140, height: 140, fill: "lightblue" },
      },
      {
        id: "square-outline",
        label: "Outline",
        fabricType: "rect",
        props: {
          width: 140,
          height: 140,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "square-rounded",
        label: "Rounded",
        fabricType: "rect",
        props: { width: 140, height: 140, fill: "lightblue", rx: 20, ry: 20 },
      },
      {
        id: "square-rounded-outline",
        label: "Rounded Outline",
        fabricType: "rect",
        props: {
          width: 140,
          height: 140,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
          rx: 20,
          ry: 20,
        },
      },
      {
        id: "square-pill",
        label: "Pill",
        fabricType: "rect",
        props: { width: 140, height: 140, fill: "lightblue", rx: 70, ry: 70 },
      },
      {
        id: "square-pill-outline",
        label: "Pill Outline",
        fabricType: "rect",
        props: {
          width: 140,
          height: 140,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
          rx: 70,
          ry: 70,
        },
      },
    ],
  },
  {
    category: "circle",
    label: "Circles",
    variants: [
      {
        id: "circle-filled",
        label: "Filled",
        fabricType: "circle",
        props: { radius: 60, fill: "lightblue" },
      },
      {
        id: "circle-outline",
        label: "Outline",
        fabricType: "circle",
        props: {
          radius: 60,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "circle-small",
        label: "Small",
        fabricType: "circle",
        props: { radius: 35, fill: "lightblue" },
      },
      {
        id: "circle-small-outline",
        label: "Small Outline",
        fabricType: "circle",
        props: {
          radius: 35,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "ellipse-wide",
        label: "Ellipse Wide",
        fabricType: "ellipse",
        props: { rx: 80, ry: 45, fill: "lightblue" },
      },
      {
        id: "ellipse-tall",
        label: "Ellipse Tall",
        fabricType: "ellipse",
        props: { rx: 45, ry: 80, fill: "lightblue" },
      },
    ],
  },
  {
    category: "triangle",
    label: "Triangles",
    variants: [
      {
        id: "triangle-filled",
        label: "Filled",
        fabricType: "triangle",
        props: { width: 180, height: 160, fill: "lightblue" },
      },
      {
        id: "triangle-outline",
        label: "Outline",
        fabricType: "triangle",
        props: {
          width: 180,
          height: 160,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "triangle-right",
        label: "Right",
        fabricType: "path",
        props: { path: "M 0 160 L 180 160 L 0 0 Z", fill: "lightblue" },
      },
      {
        id: "triangle-right-outline",
        label: "Right Outline",
        fabricType: "path",
        props: {
          path: "M 0 160 L 180 160 L 0 0 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "triangle-down",
        label: "Down",
        fabricType: "path",
        props: { path: "M 0 0 L 180 0 L 90 160 Z", fill: "lightblue" },
      },
      {
        id: "triangle-down-outline",
        label: "Down Outline",
        fabricType: "path",
        props: {
          path: "M 0 0 L 180 0 L 90 160 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
    ],
  },
  {
    category: "polygon",
    label: "Polygons",
    variants: [
      {
        id: "pentagon",
        label: "Pentagon",
        fabricType: "path",
        props: {
          path: "M 100 0 L 195 69 L 159 180 L 41 180 L 5 69 Z",
          fill: "lightblue",
        },
      },
      {
        id: "pentagon-outline",
        label: "Pentagon Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 195 69 L 159 180 L 41 180 L 5 69 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "hexagon",
        label: "Hexagon",
        fabricType: "path",
        props: {
          path: "M 50 0 L 150 0 L 200 87 L 150 174 L 50 174 L 0 87 Z",
          fill: "lightblue",
        },
      },
      {
        id: "hexagon-outline",
        label: "Hexagon Outline",
        fabricType: "path",
        props: {
          path: "M 50 0 L 150 0 L 200 87 L 150 174 L 50 174 L 0 87 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "octagon",
        label: "Octagon",
        fabricType: "path",
        props: {
          path: "M 60 0 L 140 0 L 200 60 L 200 140 L 140 200 L 60 200 L 0 140 L 0 60 Z",
          fill: "lightblue",
        },
      },
      {
        id: "octagon-outline",
        label: "Octagon Outline",
        fabricType: "path",
        props: {
          path: "M 60 0 L 140 0 L 200 60 L 200 140 L 140 200 L 60 200 L 0 140 L 0 60 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "diamond",
        label: "Diamond",
        fabricType: "path",
        props: {
          path: "M 100 0 L 200 100 L 100 200 L 0 100 Z",
          fill: "lightblue",
        },
      },
      {
        id: "diamond-outline",
        label: "Diamond Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 200 100 L 100 200 L 0 100 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
    ],
  },
  {
    category: "star",
    label: "Stars",
    variants: [
      {
        id: "star-4",
        label: "4 Point",
        fabricType: "path",
        props: {
          path: "M 100 0 L 120 80 L 200 100 L 120 120 L 100 200 L 80 120 L 0 100 L 80 80 Z",
          fill: "lightblue",
        },
      },
      {
        id: "star-4-outline",
        label: "4 Point Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 120 80 L 200 100 L 120 120 L 100 200 L 80 120 L 0 100 L 80 80 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "star-5",
        label: "5 Point",
        fabricType: "path",
        props: {
          path: "M 100 0 L 123 74 L 200 74 L 138 120 L 162 194 L 100 150 L 38 194 L 62 120 L 0 74 L 77 74 Z",
          fill: "lightblue",
        },
      },
      {
        id: "star-5-outline",
        label: "5 Point Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 123 74 L 200 74 L 138 120 L 162 194 L 100 150 L 38 194 L 62 120 L 0 74 L 77 74 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "star-6",
        label: "6 Point",
        fabricType: "path",
        props: {
          path: "M 100 0 L 115 60 L 173 27 L 140 85 L 200 100 L 140 115 L 173 173 L 115 140 L 100 200 L 85 140 L 27 173 L 60 115 L 0 100 L 60 85 L 27 27 L 85 60 Z",
          fill: "lightblue",
        },
      },
      {
        id: "star-6-outline",
        label: "6 Point Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 115 60 L 173 27 L 140 85 L 200 100 L 140 115 L 173 173 L 115 140 L 100 200 L 85 140 L 27 173 L 60 115 L 0 100 L 60 85 L 27 27 L 85 60 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "star-8",
        label: "8 Point",
        fabricType: "path",
        props: {
          path: "M 100 0 L 112 55 L 150 15 L 130 65 L 185 50 L 145 90 L 200 100 L 145 110 L 185 150 L 130 135 L 150 185 L 112 145 L 100 200 L 88 145 L 50 185 L 70 135 L 15 150 L 55 110 L 0 100 L 55 90 L 15 50 L 70 65 L 50 15 L 88 55 Z",
          fill: "lightblue",
        },
      },
      {
        id: "star-8-outline",
        label: "8 Point Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 112 55 L 150 15 L 130 65 L 185 50 L 145 90 L 200 100 L 145 110 L 185 150 L 130 135 L 150 185 L 112 145 L 100 200 L 88 145 L 50 185 L 70 135 L 15 150 L 55 110 L 0 100 L 55 90 L 15 50 L 70 65 L 50 15 L 88 55 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
    ],
  },
  {
    category: "arrow",
    label: "Arrows",
    variants: [
      {
        id: "arrow-right",
        label: "Right",
        fabricType: "path",
        props: {
          path: "M 0 70 L 120 70 L 120 30 L 200 100 L 120 170 L 120 130 L 0 130 Z",
          fill: "lightblue",
        },
      },
      {
        id: "arrow-right-outline",
        label: "Right Outline",
        fabricType: "path",
        props: {
          path: "M 0 70 L 120 70 L 120 30 L 200 100 L 120 170 L 120 130 L 0 130 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "arrow-left",
        label: "Left",
        fabricType: "path",
        props: {
          path: "M 200 70 L 80 70 L 80 30 L 0 100 L 80 170 L 80 130 L 200 130 Z",
          fill: "lightblue",
        },
      },
      {
        id: "arrow-left-outline",
        label: "Left Outline",
        fabricType: "path",
        props: {
          path: "M 200 70 L 80 70 L 80 30 L 0 100 L 80 170 L 80 130 L 200 130 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "arrow-up",
        label: "Up",
        fabricType: "path",
        props: {
          path: "M 70 200 L 70 80 L 30 80 L 100 0 L 170 80 L 130 80 L 130 200 Z",
          fill: "lightblue",
        },
      },
      {
        id: "arrow-up-outline",
        label: "Up Outline",
        fabricType: "path",
        props: {
          path: "M 70 200 L 70 80 L 30 80 L 100 0 L 170 80 L 130 80 L 130 200 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "arrow-down",
        label: "Down",
        fabricType: "path",
        props: {
          path: "M 70 0 L 70 120 L 30 120 L 100 200 L 170 120 L 130 120 L 130 0 Z",
          fill: "lightblue",
        },
      },
      {
        id: "arrow-down-outline",
        label: "Down Outline",
        fabricType: "path",
        props: {
          path: "M 70 0 L 70 120 L 30 120 L 100 200 L 170 120 L 130 120 L 130 0 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "arrow-double",
        label: "Double",
        fabricType: "path",
        props: {
          path: "M 0 100 L 60 40 L 60 75 L 140 75 L 140 40 L 200 100 L 140 160 L 140 125 L 60 125 L 60 160 Z",
          fill: "lightblue",
        },
      },
      {
        id: "arrow-double-outline",
        label: "Double Outline",
        fabricType: "path",
        props: {
          path: "M 0 100 L 60 40 L 60 75 L 140 75 L 140 40 L 200 100 L 140 160 L 140 125 L 60 125 L 60 160 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
    ],
  },
  {
    category: "heart",
    label: "Hearts",
    variants: [
      {
        id: "heart-filled",
        label: "Filled",
        fabricType: "path",
        props: {
          path: "M 100 170 C 60 140 0 110 0 60 C 0 20 30 0 60 0 C 80 0 95 10 100 20 C 105 10 120 0 140 0 C 170 0 200 20 200 60 C 200 110 140 140 100 170 Z",
          fill: "#ff6b8a",
        },
      },
      {
        id: "heart-outline",
        label: "Outline",
        fabricType: "path",
        props: {
          path: "M 100 170 C 60 140 0 110 0 60 C 0 20 30 0 60 0 C 80 0 95 10 100 20 C 105 10 120 0 140 0 C 170 0 200 20 200 60 C 200 110 140 140 100 170 Z",
          fill: "transparent",
          stroke: "#ff6b8a",
          strokeWidth: 2,
        },
      },
      {
        id: "heart-small",
        label: "Small",
        fabricType: "path",
        props: {
          path: "M 100 170 C 60 140 0 110 0 60 C 0 20 30 0 60 0 C 80 0 95 10 100 20 C 105 10 120 0 140 0 C 170 0 200 20 200 60 C 200 110 140 140 100 170 Z",
          fill: "#ff6b8a",
          scaleX: 0.6,
          scaleY: 0.6,
        },
      },
      {
        id: "heart-blue",
        label: "Blue",
        fabricType: "path",
        props: {
          path: "M 100 170 C 60 140 0 110 0 60 C 0 20 30 0 60 0 C 80 0 95 10 100 20 C 105 10 120 0 140 0 C 170 0 200 20 200 60 C 200 110 140 140 100 170 Z",
          fill: "#6bb5ff",
        },
      },
    ],
  },
  {
    category: "banner",
    label: "Banners",
    variants: [
      {
        id: "banner-ribbon",
        label: "Ribbon",
        fabricType: "path",
        props: {
          path: "M 0 40 L 160 40 L 200 80 L 160 120 L 0 120 L 30 80 Z",
          fill: "lightblue",
        },
      },
      {
        id: "banner-ribbon-outline",
        label: "Ribbon Outline",
        fabricType: "path",
        props: {
          path: "M 0 40 L 160 40 L 200 80 L 160 120 L 0 120 L 30 80 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "banner-double-ribbon",
        label: "Double Ribbon",
        fabricType: "path",
        props: {
          path: "M 0 40 L 170 40 L 200 80 L 170 120 L 0 120 L 30 80 Z",
          fill: "lightblue",
        },
      },
      {
        id: "banner-flag",
        label: "Flag",
        fabricType: "path",
        props: {
          path: "M 0 0 L 200 0 L 200 140 L 100 100 L 0 140 Z",
          fill: "lightblue",
        },
      },
      {
        id: "banner-flag-outline",
        label: "Flag Outline",
        fabricType: "path",
        props: {
          path: "M 0 0 L 200 0 L 200 140 L 100 100 L 0 140 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "banner-scroll",
        label: "Scroll",
        fabricType: "path",
        props: {
          path: "M 20 0 L 180 0 Q 200 0 200 20 L 200 140 Q 200 160 180 160 L 20 160 Q 0 160 0 140 L 0 20 Q 0 0 20 0 Z",
          fill: "lightblue",
        },
      },
    ],
  },
  {
    category: "speech",
    label: "Speech Bubbles",
    variants: [
      {
        id: "speech-rect",
        label: "Rectangle",
        fabricType: "path",
        props: {
          path: "M 0 0 L 200 0 L 200 140 L 120 140 L 100 170 L 80 140 L 0 140 Z",
          fill: "lightblue",
        },
      },
      {
        id: "speech-rect-outline",
        label: "Rect Outline",
        fabricType: "path",
        props: {
          path: "M 0 0 L 200 0 L 200 140 L 120 140 L 100 170 L 80 140 L 0 140 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "speech-rounded",
        label: "Rounded",
        fabricType: "path",
        props: {
          path: "M 20 0 Q 0 0 0 20 L 0 120 Q 0 140 20 140 L 80 140 L 100 170 L 120 140 L 180 140 Q 200 140 200 120 L 200 20 Q 200 0 180 0 Z",
          fill: "lightblue",
        },
      },
      {
        id: "speech-rounded-outline",
        label: "Rounded Outline",
        fabricType: "path",
        props: {
          path: "M 20 0 Q 0 0 0 20 L 0 120 Q 0 140 20 140 L 80 140 L 100 170 L 120 140 L 180 140 Q 200 140 200 120 L 200 20 Q 200 0 180 0 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "speech-left",
        label: "Tail Left",
        fabricType: "path",
        props: {
          path: "M 0 0 L 200 0 L 200 140 L 40 140 L 0 170 L 20 140 L 0 140 Z",
          fill: "lightblue",
        },
      },
      {
        id: "speech-right",
        label: "Tail Right",
        fabricType: "path",
        props: {
          path: "M 0 0 L 200 0 L 200 140 L 180 140 L 200 170 L 160 140 L 0 140 Z",
          fill: "lightblue",
        },
      },
      {
        id: "speech-thought",
        label: "Thought",
        fabricType: "path",
        props: {
          path: "M 100 10 C 40 10 0 45 0 85 C 0 125 40 150 100 150 C 160 150 200 125 200 85 C 200 45 160 10 100 10 Z M 80 160 C 80 155 85 155 85 160 C 85 165 75 168 75 172 C 75 175 80 175 80 178 C 80 182 70 182 70 178",
          fill: "lightblue",
        },
      },
      {
        id: "speech-shout",
        label: "Shout",
        fabricType: "path",
        props: {
          path: "M 100 0 L 130 60 L 200 40 L 160 100 L 200 130 L 130 120 L 120 180 L 90 120 L 20 140 L 60 90 L 0 60 L 70 70 Z",
          fill: "lightblue",
        },
      },
    ],
  },
  {
    category: "flowchart",
    label: "Flowchart",
    variants: [
      {
        id: "flow-process",
        label: "Process",
        fabricType: "rect",
        props: { width: 200, height: 100, fill: "lightblue" },
      },
      {
        id: "flow-process-outline",
        label: "Process Outline",
        fabricType: "rect",
        props: {
          width: 200,
          height: 100,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "flow-decision",
        label: "Decision",
        fabricType: "path",
        props: {
          path: "M 100 0 L 200 80 L 100 160 L 0 80 Z",
          fill: "lightblue",
        },
      },
      {
        id: "flow-decision-outline",
        label: "Decision Outline",
        fabricType: "path",
        props: {
          path: "M 100 0 L 200 80 L 100 160 L 0 80 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "flow-terminal",
        label: "Terminal",
        fabricType: "rect",
        props: { width: 200, height: 100, fill: "lightblue", rx: 50, ry: 50 },
      },
      {
        id: "flow-terminal-outline",
        label: "Terminal Outline",
        fabricType: "rect",
        props: {
          width: 200,
          height: 100,
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
          rx: 50,
          ry: 50,
        },
      },
      {
        id: "flow-data",
        label: "Data",
        fabricType: "path",
        props: {
          path: "M 30 0 L 200 0 L 170 100 L 0 100 Z",
          fill: "lightblue",
        },
      },
      {
        id: "flow-data-outline",
        label: "Data Outline",
        fabricType: "path",
        props: {
          path: "M 30 0 L 200 0 L 170 100 L 0 100 Z",
          fill: "transparent",
          stroke: "#333",
          strokeWidth: 2,
        },
      },
      {
        id: "flow-manual",
        label: "Manual Input",
        fabricType: "path",
        props: {
          path: "M 0 40 L 200 0 L 200 120 L 0 120 Z",
          fill: "lightblue",
        },
      },
      {
        id: "flow-delay",
        label: "Delay",
        fabricType: "path",
        props: {
          path: "M 0 0 L 150 0 Q 200 0 200 60 Q 200 120 150 120 L 0 120 Z",
          fill: "lightblue",
        },
      },
    ],
  },
];
