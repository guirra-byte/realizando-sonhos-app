import React from "react";
import Confetti from "react-confetti-boom";

export const ConfettiFall = React.memo(() => {
  return (
    <Confetti
      mode="fall"
      particleCount={50}
      key="confetti"
      // shapeSize={}
      fadeOutHeight={3}
      colors={["#f59e0b", "#ec4899", "#8b5cf6"]}
    />
  );
});
