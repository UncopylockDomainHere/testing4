// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║   CLASSLINK // GHOST-GRID EDITION                                  ║
// ║   a cyber/hacker game launcher — glass, glow, scanlines & vibes    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 0. Inject base styles (fonts, animated background, HUD, glass, glow)
// ─────────────────────────────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

    :root{
        --bg-0:#05070d;
        --bg-1:#0a0f1c;
        --cyan:#00f0ff;
        --magenta:#ff2bd6;
        --lime:#39ff14;
        --violet:#7b5cff;
        --gold:#ffd23f;
        --grid-line:rgba(0,240,255,.06);
        --glass:rgba(10,16,28,.55);
        --glass-brd:rgba(0,240,255,.22);
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
        margin:0;
        background:var(--bg-0);
        color:#d7e6ff;
        font-family:'JetBrains Mono',ui-monospace,monospace;
        overflow-x:hidden;
        position:relative;
    }

    /* animated starfield / aurora backdrop */
    #bgCanvas{
        position:fixed; inset:0; z-index:0;
        width:100%; height:100%;
        display:block;
    }

    /* moving grid floor (perspective) */
    .cyber-grid{
        position:fixed; left:50%; bottom:-10vh; z-index:0;
        width:200vw; height:120vh;
        transform:translateX(-50%) perspective(40vh) rotateX(62deg);
        transform-origin:center bottom;
        background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
        background-size:60px 60px;
        animation:gridMove 6s linear infinite;
        mask-image:linear-gradient(to top, #000 0%, transparent 75%);
        -webkit-mask-image:linear-gradient(to top, #000 0%, transparent 75%);
        pointer-events:none;
        opacity:.55;
    }
    @keyframes gridMove{ from{background-position:0 0} to{background-position:0 60px} }

    /* CRT scanlines + vignette */
    .scanlines{
        position:fixed; inset:0; z-index:60; pointer-events:none;
        background:repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 2px,
            rgba(0,0,0,.10) 3px,
            rgba(0,0,0,0) 4px
        );
        mix-blend-mode:overlay; opacity:.45;
    }
    .vignette{
        position:fixed; inset:0; z-index:55; pointer-events:none;
        background:radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,.65) 100%);
    }

    /* everything sits above the backdrop */
    .ui-layer{ position:relative; z-index:10; }

    /* ── top status bar (HUD) ──────────────────────────────────────────── */
    .hud{
        position:sticky; top:0; z-index:90;
        display:flex; align-items:center; justify-content:space-between;
        gap:18px; padding:14px 26px;
        background:linear-gradient(180deg, rgba(5,7,13,.85), rgba(5,7,13,.25));
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
        border-bottom:1px solid rgba(0,240,255,.18);
        font-size:12px; letter-spacing:.18em; text-transform:uppercase;
        color:#6fe9ff; text-shadow:0 0 8px rgba(0,240,255,.5);
    }
    .hud .logo{
        font-family:'Orbitron',sans-serif; font-weight:900; font-size:18px;
        letter-spacing:.32em;
        background:linear-gradient(90deg,var(--cyan),var(--magenta),var(--violet));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 0 10px rgba(0,240,255,.45));
        animation:flicker 4s infinite;
    }
    .hud .logo .cursor{ color:var(--lime); -webkit-text-fill-color:var(--lime); animation:blink 1.1s steps(2) infinite; }
    .hud .stats{ display:flex; gap:22px; color:#7aa2c8; text-shadow:none; }
    .hud .stats b{ color:#cfe8ff; font-weight:500; }
    .hud .dot{ display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--lime); box-shadow:0 0 10px var(--lime); margin-right:7px; animation:pulse 1.6s infinite; }
    @keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes blink{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes flicker{ 0%,97%,100%{opacity:1} 98%{opacity:.4} 99%{opacity:.8} }

    /* ── hamburger button (3 lines) — top-left, under the HUD ─────────── */
    .hamburger{
        position:fixed; top:78px; left:22px; z-index:85;
        width:46px; height:46px; border-radius:12px;
        background:var(--glass);
        border:1px solid var(--glass-brd);
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 6px 22px rgba(0,0,0,.5), 0 0 16px rgba(0,240,255,.18);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:6px; cursor:pointer;
        transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease;
    }
    .hamburger:hover{
        border-color:rgba(0,240,255,.7);
        box-shadow:0 6px 22px rgba(0,0,0,.5), 0 0 26px rgba(0,240,255,.5);
        transform:scale(1.07);
    }
    .hamburger .line{
        width:22px; height:2.5px; border-radius:3px;
        background:var(--cyan); box-shadow:0 0 8px rgba(0,240,255,.7);
        transition:transform .3s ease, opacity .25s ease;
    }
    .hamburger.active .line:nth-child(1){ transform:translateY(8.5px) rotate(45deg); }
    .hamburger.active .line:nth-child(2){ opacity:0; transform:scaleX(0); }
    .hamburger.active .line:nth-child(3){ transform:translateY(-8.5px) rotate(-45deg); }

    /* ── slide-in side menu ───────────────────────────────────────────── */
    .side-menu{
        position:fixed; top:0; left:0; bottom:0; z-index:95;
        width:300px; max-width:84vw;
        background:linear-gradient(180deg, rgba(8,12,22,.96), rgba(5,7,13,.96));
        border-right:1px solid rgba(0,240,255,.28);
        box-shadow:18px 0 60px rgba(0,0,0,.7), 0 0 40px rgba(0,240,255,.12);
        backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
        transform:translateX(-105%);
        transition:transform .42s cubic-bezier(.2,.85,.25,1);
        display:flex; flex-direction:column;
        padding:24px 0 24px;
    }
    .side-menu.open{ transform:translateX(0); }
    .side-menu .sm-head{
        display:flex; align-items:center; justify-content:space-between;
        padding:0 24px 22px; border-bottom:1px solid rgba(0,240,255,.14);
    }
    .side-menu .sm-title{
        font-family:'Orbitron',sans-serif; font-weight:900; font-size:16px;
        letter-spacing:.28em; text-transform:uppercase;
        background:linear-gradient(90deg,var(--cyan),var(--magenta));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 0 8px rgba(0,240,255,.4));
    }
    .side-menu .sm-close{
        width:32px; height:32px; border-radius:8px; cursor:pointer;
        background:rgba(0,240,255,.06); border:1px solid rgba(0,240,255,.2);
        color:var(--cyan); font-size:18px; line-height:1;
        display:flex; align-items:center; justify-content:center;
        transition:background .2s ease, border-color .2s ease, transform .2s ease;
    }
    .side-menu .sm-close:hover{ background:rgba(0,240,255,.18); border-color:rgba(0,240,255,.6); transform:rotate(90deg); }
    .side-menu .sm-list{ display:flex; flex-direction:column; padding:18px 16px; gap:10px; flex:1; }
    .side-menu .sm-btn{
        display:flex; align-items:center; gap:14px;
        padding:14px 18px; border-radius:12px; cursor:pointer;
        font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:500;
        letter-spacing:.08em; text-transform:uppercase;
        color:#cfe8ff;
        background:rgba(0,240,255,.04);
        border:1px solid rgba(0,240,255,.16);
        transition:background .22s ease, border-color .22s ease, transform .22s ease, color .22s ease;
        position:relative; overflow:hidden;
    }
    .side-menu .sm-btn .ico{
        font-size:18px; width:24px; text-align:center; flex-shrink:0;
        text-shadow:0 0 10px currentColor;
    }
    .side-menu .sm-btn .lbl{ flex:1; }
    .side-menu .sm-btn .badge{
        font-size:11px; padding:2px 8px; border-radius:10px;
        background:rgba(0,240,255,.12); color:var(--cyan);
        border:1px solid rgba(0,240,255,.25); min-width:24px; text-align:center;
    }
    .side-menu .sm-btn:hover{
        background:rgba(0,240,255,.14); border-color:rgba(0,240,255,.55);
        transform:translateX(6px); color:#fff;
        box-shadow:0 0 22px rgba(0,240,255,.25);
    }
    .side-menu .sm-btn.active{
        background:linear-gradient(90deg, rgba(0,240,255,.22), rgba(123,92,255,.14));
        border-color:rgba(0,240,255,.7); color:#fff;
    }
    .side-menu .sm-btn[data-view="liked"]:hover{ box-shadow:0 0 22px rgba(255,43,214,.3); border-color:rgba(255,43,214,.55); }
    .side-menu .sm-btn[data-view="liked"] .ico{ color:var(--magenta); }
    .side-menu .sm-btn[data-view="liked"] .badge{ color:var(--magenta); background:rgba(255,43,214,.14); border-color:rgba(255,43,214,.3); }
    .side-menu .sm-btn[data-view="favorite"]:hover{ box-shadow:0 0 22px rgba(255,210,63,.3); border-color:rgba(255,210,63,.55); }
    .side-menu .sm-btn[data-view="favorite"] .ico{ color:var(--gold); }
    .side-menu .sm-btn[data-view="favorite"] .badge{ color:var(--gold); background:rgba(255,210,63,.14); border-color:rgba(255,210,63,.3); }
    .side-menu .sm-btn[data-view="games"] .ico{ color:var(--cyan); }
    .side-menu .sm-btn[data-view="chat"] .ico{ color:var(--lime); }
    .side-menu .sm-btn[data-view="chat"]:hover{ box-shadow:0 0 22px rgba(57,255,20,.25); border-color:rgba(57,255,20,.5); }
    .side-menu .sm-btn[data-view="chat"].active{
        background:linear-gradient(90deg, rgba(57,255,20,.18), rgba(123,92,255,.12));
        border-color:rgba(57,255,20,.6);
    }
    .side-menu .sm-foot{
        padding:16px 24px; border-top:1px solid rgba(0,240,255,.14);
        font-size:10px; letter-spacing:.2em; color:#44608a; text-transform:uppercase;
    }

    /* dim overlay when menu open */
    .sm-overlay{
        position:fixed; inset:0; z-index:92;
        background:rgba(0,0,0,.5);
        backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px);
        opacity:0; visibility:hidden;
        transition:opacity .35s ease, visibility .35s ease;
    }
    .sm-overlay.show{ opacity:1; visibility:visible; }

    /* ════════════════════════════════════════════════════════════════════════════ */
    /*  UPDATE LOGS PANEL  —  right-side slide-in box (rounded, not full height)    */
    /* ════════════════════════════════════════════════════════════════════════════ */

    /* ── arrow toggle button (top-right, mirrors the hamburger) ── */
    .log-toggle{
        position:fixed; top:78px; right:22px; z-index:85;
        width:46px; height:46px; border-radius:12px;
        background:var(--glass);
        border:1px solid var(--glass-brd);
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 6px 22px rgba(0,0,0,.5), 0 0 16px rgba(123,92,255,.22);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:3px; cursor:pointer;
        transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease;
    }
    .log-toggle:hover{
        border-color:rgba(123,92,255,.7);
        box-shadow:0 6px 22px rgba(0,0,0,.5), 0 0 26px rgba(123,92,255,.5);
        transform:scale(1.07);
    }
    .log-toggle .lt-ico{
        font-size:20px; color:var(--violet);
        text-shadow:0 0 10px rgba(123,92,255,.8);
        line-height:1; transition:transform .35s ease;
    }
    .log-toggle .lt-arr{
        font-size:11px; color:var(--cyan); line-height:1;
        text-shadow:0 0 8px rgba(0,240,255,.7);
        transition:transform .35s ease;
    }
    /* the chevron flips direction when the panel is open */
    .log-toggle.active .lt-arr{ transform:rotate(180deg); }
    .log-toggle.active .lt-ico{ transform:translateX(-2px); }

    /* ── the Update Logs panel itself (rounded box, slides from right) ── */
    .log-panel{
        position:fixed; z-index:95;
        top:140px; right:22px; bottom:auto;
        width:340px; max-width:84vw; max-height:calc(100vh - 180px);
        background:linear-gradient(180deg, rgba(8,12,22,.96), rgba(5,7,13,.96));
        border:1px solid rgba(123,92,255,.32);
        border-radius:18px;
        box-shadow:-18px 0 60px rgba(0,0,0,.7), 0 0 40px rgba(123,92,255,.14);
        backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
        transform:translateX(calc(100% + 40px));   /* hidden off to the right */
        opacity:0; visibility:hidden;
        transition:transform .42s cubic-bezier(.2,.85,.25,1),
                   opacity .42s ease, visibility .42s ease;
        display:flex; flex-direction:column;
        overflow:hidden;
    }
    .log-panel.open{
        transform:translateX(0);
        opacity:1; visibility:visible;
    }

    /* panel header */
    .log-panel .lp-head{
        display:flex; align-items:center; justify-content:space-between;
        padding:18px 20px 16px;
        border-bottom:1px solid rgba(123,92,255,.2);
        background:linear-gradient(90deg, rgba(123,92,255,.10), transparent);
    }
    .log-panel .lp-title{
        font-family:'Orbitron',sans-serif; font-weight:900; font-size:15px;
        letter-spacing:.22em; text-transform:uppercase;
        background:linear-gradient(90deg,var(--violet),var(--cyan));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 0 8px rgba(123,92,255,.45));
        display:flex; align-items:center; gap:10px;
    }
    .log-panel .lp-title .lp-ico{ font-size:17px; -webkit-text-fill-color:var(--violet); color:var(--violet); }
    .log-panel .lp-ver{
        font-family:'JetBrains Mono',monospace; font-size:10px;
        letter-spacing:.16em; color:var(--cyan);
        background:rgba(0,240,255,.10);
        border:1px solid rgba(0,240,255,.28);
        border-radius:10px; padding:3px 9px;
        text-shadow:0 0 8px rgba(0,240,255,.5);
        white-space:nowrap;
    }
    .log-panel .lp-close{
        width:30px; height:30px; border-radius:8px; cursor:pointer;
        background:rgba(123,92,255,.08); border:1px solid rgba(123,92,255,.25);
        color:var(--violet); font-size:16px; line-height:1;
        display:flex; align-items:center; justify-content:center;
        transition:background .2s ease, border-color .2s ease, transform .2s ease;
        flex-shrink:0;
    }
    .log-panel .lp-close:hover{ background:rgba(123,92,255,.22); border-color:rgba(123,92,255,.6); transform:rotate(90deg); }

    /* scrollable body */
    .log-panel .lp-body{
        overflow-y:auto; padding:8px 18px 18px;
        display:flex; flex-direction:column; gap:18px;
        scrollbar-width:thin;
        scrollbar-color:rgba(123,92,255,.4) transparent;
    }
    .log-panel .lp-body::-webkit-scrollbar{ width:7px; }
    .log-panel .lp-body::-webkit-scrollbar-track{ background:transparent; }
    .log-panel .lp-body::-webkit-scrollbar-thumb{ background:rgba(123,92,255,.35); border-radius:6px; }
    .log-panel .lp-body::-webkit-scrollbar-thumb:hover{ background:rgba(123,92,255,.6); }

    /* each release entry */
    .log-panel .lp-entry{
        display:flex; flex-direction:column; gap:8px;
        padding:14px 14px 12px;
        background:rgba(0,240,255,.035);
        border:1px solid rgba(0,240,255,.14);
        border-radius:12px;
        animation:lpFadeIn .4s ease both;
    }
    .log-panel .lp-entry.current{
        border-color:rgba(123,92,255,.4);
        background:linear-gradient(180deg, rgba(123,92,255,.10), rgba(0,240,255,.03));
        box-shadow:0 0 18px rgba(123,92,255,.18);
    }
    @keyframes lpFadeIn{ from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:none} }

    .log-panel .lp-entry-head{
        display:flex; align-items:center; justify-content:space-between; gap:10px;
    }
    .log-panel .lp-ev{
        font-family:'Orbitron',sans-serif; font-weight:700; font-size:12px;
        letter-spacing:.16em; text-transform:uppercase; color:#cfe8ff;
    }
    .log-panel .lp-edate{
        font-size:9px; letter-spacing:.12em; color:#44608a; text-transform:uppercase;
    }
    .log-panel .lp-etag{
        font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
        padding:2px 7px; border-radius:8px; white-space:nowrap;
    }
    .log-panel .lp-etag.new{ color:var(--lime); background:rgba(57,255,20,.12); border:1px solid rgba(57,255,20,.35); text-shadow:0 0 8px rgba(57,255,20,.4); }
    .log-panel .lp-etag.fix{ color:var(--cyan); background:rgba(0,240,255,.10); border:1px solid rgba(0,240,255,.3); text-shadow:0 0 8px rgba(0,240,255,.4); }

    .log-panel .lp-section{ display:flex; flex-direction:column; gap:5px; margin-top:2px; }
    .log-panel .lp-sec-label{
        font-size:10px; letter-spacing:.14em; text-transform:uppercase; font-weight:700;
        display:flex; align-items:center; gap:7px;
    }
    .log-panel .lp-sec-label.added{ color:var(--lime); }
    .log-panel .lp-sec-label.added .dot{ background:var(--lime); box-shadow:0 0 8px var(--lime); }
    .log-panel .lp-sec-label.fixed{ color:var(--cyan); }
    .log-panel .lp-sec-label.fixed .dot{ background:var(--cyan); box-shadow:0 0 8px var(--cyan); }
    .log-panel .lp-sec-label .dot{ width:7px; height:7px; border-radius:50%; display:inline-block; }
    .log-panel .lp-list{
        list-style:none; margin:0; padding:0 0 0 16px;
        display:flex; flex-direction:column; gap:3px;
    }
    .log-panel .lp-list li{
        font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.5;
        color:#9fb8d6; position:relative; padding-left:4px;
    }
    .log-panel .lp-list li::before{
        content:'›'; position:absolute; left:-12px; color:var(--violet);
        text-shadow:0 0 6px rgba(123,92,255,.6);
    }

    /* footer */
    .log-panel .lp-foot{
        padding:11px 20px; border-top:1px solid rgba(123,92,255,.18);
        font-size:9px; letter-spacing:.18em; color:#44608a; text-transform:uppercase;
        text-align:center;
    }
    .log-panel .lp-foot b{ color:var(--violet); font-weight:700; }

    /* dim overlay when update-logs panel open (reuses sm-overlay look, separate element) */
    .lp-overlay{
        position:fixed; inset:0; z-index:92;
        background:rgba(0,0,0,.45);
        backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px);
        opacity:0; visibility:hidden;
        transition:opacity .35s ease, visibility .35s ease;
    }
    .lp-overlay.show{ opacity:1; visibility:visible; }

    /* ── right-click context menu ─────────────────────────────────────── */
    .ctx-menu{
        position:fixed; z-index:200; min-width:190px;
        background:linear-gradient(180deg, rgba(10,16,28,.97), rgba(6,10,18,.97));
        border:1px solid rgba(0,240,255,.4);
        border-radius:12px; padding:8px;
        box-shadow:0 14px 44px rgba(0,0,0,.7), 0 0 28px rgba(0,240,255,.25);
        backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        opacity:0; transform:scale(.9) translateY(-6px); transform-origin:top left;
        pointer-events:none;
        transition:opacity .16s ease, transform .16s ease;
    }
    .ctx-menu.show{ opacity:1; transform:scale(1) translateY(0); pointer-events:auto; }
    .ctx-menu .ctx-head{
        font-family:'Orbitron',sans-serif; font-size:10px; letter-spacing:.22em;
        text-transform:uppercase; color:#5b7a9e; padding:6px 12px 8px;
        border-bottom:1px solid rgba(0,240,255,.12); margin-bottom:6px;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:240px;
    }
    .ctx-menu .ctx-item{
        display:flex; align-items:center; gap:12px;
        padding:10px 12px; border-radius:8px; cursor:pointer;
        font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:500;
        letter-spacing:.04em; color:#cfe8ff;
        transition:background .16s ease, color .16s ease, padding-left .16s ease;
        white-space:nowrap;
    }
    .ctx-menu .ctx-item .ico{ font-size:15px; width:18px; text-align:center; flex-shrink:0; }
    .ctx-menu .ctx-item:hover{ background:rgba(0,240,255,.16); color:#fff; padding-left:16px; }
    .ctx-menu .ctx-item[data-act="like"] .ico{ color:var(--magenta); }
    .ctx-menu .ctx-item[data-act="favorite"] .ico{ color:var(--gold); }
    .ctx-menu .ctx-item[data-act="games"] .ico{ color:var(--cyan); }
    .ctx-menu .ctx-item.on{ color:var(--lime); }
    .ctx-menu .ctx-item.on .ico{ color:var(--lime); text-shadow:0 0 8px var(--lime); }
    .ctx-menu .ctx-sep{ height:1px; background:rgba(0,240,255,.12); margin:6px 4px; }

    /* ── search bar ───────────────────────────────────────────────────── */
    .search-wrap{
        position:sticky; top:62px; z-index:80;
        display:flex; justify-content:center;
        padding:26px 20px 6px;
    }
    #searchBar{
        width:92%; max-width:760px;
        padding:16px 22px 16px 52px;
        font-family:'JetBrains Mono',monospace; font-size:17px; font-weight:500;
        letter-spacing:.04em;
        color:#e8f6ff;
        background:var(--glass);
        border:1px solid var(--glass-brd);
        border-radius:16px;
        outline:none;
        backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
        box-shadow:
            0 0 0 1px rgba(0,240,255,.06),
            0 8px 40px rgba(0,240,255,.12),
            inset 0 0 22px rgba(0,240,255,.06);
        transition:border-color .25s ease, box-shadow .25s ease, transform .25s ease;
    }
    #searchBar::placeholder{ color:#5b7a9e; }
    #searchBar:focus{
        border-color:rgba(0,240,255,.6);
        box-shadow:
            0 0 0 1px rgba(0,240,255,.25),
            0 0 30px rgba(0,240,255,.35),
            inset 0 0 22px rgba(0,240,255,.1);
        transform:translateY(-1px);
    }
    .search-wrap::before{
        content:''; position:absolute; left:max(6%, calc(50% - 366px));
        top:42px; transform:translateY(-50%);
        font-family:'Orbitron',sans-serif; font-weight:700; font-size:20px;
        color:var(--cyan); text-shadow:0 0 12px rgba(0,240,255,.7);
        pointer-events:none; z-index:81;
    }
    .search-count{
        position:absolute; right:max(5%, calc(50% - 366px)); top:46px;
        font-size:11px; letter-spacing:.18em; text-transform:uppercase;
        color:#5b7a9e; pointer-events:none;
    }

    /* ── page view header (for liked / favorite pages) ────────────────── */
    .view-head{
        display:flex; flex-direction:column; align-items:center; gap:18px;
        padding:34px 20px 8px; text-align:center;
    }
    .view-head .vh-title{
        font-family:'Orbitron',sans-serif; font-weight:900; font-size:26px;
        letter-spacing:.22em; text-transform:uppercase;
        background:linear-gradient(90deg,var(--cyan),var(--magenta));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 0 12px rgba(0,240,255,.4));
    }
    .view-head .vh-sub{
        font-size:11px; letter-spacing:.22em; text-transform:uppercase;
        color:#5b7a9e;
    }
    .view-head .back-btn{
        display:inline-flex; align-items:center; gap:10px;
        padding:12px 26px; border-radius:12px; cursor:pointer;
        font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:600;
        letter-spacing:.12em; text-transform:uppercase; color:var(--cyan);
        background:rgba(0,240,255,.08);
        border:1px solid rgba(0,240,255,.35);
        box-shadow:0 0 18px rgba(0,240,255,.18);
        transition:background .22s ease, border-color .22s ease, transform .22s ease, box-shadow .22s ease;
    }
    .view-head .back-btn:hover{
        background:rgba(0,240,255,.2); border-color:rgba(0,240,255,.7);
        transform:translateY(-2px); box-shadow:0 0 28px rgba(0,240,255,.45);
    }
    .view-head .back-btn:active{ transform:translateY(0); }

    /* ── chat view (full-bleed iframe) ─────────────────────────────────── */
    .chat-view{
        position:fixed; inset:0; z-index:80;
        display:none; flex-direction:column;
        background:var(--bg-0);
    }
    .chat-view.open{ display:flex; }
    .chat-view .cv-bar{
        display:flex; align-items:center; justify-content:space-between; gap:14px;
        padding:12px 22px;
        background:linear-gradient(180deg, rgba(5,7,13,.92), rgba(5,7,13,.55));
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        border-bottom:1px solid rgba(0,240,255,.22);
    }
    .chat-view .cv-title{
        font-family:'Orbitron',sans-serif; font-weight:900; font-size:15px;
        letter-spacing:.28em; text-transform:uppercase;
        background:linear-gradient(90deg,var(--cyan),var(--violet));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 0 8px rgba(0,240,255,.4));
    }
    .chat-view .cv-back{
        display:inline-flex; align-items:center; gap:10px;
        padding:10px 22px; border-radius:12px; cursor:pointer;
        font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600;
        letter-spacing:.12em; text-transform:uppercase; color:var(--cyan);
        background:rgba(0,240,255,.08); border:1px solid rgba(0,240,255,.35);
        box-shadow:0 0 18px rgba(0,240,255,.18);
        transition:background .22s ease, border-color .22s ease, transform .22s ease, box-shadow .22s ease;
    }
    .chat-view .cv-back:hover{
        background:rgba(0,240,255,.2); border-color:rgba(0,240,255,.7);
        transform:translateY(-2px); box-shadow:0 0 28px rgba(0,240,255,.45);
    }
    .chat-view .cv-back:active{ transform:translateY(0); }
    .chat-view .cv-frame-wrap{ flex:1; position:relative; overflow:hidden; }
    .chat-view .cv-loading{
        position:absolute; inset:0; z-index:1;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px;
        background:var(--bg-0); color:var(--cyan);
        font-family:'JetBrains Mono',monospace; letter-spacing:.2em; text-transform:uppercase; font-size:12px;
        text-shadow:0 0 10px rgba(0,240,255,.6);
    }
    .chat-view .cv-spin{
        width:46px; height:46px; border:3px solid rgba(0,240,255,.2);
        border-top-color:#00f0ff; border-radius:50%;
        animation:cvSpin 1s linear infinite; box-shadow:0 0 18px rgba(0,240,255,.5);
    }
    @keyframes cvSpin{ to{ transform:rotate(360deg); } }
    .chat-view iframe{
        position:absolute; inset:0; width:100%; height:100%; border:0;
        background:#05070d;
    }

    /* ── grid of tiles ────────────────────────────────────────────────── */
    .grid{
        display:grid;
        grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));
        gap:34px 26px;
        padding:30px 40px 70px;
        justify-items:center;
        max-width:1500px; margin:0 auto;
    }

    .app-container{
        text-align:center; width:100%; max-width:200px;
        display:flex; flex-direction:column; align-items:center; gap:12px;
        opacity:0; transform:translateY(18px) scale(.96);
        animation:tileIn .55s cubic-bezier(.2,.8,.2,1) forwards;
    }
    @keyframes tileIn{ to{opacity:1; transform:none} }

    .app-btn{
        position:relative;
        width:150px; height:150px;
        border-radius:18px; border:1px solid rgba(0,240,255,.18);
        background:rgba(10,16,28,.6);
        color:white; cursor:pointer; padding:0; overflow:hidden;
        display:flex; align-items:center; justify-content:center;
        backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
        box-shadow:
            0 10px 30px rgba(0,0,0,.55),
            0 0 0 1px rgba(255,255,255,.03) inset;
        transition:transform .28s cubic-bezier(.2,.8,.2,1),
                   box-shadow .28s ease, border-color .28s ease;
        will-change:transform;
    }
    /* corner brackets — HUD frame */
    .app-btn::before, .app-btn::after{
        content:''; position:absolute; width:16px; height:16px; z-index:3;
        border:2px solid var(--cyan); opacity:.7;
        transition:opacity .25s ease, transform .25s ease;
    }
    .app-btn::before{ top:7px; left:7px; border-right:none; border-bottom:none; border-top-left-radius:6px; }
    .app-btn::after{ bottom:7px; right:7px; border-left:none; border-top:none; border-bottom-right-radius:6px; }

    /* like / favorite badges on tiles */
    .tile-badge{
        position:absolute; top:8px; right:8px; z-index:6;
        width:26px; height:26px; border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        font-size:13px; pointer-events:none;
        opacity:0; transform:scale(.4);
        transition:opacity .3s ease, transform .3s ease;
    }
    .tile-badge.show{ opacity:1; transform:scale(1); }
    .tile-badge.liked{
        background:rgba(255,43,214,.85); color:#fff;
        box-shadow:0 0 12px rgba(255,43,214,.7);
    }
    .tile-badge.favorited{
        background:rgba(255,210,63,.9); color:#1a1400;
        box-shadow:0 0 12px rgba(255,210,63,.7);
    }

    /* ── UNAVAILABLE / "not playable yet" indicator on the tile logo ── */
    /* dim the whole tile */
    .app-btn.unavailable{ cursor:not-allowed; }
    .app-btn.unavailable img{ filter:grayscale(1) brightness(.45) contrast(.95); }
    .app-btn.unavailable:hover img{ filter:grayscale(1) brightness(.5) contrast(.95); transform:scale(1); }
    .app-btn.unavailable:hover{
        transform:translateY(-3px) scale(1.02);
        border-color:rgba(255,43,214,.55);
        box-shadow:0 12px 36px rgba(0,0,0,.6), 0 0 24px rgba(255,43,214,.3);
    }
    /* corner brackets turn magenta on unavailable tiles */
    .app-btn.unavailable::before, .app-btn.unavailable::after{ border-color:var(--magenta); opacity:.8; }

    /* dark wash over the logo */
    .app-btn .unavail-wash{
        position:absolute; inset:0; z-index:3; pointer-events:none;
        background:linear-gradient(180deg, rgba(5,7,13,.35) 0%, rgba(5,7,13,.7) 100%);
        border-radius:18px;
        opacity:0; transition:opacity .25s ease;
    }
    .app-btn.unavailable .unavail-wash{ opacity:1; }

    /* center "playable" lock glyph over the logo */
    .app-btn .unavail-icon{
        position:absolute; z-index:5; pointer-events:none;
        top:50%; left:50%; transform:translate(-50%,-50%) scale(.6);
        width:54px; height:54px; border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        font-size:26px; color:var(--magenta);
        background:rgba(5,7,13,.7);
        border:1.5px solid rgba(255,43,214,.6);
        box-shadow:0 0 18px rgba(255,43,214,.5), inset 0 0 12px rgba(255,43,214,.2);
        text-shadow:0 0 10px rgba(255,43,214,.9);
        opacity:0; transition:opacity .3s ease, transform .3s cubic-bezier(.2,.8,.2,1);
        backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px);
    }
    .app-btn.unavailable .unavail-icon{ opacity:1; transform:translate(-50%,-50%) scale(1); }
    .app-btn.unavailable:hover .unavail-icon{ transform:translate(-50%,-50%) scale(1.08); }

    /* diagonal "OFFLINE" ribbon across a corner of the logo */
    .app-btn .unavail-ribbon{
        position:absolute; z-index:6; pointer-events:none;
        top:14px; left:-46px;
        width:170px; text-align:center;
        transform:rotate(-45deg);
        font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700;
        letter-spacing:.18em; text-transform:uppercase;
        color:#fff;
        background:linear-gradient(90deg, var(--magenta), #b2179a);
        padding:4px 0;
        box-shadow:0 0 12px rgba(255,43,214,.6);
        opacity:0; transition:opacity .3s ease;
        white-space:nowrap;
    }
    .app-btn.unavailable .unavail-ribbon{ opacity:.95; }

    /* status note under the label */
    .status-note{
        font-size:9px; letter-spacing:.16em; text-transform:uppercase;
        color:var(--magenta); text-shadow:0 0 10px rgba(255,43,214,.5);
        margin-top:-4px; opacity:.9;
    }

    /* moving scanline sheen across the tile */
    .app-btn .sheen{
        position:absolute; inset:0; z-index:2; pointer-events:none;
        background:linear-gradient(115deg, transparent 30%, rgba(0,240,255,.18) 48%, transparent 66%);
        background-size:300% 100%; background-position:200% 0;
        opacity:0; transition:opacity .2s ease;
        mix-blend-mode:screen;
    }
    .app-btn:hover .sheen{ opacity:1; animation:sheenMove 1.1s ease forwards; }
    @keyframes sheenMove{ from{background-position:200% 0} to{background-position:-60% 0} }

    .app-btn img{
        width:100%; height:100%; object-fit:cover;
        border-radius:18px; pointer-events:none;
        filter:saturate(1.05) contrast(1.05);
        transition:filter .3s ease, transform .4s ease;
    }

    .app-btn:hover{
        transform:translateY(-8px) scale(1.06);
        border-color:rgba(0,240,255,.7);
        box-shadow:
            0 18px 50px rgba(0,0,0,.6),
            0 0 26px rgba(0,240,255,.45),
            0 0 60px rgba(123,92,255,.25);
    }
    .app-btn:hover img{ filter:saturate(1.25) contrast(1.12) brightness(1.05); transform:scale(1.04); }
    .app-btn:hover::before, .app-btn:hover::after{ opacity:1; transform:scale(1.1); }

    .app-btn:active{ transform:translateY(-4px) scale(.98); }

    /* hint to right-click */
    .app-container .rc-hint{
        font-size:9px; letter-spacing:.14em; text-transform:uppercase;
        color:#3d5675; opacity:0; transition:opacity .25s ease;
    }
    .app-container:hover .rc-hint{ opacity:1; }

    .label{
        font-size:13px; letter-spacing:.06em; font-weight:500;
        color:#9fb8d6; max-width:180px;
        word-wrap:break-word; line-height:1.25;
        text-shadow:0 1px 6px rgba(0,0,0,.8);
        transition:color .25s ease, text-shadow .25s ease;
    }
    .app-container:hover .label{ color:var(--cyan); text-shadow:0 0 12px rgba(0,240,255,.55); }

    /* empty state */
    .empty{
        grid-column:1/-1; text-align:center; padding:80px 20px;
        color:#5b7a9e; font-family:'Orbitron',sans-serif; letter-spacing:.3em;
        font-size:14px; text-transform:uppercase;
    }
    .empty span{ color:var(--magenta); text-shadow:0 0 14px rgba(255,43,214,.6); }
    .empty .big{ display:block; font-size:42px; margin-bottom:16px; opacity:.5; }

    /* unavailable toast */
    #unavailToast{
        position:fixed; left:50%; bottom:32px; z-index:210;
        transform:translate(-50%, 30px); opacity:0;
        display:flex; align-items:center; gap:14px;
        padding:16px 22px; border-radius:14px;
        background:linear-gradient(180deg, rgba(12,8,18,.97), rgba(6,4,10,.97));
        border:1px solid rgba(255,43,214,.5);
        box-shadow:0 14px 44px rgba(0,0,0,.7), 0 0 30px rgba(255,43,214,.3);
        backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        transition:opacity .3s ease, transform .3s cubic-bezier(.2,.8,.2,1);
        pointer-events:none; max-width:90vw;
    }
    #unavailToast.show{ opacity:1; transform:translate(-50%, 0); }
    #unavailToast .ut-lock{
        font-size:24px; color:var(--magenta);
        text-shadow:0 0 14px rgba(255,43,214,.8);
        flex-shrink:0;
    }
    #unavailToast .ut-title{
        font-family:'Orbitron',sans-serif; font-weight:700; font-size:14px;
        letter-spacing:.2em; color:#fff;
        text-shadow:0 0 10px rgba(255,43,214,.5);
    }
    #unavailToast .ut-sub{
        font-size:11px; letter-spacing:.12em; color:#ff9ae6;
        margin-top:3px; text-transform:uppercase;
    }

    /* boot splash */
    #boot{
        position:fixed; inset:0; z-index:999; background:var(--bg-0);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:14px; font-family:'JetBrains Mono',monospace; color:var(--cyan);
        text-shadow:0 0 14px rgba(0,240,255,.6);
        transition:opacity .6s ease, visibility .6s ease;
    }
    #boot .b-logo{ font-family:'Orbitron',sans-serif; font-weight:900; font-size:34px; letter-spacing:.4em;
        background:linear-gradient(90deg,var(--cyan),var(--magenta)); -webkit-background-clip:text; background-clip:text; color:transparent; }
    #boot .b-bar{ width:280px; height:4px; border-radius:4px; background:rgba(0,240,255,.15); overflow:hidden; }
    #boot .b-bar i{ display:block; height:100%; width:0; background:linear-gradient(90deg,var(--cyan),var(--violet)); box-shadow:0 0 14px var(--cyan); animation:bootBar 1.1s ease forwards; }
    #boot .b-log{ font-size:11px; letter-spacing:.18em; color:#5b7a9e; min-height:16px; }
    @keyframes bootBar{ to{ width:100% } }
    #boot.hide{ opacity:0; visibility:hidden; }
