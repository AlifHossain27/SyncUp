"use client";

import React, { useEffect, useRef, useState } from "react";
import Styles from "./OnScrollProgress.module.css";

export default function OnScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(Math.max(pct, 0), 1));
      setVisible(scrollTop > 5);
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          update();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const style: React.CSSProperties = {
    transform: `scaleX(${progress})`,
    opacity: visible ? 1 : 0,
  };

  return <div className={Styles.progressBar} style={style} />;
}
