"use client";

import { useState } from "react";

export default function PixoGuide() {
  const [open, setOpen] = useState(true);
  if (!open) return <button className="pixo-reopen" type="button" onClick={() => setOpen(true)} aria-label="Show Pixo helper"><img src="/pixo.svg" alt="" />Pixo</button>;

  return (
    <aside className="pixo-guide" aria-label="Pixo website helper">
      <img className="pixo-guide-avatar" src="/pixo.svg" alt="Pixo the PicToSpec chameleon" />
      <div className="pixo-guide-copy">
        <strong>Hi, I’m Pixo!</strong>
        <span>Need a hand? Pick a tool and I’ll help you get started.</span>
        <a href="/#tools">Explore tools <span aria-hidden="true">→</span></a>
      </div>
      <button className="pixo-guide-close" type="button" onClick={() => setOpen(false)} aria-label="Hide Pixo helper">×</button>
    </aside>
  );
}