`;
document.head.appendChild(style);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Boot splash (fake terminal boot — the "hacky" vibe)
// ─────────────────────────────────────────────────────────────────────────────
const boot = document.createElement('div');
boot.id = 'boot';
boot.innerHTML = `
    <div class="b-logo">CLASSLINK</div>
    <div class="b-bar"><i></i></div>
    <div class="b-log">initializing class-link…</div>
`;
document.body.appendChild(boot);
const bootLog = boot.querySelector('.b-log');
const bootLines = [
  'decrypting index…',
  'mounting /games…',
  'rendering tiles…',
  'SYSTEM ONLINE ✓',
];
let bi = 0;
const bootTimer = setInterval(() => {
  if (bi < bootLines.length) bootLog.textContent = bootLines[bi++];
}, 240);
setTimeout(() => {
  clearInterval(bootTimer);
  boot.classList.add('hide');
  setTimeout(() => boot.remove(), 700);
}, 1150);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Animated background canvas (drifting particles + drifting hex)
// ─────────────────────────────────────────────────────────────────────────────
const bgCanvas = document.createElement('canvas');
bgCanvas.id = 'bgCanvas';
document.body.insertBefore(bgCanvas, document.body.firstChild);

const gridFloor = document.createElement('div');
gridFloor.className = 'cyber-grid';
document.body.insertBefore(gridFloor, bgCanvas.nextSibling);

const scan = document.createElement('div'); scan.className = 'scanlines';
const vig = document.createElement('div'); vig.className = 'vignette';
document.body.appendChild(vig);
document.body.appendChild(scan);

(function initCanvas() {
  const ctx = bgCanvas.getContext('2d');
  let w, h, particles, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = bgCanvas.width = innerWidth * dpr;
    h = bgCanvas.height = innerHeight * dpr;
    bgCanvas.style.width = innerWidth + 'px';
    bgCanvas.style.height = innerHeight + 'px';
    const count = Math.min(90, Math.floor(innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      a: Math.random() * 0.5 + 0.2,
    }));
  }
  resize();
  addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // soft aurora blobs
    const t = performance.now() * 0.0002;
    const g1 = ctx.createRadialGradient(w * (0.3 + Math.sin(t) * 0.1), h * 0.3, 0, w * 0.3, h * 0.3, w * 0.5);
    g1.addColorStop(0, 'rgba(0,240,255,0.10)'); g1.addColorStop(1, 'rgba(0,240,255,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
    const g2 = ctx.createRadialGradient(w * (0.7 + Math.cos(t) * 0.1), h * 0.7, 0, w * 0.7, h * 0.7, w * 0.5);
    g2.addColorStop(0, 'rgba(123,92,255,0.10)'); g2.addColorStop(1, 'rgba(123,92,255,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

    // particles + connection lines
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,255,${p.a})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < (140 * dpr) * (140 * dpr)) {
          const o = (1 - Math.sqrt(d2) / (140 * dpr)) * 0.18;
          ctx.strokeStyle = `rgba(0,240,255,${o})`;
          ctx.lineWidth = dpr * 0.6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─────────────────────────────────────────────────────────────────────────────
// 3. HUD bar
// ─────────────────────────────────────────────────────────────────────────────
const uiLayer = document.createElement('div');
uiLayer.className = 'ui-layer';
document.body.appendChild(uiLayer);

const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
    <div class="logo">CLASSLINK<span class="cursor">_</span></div>
    <div class="stats">
        <span><span class="dot"></span>ONLINE</span>
        <span>NODES <b id="nodeCount">--</b></span>
        <span id="clock">--:--:--</span>
    </div>
`;
uiLayer.appendChild(hud);

