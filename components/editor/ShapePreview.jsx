export default function ShapePreview({ variant }) {
  const { fabricType, props } = variant;

  if (fabricType === "path") {
    return (
      <svg width="40" height="36" viewBox="0 0 200 200">
        <path
          d={props.path}//d attribute of an SVG path contains the path data
          fill={props.fill === "transparent" ? "transparent" : (props.fill || "lightblue")} //if fill is equal to transparent, set fill to transparent else whatever the value of fill is else if lightblue
          stroke={props.stroke || (props.fill === "transparent" ? "#333" : "none")}
          strokeWidth={props.strokeWidth || 0}
        />
      </svg>
    );
  }

  if (fabricType === "triangle") {
    return (
      <svg width="40" height="36" viewBox="0 0 200 200">
        <polygon
          points="100,10 190,190 10,190"
          fill={props.fill === "transparent" ? "transparent" : (props.fill || "lightblue")}
          stroke={props.stroke || (props.fill === "transparent" ? "#333" : "none")}
          strokeWidth={props.strokeWidth || 0}
        />
      </svg>
    );
  }

  if (fabricType === "circle" || fabricType === "ellipse") {
    return (
      <svg width="40" height="36" viewBox="0 0 200 200">
        <ellipse
          cx="100" cy="100"
          rx={fabricType === "ellipse" ? 95 : 90}
          ry={fabricType === "ellipse" ? 70 : 90}
          fill={props.fill === "transparent" ? "transparent" : (props.fill || "lightblue")}
          stroke={props.stroke || (props.fill === "transparent" ? "#333" : "none")}
          strokeWidth={props.strokeWidth || 0}
        />
      </svg>
    );
  }

  // rect / square — CSS div handles rounded corners cleanly
  return (
    <div
      style={{
        width: 36,
        height: fabricType === "square" ? 28 : 22,
        backgroundColor: props.fill === "transparent" ? "transparent" : (props.fill || "lightblue"),
        border: props.fill === "transparent"
          ? `${props.strokeWidth || 2}px solid ${props.stroke || "#333"}`
          : "none",
        borderRadius: props.rx ? Math.min(props.rx / 3, 12) : 0,  //if shape has rounded corners (rx), make the preview rounded too(30=> 30/3=10 Math.min(10,12)=10), but never more than 12px. Otherwise keep the corners sharp.
      }}
    />
  );
}