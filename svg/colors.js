/* ============================================================
   单词插画 · SVG 卡通风格
   风格：圆润可爱、高饱和、扁平卡通（适合小学生）
   每个 SVG 统一 100x100 viewBox，透明背景
   ============================================================ */
const WORD_SVG = {

/* ---- 颜色（11个）---- */
'red': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="55" r="32" fill="#FF4444"/><circle cx="50" cy="55" r="28" fill="#FF6B6B"/><ellipse cx="42" cy="45" rx="8" ry="5" fill="#FF8888" opacity=".6"/><path d="M50 23 Q52 15 58 12" stroke="#4CAF50" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="58" cy="12" rx="6" ry="4" fill="#66BB6A"/></svg>`,

'yellow': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="28" fill="#FFD600"/><circle cx="50" cy="50" r="24" fill="#FFEB3B"/><g stroke="#FFD600" stroke-width="4" stroke-linecap="round"><line x1="50" y1="10" x2="50" y2="18"/><line x1="50" y1="82" x2="50" y2="90"/><line x1="10" y1="50" x2="18" y2="50"/><line x1="82" y1="50" x2="90" y2="50"/><line x1="21" y1="21" x2="27" y2="27"/><line x1="73" y1="73" x2="79" y2="79"/><line x1="21" y1="79" x2="27" y2="73"/><line x1="73" y1="27" x2="79" y2="21"/></g></svg>`,

'blue': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="52" r="30" fill="#2196F3"/><circle cx="50" cy="52" r="26" fill="#42A5F5"/><circle cx="42" cy="44" r="7" fill="#64B5F6" opacity=".6"/><path d="M35 75 Q50 85 65 75" stroke="#1565C0" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,

'green': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="46" y="60" width="8" height="25" rx="3" fill="#795548"/><ellipse cx="50" cy="45" rx="28" ry="30" fill="#4CAF50"/><ellipse cx="50" cy="45" rx="22" ry="24" fill="#66BB6A"/><ellipse cx="42" cy="38" rx="7" ry="5" fill="#81C784" opacity=".6"/></svg>`,

'white': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="55" r="28" fill="#E0E0E0" stroke="#BDBDBD" stroke-width="2"/><circle cx="50" cy="55" r="24" fill="#F5F5F5"/><circle cx="42" cy="48" r="5" fill="#E8E8E8"/><circle cx="58" cy="52" r="4" fill="#E8E8E8"/><ellipse cx="50" cy="78" rx="12" ry="4" fill="#E0E0E0" opacity=".5"/></svg>`,

'black': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="28" ry="25" fill="#37474F"/><ellipse cx="50" cy="55" rx="24" ry="21" fill="#455A64"/><polygon points="35,35 30,18 42,30" fill="#37474F"/><polygon points="65,35 70,18 58,30" fill="#37474F"/><circle cx="42" cy="50" r="4" fill="#FFF"/><circle cx="58" cy="50" r="4" fill="#FFF"/><circle cx="43" cy="51" r="2" fill="#37474F"/><circle cx="59" cy="51" r="2" fill="#37474F"/><ellipse cx="50" cy="58" rx="3" ry="2" fill="#FF8A80"/></svg>`,

'orange': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="52" r="30" fill="#FF9800"/><circle cx="50" cy="52" r="26" fill="#FFA726"/><ellipse cx="42" cy="44" rx="7" ry="5" fill="#FFB74D" opacity=".6"/><path d="M50 22 Q52 16 56 14" stroke="#66BB6A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="56" cy="14" rx="5" ry="3" fill="#81C784"/></svg>`,

'pink': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="28" fill="#F48FB1"/><circle cx="50" cy="50" r="24" fill="#F8BBD0"/><circle cx="50" cy="50" r="12" fill="#FCE4EC"/><circle cx="50" cy="50" r="6" fill="#F48FB1"/><g fill="#F48FB1"><ellipse cx="50" cy="28" rx="8" ry="10"/><ellipse cx="72" cy="50" rx="10" ry="8"/><ellipse cx="50" cy="72" rx="8" ry="10"/><ellipse cx="28" cy="50" rx="10" ry="8"/></g></svg>`,

'purple': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="#9C27B0"><circle cx="38" cy="38" r="12"/><circle cx="58" cy="34" r="11"/><circle cx="68" cy="50" r="11"/><circle cx="58" cy="64" r="12"/><circle cx="40" cy="62" r="11"/><circle cx="32" cy="50" r="11"/><circle cx="50" cy="50" r="12"/></g><g fill="#BA68C8"><circle cx="38" cy="38" r="8"/><circle cx="58" cy="34" r="7"/><circle cx="68" cy="50" r="7"/><circle cx="58" cy="64" r="8"/><circle cx="40" cy="62" r="7"/><circle cx="32" cy="50" r="7"/><circle cx="50" cy="50" r="8"/></g></svg>`,

'brown': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="28" ry="24" fill="#795548"/><ellipse cx="50" cy="55" rx="24" ry="20" fill="#8D6E63"/><circle cx="32" cy="32" r="12" fill="#795548"/><circle cx="68" cy="32" r="12" fill="#795548"/><circle cx="32" cy="32" r="7" fill="#A1887F"/><circle cx="68" cy="32" r="7" fill="#A1887F"/><circle cx="42" cy="50" r="4" fill="#FFF"/><circle cx="58" cy="50" r="4" fill="#FFF"/><circle cx="43" cy="51" r="2" fill="#5D4037"/><circle cx="59" cy="51" r="2" fill="#5D4037"/><ellipse cx="50" cy="58" rx="4" ry="3" fill="#5D4037"/></svg>`,

'grey': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="55" rx="30" ry="25" fill="#9E9E9E"/><ellipse cx="48" cy="55" rx="26" ry="21" fill="#BDBDBD"/><path d="M78 55 Q85 55 85 65 Q85 75 78 72" fill="#9E9E9E"/><circle cx="40" cy="48" r="4" fill="#616161"/><circle cx="41" cy="49" r="1.5" fill="#FFF"/><path d="M28 60 Q25 65 28 70" stroke="#757575" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,

};