// live clock
function tickClock() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  document.getElementById('clock').textContent =
    `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
setInterval(tickClock, 1000); tickClock();

// ─────────────────────────────────────────────────────────────────────────────
// 4. Hamburger button (3 lines) — top-left, under the HUD
// ─────────────────────────────────────────────────────────────────────────────
const hamburger = document.createElement('div');
hamburger.className = 'hamburger';
hamburger.title = 'open menu';
hamburger.setAttribute('aria-label', 'menu');
hamburger.innerHTML = `<span class="line"></span><span class="line"></span><span class="line"></span>`;
document.body.appendChild(hamburger);

// ─────────────────────────────────────────────────────────────────────────────
// 5. Slide-in side menu
// ─────────────────────────────────────────────────────────────────────────────
const smOverlay = document.createElement('div');
smOverlay.className = 'sm-overlay';
document.body.appendChild(smOverlay);

const sideMenu = document.createElement('div');
sideMenu.className = 'side-menu';
sideMenu.innerHTML = `
    <div class="sm-head">
        <div class="sm-title">MENU</div>
        <div class="sm-close" id="smClose">✕</div>
    </div>
    <div class="sm-list">
        <div class="sm-btn" data-view="games">
            <span class="ico">▦</span>
            <span class="lbl">Games</span>
            <span class="badge" id="badgeGames">--</span>
        </div>
        <div class="sm-btn" data-view="liked">
            <span class="ico">♥</span>
            <span class="lbl">Liked Games</span>
            <span class="badge" id="badgeLiked">0</span>
        </div>
        <div class="sm-btn" data-view="favorite">
            <span class="ico">★</span>
            <span class="lbl">Favorite Games</span>
            <span class="badge" id="badgeFav">0</span>
        </div>
    </div>
    <div class="sm-foot">CLASSLINK // GHOST-GRID</div>
