/** Smooth-scroll to a section by id. Works even with HashRouter intercepting hash links. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
