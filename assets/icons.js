// Inline SVG icon set — no external icon fonts/CDNs (offline-friendly).
// Each function returns an SVG string. Stroke-based, 24x24 viewBox, currentColor.
(function () {
  function svg(paths, opts) {
    opts = opts || {};
    const size = opts.size || 18;
    const sw = opts.sw || 1.8;
    return (
      `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" ` +
      `stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`
    );
  }

  const ICONS = {
    search: (o) => svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', o),
    chevronRight: (o) => svg('<path d="m9 18 6-6-6-6"/>', o),
    chevronLeft: (o) => svg('<path d="m15 18-6-6 6-6"/>', o),
    arrowRight: (o) => svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', o),
    close: (o) => svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', o),
    present: (o) => svg('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>', o),
    expand: (o) => svg('<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>', o),
    windowMin: (o) => svg('<path d="M5 12h14"/>', o),
    windowMax: (o) => svg('<rect x="5" y="5" width="14" height="14" rx="1"/>', o),
    list: (o) => svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', o),
    target: (o) => svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', o),
    users: (o) => svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>', o),
    trending: (o) => svg('<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>', o),
    layers: (o) => svg('<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>', o),
    play: (o) => svg('<polygon points="6 3 20 12 6 21 6 3"/>', o),
    question: (o) => svg('<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>', o),
    shield: (o) => svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>', o),
    flag: (o) => svg('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z"/><path d="M4 22v-7"/>', o),
    alert: (o) => svg('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>', o),
    check: (o) => svg('<path d="M20 6 9 17l-5-5"/>', o),
    checkCircle: (o) => svg('<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>', o),
    bulb: (o) => svg('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/>', o),
    chat: (o) => svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>', o),
    chart: (o) => svg('<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>', o),
    grid: (o) => svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', o),
    server: (o) => svg('<rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 6.5h.01M6 17.5h.01"/>', o),
    database: (o) => svg('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>', o),
    cloud: (o) => svg('<path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6 19Z"/>', o),
    lock: (o) => svg('<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', o),
    external: (o) => svg('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>', o),
    book: (o) => svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>', o),
    filter: (o) => svg('<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z"/>', o),
    home: (o) => svg('<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 21v-7h6v7"/>', o),
    spark: (o) => svg('<path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19"/><circle cx="12" cy="12" r="3"/>', o),
    clock: (o) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', o),
    doc: (o) => svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>', o),
    route: (o) => svg('<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6a3 3 0 0 0 3-3V8M6 16V9a3 3 0 0 1 3-3h6"/>', o),
    factory: (o) => svg('<path d="M2 20h20M4 20V9l5 4V9l5 4V9l5 4v7"/><path d="M8 20v-4M14 20v-4"/>', o),
    gauge: (o) => svg('<path d="M12 14 8 9"/><path d="M3 13a9 9 0 1 1 18 0"/><circle cx="12" cy="14" r="1.5"/>', o),
    pill: (o) => svg('<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(45 12 12)"/><path d="M8.5 8.5 15.5 15.5"/>', o),
    microscope: (o) => svg('<path d="M6 18h8M3 22h18M14 22a7 7 0 0 0 0-14M9 14a4 4 0 0 0 4-4 4 4 0 0 0-4-4l-1 1 5 5 1-1"/>', o),
    heart: (o) => svg('<path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z"/>', o),
    sun: (o) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', o),
    moon: (o) => svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>', o),
    bolt: (o) => svg('<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>', o),
  };

  window.ICONS = ICONS;
  window.icon = function (name, opts) {
    return (ICONS[name] || ICONS.spark)(opts);
  };
})();
