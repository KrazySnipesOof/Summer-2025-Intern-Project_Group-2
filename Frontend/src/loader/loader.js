import React from "react";

export const Loader = (props) => {
  return (
    <div className="loader-main-hp">
      <div
        style={{ background: "#1f293f" }}
        className={
          "loader-hp " +
          (props.smaller ? "small " : null) +
          (props.invert ? "inverted " : null)
        }
      ></div>
    </div>
  );
};
