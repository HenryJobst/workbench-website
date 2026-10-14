var N=class extends Error{code;subjects;constructor(n,a,l=[]){super(a),this.name="FlowPlayerError",this.code=n,this.subjects=l}},ee=(e,n="Unhandled variant")=>{throw new Error(`${n}: ${JSON.stringify(e)}`)};var Re={stepMs:1200,loop:!0,restOpacity:.28,accent:"#3b82f6"},qt=e=>`${(Math.round(e*1e4)/100).toFixed(2).replace(/\.?0+$/,"")}%`,Qn=e=>e.replace(/[&<>"]/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[n]);function Hn(e,n,a){let l=[],c=0;for(let m of n)switch(m.type){case"node":{if(!e.nodes.has(m.id))throw new N("UNKNOWN_NODE",`No node "${m.id}" in this diagram`,[m.id]);let d=m.ms??a;l.push({key:m.id,from:c,to:c+d}),c+=d;break}case"edge":{let d=m.key??`${m.from}->${m.to}`;if(!e.edges.has(d))throw new N("UNKNOWN_EDGE",`No edge "${d}" in this diagram`,[d]);let p=m.ms??a;l.push({key:d,from:c,to:c+p}),c+=p;break}case"wait":c+=m.ms;break;case"reset":break;default:return ee(m,"Unhandled step")}return{turns:l,total:c}}function Wn(e,n,a,l){let{restOpacity:c,accent:m}=l,d=`drop-shadow(0 0 6px ${m})`,p=[];e[0].from>0&&p.push(`0%{opacity:${c};filter:none}`);for(let w of e)p.push(`${qt(w.from/n)}{opacity:1;filter:${d}}`),w.to<n&&p.push(`${qt(w.to/n)}{opacity:1;filter:none}`);return`@keyframes mfp-${a}{${p.join("")}}`}function Yn(e){for(let a of["transform","transform-origin","width","height","max-width"])e.style.removeProperty(a);let n=e.viewBox?.baseVal?.width;n&&(e.style.maxWidth=`${n}px`);for(let a of e.querySelectorAll('[class*="mf-"]')){for(let l of[...a.classList])(l.startsWith("mf-")||l.startsWith("mfp-"))&&a.classList.remove(l);for(let l of[a,...a.querySelectorAll("[style]")])l.style.removeProperty("fill"),l.style.removeProperty("stroke"),l.style.removeProperty("stroke-width"),l.getAttribute("style")||l.removeAttribute("style")}}function nt({index:e,steps:n},a={}){let l={stepMs:a.stepMs??Re.stepMs,loop:a.loop??Re.loop,restOpacity:a.restOpacity??Re.restOpacity,accent:a.accent??Re.accent,title:a.title??""},{turns:c,total:m}=Hn(e,n,l.stepMs);if(m===0)throw new N("UNKNOWN_NODE","A scenario needs at least one step that takes time");let d=e.svg.cloneNode(!0);for(let P of d.querySelectorAll("script"))P.remove();Yn(d),d.setAttribute("xmlns","http://www.w3.org/2000/svg"),d.setAttribute("role","img");let p=new Map;for(let P of c){let L=p.get(P.key);if(L){L.push(P);continue}p.set(P.key,[P]);let A=e.nodes.get(P.key)??e.edges.get(P.key);(A&&Xn(d,e.svg,A))?.setAttribute("data-mfp",P.key)}let w=l.loop?"infinite":"1 forwards",f=[...p].map(([P,L],A)=>`${`[data-mfp="${P}"]`}{animation:mfp-${A} ${m}ms step-end ${w}}`+Wn(L,m,A,l)),G=`<style>[data-mfp]{opacity:${l.restOpacity}}`+f.join("")+"@media (prefers-reduced-motion: reduce){[data-mfp]{animation:none;opacity:1;filter:none}}</style>",I=l.title?`<title>${Qn(l.title)}</title>`:"",C=d.innerHTML;return d.innerHTML="",`${d.outerHTML.replace(/<\/svg>$/,"")}${I}${G}${C}</svg>`}function Xn(e,n,a){let l=[];for(let m=a;m&&m!==n;m=m.parentElement){let d=m.parentElement;if(!d)return;l.unshift([...d.children].indexOf(m))}let c=e;for(let m of l){let d=c.children[m];if(!d)return;c=d}return c}var Jn={flowchart:"flowchart","flowchart-v2":"flowchart",graph:"flowchart",sequence:"sequence",state:"state",stateDiagram:"state",class:"class",classDiagram:"class",er:"er",gantt:"gantt",journey:"journey"},be=(e,n)=>{let a=e[n];return typeof a=="function"?a.call(e):void 0},ce=e=>typeof e=="string"?e:"",Zn=(e,n)=>{let a=be(e,"getData");if(!a)throw new N("PARSE_FAILED","Mermaid returned no graph data");let l=new Map(a.nodes.map(c=>[c.id,n==="er"&&c.label?c.label:c.id]));return{nodes:a.nodes.map(c=>({id:l.get(c.id),label:ce(c.label),domId:c.domId??c.id})),edges:a.edges.map(c=>({id:c.id,from:l.get(c.start)??c.start,to:l.get(c.end)??c.end,label:ce(c.label)}))}},er=new Set([0,1,3,4,5,6,24,25,33,34,...Array.from({length:18},(e,n)=>41+n)]),tr=e=>{let n=be(e,"getActors")??new Map,a=be(e,"getMessages")??[];return{nodes:[...n].map(([l,c])=>({id:l,label:ce(c.description)||l,domId:l})),edges:a.filter(l=>er.has(l.type??-1)&&l.from!=null&&l.to!=null).map(l=>({id:l.id,from:l.from,to:l.to,label:ce(l.message)}))}},Ut=e=>({nodes:e,edges:e.slice(1).map((n,a)=>({id:`${e[a].id}->${n.id}`,from:e[a].id,to:n.id,label:""}))}),nr=e=>Ut((be(e,"getTasks")??[]).map(n=>({id:n.id,label:ce(n.task).trim(),domId:n.id}))),rr=e=>{let n=new Map;return Ut((be(e,"getTasks")??[]).map((a,l)=>{let c=ce(a.task).trim()||`task-${l}`,m=n.get(c)??0;n.set(c,m+1);let d=m===0?c:`${c} (${m+1})`;return{id:d,label:c,domId:d}}))};async function rt(e,n){let a=n.mermaidAPI?.getDiagramFromText;if(typeof a!="function")throw new N("PARSE_FAILED","This build of Mermaid does not expose mermaidAPI.getDiagramFromText");let l;try{l=await a.call(n.mermaidAPI,e)}catch(d){throw new N("PARSE_FAILED",d instanceof Error?d.message:String(d))}let c=Jn[l.type??""];if(!c)throw new N("UNSUPPORTED_DIAGRAM",`Cannot animate a "${l.type??"unknown"}" diagram`,[l.type??"unknown"]);let m=l.db;if(!m)throw new N("PARSE_FAILED","Mermaid returned no diagram data");switch(c){case"flowchart":case"state":case"class":case"er":return{kind:c,...Zn(m,c)};case"sequence":return{kind:c,...tr(m)};case"gantt":return{kind:c,...nr(m)};case"journey":return{kind:c,...rr(m)};default:return ee(c,"Unhandled diagram kind")}}var _t=(e,n,a,l)=>Kt([...e.querySelectorAll(n)],c=>c.getAttribute(a)===l),Kt=(e,n)=>{let a=e.filter(n);return a.length===1?a[0]:void 0},Bt=e=>e.replace(/-\d+$/,""),ir=(e,n)=>{let a=`${e.id}-${Bt(n)}`;return Kt([...e.querySelectorAll("[id]")],l=>Bt(l.id)===a)};function it(e,n){let a=new Map,l=new Map,c=[],m=(d,p,w)=>{for(let f of d){let{scope:G,attribute:I,value:C}=p(f),_=_t(n,G,I,C);_?w.set(f.id,_):c.push(f.id)}};switch(e.kind){case"flowchart":case"state":case"class":case"er":for(let d of e.nodes){let p=ir(n,d.domId);p?a.set(d.id,p):c.push(d.id)}m(e.edges,d=>({scope:'[data-et="edge"]',attribute:"data-id",value:d.id}),l);for(let d of e.edges){if(l.has(d.id)||d.from!==d.to)continue;let p=e.edges.flatMap(w=>{let f=w.from===d.from&&w.to===d.to&&l.get(w.id);return f?[f]:[]});p.length===1&&(l.set(d.id,p[0]),c.splice(c.indexOf(d.id),1))}break;case"sequence":{m(e.nodes,d=>({scope:'[data-et="participant"]',attribute:"data-id",value:d.domId}),a),m(e.edges,d=>({scope:'[data-et="message"]',attribute:"data-id",value:`i${d.id}`}),l);break}case"gantt":{m(e.nodes,d=>({scope:"[id]",attribute:"id",value:`${n.id}-${d.domId}`}),a);break}case"journey":{e.nodes.forEach((d,p)=>{let f=_t(n,"[id]","id",`${n.id}-task${p}`)?.parentElement;f?a.set(d.id,f):c.push(d.id)});break}default:return ee(e.kind,"Unhandled diagram kind")}if(c.length>0)throw new N("BINDING_INCOMPLETE",`The rendered diagram does not match its source: ${c.join(", ")}`,c);return{nodes:a,edges:l}}function Oe(e,n){let a=new Set,l=new Set,c=[],m=[];for(let d=0;d<n.length;d++){let p=n[d];if(p.type==="node")a.add(p.id),e.nodes.has(p.id)||c.push({kind:"missing_node",id:p.id,message:`Node "${p.id}" not found in diagram.`,stepIndex:d});else if(p.type==="edge"){a.add(p.from),a.add(p.to);let w=`${p.from}->${p.to}`;l.add(w),e.nodes.has(p.from)||c.push({kind:"missing_node",id:p.from,message:`Node "${p.from}" (edge source) not found in diagram.`,stepIndex:d}),e.nodes.has(p.to)||c.push({kind:"missing_node",id:p.to,message:`Node "${p.to}" (edge target) not found in diagram.`,stepIndex:d}),e.edges.has(w)||m.push({kind:"missing_edge",id:w,message:`Edge "${p.from} -> ${p.to}" not indexed (edge animation may be off or not detected).`,stepIndex:d})}}return{valid:c.length===0,errors:c,warnings:m,referencedNodeIds:[...a],referencedEdgeKeys:[...l],availableNodeIds:[...e.nodes.keys()],availableEdgeKeys:[...e.edges.keys()]}}function or(e){if(!e||typeof e!="object")return!1;let n=e;return typeof n.svg=="string"&&typeof n.diagramType=="string"&&(n.bindFunctions===void 0||typeof n.bindFunctions=="function")}function ar(e){return!!e&&typeof e=="object"&&"str"in e&&typeof e.str=="string"}function sr(e){return ar(e)?{code:"MERMAID_PARSE_ERROR",message:e.str,detail:e.hash!=null?String(e.hash):void 0,original:e}:e instanceof Error?{code:"MERMAID_ERROR",message:e.message,detail:e.name!=="Error"?e.name:void 0,original:e}:{code:"MERMAID_ERROR",message:e!=null?String(e):"Unknown error",original:e}}var lr=/(--?>>?|--?x|--?\))/,cr=/^(sequencediagram|participant|actor|note|loop|alt|opt|par|and|else|end|activate|deactivate|autonumber|rect|box|critical|break)\b/i;function dr(e){let n=e.trim();return lr.test(n)&&n.includes(":")&&!cr.test(n)}function ot(e){let n=new Map,a=null,l=0;for(let c of e.split(`
`)){if(dr(c)){l+=1,a=null;continue}let m=/^\s*%%\s*narrate\s+([^\s:]+)\s*:\s*(.+?)\s*$/.exec(c);if(m){n.set(m[1],m[2]),a=m[1];continue}let d=/^\s*%%\s*narrate\s*:\s*(.+?)\s*$/.exec(c);if(d){if(l===0){a=null;continue}let w=`msg-${l-1}`;n.set(w,d[1]),a=w;continue}let p=a===null?null:/^\s*%%\s{2,}(\S.*?)\s*$/.exec(c);p&&a!==null?n.set(a,`${n.get(a)} ${p[1]}`):a=null}return n}function mr(e){let n=new Map;for(let a of e.split(`
`)){let l=/^\s*%%\s*voice\s+([^\s:]+)\s*:\s*(.+?)\s*$/.exec(a);l&&n.set(l[1],l[2])}return n}function fr(e,n={}){let{numbered:a=!0,skipEmpty:l=!0}=n;return(l?e.filter(m=>m.text.trim().length>0):e).map((m,d)=>a?`${d+1}. ${m.text}`:m.text).join(`
`)}function Qt(e){let n=Math.round((e-Math.floor(e))*1e3),a=Math.floor(e),l=Math.floor(a/3600),c=Math.floor(a%3600/60),m=a%60,d=(p,w=2)=>String(p).padStart(w,"0");return`${d(l)}:${d(c)}:${d(m)}.${d(n,3)}`}function pr(e,n={}){let{secondsPerCue:a=4,skipEmpty:l=!0}=n,c=l?e.filter(d=>d.text.trim().length>0):e,m=["WEBVTT",""];return c.forEach((d,p)=>{let w=Qt(p*a),f=Qt((p+1)*a);m.push(String(p+1),`${w} --> ${f}`,d.text,"")}),m.join(`
`)}var De={states:{idle:{},dimmed:{},active:{stroke:"#3b82f6",edge:"#3b82f6"},visited:{stroke:"#3b82f6",edge:"#3b82f6"},success:{fill:"#b7f7c0",stroke:"#1b7f2a",text:"#1f2328",edge:"#1b7f2a"},error:{fill:"#ffb3b3",stroke:"#b00020",text:"#1f2328",edge:"#b00020"},warning:{fill:"#ffe1b3",stroke:"#a65a00",text:"#1f2328",edge:"#a65a00"},disabled:{fill:"#e5e7eb",stroke:"#9ca3af",text:"#6b7280",edge:"#9ca3af"}},classes:{nodeStatePrefix:"mf-state-",edgeStatePrefix:"mf-edge-",dim:"mf-state-dimmed",pulse:"mf-state-pulse"}};function at(e){return e?{states:{...De.states,...e.states??{}},classes:{...De.classes,...e.classes??{}}}:De}async function ze(e,n,a){let l=await rt(n,a),c=it(l,e),m=new Map;for(let w of l.nodes){let f=c.nodes.get(w.id);f&&m.set(w.id,f)}let d=new Map,p=new Map;for(let w of l.edges){let f=`${w.from}->${w.to}`,G=p.get(f)??0;p.set(f,G+1);let I=c.edges.get(w.id);I&&d.set(G===0?f:`${f}#${G}`,I)}return{type:l.kind,svg:e,graph:l,nodes:m,edges:d}}function H(e){let[n="",a=""]=e.replace(/#\d+$/,"").split("->");return[n,a]}var st={linear:"linear",ease:"ease","ease-in":"ease-in","ease-out":"ease-out","ease-in-out":"ease-in-out","ease-in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","ease-in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)","ease-in-cubic":"cubic-bezier(0.32, 0, 0.67, 0)","ease-out-cubic":"cubic-bezier(0.33, 1, 0.68, 1)","ease-in-out-cubic":"cubic-bezier(0.65, 0, 0.35, 1)","ease-in-quart":"cubic-bezier(0.5, 0, 0.75, 0)","ease-out-quart":"cubic-bezier(0.25, 1, 0.5, 1)","ease-in-out-quart":"cubic-bezier(0.76, 0, 0.24, 1)","ease-in-quint":"cubic-bezier(0.64, 0, 0.78, 0)","ease-out-quint":"cubic-bezier(0.22, 1, 0.36, 1)","ease-in-out-quint":"cubic-bezier(0.83, 0, 0.17, 1)","ease-in-expo":"cubic-bezier(0.7, 0, 0.84, 0)","ease-out-expo":"cubic-bezier(0.16, 1, 0.3, 1)","ease-in-out-expo":"cubic-bezier(0.87, 0, 0.13, 1)","ease-in-circ":"cubic-bezier(0.55, 0, 1, 0.45)","ease-out-circ":"cubic-bezier(0, 0.55, 0.45, 1)","ease-in-out-circ":"cubic-bezier(0.85, 0, 0.15, 1)","ease-in-sine":"cubic-bezier(0.12, 0, 0.39, 0)","ease-out-sine":"cubic-bezier(0.61, 1, 0.88, 1)","ease-in-out-sine":"cubic-bezier(0.37, 0, 0.63, 1)","ease-in-elastic":"cubic-bezier(0.5, -0.5, 0.5, 1.5)","ease-out-elastic":"cubic-bezier(0.5, -0.5, 0.5, 1.5)","ease-in-out-elastic":"cubic-bezier(0.5, -0.75, 0.5, 1.75)","ease-in-bounce":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","ease-out-bounce":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","ease-in-out-bounce":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"};function ur(e){return e?e.startsWith("cubic-bezier(")?e:st[e]||st.ease:st.ease}function lt(e,n,a){let l=ur(n),c=a/1e3;e.style.transition=`all ${c}s ${l}`}function ct(e,n){if(e)return e.states?.[n]?e.states[n]:e.default}var Ht=`/* mermaid-flow-player.css \u2013 include after Mermaid's CSS */

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
`;function Wt(){if(typeof document>"u"||document.head.querySelector("style[data-mermaid-flow-player]"))return;let e=document.createElement("style");e.setAttribute("data-mermaid-flow-player",""),e.textContent=Ht,document.head.appendChild(e)}function Yt(){let e=globalThis.mermaid;if(!e)throw new N("PARSE_FAILED","Mermaid is not loaded on this page");return e}var gr=.6;function ye(e){return new Promise(n=>setTimeout(n,e))}function Xt(e){return!!e&&e.tagName.toLowerCase()==="svg"}function Fe(e,n){let a=[];for(let l of Array.from(e.classList))l.startsWith(n)&&a.push(l);a.forEach(l=>e.classList.remove(l))}function je(e,n){return e.matches(n)?e:e.querySelector(n)}var Jt="rect, polygon, ellipse, circle, path",Zt="path, line";function hr(e,n,a,l,c){let m=je(e,Jt),d=e.querySelector("text, tspan"),p=n.states[a]??{};l&&c&&lt(e,l,c),m&&(p.fill&&(m.style.fill=p.fill),p.stroke&&(m.style.stroke=p.stroke)),d&&p.text&&(d.style.fill=p.text)}function vr(e){let n=je(e,Jt),a=e.querySelector("text, tspan");n&&(n.style.fill="",n.style.stroke=""),a&&(a.style.fill="")}function br(e,n,a,l,c){let m=je(e,Zt),d=n.states[a]??{};m&&(l&&c&&lt(e,l,c),d.edge&&(m.style.stroke=d.edge),m.style.strokeWidth="")}function yr(e){let n=je(e,Zt);n&&(n.style.stroke="",n.style.strokeWidth="")}function wr(e){Wt();let n=at(e.theme),a=e.root,l=e.dim??"others",c=e.visited!==!1,m=e.timing?.stepMs??1200,d=e.easing;function p(t,i){a.dispatchEvent(new CustomEvent(`mfp:${t}`,{bubbles:!0,detail:i}))}let w=!1,f=null,G=!1,I=0,C=e.speed&&Number.isFinite(e.speed)&&e.speed>0?e.speed:1;function _(t){!Number.isFinite(t)||t<=0||t!==C&&(C=t,p("speedchange",{speed:t}))}let P=null,L="idle";function A(t){L!==t&&(L=t,p("statechange",{status:L}))}let $=null,B=null,xe=null,nn=e.viewport?.minScale??.25,ft=e.viewport?.maxScale??4,pt=e.viewport?.minReadableScale??.6,ke=e.viewport?.zoomStep??.2,rn=!0,on=!0,an=!0,ut=!0,gt=e.viewport?.syncUrl===!0,W=e.viewport?.autoCenterActive===!0,ht=e.viewport?.showMinimap===!0,me=e.viewport?.focusPadding??48,vt=e.viewport?.scale,R=null,Be=null,v={scale:1,x:0,y:0},Ee=null,Ke=null,Qe=null,bt=null,ne=null,U=null,fe=null,yt=null,wt=null,Se=null,pe=e.mode??"sequential",y=null,X=-1,k=[],re=!1,z=new Set,ue=new Map;e.narrationTarget&&(typeof e.narrationTarget=="string"?(B=document.querySelector(e.narrationTarget),!B&&e.debug&&console.warn(`[mermaid-flow-player] Narration target not found: ${e.narrationTarget}`)):B=e.narrationTarget);function ge(){return f?.svg??null}function sn(){if(!gt||typeof window>"u")return null;let t=new URLSearchParams(window.location.search),i=[t.get("zoom"),t.get("x"),t.get("y")];if(i.some(u=>u===null||u.trim()===""))return null;let[r,o,s]=i.map(Number);return[r,o,s].some(u=>Number.isNaN(u))?null:{scale:ie(r),x:o,y:s}}function ln(){if(!gt||typeof window>"u")return;let t=new URL(window.location.href);t.searchParams.set("zoom",v.scale.toFixed(3)),t.searchParams.set("x",Math.round(v.x).toString()),t.searchParams.set("y",Math.round(v.y).toString()),window.history.replaceState({},"",t)}function cn(){let t=R,i=Ke,r=ge();if(!ht||!t||!i||!r)return;let{width:o,height:s}=Me(r);if(o<=0||s<=0)return;let u=t.clientWidth/v.scale,g=t.clientHeight/v.scale,x=Math.max(0,-v.x/v.scale),h=Math.max(0,-v.y/v.scale);i.style.left=`${x/o*100}%`,i.style.top=`${h/s*100}%`,i.style.width=`${Math.min(100,u/o*100)}%`,i.style.height=`${Math.min(100,g/s*100)}%`;let E=i.parentElement;if(E){let S=u>=o-1&&g>=s-1;E.classList.toggle("mfp-minimap--idle",S)}}function O(){let t=ge();if(t){if(t.style.transformOrigin="0 0",t.style.transform=`translate(${v.x}px, ${v.y}px) scale(${v.scale})`,cn(),dn(t),ln(),Qe&&ne){let i=Math.abs(v.scale-ne.scale)>.01||Math.abs(v.x-ne.x)>1||Math.abs(v.y-ne.y)>1;Qe.hidden=!i}mn(t),p("viewport-change",{...v})}}function dn(t){let i=R;if(!i)return;let{width:r}=Me(t),o=r*v.scale+v.x;i.classList.toggle("mfp-viewport--clip-start",v.x<-1),i.classList.toggle("mfp-viewport--clip-end",o>i.clientWidth+1)}function mn(t){let i=bt,r=R;if(!i||!r)return;let{width:o,height:s}=Me(t),{scale:u,x:g,y:x}=v,h=g<-1||x<-1||o*u+g>r.clientWidth+1||s*u+x>r.clientHeight+1,E=U!==null&&!U.hidden;i.hidden=E||!(u<.99||h)}function Me(t){let i=t.viewBox?.baseVal;if(i&&i.width>0&&i.height>0)return{width:i.width,height:i.height};let r=Number(t.getAttribute("width"))||t.width?.baseVal?.value||t.getBoundingClientRect().width||0,o=Number(t.getAttribute("height"))||t.height?.baseVal?.value||t.getBoundingClientRect().height||0;return{width:r,height:o}}function ie(t){return Math.min(ft,Math.max(nn,t))}function fn(t,i,r,o,s=v.scale){let u=R;if(!u)return;let g=ie(s),x=u.clientWidth,h=u.clientHeight;v={scale:g,x:x/2-(t+r/2)*g,y:h/2-(i+o/2)*g},O()}function K(t,i){let r=f?.nodes.get(t);if(!r)return;let o=r.getBBox(),s=typeof r.getCTM=="function"?r.getCTM():null,u=s?{x:s.a*o.x+s.c*o.y+s.e,y:s.b*o.x+s.d*o.y+s.f,width:o.width*s.a,height:o.height*s.d}:o,g=i?.scale??Math.min(ft,Math.max(v.scale,1.15));fn(u.x-me,u.y-me,u.width+me*2,u.height+me*2,g)}function pn(t){!W||t.type!=="node"||K(t.id)}function Te(){let t=R;if(t&&typeof window>"u"){t.style.width="",t.style.maxWidth="",t.style.marginLeft="";return}}function J(){let t=ge(),i=R;if(!t||!i)return;let{width:r,height:o}=Me(t),s=i.clientWidth,u=t.parentElement;if(r<=0||s<=0){v={scale:1,x:0,y:0},O();return}if(t.style.width=`${r}px`,t.style.maxWidth="none",o>0&&(t.style.height=`${o}px`),U&&!U.hidden&&o>0){let M=i.clientHeight,T=me,D=ie(Math.min((s-T)/r,(M-T)/o,2));u&&(u.style.height="100%"),v={scale:D,x:Math.max(0,(s-r*D)/2),y:Math.max(0,(M-o*D)/2)},ne={...v},O();return}let g=Math.min(1,s/r),x=s/(r*pt),h=ie(vt!==void 0?vt:x>=gr?Math.max(g,pt):g),E=r*h,S=o*h;u&&(u.style.height=o>0?`${Math.ceil(S)}px`:""),v={scale:h,x:Math.max(0,(s-E)/2),y:0},ne={...v},O()}function un(){v={scale:1,x:0,y:0},O()}function He(t,i,r){let o=R;if(!o)return;let s=o.getBoundingClientRect(),u=i??s.left+s.width/2,g=r??s.top+s.height/2,x=ie(v.scale*t),h=x/v.scale;v={scale:x,x:u-s.left-(u-s.left-v.x)*h,y:g-s.top-(g-s.top-v.y)*h},O()}function xt(){He(1+ke)}function kt(){He(1/(1+ke))}async function gn(){let t=R;return!t||typeof document>"u"?!1:document.fullscreenElement===t?(await document.exitFullscreen?.(),!1):(document.fullscreenElement&&await document.exitFullscreen?.(),typeof t.requestFullscreen=="function"?(await t.requestFullscreen(),!0):!1)}function hn(){if(typeof document>"u")return null;if(U)return U;let t=document.createElement("div");return t.className="mfp-focus-modal",t.hidden=!0,t.innerHTML=`
      <div class="mfp-focus-backdrop" data-mfp-close="true"></div>
      <div class="mfp-focus-dialog" role="dialog" aria-modal="true" aria-label="Focused diagram view">
        <div class="mfp-focus-header">
          <button type="button" class="mfp-focus-close" aria-label="Close focused diagram view" title="Close (Esc)">Close</button>
        </div>
        <div class="mfp-focus-content"></div>
      </div>
    `,t.addEventListener("click",i=>{let r=i.target;(r?.dataset.mfpClose==="true"||r?.classList.contains("mfp-focus-close"))&&Le()}),fe=i=>{i.key==="Escape"&&!t.hidden&&(i.preventDefault(),Le())},t.addEventListener("keydown",i=>{if(i.key!=="Tab")return;let r=[...t.querySelectorAll("button, [href], input, select, textarea, [tabindex]")].filter(u=>u.tabIndex>=0&&!u.hidden&&u.getClientRects().length>0),o=r[0],s=r[r.length-1];!o||!s||(i.shiftKey&&document.activeElement===o?(i.preventDefault(),s.focus()):!i.shiftKey&&document.activeElement===s&&(i.preventDefault(),o.focus()))}),document.addEventListener("keydown",fe),document.body.appendChild(t),U=t,t}function We(){let t=R,i=hn(),r=i?.querySelector(".mfp-focus-content");!t||!i||!r||i.hidden&&(Se=document.activeElement instanceof HTMLElement?document.activeElement:null,yt=t.parentNode,wt=t.nextSibling,r.appendChild(t),i.hidden=!1,document.body.classList.add("mfp-focus-open"),Te(),J(),i.querySelector(".mfp-focus-close")?.focus())}function Le(){let t=R,i=U;if(!t||!i||i.hidden)return;let r=yt;r&&r.insertBefore(t,wt),i.hidden=!0,document.body.classList.remove("mfp-focus-open"),Te(),J(),Se?.isConnected&&Se.focus(),Se=null}function Ve(){let t=ge();return t?new XMLSerializer().serializeToString(t):null}async function vn(){let t=Ve();return!t||typeof navigator>"u"||!navigator.clipboard?.writeText?!1:(await navigator.clipboard.writeText(t),!0)}function bn(t="diagram.svg"){let i=Ve();if(!i||typeof document>"u"||typeof URL>"u")return!1;let r=new Blob([i],{type:"image/svg+xml;charset=utf-8"}),o=URL.createObjectURL(r),s=document.createElement("a");return s.href=o,s.download=t,s.click(),URL.revokeObjectURL(o),!0}async function yn(t="diagram.png",i){let r=ge(),o=Ve();if(!r||!o||typeof document>"u"||typeof URL>"u")return!1;let s=i?.scale??2,u=r.viewBox?.baseVal,g=r.getBoundingClientRect(),x=Math.max(1,Math.round((u?.width||g.width||800)*s)),h=Math.max(1,Math.round((u?.height||g.height||600)*s)),E=URL.createObjectURL(new Blob([o],{type:"image/svg+xml;charset=utf-8"}));try{let S=new Image;await new Promise((se,Ie)=>{S.onload=()=>se(),S.onerror=()=>Ie(new Error("Failed to rasterize SVG")),S.src=E});let M=document.createElement("canvas");M.width=x,M.height=h;let T=M.getContext("2d");if(!T)return!1;T.drawImage(S,0,0,x,h);let D=await new Promise(se=>M.toBlob(se,"image/png"));if(!D)return!1;let Q=URL.createObjectURL(D),ae=document.createElement("a");return ae.href=Q,ae.download=t,ae.click(),URL.revokeObjectURL(Q),!0}catch{return!1}finally{URL.revokeObjectURL(E)}}function wn(){let t=Ve();if(!t||typeof window>"u"||typeof Blob>"u"||typeof URL>"u")return!1;let i=new Blob([t],{type:"image/svg+xml;charset=utf-8"}),r=URL.createObjectURL(i);return window.open(r,"_blank","noopener,noreferrer"),!0}function xn(t){let i=t.trim().toLowerCase();if(!f)return[];if(!i){for(let o of f.nodes.values())o.classList.remove("mfp-node-search-match");return[]}let r=[];for(let[o,s]of f.nodes){let u=s.textContent?.toLowerCase()??"",g=o.toLowerCase().includes(i)||u.includes(i);s.classList.toggle("mfp-node-search-match",g),g&&r.push(o)}return r}function Et(t){if(R&&Be&&R.contains(t)){O();return}let i=t.parentElement;if(!i)return;let r=document.createElement("div");r.className="mfp-viewport",r.setAttribute("role","region"),r.setAttribute("aria-label","Diagram viewport \u2014 Ctrl+scroll to zoom, drag to pan");let o=document.createElement("div");if(o.className="mfp-viewport-canvas",o.setAttribute("role","img"),o.setAttribute("aria-label","Mermaid diagram"),r.appendChild(o),i.insertBefore(r,t),o.appendChild(t),Te(),ht){let b=document.createElement("div");b.className="mfp-minimap";let V=t.cloneNode(!0);V.querySelectorAll("[style*='transform']").forEach(tt=>{tt.style.transform=""}),V.style.transform="",V.style.width="",V.style.height="",V.style.maxWidth="",b.appendChild(V);let q=document.createElement("div");q.className="mfp-minimap-rect",b.appendChild(q),r.appendChild(b),Ke=q}let s=document.createElement("button");s.className="mfp-fit-btn",s.setAttribute("type","button"),s.setAttribute("aria-label","Reset view"),s.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5"/></svg>',s.hidden=!0,s.onclick=()=>J();let u=document.createElement("button");u.className="mfp-expand-btn",u.setAttribute("type","button"),u.setAttribute("aria-label","Open larger view"),u.setAttribute("aria-haspopup","dialog"),u.setAttribute("title","Open larger view (F)"),u.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2H14v4.5M14 2L9 7M6.5 14H2V9.5M2 14l5-5"/></svg>',u.hidden=!0,u.onclick=()=>We();let g=document.createElement("div");g.className="mfp-viewport-actions",g.append(s,u),r.appendChild(g),Qe=s,bt=u;let x=0,h=0,E=0,S=0,M=!1,T=new Map,D=0,Q=v.scale,ae=b=>{if(!rn||!b.ctrlKey&&!b.metaKey)return;b.preventDefault();let V=b.deltaY<0?1+ke:1/(1+ke);He(V,b.clientX,b.clientY)},se=b=>{if(ut&&b.pointerType==="touch"){if(T.set(b.pointerId,{x:b.clientX,y:b.clientY}),T.size===2){let[V,q]=Array.from(T.values());D=Math.hypot(V.x-q.x,V.y-q.y),Q=v.scale}return}on&&(M=!0,x=b.clientX,h=b.clientY,E=v.x,S=v.y,r.classList.add("mfp-viewport-dragging"))},Ie=b=>{if(ut&&T.has(b.pointerId)&&(T.set(b.pointerId,{x:b.clientX,y:b.clientY}),T.size===2)){let[V,q]=Array.from(T.values()),tt=Math.hypot(V.x-q.x,V.y-q.y);if(D>0){let Ce=r.getBoundingClientRect(),Dt=(V.x+q.x)/2,zt=(V.y+q.y)/2,Ft=ie(tt/D*Q),jt=Ft/v.scale;v={scale:Ft,x:Dt-Ce.left-(Dt-Ce.left-v.x)*jt,y:zt-Ce.top-(zt-Ce.top-v.y)*jt},O()}return}M&&(v={...v,x:E+(b.clientX-x),y:S+(b.clientY-h)},O())},Kn=()=>{M=!1,r.classList.remove("mfp-viewport-dragging")},$e=b=>{T.delete(b.pointerId),Kn()},$t=b=>{if(!an)return;let V=48;(b.key==="ArrowLeft"||b.key==="ArrowRight")&&!b.shiftKey||(b.key==="+"||b.key==="="?(b.preventDefault(),xt()):b.key==="-"?(b.preventDefault(),kt()):b.key==="0"?(b.preventDefault(),J()):b.key==="ArrowLeft"?(b.preventDefault(),v={...v,x:v.x+V},O()):b.key==="ArrowRight"?(b.preventDefault(),v={...v,x:v.x-V},O()):b.key==="ArrowUp"?(b.preventDefault(),v={...v,y:v.y+V},O()):b.key==="ArrowDown"?(b.preventDefault(),v={...v,y:v.y-V},O()):(b.key==="f"||b.key==="F")&&(b.preventDefault(),We()))};r.addEventListener("wheel",ae,{passive:!1}),r.addEventListener("pointerdown",se),r.addEventListener("keydown",$t),r.tabIndex=0,window.addEventListener("pointermove",Ie),window.addEventListener("pointerup",$e),window.addEventListener("pointercancel",$e);let et=()=>{Te(),J()};window.addEventListener("resize",et);let Ct=r.clientWidth,le=0,Rt=typeof ResizeObserver>"u"?null:new ResizeObserver(()=>{let b=r.clientWidth;b!==Ct&&(Ct=b,le&&cancelAnimationFrame(le),le=requestAnimationFrame(()=>{le=0,et()}))});Rt?.observe(r),Ee?.(),Ee=()=>{Rt?.disconnect(),le&&cancelAnimationFrame(le),r.removeEventListener("wheel",ae),r.removeEventListener("pointerdown",se),r.removeEventListener("keydown",$t),window.removeEventListener("pointermove",Ie),window.removeEventListener("pointerup",$e),window.removeEventListener("pointercancel",$e),window.removeEventListener("resize",et)},R=r,Be=o;let Ot=sn();Ot?(v=Ot,O()):J()}async function kn(){if(w)throw new Error("Player destroyed.");if(f?.svg&&a.contains(f.svg))return;let t=a.querySelector("svg");if(Xt(t)){if(f=await ze(t,e.source,Yt()),Et(t),p("ready",{nodeCount:f.nodes.size,edgeCount:f.edges.size,diagramType:f.type}),pe==="interactive"&&!y){let i=Array.from(f.nodes.keys())[0];i&&(y=i,k.length=0,k.push(i),Y(),W&&K(i,{scale:1}))}return}if(await new Promise((i,r)=>{$?.disconnect(),$=new MutationObserver(()=>{let o=a.querySelector("svg");Xt(o)&&($?.disconnect(),$=null,ze(o,e.source,Yt()).then(s=>{f=s,Et(o),i()},r))}),$.observe(a,{childList:!0,subtree:!0})}),f&&p("ready",{nodeCount:f.nodes.size,edgeCount:f.edges.size,diagramType:f.type}),pe==="interactive"&&!y&&f){let i=Array.from(f.nodes.keys())[0];i&&(y=i,k.length=0,k.push(i),Y())}}function Pe(){return w?Promise.reject(new Error("Player destroyed.")):(xe||(xe=kn()),xe)}function j(){if(!f)throw new Error("Not ready yet. Call await player.ready().");return f}function he(t){if(l==="none")return;let{nodes:i,edges:r}=j();for(let o of i.values())o.classList.toggle(n.classes.dim,t);for(let o of r.values())o.classList.toggle(n.classes.dim,t)}function Ge(t){let{nodes:i,edges:r}=j();for(let o of i.values())o.classList.remove(n.classes.pulse),t||vr(o),Fe(o,n.classes.nodeStatePrefix);for(let o of r.values())t||yr(o),Fe(o,n.classes.edgeStatePrefix)}function F(t,i,r){let{nodes:o}=j(),s=o.get(t);if(!s){e.debug&&console.warn("[mermaid-flow-player] node not found:",t);return}r?.dimOthers!==!1&&he(!0),s.classList.remove(n.classes.dim),Fe(s,n.classes.nodeStatePrefix),s.classList.add(`${n.classes.nodeStatePrefix}${i}`);let u=r?.easing||ct(d,i),g=r?.duration||m;hr(s,n,i,u,g),s.classList.toggle(n.classes.pulse,!!r?.pulse),p("stateChange",{type:"node",id:t,state:i})}function Z(t,i,r,o){let{edges:s}=j(),u=o?.key??`${t}->${i}`,g=s.get(u);if(!g){e.debug&&console.warn("[mermaid-flow-player] edge not found:",u);return}o?.dimOthers!==!1&&he(!0),g.classList.remove(n.classes.dim),Fe(g,n.classes.edgeStatePrefix),g.classList.add(`${n.classes.edgeStatePrefix}${r}`);let x=o?.easing||ct(d,r),h=o?.duration||m;br(g,n,r,x,h),p("stateChange",{type:"edge",id:u,state:r})}function Ne(t){if(!f)return;let i=!!t?.keepVisited;if(he(!1),Ge(i),i||f.svg.querySelectorAll(`.${n.classes.dim}`).forEach(r=>r.classList.remove(n.classes.dim)),y=null,X=-1,k.length=0,re=!1,z.clear(),St(),pe==="interactive"&&f&&!w){let r=Array.from(f.nodes.keys())[0];r&&(y=r,k.push(r),Y(),W&&K(r,{scale:1}))}p("reset")}function Y(){if(pe!=="interactive"||!f)return;let{nodes:t,edges:i}=f;for(let[o,s]of ue)o.removeEventListener("click",s);ue.clear();let r=[];if(y){for(let o of i.keys())if(o.startsWith(`${y}->`)){let s=H(o)[1];s&&r.push(s)}}for(let[o,s]of t)if(s.classList.remove("mf-interactive-current","mf-interactive-available","mf-interactive-visited","mf-interactive-dimmed","mf-state-dimmed",n.classes.dim),s.style.cursor="",o===y)s.classList.add("mf-interactive-current");else if(r.includes(o)){s.classList.add("mf-interactive-available");let u=(g=>x=>{x.stopPropagation();let h=y;y&&z.add(y),y=g,k.push(g),Y(),e.hooks?.onStepStart?.({type:"node",id:g},void 0),p("navigate",{from:h,to:g}),W&&K(g),ve()})(o);s.addEventListener("click",u),ue.set(s,u)}else z.has(o)?s.classList.add("mf-interactive-visited"):s.classList.add("mf-interactive-dimmed");for(let[o,s]of i){s.classList.remove("mf-interactive-edge-active","mf-interactive-edge-visited","mf-interactive-edge-dimmed","mf-state-dimmed",n.classes.dim);let[u,g]=H(o);u===y&&r.includes(g)?s.classList.add("mf-interactive-edge-active"):z.has(u)&&(z.has(g)||g===y)?s.classList.add("mf-interactive-edge-visited"):s.classList.add("mf-interactive-edge-dimmed")}y&&r.length===0&&(z.add(y),p("done")),y&&r.length>1&&p("pathChoice",{paths:r})}function St(){if(f){for(let[t,i]of ue)t.removeEventListener("click",i);ue.clear();for(let t of f.nodes.values())t.classList.remove("mf-interactive-current","mf-interactive-available","mf-interactive-visited","mf-interactive-dimmed"),t.style.cursor="";for(let t of f.edges.values())t.classList.remove("mf-interactive-edge-active","mf-interactive-edge-visited","mf-interactive-edge-dimmed")}}async function Ye(t,i=()=>G){let r=Date.now();for(;Date.now()-r<t;){if(i())return;for(;L==="paused";){if(i())return;await ye(50)}await ye(20)}}async function En(t,i){await Pe();let r=++I;i?.speed!==void 0&&_(i.speed),G=!1,A("playing");let o=()=>G||I!==r,s=Array.isArray(t)?t.length:0;p("play",{stepCount:s});let u=async()=>{if(typeof t=="function"){await t(It);return}let g=null,x=0;P={current:0,total:t.length};for(let h of t){if(o())return;let E=h.type==="node"?h.note:void 0,S=h.type==="node"?h.note??Xe(h.id):h.type==="edge"?Nt(h.from,h.to,h.key):void 0;if(B&&S&&(B.textContent=S),e.hooks?.onStepStart?.(h,E),p("step",{step:h,index:x++,narration:E,text:S}),P={current:x,total:t.length},p("progress",{...P}),pn(h),h.type==="reset"&&(Ne({keepVisited:!!h.keepVisited}),g=null),h.type==="wait"&&await Ye(h.ms/C,o),h.type==="edge"&&(Z(h.from,h.to,h.state??"active",{dimOthers:!0,easing:h.easing,duration:h.ms??m,key:h.key}),await Ye((h.ms??m)/C,o)),h.type==="node"){let M=h.dimOthers??!0;c&&g&&g!==h.id&&F(g,"visited",{pulse:!1,dimOthers:!1}),F(h.id,h.state??"active",{pulse:h.pulse??!0,dimOthers:M,easing:h.easing,duration:h.ms??m}),g=h.id,y=h.id,k[k.length-1]!==h.id&&k.push(h.id),await Ye((h.ms??m)/C,o)}if(h.type==="node"||h.type==="edge")for(;e.holdStep?.()&&!o();)await ye(50);e.hooks?.onStepEnd?.(h)}!o()&&g&&F(g,"visited",{pulse:!1,dimOthers:!1})};try{do await u();while(!G&&i?.loop);I===r&&(A("idle"),p("done"))}catch(g){throw e.hooks?.onError?.(g),I===r&&A("idle"),g}}function Sn(){L==="playing"&&A("paused"),p("pause")}function Mn(){L==="paused"&&A("playing"),p("resume")}function Tn(){return L==="paused"}function Ln(){return L}function Mt(){L!=="idle"&&(G=!0,I++,A("idle"))}function Tt(){G=!0,A("idle"),f&&Ge(!0)}function Vn(){return f}function Pn(){w=!0,Tt(),Le(),St(),$?.disconnect(),$=null,Ee?.(),Ee=null,f&&Ne({keepVisited:!1}),U?.remove(),U=null,fe&&(document.removeEventListener("keydown",fe),fe=null),f=null,R=null,Be=null,Ke=null,xe=null}function Gn(...t){return t.map(i=>({type:"node",id:i}))}function Nn(t){let i=f;if(!i)throw new Error("Not ready. Call await player.ready() first.");let r=Oe(i,t.map(o=>({type:"node",id:o})));if(!r.valid){let o=r.errors.map(g=>g.id).join(", "),s=r.availableNodeIds.slice(0,20).join(", "),u=r.availableNodeIds.length>20?` \u2026 and ${r.availableNodeIds.length-20} more`:"";throw new Error(`[mermaid-flow-player] Missing node id(s): ${o}. Available: ${s}${u}.`)}}function An(t){let i=f;return i?Oe(i,t):{valid:!1,errors:[{kind:"missing_node",id:"",message:"Not ready. Call await player.ready() first."}],warnings:[],referencedNodeIds:[],referencedEdgeKeys:[],availableNodeIds:[],availableEdgeKeys:[]}}function In(t,i){return{type:"node",id:t,note:i?.note,state:i?.state,ms:i?.ms}}function $n(t,i,r){return{type:"edge",from:t,to:i,state:r?.state,ms:r?.ms}}function Cn(t,i){return{type:"node",id:t,note:i?.note}}function Rn(t,i){return{type:"node",id:t,note:i?.note,state:i?.state,ms:i?.ms}}function On(t,i,r){return{type:"edge",from:t,to:i,state:r?.state,ms:r?.ms}}let oe;function Dn(){if(oe!==void 0)return oe;oe=null;let t=e.source;if(!t||f?.type!=="sequence")return oe;let i=new Map,r=0,o=/(--?>>?|--?x|--?\))/;for(let u of t.split(`
`)){let g=u.trim(),x=g.match(/^note\s+(?:over|left of|right of)\b[^:]*:\s*(.+)$/i);if(x){r>0&&i.set(r-1,x[1].trim());continue}o.test(g)&&g.includes(":")&&!/^(sequencediagram|participant|actor|note|loop|alt|opt|par|and|else|end|activate|deactivate|autonumber|rect|box|critical|break)\b/i.test(g)&&(r+=1)}let s=f.edges.size;return r===s&&i.size>0&&(oe=i),oe}let Ae;function Lt(){return Ae||(Ae=ot(e.source??""),zn(Ae)),Ae}let Vt=!1;function zn(t){if(!e.debug||Vt||!f||t.size===0)return;Vt=!0;let i=[...t.keys()].filter(r=>!f?.nodes.has(r));i.length!==0&&console.warn(`[mermaid-flow-player] %% narrate targets no such node: ${i.join(", ")}. Available ids: ${[...f.nodes.keys()].join(", ")}`)}function Xe(t){let i=Lt().get(t);return i||(f?.graph.nodes.find(r=>r.id===t)?.label??"")}function Je(){return f?Array.from(f.nodes.keys()):[]}function ve(){if(!y)return;let t=Math.max(0,k.length-1),r=(k.length>=2?Nt(k[k.length-2],y):void 0)||Xe(y);B&&r&&(B.textContent=r),p("step",{step:{type:"node",id:y},index:t,node:y,text:r,narration:r})}function Pt(t){let{edges:i}=j(),r=[...i.keys()],o=Math.max(0,Math.min(t,r.length-1));if(r.length===0)return;X=o,he(!1),Ge(!1),z.clear();for(let h=0;h<=o;h++){let E=r[h],[S,M]=H(E);if(!S||!M)continue;let T=h===o;Z(S,M,T?"active":"visited",{dimOthers:!1,key:E}),(c||T)&&(F(M,T?"active":"visited",{pulse:T,dimOthers:!1}),z.add(M))}let s=r[o],[u,g]=H(s);y=g||null,k.length=0,g&&k.push(g);let x=Ze(s,o);B&&x&&(B.textContent=x),p("step",{step:{type:"edge",from:u,to:g,key:s},index:o,node:s,text:x,narration:x})}async function Fn(){if(await Pe(),Mt(),j().type==="sequence"){Pt(X+1);return}let{nodes:t}=j();if(!y){let s=Je()[0]??Array.from(t.keys())[0];if(!s)return;y=s,k.length=0,k.push(s),F(y,"active",{pulse:!0,dimOthers:!0}),Y(),W&&K(s,{scale:1}),ve();return}let i=Gt();if(i.length>1&&!re&&pe==="interactive"){e.hooks?.onPathChoice?.(i);return}let r=null,o=i[0];if(o&&(r=H(o)[1]||null),!r&&j().edges.size===0){let s=Je(),u=s.indexOf(y);u>=0&&u<s.length-1&&(r=s[u+1])}if(!r){Ne();return}if(y&&z.add(y),c&&y&&F(y,"visited",{pulse:!1,dimOthers:!1}),c&&k.length>=2){let s=k[k.length-2],u=k[k.length-1];Z(s,u,"visited",{dimOthers:!1})}o&&(Z(y,r,"active"),await ye(m)),y=r,k.push(r),F(y,"active",{pulse:!0,dimOthers:!0}),re=!1,Y(),W&&K(r),ve()}async function jn(){if(await Pe(),Mt(),j().type==="sequence"){X>0&&Pt(X-1);return}if(k.length<=1)return;let t=k.pop(),i=k[k.length-1];if(!t||!i)return;y=i,re=!1,he(!1),Ge(!1),z.clear();let r=k.slice(0,-1);for(let o of r)z.add(o),c&&F(o,"visited",{pulse:!1,dimOthers:!1});y&&(F(y,"active",{pulse:!0,dimOthers:!0}),W&&K(y,{scale:1}));for(let o=0;o<k.length-1;o++){let s=k[o],u=k[o+1],g=o===k.length-2;Z(s,u,g?"active":"visited",{dimOthers:!1})}Y(),p("previous",{from:t,to:i}),ve()}function Gt(){if(!f||!y)return[];let t=[];for(let i of f.edges.keys())i.startsWith(`${y}->`)&&t.push(i);return t}async function qn(t){let{edges:i}=j();for(let s of i.values())s.style.cursor="",s.classList.remove("mf-interactive-choice");let[r,o]=H(t);if(!r||!o||r!==y){e.debug&&console.warn("[mermaid-flow-player] Invalid path selection:",t);return}re=!0,r&&z.add(r),Z(r,o,"active"),await ye(m),c&&F(r,"visited",{pulse:!1,dimOthers:!1}),y=o,k.push(o),F(o,"active",{pulse:!0,dimOthers:!0}),re=!1,Y(),W&&K(o),ve()}function Un(){return f?.type==="sequence"&&X>=0?[...f.edges.keys()][X]??null:y}function _n(){if(!f)return[];let t=f;if(t.type==="sequence")return[...t.edges.keys()].map((o,s)=>({index:s,node:o,text:Ze(o,s),speaker:H(o)[0]}));let i=At();return(t.edges.size>0&&i[0]?.length?i[0]:Je()).map((o,s)=>({index:s,node:o,text:Xe(o),speaker:o}))}function Bn(t){return f?[...f.edges.keys()].indexOf(t):-1}function Nt(t,i,r){if(f?.type!=="sequence")return;let o=r??`${t}->${i}`,s=Bn(o);return s<0?void 0:Ze(o,s)}function Ze(t,i){let r=Lt(),o=r.get(t)??r.get(`msg-${i}`);if(o)return o;let s=Dn()?.get(i);return s||(f?.graph.edges[i]?.label??"")}function At(){if(!f)return[];let{nodes:t,edges:i}=f;if(i.size===0)return[];let r=new Map,o=new Set;for(let E of i.keys()){let[S,M]=H(E);!S||!M||(r.has(S)||r.set(S,[]),r.get(S).includes(M)||r.get(S).push(M),o.add(M))}let s=Array.from(t.keys()),u=s.filter(E=>!o.has(E));u.length===0&&s.length>0&&u.push(s[0]);let g=new Set(s.filter(E=>!r.has(E)||r.get(E).length===0)),x=[];function h(E,S,M){S.push(E),M.add(E);let T=r.get(E);if(!T||T.length===0||g.has(E))x.push([...S]);else{let D=T.filter(Q=>!M.has(Q));if(D.length===0)x.push([...S]);else for(let Q of D)h(Q,S,M)}S.pop(),M.delete(E)}for(let E of u)h(E,[],new Set);return x}let It={ready:Pe,reset:Ne,setStateNode:F,setStateEdge:Z,play:En,pause:Sn,resume:Mn,isPaused:Tn,getStatus:Ln,stop:Tt,index:Vn,destroy:Pn,path:Gn,assertIds:Nn,validateScenario:An,participant:In,message:$n,activation:Cn,state:Rn,transition:On,nextStep:Fn,previousStep:jn,getAvailablePaths:Gt,selectPath:qn,getCurrentNode:Un,getSteps:_n,computeAllPaths:At,zoomIn:xt,zoomOut:kt,fitView:J,resetView:un,getViewportState:()=>({...v}),toggleFullscreen:gn,openFocusView:We,closeFocusView:Le,focusNode:K,findNodes:xn,toAnimatedSvg:(t,i)=>nt({index:j(),steps:t},{stepMs:m,...i}),copySvg:vn,downloadSvg:bn,downloadPng:yn,openSvg:wn,setSpeed:_,getSpeed:()=>C,getProgress:()=>P?{...P}:null};return It}var en={"mf-active-color":"#4caf50","mf-visited-color":"#2196f3","mf-error-color":"#f44336","mf-success-color":"#4caf50","mf-warning-color":"#ff9800","mf-active-opacity":"1","mf-transition-duration":"220ms","mf-transition-timing":"ease","mf-opacity-transition-duration":"200ms","mf-edge-width":"4px","mf-edge-active-width":"4px","mf-control-bg":"#f8fafc","mf-control-border":"#e2e8f0","mf-control-text":"#334155","mf-control-hover-bg":"#f1f5f9","mf-control-active-bg":"#e2e8f0","mf-control-border-radius":"8px","mf-control-padding":"7px 14px","mf-control-gap":"6px","mf-control-primary-bg":"#4f46e5","mf-control-primary-text":"#fff","mf-control-primary-hover-bg":"#4338ca","mf-narration-bg":"#f8fafc","mf-narration-border":"#e2e8f0","mf-narration-text":"#475569","mf-narration-border-radius":"8px","mf-narration-padding":"12px 16px","mf-narration-font-size":"13px","mf-viewport-bg":"transparent","mf-viewport-border":"rgba(148, 163, 184, 0.22)"},tn={"mf-active-color":"#81c784","mf-visited-color":"#64b5f6","mf-error-color":"#ef5350","mf-success-color":"#81c784","mf-warning-color":"#ffb74d","mf-active-opacity":"1","mf-transition-duration":"220ms","mf-transition-timing":"ease","mf-opacity-transition-duration":"200ms","mf-edge-width":"4px","mf-edge-active-width":"4px","mf-control-bg":"#1e293b","mf-control-border":"#4b5e78","mf-control-text":"#e2e8f0","mf-control-hover-bg":"#334155","mf-control-active-bg":"#475569","mf-control-border-radius":"8px","mf-control-padding":"7px 14px","mf-control-gap":"6px","mf-control-primary-bg":"#6366f1","mf-control-primary-text":"#fff","mf-control-primary-hover-bg":"#818cf8","mf-narration-bg":"#1e293b","mf-narration-border":"#4b5e78","mf-narration-text":"#94a3b8","mf-narration-border-radius":"8px","mf-narration-padding":"12px 16px","mf-narration-font-size":"13px","mf-viewport-bg":"#0f172a","mf-viewport-border":"rgba(148, 163, 184, 0.25)"},qe={light:en,dark:tn};var xr="mermaid-flow-player-theme",we=class{currentTheme;persist;storageKey;target;mediaQuery=null;mediaQueryListener=null;constructor(n={}){this.persist=n.persist??!0,this.storageKey=n.storageKey??xr,this.target=n.target??document.documentElement;let a=this.persist?this.loadTheme():null;this.currentTheme=a??n.theme??"auto",!a&&this.persist&&n.theme&&this.saveTheme(this.currentTheme),this.currentTheme==="auto"&&this.setupSystemPreference(),this.applyTheme(this.getResolvedTheme())}getTheme(){return this.currentTheme}getResolvedTheme(){return this.currentTheme==="auto"?this.getSystemPreference():this.currentTheme}setTheme(n){this.currentTheme=n,this.persist&&this.saveTheme(n),n!=="auto"?this.cleanupSystemPreference():this.setupSystemPreference(),this.applyTheme(this.getResolvedTheme())}toggle(){let a=this.getResolvedTheme()==="light"?"dark":"light";this.setTheme(a)}applyCustomTheme(n){for(let[a,l]of Object.entries(n))this.target.style.setProperty(`--${a}`,l)}reset(){let n=Object.keys(qe.light);for(let a of n)this.target.style.removeProperty(`--${a}`)}destroy(){this.cleanupSystemPreference()}getSystemPreference(){return typeof window>"u"?"light":window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}setupSystemPreference(){typeof window>"u"||!window.matchMedia||(this.cleanupSystemPreference(),this.mediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.mediaQueryListener=n=>{if(this.currentTheme==="auto"){let a=n.matches?"dark":"light";this.applyTheme(a)}},this.mediaQuery.addEventListener?this.mediaQuery.addEventListener("change",this.mediaQueryListener):"addListener"in this.mediaQuery&&this.mediaQuery.addListener(this.mediaQueryListener))}cleanupSystemPreference(){this.mediaQuery&&this.mediaQueryListener&&(this.mediaQuery.removeEventListener?this.mediaQuery.removeEventListener("change",this.mediaQueryListener):"removeListener"in this.mediaQuery&&this.mediaQuery.removeListener(this.mediaQueryListener),this.mediaQuery=null,this.mediaQueryListener=null)}applyTheme(n){let a=qe[n];for(let[l,c]of Object.entries(a))this.target.style.setProperty(`--${l}`,c);this.target.setAttribute("data-mf-theme",n)}loadTheme(){if(typeof window>"u"||!window.localStorage)return null;try{let n=window.localStorage.getItem(this.storageKey);if(n&&(n==="light"||n==="dark"||n==="auto"))return n}catch(n){console.warn("[mermaid-flow-player] Failed to load theme preference:",n)}return null}saveTheme(n){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(this.storageKey,n)}catch(a){console.warn("[mermaid-flow-player] Failed to save theme preference:",a)}}},te=null;function kr(e){return te&&te.destroy(),te=new we(e),te}function Ue(){return te||(te=new we),te}function Er(e){Ue().setTheme(e)}function Sr(){return Ue().getTheme()}function Mr(){Ue().toggle()}var de=null;function Tr(){if(de!==null)return de;if(typeof window>"u"||typeof window.location>"u")return de={},de;let e=new URLSearchParams(window.location.search),n={},a=e.has("debug"),l=e.get("visited");l!==null&&(l===""||l==="true"?n.visited=!0:l==="false"?n.visited=!1:n.visited=_e(l,"visited",a));let c=e.get("speed");c!==null&&(n.speed=mt(c,"speed",.1,10,a));let m=e.get("stepMs");m!==null&&(n.stepMs=mt(m,"stepMs",0,1e4,a));let d=e.get("step");d!==null&&(n.step=mt(d,"step",0,1e5,a));let p=e.get("mode");p!==null&&(n.mode=dt(p,["sequential","interactive"],"mode",a));let w=e.get("debug");w!==null&&(w===""||w==="true"?n.debug=!0:w==="false"?n.debug=!1:n.debug=_e(w,"debug",!0));let f=e.get("autoplay");f!==null&&(f===""||f==="true"?n.autoplay=!0:f==="false"?n.autoplay=!1:n.autoplay=_e(f,"autoplay",a));let G=e.get("trigger");G!==null&&(n.trigger=dt(G,["load","scroll"],"trigger",a));let I=e.get("theme");I!==null&&(n.theme=dt(I,["light","dark","auto"],"theme",a));let C=e.get("selector");if(C!==null){let L=C.trim();L.length>0&&L.length<=256?n.selector=L:a&&C!==""&&console.warn("[mermaid-flow-player] Invalid selector: empty or too long (max 256 chars). Ignored.")}let _=e.get("narration-text");_!==null&&(n.narrationText=_);let P=[["minimap","minimap"],["syncUrl","sync-url"],["autoCenter","autoCenter"],["narration","narration"]];for(let[L,A]of P){let $=e.get(A);$!==null&&($===""||$==="true"?n[L]=!0:$==="false"?n[L]=!1:n[L]=_e($,A,a))}return de=n,n}function dt(e,n,a,l){if(n.includes(e))return e;l&&console.warn(`[mermaid-flow-player] Invalid value for "${a}": "${e}". Allowed values: ${n.join(", ")}`)}function mt(e,n,a,l,c){let m=parseFloat(e);if(isNaN(m)){c&&console.warn(`[mermaid-flow-player] Invalid number for "${n}": "${e}"`);return}if(m<a||m>l){c&&console.warn(`[mermaid-flow-player] Value for "${n}" out of range: ${m}. Must be between ${a} and ${l}`);return}return m}function _e(e,n,a){let l=e.toLowerCase();if(l==="true"||l==="1"||l==="yes")return!0;if(l==="false"||l==="0"||l==="no")return!1;a&&console.warn(`[mermaid-flow-player] Invalid boolean for "${n}": "${e}". Use true/false, 1/0, or yes/no`)}function Lr(){de=null}export{De as DEFAULT_THEME,N as FlowPlayerError,we as ThemeManager,ee as assertNever,it as bindGraph,ze as buildIndex,Lr as clearQueryConfigCache,wr as createFlowPlayer,tn as darkTheme,Sr as getTheme,Ue as getThemeManager,kr as initTheme,or as isValidRenderResult,en as lightTheme,at as mergeTheme,sr as normalizeMermaidError,rt as parseDiagram,ot as parseNarration,Tr as parseQueryParams,mr as parseVoices,Er as setTheme,qe as themes,nt as toAnimatedSvg,fr as toTranscript,pr as toVtt,Mr as toggleTheme,Oe as validateScenario};
