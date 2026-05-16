"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeCtx = { dark: boolean; toggle: () => void };
const ThemeCtx = createContext<ThemeCtx>({ dark: false, toggle: () => {} });
export const useLandingTheme = () => useContext(ThemeCtx);

export function LandingProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("lp-dark") === "1");
  }, []);

  const toggle = () =>
    setDark((d) => {
      const next = !d;
      localStorage.setItem("lp-dark", next ? "1" : "0");
      return next;
    });

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      <div
        className={dark ? "lp-dark" : ""}
        style={{
          background: "var(--lp-bg)",
          color: "var(--lp-t1)",
          minHeight: "100vh",
          transition: "background .25s, color .25s",
        }}
      >
        {children}
      </div>
    </ThemeCtx.Provider>
  );
}