`;
document.body.appendChild(sideMenu);

// ───────────────────────────────────────────────────────────────────────────
// 5a. Chat view — loads the remote chat HTML inside an in-launcher iframe
// ───────────────────────────────────────────────────────────────────────────
const CHAT_URL = '';
// jsdelivr serves this file as text/plain, so we can't just point an iframe
// `src` at it (the browser would render the raw source). Instead we fetch the
// HTML and write it into the iframe's own document, with a <base> tag so the
// page's relative css/ and js/ paths resolve against the jsdelivr folder.
const CHAT_BASE = CHAT_URL.replace(/\/[^\/]*$/, '/');

const chatView = document.createElement('div');
chatView.className = 'chat-view';
chatView.innerHTML = `
    <div class="cv-bar">
        <div class="cv-title">⌨ Chat</div>
        <div class="cv-back" id="cvBack">⧉ Back to Games</div>
    </div>
    <div class="cv-frame-wrap">
        <div class="cv-loading" id="cvLoading">
            <div class="cv-spin"></div>
            <div>Connecting // Chat</div>
        </div>
        <iframe id="cvFrame" src="about:blank" title="Chat" allow="clipboard-read; clipboard-write; autoplay; microphone; camera"></iframe>
    </div>
`;
document.body.appendChild(chatView);

const cvFrame   = chatView.querySelector('#cvFrame');
const cvLoading = chatView.querySelector('#cvLoading');

function openChatView() {
  // mark the Chat menu button as active, clear the others
  document.querySelectorAll('.side-menu .sm-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === 'chat');
  });
  // reset the grid/header so they don't show through behind the overlay
  currentView = 'chat';
  grid.style.display = 'none';
  viewHead.style.display = 'none';
  searchWrap.style.display = 'none';

  cvLoading.style.display = 'flex';
  chatView.classList.add('open');
  closeSideMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fetch the raw HTML and write it into the iframe so it's parsed as a real
  // HTML document (jsdelivr serves it as text/plain). A <base> tag makes the
  // page's relative css/js references resolve against the jsdelivr folder.
  fetch(CHAT_URL, { mode: 'cors' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(html => {
      const doc = cvFrame.contentDocument || cvFrame.contentWindow.document;
      doc.open();
      doc.write(html);
      // ensure relative URLs resolve against the remote folder
      const base = doc.createElement('base');
      base.href = CHAT_BASE;
      doc.head.insertBefore(base, doc.head.firstChild);
      doc.close();
      cvLoading.style.display = 'none';
    })
    .catch(() => {
      const doc = cvFrame.contentDocument || cvFrame.contentWindow.document;
      doc.open();
      doc.write(`<div style="color:#ff2bd6;font-family:'JetBrains Mono',monospace;text-align:center;padding:40px">
        <h2>// CONNECTION_FAILED</h2>
        <p style="color:#5b7a9e">couldn't reach the chat node.</p></div>`);
      doc.close();
      cvLoading.style.display = 'none';
    });
}

