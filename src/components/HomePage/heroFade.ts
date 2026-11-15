/**
 * Put this attribute on the element whose arrival should fade the home page
 * hero out. Kept out of HeroBackground: anything exported from a "use client"
 * module reaches server components as a client reference, not its value.
 */
export const HERO_FADE_TRIGGER = "data-hero-fade-trigger";
