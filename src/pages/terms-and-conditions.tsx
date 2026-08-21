import React, { useEffect, useState } from "react";

export const Terms = () => {
  const [html, setHtml] = useState<string>();
  useEffect(() => {
    fetch("terms.html")
      .then((policy) => policy.text())
      .then((page) => setHtml(page));
  }, []);
  return (
    <div className="lg:px-24 px-6">
      {html &&
        React.createElement("div", {
          dangerouslySetInnerHTML: { __html: html },
        })}
    </div>
  );
};
