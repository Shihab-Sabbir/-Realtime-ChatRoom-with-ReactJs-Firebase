import React from "react";
import { Circle } from "better-react-spinkit";
function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <Circle color="#3CBC28" size={60} />
    </center>
  );
}

export default Loading;
