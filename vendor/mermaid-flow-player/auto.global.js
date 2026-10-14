"use strict";(()=>{var ye=null;function ae(){if(ye!==null)return ye;if(typeof window>"u"||typeof window.location>"u")return ye={},ye;let t=new URLSearchParams(window.location.search),e={},r=t.has("debug"),n=t.get("visited");n!==null&&(n===""||n==="true"?e.visited=!0:n==="false"?e.visited=!1:e.visited=ze(n,"visited",r));let o=t.get("speed");o!==null&&(e.speed=st(o,"speed",.1,10,r));let d=t.get("stepMs");d!==null&&(e.stepMs=st(d,"stepMs",0,1e4,r));let m=t.get("step");m!==null&&(e.step=st(m,"step",0,1e5,r));let u=t.get("mode");u!==null&&(e.mode=ot(u,["sequential","interactive"],"mode",r));let g=t.get("debug");g!==null&&(g===""||g==="true"?e.debug=!0:g==="false"?e.debug=!1:e.debug=ze(g,"debug",!0));let p=t.get("autoplay");p!==null&&(p===""||p==="true"?e.autoplay=!0:p==="false"?e.autoplay=!1:e.autoplay=ze(p,"autoplay",r));let A=t.get("trigger");A!==null&&(e.trigger=ot(A,["load","scroll"],"trigger",r));let C=t.get("theme");C!==null&&(e.theme=ot(C,["light","dark","auto"],"theme",r));let V=t.get("selector");if(V!==null){let M=V.trim();M.length>0&&M.length<=256?e.selector=M:r&&V!==""&&console.warn("[mermaid-flow-player] Invalid selector: empty or too long (max 256 chars). Ignored.")}let D=t.get("narration-text");D!==null&&(e.narrationText=D);let T=[["minimap","minimap"],["syncUrl","sync-url"],["autoCenter","autoCenter"],["narration","narration"]];for(let[M,O]of T){let R=t.get(O);R!==null&&(R===""||R==="true"?e[M]=!0:R==="false"?e[M]=!1:e[M]=ze(R,O,r))}return ye=e,e}function ot(t,e,r,n){if(e.includes(t))return t;n&&console.warn(`[mermaid-flow-player] Invalid value for "${r}": "${t}". Allowed values: ${e.join(", ")}`)}function st(t,e,r,n,o){let d=parseFloat(t);if(isNaN(d)){o&&console.warn(`[mermaid-flow-player] Invalid number for "${e}": "${t}"`);return}if(d<r||d>n){o&&console.warn(`[mermaid-flow-player] Value for "${e}" out of range: ${d}. Must be between ${r} and ${n}`);return}return d}function ze(t,e,r){let n=t.toLowerCase();if(n==="true"||n==="1"||n==="yes")return!0;if(n==="false"||n==="0"||n==="no")return!1;r&&console.warn(`[mermaid-flow-player] Invalid boolean for "${e}": "${t}". Use true/false, 1/0, or yes/no`)}var De=`/* mermaid-flow-player.css \u2013 include after Mermaid's CSS */

/**
 * CSS Custom Properties (Variables)
 *
 * Customize these variables in your own CSS to change colors,
 * timing, animations, and other visual aspects.
 *
 * Example:
 *   :root {
 *     --mf-active-color: #ff6b6b;
 *     --mf-transition-duration: 300ms;
 *   }
 */
:root {
  /* State Colors */
  --mf-active-color: #4caf50;
  --mf-visited-color: #2196f3;
  --mf-error-color: #f44336;
  --mf-success-color: #4caf50;
  --mf-warning-color: #ff9800;

  /* Opacity Values */
  --mf-active-opacity: 1;
  --mf-visited-opacity: 1;

  /* Sequential State Strokes */
  --mf-active-stroke: #3b82f6;
  --mf-active-stroke-width: 3px;
  --mf-visited-stroke: #3b82f6;
  --mf-visited-stroke-width: 2px;

  /* Timing & Transitions */
  --mf-transition-duration: 220ms;
  --mf-transition-timing: ease;
  --mf-opacity-transition-duration: 200ms;
  /* Edge Styles */
  --mf-edge-width: 4px;
  --mf-edge-active-width: 4px;

  /* Font */
  --mf-font-family: 'JetBrains Mono', monospace;

  /* Controls \u2014 direct values so host design tokens (Tailwind/shadcn/Starlight)
     don't leak into the player's default look. */
  --mf-control-bg: #f8fafc;
  --mf-control-border: #e2e8f0;
  --mf-control-text: #334155;
  --mf-control-hover-bg: #f1f5f9;
  --mf-control-active-bg: color-mix(in srgb, #e2e8f0 88%, black);
  --mf-control-border-radius: 8px;
  --mf-control-padding: 7px 14px;
  --mf-control-gap: 6px;
  --mf-control-font-size: 13px;
  --mf-control-primary-bg: #4f46e5;
  --mf-control-primary-text: #fff;
  --mf-control-primary-hover-bg: #4338ca;

  /* Narration */
  --mf-narration-bg: #f8fafc;
  --mf-narration-border: #e2e8f0;
  --mf-narration-text: #475569;
  --mf-narration-border-radius: 8px;
  --mf-narration-padding: 12px 16px;
  --mf-narration-font-size: 13px;

  /* Interactive Mode */
  --mf-interactive-current-color: #3b82f6;
  --mf-interactive-current-width: 3px;
  --mf-interactive-available-color: #3b82f6;
  --mf-interactive-available-width: 2px;
  --mf-interactive-available-dash: 6 3;
  --mf-interactive-visited-color: #3b82f6;
  --mf-interactive-visited-width: 2px;
  --mf-interactive-visited-opacity: 1;
  --mf-interactive-dimmed-opacity: 0.3;
  --mf-interactive-edge-active-opacity: 0.7;
  --mf-interactive-edge-visited-opacity: 0.8;
  --mf-interactive-edge-dimmed-opacity: 0.15;
  --mf-viewport-min-height: 120px;
  --mf-viewport-bg: transparent;
  --mf-viewport-border: rgba(148, 163, 184, 0.22);
}

.mfp-viewport {
  position: relative;
  width: 100%;
  min-height: var(--mf-viewport-min-height);
  overflow: hidden;
  border: 1px solid var(--mf-viewport-border);
  border-radius: 10px;
  background: var(--mf-viewport-bg);
  touch-action: none;
}


.mfp-viewport-canvas {
  width: 100%;
  height: 100%;
}

.mfp-viewport svg {
  display: block;
  height: auto;
  will-change: transform;
  cursor: grab;
  /* Auto-center and focusNode() glide between nodes instead of cutting. */
  transition: transform 240ms ease;
}

.mfp-viewport-dragging svg {
  cursor: grabbing;
  transition: none;
}

/* Edge fades marking diagram that runs past the viewport \u2014 see updateClipCues().
   Without them a diagram wider than its column just stops mid-air and reads as
   a failed render rather than something you can drag. */
.mfp-viewport::before,
.mfp-viewport::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 40px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
}

.mfp-viewport::before {
  left: 0;
  background: linear-gradient(to right, var(--mf-viewport-clip-cue, rgba(15, 23, 42, 0.18)), transparent);
}

.mfp-viewport::after {
  right: 0;
  background: linear-gradient(to left, var(--mf-viewport-clip-cue, rgba(15, 23, 42, 0.18)), transparent);
}

.mfp-viewport--clip-start::before,
.mfp-viewport--clip-end::after {
  opacity: 1;
}

.mfp-viewport:fullscreen {
  width: 100vw !important;
  max-width: none !important;
  min-height: 100vh;
  margin-left: 0 !important;
  border-radius: 0;
  border: 0;
  background: var(--mf-viewport-bg, #0f172a);
}

.mfp-viewport-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  /* Above the clip-cue gradients, which sit on the same viewport edges. */
  z-index: 2;
  display: flex;
  gap: 6px;
}

.mfp-fit-btn,
.mfp-expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--mf-control-bg, #f8fafc);
  border: 1px solid var(--mf-control-border, #e2e8f0);
  border-radius: 6px;
  color: var(--mf-control-text, #334155);
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 180ms ease, background 180ms ease;
}

.mfp-fit-btn:hover,
.mfp-expand-btn:hover {
  opacity: 1;
  background: var(--mf-control-hover-bg, #f1f5f9);
}

.mfp-fit-btn:focus-visible,
.mfp-expand-btn:focus-visible,
.mfp-focus-close:focus-visible {
  opacity: 1;
  outline: 2px solid var(--mf-active-stroke, #3b82f6);
  outline-offset: 2px;
}

.mfp-fit-btn svg,
.mfp-expand-btn svg {
  width: 14px;
  height: 14px;
}

.mfp-fit-btn[hidden],
.mfp-expand-btn[hidden] {
  display: none;
}

.mfp-minimap {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  width: 160px;
  height: 96px;
  overflow: hidden;
  border: 1px solid var(--mf-viewport-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--mf-viewport-bg, #0f172a) 78%, black);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
  pointer-events: none;
}

.mfp-minimap svg {
  width: 100%;
  height: 100%;
  max-width: 100%;
  transform: none !important;
  opacity: 0.72;
}

/* Nothing off-screen to navigate to \u2014 see updateMinimap(). */
.mfp-minimap--idle {
  display: none;
}

.mfp-minimap-rect {
  position: absolute;
  border: 2px solid color-mix(in srgb, var(--mf-active-stroke, #3b82f6) 88%, white);
  background: color-mix(in srgb, var(--mf-active-stroke, #3b82f6) 16%, transparent);
  box-sizing: border-box;
}

.mfp-focus-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.mfp-focus-modal[hidden] {
  display: none;
}

/* The page behind the larger view stays put while the reader pans in it. */
body.mfp-focus-open {
  overflow: hidden;
}

.mfp-focus-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.72);
}

.mfp-focus-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(96vw, 1800px);
  height: min(92vh, 1200px);
  margin: 4vh auto;
  border-radius: 16px;
  overflow: hidden;
  background: var(--mf-focus-bg, #fff);
  box-shadow: 0 32px 64px rgba(15, 23, 42, 0.28);
}

.mfp-focus-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px 12px;
  border-bottom: 1px solid var(--mf-control-border, #e2e8f0);
}

.mfp-focus-content {
  position: relative;
  flex: 1;
  min-height: 0;
}

.mfp-focus-content .mfp-viewport {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: 0;
}

.mfp-focus-close {
  padding: var(--mf-control-padding, 7px 14px);
  font: inherit;
  font-size: var(--mf-control-font-size, 13px);
  color: var(--mf-control-text, #334155);
  background: var(--mf-control-bg, #f8fafc);
  border: 1px solid var(--mf-control-border, #e2e8f0);
  border-radius: var(--mf-control-border-radius, 8px);
  cursor: pointer;
}

.mfp-focus-close:hover {
  background: var(--mf-control-hover-bg, #f1f5f9);
}

.mfp-node-search-match rect,
.mfp-node-search-match polygon,
.mfp-node-search-match ellipse,
.mfp-node-search-match circle,
.mfp-node-search-match > path,
.mfp-node-search-match > .label-container > path {
  stroke: color-mix(in srgb, var(--mf-warning-color, #ff9800) 88%, white) !important;
  stroke-width: 3px !important;
}

/* Node & Edge Transitions. A bound element is the shape itself (a flowchart
   edge is one <path>, a sequence message one <line>, a gantt task one <rect>)
   or the group around it, so every rule matches both. */
.mermaid svg g.node,
.mermaid svg [data-et="participant"],
.mermaid svg [class*="mf-edge-"] {
  transition: opacity var(--mf-opacity-transition-duration) var(--mf-transition-timing);
}

.mermaid svg g.node rect,
.mermaid svg g.node polygon,
.mermaid svg g.node path,
.mermaid svg g.node ellipse,
.mermaid svg g.node circle,
.mermaid svg [data-et="participant"] rect,
.mermaid svg [class*="mf-state-"]:is(rect, line),
.mermaid svg [class*="mf-edge-"]:is(path, line),
.mermaid svg [class*="mf-edge-"] path {
  transition:
    fill var(--mf-transition-duration) var(--mf-transition-timing),
    stroke var(--mf-transition-duration) var(--mf-transition-timing),
    stroke-width var(--mf-transition-duration) var(--mf-transition-timing),
    filter var(--mf-transition-duration) var(--mf-transition-timing);
}

/* State Classes */

/* Visited state \u2014 thinner outline, path remains visible */
.mf-state-visited {
  opacity: var(--mf-visited-opacity);
}
.mf-state-visited:is(rect, line),
.mf-state-visited rect,
.mf-state-visited polygon,
.mf-state-visited ellipse,
.mf-state-visited circle,
.mf-state-visited > path,
.mf-state-visited > .label-container > path {
  stroke: var(--mf-visited-stroke) !important;
  stroke-width: var(--mf-visited-stroke-width) !important;
}

/* Active state \u2014 prominent outline with subtle glow (comes after visited for priority) */
.mf-state-active {
  opacity: var(--mf-active-opacity);
}
.mf-state-active:is(rect, line),
.mf-state-active rect,
.mf-state-active polygon,
.mf-state-active ellipse,
.mf-state-active circle,
.mf-state-active > path,
.mf-state-active > .label-container > path {
  stroke: var(--mf-active-stroke) !important;
  stroke-width: var(--mf-active-stroke-width) !important;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--mf-active-stroke, #3b82f6) 45%, transparent));
}

/* Edge Styles \u2014 base width for all edges with a state class */
[class*="mf-edge-"]:is(path, line),
[class*="mf-edge-"] path {
  stroke-width: var(--mf-edge-width);
}

/* Visited edge \u2014 retains stroke from visited step */
.mf-edge-visited:is(path, line),
.mf-edge-visited path {
  stroke: var(--mf-visited-stroke) !important;
  stroke-width: var(--mf-visited-stroke-width) !important;
}

/* Active edge \u2014 current step's edge */
.mf-edge-active:is(path, line),
.mf-edge-active path {
  stroke: var(--mf-active-stroke) !important;
  stroke-width: var(--mf-active-stroke-width) !important;
}

/* Controls: wrapper for container queries.
   One bar for both enhancement paths: <mermaid-flow-player> and autoInit over
   .mermaid blocks both render \`.mfp-controls\` from src/controls.ts, so this is
   the only place the toolbar is styled. */
mermaid-flow-player,
.mermaid-flow-controls-wrapper {
  container-type: inline-size;
  container-name: mfp-controls;
}

.mermaid-flow-controls-wrapper {
  margin-top: var(--mf-control-gap);
  font-family: var(--mf-font-family, 'JetBrains Mono', monospace);
}

.mfp-controls {
  display: flex;
  gap: var(--mf-control-gap);
  align-items: center;
  flex-wrap: wrap;
}

.mfp-controls button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--mf-control-padding);
  background: var(--mf-control-bg);
  border: 1px solid var(--mf-control-border);
  border-radius: var(--mf-control-border-radius);
  color: var(--mf-control-text);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--mf-control-font-size, 13px);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.mfp-controls button:hover {
  background: var(--mf-control-hover-bg);
  border-color: color-mix(in srgb, var(--mf-control-border) 70%, black);
}

.mfp-controls button:active {
  background: var(--mf-control-active-bg);
}

.mfp-controls button:focus-visible {
  outline: 2px solid var(--mf-control-primary-bg, #4f46e5);
  outline-offset: 2px;
}

.mfp-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Primary action button (Play) */
.mfp-controls .mfp-btn-primary {
  background: var(--mf-control-primary-bg);
  border-color: var(--mf-control-primary-bg);
  color: var(--mf-control-primary-text);
  font-weight: 600;
}

.mfp-controls .mfp-btn-primary:hover {
  background: var(--mf-control-primary-hover-bg);
  border-color: var(--mf-control-primary-hover-bg);
}

.mfp-controls .mfp-btn-primary:active {
  background: color-mix(in srgb, var(--mf-control-primary-bg) 80%, black);
}

.mfp-controls .mfp-btn-utility {
  background: transparent;
  color: var(--mf-control-muted-text, #64748b);
}

/* SVG icon sizing inside buttons */
.mfp-controls .mfp-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.mfp-controls .mfp-icon svg {
  width: 14px;
  height: 14px;
}

/* Reserve width so cycling 0.5x / 1x / 2x doesn't reflow the whole bar. */
.mfp-controls button[data-action="speed"] {
  min-width: 44px;
}

/* Separate transport from utility buttons without wrapper divs: the first
   utility button after the transport run carries the divider. */
.mfp-controls .mfp-btn-transport + .mfp-btn-utility,
.mfp-controls .mfp-btn-primary + .mfp-btn-utility {
  margin-left: var(--mf-control-gap);
  padding-left: calc(var(--mf-control-gap) + 4px);
  border-left: 1px solid var(--mf-control-border);
}

/* Responsive: collapse to icons rather than wrap to a second row.
   Order of sacrifice: viewport controls first (a magnifier is unambiguous),
   then secondary transport, and Play's label last because it is the one
   control a first-time reader needs to recognise.
   \`speed\` is exempt at every tier: its label IS its value ("1x"), so hiding
   it would leave an empty button. */
@container mfp-controls (max-width: 640px) {
  .mfp-controls .mfp-btn-utility:not([data-action="speed"]) .mfp-label {
    display: none;
  }
}

@container mfp-controls (max-width: 460px) {
  .mfp-controls .mfp-btn-transport .mfp-label {
    display: none;
  }

  .mfp-controls {
    gap: 4px;
  }
}

@container mfp-controls (max-width: 340px) {
  .mfp-controls .mfp-btn-primary .mfp-label {
    display: none;
  }

  .mfp-controls button {
    padding: 5px 10px;
    font-size: 12px;
  }
}

/* Icon-only buttons keep the icon centred instead of sitting in a wide pill. */
@container mfp-controls (max-width: 640px) {
  .mfp-controls button {
    padding-inline: 10px;
  }
}

/* Narration */
.mermaid-flow-narration {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: var(--mf-control-gap);
  margin-bottom: var(--mf-control-gap);
  padding: var(--mf-narration-padding);
  background: var(--mf-narration-bg);
  border: 1px solid var(--mf-narration-border, var(--mf-control-border));
  border-radius: var(--mf-narration-border-radius);
  color: var(--mf-narration-text);
  font-family: inherit;
  font-size: var(--mf-narration-font-size);
  line-height: 1.5;
  min-height: 2.5em;
}
/* Collapse the narration region until it has content (e.g. no narration-text
   set and no playback has written a step note yet). */
.mermaid-flow-narration:empty {
  display: none;
}

/* Interactive Mode */
.mf-interactive-current {
  opacity: 1 !important;
}

.mf-interactive-current rect,
.mf-interactive-current polygon,
.mf-interactive-current ellipse,
.mf-interactive-current circle,
.mf-interactive-current > .label-container,
.mf-interactive-current > .label-container > path {
  stroke: var(--mf-interactive-current-color) !important;
  stroke-width: var(--mf-interactive-current-width) !important;
}

.mf-interactive-available {
  opacity: 1 !important;
  cursor: pointer;
}

.mf-interactive-available rect,
.mf-interactive-available polygon,
.mf-interactive-available ellipse,
.mf-interactive-available circle,
.mf-interactive-available > .label-container,
.mf-interactive-available > .label-container > path {
  stroke: var(--mf-interactive-available-color) !important;
  stroke-width: var(--mf-interactive-available-width) !important;
  stroke-dasharray: var(--mf-interactive-available-dash) !important;
}

.mf-interactive-visited {
  opacity: var(--mf-interactive-visited-opacity) !important;
}

.mf-interactive-visited rect,
.mf-interactive-visited polygon,
.mf-interactive-visited ellipse,
.mf-interactive-visited circle,
.mf-interactive-visited > .label-container,
.mf-interactive-visited > .label-container > path {
  stroke: var(--mf-interactive-visited-color) !important;
  stroke-width: var(--mf-interactive-visited-width) !important;
}

.mf-interactive-dimmed {
  opacity: var(--mf-interactive-dimmed-opacity) !important;
}

.mf-interactive-edge-active {
  opacity: var(--mf-interactive-edge-active-opacity) !important;
}

.mf-interactive-edge-visited {
  opacity: var(--mf-interactive-edge-visited-opacity) !important;
}

.mf-interactive-edge-dimmed {
  opacity: var(--mf-interactive-edge-dimmed-opacity) !important;
}

/* Dark Mode SVG Contrast \u2014 override Mermaid's default diagram colors
   when theme="dark" to ensure edges, text, and labels pass WCAG AA
   contrast requirements against the dark viewport background. */
[data-mf-theme="dark"] .mfp-viewport svg .edge-thickness-normal path,
[data-mf-theme="dark"] .mfp-viewport svg .edgePath path,
[data-mf-theme="dark"] .mfp-viewport svg .flowchart-link:not([class*="mf-edge-"]) {
  stroke: #94a3b8 !important;
}

[data-mf-theme="dark"] .mfp-viewport svg .edgeLabel,
[data-mf-theme="dark"] .mfp-viewport svg .edgeLabel span,
[data-mf-theme="dark"] .mfp-viewport svg .edgeLabel p {
  color: #cbd5e1 !important;
  fill: #cbd5e1 !important;
  background: transparent !important;
}

[data-mf-theme="dark"] .mfp-viewport svg .marker,
[data-mf-theme="dark"] .mfp-viewport svg marker path {
  fill: #94a3b8 !important;
  stroke: #94a3b8 !important;
}

[data-mf-theme="dark"] .mfp-viewport svg .node .label,
[data-mf-theme="dark"] .mfp-viewport svg .node .nodeLabel,
[data-mf-theme="dark"] .mfp-viewport svg .node text {
  fill: #e2e8f0 !important;
}

/* Reduced Motion \u2014 disable all transitions and animations for users
   who prefer reduced motion (vestibular disorders, motion sensitivity). */
@media (prefers-reduced-motion: reduce) {
  .mfp-viewport svg,
  .mermaid svg g.node,
  .mermaid svg g.node *,
  .mermaid svg [data-et="participant"],
  .mermaid svg [data-et="participant"] rect,
  .mermaid svg [class*="mf-state-"],
  .mermaid svg [class*="mf-edge-"],
  .mermaid svg [class*="mf-edge-"] path {
    transition: none !important;
  }

  .mfp-controls button,
  .mfp-fit-btn,
  .mfp-expand-btn {
    transition: none !important;
  }
}

/* ------------------------------------------------------------------ */
/* Narrated-walkthrough chrome: captions, progress, chapters, word     */
/* highlight, loading and error states. Emitted by                      */
/* <mermaid-flow-player> today, unscoped so the auto path can render    */
/* the same chrome without a second copy of these rules.                */
/* ------------------------------------------------------------------ */
mermaid-flow-player { display: block; overflow: hidden; font-family: var(--mf-font-family, 'JetBrains Mono', monospace); }
.mfp-narration {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: var(--mf-control-gap, 6px);
  margin-bottom: var(--mf-control-gap, 24px);
  padding: var(--mf-narration-padding, 12px 16px);
  background: var(--mf-narration-bg, #f8fafc);
  border: 1px solid var(--mf-narration-border, var(--mf-control-border, #e2e8f0));
  border-radius: var(--mf-narration-border-radius, 8px);
  color: var(--mf-narration-text, #475569);
  font-family: inherit;
  font-size: var(--mf-narration-font-size, 13px);
  line-height: 1.5;
  min-height: 2.5em;
}
/* A strut that holds exactly one line of caption, whatever the padding is set
   to. Without it the bar had no height until the first step wrote a note, so
   pressing Play shoved everything below the player down the page. */
.mfp-narration::before {
  content: "";
  display: inline-block;
  width: 0;
  height: 1.5em;
}
/* Empty is a resting state, not a hidden one. \`visibility: hidden\` reserved
   the height but left an unexplained gap between diagram and controls; keeping
   the surface visible reads as a caption track waiting for playback, and still
   never moves when the first note arrives. */
.mfp-narration:empty {
  border-style: dashed;
  opacity: 0.55;
}
.mfp-tap-to-speak {
  display: block;
  margin: var(--mf-control-gap, 8px) auto 0;
  padding: var(--mf-control-padding, 7px 14px);
  background: var(--mf-control-primary-bg, #4f46e5);
  border: 1px solid var(--mf-control-primary-bg, #4f46e5);
  border-radius: var(--mf-control-border-radius, 8px);
  color: var(--mf-control-primary-text, #fff);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--mf-control-font-size, 13px);
  font-weight: 600;
}
.mfp-loading,
.mfp-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: var(--mf-narration-padding, 12px 16px);
  border-radius: var(--mf-narration-border-radius, 8px);
  font-family: inherit;
  font-size: var(--mf-narration-font-size, 13px);
  line-height: 1.5;
  text-align: center;
}
.mfp-progress {
  text-align: center;
  margin-top: var(--mf-control-gap, 6px);
  font-family: inherit;
  font-size: var(--mf-progress-font-size, 12px);
  color: var(--mf-progress-color, var(--mf-narration-text, #475569));
  font-variant-numeric: tabular-nums; /* stops the row twitching as N changes */
}
.mfp-progress:empty { display: none; }
.mfp-loading {
  color: var(--mf-narration-text, #475569);
  background: var(--mf-narration-bg, #f8fafc);
  border: 1px solid var(--mf-narration-border, var(--mf-control-border, #e2e8f0));
}
.mfp-error {
  color: var(--mf-error-color, #f44336);
  background: var(--mf-error-bg, #fef2f2);
  border: 1px solid currentColor;
}
/* The word currently being spoken, tracked via SpeechSynthesis boundary events. */
.mfp-word {
  /* Ink is pinned, not inherited: the highlight is a fixed amber in both
     themes, so a light dark-theme foreground on it would be unreadable. */
  color: var(--mf-word-color, #1e293b);
  background: var(--mf-word-bg, #fde68a);
  border-radius: 3px;
  box-shadow: 0 0 0 2px var(--mf-word-bg, #fde68a);
}
.mfp-chapters {
  list-style: none;
  margin: var(--mf-control-gap, 8px) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  counter-reset: mfp-chapter;
}
.mfp-chapters li { counter-increment: mfp-chapter; }
.mfp-chapters button {
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 6px 12px;
  background: var(--mf-control-bg, #f8fafc);
  border: 1px solid var(--mf-control-border, #e2e8f0);
  border-radius: var(--mf-control-border-radius, 8px);
  color: var(--mf-control-text, #334155);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--mf-control-font-size, 13px);
  text-align: left;
  line-height: 1.4;
  transition: background 160ms ease, border-color 160ms ease;
}
.mfp-chapters button::before {
  content: counter(mfp-chapter);
  flex: 0 0 auto;
  min-width: 1.4em;
  color: var(--mf-control-primary-bg, #4f46e5);
  font-weight: 600;
}
.mfp-chapters button:hover { background: var(--mf-control-hover-bg, #f1f5f9); }
.mfp-chapters .mfp-chapter-active button {
  border-color: var(--mf-control-primary-bg, #4f46e5);
  background: color-mix(in srgb, var(--mf-control-primary-bg, #4f46e5) 10%, transparent);
  font-weight: 600;
}
`;function le(){if(typeof document>"u"||document.head.querySelector("style[data-mermaid-flow-player]"))return;let t=document.createElement("style");t.setAttribute("data-mermaid-flow-player",""),t.textContent=De,document.head.appendChild(t)}var at={states:{idle:{},dimmed:{},active:{stroke:"#3b82f6",edge:"#3b82f6"},visited:{stroke:"#3b82f6",edge:"#3b82f6"},success:{fill:"#b7f7c0",stroke:"#1b7f2a",text:"#1f2328",edge:"#1b7f2a"},error:{fill:"#ffb3b3",stroke:"#b00020",text:"#1f2328",edge:"#b00020"},warning:{fill:"#ffe1b3",stroke:"#a65a00",text:"#1f2328",edge:"#a65a00"},disabled:{fill:"#e5e7eb",stroke:"#9ca3af",text:"#6b7280",edge:"#9ca3af"}},classes:{nodeStatePrefix:"mf-state-",edgeStatePrefix:"mf-edge-",dim:"mf-state-dimmed",pulse:"mf-state-pulse"}};function Zt(t){return t?{states:{...at.states,...t.states??{}},classes:{...at.classes,...t.classes??{}}}:at}var N=class extends Error{code;subjects;constructor(e,r,n=[]){super(r),this.name="FlowPlayerError",this.code=e,this.subjects=n}},de=(t,e="Unhandled variant")=>{throw new Error(`${e}: ${JSON.stringify(t)}`)};var er=(t,e,r,n)=>rr([...t.querySelectorAll(e)],o=>o.getAttribute(r)===n),rr=(t,e)=>{let r=t.filter(e);return r.length===1?r[0]:void 0},tr=t=>t.replace(/-\d+$/,""),gn=(t,e)=>{let r=`${t.id}-${tr(e)}`;return rr([...t.querySelectorAll("[id]")],n=>tr(n.id)===r)};function nr(t,e){let r=new Map,n=new Map,o=[],d=(m,u,g)=>{for(let p of m){let{scope:A,attribute:C,value:V}=u(p),D=er(e,A,C,V);D?g.set(p.id,D):o.push(p.id)}};switch(t.kind){case"flowchart":case"state":case"class":case"er":for(let m of t.nodes){let u=gn(e,m.domId);u?r.set(m.id,u):o.push(m.id)}d(t.edges,m=>({scope:'[data-et="edge"]',attribute:"data-id",value:m.id}),n);for(let m of t.edges){if(n.has(m.id)||m.from!==m.to)continue;let u=t.edges.flatMap(g=>{let p=g.from===m.from&&g.to===m.to&&n.get(g.id);return p?[p]:[]});u.length===1&&(n.set(m.id,u[0]),o.splice(o.indexOf(m.id),1))}break;case"sequence":{d(t.nodes,m=>({scope:'[data-et="participant"]',attribute:"data-id",value:m.domId}),r),d(t.edges,m=>({scope:'[data-et="message"]',attribute:"data-id",value:`i${m.id}`}),n);break}case"gantt":{d(t.nodes,m=>({scope:"[id]",attribute:"id",value:`${e.id}-${m.domId}`}),r);break}case"journey":{t.nodes.forEach((m,u)=>{let p=er(e,"[id]","id",`${e.id}-task${u}`)?.parentElement;p?r.set(m.id,p):o.push(m.id)});break}default:return de(t.kind,"Unhandled diagram kind")}if(o.length>0)throw new N("BINDING_INCOMPLETE",`The rendered diagram does not match its source: ${o.join(", ")}`,o);return{nodes:r,edges:n}}var hn={flowchart:"flowchart","flowchart-v2":"flowchart",graph:"flowchart",sequence:"sequence",state:"state",stateDiagram:"state",class:"class",classDiagram:"class",er:"er",gantt:"gantt",journey:"journey"},we=(t,e)=>{let r=t[e];return typeof r=="function"?r.call(t):void 0},ce=t=>typeof t=="string"?t:"",vn=(t,e)=>{let r=we(t,"getData");if(!r)throw new N("PARSE_FAILED","Mermaid returned no graph data");let n=new Map(r.nodes.map(o=>[o.id,e==="er"&&o.label?o.label:o.id]));return{nodes:r.nodes.map(o=>({id:n.get(o.id),label:ce(o.label),domId:o.domId??o.id})),edges:r.edges.map(o=>({id:o.id,from:n.get(o.start)??o.start,to:n.get(o.end)??o.end,label:ce(o.label)}))}},bn=new Set([0,1,3,4,5,6,24,25,33,34,...Array.from({length:18},(t,e)=>41+e)]),yn=t=>{let e=we(t,"getActors")??new Map,r=we(t,"getMessages")??[];return{nodes:[...e].map(([n,o])=>({id:n,label:ce(o.description)||n,domId:n})),edges:r.filter(n=>bn.has(n.type??-1)&&n.from!=null&&n.to!=null).map(n=>({id:n.id,from:n.from,to:n.to,label:ce(n.message)}))}},ir=t=>({nodes:t,edges:t.slice(1).map((e,r)=>({id:`${t[r].id}->${e.id}`,from:t[r].id,to:e.id,label:""}))}),wn=t=>ir((we(t,"getTasks")??[]).map(e=>({id:e.id,label:ce(e.task).trim(),domId:e.id}))),xn=t=>{let e=new Map;return ir((we(t,"getTasks")??[]).map((r,n)=>{let o=ce(r.task).trim()||`task-${n}`,d=e.get(o)??0;e.set(o,d+1);let m=d===0?o:`${o} (${d+1})`;return{id:m,label:o,domId:m}}))};async function or(t,e){let r=e.mermaidAPI?.getDiagramFromText;if(typeof r!="function")throw new N("PARSE_FAILED","This build of Mermaid does not expose mermaidAPI.getDiagramFromText");let n;try{n=await r.call(e.mermaidAPI,t)}catch(m){throw new N("PARSE_FAILED",m instanceof Error?m.message:String(m))}let o=hn[n.type??""];if(!o)throw new N("UNSUPPORTED_DIAGRAM",`Cannot animate a "${n.type??"unknown"}" diagram`,[n.type??"unknown"]);let d=n.db;if(!d)throw new N("PARSE_FAILED","Mermaid returned no diagram data");switch(o){case"flowchart":case"state":case"class":case"er":return{kind:o,...vn(d,o)};case"sequence":return{kind:o,...yn(d)};case"gantt":return{kind:o,...wn(d)};case"journey":return{kind:o,...xn(d)};default:return de(o,"Unhandled diagram kind")}}async function lt(t,e,r){let n=await or(e,r),o=nr(n,t),d=new Map;for(let g of n.nodes){let p=o.nodes.get(g.id);p&&d.set(g.id,p)}let m=new Map,u=new Map;for(let g of n.edges){let p=`${g.from}->${g.to}`,A=u.get(p)??0;u.set(p,A+1);let C=o.edges.get(g.id);C&&m.set(A===0?p:`${p}#${A}`,C)}return{type:n.kind,svg:t,graph:n,nodes:d,edges:m}}function W(t){let[e="",r=""]=t.replace(/#\d+$/,"").split("->");return[e,r]}function dt(t,e){let r=new Set,n=new Set,o=[],d=[];for(let m=0;m<e.length;m++){let u=e[m];if(u.type==="node")r.add(u.id),t.nodes.has(u.id)||o.push({kind:"missing_node",id:u.id,message:`Node "${u.id}" not found in diagram.`,stepIndex:m});else if(u.type==="edge"){r.add(u.from),r.add(u.to);let g=`${u.from}->${u.to}`;n.add(g),t.nodes.has(u.from)||o.push({kind:"missing_node",id:u.from,message:`Node "${u.from}" (edge source) not found in diagram.`,stepIndex:m}),t.nodes.has(u.to)||o.push({kind:"missing_node",id:u.to,message:`Node "${u.to}" (edge target) not found in diagram.`,stepIndex:m}),t.edges.has(g)||d.push({kind:"missing_edge",id:g,message:`Edge "${u.from} -> ${u.to}" not indexed (edge animation may be off or not detected).`,stepIndex:m})}}return{valid:o.length===0,errors:o,warnings:d,referencedNodeIds:[...r],referencedEdgeKeys:[...n],availableNodeIds:[...t.nodes.keys()],availableEdgeKeys:[...t.edges.keys()]}}var ct={linear:"linear",ease:"ease","ease-in":"ease-in","ease-out":"ease-out","ease-in-out":"ease-in-out","ease-in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","ease-in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)","ease-in-cubic":"cubic-bezier(0.32, 0, 0.67, 0)","ease-out-cubic":"cubic-bezier(0.33, 1, 0.68, 1)","ease-in-out-cubic":"cubic-bezier(0.65, 0, 0.35, 1)","ease-in-quart":"cubic-bezier(0.5, 0, 0.75, 0)","ease-out-quart":"cubic-bezier(0.25, 1, 0.5, 1)","ease-in-out-quart":"cubic-bezier(0.76, 0, 0.24, 1)","ease-in-quint":"cubic-bezier(0.64, 0, 0.78, 0)","ease-out-quint":"cubic-bezier(0.22, 1, 0.36, 1)","ease-in-out-quint":"cubic-bezier(0.83, 0, 0.17, 1)","ease-in-expo":"cubic-bezier(0.7, 0, 0.84, 0)","ease-out-expo":"cubic-bezier(0.16, 1, 0.3, 1)","ease-in-out-expo":"cubic-bezier(0.87, 0, 0.13, 1)","ease-in-circ":"cubic-bezier(0.55, 0, 1, 0.45)","ease-out-circ":"cubic-bezier(0, 0.55, 0.45, 1)","ease-in-out-circ":"cubic-bezier(0.85, 0, 0.15, 1)","ease-in-sine":"cubic-bezier(0.12, 0, 0.39, 0)","ease-out-sine":"cubic-bezier(0.61, 1, 0.88, 1)","ease-in-out-sine":"cubic-bezier(0.37, 0, 0.63, 1)","ease-in-elastic":"cubic-bezier(0.5, -0.5, 0.5, 1.5)","ease-out-elastic":"cubic-bezier(0.5, -0.5, 0.5, 1.5)","ease-in-out-elastic":"cubic-bezier(0.5, -0.75, 0.5, 1.75)","ease-in-bounce":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","ease-out-bounce":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","ease-in-out-bounce":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"};function En(t){return t?t.startsWith("cubic-bezier(")?t:ct[t]||ct.ease:ct.ease}function ut(t,e,r){let n=En(e),o=r/1e3;t.style.transition=`all ${o}s ${n}`}function mt(t,e){if(t)return t.states?.[e]?t.states[e]:t.default}var kn=/(--?>>?|--?x|--?\))/,Sn=/^(sequencediagram|participant|actor|note|loop|alt|opt|par|and|else|end|activate|deactivate|autonumber|rect|box|critical|break)\b/i;function _n(t){let e=t.trim();return kn.test(e)&&e.includes(":")&&!Sn.test(e)}function sr(t){let e=new Map,r=null,n=0;for(let o of t.split(`
`)){if(_n(o)){n+=1,r=null;continue}let d=/^\s*%%\s*narrate\s+([^\s:]+)\s*:\s*(.+?)\s*$/.exec(o);if(d){e.set(d[1],d[2]),r=d[1];continue}let m=/^\s*%%\s*narrate\s*:\s*(.+?)\s*$/.exec(o);if(m){if(n===0){r=null;continue}let g=`msg-${n-1}`;e.set(g,m[1]),r=g;continue}let u=r===null?null:/^\s*%%\s{2,}(\S.*?)\s*$/.exec(o);u&&r!==null?e.set(r,`${e.get(r)} ${u[1]}`):r=null}return e}function ar(t){let e=new Map;for(let r of t.split(`
`)){let n=/^\s*%%\s*voice\s+([^\s:]+)\s*:\s*(.+?)\s*$/.exec(r);n&&e.set(n[1],n[2])}return e}var qe={stepMs:1200,loop:!0,restOpacity:.28,accent:"#3b82f6"},lr=t=>`${(Math.round(t*1e4)/100).toFixed(2).replace(/\.?0+$/,"")}%`,Mn=t=>t.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]);function An(t,e,r){let n=[],o=0;for(let d of e)switch(d.type){case"node":{if(!t.nodes.has(d.id))throw new N("UNKNOWN_NODE",`No node "${d.id}" in this diagram`,[d.id]);let m=d.ms??r;n.push({key:d.id,from:o,to:o+m}),o+=m;break}case"edge":{let m=d.key??`${d.from}->${d.to}`;if(!t.edges.has(m))throw new N("UNKNOWN_EDGE",`No edge "${m}" in this diagram`,[m]);let u=d.ms??r;n.push({key:m,from:o,to:o+u}),o+=u;break}case"wait":o+=d.ms;break;case"reset":break;default:return de(d,"Unhandled step")}return{turns:n,total:o}}function Ln(t,e,r,n){let{restOpacity:o,accent:d}=n,m=`drop-shadow(0 0 6px ${d})`,u=[];t[0].from>0&&u.push(`0%{opacity:${o};filter:none}`);for(let g of t)u.push(`${lr(g.from/e)}{opacity:1;filter:${m}}`),g.to<e&&u.push(`${lr(g.to/e)}{opacity:1;filter:none}`);return`@keyframes mfp-${r}{${u.join("")}}`}function Tn(t){for(let r of["transform","transform-origin","width","height","max-width"])t.style.removeProperty(r);let e=t.viewBox?.baseVal?.width;e&&(t.style.maxWidth=`${e}px`);for(let r of t.querySelectorAll('[class*="mf-"]')){for(let n of[...r.classList])(n.startsWith("mf-")||n.startsWith("mfp-"))&&r.classList.remove(n);for(let n of[r,...r.querySelectorAll("[style]")])n.style.removeProperty("fill"),n.style.removeProperty("stroke"),n.style.removeProperty("stroke-width"),n.getAttribute("style")||n.removeAttribute("style")}}function dr({index:t,steps:e},r={}){let n={stepMs:r.stepMs??qe.stepMs,loop:r.loop??qe.loop,restOpacity:r.restOpacity??qe.restOpacity,accent:r.accent??qe.accent,title:r.title??""},{turns:o,total:d}=An(t,e,n.stepMs);if(d===0)throw new N("UNKNOWN_NODE","A scenario needs at least one step that takes time");let m=t.svg.cloneNode(!0);for(let T of m.querySelectorAll("script"))T.remove();Tn(m),m.setAttribute("xmlns","http://www.w3.org/2000/svg"),m.setAttribute("role","img");let u=new Map;for(let T of o){let M=u.get(T.key);if(M){M.push(T);continue}u.set(T.key,[T]);let O=t.nodes.get(T.key)??t.edges.get(T.key);(O&&Cn(m,t.svg,O))?.setAttribute("data-mfp",T.key)}let g=n.loop?"infinite":"1 forwards",p=[...u].map(([T,M],O)=>`${`[data-mfp="${T}"]`}{animation:mfp-${O} ${d}ms step-end ${g}}`+Ln(M,d,O,n)),A=`<style>[data-mfp]{opacity:${n.restOpacity}}`+p.join("")+"@media (prefers-reduced-motion: reduce){[data-mfp]{animation:none;opacity:1;filter:none}}</style>",C=n.title?`<title>${Mn(n.title)}</title>`:"",V=m.innerHTML;return m.innerHTML="",`${m.outerHTML.replace(/<\/svg>$/,"")}${C}${A}${V}</svg>`}function Cn(t,e,r){let n=[];for(let d=r;d&&d!==e;d=d.parentElement){let m=d.parentElement;if(!m)return;n.unshift([...m.children].indexOf(d))}let o=t;for(let d of n){let m=o.children[d];if(!m)return;o=m}return o}function cr(){let t=globalThis.mermaid;if(!t)throw new N("PARSE_FAILED","Mermaid is not loaded on this page");return t}var Pn=.6;function xe(t){return new Promise(e=>setTimeout(e,t))}function ur(t){return!!t&&t.tagName.toLowerCase()==="svg"}function He(t,e){let r=[];for(let n of Array.from(t.classList))n.startsWith(e)&&r.push(n);r.forEach(n=>t.classList.remove(n))}function Be(t,e){return t.matches(e)?t:t.querySelector(e)}var mr="rect, polygon, ellipse, circle, path",pr="path, line";function Nn(t,e,r,n,o){let d=Be(t,mr),m=t.querySelector("text, tspan"),u=e.states[r]??{};n&&o&&ut(t,n,o),d&&(u.fill&&(d.style.fill=u.fill),u.stroke&&(d.style.stroke=u.stroke)),m&&u.text&&(m.style.fill=u.text)}function Vn(t){let e=Be(t,mr),r=t.querySelector("text, tspan");e&&(e.style.fill="",e.style.stroke=""),r&&(r.style.fill="")}function On(t,e,r,n,o){let d=Be(t,pr),m=e.states[r]??{};d&&(n&&o&&ut(t,n,o),m.edge&&(d.style.stroke=m.edge),d.style.strokeWidth="")}function Rn(t){let e=Be(t,pr);e&&(e.style.stroke="",e.style.strokeWidth="")}function fr(t){le();let e=Zt(t.theme),r=t.root,n=t.dim??"others",o=t.visited!==!1,d=t.timing?.stepMs??1200,m=t.easing;function u(i,a){r.dispatchEvent(new CustomEvent(`mfp:${i}`,{bubbles:!0,detail:a}))}let g=!1,p=null,A=!1,C=0,V=t.speed&&Number.isFinite(t.speed)&&t.speed>0?t.speed:1;function D(i){!Number.isFinite(i)||i<=0||i!==V&&(V=i,u("speedchange",{speed:i}))}let T=null,M="idle";function O(i){M!==i&&(M=i,u("statechange",{status:M}))}let R=null,j=null,_e=null,Sr=t.viewport?.minScale??.25,kt=t.viewport?.maxScale??4,St=t.viewport?.minReadableScale??.6,Me=t.viewport?.zoomStep??.2,_r=!0,Mr=!0,Ar=!0,_t=!0,Mt=t.viewport?.syncUrl===!0,Q=t.viewport?.autoCenterActive===!0,At=t.viewport?.showMinimap===!0,me=t.viewport?.focusPadding??48,Lt=t.viewport?.scale,I=null,We=null,b={scale:1,x:0,y:0},Ae=null,Qe=null,Ye=null,Tt=null,ee=null,B=null,pe=null,Ct=null,Pt=null,Le=null,fe=t.mode??"sequential",w=null,X=-1,E=[],te=!1,F=new Set,ge=new Map;t.narrationTarget&&(typeof t.narrationTarget=="string"?(j=document.querySelector(t.narrationTarget),!j&&t.debug&&console.warn(`[mermaid-flow-player] Narration target not found: ${t.narrationTarget}`)):j=t.narrationTarget);function he(){return p?.svg??null}function Lr(){if(!Mt||typeof window>"u")return null;let i=new URLSearchParams(window.location.search),a=[i.get("zoom"),i.get("x"),i.get("y")];if(a.some(f=>f===null||f.trim()===""))return null;let[s,l,c]=a.map(Number);return[s,l,c].some(f=>Number.isNaN(f))?null:{scale:re(s),x:l,y:c}}function Tr(){if(!Mt||typeof window>"u")return;let i=new URL(window.location.href);i.searchParams.set("zoom",b.scale.toFixed(3)),i.searchParams.set("x",Math.round(b.x).toString()),i.searchParams.set("y",Math.round(b.y).toString()),window.history.replaceState({},"",i)}function Cr(){let i=I,a=Qe,s=he();if(!At||!i||!a||!s)return;let{width:l,height:c}=Te(s);if(l<=0||c<=0)return;let f=i.clientWidth/b.scale,h=i.clientHeight/b.scale,x=Math.max(0,-b.x/b.scale),v=Math.max(0,-b.y/b.scale);a.style.left=`${x/l*100}%`,a.style.top=`${v/c*100}%`,a.style.width=`${Math.min(100,f/l*100)}%`,a.style.height=`${Math.min(100,h/c*100)}%`;let k=a.parentElement;if(k){let S=f>=l-1&&h>=c-1;k.classList.toggle("mfp-minimap--idle",S)}}function G(){let i=he();if(i){if(i.style.transformOrigin="0 0",i.style.transform=`translate(${b.x}px, ${b.y}px) scale(${b.scale})`,Cr(),Pr(i),Tr(),Ye&&ee){let a=Math.abs(b.scale-ee.scale)>.01||Math.abs(b.x-ee.x)>1||Math.abs(b.y-ee.y)>1;Ye.hidden=!a}Nr(i),u("viewport-change",{...b})}}function Pr(i){let a=I;if(!a)return;let{width:s}=Te(i),l=s*b.scale+b.x;a.classList.toggle("mfp-viewport--clip-start",b.x<-1),a.classList.toggle("mfp-viewport--clip-end",l>a.clientWidth+1)}function Nr(i){let a=Tt,s=I;if(!a||!s)return;let{width:l,height:c}=Te(i),{scale:f,x:h,y:x}=b,v=h<-1||x<-1||l*f+h>s.clientWidth+1||c*f+x>s.clientHeight+1,k=B!==null&&!B.hidden;a.hidden=k||!(f<.99||v)}function Te(i){let a=i.viewBox?.baseVal;if(a&&a.width>0&&a.height>0)return{width:a.width,height:a.height};let s=Number(i.getAttribute("width"))||i.width?.baseVal?.value||i.getBoundingClientRect().width||0,l=Number(i.getAttribute("height"))||i.height?.baseVal?.value||i.getBoundingClientRect().height||0;return{width:s,height:l}}function re(i){return Math.min(kt,Math.max(Sr,i))}function Vr(i,a,s,l,c=b.scale){let f=I;if(!f)return;let h=re(c),x=f.clientWidth,v=f.clientHeight;b={scale:h,x:x/2-(i+s/2)*h,y:v/2-(a+l/2)*h},G()}function U(i,a){let s=p?.nodes.get(i);if(!s)return;let l=s.getBBox(),c=typeof s.getCTM=="function"?s.getCTM():null,f=c?{x:c.a*l.x+c.c*l.y+c.e,y:c.b*l.x+c.d*l.y+c.f,width:l.width*c.a,height:l.height*c.d}:l,h=a?.scale??Math.min(kt,Math.max(b.scale,1.15));Vr(f.x-me,f.y-me,f.width+me*2,f.height+me*2,h)}function Or(i){!Q||i.type!=="node"||U(i.id)}function Ce(){let i=I;if(i&&typeof window>"u"){i.style.width="",i.style.maxWidth="",i.style.marginLeft="";return}}function J(){let i=he(),a=I;if(!i||!a)return;let{width:s,height:l}=Te(i),c=a.clientWidth,f=i.parentElement;if(s<=0||c<=0){b={scale:1,x:0,y:0},G();return}if(i.style.width=`${s}px`,i.style.maxWidth="none",l>0&&(i.style.height=`${l}px`),B&&!B.hidden&&l>0){let _=a.clientHeight,L=me,$=re(Math.min((c-L)/s,(_-L)/l,2));f&&(f.style.height="100%"),b={scale:$,x:Math.max(0,(c-s*$)/2),y:Math.max(0,(_-l*$)/2)},ee={...b},G();return}let h=Math.min(1,c/s),x=c/(s*St),v=re(Lt!==void 0?Lt:x>=Pn?Math.max(h,St):h),k=s*v,S=l*v;f&&(f.style.height=l>0?`${Math.ceil(S)}px`:""),b={scale:v,x:Math.max(0,(c-k)/2),y:0},ee={...b},G()}function Rr(){b={scale:1,x:0,y:0},G()}function Xe(i,a,s){let l=I;if(!l)return;let c=l.getBoundingClientRect(),f=a??c.left+c.width/2,h=s??c.top+c.height/2,x=re(b.scale*i),v=x/b.scale;b={scale:x,x:f-c.left-(f-c.left-b.x)*v,y:h-c.top-(h-c.top-b.y)*v},G()}function Nt(){Xe(1+Me)}function Vt(){Xe(1/(1+Me))}async function Ir(){let i=I;return!i||typeof document>"u"?!1:document.fullscreenElement===i?(await document.exitFullscreen?.(),!1):(document.fullscreenElement&&await document.exitFullscreen?.(),typeof i.requestFullscreen=="function"?(await i.requestFullscreen(),!0):!1)}function Gr(){if(typeof document>"u")return null;if(B)return B;let i=document.createElement("div");return i.className="mfp-focus-modal",i.hidden=!0,i.innerHTML=`
      <div class="mfp-focus-backdrop" data-mfp-close="true"></div>
      <div class="mfp-focus-dialog" role="dialog" aria-modal="true" aria-label="Focused diagram view">
        <div class="mfp-focus-header">
          <button type="button" class="mfp-focus-close" aria-label="Close focused diagram view" title="Close (Esc)">Close</button>
        </div>
        <div class="mfp-focus-content"></div>
      </div>
    `,i.addEventListener("click",a=>{let s=a.target;(s?.dataset.mfpClose==="true"||s?.classList.contains("mfp-focus-close"))&&Pe()}),pe=a=>{a.key==="Escape"&&!i.hidden&&(a.preventDefault(),Pe())},i.addEventListener("keydown",a=>{if(a.key!=="Tab")return;let s=[...i.querySelectorAll("button, [href], input, select, textarea, [tabindex]")].filter(f=>f.tabIndex>=0&&!f.hidden&&f.getClientRects().length>0),l=s[0],c=s[s.length-1];!l||!c||(a.shiftKey&&document.activeElement===l?(a.preventDefault(),c.focus()):!a.shiftKey&&document.activeElement===c&&(a.preventDefault(),l.focus()))}),document.addEventListener("keydown",pe),document.body.appendChild(i),B=i,i}function Je(){let i=I,a=Gr(),s=a?.querySelector(".mfp-focus-content");!i||!a||!s||a.hidden&&(Le=document.activeElement instanceof HTMLElement?document.activeElement:null,Ct=i.parentNode,Pt=i.nextSibling,s.appendChild(i),a.hidden=!1,document.body.classList.add("mfp-focus-open"),Ce(),J(),a.querySelector(".mfp-focus-close")?.focus())}function Pe(){let i=I,a=B;if(!i||!a||a.hidden)return;let s=Ct;s&&s.insertBefore(i,Pt),a.hidden=!0,document.body.classList.remove("mfp-focus-open"),Ce(),J(),Le?.isConnected&&Le.focus(),Le=null}function Ne(){let i=he();return i?new XMLSerializer().serializeToString(i):null}async function $r(){let i=Ne();return!i||typeof navigator>"u"||!navigator.clipboard?.writeText?!1:(await navigator.clipboard.writeText(i),!0)}function Fr(i="diagram.svg"){let a=Ne();if(!a||typeof document>"u"||typeof URL>"u")return!1;let s=new Blob([a],{type:"image/svg+xml;charset=utf-8"}),l=URL.createObjectURL(s),c=document.createElement("a");return c.href=l,c.download=i,c.click(),URL.revokeObjectURL(l),!0}async function zr(i="diagram.png",a){let s=he(),l=Ne();if(!s||!l||typeof document>"u"||typeof URL>"u")return!1;let c=a?.scale??2,f=s.viewBox?.baseVal,h=s.getBoundingClientRect(),x=Math.max(1,Math.round((f?.width||h.width||800)*c)),v=Math.max(1,Math.round((f?.height||h.height||600)*c)),k=URL.createObjectURL(new Blob([l],{type:"image/svg+xml;charset=utf-8"}));try{let S=new Image;await new Promise((oe,Ge)=>{S.onload=()=>oe(),S.onerror=()=>Ge(new Error("Failed to rasterize SVG")),S.src=k});let _=document.createElement("canvas");_.width=x,_.height=v;let L=_.getContext("2d");if(!L)return!1;L.drawImage(S,0,0,x,v);let $=await new Promise(oe=>_.toBlob(oe,"image/png"));if(!$)return!1;let K=URL.createObjectURL($),ie=document.createElement("a");return ie.href=K,ie.download=i,ie.click(),URL.revokeObjectURL(K),!0}catch{return!1}finally{URL.revokeObjectURL(k)}}function Dr(){let i=Ne();if(!i||typeof window>"u"||typeof Blob>"u"||typeof URL>"u")return!1;let a=new Blob([i],{type:"image/svg+xml;charset=utf-8"}),s=URL.createObjectURL(a);return window.open(s,"_blank","noopener,noreferrer"),!0}function qr(i){let a=i.trim().toLowerCase();if(!p)return[];if(!a){for(let l of p.nodes.values())l.classList.remove("mfp-node-search-match");return[]}let s=[];for(let[l,c]of p.nodes){let f=c.textContent?.toLowerCase()??"",h=l.toLowerCase().includes(a)||f.includes(a);c.classList.toggle("mfp-node-search-match",h),h&&s.push(l)}return s}function Ot(i){if(I&&We&&I.contains(i)){G();return}let a=i.parentElement;if(!a)return;let s=document.createElement("div");s.className="mfp-viewport",s.setAttribute("role","region"),s.setAttribute("aria-label","Diagram viewport \u2014 Ctrl+scroll to zoom, drag to pan");let l=document.createElement("div");if(l.className="mfp-viewport-canvas",l.setAttribute("role","img"),l.setAttribute("aria-label","Mermaid diagram"),s.appendChild(l),a.insertBefore(s,i),l.appendChild(i),Ce(),At){let y=document.createElement("div");y.className="mfp-minimap";let P=i.cloneNode(!0);P.querySelectorAll("[style*='transform']").forEach(it=>{it.style.transform=""}),P.style.transform="",P.style.width="",P.style.height="",P.style.maxWidth="",y.appendChild(P);let H=document.createElement("div");H.className="mfp-minimap-rect",y.appendChild(H),s.appendChild(y),Qe=H}let c=document.createElement("button");c.className="mfp-fit-btn",c.setAttribute("type","button"),c.setAttribute("aria-label","Reset view"),c.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5"/></svg>',c.hidden=!0,c.onclick=()=>J();let f=document.createElement("button");f.className="mfp-expand-btn",f.setAttribute("type","button"),f.setAttribute("aria-label","Open larger view"),f.setAttribute("aria-haspopup","dialog"),f.setAttribute("title","Open larger view (F)"),f.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2H14v4.5M14 2L9 7M6.5 14H2V9.5M2 14l5-5"/></svg>',f.hidden=!0,f.onclick=()=>Je();let h=document.createElement("div");h.className="mfp-viewport-actions",h.append(c,f),s.appendChild(h),Ye=c,Tt=f;let x=0,v=0,k=0,S=0,_=!1,L=new Map,$=0,K=b.scale,ie=y=>{if(!_r||!y.ctrlKey&&!y.metaKey)return;y.preventDefault();let P=y.deltaY<0?1+Me:1/(1+Me);Xe(P,y.clientX,y.clientY)},oe=y=>{if(_t&&y.pointerType==="touch"){if(L.set(y.pointerId,{x:y.clientX,y:y.clientY}),L.size===2){let[P,H]=Array.from(L.values());$=Math.hypot(P.x-H.x,P.y-H.y),K=b.scale}return}Mr&&(_=!0,x=y.clientX,v=y.clientY,k=b.x,S=b.y,s.classList.add("mfp-viewport-dragging"))},Ge=y=>{if(_t&&L.has(y.pointerId)&&(L.set(y.pointerId,{x:y.clientX,y:y.clientY}),L.size===2)){let[P,H]=Array.from(L.values()),it=Math.hypot(P.x-H.x,P.y-H.y);if($>0){let Fe=s.getBoundingClientRect(),Qt=(P.x+H.x)/2,Yt=(P.y+H.y)/2,Xt=re(it/$*K),Jt=Xt/b.scale;b={scale:Xt,x:Qt-Fe.left-(Qt-Fe.left-b.x)*Jt,y:Yt-Fe.top-(Yt-Fe.top-b.y)*Jt},G()}return}_&&(b={...b,x:k+(y.clientX-x),y:S+(y.clientY-v)},G())},fn=()=>{_=!1,s.classList.remove("mfp-viewport-dragging")},$e=y=>{L.delete(y.pointerId),fn()},jt=y=>{if(!Ar)return;let P=48;(y.key==="ArrowLeft"||y.key==="ArrowRight")&&!y.shiftKey||(y.key==="+"||y.key==="="?(y.preventDefault(),Nt()):y.key==="-"?(y.preventDefault(),Vt()):y.key==="0"?(y.preventDefault(),J()):y.key==="ArrowLeft"?(y.preventDefault(),b={...b,x:b.x+P},G()):y.key==="ArrowRight"?(y.preventDefault(),b={...b,x:b.x-P},G()):y.key==="ArrowUp"?(y.preventDefault(),b={...b,y:b.y+P},G()):y.key==="ArrowDown"?(y.preventDefault(),b={...b,y:b.y-P},G()):(y.key==="f"||y.key==="F")&&(y.preventDefault(),Je()))};s.addEventListener("wheel",ie,{passive:!1}),s.addEventListener("pointerdown",oe),s.addEventListener("keydown",jt),s.tabIndex=0,window.addEventListener("pointermove",Ge),window.addEventListener("pointerup",$e),window.addEventListener("pointercancel",$e);let nt=()=>{Ce(),J()};window.addEventListener("resize",nt);let Ut=s.clientWidth,se=0,Kt=typeof ResizeObserver>"u"?null:new ResizeObserver(()=>{let y=s.clientWidth;y!==Ut&&(Ut=y,se&&cancelAnimationFrame(se),se=requestAnimationFrame(()=>{se=0,nt()}))});Kt?.observe(s),Ae?.(),Ae=()=>{Kt?.disconnect(),se&&cancelAnimationFrame(se),s.removeEventListener("wheel",ie),s.removeEventListener("pointerdown",oe),s.removeEventListener("keydown",jt),window.removeEventListener("pointermove",Ge),window.removeEventListener("pointerup",$e),window.removeEventListener("pointercancel",$e),window.removeEventListener("resize",nt)},I=s,We=l;let Wt=Lr();Wt?(b=Wt,G()):J()}async function Hr(){if(g)throw new Error("Player destroyed.");if(p?.svg&&r.contains(p.svg))return;let i=r.querySelector("svg");if(ur(i)){if(p=await lt(i,t.source,cr()),Ot(i),u("ready",{nodeCount:p.nodes.size,edgeCount:p.edges.size,diagramType:p.type}),fe==="interactive"&&!w){let a=Array.from(p.nodes.keys())[0];a&&(w=a,E.length=0,E.push(a),Y(),Q&&U(a,{scale:1}))}return}if(await new Promise((a,s)=>{R?.disconnect(),R=new MutationObserver(()=>{let l=r.querySelector("svg");ur(l)&&(R?.disconnect(),R=null,lt(l,t.source,cr()).then(c=>{p=c,Ot(l),a()},s))}),R.observe(r,{childList:!0,subtree:!0})}),p&&u("ready",{nodeCount:p.nodes.size,edgeCount:p.edges.size,diagramType:p.type}),fe==="interactive"&&!w&&p){let a=Array.from(p.nodes.keys())[0];a&&(w=a,E.length=0,E.push(a),Y())}}function Ve(){return g?Promise.reject(new Error("Player destroyed.")):(_e||(_e=Hr()),_e)}function q(){if(!p)throw new Error("Not ready yet. Call await player.ready().");return p}function ve(i){if(n==="none")return;let{nodes:a,edges:s}=q();for(let l of a.values())l.classList.toggle(e.classes.dim,i);for(let l of s.values())l.classList.toggle(e.classes.dim,i)}function Oe(i){let{nodes:a,edges:s}=q();for(let l of a.values())l.classList.remove(e.classes.pulse),i||Vn(l),He(l,e.classes.nodeStatePrefix);for(let l of s.values())i||Rn(l),He(l,e.classes.edgeStatePrefix)}function z(i,a,s){let{nodes:l}=q(),c=l.get(i);if(!c){t.debug&&console.warn("[mermaid-flow-player] node not found:",i);return}s?.dimOthers!==!1&&ve(!0),c.classList.remove(e.classes.dim),He(c,e.classes.nodeStatePrefix),c.classList.add(`${e.classes.nodeStatePrefix}${a}`);let f=s?.easing||mt(m,a),h=s?.duration||d;Nn(c,e,a,f,h),c.classList.toggle(e.classes.pulse,!!s?.pulse),u("stateChange",{type:"node",id:i,state:a})}function Z(i,a,s,l){let{edges:c}=q(),f=l?.key??`${i}->${a}`,h=c.get(f);if(!h){t.debug&&console.warn("[mermaid-flow-player] edge not found:",f);return}l?.dimOthers!==!1&&ve(!0),h.classList.remove(e.classes.dim),He(h,e.classes.edgeStatePrefix),h.classList.add(`${e.classes.edgeStatePrefix}${s}`);let x=l?.easing||mt(m,s),v=l?.duration||d;On(h,e,s,x,v),u("stateChange",{type:"edge",id:f,state:s})}function Re(i){if(!p)return;let a=!!i?.keepVisited;if(ve(!1),Oe(a),a||p.svg.querySelectorAll(`.${e.classes.dim}`).forEach(s=>s.classList.remove(e.classes.dim)),w=null,X=-1,E.length=0,te=!1,F.clear(),Rt(),fe==="interactive"&&p&&!g){let s=Array.from(p.nodes.keys())[0];s&&(w=s,E.push(s),Y(),Q&&U(s,{scale:1}))}u("reset")}function Y(){if(fe!=="interactive"||!p)return;let{nodes:i,edges:a}=p;for(let[l,c]of ge)l.removeEventListener("click",c);ge.clear();let s=[];if(w){for(let l of a.keys())if(l.startsWith(`${w}->`)){let c=W(l)[1];c&&s.push(c)}}for(let[l,c]of i)if(c.classList.remove("mf-interactive-current","mf-interactive-available","mf-interactive-visited","mf-interactive-dimmed","mf-state-dimmed",e.classes.dim),c.style.cursor="",l===w)c.classList.add("mf-interactive-current");else if(s.includes(l)){c.classList.add("mf-interactive-available");let f=(h=>x=>{x.stopPropagation();let v=w;w&&F.add(w),w=h,E.push(h),Y(),t.hooks?.onStepStart?.({type:"node",id:h},void 0),u("navigate",{from:v,to:h}),Q&&U(h),be()})(l);c.addEventListener("click",f),ge.set(c,f)}else F.has(l)?c.classList.add("mf-interactive-visited"):c.classList.add("mf-interactive-dimmed");for(let[l,c]of a){c.classList.remove("mf-interactive-edge-active","mf-interactive-edge-visited","mf-interactive-edge-dimmed","mf-state-dimmed",e.classes.dim);let[f,h]=W(l);f===w&&s.includes(h)?c.classList.add("mf-interactive-edge-active"):F.has(f)&&(F.has(h)||h===w)?c.classList.add("mf-interactive-edge-visited"):c.classList.add("mf-interactive-edge-dimmed")}w&&s.length===0&&(F.add(w),u("done")),w&&s.length>1&&u("pathChoice",{paths:s})}function Rt(){if(p){for(let[i,a]of ge)i.removeEventListener("click",a);ge.clear();for(let i of p.nodes.values())i.classList.remove("mf-interactive-current","mf-interactive-available","mf-interactive-visited","mf-interactive-dimmed"),i.style.cursor="";for(let i of p.edges.values())i.classList.remove("mf-interactive-edge-active","mf-interactive-edge-visited","mf-interactive-edge-dimmed")}}async function Ze(i,a=()=>A){let s=Date.now();for(;Date.now()-s<i;){if(a())return;for(;M==="paused";){if(a())return;await xe(50)}await xe(20)}}async function Br(i,a){await Ve();let s=++C;a?.speed!==void 0&&D(a.speed),A=!1,O("playing");let l=()=>A||C!==s,c=Array.isArray(i)?i.length:0;u("play",{stepCount:c});let f=async()=>{if(typeof i=="function"){await i(Bt);return}let h=null,x=0;T={current:0,total:i.length};for(let v of i){if(l())return;let k=v.type==="node"?v.note:void 0,S=v.type==="node"?v.note??et(v.id):v.type==="edge"?qt(v.from,v.to,v.key):void 0;if(j&&S&&(j.textContent=S),t.hooks?.onStepStart?.(v,k),u("step",{step:v,index:x++,narration:k,text:S}),T={current:x,total:i.length},u("progress",{...T}),Or(v),v.type==="reset"&&(Re({keepVisited:!!v.keepVisited}),h=null),v.type==="wait"&&await Ze(v.ms/V,l),v.type==="edge"&&(Z(v.from,v.to,v.state??"active",{dimOthers:!0,easing:v.easing,duration:v.ms??d,key:v.key}),await Ze((v.ms??d)/V,l)),v.type==="node"){let _=v.dimOthers??!0;o&&h&&h!==v.id&&z(h,"visited",{pulse:!1,dimOthers:!1}),z(v.id,v.state??"active",{pulse:v.pulse??!0,dimOthers:_,easing:v.easing,duration:v.ms??d}),h=v.id,w=v.id,E[E.length-1]!==v.id&&E.push(v.id),await Ze((v.ms??d)/V,l)}if(v.type==="node"||v.type==="edge")for(;t.holdStep?.()&&!l();)await xe(50);t.hooks?.onStepEnd?.(v)}!l()&&h&&z(h,"visited",{pulse:!1,dimOthers:!1})};try{do await f();while(!A&&a?.loop);C===s&&(O("idle"),u("done"))}catch(h){throw t.hooks?.onError?.(h),C===s&&O("idle"),h}}function jr(){M==="playing"&&O("paused"),u("pause")}function Ur(){M==="paused"&&O("playing"),u("resume")}function Kr(){return M==="paused"}function Wr(){return M}function It(){M!=="idle"&&(A=!0,C++,O("idle"))}function Gt(){A=!0,O("idle"),p&&Oe(!0)}function Qr(){return p}function Yr(){g=!0,Gt(),Pe(),Rt(),R?.disconnect(),R=null,Ae?.(),Ae=null,p&&Re({keepVisited:!1}),B?.remove(),B=null,pe&&(document.removeEventListener("keydown",pe),pe=null),p=null,I=null,We=null,Qe=null,_e=null}function Xr(...i){return i.map(a=>({type:"node",id:a}))}function Jr(i){let a=p;if(!a)throw new Error("Not ready. Call await player.ready() first.");let s=dt(a,i.map(l=>({type:"node",id:l})));if(!s.valid){let l=s.errors.map(h=>h.id).join(", "),c=s.availableNodeIds.slice(0,20).join(", "),f=s.availableNodeIds.length>20?` \u2026 and ${s.availableNodeIds.length-20} more`:"";throw new Error(`[mermaid-flow-player] Missing node id(s): ${l}. Available: ${c}${f}.`)}}function Zr(i){let a=p;return a?dt(a,i):{valid:!1,errors:[{kind:"missing_node",id:"",message:"Not ready. Call await player.ready() first."}],warnings:[],referencedNodeIds:[],referencedEdgeKeys:[],availableNodeIds:[],availableEdgeKeys:[]}}function en(i,a){return{type:"node",id:i,note:a?.note,state:a?.state,ms:a?.ms}}function tn(i,a,s){return{type:"edge",from:i,to:a,state:s?.state,ms:s?.ms}}function rn(i,a){return{type:"node",id:i,note:a?.note}}function nn(i,a){return{type:"node",id:i,note:a?.note,state:a?.state,ms:a?.ms}}function on(i,a,s){return{type:"edge",from:i,to:a,state:s?.state,ms:s?.ms}}let ne;function sn(){if(ne!==void 0)return ne;ne=null;let i=t.source;if(!i||p?.type!=="sequence")return ne;let a=new Map,s=0,l=/(--?>>?|--?x|--?\))/;for(let f of i.split(`
`)){let h=f.trim(),x=h.match(/^note\s+(?:over|left of|right of)\b[^:]*:\s*(.+)$/i);if(x){s>0&&a.set(s-1,x[1].trim());continue}l.test(h)&&h.includes(":")&&!/^(sequencediagram|participant|actor|note|loop|alt|opt|par|and|else|end|activate|deactivate|autonumber|rect|box|critical|break)\b/i.test(h)&&(s+=1)}let c=p.edges.size;return s===c&&a.size>0&&(ne=a),ne}let Ie;function $t(){return Ie||(Ie=sr(t.source??""),an(Ie)),Ie}let Ft=!1;function an(i){if(!t.debug||Ft||!p||i.size===0)return;Ft=!0;let a=[...i.keys()].filter(s=>!p?.nodes.has(s));a.length!==0&&console.warn(`[mermaid-flow-player] %% narrate targets no such node: ${a.join(", ")}. Available ids: ${[...p.nodes.keys()].join(", ")}`)}function et(i){let a=$t().get(i);return a||(p?.graph.nodes.find(s=>s.id===i)?.label??"")}function tt(){return p?Array.from(p.nodes.keys()):[]}function be(){if(!w)return;let i=Math.max(0,E.length-1),s=(E.length>=2?qt(E[E.length-2],w):void 0)||et(w);j&&s&&(j.textContent=s),u("step",{step:{type:"node",id:w},index:i,node:w,text:s,narration:s})}function zt(i){let{edges:a}=q(),s=[...a.keys()],l=Math.max(0,Math.min(i,s.length-1));if(s.length===0)return;X=l,ve(!1),Oe(!1),F.clear();for(let v=0;v<=l;v++){let k=s[v],[S,_]=W(k);if(!S||!_)continue;let L=v===l;Z(S,_,L?"active":"visited",{dimOthers:!1,key:k}),(o||L)&&(z(_,L?"active":"visited",{pulse:L,dimOthers:!1}),F.add(_))}let c=s[l],[f,h]=W(c);w=h||null,E.length=0,h&&E.push(h);let x=rt(c,l);j&&x&&(j.textContent=x),u("step",{step:{type:"edge",from:f,to:h,key:c},index:l,node:c,text:x,narration:x})}async function ln(){if(await Ve(),It(),q().type==="sequence"){zt(X+1);return}let{nodes:i}=q();if(!w){let c=tt()[0]??Array.from(i.keys())[0];if(!c)return;w=c,E.length=0,E.push(c),z(w,"active",{pulse:!0,dimOthers:!0}),Y(),Q&&U(c,{scale:1}),be();return}let a=Dt();if(a.length>1&&!te&&fe==="interactive"){t.hooks?.onPathChoice?.(a);return}let s=null,l=a[0];if(l&&(s=W(l)[1]||null),!s&&q().edges.size===0){let c=tt(),f=c.indexOf(w);f>=0&&f<c.length-1&&(s=c[f+1])}if(!s){Re();return}if(w&&F.add(w),o&&w&&z(w,"visited",{pulse:!1,dimOthers:!1}),o&&E.length>=2){let c=E[E.length-2],f=E[E.length-1];Z(c,f,"visited",{dimOthers:!1})}l&&(Z(w,s,"active"),await xe(d)),w=s,E.push(s),z(w,"active",{pulse:!0,dimOthers:!0}),te=!1,Y(),Q&&U(s),be()}async function dn(){if(await Ve(),It(),q().type==="sequence"){X>0&&zt(X-1);return}if(E.length<=1)return;let i=E.pop(),a=E[E.length-1];if(!i||!a)return;w=a,te=!1,ve(!1),Oe(!1),F.clear();let s=E.slice(0,-1);for(let l of s)F.add(l),o&&z(l,"visited",{pulse:!1,dimOthers:!1});w&&(z(w,"active",{pulse:!0,dimOthers:!0}),Q&&U(w,{scale:1}));for(let l=0;l<E.length-1;l++){let c=E[l],f=E[l+1],h=l===E.length-2;Z(c,f,h?"active":"visited",{dimOthers:!1})}Y(),u("previous",{from:i,to:a}),be()}function Dt(){if(!p||!w)return[];let i=[];for(let a of p.edges.keys())a.startsWith(`${w}->`)&&i.push(a);return i}async function cn(i){let{edges:a}=q();for(let c of a.values())c.style.cursor="",c.classList.remove("mf-interactive-choice");let[s,l]=W(i);if(!s||!l||s!==w){t.debug&&console.warn("[mermaid-flow-player] Invalid path selection:",i);return}te=!0,s&&F.add(s),Z(s,l,"active"),await xe(d),o&&z(s,"visited",{pulse:!1,dimOthers:!1}),w=l,E.push(l),z(l,"active",{pulse:!0,dimOthers:!0}),te=!1,Y(),Q&&U(l),be()}function un(){return p?.type==="sequence"&&X>=0?[...p.edges.keys()][X]??null:w}function mn(){if(!p)return[];let i=p;if(i.type==="sequence")return[...i.edges.keys()].map((l,c)=>({index:c,node:l,text:rt(l,c),speaker:W(l)[0]}));let a=Ht();return(i.edges.size>0&&a[0]?.length?a[0]:tt()).map((l,c)=>({index:c,node:l,text:et(l),speaker:l}))}function pn(i){return p?[...p.edges.keys()].indexOf(i):-1}function qt(i,a,s){if(p?.type!=="sequence")return;let l=s??`${i}->${a}`,c=pn(l);return c<0?void 0:rt(l,c)}function rt(i,a){let s=$t(),l=s.get(i)??s.get(`msg-${a}`);if(l)return l;let c=sn()?.get(a);return c||(p?.graph.edges[a]?.label??"")}function Ht(){if(!p)return[];let{nodes:i,edges:a}=p;if(a.size===0)return[];let s=new Map,l=new Set;for(let k of a.keys()){let[S,_]=W(k);!S||!_||(s.has(S)||s.set(S,[]),s.get(S).includes(_)||s.get(S).push(_),l.add(_))}let c=Array.from(i.keys()),f=c.filter(k=>!l.has(k));f.length===0&&c.length>0&&f.push(c[0]);let h=new Set(c.filter(k=>!s.has(k)||s.get(k).length===0)),x=[];function v(k,S,_){S.push(k),_.add(k);let L=s.get(k);if(!L||L.length===0||h.has(k))x.push([...S]);else{let $=L.filter(K=>!_.has(K));if($.length===0)x.push([...S]);else for(let K of $)v(K,S,_)}S.pop(),_.delete(k)}for(let k of f)v(k,[],new Set);return x}let Bt={ready:Ve,reset:Re,setStateNode:z,setStateEdge:Z,play:Br,pause:jr,resume:Ur,isPaused:Kr,getStatus:Wr,stop:Gt,index:Qr,destroy:Yr,path:Xr,assertIds:Jr,validateScenario:Zr,participant:en,message:tn,activation:rn,state:nn,transition:on,nextStep:ln,previousStep:dn,getAvailablePaths:Dt,selectPath:cn,getCurrentNode:un,getSteps:mn,computeAllPaths:Ht,zoomIn:Nt,zoomOut:Vt,fitView:J,resetView:Rr,getViewportState:()=>({...b}),toggleFullscreen:Ir,openFocusView:Je,closeFocusView:Pe,focusNode:U,findNodes:qr,toAnimatedSvg:(i,a)=>dr({index:q(),steps:i},{stepMs:d,...a}),copySvg:$r,downloadSvg:Fr,downloadPng:zr,openSvg:Dr,setSpeed:D,getSpeed:()=>V,getProgress:()=>T?{...T}:null};return Bt}function In(t){return!!t&&typeof t=="object"&&"str"in t&&typeof t.str=="string"}function gr(t){return In(t)?{code:"MERMAID_PARSE_ERROR",message:t.str,detail:t.hash!=null?String(t.hash):void 0,original:t}:t instanceof Error?{code:"MERMAID_ERROR",message:t.message,detail:t.name!=="Error"?t.name:void 0,original:t}:{code:"MERMAID_ERROR",message:t!=null?String(t):"Unknown error",original:t}}var Gn={"mf-active-color":"#4caf50","mf-visited-color":"#2196f3","mf-error-color":"#f44336","mf-success-color":"#4caf50","mf-warning-color":"#ff9800","mf-active-opacity":"1","mf-transition-duration":"220ms","mf-transition-timing":"ease","mf-opacity-transition-duration":"200ms","mf-edge-width":"4px","mf-edge-active-width":"4px","mf-control-bg":"#f8fafc","mf-control-border":"#e2e8f0","mf-control-text":"#334155","mf-control-hover-bg":"#f1f5f9","mf-control-active-bg":"#e2e8f0","mf-control-border-radius":"8px","mf-control-padding":"7px 14px","mf-control-gap":"6px","mf-control-primary-bg":"#4f46e5","mf-control-primary-text":"#fff","mf-control-primary-hover-bg":"#4338ca","mf-narration-bg":"#f8fafc","mf-narration-border":"#e2e8f0","mf-narration-text":"#475569","mf-narration-border-radius":"8px","mf-narration-padding":"12px 16px","mf-narration-font-size":"13px","mf-viewport-bg":"transparent","mf-viewport-border":"rgba(148, 163, 184, 0.22)"},$n={"mf-active-color":"#81c784","mf-visited-color":"#64b5f6","mf-error-color":"#ef5350","mf-success-color":"#81c784","mf-warning-color":"#ffb74d","mf-active-opacity":"1","mf-transition-duration":"220ms","mf-transition-timing":"ease","mf-opacity-transition-duration":"200ms","mf-edge-width":"4px","mf-edge-active-width":"4px","mf-control-bg":"#1e293b","mf-control-border":"#4b5e78","mf-control-text":"#e2e8f0","mf-control-hover-bg":"#334155","mf-control-active-bg":"#475569","mf-control-border-radius":"8px","mf-control-padding":"7px 14px","mf-control-gap":"6px","mf-control-primary-bg":"#6366f1","mf-control-primary-text":"#fff","mf-control-primary-hover-bg":"#818cf8","mf-narration-bg":"#1e293b","mf-narration-border":"#4b5e78","mf-narration-text":"#94a3b8","mf-narration-border-radius":"8px","mf-narration-padding":"12px 16px","mf-narration-font-size":"13px","mf-viewport-bg":"#0f172a","mf-viewport-border":"rgba(148, 163, 184, 0.25)"},pt={light:Gn,dark:$n};var Fn="mermaid-flow-player-theme",ft=class{currentTheme;persist;storageKey;target;mediaQuery=null;mediaQueryListener=null;constructor(e={}){this.persist=e.persist??!0,this.storageKey=e.storageKey??Fn,this.target=e.target??document.documentElement;let r=this.persist?this.loadTheme():null;this.currentTheme=r??e.theme??"auto",!r&&this.persist&&e.theme&&this.saveTheme(this.currentTheme),this.currentTheme==="auto"&&this.setupSystemPreference(),this.applyTheme(this.getResolvedTheme())}getTheme(){return this.currentTheme}getResolvedTheme(){return this.currentTheme==="auto"?this.getSystemPreference():this.currentTheme}setTheme(e){this.currentTheme=e,this.persist&&this.saveTheme(e),e!=="auto"?this.cleanupSystemPreference():this.setupSystemPreference(),this.applyTheme(this.getResolvedTheme())}toggle(){let r=this.getResolvedTheme()==="light"?"dark":"light";this.setTheme(r)}applyCustomTheme(e){for(let[r,n]of Object.entries(e))this.target.style.setProperty(`--${r}`,n)}reset(){let e=Object.keys(pt.light);for(let r of e)this.target.style.removeProperty(`--${r}`)}destroy(){this.cleanupSystemPreference()}getSystemPreference(){return typeof window>"u"?"light":window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}setupSystemPreference(){typeof window>"u"||!window.matchMedia||(this.cleanupSystemPreference(),this.mediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.mediaQueryListener=e=>{if(this.currentTheme==="auto"){let r=e.matches?"dark":"light";this.applyTheme(r)}},this.mediaQuery.addEventListener?this.mediaQuery.addEventListener("change",this.mediaQueryListener):"addListener"in this.mediaQuery&&this.mediaQuery.addListener(this.mediaQueryListener))}cleanupSystemPreference(){this.mediaQuery&&this.mediaQueryListener&&(this.mediaQuery.removeEventListener?this.mediaQuery.removeEventListener("change",this.mediaQueryListener):"removeListener"in this.mediaQuery&&this.mediaQuery.removeListener(this.mediaQueryListener),this.mediaQuery=null,this.mediaQueryListener=null)}applyTheme(e){let r=pt[e];for(let[n,o]of Object.entries(r))this.target.style.setProperty(`--${n}`,o);this.target.setAttribute("data-mf-theme",e)}loadTheme(){if(typeof window>"u"||!window.localStorage)return null;try{let e=window.localStorage.getItem(this.storageKey);if(e&&(e==="light"||e==="dark"||e==="auto"))return e}catch(e){console.warn("[mermaid-flow-player] Failed to load theme preference:",e)}return null}saveTheme(e){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(this.storageKey,e)}catch(r){console.warn("[mermaid-flow-player] Failed to save theme preference:",r)}}},je=null;function Ee(t){return je&&je.destroy(),je=new ft(t),je}var hr={"play-pause":{label:"Play",aria:"Play animation"},restart:{label:"Restart",aria:"Back to start"},previous:{label:"Prev",aria:"Previous step"},next:{label:"Next",aria:"Next step"},speed:{label:"1x",aria:"Change animation speed"},"all-paths":{label:"All Paths",aria:"Play all paths"},"zoom-out":{label:"Zoom Out",aria:"Zoom out diagram"},fit:{label:"Fit",aria:"Fit diagram to viewport"},"zoom-in":{label:"Zoom In",aria:"Zoom in diagram"},fullscreen:{label:"Fullscreen",aria:"Open diagram in fullscreen"},focus:{label:"Focus",aria:"Open focused diagram view"},search:{label:"Find",aria:"Find matching nodes"},"copy-svg":{label:"Copy SVG",aria:"Copy SVG markup"},"download-svg":{label:"Download SVG",aria:"Download SVG file"},"open-svg":{label:"Open SVG",aria:"Open SVG in new tab"}};function vr(t,e){if(t==="none")return[];if(t==="viewer")return["zoom-out","fit","zoom-in"];if(t&&t!=="full"&&t!=="playback"){let r=t.split(/\s+/).filter(n=>n in hr);if(r.length>0)return r}return t==="full"?[...e==="interactive"?["restart","all-paths"]:["play-pause","restart","previous","next","speed","all-paths"],"zoom-out","fit","zoom-in","fullscreen","search","copy-svg","download-svg","open-svg"]:e==="interactive"?["restart","all-paths"]:["play-pause","restart","previous","next","speed","all-paths"]}var gt={"play-pause":'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 2v12l9-6z"/></svg>',pause:'<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx=".75"/><rect x="9.5" y="2" width="3.5" height="12" rx=".75"/></svg>',restart:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2.5 8a5.5 5.5 0 0 1 9.27-4"/><path d="M11 1v4H7"/><path d="M13.5 8a5.5 5.5 0 0 1-9.27 4"/></svg>',previous:'<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2.5" y="3" width="2" height="10" rx=".5"/><path d="M12.5 2.5v11L5.5 8z"/></svg>',next:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 2.5v11L10.5 8z"/><rect x="11.5" y="3" width="2" height="10" rx=".5"/></svg>',"all-paths":'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h5"/><path d="M7 8l3-4h4"/><path d="M7 8l3 4h4"/></svg>',"zoom-out":'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4"/><path d="M10 10l4 4"/><path d="M4.5 6.5h4"/></svg>',fit:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5"/></svg>',"zoom-in":'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4"/><path d="M10 10l4 4"/><path d="M4.5 6.5h4M6.5 4.5v4"/></svg>',fullscreen:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5"/></svg>',focus:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2"/></svg>',search:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4"/><path d="M10 10l4 4"/></svg>',"copy-svg":'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 11V3h8"/></svg>',"download-svg":'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v8M5 7l3 3 3-3M3 12h10"/></svg>',"open-svg":'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h5v5M14 2L7 9M6 4H3v9h9v-3"/></svg>'},br=gt.pause,yr=gt["play-pause"],zn=new Set(["speed","all-paths","zoom-out","fit","zoom-in","fullscreen","focus","search","copy-svg","download-svg","open-svg"]);function Dn(t){return t==="play-pause"?"mfp-btn-primary":zn.has(t)?"mfp-btn-utility":"mfp-btn-transport"}function ht(t,e,r){if(t.textContent="",e){let o=document.createElement("span");o.className="mfp-icon",o.setAttribute("aria-hidden","true"),o.innerHTML=e,t.appendChild(o)}let n=document.createElement("span");n.className="mfp-label",n.textContent=r,t.appendChild(n)}function wr(t){let e=document.createElement("div");e.className="mfp-controls",e.setAttribute("role","toolbar"),e.setAttribute("aria-label","Animation controls");for(let r of t){let n=hr[r];if(!n)continue;let o=document.createElement("button");o.setAttribute("type","button"),o.setAttribute("data-action",r),o.className=Dn(r),o.setAttribute("aria-label",n.aria),o.setAttribute("title",n.aria),ht(o,gt[r],n.label),e.appendChild(o)}return e}var qn="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js",ke=null;function vt(){return typeof window>"u"?Promise.resolve():window.mermaid?(window.mermaid.run||console.warn("[mermaid-flow-player] Mermaid version may be unsupported. v10+ required."),Promise.resolve()):ke||(ke=new Promise((t,e)=>{let r=document.createElement("script");r.src=qn,r.onload=()=>{window.mermaid?.initialize&&window.mermaid.initialize({startOnLoad:!1}),t()},r.onerror=()=>{ke=null,e(new Error("Failed to load Mermaid from CDN"))},document.head.appendChild(r)}),ke)}var Hn=vt;var xr=Promise.resolve();function Bn(t){let e=xr.then(async()=>{t.querySelector("svg")||window.mermaid?.run&&await window.mermaid.run({nodes:[t]})});return xr=e.catch(()=>{}),e}function jn(){return typeof window<"u"&&window.mermaidFlowPlayerFont?!0:!!document.querySelector("script[data-mfp-font]")}function Un(){if(document.head.querySelector("style[data-mfp-element]"))return;if(jn()&&!document.head.querySelector("link[data-mfp-font]")){let e=[["https://fonts.googleapis.com",!1],["https://fonts.gstatic.com",!0]];for(let[n,o]of e){let d=document.createElement("link");d.setAttribute("data-mfp-font",""),d.rel="preconnect",d.href=n,o&&(d.crossOrigin="anonymous"),document.head.appendChild(d)}let r=document.createElement("link");r.setAttribute("data-mfp-font",""),r.rel="stylesheet",r.href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap",document.head.appendChild(r)}let t=document.createElement("style");t.setAttribute("data-mfp-element",""),t.textContent=De,document.head.appendChild(t)}function Ue(t){let e=t.getAttribute("mode"),r=t.getAttribute("speed"),n=t.getAttribute("visited"),o=t.getAttribute("narration"),d=t.getAttribute("theme"),m=r?parseFloat(r):NaN;return{mode:e==="interactive"?"interactive":"sequential",speed:!isNaN(m)&&m>0&&m<=10?m:1.2,visited:n!=="false",controls:t.getAttribute("controls"),narration:o!==null&&o!=="false"||t.hasAttribute("narration-text"),narrationText:t.getAttribute("narration-text"),speak:t.hasAttribute("speak"),captions:t.hasAttribute("captions"),chapters:t.hasAttribute("chapters"),progress:t.hasAttribute("progress"),karaoke:t.hasAttribute("karaoke"),scrollSteps:t.hasAttribute("scroll-steps"),startStep:(()=>{let u=t.getAttribute("step");if(u==null)return null;let g=parseInt(u,10);return Number.isFinite(g)&&g>=0?g:null})(),autoplay:t.hasAttribute("autoplay"),debug:t.hasAttribute("debug"),theme:d==="light"||d==="dark"||d==="auto"?d:null,minimap:t.hasAttribute("minimap"),syncUrl:t.hasAttribute("sync-url"),autoCenter:t.hasAttribute("auto-center"),size:(()=>{let u=t.getAttribute("size")?.trim()??"",g=u.endsWith("%")?parseFloat(u)/100:parseFloat(u);return Number.isFinite(g)&&g>0?g:null})(),stepMs:(()=>{let u=parseFloat(t.getAttribute("step-ms")??"");return Number.isFinite(u)&&u>0?u:null})(),trigger:t.getAttribute("trigger")==="scroll"?"scroll":"load"}}function Kn(t){return[...t].map(e=>{let[r,n]=e.replace(/#\d+$/,"").split("->");return{type:"edge",from:r,to:n,key:e,state:"active"}})}function Wn(t){let e=[];for(let r=0;r<t.length;r++)e.push({type:"node",id:t[r],state:"active"}),r<t.length-1&&e.push({type:"edge",from:t[r],to:t[r+1],state:"active"});return e}var Qn=1e4,Yn=(t,e)=>3e3+t.length*120/(e>0?e:1),bt=class extends HTMLElement{static observedAttributes=["mode","speed","controls","narration","narration-text","speak","captions","chapters","karaoke","scroll-steps","autoplay","progress","debug","theme","minimap","visited","sync-url","auto-center","step-ms","trigger","step","size"];_player=null;_readyPromise=null;_readyResolve=null;_controlsEl=null;_narrationEl=null;_chaptersEl=null;_diagramSource=null;_observer=null;_rebuildScheduled=!1;_userSpeed=null;_playGen=0;_speakEnabled=!1;_onStateChange=()=>{this._syncPlayPauseButton(),this._syncNarrationWithStatus()};_karaoke=!1;_audioResolver=null;_voiceResolver=null;_pauseTimer=null;_errorEl=null;_progressEl=null;_loadingEl=null;_speechStarted=!1;_tapToSpeakEl=null;_blockedStep=null;_currentAudio=null;_speechHold=null;_speechBlocked=!1;_scrollHandler=null;_triggerObserver=null;_scrollRaf=0;_installScrollSteps(){let e=this._player;if(!e||typeof window>"u")return;let r=()=>{this._scrollRaf=0;let n=e.getSteps();if(n.length===0)return;let o=this.getBoundingClientRect(),d=window.innerHeight||document.documentElement.clientHeight,m=Math.min(1,Math.max(0,1-o.top/Math.max(1,d))),u=Math.min(n.length-1,Math.floor(m*n.length)),g=n.findIndex(p=>p.node===e.getCurrentNode());u>g?e.nextStep():u<g&&g>0&&e.previousStep()};this._scrollHandler=()=>{this._scrollRaf||(this._scrollRaf=window.requestAnimationFrame(r))},window.addEventListener("scroll",this._scrollHandler,{passive:!0}),r()}_removeScrollSteps(){this._scrollHandler&&typeof window<"u"&&(window.removeEventListener("scroll",this._scrollHandler),this._scrollRaf&&window.cancelAnimationFrame(this._scrollRaf)),this._scrollHandler=null,this._scrollRaf=0}set audioTracks(e){this._audioResolver=typeof e=="function"?e:e?r=>e[r]:null}set voices(e){this._voiceResolver=typeof e=="function"?e:e?r=>e[r]:null}get _speech(){return typeof window<"u"?window.speechSynthesis:void 0}_applyVoice(e,r){let n=(C,V,D)=>{let T=this.getAttribute(C);if(T==null)return null;let M=parseFloat(T);return Number.isFinite(M)&&M>=V&&M<=D?M:null},o=n("rate",.1,10),d=n("pitch",0,2),m=n("volume",0,1),u=this.getAttribute("lang");o!=null&&(e.rate=o),d!=null&&(e.pitch=d),m!=null&&(e.volume=m),u&&(e.lang=u);let g=(typeof r=="number"?this._voiceResolver?.(r):void 0)??(typeof r=="number"?this._sourceVoice(r):void 0)??this.getAttribute("voice");if(!g)return;let p=g.toLowerCase(),A=this._speech?.getVoices?.().find(C=>C.name.toLowerCase().includes(p));A&&(e.voice=A)}_sourceVoice(e){let r=this._player?.getSteps()[e]?.speaker;if(!(!r||!this._diagramSource))return ar(this._diagramSource).get(r)}_stopNarration(){this._speechHold=null,this._speech?.cancel(),this._currentAudio&&(this._currentAudio.pause(),this._currentAudio=null),this._pauseTimer&&(clearTimeout(this._pauseTimer),this._pauseTimer=null)}_onStepNarrate=e=>{if(!this._speakEnabled&&!this._karaoke&&!this._audioResolver)return;let r=e.detail??{},n=r.index,o=r.text,d=typeof n=="number"?this._audioResolver?.(n):void 0;this._stopNarration();let m=()=>{this._karaoke&&typeof n=="number"&&this._advanceKaraoke(n)};if(d){let u=new Audio(d);this._currentAudio=u,this._karaoke&&u.addEventListener("ended",m,{once:!0}),u.play().catch(()=>{})}else if(this._speakEnabled&&o&&this._speech){let u=new SpeechSynthesisUtterance(o);this._applyVoice(u,n);let g={until:Date.now()+Yn(o,u.rate),pausedAt:null};this._speechHold=g;let p=()=>{this._speechHold===g&&(this._speechHold=null)};u.onend=()=>{p(),m()},u.onerror=p,this._narrationEl&&(u.onboundary=C=>this._highlightWord(o,C.charIndex));let A=!1;u.onstart=()=>{A=!0,this._speechBlocked=!1},this._speech.speak(u),this._speechStarted||setTimeout(()=>{if(A||this._speech?.speaking){this._speechStarted=!0;return}this._speechStarted||(this._speechStarted=!0,this._speechBlocked=!0,this.dispatchEvent(new CustomEvent("mfp:speech-blocked",{bubbles:!0})),this._showTapToSpeak(o,n))},1e3)}};_showTapToSpeak(e,r){if(this._tapToSpeakEl)return;this._blockedStep={text:e,index:r};let n=document.createElement("button");n.type="button",n.className="mfp-tap-to-speak",n.textContent="Tap to enable voice",n.addEventListener("click",()=>{this._tapToSpeakEl?.remove(),this._tapToSpeakEl=null;let o=this._blockedStep;this._blockedStep=null,o&&this.dispatchEvent(new CustomEvent("mfp:step",{detail:{index:o.index,text:o.text}}))}),this.appendChild(n),this._tapToSpeakEl=n}_highlightWord(e,r){let n=this._narrationEl;if(!n||r<0||r>=e.length)return;let o=e.indexOf(" ",r),d=o===-1?e.length:o,m=document.createElement("span");m.className="mfp-word",m.textContent=e.slice(r,d),n.replaceChildren(document.createTextNode(e.slice(0,r)),m,document.createTextNode(e.slice(d)))}async _advanceKaraoke(e){let r=this._player;if(!r||!this._karaoke||e>=r.getSteps().length-1)return;let n=parseInt(this.getAttribute("pause-between")??"",10);Number.isFinite(n)&&n>0&&(await new Promise(o=>{this._pauseTimer=setTimeout(o,n)}),!this._karaoke)||await r.nextStep()}_holdForSpeech(){let e=this._speechHold;return!e||this._speechBlocked?!1:e.pausedAt!==null||Date.now()<e.until?!0:(this._speechHold=null,!1)}_syncNarrationWithStatus(){let e=this._player?.getStatus(),r=this._speechHold;e==="paused"?(r&&r.pausedAt===null&&(r.pausedAt=Date.now()),this._speech?.pause(),this._currentAudio?.pause()):e==="playing"?(r&&r.pausedAt!==null&&(r.until+=Date.now()-r.pausedAt,r.pausedAt=null),this._speech?.resume(),this._currentAudio?.play().catch(()=>{})):e==="idle"&&this._stopNarration()}_onStepChapter=e=>{let r=e.detail?.index;typeof r!="number"||!this._chaptersEl||this._chaptersEl.querySelectorAll("[data-step]").forEach(n=>{let o=Number(n.getAttribute("data-step"))===r;n.classList.toggle("mfp-chapter-active",o),o?n.setAttribute("aria-current","step"):n.removeAttribute("aria-current")})};get player(){return this._player}ready(){return this._readyPromise||(this._readyPromise=new Promise(e=>{this._readyResolve=e})),this._readyPromise}async connectedCallback(){Un(),this.addEventListener("keydown",this._onKeyDown),this._showLoading(),this.ready();try{await Hn()}catch{this._emitError("MERMAID_LOAD_FAILED","Failed to load Mermaid from CDN"),this._readyResolve?.(!1);return}if(window.mermaid&&!window.mermaid.run){this._emitError("MERMAID_VERSION_UNSUPPORTED","Mermaid v10+ is required. Detected an older version."),this._readyResolve?.(!1);return}let e=this.querySelector("pre.mermaid");if(e){let n=this.getAttribute("diagram")?.trim()??"",o=Array.from(e.childNodes).filter(d=>!(d.nodeType===Node.ELEMENT_NODE&&d.tagName.toLowerCase()==="svg")).map(d=>d.textContent??"").join("").trim();this._diagramSource=n||o||null}else{let n=this._authoredText(),o=this.getAttribute("diagram")?.trim()??"",d=n||o;if(!d){this._emitError("NO_DIAGRAM_SOURCE",'Provide diagram via inner text, <pre class="mermaid">, or diagram attribute'),this._readyResolve?.(!1);return}for(this._diagramSource=d,e=document.createElement("pre"),e.className="mermaid",e.textContent=d;this.firstChild;)this.removeChild(this.firstChild);this.appendChild(e)}try{await Bn(e)}catch(n){let o=gr(n);this._emitError(o.code,o.message,o.detail),this._readyResolve?.(!1);return}let r=e.querySelector("svg")||this.querySelector("svg");if(!r){if(!await this._waitForSVG(e)){this._emitError("MERMAID_RENDER_FAILED","SVG did not appear within timeout"),this._readyResolve?.(!1);return}r=e.querySelector("svg")||this.querySelector("svg")}r&&r.querySelectorAll("script").forEach(n=>n.remove()),this._initPlayer()}disconnectedCallback(){this._teardown()}attributeChangedCallback(e,r,n){if(!(r===n||!this._player)){if(e==="theme"){let o=Ue(this);o.theme&&Ee({theme:o.theme,target:this,persist:!1});return}if(e==="mode"||e==="controls"||e==="minimap"||e==="sync-url"||e==="auto-center"||e==="narration"||e==="narration-text"||e==="speak"||e==="captions"||e==="chapters"||e==="karaoke"||e==="scroll-steps"||e==="size"){this._scheduleRebuild();return}if(e==="step"){let o=Number.parseInt(n??"",10);Number.isFinite(o)&&o>=0&&this._goToStep(o);return}}}async play(){if(this._player){if(this._player.isPaused()){this._player.resume();return}await this._playAllPaths()}}async _playAllPaths(){let e=this._player;if(!e)return;await e.ready();let r=++this._playGen,n=Ue(this),o=this._userSpeed??n.speed,d=e.index();if(d?.type==="sequence"){e.reset(),await e.play(Kn(d.edges.keys()),{speed:o});return}let m=e.computeAllPaths();if(m.length===0){let u=e.getSteps().map(g=>g.node);if(u.length===0)return;e.reset(),await e.play(e.path(...u),{speed:o});return}for(let u=0;u<m.length;u++){if(r!==this._playGen)return;e.reset(),this._narrationEl&&m.length>1&&(this._narrationEl.textContent=`Path ${u+1} of ${m.length}`),await e.play(Wn(m[u]),{speed:o})}r===this._playGen&&this._narrationEl&&m.length>1&&(this._narrationEl.textContent=`Completed all ${m.length} paths`)}_authoredText(){return Array.from(this.childNodes).filter(e=>!(e instanceof Element&&e.className.startsWith("mfp-"))).map(e=>e.textContent??"").join("").trim()}_showLoading(){if(this._loadingEl)return;let e=document.createElement("div");e.className="mfp-loading",e.setAttribute("aria-busy","true"),e.setAttribute("role","status"),e.textContent="Loading diagram\u2026",this._loadingEl=e,this.appendChild(e)}_clearLoading(){this._loadingEl?.remove(),this._loadingEl=null}_buildProgress(){let e=document.createElement("div");e.className="mfp-progress",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),this._progressEl=e,this.appendChild(e)}_onStepProgress=e=>{let r=e.detail?.index,n=this._player?.getSteps().length??0;!this._progressEl||typeof r!="number"||n===0||(this._progressEl.textContent=`Step ${r+1} of ${n}`)};_renderError(e,r){if(this.hasAttribute("silent-errors"))return;this._loadingEl?.remove(),this._loadingEl=null;let n=this._errorEl??document.createElement("div");n.className="mfp-error",n.setAttribute("role","alert"),n.textContent=r?`${e} \u2014 ${r}`:e,this._errorEl||(this._errorEl=n,this.appendChild(n))}_supersedePlayback(){this._playGen++}async _playbackAction(e){let r=this._player;if(r){if(e==="play-pause"){let n=r.getStatus();n==="paused"?r.resume():n==="playing"?r.pause():await this.play();return}this._supersedePlayback(),await(e==="next"?r.nextStep():r.previousStep())}}_onKeyDown=e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey||e.target?.closest('input, textarea, select, [contenteditable="true"]'))return;let n=null;e.key===" "||e.key==="k"?n="play-pause":e.key==="ArrowRight"&&!e.shiftKey?n="next":e.key==="ArrowLeft"&&!e.shiftKey&&(n="previous"),n&&(e.preventDefault(),this._playbackAction(n))};pause(){this._player?.pause()}reset(){this._player?.reset()}zoomIn(){this._player?.zoomIn()}zoomOut(){this._player?.zoomOut()}fitView(){this._player?.fitView()}resetView(){this._player?.resetView()}toggleFullscreen(){return this._player?.toggleFullscreen()??Promise.resolve(!1)}openFocusView(){this._player?.openFocusView()}closeFocusView(){this._player?.closeFocusView()}focusNode(e,r){this._player?.focusNode(e,r)}findNodes(e){return this._player?.findNodes(e)??[]}copySvg(){return this._player?.copySvg()??Promise.resolve(!1)}downloadSvg(e){return this._player?.downloadSvg(e)??!1}openSvg(){return this._player?.openSvg()??!1}previous(){return this._player?this._player.previousStep():Promise.resolve()}_initPlayer(){let e=Ue(this);e.theme&&Ee({theme:e.theme,target:this,persist:!1});let r=ae(),n=this.hasAttribute("mode")?e.mode:r.mode??e.mode,o=this.hasAttribute("debug")?e.debug:r.debug??e.debug;(e.narration||e.captions||e.speak)&&(this._narrationEl=document.createElement("div"),this._narrationEl.className="mfp-narration",this._narrationEl.setAttribute("role","status"),this._narrationEl.setAttribute("aria-live","polite"),this._narrationEl.setAttribute("aria-atomic","true"),this._narrationEl.setAttribute("aria-label","Animation narration"),this._narrationEl.textContent=e.narrationText||"",this.appendChild(this._narrationEl)),this._clearLoading(),this._player=fr({root:this,mode:n,visited:e.visited,debug:o,narrationTarget:this._narrationEl??void 0,source:this._diagramSource??"",timing:e.stepMs?{stepMs:e.stepMs}:void 0,holdStep:()=>this._holdForSpeech(),viewport:{showMinimap:e.minimap,syncUrl:e.syncUrl,autoCenterActive:e.autoCenter,scale:e.size??void 0}}),this.addEventListener("mfp:statechange",this._onStateChange),this._speakEnabled=e.speak,this._karaoke=e.karaoke,this.addEventListener("mfp:step",this._onStepNarrate);let d=vr(e.controls,n);d.length>0&&(this._controlsEl=wr(d),this._wireControlActions(this._controlsEl),this.appendChild(this._controlsEl),this._syncPlayPauseButton());let m=typeof r.step=="number"?r.step:null,u=e.startStep??m;this._player.ready().then(async()=>{e.chapters&&this._buildChapters(),e.progress&&(this._buildProgress(),this.addEventListener("mfp:step",this._onStepProgress)),u!=null&&u>0&&await this._goToStep(u),e.autoplay&&n==="sequential"?e.trigger==="scroll"?this._playWhenVisible():this.play():this._karaoke&&await this._player?.nextStep(),e.scrollSteps&&this._installScrollSteps(),this._readyResolve?.(!0)}).catch(g=>{let p=g instanceof N?g.code:"PLAYER_INIT_FAILED";this._emitError(p,g instanceof Error?g.message:String(g)),this._readyResolve?.(!1)})}_playWhenVisible(){if(typeof IntersectionObserver>"u"){this.play();return}let e=new IntersectionObserver(r=>{for(let n of r)n.isIntersecting&&(e.disconnect(),this._triggerObserver=null,this.play())},{threshold:.5});e.observe(this),this._triggerObserver=e}async _goToStep(e){let r=this._player;if(!r)return;this._supersedePlayback(),r.stop(),r.reset();let n=r.getSteps().length-1,o=Math.min(e,Math.max(0,n));for(let d=0;d<=o;d++)await r.nextStep()}_buildChapters(){let e=this._player;if(!e)return;let r=e.getSteps();if(r.length===0)return;let n=document.createElement("ol");n.className="mfp-chapters",n.setAttribute("aria-label","Diagram steps");for(let o of r){let d=document.createElement("li");d.setAttribute("data-step",String(o.index));let m=document.createElement("button");m.type="button",m.setAttribute("data-step",String(o.index)),m.textContent=o.text||`Step ${o.index+1}`,d.appendChild(m),n.appendChild(d)}n.addEventListener("click",o=>{let d=o.target.closest("button[data-step]");d&&this._goToStep(Number(d.getAttribute("data-step")))}),this._chaptersEl=n,this.appendChild(n),this.addEventListener("mfp:step",this._onStepChapter)}_wireControlActions(e){let r=this._player;if(!r)return;let n=[.5,1,2],o=["0.5x","1x","2x"],d=1;e.addEventListener("click",async m=>{let u=m.target.closest("button[data-action]");if(!u)return;switch(u.getAttribute("data-action")){case"play-pause":await this._playbackAction("play-pause");break;case"restart":this._supersedePlayback(),r.stop(),r.reset();break;case"previous":await this._playbackAction("previous");break;case"next":await this._playbackAction("next");break;case"speed":d=(d+1)%n.length,this._userSpeed=n[d],u.textContent=o[d];break;case"all-paths":await this._playAllPaths();break;case"zoom-out":r.zoomOut();break;case"fit":r.fitView();break;case"zoom-in":r.zoomIn();break;case"fullscreen":{let p=await r.toggleFullscreen();u.setAttribute("aria-pressed",p?"true":"false");break}case"focus":r.openFocusView();break;case"search":{let p=window.prompt("Find node");if(!p)break;let A=r.findNodes(p);A[0]&&r.focusNode(A[0]);break}case"copy-svg":await r.copySvg();break;case"download-svg":r.downloadSvg();break;case"open-svg":r.openSvg();break}})}_syncPlayPauseButton(){let e=this._controlsEl?.querySelector('button[data-action="play-pause"]');if(!e)return;let r=this._player?.getStatus()!=="playing";ht(e,r?yr:br,r?"Play":"Pause"),e.setAttribute("aria-label",r?"Play animation":"Pause animation")}_waitForSVG(e){return new Promise(r=>{let n=setTimeout(()=>{this._observer?.disconnect(),this._observer=null,r(!1)},Qn);this._observer=new MutationObserver(()=>{(e.querySelector("svg")||this.querySelector("svg"))&&(clearTimeout(n),this._observer?.disconnect(),this._observer=null,r(!0))}),this._observer.observe(e,{childList:!0,subtree:!0})})}_scheduleRebuild(){this._rebuildScheduled||(this._rebuildScheduled=!0,queueMicrotask(()=>{this._rebuildScheduled=!1,this.isConnected&&(this._teardown(),this._readyPromise=null,this._readyResolve=null,this.ready(),this._initPlayer())}))}_teardown(){this._player?.destroy(),this.removeEventListener("mfp:statechange",this._onStateChange),this.removeEventListener("mfp:step",this._onStepNarrate),this.removeEventListener("mfp:step",this._onStepChapter),this.removeEventListener("keydown",this._onKeyDown),this._removeScrollSteps(),this._triggerObserver?.disconnect(),this._triggerObserver=null,this._stopNarration(),this._tapToSpeakEl?.remove(),this._tapToSpeakEl=null,this._blockedStep=null,this._player=null,this._controlsEl?.remove(),this._controlsEl=null,this._narrationEl?.remove(),this._narrationEl=null,this._chaptersEl?.remove(),this._chaptersEl=null,this._errorEl?.remove(),this._errorEl=null,this.removeEventListener("mfp:step",this._onStepProgress),this._progressEl?.remove(),this._progressEl=null,this._clearLoading(),this._observer?.disconnect(),this._observer=null}_emitError(e,r,n){let o={code:e,message:r,...n!=null&&{detail:n}};this.dispatchEvent(new CustomEvent("mfp:error",{bubbles:!0,detail:o})),this._renderError(r,n),Ue(this).debug&&console.warn(`[mermaid-flow-player] ${e}: ${r}`,n??"")}};function yt(){typeof customElements>"u"||customElements.get("mermaid-flow-player")||customElements.define("mermaid-flow-player",bt)}yt();var Xn=".mermaid, pre.language-mermaid, pre > code.language-mermaid";function Jn(t){return t.tagName==="CODE"&&t.parentElement?.tagName==="PRE"?t.parentElement:t}var Er="zoom-out fit zoom-in",Zn=`play-pause restart previous next speed ${Er}`,ei=`restart all-paths ${Er}`,xt=new Map;function wt(t,e){return t.getAttribute(`data-flow-${e}`)??t.getAttribute(e)}var ti={autoplay:"autoplay",debug:"debug",minimap:"minimap","sync-url":"syncUrl","auto-center":"autoCenter",captions:null,chapters:null,speak:null,karaoke:null,"scroll-steps":null,progress:null},ri={mode:"mode",speed:"speed",theme:"theme",visited:"visited","step-ms":"stepMs",trigger:"trigger","narration-text":"narrationText",step:"step",rate:null,pitch:null,volume:null,voice:null,"pause-between":null};function ni(t,e,r,n){for(let[m,u]of Object.entries(ti)){let g=wt(e,m);(g!==null?g!=="false":u!==null&&n[u]===!0)&&t.setAttribute(m,"")}for(let[m,u]of Object.entries(ri)){let g=wt(e,m)??(u===null?void 0:n[u]);g!=null&&g!==""&&t.setAttribute(m,String(g))}r.debug&&t.setAttribute("debug","");let o=r.controls??wt(e,"controls")??!0,d=t.getAttribute("mode")==="interactive"?ei:Zn;t.setAttribute("controls",o===!0?d:o===!1?"none":o),r.narration!==!1&&t.setAttribute("narration","")}function Ke(t={}){yt(),le();let e=t.queryConfig??ae(),r=t.selector??e.selector??Xn,n=[],o=new Set;for(let d of document.querySelectorAll(r))o.add(Jn(d));for(let d of o){if(d.closest("mermaid-flow-player"))continue;let m=document.createElement("mermaid-flow-player");ni(m,d,t,e),d.id&&(m.id=d.id);for(let g of d.classList)g.startsWith("language-")||m.classList.add(g);let u=d.querySelector("svg");if(u){let g=document.createElement("pre");g.className="mermaid",g.appendChild(u),m.appendChild(g)}else m.textContent=d.textContent?.trim()??"";d.replaceWith(m),xt.set(m,d),n.push(m)}return n}function kr(){for(let[t,e]of xt)t.replaceWith(e);xt.clear()}var ii=120,Se=null,ue=null,Et=!1;function oi(){le();let t=ae();t.theme&&Ee({theme:t.theme}),Ke({queryConfig:t,debug:t.debug??!1}),Se||(Se=new MutationObserver(e=>{e.some(n=>n.type==="childList"&&n.addedNodes.length>0)&&(ue!==null&&window.clearTimeout(ue),ue=window.setTimeout(()=>{Ke({queryConfig:t,debug:t.debug??!1})},ii))}),Se.observe(document.body,{childList:!0,subtree:!0}))}function io(){Se?.disconnect(),Se=null,ue!==null&&(window.clearTimeout(ue),ue=null),Et=!1,kr()}if(typeof document<"u"){let t=()=>{Et||(Et=!0,oi())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):t()}})();
