import React, { useEffect, useState } from "react";

export const Policy = () => {
  const [html, setHtml] = useState<string>();
  useEffect(() => {
    fetch("policy.html")
      .then((policy) => policy.text())
      .then((page) => setHtml(page));
  }, []);
  return (
    <div className="p-2">
      {html &&
        React.createElement("div", {
          dangerouslySetInnerHTML: { __html: html },
        })}
    </div>
  );
};