function closeChatView() {
  chatView.classList.remove('open');
  cvFrame.src = 'about:blank';  // unload so audio/state doesn't keep running in the background
  cvLoading.style.display = 'flex';
  setView('games');             // return to the games grid
}

chatView.querySelector('#cvBack').addEventListener('click', closeChatView);


// ─────────────────────────────────────────────────────────────────────────────
// 5b. Update Logs panel  (right-side slide-in box)
//     arrow toggle button + rounded panel showing version / added / fixed

// changelog data — newest first.  edit / extend freely.
const CHANGELOG_VERSION = 'v2.3.351';
const changelog = [
  {
    version: 'v2.3.351',
    date: '08 · 11 · 2026',
    tag: 'new',
    added: [
      'Update Logs panel — slide-in changelog from the right',
    ],
    fixed: [
      'Running Fred Logo',
      'Buckshot Roulette game launching',
    ],
  },
];

// build a single entry's inner HTML from a changelog object
function buildLogEntry(c, isCurrent) {
  const tagClass = c.tag === 'new' ? 'new' : 'fix';
  const tagText  = c.tag === 'new' ? 'NEW' : 'FIX';
  const addedHtml = (c.added && c.added.length) ? `
    <div class="lp-section">
      <div class="lp-sec-label added"><span class="dot"></span>Added</div>
      <ul class="lp-list">${c.added.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>` : '';
  const fixedHtml = (c.fixed && c.fixed.length) ? `
    <div class="lp-section">
      <div class="lp-sec-label fixed"><span class="dot"></span>Fixed</div>
      <ul class="lp-list">${c.fixed.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>` : '';
  return `
    <div class="lp-entry${isCurrent ? ' current' : ''}">
      <div class="lp-entry-head">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="lp-ev">${c.version}</span>
          <span class="lp-etag ${tagClass}">${tagText}</span>
        </div>
        <span class="lp-edate">${c.date}</span>
      </div>
      ${addedHtml}${fixedHtml}
    </div>`;
}

