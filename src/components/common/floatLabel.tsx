import { useState } from "react";

export const FloatLabel: React.FC<{ label: string }> = (props) => {
  const [focus, setFocus] = useState(false);
  const { children, label } = props;

  const labelClass = focus ? "label label-float" : "label";

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label className={labelClass}>{label}</label>
    </div>
  );
};
