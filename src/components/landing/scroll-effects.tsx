"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;

      if (window.scrollY > 20) {
        header.classList.add("shadow-md", "py-2");
        header.classList.remove("py-4");
      } else {
        header.classList.remove("shadow-md", "py-2");
        header.classList.add("py-4");
      }
    };

    const handleMouseMove = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      const mouseEvent = e as MouseEvent;
      const rect = card.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const glassCards = document.querySelectorAll(".glass-card");
    glassCards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      glassCards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
      });
    };
  }, []);

  return null;
}