// arrow toggle button (top-right)
const logToggle = document.createElement('div');
logToggle.className = 'log-toggle';
logToggle.title = 'update logs';
logToggle.setAttribute('aria-label', 'update logs');
logToggle.innerHTML = `
    <span class="lt-ico">❖</span>
    <span class="lt-arr">◂</span>
`;
document.body.appendChild(logToggle);

// dim overlay for the update-logs panel
const lpOverlay = document.createElement('div');
lpOverlay.className = 'lp-overlay';
document.body.appendChild(lpOverlay);

// the panel itself
const logPanel = document.createElement('div');
logPanel.className = 'log-panel';
logPanel.innerHTML = `
    <div class="lp-head">
        <div class="lp-title"><span class="lp-ico">❖</span>Update Logs</div>
        <span class="lp-ver">${CHANGELOG_VERSION}</span>
        <div class="lp-close" id="lpClose">✕</div>
    </div>
    <div class="lp-body">
        ${changelog.map((c, i) => buildLogEntry(c, i === 0)).join('')}
    </div>
    <div class="lp-foot">CLASSLINK // <b>CHANGELOG</b></div>
`;
document.body.appendChild(logPanel);

// open / close logic
function openLogPanel() {
  logPanel.classList.add('open');
  lpOverlay.classList.add('show');
  logToggle.classList.add('active');
}
function closeLogPanel() {
  logPanel.classList.remove('open');
  lpOverlay.classList.remove('show');
  logToggle.classList.remove('active');
}
function toggleLogPanel() {
  if (logPanel.classList.contains('open')) closeLogPanel();
  else openLogPanel();
}

logToggle.addEventListener('click', toggleLogPanel);
document.getElementById('lpClose').addEventListener('click', closeLogPanel);
lpOverlay.addEventListener('click', closeLogPanel);

// 6. Right-click context menu (shared, repositioned per click)
// ─────────────────────────────────────────────────────────────────────────────
const ctxMenu = document.createElement('div');
ctxMenu.className = 'ctx-menu';
ctxMenu.innerHTML = `
    <div class="ctx-head" id="ctxHead">game</div>
    <div class="ctx-item" data-act="games"><span class="ico">▦</span>Games</div>
    <div class="ctx-sep"></div>
    <div class="ctx-item" data-act="like"><span class="ico">♥</span><span id="ctxLikeLabel">Like game</span></div>
    <div class="ctx-item" data-act="favorite"><span class="ico">★</span><span id="ctxFavLabel">Favorite game</span></div>
`;
document.body.appendChild(ctxMenu);

// ─────────────────────────────────────────────────────────────────────────────
// 7. Search bar
// ─────────────────────────────────────────────────────────────────────────────
const searchWrap = document.createElement('div');
searchWrap.className = 'search-wrap';
searchWrap.innerHTML = `
    <input id="searchBar" type="text" placeholder="search the grid" autocomplete="off" spellcheck="false" />
    <div class="search-count" id="searchCount"></div>
`;
uiLayer.appendChild(searchWrap);
const searchBar = document.getElementById('searchBar');
const searchCount = document.getElementById('searchCount');

// ─────────────────────────────────────────────────────────────────────────────
// 8. View header (shown on liked / favorite pages — includes "Games" back btn)
// ─────────────────────────────────────────────────────────────────────────────
const viewHead = document.createElement('div');
viewHead.className = 'view-head';
viewHead.id = 'viewHead';
viewHead.style.display = 'none';
uiLayer.appendChild(viewHead);

// ─────────────────────────────────────────────────────────────────────────────
// 9. Grid container
// ─────────────────────────────────────────────────────────────────────────────
const grid = document.createElement('div');
grid.className = 'grid';
grid.id = 'appGrid';
uiLayer.appendChild(grid);

