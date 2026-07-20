"use client";
import { useEffect, useRef } from "react";
import { shapeOptions } from "@/lib/shapeOptions";
import useEditorStore from "@/store/editorStore";
import { toFabricGradient } from "@/lib/gradientUtils";

const CanvasEditor = ({
  width = 800,
  height = 450,
  onSaveSnapshot,
  onUndo,
  onRedo,
  onBringToFront,
  onSendToBack,
  onDeleteObject,
  onAddShape,
  onSetObjectProp,
  onCommitObjectProp,
  onAddImage,
  onAddIcon,
  onAddIllustration,
  onSetIllustrationColor,
  onApplyCrop,
  onCopy,
  onPaste,
  onGetCanvasData,
  onLoadCanvas,
  onApplyAIDesign,
  pendingAIImage,
  pendingAIDesign,
  onExportImage,
  templateData,
}) => {
  const headline = useEditorStore((state) => state.headline);
  const subheading = useEditorStore((state) => state.subheading);
  const bodyText = useEditorStore((state) => state.bodyText);
  const bgColor = useEditorStore((state) => state.bgColor);
  const activeTool = useEditorStore((state) => state.activeTool);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const activeToolRef = useRef(activeTool);
  const bgColorRef = useRef(bgColor);
  const clipboardRef = useRef(null);
  const copyRef = useRef(null);
  const pasteRef = useRef(null);

  // undo/redo stack - stores full canvas snapshots
  const historyRef = useRef([]);
  const historyIdxRef = useRef(-1);
  const lastJSONRef = useRef(null);
  const isRestoringRef = useRef(false);

  const commitRef = useRef(null);
  const undoRef = useRef(null);
  const redoRef = useRef(null);

  const isChangingPropRef = useRef(false);

  const gradientClassRef = useRef(null);
  const textboxClassRef = useRef(null);

  const applyAIDesignRef = useRef(null);

  const pendingAIDesignRef = useRef(null);
  const pendingAIImageRef = useRef(null);

  const templateLoadedRef = useRef(false);

  useEffect(() => {
    import("fabric").then(
      ({
        Canvas,
        Textbox,
        Rect,
        Circle,
        Triangle,
        Ellipse,
        Path,
        FabricImage,
        Group,
        Gradient,
        loadSVGFromString,
      }) => {
        if (fabricRef.current) return; // avoid double init on multiple reload

        gradientClassRef.current = Gradient;

        textboxClassRef.current = Textbox;

        const canvas = new Canvas(canvasRef.current, {
          //initial look of the canvas
          width,
          height,
          backgroundColor: bgColor || "#ffffff",
        });
        fabricRef.current = canvas;

        if (templateData && templateData.objects) {
  isRestoringRef.current = true;
  canvas.loadFromJSON(templateData).then(() => {
    canvas.getObjects().forEach((obj) => obj.setCoords());
    const bg = canvas.getObjects().find(o => o.type === "Rect" && o.width === 800);
    if (bg) canvas.sendObjectToBack(bg);
    canvas.renderAll();
    setTimeout(() => {
      canvas.requestRenderAll();
      isRestoringRef.current = false;
    }, 200);

    templateLoadedRef.current = true; // ADD THIS — stops the second effect re-loading it

    historyRef.current = [{ 
      canvasJSON: templateData, 
      bg: canvas.backgroundColor || bgColorRef.current 
    }];
    historyIdxRef.current = 0;
    lastJSONRef.current = JSON.stringify(canvas.toJSON(["name"]));
  });
}

        // diff-based commit - only push to history if canvas state actually
        // changed since last commit. covers text edits, drags, color changes,
        // new shapes - basically everything, without needing a separate
        // event handler for each case
        const commit = () => {
          if (isRestoringRef.current) return;

          const json = JSON.stringify(canvas.toJSON(["name"]));
          if (json === lastJSONRef.current) return; // nothing changed, skip

          // wipe redo branch if we commit after an undo
          historyRef.current = historyRef.current.slice(
            0,
            historyIdxRef.current + 1,
          );
          historyRef.current.push({
            canvasJSON: JSON.parse(json),
            bg: bgColorRef.current,
          });
          historyIdxRef.current = historyRef.current.length - 1;
          lastJSONRef.current = json;
        };

        commitRef.current = commit;
        if (onSaveSnapshot) onSaveSnapshot.current = commit;

        const restore = (idx) => {
          isRestoringRef.current = true;
          const { canvasJSON, bg } = historyRef.current[idx];

          canvas.loadFromJSON(canvasJSON).then(() => {
            canvas.backgroundColor = bg;
            bgColorRef.current = bg;
            historyIdxRef.current = idx;
            lastJSONRef.current = JSON.stringify(canvasJSON);
            canvas.requestRenderAll();
            isRestoringRef.current = false;
          });
        };

        const undo = () => {
          commit(); // flush any pending edit as its own step first
          if (historyIdxRef.current <= 0) return;
          restore(historyIdxRef.current - 1);
        };

        const redo = () => {
          commit();
          if (historyIdxRef.current >= historyRef.current.length - 1) return;
          restore(historyIdxRef.current + 1);
        };

        undoRef.current = undo; //gives access to undo/redo functions to CanvasEditor itself for keyboard shortcuts (ie inside this function itself)
        redoRef.current = redo;

        if (onUndo) onUndo.current = undo; //gives access to undo/redo functions to parent
        if (onRedo) onRedo.current = redo;

        const copy = () => {
          const obj = canvas.getActiveObject();
          if (!obj) return;
          // clone preserves all properties — fill, stroke, font, everything
          obj.clone().then((cloned) => {
            clipboardRef.current = cloned;
          });
        };

        const paste = () => {
          if (!clipboardRef.current) return;
          clipboardRef.current.clone().then((cloned) => {
            // offset so paste doesn't land exactly on top of the original
            cloned.set({
              left: clipboardRef.current.left + 20,
              top: clipboardRef.current.top + 20,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
            commit();
            // update clipboard to the new clone so repeated pastes keep offsetting
            clipboardRef.current = cloned;
          });
        };

        copyRef.current = copy;
        pasteRef.current = paste;
        if (onCopy) onCopy.current = copy;
        if (onPaste) onPaste.current = paste;

        canvas.on("mouse:down", (e) => {
          commit(); // saves any text edit that just finished from the click

          if (e.target) return; // clicked an existing object, nothing to add

          const pos = e.scenePoint;
          const tool = activeToolRef.current;

          if (tool === "text") {
            canvas.add(
              new Textbox("New text", {
                left: pos.x,
                top: pos.y,
                fontSize: 16,
              }),
            );
            canvas.renderAll();
            commit();
          }
        });

        // covers dragging/resizing objects
        canvas.on("mouse:up", () => commit());

        // covers in-place text editing on canvas (double-click an Textbox).
        // rAF lets fabric finish its layout pass before we diff the json (Wait one browser frame let Fabric finish updating the textbox, then save the state to undo history)
        canvas.on("text:changed", () => {
          requestAnimationFrame(() => commit());
        });

        // only report selection changes, not property updates
        canvas.on("selection:created", (e) => {
          if (isRestoringRef.current) return;
          console.log(e.selected[0]);
          console.log(e.selected[0].type);
          setSelectedObject(e.selected[0]);
        });
        canvas.on("selection:updated", (e) => {
          if (isRestoringRef.current) return;
          if (isChangingPropRef.current) return; // property change fired this, not a real selection switch
          setSelectedObject(e.selected[0]);
        });
        canvas.on("selection:cleared", () => {
          if (isRestoringRef.current) return;
          setSelectedObject(null);
        });

        const bringToFront = () => {
          const obj = canvas.getActiveObject();
          if (!obj) return;
          canvas.bringObjectToFront(obj);
          canvas.renderAll();
          commit();
        };

        const sendToBack = () => {
          const obj = canvas.getActiveObject();
          if (!obj) return;
          canvas.sendObjectToBack(obj);
          canvas.renderAll();
          commit();
        };

        const deleteObject = () => {
          const obj = canvas.getActiveObject();
          if (!obj) return;
          canvas.remove(obj);
          canvas.renderAll();
          commit();
        };

        const addShape = (variantId) => {
          let foundVariant = null;
          let foundCategory = null;

          for (const cat of shapeOptions) {
            for (const v of cat.variants) {
              if (v.id === variantId) {
                foundVariant = v;
                foundCategory = cat.category;
                break;
              }
            }
            if (foundVariant) break;
          }

          if (!foundVariant) return;

          const { fabricType, props } = foundVariant;
          let shape;

          if (fabricType === "path") {
            // Path takes the path string as first arg, rest of props as second
            const { path, ...rest } = props;
            shape = new Path(path, { ...rest, left: 150, top: 150 });
          } else {
            const shapeClasses = {
              rect: Rect,
              circle: Circle,
              triangle: Triangle,
              ellipse: Ellipse,
            };
            const ShapeClass = shapeClasses[fabricType];
            if (!ShapeClass) return;
            shape = new ShapeClass({ ...props, left: 150, top: 150 });
          }

          canvas.add(shape);
          canvas.renderAll();
          commit();
        };

        if (onAddShape) onAddShape.current = addShape; //parent component can call this

        const addImage = (dataURL) => {
            FabricImage.fromURL(dataURL, { crossOrigin: "anonymous" }).then((img) => {
            // scale down if too large for canvas
            const maxW = width * 0.8;
            const maxH = height * 0.8;
            const scale = Math.min(maxW / img.width, maxH / img.height, 1);
            img.scale(scale);
            img.set({ left: 100, top: 100 });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            commit();
          });
        };

        if (onAddImage) onAddImage.current = addImage;

        const addIcon = async (iconRef) => {
          // iconRef is "prefix:name", e.g. "fluent-emoji-flat:party-popper"
          const [prefix, name] = iconRef.split(":");
          const url = `https://api.iconify.design/${prefix}/${name}.svg?height=128`;
          // no color param here - every prefix we search (see COLORFUL_PREFIXES
          // in EditorPage) has a hardcoded multi-color palette baked into the
          // svg itself, so color is meaningless for these and iconify ignores it

          const res = await fetch(url);
          if (!res.ok) return;
          const svgText = await res.text();

          const blob = new Blob([svgText], { type: "image/svg+xml" });
          const blobUrl = URL.createObjectURL(blob);

          const imgEl = new Image();
          imgEl.onload = () => {
            const fabricImg = new FabricImage(imgEl);
            const srcSize = Math.max(fabricImg.width, fabricImg.height);
            const targetSize = width * 0.15;
            const scale = targetSize / srcSize;

            fabricImg.scale(scale);
            fabricImg.set({
              left: width / 2 - (fabricImg.width * scale) / 2,
              top: height / 2 - (fabricImg.height * scale) / 2,
            });
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            URL.revokeObjectURL(blobUrl);
            commit();
          };
          imgEl.onerror = () => console.log("failed to load icon:", iconRef);
          imgEl.src = blobUrl;
        };

        if (onAddIcon) onAddIcon.current = addIcon;

        const addIllustration = async (name) => {
          const res = await fetch(`/undraw/${name}.svg`);
          let svgText = await res.text();

          const PLACEHOLDER = "#6D28D9";
          svgText = svgText.replaceAll("var(--primary-svg-color)", PLACEHOLDER);

          const { objects } = await loadSVGFromString(svgText);
          const validObjects = objects.filter(Boolean);

          // tag the paths that were actually using the customizable color,
          // so later we know which ones to recolor and which to leave alone
          validObjects.forEach((obj) => {
            if (obj.fill === PLACEHOLDER) obj.isPrimaryFill = true;
          });
          console.log(validObjects.map((o) => o.fill));

          const group = new Group(validObjects);
          group.isIllustration = true; // marks this group as a recolorable illustration

          const targetWidth = width * 0.4;
          const scale = targetWidth / group.width;
          group.scale(scale);
          group.set({ left: 100, top: 80 });

          canvas.add(group);
          canvas.setActiveObject(group);
          canvas.renderAll();
          commit();
        };

        if (onAddIllustration) onAddIllustration.current = addIllustration;
        const setIllustrationColor = (color) => {
          const obj = canvas.getActiveObject();
          if (!obj || !obj.isIllustration) return;

          isChangingPropRef.current = true; // stop selection:updated from re-firing selection change

          obj.getObjects().forEach((child) => {
            if (child.isPrimaryFill) child.set("fill", color);
          });

          canvas.requestRenderAll();

          setTimeout(() => {
            isChangingPropRef.current = false;
          }, 0);
        };

        if (onSetIllustrationColor)
          onSetIllustrationColor.current = setIllustrationColor;

        const applyCrop = ({ cropX, cropY, cropW, cropH }) => {
          const obj = canvas.getActiveObject();
          if (!obj || obj.type !== "image") return;
          obj.set({
            cropX,
            cropY,
            width: cropW,
            height: cropH,
          });
          canvas.requestRenderAll();
          commit();
        };

        if (onApplyCrop) onApplyCrop.current = applyCrop;
        if (onBringToFront) onBringToFront.current = bringToFront;
        if (onSendToBack) onSendToBack.current = sendToBack;
        if (onDeleteObject) onDeleteObject.current = deleteObject;

        const setObjectProp = (key, value) => {
          const obj = canvas.getActiveObject();
          if (!obj) return;
          isChangingPropRef.current = true;

          const isGradientShape =
            value && typeof value === "object" && value.type === "linear"; //check that value exists, is an object, and has type: 'linear'. If all three are true, then this value represents a linear gradient
          obj.set(
            key,
            isGradientShape ? toFabricGradient(value, obj, Gradient) : value,
          );

          const textLayoutProps = [
            "textAlign",
            "fontSize",
            "fontWeight",
            "fontStyle",
            "underline",
            "fontFamily",
          ];
          if (textLayoutProps.includes(key)) {
            if (key === "textAlign" && obj.type === "i-text")
              obj.set("width", obj.width || 300);
            obj.initDimensions?.();
            obj.setCoords();
          }

          canvas.requestRenderAll();
          setTimeout(() => {
            isChangingPropRef.current = false;
          }, 0);
        };

        const commitObjectProp = () => {
          commit();
        };

        if (onSetObjectProp) onSetObjectProp.current = setObjectProp;
        if (onCommitObjectProp) onCommitObjectProp.current = commitObjectProp;

        const getCanvasData = () => {
          const json = canvas.toJSON(["name"]);
          const thumbnail = canvas.toDataURL({
            format: "png",
            multiplier: 0.3,
          });
          return { json, thumbnail };
        };

        if (onGetCanvasData) onGetCanvasData.current = getCanvasData;

      const exportImage = () => {
  try {
    return canvas.toDataURL({ format: "png", multiplier: 2 });
  } catch (err) {
    console.log("export blocked (tainted canvas):", err.message);
    return null;
  }
};

        if (onExportImage) onExportImage.current = exportImage;

        // const loadCanvas = (canvasJSON) => {
        //   if (!canvasJSON) return;
        //   isRestoringRef.current = true;
        //   canvas.loadFromJSON(canvasJSON).then(() => {
        //     canvas.backgroundColor = bgColorRef.current;
        //     canvas.requestRenderAll();
        //     lastJSONRef.current = JSON.stringify(canvas.toJSON(["name"]));
        //     historyRef.current = [{ canvasJSON, bg: bgColorRef.current }];
        //     historyIdxRef.current = 0;
        //     isRestoringRef.current = false;
        //   });
        // };

        
const loadCanvas = (canvasJSON) => {
          if (!canvasJSON) return;
          isRestoringRef.current = true;
          canvas.loadFromJSON(canvasJSON).then(() => {
            canvas.backgroundColor = bgColorRef.current;
            canvas.requestRenderAll();
            lastJSONRef.current = JSON.stringify(canvas.toJSON(["name"]));
            historyRef.current = [{ canvasJSON, bg: bgColorRef.current }];
            historyIdxRef.current = 0;
            isRestoringRef.current = false;
          });
        };

        if (onLoadCanvas) onLoadCanvas.current = loadCanvas;

        const applyAIDesign = (design, imageDataUrl) => {
          console.log("4. applyAIDesign called");
          if (!design) {
            console.log("4a. design is null, returning");
            return;
          }

          // clear existing canvas first
          canvas.clear();

          // set background
          canvas.backgroundColor = design.bgColor || "#ffffff";
          bgColorRef.current = design.bgColor || "#ffffff";

          // headline
          if (design.headline) {
            const h = design.headline;
            canvas.add(
              new Textbox(h.text, {
                left: h.left,
                top: h.top,
                width: h.width,
                fontSize: h.fontSize,
                fontFamily: h.fontFamily,
                fill: h.color,
                textAlign: h.textAlign,
                fontWeight: h.fontWeight || "normal",
                name: "headline",
              }),
            );
          }

          // subheading
          if (design.subheading) {
            const s = design.subheading;
            canvas.add(
              new Textbox(s.text, {
                left: s.left,
                top: s.top,
                width: s.width,
                fontSize: s.fontSize,
                fontFamily: s.fontFamily,
                fill: s.color,
                textAlign: s.textAlign,
                name: "subheading",
              }),
            );
          }

          // body text
          if (design.bodyText) {
            const b = design.bodyText;
            canvas.add(
              new Textbox(b.text, {
                left: b.left,
                top: b.top,
                width: b.width,
                fontSize: b.fontSize,
                fontFamily: b.fontFamily,
                fill: b.color,
                textAlign: b.textAlign,
                name: "bodyText",
              }),
            );
          }

          // decorative shapes
          if (design.shapes?.length) {
            for (const s of design.shapes) {
              const shapeClasses = {
                rect: Rect,
                circle: Circle,
                ellipse: Ellipse,
              };
              const ShapeClass = shapeClasses[s.fabricType];
              if (!ShapeClass) continue;
              canvas.add(
                new ShapeClass({
                  left: s.left,
                  top: s.top,
                  width: s.width,
                  height: s.height,
                  radius: s.radius,
                  fill: s.fill,
                  opacity: s.opacity || 1,
                }),
              );
            }
          }

          // uploaded image — add last so it sits on top
          if (imageDataUrl) {
              FabricImage.fromURL(imageDataUrl, { crossOrigin: "anonymous" }).then((img) => {
              const maxW = width * 0.4;
              const maxH = height * 0.4;
              const scale = Math.min(maxW / img.width, maxH / img.height, 1);
              img.scale(scale);
              img.set({ left: width - img.width * scale - 40, top: 40 });
              canvas.add(img);
              canvas.renderAll();
              commit();
            });
          }

          canvas.renderAll();

          // load the fonts Claude chose before rendering
          const fontsToLoad = [
            design.headline?.fontFamily,
            design.subheading?.fontFamily,
            design.bodyText?.fontFamily,
          ].filter(Boolean);

          for (const font of fontsToLoad) {
            const systemFonts = [
              "Arial",
              "Georgia",
              "Times New Roman",
              "Courier New",
              "Verdana",
            ];
            if (
              !systemFonts.includes(font) &&
              !document.querySelector(`link[data-font="${font}"]`)
            ) {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
              link.setAttribute("data-font", font);
              document.head.appendChild(link);
            }
          }

          commit();
        };

        if (onApplyAIDesign) onApplyAIDesign.current = applyAIDesign;
        applyAIDesignRef.current = applyAIDesign;

        if (templateData) {
          // template click — load the baked-in design instead of default placeholders.
          // loadCanvas already exists below and handles history/lastJSON seeding for us
          loadCanvas(templateData);
        } else {
          canvas.add(
            new Textbox("Heading", {
              left: 75,
              top: 50,
              fontSize: 36,
              name: "headline",
            }),
            new Textbox("Subheading", {
              left: 75,
              top: 110,
              fontSize: 26,
              name: "subheading",
            }),
            new Textbox("Your body text", {
              left: 75,
              top: 160,
              fontSize: 16,
              name: "bodyText",
            }),
          );
          canvas.renderAll();

          // seed history with the initial state so undo can get back to it
          lastJSONRef.current = JSON.stringify(canvas.toJSON(["name"]));
          historyRef.current = [
            {
              canvasJSON: JSON.parse(lastJSONRef.current),
              bg: bgColorRef.current,
            },
          ];
          historyIdxRef.current = 0;
        }

        if (pendingAIDesign) {
          console.log("5. pendingAIDesign found in .then(), applying");
          setTimeout(() => {
            applyAIDesign(pendingAIDesign, pendingAIImage);
          }, 100);
        } else {
          console.log("5. NO pendingAIDesign in .then()");
        }
      },
    );

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undoRef.current?.();
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redoRef.current?.();
      }
      // copy — skip if user is typing inside a text input/textarea
      if (e.ctrlKey && e.key === "c") {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        e.preventDefault();
        copyRef.current?.();
      }
      // paste
      if (e.ctrlKey && e.key === "v") {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        e.preventDefault();
        pasteRef.current?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // panel inputs - sync text into canvas + commit per keystroke,
  // same as on-canvas editing above
  // 1. HEADLINE SYNC
  useEffect(() => {
    const canvas = fabricRef.current;
    const Textbox = textboxClassRef.current;
    // Don't run if fabric isn't loaded or if we are currently loading a template
    if (!canvas || !Textbox || isRestoringRef.current) return;

    let obj = canvas.getObjects().find((o) => o.name === "headline");

    if (obj) {
      // ONLY update if headline has text. This prevents the empty
      // sidebar state from erasing the template's "MASTER SKILLS" text.
      if (headline !== "" && headline !== undefined) {
        obj.set("text", headline);
        canvas.renderAll();
      }
    } else if (headline) {
      // Create if it doesn't exist
      const newObj = new Textbox(headline, {
        left: 75,
        top: 50,
        fontSize: 36,
        name: "headline",
      });
      canvas.add(newObj);
      canvas.renderAll();
    }
    commitRef.current?.();
  }, [headline]);

  // 2. SUBHEADING SYNC
  useEffect(() => {
    const canvas = fabricRef.current;
    const Textbox = textboxClassRef.current;
    if (!canvas || !Textbox || isRestoringRef.current) return;

    let obj = canvas.getObjects().find((o) => o.name === "subheading");
    if (obj) {
      if (subheading !== "" && subheading !== undefined) {
        obj.set("text", subheading);
        canvas.renderAll();
      }
    } else if (subheading) {
      const newObj = new Textbox(subheading, {
        left: 75,
        top: 110,
        fontSize: 26,
        name: "subheading",
      });
      canvas.add(newObj);
      canvas.renderAll();
    }
    commitRef.current?.();
  }, [subheading]);

  // 3. BODY TEXT SYNC
  useEffect(() => {
    const canvas = fabricRef.current;
    const Textbox = textboxClassRef.current;
    if (!canvas || !Textbox || isRestoringRef.current) return;

    let obj = canvas.getObjects().find((o) => o.name === "bodyText");
    if (obj) {
      if (bodyText !== "" && bodyText !== undefined) {
        obj.set("text", bodyText);
        canvas.renderAll();
      }
    } else if (bodyText) {
      const newObj = new Textbox(bodyText, {
        left: 75,
        top: 160,
        fontSize: 16,
        name: "bodyText",
      });
      canvas.add(newObj);
      canvas.renderAll();
    }
    commitRef.current?.();
  }, [bodyText]);

  useEffect(() => {
    bgColorRef.current = bgColor;
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const GradientClass = gradientClassRef.current;
    if (!GradientClass) return; // fabric hasn't finished loading yet

    const isGradientShape =
      bgColor && typeof bgColor === "object" && bgColor.type === "linear";
    canvas.backgroundColor = isGradientShape
      ? toFabricGradient(
          bgColor,
          { width: canvas.width, height: canvas.height, scaleX: 1, scaleY: 1 },
          GradientClass,
        )
      : bgColor;

    canvas.requestRenderAll();
    commitRef.current?.();
  }, [bgColor]);

  useEffect(() => {
    console.log(
      "6. pendingAIDesign effect fired:",
      pendingAIDesign ? "has design" : "null",
    );
    if (!pendingAIDesign) return;

    pendingAIDesignRef.current = pendingAIDesign;
    pendingAIImageRef.current = pendingAIImage;

    if (fabricRef.current && applyAIDesignRef.current) {
      console.log("6b. fabric ready, applying immediately");
      applyAIDesignRef.current(pendingAIDesign, pendingAIImage);
      return;
    }

    console.log("6c. fabric not ready, starting poll");
    const interval = setInterval(() => {
      console.log(
        "6d. polling... fabricRef:",
        !!fabricRef.current,
        "applyRef:",
        !!applyAIDesignRef.current,
      );
      if (fabricRef.current && applyAIDesignRef.current) {
        clearInterval(interval);
        console.log("6e. fabric ready via poll, applying");
        applyAIDesignRef.current(
          pendingAIDesignRef.current,
          pendingAIImageRef.current,
        );
      }
    }, 100);

    setTimeout(() => clearInterval(interval), 5000);
  }, [pendingAIDesign, pendingAIImage]);

  // Inside CanvasEditor.js

  useEffect(() => {
    const canvas = fabricRef.current;
    // Only load if canvas is ready, data exists, and we haven't loaded it yet
    if (canvas && templateData && !templateLoadedRef.current) {
      isRestoringRef.current = true;

      canvas.loadFromJSON(templateData).then(() => {
        canvas.renderAll();
        isRestoringRef.current = false;
        templateLoadedRef.current = true; // Mark as loaded

        historyRef.current = [
          { canvasJSON: templateData, bg: canvas.backgroundColor },
        ];
        historyIdxRef.current = 0;
      });
    }
  }, [templateData]);

  return (
    <div
      className="shadow-xl rounded-lg overflow-hidden"
      style={{ width, height }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CanvasEditor;

// canvasRef  → points to the HTML <canvas> element in the DOM
// fabricRef  → points to the Fabric canvas instance (the JS object)
// ===
// canvasRef  →  <canvas>        (the blank paper)
// fabricRef  →  Fabric Canvas   (the smart drawing engine on top of that paper)

// EditorPage
//   const [headline, setHeadline] = useState("")   ← state lives here
//         ↓
//   user types in input → setHeadline fires → headline updates
//         ↓
//   <CanvasEditor headline={headline} />            ← passed as prop
//         ↓
// CanvasEditor
//   receives headline prop
//         ↓
//   useEffect([headline]) fires
//         ↓
//   canvas text updates
