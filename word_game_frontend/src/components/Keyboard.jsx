import React from "react";

const ROW1 = "QWERTYUIOP".split("");
const ROW2 = "ASDFGHJKL".split("");
const ROW3 = ["ENTER", ..."ZXCVBNM".split(""), "BACK"];

// PUBLIC_INTERFACE
function Keyboard({ onKey, status }) {
  /** Render on-screen keyboard; disabled visually after game ends. */
  const disabled = status !== "in_progress";
  const btnProps = (k) => ({
    key: k,
    className: ["key", k === "ENTER" ? "special" : "", k === "BACK" ? "backspace" : ""].join(" ").trim(),
    onClick: () => !disabled && onKey(k),
    "aria-label": k === "BACK" ? "Backspace" : k,
    disabled
  });

  return (
    <section className="keyboard" aria-label="On-screen keyboard">
      <div className="kb-row">
        {ROW1.map((k) => <button type="button" {...btnProps(k)}>{k}</button>)}
      </div>
      <div className="kb-row" style={{ paddingLeft: 12, paddingRight: 12 }}>
        {ROW2.map((k) => <button type="button" {...btnProps(k)}>{k}</button>)}
      </div>
      <div className="kb-row">
        {ROW3.map((k) => <button type="button" {...btnProps(k)}>{k}</button>)}
      </div>
    </section>
  );
}

export default Keyboard;