// ─────────────────────────────────────────────────────────────────────────────
// 10. App list (UNCHANGED — same names, urls, icons)
// ─────────────────────────────────────────────────────────────────────────────
const apps = [
  { name: 'NZ:P', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/test.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNIW09jfdkiAfWAQ81HXZaDwktgfgywV4p5w&s' },
  { name: 'Serious Sam', url: 'https://cdn.jsdelivr.net/gh/prokid8467-collab/serious/local/index.html', icon: 'https://i.ebayimg.com/00/s/MTI1MFgxMjAw/z/KCwAAOSwYwJlINmB/$_57.JPG?set_id=880000500F' },
  { name: 'Drift Hunters', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drifthunters.html', icon: 'https://drifthunters3d.io/assets/upload/poki/webp/drift-hunters.webp' },
  { name: 'Eaglercraft', url: 'https://cdn.jsdelivr.net/gh/v10letfur/Eaglercraft-X-1.8.8/EaglercraftX_1.8_u53_Offline_Signed.html', icon: 'https://cdn2.steamgriddb.com/icon_thumb/349319c989f70ac97c3824689547bf5d.png' },
  { name: 'Drivemad', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drivemad.html', icon: 'https://cdn-1.webcatalog.io/catalog/poki-drive-mad/poki-drive-mad-icon-filled-256.png?v=1714778298617' },
  { name: 'Snowrider 3D', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/snowrider.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJy4pM2G_0ViLxs6g-mq68YS7RRUv_XUHg4w&s' },
  { name: 'Slope', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/slope.html', icon: 'https://slope-play.com/cache/data/image/game/slope-logo-1-f309x309.webp' },
  { name: 'Subway Surfers', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/subwaysurfers.html', icon: 'https://static.wikia.nocookie.net/subwaysurf/images/c/c3/ThirtySixthAvatar.jpg' },
  { name: 'Buckshot Roulette', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/buckshott.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW0pkA7JfrcIexKwRvSuX4EaJw4n2Gf4r2Sw&s' },
  { name: 'Binding Of Isaac', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/binding-of-isaac-v1.666.html', icon: 'https://img.tapimg.net/market/images/877d89aad26d46c1ae9934370fc6c22e.jpg' },
  { name: 'Ultra Kill', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/ultrakill.html', icon: 'https://cdn2.steamgriddb.com/icon_thumb/ba9353718aa3b1793b8a23d51e19ef15.png' },
  { name: 'Pizza Tower', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/pizzatower.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS27aoYD-jiZcXXqXMiJ-VtOCA2LvvFHUQu3g&s' },
  { name: 'R.E.P.O', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/repo2.html', icon: 'https://mir-s3-cdn-cf.behance.net/projects/404/cf0349247119641.Y3JvcCw4NjIsNjc1LDE2OCww.jpg' },
  { name: 'Gun Spin', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/gunspin.html', icon: 'https://sc.filehippo.net/images/t_app-icon-l/p/39d0a468-21ab-466d-a65b-5585c02dd7ad/15864794/gunspin-logo' },
  { name: 'Cookie Clicker', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/cookieclicker.html', icon: 'https://play-lh.googleusercontent.com/Z1MOuuiD05ZN5LkVmMEvKF0mqAc-FknaQ2j8s4dZiO-LSPQX4EEA3RVJdlQEtxe96ok' },
  { name: 'Tiny Fishing', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/tinyfishing.html', icon: 'https://lh3.googleusercontent.com/hca11Z4buNnAB96QUDvbm107tF0r5EHZXQ5IwTjjbim83MALr6YfxR6HGafEytvBEkeRPiBsnPhOduvQRdYBjOheOw=s128-rj-sc0x00ffffff' },
  { name: 'Paper io', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/paper/index.html', icon: 'https://i.pinimg.com/736x/33/48/8a/33488a03a8ec1fb8f79d4800e5d17dcf.jpg' },
  { name: 'Baldis-plus', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/baldi.html', icon: 'https://play-lh.googleusercontent.com/EPV1TB4So1lB0DGrdCVExDpNU8ML67nd8OqBeoOIM-s6sDicxmDdPvCXD6n7LKevFl0' },
  { name: 'Getting Over It', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/getting-over-it.html', icon: 'https://play-lh.googleusercontent.com/xEDOZ9oZZrHswGxUR3w55e4XL9nF2r9HQpmpBO2iGsX3EbCstxawIpZB-EykrCPl6c0' },
  { name: 'Dumb Ways To Die', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/dumb-ways-to-die.html', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_lS_HLx-8hMfveILM_CAmaWxgaOCwBKxb10vi55pPkCteU=s900-c-k-c0x00ffffff-no-rj' },
  { name: 'Super Hot', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/super-hott.html', icon: 'https://fontmeme.com/images/super-hot-game-font.jpg' },
  { name: 'Fruit Ninja', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/fruit-ninja.html', icon: 'https://play-lh.googleusercontent.com/eJ9OJnbRer1jjg5ZeNAnTXKcGd2B_NEqxCp2UsefcCABeFBaj_pNl_WKYBjup2GVGGc' },
  { name: 'Crossy Road', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/crossy-road.html', icon: 'https://upload.wikimedia.org/wikipedia/en/7/71/Crossy_Road_icon.jpeg' },
  { name: 'Geometry Dash', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/geometry-dash.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/785.png', status: 'unavailable', statusNote: 'Fixing the game rn' },
  { name: 'Doom 1', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/doom-1.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/203.png' },
  { name: 'Doom 2', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/doom-2.html', icon: 'https://www.designyourway.net/blog/wp-content/uploads/2024/11/Doom-Logo-featured.jpg' },
  { name: 'Dead Seat', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/dead-seat.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/458.png' },
  { name: 'Super Mario 64', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/sm64.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/588.png' },
  { name: 'Jetpack Joyride', url: 'https://cdn.jsdselivr.net/gh/UncopylockDomainHere/testing/games/jj.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/7.png' , status: 'unavailable', statusNote: 'Fixing the game rn' },
  { name: 'Crazy Cattle 3D', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/crazy-cattle-3d.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/164.png' },
  { name: 'Yume Nikki', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/nikki.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/433.png' },
  { name: 'CSGO', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/csgo.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6bznqalhYEF60S4VbKOscF0wg2LKJiiPJIngyn4QmRg&s=10', status: 'unavailable', statusNote: 'Not playable yet' },
  { name: 'Running Fred', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/rf.html', icon: 'https://tse4.mm.bing.net/th/id/OIP.IEzl0llHmJ4RVRJ_lHqmZAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'Half Life', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/half-life.html', icon: 'https://1000logos.net/wp-content/uploads/2020/09/Half-Life-logo.jpg' },
  { name: 'Five Nights At Epsteins', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/fnae.html', icon: 'https://tse2.mm.bing.net/th/id/OIP.4il-Ml86cEg2PnICKVKGsAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 11. Liked / Favorite storage (localStorage, keyed by game name)
// ─────────────────────────────────────────────────────────────────────────────
const LS_LIKED = 'classlink_liked';
const LS_FAV  = 'classlink_favorites';

function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
  catch (e) { return new Set(); }
}
function saveSet(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch (e) {}
}

let likedSet = loadSet(LS_LIKED);
let favSet   = loadSet(LS_FAV);

function isLiked(name){ return likedSet.has(name); }
function isFav(name){ return favSet.has(name); }

function toggleLike(name){
  if (likedSet.has(name)) likedSet.delete(name);
  else likedSet.add(name);
  saveSet(LS_LIKED, likedSet);
  refreshBadges();
}
function toggleFav(name){
  if (favSet.has(name)) favSet.delete(name);
  else favSet.add(name);
  saveSet(LS_FAV, favSet);
  refreshBadges();
}

function refreshBadges() {
  const bL = document.getElementById('badgeLiked');
  const bF = document.getElementById('badgeFav');
  const bG = document.getElementById('badgeGames');
  if (bL) bL.textContent = likedSet.size;
  if (bF) bF.textContent = favSet.size;
  if (bG) bG.textContent = apps.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. View / page system (games | liked | favorite)
// ─────────────────────────────────────────────────────────────────────────────
let currentView = 'games';
let renderToken = 0;

function setView(view) {
  currentView = view;
  // hide the chat view whenever a normal view is shown
  if (chatView.classList.contains('open')) {
    chatView.classList.remove('open');
    cvFrame.src = '';
    cvLoading.style.display = 'flex';
  }
  grid.style.display = '';
  // update active state on side menu buttons
  document.querySelectorAll('.side-menu .sm-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  // search bar only relevant on games page (keep available though)
  if (view === 'games') {
    searchWrap.style.display = '';
    viewHead.style.display = 'none';
    renderApps(apps.filter(a => a.name.toLowerCase().includes(searchBar.value.toLowerCase())));
  } else {
    searchWrap.style.display = 'none';
    searchBar.value = '';
    renderViewPage(view);
  }
  // close the side menu after navigating
  closeSideMenu();
  // scroll to top of new view
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderViewPage(view) {
  const set = view === 'liked' ? likedSet : favSet;
  const title = view === 'liked' ? 'Liked Games' : 'Favorite Games';
  const icon  = view === 'liked' ? '♥' : '★';
  const color = view === 'liked' ? 'var(--magenta)' : 'var(--gold)';

  viewHead.innerHTML = `
    <div class="vh-title">${icon} ${title}</div>
    <div class="vh-sub">${set.size} game${set.size === 1 ? '' : 's'} // right-click a logo on the main grid to manage</div>
    <div class="back-btn" id="backBtn">▦ Games</div>
  `;
  viewHead.style.display = '';
  document.getElementById('backBtn').onclick = () => setView('games');

  const list = apps.filter(a => set.has(a.name));
  renderApps(list);
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. Render tiles (with stagger animation + glow + like/fav badges)
// ─────────────────────────────────────────────────────────────────────────────
const grid2 = document.getElementById('appGrid');

function renderApps(filteredApps) {
  const myToken = ++renderToken;
  grid2.innerHTML = '';

  if (filteredApps.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    const inView = currentView !== 'games';
    empty.innerHTML = inView
      ? `<span class="big">▢</span><span>// EMPTY</span> — no games here yet`
      : `<span>// NO_MATCH</span> — nothing in the grid…`;
    grid2.appendChild(empty);
    updateCount(0);
    return;
  }

  filteredApps.forEach((app, i) => {
    const container = document.createElement('div');
    container.className = 'app-container';
    // staggered entrance
    container.style.animationDelay = `${Math.min(i * 28, 700)}ms`;

    const btn = document.createElement('button');
    btn.className = 'app-btn';
    btn.title = `launch ${app.name}`;
    btn.setAttribute('aria-label', app.name);
    btn.dataset.name = app.name;

    // availability flag (default available)
    const unavailable = app.status === 'unavailable';
    if (unavailable) {
      btn.classList.add('unavailable');
      btn.title = `${app.name} — ${app.statusNote || 'Not playable yet'}`;
      btn.setAttribute('aria-disabled', 'true');
    }

    const sheen = document.createElement('div');
    sheen.className = 'sheen';
    btn.appendChild(sheen);

    // unavailable overlay on the logo: dark wash + center lock + corner ribbon
    if (unavailable) {
      const wash = document.createElement('div');
      wash.className = 'unavail-wash';
      btn.appendChild(wash);

      const uIcon = document.createElement('div');
      uIcon.className = 'unavail-icon';
      uIcon.innerHTML = '\u{1F512}'; // padlock
      uIcon.title = app.statusNote || 'Not playable yet';
      btn.appendChild(uIcon);

      const ribbon = document.createElement('div');
      ribbon.className = 'unavail-ribbon';
      ribbon.textContent = (app.statusNote || 'Not playable yet').toUpperCase();
      btn.appendChild(ribbon);
    }

    // like badge (top-right)
    const likeBadge = document.createElement('div');
    likeBadge.className = 'tile-badge liked';
    likeBadge.innerHTML = '♥';
    if (isLiked(app.name)) likeBadge.classList.add('show');
    btn.appendChild(likeBadge);

    // favorite badge (below like badge)
    const favBadge = document.createElement('div');
    favBadge.className = 'tile-badge favorited';
    favBadge.innerHTML = '★';
    favBadge.style.top = (isLiked(app.name) ? '40px' : '8px');
    if (isFav(app.name)) favBadge.classList.add('show');
    btn.appendChild(favBadge);

    const img = document.createElement('img');
    img.src = app.icon;
    img.loading = 'lazy';
    img.alt = app.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '18px';
    img.style.pointerEvents = 'none';
    // fallback if icon fails
    img.onerror = () => {
      img.style.display = 'none';
      btn.style.background = 'linear-gradient(145deg,#0a0f1c,#16203a)';
      btn.innerHTML += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Orbitron;font-weight:700;color:#00f0ff;text-shadow:0 0 12px #00f0ff;font-size:18px;z-index:4;letter-spacing:.1em">${app.name.slice(0,10)}</div>`;
    };
    btn.appendChild(img);

    // right-click → context menu near the mouse
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      openCtxMenu(e.clientX, e.clientY, app);
    });

    // also support long-press (touch) for mobile-ish
    let pressTimer = null;
    btn.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      pressTimer = setTimeout(() => {
        openCtxMenu(t.clientX, t.clientY, app);
      }, 550);
    }, { passive: true });
    btn.addEventListener('touchend', () => clearTimeout(pressTimer));
    btn.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });

    // launch — unavailable games are blocked; show a notice instead
    btn.onclick = async () => {
      if (app.status === 'unavailable') {
        showUnavailableNotice(app);
        return;
      }
      const newWin = window.open('about:blank', '_blank');
      if (!newWin) return;
      newWin.document.write(`
        <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
          html,body{margin:0;height:100%;background:#05070d;color:#00f0ff;font-family:'JetBrains Mono',monospace;display:flex;justify-content:center;align-items:center;overflow:hidden}
          .w{display:flex;flex-direction:column;align-items:center;gap:14px}
          .sp{width:46px;height:46px;border:3px solid rgba(0,240,255,.2);border-top-color:#00f0ff;border-radius:50%;animation:r 1s linear infinite;box-shadow:0 0 18px rgba(0,240,255,.5)}
          .t{letter-spacing:.2em;text-transform:uppercase;font-size:12px;text-shadow:0 0 10px rgba(0,240,255,.6)}
          @keyframes r{to{transform:rotate(360deg)}}
        </style></head><body><div class="w"><div class="sp"></div><div class="t">Launching ${app.name}</div></div></body></html>
      `);
      newWin.document.close();

      try {
        const res = await fetch(app.url);
        const html = await res.text();
        newWin.document.open();
        newWin.document.write(html);
        newWin.document.close();
      } catch (err) {
        newWin.document.body.innerHTML =
          '<div style="color:#ff2bd6;font-family:monospace;text-align:center"><h2>// CONNECTION_FAILED</h2><p style="color:#5b7a9e">couldn\'t reach the node.</p></div>';
      }
    };

    const label = document.createElement('div');
    label.className = 'label';
    label.innerText = app.name;

    container.appendChild(btn);
    container.appendChild(label);

    if (app.status === 'unavailable') {
      const note = document.createElement('div');
      note.className = 'status-note';
      note.innerText = app.statusNote || 'Not playable yet';
      container.appendChild(note);
    }

    const rcHint = document.createElement('div');
    rcHint.className = 'rc-hint';
    rcHint.innerText = 'right-click to manage';
    container.appendChild(rcHint);

    grid2.appendChild(container);
  });

  if (myToken === renderToken) updateCount(filteredApps.length);
}

function updateCount(n) {
  if (currentView === 'games') {
    searchCount.textContent = `${n} / ${apps.length} NODES`;
  } else {
    searchCount.textContent = '';
  }
  const nc = document.getElementById('nodeCount');
  if (nc) nc.textContent = apps.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// showUnavailableNotice — small cyber toast that tells the user the game
// isn't ready yet, so the launch button isn't a dead, silent click.
function showUnavailableNotice(app) {
  // remove any existing toast
  const old = document.getElementById('unavailToast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.id = 'unavailToast';
  toast.innerHTML = `
    <div class="ut-lock">\u{1F512}</div>
    <div class="ut-body">
      <div class="ut-title">${app.name.toUpperCase()}</div>
      <div class="ut-sub">${app.statusNote || 'Not playable yet'} // check back later</div>
    </div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(showUnavailableNotice._t);
  showUnavailableNotice._t = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ─────────────────────────────────────────────────────────────────────────────
let ctxApp = null;

function openCtxMenu(x, y, app) {
  ctxApp = app;
  document.getElementById('ctxHead').textContent = app.name;

  // update labels / active state
  const likeItem = ctxMenu.querySelector('.ctx-item[data-act="like"]');
  const favItem  = ctxMenu.querySelector('.ctx-item[data-act="favorite"]');
  const likeLabel = document.getElementById('ctxLikeLabel');
  const favLabel  = document.getElementById('ctxFavLabel');

  const liked = isLiked(app.name);
  const faved = isFav(app.name);
  likeItem.classList.toggle('on', liked);
  favItem.classList.toggle('on', faved);
  likeLabel.textContent = liked ? 'Unlike game' : 'Like game';
  favLabel.textContent  = faved ? 'Unfavorite game' : 'Favorite game';

  // position (keep on-screen)
  ctxMenu.style.left = '0px';
  ctxMenu.style.top = '0px';
  ctxMenu.classList.add('show');

  // measure then reposition
  requestAnimationFrame(() => {
    const rect = ctxMenu.getBoundingClientRect();
    let px = x, py = y;
    if (px + rect.width > window.innerWidth - 8)  px = window.innerWidth - rect.width - 8;
    if (py + rect.height > window.innerHeight - 8) py = window.innerHeight - rect.height - 8;
    if (px < 8) px = 8;
    if (py < 8) py = 8;
    ctxMenu.style.left = px + 'px';
    ctxMenu.style.top  = py + 'px';
  });
}

function closeCtxMenu() {
  ctxMenu.classList.remove('show');
  ctxApp = null;
}

// context menu item clicks
ctxMenu.addEventListener('click', (e) => {
  const item = e.target.closest('.ctx-item');
  if (!item || !ctxApp) return;
  const act = item.dataset.act;
  const app = ctxApp;
  if (act === 'games') {
    setView('games');
  } else if (act === 'like') {
    toggleLike(app.name);
    // re-render current view so badges update
    rerenderCurrent();
  } else if (act === 'favorite') {
    toggleFav(app.name);
    rerenderCurrent();
  }
  closeCtxMenu();
});

function rerenderCurrent() {
  if (currentView === 'games') {
    renderApps(apps.filter(a => a.name.toLowerCase().includes(searchBar.value.toLowerCase())));
  } else {
    renderViewPage(currentView);
  }
}

// close context menu on outside click / scroll / escape / new right-click
document.addEventListener('click', (e) => {
  if (!ctxMenu.contains(e.target)) closeCtxMenu();
});
document.addEventListener('contextmenu', (e) => {
  // if right-clicking outside any app tile, just close the menu (allow native)
  if (!e.target.closest('.app-btn')) closeCtxMenu();
});
window.addEventListener('scroll', closeCtxMenu, true);
window.addEventListener('blur', closeCtxMenu);

// ─────────────────────────────────────────────────────────────────────────────
// 15. Side menu open / close logic
// ─────────────────────────────────────────────────────────────────────────────
function openSideMenu() {
  sideMenu.classList.add('open');
  smOverlay.classList.add('show');
  hamburger.classList.add('active');
  refreshBadges();
}
function closeSideMenu() {
  sideMenu.classList.remove('open');
  smOverlay.classList.remove('show');
  hamburger.classList.remove('active');
}
function toggleSideMenu() {
  if (sideMenu.classList.contains('open')) closeSideMenu();
  else openSideMenu();
}

hamburger.addEventListener('click', toggleSideMenu);
document.getElementById('smClose').addEventListener('click', closeSideMenu);
smOverlay.addEventListener('click', closeSideMenu);

// side menu button clicks → navigate to views
document.querySelectorAll('.side-menu .sm-btn').forEach(b => {
  b.addEventListener('click', () => {
    if (b.dataset.view === 'chat') { openChatView(); return; }
    setView(b.dataset.view);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 16. Search filtering (unchanged logic, smoother)
// ─────────────────────────────────────────────────────────────────────────────
let searchDebounce;
searchBar.addEventListener('input', function () {
  if (currentView !== 'games') setView('games');
  clearTimeout(searchDebounce);
  const q = this.value.toLowerCase();
  searchDebounce = setTimeout(() => {
    const filtered = apps.filter((app) => app.name.toLowerCase().includes(q));
    renderApps(filtered);
  }, 90);
});

// hotkeys: slash focuses search, escape clears / closes menus
addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchBar) {
    e.preventDefault();
    searchBar.focus();
  }
  if (e.key === 'Escape') {
    if (ctxMenu.classList.contains('show')) { closeCtxMenu(); return; }
    if (chatView.classList.contains('open')) { closeChatView(); return; }
    if (sideMenu.classList.contains('open')) { closeSideMenu(); return; }
    if (logPanel.classList.contains('open')) { closeLogPanel(); return; }
    if (currentView !== 'games') { setView('games'); return; }
    searchBar.value = '';
    renderApps(apps);
    searchBar.blur();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 17. Initial render
// ─────────────────────────────────────────────────────────────────────────────
refreshBadges();
renderApps(apps);
