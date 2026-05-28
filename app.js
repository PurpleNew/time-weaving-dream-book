const STORAGE_KEYS = {
  users: "jidian_users",
  session: "jidian_session",
  dashboard: "jidian_dashboard_data",
  authTheme: "jidian_auth_theme",
  xuniTopbarCollapsed: "jidian_xuni_topbar_collapsed",
  companionPos: "jidian_companion_position",
  clockTaskPanelPos: "jidian_clock_task_panel_position",
  ambientAudio: "jidian_ambient_audio"
};

const INTRO_DURATION = 4200;
const THEME_TRANSITION_DURATION = 1800;
const PLANNER_API_ENDPOINT = "/api/planner";
const MAX_PLANNER_ATTACHMENTS = 4;
const MAX_ATTACHMENT_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TEXT_ATTACHMENT_CHARS = 12000;
const AMBIENT_SOUND_OPTIONS = [
  {
    id: "rain",
    name: "雨声",
    url: "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/af/Rain_%281%29.ogg/Rain_%281%29.ogg.mp3",
    source: "Wikimedia Commons",
    credit: "Public domain"
  },
  {
    id: "wind",
    name: "风声",
    url: "https://upload.wikimedia.org/wikipedia/commons/transcoded/e/eb/Howling_wind.ogg/Howling_wind.ogg.mp3",
    source: "Wikimedia Commons",
    credit: "CC0 1.0"
  },
  {
    id: "chimes",
    name: "风铃",
    url: "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/68/Windglockenspiel.Koshi.ogg/Windglockenspiel.Koshi.ogg.mp3",
    source: "Wikimedia Commons",
    credit: "CC0 1.0"
  }
];
const LEGACY_THEME_OPTIONS = [
  {
    id: "cloudbook",
    name: "云岚织页",
    description: "偏奶白与晨光的书页感，整体温柔、轻盈，像翻开一本会发亮的织梦簿。",
    introFrames: ["转场动画1.jpg", "转场动画2.jpg", "转场动画3.jpg"],
    images: {
      bodyBefore: "背景2.jpg",
      bodyAfter: "背景1.jpg",
      viewGlow: "背景3.jpg",
      plannerGlow: "背景1.jpg",
      authHero: "背景2.jpg",
      topbar: "背景2.jpg"
    },
    vars: {
      "--sky": "#dff0ff",
      "--sky-deep": "#9ec8ff",
      "--night": "#25356f",
      "--night-deep": "#161f4a",
      "--ink": "#32456f",
      "--ink-soft": "rgba(50, 69, 111, 0.72)",
      "--ink-muted": "rgba(50, 69, 111, 0.56)",
      "--gold": "#ffd86e",
      "--pink": "#ffb6df",
      "--violet": "#a8a0ff",
      "--display-font": "\"STSong\", \"SimSun\", serif",
      "--body-font": "\"Microsoft YaHei\", \"PingFang SC\", \"Segoe UI\", sans-serif",
      "--task-card-tint": "linear-gradient(135deg, rgba(255, 255, 255, 0.74), rgba(255, 243, 214, 0.78))"
    }
  },
  {
    id: "doraemon",
    name: "哆啦A梦",
    description: "主色切到蓝白红，背景更像晴空与冒险感，整体会更轻快、更有童年想象力。",
    introFrames: [
      "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg"
    ],
    images: {
      bodyBefore: "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      bodyAfter: "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      viewGlow: "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      plannerGlow: "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      authHero: "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg",
      topbar: "https://images.wallpapers.com/images/hd/dreamy-doraemon-4k-tlc6e2hvutqq7j4h.jpg"
    },
    vars: {
      "--sky": "#e0f4ff",
      "--sky-deep": "#80c9ff",
      "--night": "#1f5b9f",
      "--night-deep": "#103c73",
      "--ink": "#23507f",
      "--ink-soft": "rgba(35, 80, 127, 0.74)",
      "--ink-muted": "rgba(35, 80, 127, 0.58)",
      "--gold": "#ffd86c",
      "--pink": "#ffb8c6",
      "--violet": "#93b8ff",
      "--display-font": "\"STKaiti\", \"KaiTi\", serif",
      "--body-font": "\"Microsoft YaHei\", \"PingFang SC\", \"Segoe UI\", sans-serif",
      "--task-card-tint": "linear-gradient(135deg, rgba(245, 253, 255, 0.92), rgba(218, 239, 255, 0.84))",
      "--clock-face-bg": "rgba(244, 251, 255, 0.92)",
      "--clock-face-border": "rgba(196, 228, 255, 0.82)"
    }
  },
  {
    id: "pikachu",
    name: "皮卡丘",
    description: "切成明亮黄与电光蓝，卡片和标题会更活泼，适合想让页面更有元气的时候。",
    introFrames: [
      "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg"
    ],
    images: {
      bodyBefore: "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      bodyAfter: "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      viewGlow: "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      plannerGlow: "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      authHero: "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg",
      topbar: "https://images.wallpapers.com/images/hd/pikachu-pokemon-4k-ccyz36l7m34fq1w7.jpg"
    },
    vars: {
      "--sky": "#fff7b8",
      "--sky-deep": "#ffd94c",
      "--night": "#5f4f18",
      "--night-deep": "#382d09",
      "--ink": "#634f15",
      "--ink-soft": "rgba(99, 79, 21, 0.74)",
      "--ink-muted": "rgba(99, 79, 21, 0.58)",
      "--gold": "#ffcf38",
      "--pink": "#ffb8a8",
      "--violet": "#8ec7ff",
      "--display-font": "\"STKaiti\", \"KaiTi\", serif",
      "--body-font": "\"Microsoft YaHei\", \"PingFang SC\", \"Segoe UI\", sans-serif",
      "--task-card-tint": "linear-gradient(135deg, rgba(255, 250, 220, 0.94), rgba(255, 233, 148, 0.86))",
      "--clock-face-bg": "rgba(255, 252, 224, 0.94)",
      "--clock-face-border": "rgba(255, 226, 124, 0.84)"
    }
  }
];

function buildThemeVars({
  sky,
  skyDeep,
  night,
  nightDeep,
  ink,
  inkSoft,
  inkMuted,
  gold,
  pink,
  violet,
  taskTint,
  clockFaceBg,
  clockFaceBorder,
  titleStart,
  titleAccent,
  titleCore,
  titleSoft,
  titleEnd,
  heroEyebrow,
  heroKicker,
  heroCopy,
  heroQuote,
  topbarMeta,
  displayFont = "\"STKaiti\", \"KaiTi\", serif",
  bodyFont = "\"Microsoft YaHei\", \"PingFang SC\", \"Segoe UI\", sans-serif"
}) {
  return {
    "--sky": sky,
    "--sky-deep": skyDeep,
    "--night": night,
    "--night-deep": nightDeep,
    "--ink": ink,
    "--ink-soft": inkSoft,
    "--ink-muted": inkMuted,
    "--gold": gold,
    "--pink": pink,
    "--violet": violet,
    "--display-font": displayFont,
    "--body-font": bodyFont,
    "--task-card-tint": taskTint,
    "--clock-face-bg": clockFaceBg,
    "--clock-face-border": clockFaceBorder,
    "--title-shine-start": titleStart,
    "--title-shine-accent": titleAccent,
    "--title-shine-core": titleCore,
    "--title-shine-soft": titleSoft,
    "--title-shine-end": titleEnd,
    "--hero-eyebrow-color": heroEyebrow,
    "--hero-kicker-color": heroKicker,
    "--hero-copy-color": heroCopy,
    "--hero-quote-color": heroQuote,
    "--topbar-meta-color": topbarMeta
  };
}

function createThemeOption({ id, name, description, introFrames, previewImages, images, palette, imagePositions }) {
  return {
    id,
    name,
    description,
    introFrames,
    previewImages: previewImages || introFrames,
    images,
    imagePositions: {
      authHero: imagePositions?.authHero || "center center",
      topbar: imagePositions?.topbar || "center center"
    },
    layerOpacity: {
      bodyBefore: imagePositions?.bodyBeforeOpacity || 0.72,
      bodyAfter: imagePositions?.bodyAfterOpacity || 0.34
    },
    stripImages: {
      first: imagePositions?.stripFirst || images.topbar,
      second: imagePositions?.stripSecond || images.topbar,
      third: imagePositions?.stripThird || images.topbar
    },
    vars: buildThemeVars(palette)
  };
}

const THEME_OPTIONS = [
  createThemeOption({
    id: "stardream",
    name: "星梦织语",
    description: "银河、流光和淡紫裙摆的主色，整体偏梦幻柔光，适合做默认主视觉。",
    introFrames: [
      "星梦织语/48c463f7e5845aec66842dc04e0f51a8.jpg",
      "星梦织语/a18dcf811a84bcd33cc60bf1ce3e4842.jpg",
      "星梦织语/aec24cd34b5d374c520bc00d58a9af22.jpg"
    ],
    images: {
      bodyBefore: "星梦织语/a18dcf811a84bcd33cc60bf1ce3e4842.jpg",
      bodyAfter: "星梦织语/aec24cd34b5d374c520bc00d58a9af22.jpg",
      viewGlow: "星梦织语/48c463f7e5845aec66842dc04e0f51a8.jpg",
      plannerGlow: "星梦织语/a18dcf811a84bcd33cc60bf1ce3e4842.jpg",
      authHero: "星梦织语/48c463f7e5845aec66842dc04e0f51a8.jpg",
      topbar: "星梦织语/aec24cd34b5d374c520bc00d58a9af22.jpg"
    },
    palette: {
      sky: "#eef1ff",
      skyDeep: "#a3b1ff",
      night: "#28316f",
      nightDeep: "#171d4a",
      ink: "#39457f",
      inkSoft: "rgba(57, 69, 127, 0.74)",
      inkMuted: "rgba(57, 69, 127, 0.58)",
      gold: "#ffe6a1",
      pink: "#f3b5ff",
      violet: "#a3a8ff",
      taskTint: "linear-gradient(135deg, rgba(255, 251, 255, 0.92), rgba(236, 229, 255, 0.84))",
      clockFaceBg: "rgba(248, 245, 255, 0.92)",
      clockFaceBorder: "rgba(220, 212, 255, 0.84)",
      titleStart: "#fffefa",
      titleAccent: "#ffd4fb",
      titleCore: "#ffffff",
      titleSoft: "#e4deff",
      titleEnd: "#ffe8c2",
      heroEyebrow: "#fff2b3",
      heroKicker: "#fff3ff",
      heroCopy: "rgba(255, 255, 255, 0.98)",
      heroQuote: "#fff4c5",
      topbarMeta: "rgba(255, 249, 240, 0.94)"
    }
  }),
  createThemeOption({
    id: "aurora",
    name: "极光雪境",
    description: "把极光、雪山和日落湖面接成一套冷暖交错的天空主题，视觉更通透。",
    introFrames: [
      "特邀王凌睿老年干部设计/2ec58e326c03e0ab621aec594569c15d.jpg",
      "特邀王凌睿老年干部设计/42ab222418df628ac999b182a3d0a9d1.jpg",
      "特邀王凌睿老年干部设计/dea7be4edfabc5e24d3bfe897930c8e6.jpg"
    ],
    images: {
      bodyBefore: "特邀王凌睿老年干部设计/2ec58e326c03e0ab621aec594569c15d.jpg",
      bodyAfter: "特邀王凌睿老年干部设计/42ab222418df628ac999b182a3d0a9d1.jpg",
      viewGlow: "特邀王凌睿老年干部设计/dea7be4edfabc5e24d3bfe897930c8e6.jpg",
      plannerGlow: "特邀王凌睿老年干部设计/42ab222418df628ac999b182a3d0a9d1.jpg",
      authHero: "特邀王凌睿老年干部设计/2ec58e326c03e0ab621aec594569c15d.jpg",
      topbar: "特邀王凌睿老年干部设计/dea7be4edfabc5e24d3bfe897930c8e6.jpg"
    },
    palette: {
      sky: "#ddfbff",
      skyDeep: "#88e3d5",
      night: "#1c4674",
      nightDeep: "#0a2844",
      ink: "#23537f",
      inkSoft: "rgba(35, 83, 127, 0.74)",
      inkMuted: "rgba(35, 83, 127, 0.58)",
      gold: "#fff0aa",
      pink: "#ffbfcb",
      violet: "#85d8ff",
      taskTint: "linear-gradient(135deg, rgba(246, 255, 255, 0.94), rgba(215, 245, 243, 0.86))",
      clockFaceBg: "rgba(242, 253, 255, 0.94)",
      clockFaceBorder: "rgba(191, 233, 233, 0.84)",
      titleStart: "#f9fffb",
      titleAccent: "#b8fff0",
      titleCore: "#ffffff",
      titleSoft: "#d7f3ff",
      titleEnd: "#ffe8b8",
      heroEyebrow: "#fff5b5",
      heroKicker: "#effcff",
      heroCopy: "rgba(242, 253, 255, 0.98)",
      heroQuote: "#fff0bc",
      topbarMeta: "rgba(244, 252, 255, 0.94)"
    }
  }),
  createThemeOption({
    id: "bikini-cloud",
    name: "比奇堡云海",
    description: "保留海绵宝宝和派大星的轻松感，但把整体做成夜空云海而不是幼态卡通页。",
    introFrames: [
      "比奇堡云海/0e2772bfe9d122771c2681ed5fd21cbc.jpg",
      "比奇堡云海/af4f9427226f5d38fe6ad658a500dd44.jpg",
      "比奇堡云海/f6d3f7f9f333bf03aedeae7c7b8c7667.jpg"
    ],
    images: {
      bodyBefore: "比奇堡云海/af4f9427226f5d38fe6ad658a500dd44.jpg",
      bodyAfter: "比奇堡云海/f6d3f7f9f333bf03aedeae7c7b8c7667.jpg",
      viewGlow: "比奇堡云海/0e2772bfe9d122771c2681ed5fd21cbc.jpg",
      plannerGlow: "比奇堡云海/f6d3f7f9f333bf03aedeae7c7b8c7667.jpg",
      authHero: "比奇堡云海/0e2772bfe9d122771c2681ed5fd21cbc.jpg",
      topbar: "比奇堡云海/微信图片_20260522121519_598_29.jpg"
    },
    imagePositions: {
      stripFirst: "比奇堡云海/微信图片_20260522121519_598_29.jpg",
      stripSecond: "比奇堡云海/微信图片_20260522121519_598_29.jpg",
      stripThird: "比奇堡云海/微信图片_20260522121519_598_29.jpg"
    },
    palette: {
      sky: "#e5f4ff",
      skyDeep: "#8bc3ff",
      night: "#244c89",
      nightDeep: "#12315d",
      ink: "#2c598f",
      inkSoft: "rgba(44, 89, 143, 0.74)",
      inkMuted: "rgba(44, 89, 143, 0.58)",
      gold: "#ffe47e",
      pink: "#ffc4cf",
      violet: "#98b8ff",
      taskTint: "linear-gradient(135deg, rgba(248, 252, 255, 0.94), rgba(223, 236, 255, 0.86))",
      clockFaceBg: "rgba(245, 251, 255, 0.94)",
      clockFaceBorder: "rgba(201, 221, 255, 0.84)",
      titleStart: "#fffef8",
      titleAccent: "#ffe6af",
      titleCore: "#ffffff",
      titleSoft: "#d8e5ff",
      titleEnd: "#ffcce4",
      heroEyebrow: "#fff3a7",
      heroKicker: "#fff8e7",
      heroCopy: "rgba(250, 253, 255, 0.98)",
      heroQuote: "#fff0bb",
      topbarMeta: "rgba(250, 252, 255, 0.94)"
    }
  }),
  createThemeOption({
    id: "moon-cloud",
    name: "漫月云絮",
    description: "偏粉蓝的云层、月亮和童话建筑，适合想把整页气质拉得更软一点的时候。",
    introFrames: [
      "漫月云絮/0bcbfbb082d6fd771ce0f36dac516ecb.jpg",
      "漫月云絮/52ac7f57256bdf58d7ab58c9e9b391d3.jpg",
      "漫月云絮/ce974a0803b65ae42d76078b6520bb60.jpg"
    ],
    images: {
      bodyBefore: "漫月云絮/0bcbfbb082d6fd771ce0f36dac516ecb.jpg",
      bodyAfter: "漫月云絮/52ac7f57256bdf58d7ab58c9e9b391d3.jpg",
      viewGlow: "漫月云絮/ce974a0803b65ae42d76078b6520bb60.jpg",
      plannerGlow: "漫月云絮/52ac7f57256bdf58d7ab58c9e9b391d3.jpg",
      authHero: "漫月云絮/ce974a0803b65ae42d76078b6520bb60.jpg",
      topbar: "漫月云絮/0bcbfbb082d6fd771ce0f36dac516ecb.jpg"
    },
    palette: {
      sky: "#f5eeff",
      skyDeep: "#c2b4ff",
      night: "#5c5aa8",
      nightDeep: "#383876",
      ink: "#6a67af",
      inkSoft: "rgba(106, 103, 175, 0.74)",
      inkMuted: "rgba(106, 103, 175, 0.58)",
      gold: "#ffe59d",
      pink: "#ffcaec",
      violet: "#b7b2ff",
      taskTint: "linear-gradient(135deg, rgba(255, 248, 254, 0.95), rgba(239, 234, 255, 0.88))",
      clockFaceBg: "rgba(253, 248, 255, 0.95)",
      clockFaceBorder: "rgba(232, 221, 255, 0.84)",
      titleStart: "#fffef8",
      titleAccent: "#ffd4f3",
      titleCore: "#fffdfd",
      titleSoft: "#ece4ff",
      titleEnd: "#fff0c2",
      heroEyebrow: "#fff2bb",
      heroKicker: "#fff2fb",
      heroCopy: "rgba(255, 252, 255, 0.98)",
      heroQuote: "#fff4cb",
      topbarMeta: "rgba(255, 249, 255, 0.94)"
    }
  }),
  createThemeOption({
    id: "xuni-yusheng",
    name: "栩你渝生",
    description: "把晚霞海面、舞台星光和奶油粉蓝小像拼成一套偏恋爱感的主题，整体更柔、更甜，也更像一张珍藏壁纸。",
    introFrames: [
      "栩你渝生/微信图片_20260522080658_582_29.jpg",
      "栩你渝生/微信图片_20260522080659_583_29.jpg",
      "栩你渝生/微信图片_20260522080700_584_30.jpg"
    ],
    previewImages: [
      "栩你渝生/微信图片_20260522080658_582_29.jpg",
      "栩你渝生/微信图片_20260522080659_583_29.jpg",
      "栩你渝生/微信图片_20260522080700_584_30.jpg"
    ],
    images: {
      bodyBefore: "栩你渝生/xuni-login-bg-deepened.png",
      bodyAfter: "栩你渝生/xuni-login-bg-deepened.png",
      viewGlow: "栩你渝生/xuni-login-bg-deepened.png",
      plannerGlow: "栩你渝生/xuni-login-bg-deepened.png",
      authHero: "栩你渝生/微信图片_20260522080658_582_29.jpg",
      topbar: "栩你渝生/xuni-login-bg-deepened.png"
    },
    imagePositions: {
      authHero: "50% 55%",
      topbar: "50% 16%",
      bodyBeforeOpacity: 0.94,
      bodyAfterOpacity: 0.1,
      stripFirst: "栩你渝生/微信图片_20260522080658_582_29.jpg",
      stripSecond: "栩你渝生/微信图片_20260522080659_583_29.jpg",
      stripThird: "栩你渝生/微信图片_20260522080700_584_30.jpg"
    },
    palette: {
      sky: "#f9fbff",
      skyDeep: "#8fd1ff",
      night: "#27589b",
      nightDeep: "#15396f",
      ink: "#35639f",
      inkSoft: "rgba(53, 99, 159, 0.76)",
      inkMuted: "rgba(53, 99, 159, 0.58)",
      gold: "#ffe46f",
      pink: "#ffe8a8",
      violet: "#9dcbff",
      taskTint: "linear-gradient(135deg, rgba(255, 253, 214, 0.96), rgba(246, 251, 255, 0.9), rgba(213, 236, 255, 0.92))",
      clockFaceBg: "rgba(251, 252, 255, 0.95)",
      clockFaceBorder: "rgba(206, 228, 255, 0.86)",
      titleStart: "#fffef2",
      titleAccent: "#ffe36b",
      titleCore: "#ffffff",
      titleSoft: "#dff0ff",
      titleEnd: "#9ed5ff",
      heroEyebrow: "#ffe774",
      heroKicker: "#fff8d9",
      heroCopy: "rgba(250, 253, 255, 0.98)",
      heroQuote: "#fff0a8",
      topbarMeta: "rgba(255, 246, 191, 0.96)",
      displayFont: "\"STXingkai\", \"KaiTi\", serif"
    }
  }),
  createThemeOption({
    id: "cyber-cat",
    name: "赛博朋克猫之城",
    description: "把整页压到霓虹蓝粉的夜城气质，标题和背景都会变得更锋利、更有未来感。",
    introFrames: [
      "赛博朋克猫之城/7b412731eecf00ede8bfc71d24ccb27a.jpg",
      "赛博朋克猫之城/28b6f1613f360d6574303f95a48bfe2c.jpg",
      "赛博朋克猫之城/bb2bce017807007a68b9c119fdf23e45.jpg"
    ],
    images: {
      bodyBefore: "赛博朋克猫之城/28b6f1613f360d6574303f95a48bfe2c.jpg",
      bodyAfter: "赛博朋克猫之城/7b412731eecf00ede8bfc71d24ccb27a.jpg",
      viewGlow: "赛博朋克猫之城/bb2bce017807007a68b9c119fdf23e45.jpg",
      plannerGlow: "赛博朋克猫之城/7b412731eecf00ede8bfc71d24ccb27a.jpg",
      authHero: "赛博朋克猫之城/bb2bce017807007a68b9c119fdf23e45.jpg",
      topbar: "赛博朋克猫之城/28b6f1613f360d6574303f95a48bfe2c.jpg"
    },
    imagePositions: {
      topbar: "40% 28%"
    },
    palette: {
      sky: "#f0e4ff",
      skyDeep: "#8ea2ff",
      night: "#291d67",
      nightDeep: "#130d38",
      ink: "#38297b",
      inkSoft: "rgba(56, 41, 123, 0.76)",
      inkMuted: "rgba(56, 41, 123, 0.6)",
      gold: "#79f4ff",
      pink: "#ff70dc",
      violet: "#868bff",
      taskTint: "linear-gradient(135deg, rgba(249, 244, 255, 0.94), rgba(231, 228, 255, 0.86))",
      clockFaceBg: "rgba(244, 240, 255, 0.94)",
      clockFaceBorder: "rgba(197, 201, 255, 0.84)",
      titleStart: "#f7fbff",
      titleAccent: "#74f3ff",
      titleCore: "#ffffff",
      titleSoft: "#e2d7ff",
      titleEnd: "#ff95eb",
      heroEyebrow: "#7af6ff",
      heroKicker: "#f6efff",
      heroCopy: "rgba(247, 244, 255, 0.98)",
      heroQuote: "#ffb1ef",
      topbarMeta: "rgba(243, 245, 255, 0.94)",
      displayFont: "\"STXingkai\", \"KaiTi\", serif"
    }
  }),
  createThemeOption({
    id: "deep-sea",
    name: "深海传说",
    description: "偏蓝青的海底遗迹和鲸落微光，背景更沉静，适合想把页面氛围压低一点。",
    introFrames: [
      "深海传说/0f68faa30b7c81b32635cfa3df56f6d8.jpg",
      "深海传说/314a57f82c0083ddce15b02ffdc15ba9.jpg",
      "深海传说/9880b0a28a72799d11ff741958191281.jpg"
    ],
    previewImages: [
      "深海传说/0f68faa30b7c81b32635cfa3df56f6d8.jpg",
      "深海传说/314a57f82c0083ddce15b02ffdc15ba9.jpg",
      "深海传说/9880b0a28a72799d11ff741958191281.jpg"
    ],
    images: {
      bodyBefore: "深海传说/0f68faa30b7c81b32635cfa3df56f6d8.jpg",
      bodyAfter: "深海传说/314a57f82c0083ddce15b02ffdc15ba9.jpg",
      viewGlow: "深海传说/9880b0a28a72799d11ff741958191281.jpg",
      plannerGlow: "深海传说/a45f4dc638fed89bf5f2cba08962a8b1.jpg",
      authHero: "深海传说/a45f4dc638fed89bf5f2cba08962a8b1.jpg",
      topbar: "深海传说/9880b0a28a72799d11ff741958191281.jpg"
    },
    palette: {
      sky: "#ddf9ff",
      skyDeep: "#6ad4ef",
      night: "#104d77",
      nightDeep: "#072c43",
      ink: "#1a5a82",
      inkSoft: "rgba(26, 90, 130, 0.76)",
      inkMuted: "rgba(26, 90, 130, 0.6)",
      gold: "#9feeff",
      pink: "#9fd7ff",
      violet: "#72a8ff",
      taskTint: "linear-gradient(135deg, rgba(242, 252, 255, 0.94), rgba(214, 238, 247, 0.86))",
      clockFaceBg: "rgba(239, 250, 255, 0.94)",
      clockFaceBorder: "rgba(182, 222, 240, 0.84)",
      titleStart: "#f1fcff",
      titleAccent: "#8aefff",
      titleCore: "#ffffff",
      titleSoft: "#d9eeff",
      titleEnd: "#a9d4ff",
      heroEyebrow: "#b0f4ff",
      heroKicker: "#eefcff",
      heroCopy: "rgba(241, 252, 255, 0.98)",
      heroQuote: "#b7f2ff",
      topbarMeta: "rgba(238, 249, 255, 0.94)"
    }
  }),
  createThemeOption({
    id: "sheep-village",
    name: "云端羊村",
    description: "粉蓝云层、绵羊和星轨的治愈系主题，整个页面会变得更软、更轻、更像梦境。",
    introFrames: [
      "云端羊村/7cc6d8ecada2c55f691c9cbc4b30cdc2.jpg",
      "云端羊村/9f0fe5115756048e5ca44b32ab69ed24.jpg",
      "云端羊村/a9d1cbef5e05afaacdbc5799523b2487.jpg"
    ],
    previewImages: [
      "云端羊村/7cc6d8ecada2c55f691c9cbc4b30cdc2.jpg",
      "云端羊村/9f0fe5115756048e5ca44b32ab69ed24.jpg",
      "云端羊村/a9d1cbef5e05afaacdbc5799523b2487.jpg"
    ],
    images: {
      bodyBefore: "云端羊村/7cc6d8ecada2c55f691c9cbc4b30cdc2.jpg",
      bodyAfter: "云端羊村/c93235d45e79b142a9c65f509e7012e0.jpg",
      viewGlow: "云端羊村/d2afe6b9b2ab78ec692b94767045477a.jpg",
      plannerGlow: "云端羊村/9f0fe5115756048e5ca44b32ab69ed24.jpg",
      authHero: "云端羊村/a9d1cbef5e05afaacdbc5799523b2487.jpg",
      topbar: "云端羊村/b5b18667557974040425ff4350c321b5.jpg"
    },
    palette: {
      sky: "#f4f5ff",
      skyDeep: "#a9c4ff",
      night: "#5d63ad",
      nightDeep: "#3a4180",
      ink: "#676cb2",
      inkSoft: "rgba(103, 108, 178, 0.76)",
      inkMuted: "rgba(103, 108, 178, 0.6)",
      gold: "#ffe791",
      pink: "#ffd1e9",
      violet: "#b9b8ff",
      taskTint: "linear-gradient(135deg, rgba(255, 250, 252, 0.95), rgba(239, 242, 255, 0.88))",
      clockFaceBg: "rgba(253, 250, 255, 0.95)",
      clockFaceBorder: "rgba(224, 226, 255, 0.84)",
      titleStart: "#fffef9",
      titleAccent: "#ffe7b1",
      titleCore: "#fffdfd",
      titleSoft: "#ece8ff",
      titleEnd: "#ffd6ec",
      heroEyebrow: "#fff3be",
      heroKicker: "#fff7f9",
      heroCopy: "rgba(255, 253, 255, 0.98)",
      heroQuote: "#fff3ca",
      topbarMeta: "rgba(255, 250, 255, 0.94)"
    }
  })
];

const CURATED_THEME_OPTIONS = [
  createThemeOption({
    id: "stardream",
    name: "云岫织页",
    description: "换回你最开始那套云层与晨光的经典版本，柔和、耐看，不会像星梦织语那样太满。",
    introFrames: [
      "转场动画1.jpg",
      "转场动画2.jpg",
      "转场动画3.jpg"
    ],
    previewImages: [
      "背景2.jpg",
      "背景1.jpg",
      "背景3.jpg"
    ],
    images: {
      bodyBefore: "背景2.jpg",
      bodyAfter: "背景1.jpg",
      viewGlow: "背景3.jpg",
      plannerGlow: "背景1.jpg",
      authHero: "背景2.jpg",
      topbar: "背景2.jpg"
    },
    palette: {
      sky: "#dff0ff",
      skyDeep: "#9ec8ff",
      night: "#25356f",
      nightDeep: "#161f4a",
      ink: "#32456f",
      inkSoft: "rgba(50, 69, 111, 0.72)",
      inkMuted: "rgba(50, 69, 111, 0.56)",
      gold: "#ffd86e",
      pink: "#ffb6df",
      violet: "#a8a0ff",
      taskTint: "linear-gradient(135deg, rgba(255, 255, 255, 0.74), rgba(255, 243, 214, 0.78))",
      clockFaceBg: "rgba(255, 255, 255, 0.88)",
      clockFaceBorder: "rgba(255, 255, 255, 0.72)",
      titleStart: "#fffef8",
      titleAccent: "#fff2b8",
      titleCore: "#ffffff",
      titleSoft: "#fff8df",
      titleEnd: "#fff0b4",
      heroEyebrow: "#fff1a5",
      heroKicker: "#fff7d4",
      heroCopy: "rgba(255, 255, 255, 0.98)",
      heroQuote: "#fff3b8",
      topbarMeta: "rgba(255, 251, 240, 0.92)",
      displayFont: "\"STSong\", \"SimSun\", serif"
    }
  }),
  createThemeOption({
    id: "minimal-mist",
    name: "留白晨雾",
    description: "新加的简洁款。低饱和蓝灰、米白和轻雾感，尽量克制装饰，让任务内容自己站出来。",
    introFrames: [
      "背景3.jpg",
      "背景2.jpg",
      "背景1.jpg"
    ],
    previewImages: [
      "背景3.jpg",
      "背景2.jpg",
      "背景1.jpg"
    ],
    images: {
      bodyBefore: "背景3.jpg",
      bodyAfter: "背景2.jpg",
      viewGlow: "背景1.jpg",
      plannerGlow: "背景3.jpg",
      authHero: "背景3.jpg",
      topbar: "背景1.jpg"
    },
    palette: {
      sky: "#f3f7fb",
      skyDeep: "#d4deeb",
      night: "#40546f",
      nightDeep: "#25384f",
      ink: "#4f637d",
      inkSoft: "rgba(79, 99, 125, 0.72)",
      inkMuted: "rgba(79, 99, 125, 0.54)",
      gold: "#e8d8b5",
      pink: "#e8dfe8",
      violet: "#c8d4e6",
      taskTint: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(243, 246, 250, 0.86))",
      clockFaceBg: "rgba(255, 255, 255, 0.92)",
      clockFaceBorder: "rgba(224, 231, 239, 0.86)",
      titleStart: "#ffffff",
      titleAccent: "#eef3f8",
      titleCore: "#ffffff",
      titleSoft: "#edf1f5",
      titleEnd: "#e3e9ef",
      heroEyebrow: "#f8f5ee",
      heroKicker: "#ffffff",
      heroCopy: "rgba(255, 255, 255, 0.92)",
      heroQuote: "#f5efe4",
      topbarMeta: "rgba(247, 249, 252, 0.94)",
      displayFont: "\"STSong\", \"SimSun\", serif"
    }
  }),
  ...THEME_OPTIONS.filter((theme) => theme.id !== "stardream")
];

const ACTIVE_THEME_OPTIONS = CURATED_THEME_OPTIONS.filter((theme) => theme.id !== "minimal-mist");

const COMPANION_OPTIONS = [
  {
    id: "starguide",
    name: "守星人",
    persona: "温柔陪伴型，先接住目标，再把它拆成今天就能开始的一步。",
    preview: "ip形象1.jpg",
    avatar: "ip形象2.jpg",
    images: {
      guiding: "ip形象1.jpg",
      listening: "ip形象1.jpg",
      thinking: "ip形象2.jpg",
      speaking: "ip形象2.jpg"
    }
  },
  {
    id: "dreamranger",
    name: "巡梦精灵",
    persona: "更活泼一点，擅长把抽象愿望拽回可执行的地面。",
    preview: "ip形象2.jpg",
    avatar: "ip形象1.jpg",
    images: {
      guiding: "ip形象2.jpg",
      listening: "ip形象2.jpg",
      thinking: "ip形象1.jpg",
      speaking: "ip形象1.jpg"
    }
  },
  {
    id: "xiaoyumi",
    name: "小玉米",
    persona: "暖乎乎的陪伴型旅伴，适合轻松鼓劲，也会安静陪你把事情想明白。",
    preview: "xiaoyumi-guide.png",
    avatar: "xiaoyumi-think.png",
    images: {
      guiding: "xiaoyumi-guide.png",
      listening: "xiaoyumi-guide.png",
      thinking: "xiaoyumi-think.png",
      speaking: "xiaoyumi-think.png"
    }
  },
  {
    id: "xiaochun",
    name: "小田",
    persona: "安静细腻的夜花系陪伴者，擅长先陪你理清思路，再把目标拆成稳稳能执行的下一步。",
    preview: "xiaochun-guide.png",
    avatar: "xiaochun-think.png",
    images: {
      guiding: "xiaochun-guide.png",
      listening: "xiaochun-guide.png",
      thinking: "xiaochun-think.png",
      speaking: "xiaochun-think.png"
    }
  }
];
const TASK_COLOR_OPTIONS = [
  { id: "sunrise", name: "晨光杏", tint: "linear-gradient(135deg, rgba(255, 249, 236, 0.92), rgba(255, 228, 193, 0.82))" },
  { id: "blush", name: "柔粉雾", tint: "linear-gradient(135deg, rgba(255, 246, 252, 0.92), rgba(255, 214, 234, 0.84))" },
  { id: "tidal", name: "浅海蓝", tint: "linear-gradient(135deg, rgba(242, 249, 255, 0.94), rgba(204, 228, 255, 0.84))" },
  { id: "lilac", name: "暮光紫", tint: "linear-gradient(135deg, rgba(248, 245, 255, 0.94), rgba(221, 213, 255, 0.84))" },
  { id: "mint", name: "薄雾绿", tint: "linear-gradient(135deg, rgba(245, 255, 250, 0.94), rgba(207, 244, 228, 0.84))" },
  { id: "pearl", name: "珍珠白", tint: "linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(240, 242, 255, 0.86))" }
];
const DEFAULT_PREFERENCES = {
  themeId: "stardream",
  companionId: "starguide",
  defaultTaskColorId: "sunrise"
};

const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");
const plannerView = document.getElementById("plannerView");
const clockView = document.getElementById("clockView");
const introOverlay = document.getElementById("introOverlay");
const introFrameA = document.getElementById("introFrameA");
const introFrameB = document.getElementById("introFrameB");
const introFrameC = document.getElementById("introFrameC");
const clockLauncher = document.getElementById("clockLauncher");
const clockLauncherHour = document.getElementById("clockLauncherHour");
const clockLauncherMinute = document.getElementById("clockLauncherMinute");
const clockLauncherSecond = document.getElementById("clockLauncherSecond");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");
const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const topbarCopyToggle = document.getElementById("topbarCopyToggle");
const todayDate = document.getElementById("todayDate");
const plannerDate = document.getElementById("plannerDate");
const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");
const newGoalBtn = document.getElementById("newGoalBtn");
const openPlannerBtn = document.getElementById("openPlannerBtn");
const backToDashboardBtn = document.getElementById("backToDashboardBtn");
const backFromClockBtn = document.getElementById("backFromClockBtn");
const companionDock = document.getElementById("companionDock");
const companionFigure = document.getElementById("companionFigure");
const companionHintLabel = document.getElementById("companionHintLabel");
const companionHintTitle = document.getElementById("companionHintTitle");
const companionHintBody = document.getElementById("companionHintBody");
const houseDock = document.getElementById("houseDock");
const ambientAudioDock = document.getElementById("ambientAudioDock");
const ambientAudioButton = document.getElementById("ambientAudioButton");
const ambientAudioLabel = document.getElementById("ambientAudioLabel");
const openThemeStudioBtn = document.getElementById("openThemeStudioBtn");
const themeStudio = document.getElementById("themeStudio");
const themeOptionList = document.getElementById("themeOptionList");
const companionOptionList = document.getElementById("companionOptionList");
const defaultTaskColorList = document.getElementById("defaultTaskColorList");
const taskColorPicker = document.getElementById("taskColorPicker");
const closeTaskColorPickerBtn = document.getElementById("closeTaskColorPickerBtn");
const taskColorOptionList = document.getElementById("taskColorOptionList");
const taskColorPickerTitle = document.getElementById("taskColorPickerTitle");
const todayScheduleList = document.getElementById("todayScheduleList");
const goalList = document.getElementById("goalList");
const aiSuggestionList = document.getElementById("aiSuggestionList");
const plannerChatList = document.getElementById("plannerChatList");
const plannerDraftView = document.getElementById("plannerDraftView");
const plannerForm = document.getElementById("plannerForm");
const plannerInput = document.getElementById("plannerInput");
const plannerAttachmentsInput = document.getElementById("plannerAttachmentsInput");
const plannerAttachmentList = document.getElementById("plannerAttachmentList");
const plannerAttachmentClearBtn = document.getElementById("plannerAttachmentClearBtn");
const plannerSubmitBtn = document.getElementById("plannerSubmitBtn");
const clockPageDate = document.getElementById("clockPageDate");
const clockModeLabel = document.getElementById("clockModeLabel");
const clockPrimaryDisplay = document.getElementById("clockPrimaryDisplay");
const clockSecondaryDisplay = document.getElementById("clockSecondaryDisplay");
const clockTimePanel = document.getElementById("clockTimePanel");
const clockCountdownPanel = document.getElementById("clockCountdownPanel");
const clockStopwatchPanel = document.getElementById("clockStopwatchPanel");
const clockTaskPanel = document.getElementById("clockTaskPanel");
const clockCurrentTaskBoard = document.getElementById("clockCurrentTaskBoard");
const countdownMinutesInput = document.getElementById("countdownMinutesInput");
const countdownStartBtn = document.getElementById("countdownStartBtn");
const countdownPauseBtn = document.getElementById("countdownPauseBtn");
const countdownResetBtn = document.getElementById("countdownResetBtn");
const stopwatchStartBtn = document.getElementById("stopwatchStartBtn");
const stopwatchPauseBtn = document.getElementById("stopwatchPauseBtn");
const stopwatchResetBtn = document.getElementById("stopwatchResetBtn");
const countdownMinuteButtons = document.querySelectorAll(".clock-chip");
const clockModeButtons = document.querySelectorAll(".clock-mode-btn");
const quickActionButtons = document.querySelectorAll(".quick-action");
const boardSwitchButtons = document.querySelectorAll(".board-switch-btn");

let activeUser = null;
let currentView = "auth";
let previousMainView = "dashboard";
let currentGoalView = "cards";
let companionPositioned = false;
let clockTaskPanelPositioned = false;
let suppressCompanionClick = false;
let suppressClockTaskBoardSwitch = false;
let armedGoalDeleteId = "";
let plannerRequestPending = false;
let plannerPendingAttachments = [];
let plannerAttachmentStatusMessage = "";
let pendingTaskColorId = null;
let clockMode = "time";
let clockTickerId = 0;
let countdownIntervalId = 0;
let stopwatchIntervalId = 0;
let countdownRemainingMs = 25 * 60 * 1000;
let countdownEndAt = null;
let stopwatchElapsedMs = 0;
let stopwatchStartedAt = null;
let ambientAudioEnabled = false;
let ambientSoundId = AMBIENT_SOUND_OPTIONS[0].id;
let ambientAudioClickTimer = 0;
let ambientAudioContext = null;
let ambientAudioMasterGain = null;
let ambientAudioCleanup = [];
let ambientNoiseBuffer = null;
let themeTransitionOverlay = null;
let themeTransitionFrames = [];
let themeTransitionExitTimer = 0;
let themeTransitionCleanupTimer = 0;
const companionDrag = {
  active: false,
  moved: false,
  offsetX: 0,
  offsetY: 0
};
const clockTaskPanelDrag = {
  active: false,
  moved: false,
  offsetX: 0,
  offsetY: 0
};

initializeApp();

function initializeApp() {
  ensureThemeTransitionOverlay();
  initializeAmbientAudio();
  bindEvents();
  renderPlannerAttachmentList();
  const session = loadJson(STORAGE_KEYS.session, null);
  if (session?.username) {
    activeUser = session.username;
    applyActivePreferences();
  } else {
    applyThemeById(getPublicThemeId());
  }

  startClockTicker();
  playIntro();

  if (activeUser) {
    showDashboard();
    return;
  }

  showAuthView();
}

function ensureThemeTransitionOverlay() {
  if (themeTransitionOverlay) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "theme-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="theme-transition-stage">
      <img class="theme-transition-frame theme-transition-frame-a" alt="">
      <img class="theme-transition-frame theme-transition-frame-b" alt="">
      <img class="theme-transition-frame theme-transition-frame-c" alt="">
      <div class="theme-transition-vignette"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  themeTransitionOverlay = overlay;
  themeTransitionFrames = Array.from(overlay.querySelectorAll(".theme-transition-frame"));
}

function playThemeTransition(theme) {
  ensureThemeTransitionOverlay();
  if (!themeTransitionOverlay) {
    return;
  }

  const frames = Array.isArray(theme?.introFrames) && theme.introFrames.length
    ? theme.introFrames
    : [];

  themeTransitionFrames.forEach((frame, index) => {
    const source = frames[index] || frames[frames.length - 1] || "";
    frame.src = source;
  });

  window.clearTimeout(themeTransitionExitTimer);
  window.clearTimeout(themeTransitionCleanupTimer);
  themeTransitionOverlay.classList.remove("is-active", "is-exiting");
  void themeTransitionOverlay.offsetWidth;
  themeTransitionOverlay.classList.add("is-active");

  themeTransitionExitTimer = window.setTimeout(() => {
    themeTransitionOverlay?.classList.add("is-exiting");
  }, Math.max(THEME_TRANSITION_DURATION - 260, 0));

  themeTransitionCleanupTimer = window.setTimeout(() => {
    themeTransitionOverlay?.classList.remove("is-active", "is-exiting");
  }, THEME_TRANSITION_DURATION);
}

function bindEvents() {
  showLoginBtn.addEventListener("click", () => toggleAuthMode("login"));
  showRegisterBtn.addEventListener("click", () => toggleAuthMode("register"));
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
  topbarCopyToggle?.addEventListener("click", handleTopbarCopyToggleClick);
  topbarCopyToggle?.addEventListener("dblclick", handleTopbarCopyToggleDoubleClick);
  topbarCopyToggle?.addEventListener("keydown", handleTopbarCopyToggleKeydown);
  logoutBtn.addEventListener("click", handleLogout);
  newGoalBtn.addEventListener("click", showPlannerView);
  openPlannerBtn.addEventListener("click", handleCompanionClick);
  openPlannerBtn.addEventListener("pointerdown", handleCompanionPointerDown);
  backToDashboardBtn.addEventListener("click", showDashboard);
  backFromClockBtn.addEventListener("click", returnFromClockView);
  clockLauncher.addEventListener("click", showClockView);
  openThemeStudioBtn.addEventListener("click", openThemeStudio);
  closeTaskColorPickerBtn.addEventListener("click", closeTaskColorPicker);
  plannerForm.addEventListener("submit", handlePlannerSubmitWithAttachments);
  plannerInput.addEventListener("focus", () => updateCompanionState("listening"));
  plannerInput.addEventListener("blur", () => syncCompanionForCurrentView());
  plannerAttachmentsInput?.addEventListener("change", handlePlannerAttachmentSelection);
  plannerAttachmentList?.addEventListener("click", handlePlannerAttachmentListClick);
  plannerAttachmentClearBtn?.addEventListener("click", clearPlannerPendingAttachments);
  window.addEventListener("pointermove", handleCompanionPointerMove);
  window.addEventListener("pointerup", handleCompanionPointerUp);
  window.addEventListener("pointermove", handleClockTaskPanelPointerMove);
  window.addEventListener("pointerup", handleClockTaskPanelPointerUp);
  window.addEventListener("pointerdown", handleThemeStudioPointerDown);
  window.addEventListener("keydown", handleThemeStudioKeydown);
  window.addEventListener("resize", handleWindowResize);
  taskColorPicker.addEventListener("click", handleTaskColorPickerBackdrop);
  todayScheduleList.addEventListener("dblclick", handleScheduleCardDoubleClick);
  goalList.addEventListener("dblclick", handleGoalCardDoubleClick);
  goalList.addEventListener("click", handleGoalListClick);
  if (clockTaskPanel) {
    clockTaskPanel.addEventListener("pointerdown", handleClockTaskPanelPointerDown);
  }
  if (clockCurrentTaskBoard) {
    clockCurrentTaskBoard.addEventListener("dblclick", handleClockTaskBoardDoubleClick);
    clockCurrentTaskBoard.addEventListener("keydown", handleClockTaskBoardKeydown);
  }
  if (ambientAudioButton) {
    ambientAudioButton.addEventListener("click", handleAmbientAudioButtonClick);
    ambientAudioButton.addEventListener("dblclick", handleAmbientAudioButtonDoubleClick);
  }

  boardSwitchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentGoalView = button.dataset.boardView || "cards";
      syncBoardSwitchState();
      renderGoals();
    });
  });

  quickActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      plannerInput.value = button.dataset.prompt || "";
      plannerInput.focus();
    });
  });

  clockModeButtons.forEach((button) => {
    button.addEventListener("click", () => setClockMode(button.dataset.clockMode || "time"));
  });

  countdownMinuteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      countdownMinutesInput.value = button.dataset.minutes || "25";
      resetCountdown();
    });
  });

  countdownStartBtn.addEventListener("click", startCountdown);
  countdownPauseBtn.addEventListener("click", pauseCountdown);
  countdownResetBtn.addEventListener("click", resetCountdown);
  countdownMinutesInput.addEventListener("change", resetCountdown);
  stopwatchStartBtn.addEventListener("click", startStopwatch);
  stopwatchPauseBtn.addEventListener("click", pauseStopwatch);
  stopwatchResetBtn.addEventListener("click", resetStopwatch);
}

function playIntro() {
  document.body.classList.add("intro-playing");
  window.setTimeout(() => {
    if (!introOverlay) {
      document.body.classList.remove("intro-playing");
      return;
    }

    introOverlay.classList.add("is-finished");
    document.body.classList.remove("intro-playing");
  }, INTRO_DURATION);

  window.setTimeout(() => {
  introOverlay?.remove();
  }, INTRO_DURATION + 900);
}

function legacyGetAmbientSoundByIdV1(soundId) {
  return AMBIENT_SOUND_OPTIONS.find((item) => item.id === soundId) || AMBIENT_SOUND_OPTIONS[0];
}

function legacyInitializeAmbientAudioV1() {
  const saved = loadJson(STORAGE_KEYS.ambientAudio, null);
  ambientSoundId = getAmbientSoundById(saved?.soundId).id;
  ambientAudioEnabled = false;

  if (ambientAudio) {
    ambientAudio.loop = true;
    ambientAudio.preload = "none";
    ambientAudio.volume = 0.46;
    applyAmbientAudioSource();
  }

  updateAmbientAudioButton();
}

function legacySaveAmbientAudioStateV1() {
  saveJson(STORAGE_KEYS.ambientAudio, {
    soundId: ambientSoundId,
    enabled: ambientAudioEnabled
  });
}

function handleWindowResize() {
  clampCompanionPosition();
  syncClockTaskPanelFloatingState();
}

function applyAmbientAudioSource() {
  if (!ambientAudio) {
    return;
  }

  const sound = getAmbientSoundById(ambientSoundId);
  if (ambientAudio.src !== sound.url) {
    ambientAudio.src = sound.url;
  }
}

async function legacyPlayAmbientAudioV1() {
  if (!ambientAudio) {
    return;
  }

  applyAmbientAudioSource();
  try {
    await ambientAudio.play();
  } catch (error) {
    ambientAudioEnabled = false;
    saveAmbientAudioState();
    updateAmbientAudioButton();
  }
}

function legacyPauseAmbientAudioV1() {
  if (!ambientAudio) {
    return;
  }

  ambientAudio.pause();
}

function legacyToggleAmbientAudioV1() {
  ambientAudioEnabled = !ambientAudioEnabled;
  if (ambientAudioEnabled) {
    playAmbientAudio();
  } else {
    pauseAmbientAudio();
  }
  saveAmbientAudioState();
  updateAmbientAudioButton();
}

function legacyCycleAmbientSoundV1() {
  const currentIndex = AMBIENT_SOUND_OPTIONS.findIndex((item) => item.id === ambientSoundId);
  const nextSound = AMBIENT_SOUND_OPTIONS[(currentIndex + 1) % AMBIENT_SOUND_OPTIONS.length];
  ambientSoundId = nextSound.id;
  applyAmbientAudioSource();
  if (ambientAudioEnabled) {
    playAmbientAudio();
  }
  saveAmbientAudioState();
  updateAmbientAudioButton();
}

function legacyUpdateAmbientAudioButtonV1() {
  if (!ambientAudioButton || !ambientAudioDock || !ambientAudioLabel) {
    return;
  }

  const sound = getAmbientSoundById(ambientSoundId);
  ambientAudioButton.classList.toggle("is-active", ambientAudioEnabled);
  ambientAudioLabel.textContent = sound.name;
  ambientAudioButton.title = `单击${ambientAudioEnabled ? "关闭" : "开启"}音效，双击切换声音。当前：${sound.name} · ${sound.source} · ${sound.credit}`;
  ambientAudioButton.setAttribute("aria-label", `当前${sound.name}，单击${ambientAudioEnabled ? "关闭" : "开启"}音效，双击切换声音`);
}

function handleAmbientAudioButtonClick() {
  if (ambientAudioClickTimer) {
    window.clearTimeout(ambientAudioClickTimer);
  }

  ambientAudioClickTimer = window.setTimeout(() => {
    ambientAudioClickTimer = 0;
    toggleAmbientAudio();
  }, 220);
}

function handleAmbientAudioButtonDoubleClick(event) {
  event.preventDefault();
  if (ambientAudioClickTimer) {
    window.clearTimeout(ambientAudioClickTimer);
    ambientAudioClickTimer = 0;
  }
  cycleAmbientSound();
}

function getThemeById(themeId) {
  return ACTIVE_THEME_OPTIONS.find((theme) => theme.id === themeId) || ACTIVE_THEME_OPTIONS[0];
}

function getCompanionById(companionId) {
  return COMPANION_OPTIONS.find((item) => item.id === companionId) || COMPANION_OPTIONS[0];
}

function getTaskColorById(colorId) {
  return TASK_COLOR_OPTIONS.find((item) => item.id === colorId) || TASK_COLOR_OPTIONS[0];
}

function getPublicThemeId() {
  return getThemeById(loadJson(STORAGE_KEYS.authTheme, DEFAULT_PREFERENCES.themeId)).id;
}

function normalizePreferences(preferences) {
  return {
    themeId: getThemeById(preferences?.themeId || DEFAULT_PREFERENCES.themeId).id,
    companionId: getCompanionById(preferences?.companionId || DEFAULT_PREFERENCES.companionId).id,
    defaultTaskColorId: getTaskColorById(preferences?.defaultTaskColorId || DEFAULT_PREFERENCES.defaultTaskColorId).id
  };
}

function getActivePreferences() {
  if (!activeUser) {
    return {
      ...DEFAULT_PREFERENCES,
      themeId: getPublicThemeId()
    };
  }

  return normalizePreferences(getUserData().preferences);
}

function isXuniThemeActive() {
  return document.body.dataset.themeId === "xuni-yusheng";
}

function isXuniTopbarCollapsed() {
  const saved = loadJson(STORAGE_KEYS.xuniTopbarCollapsed, true);
  return typeof saved === "boolean" ? saved : true;
}

function setXuniTopbarCollapsed(collapsed) {
  saveJson(STORAGE_KEYS.xuniTopbarCollapsed, Boolean(collapsed));
  syncTopbarCopyToggle();
}

function syncTopbarCopyToggle() {
  if (!topbarCopyToggle) {
    return;
  }

  const useOrbMode = currentView === "dashboard" && isXuniThemeActive();
  const collapsed = useOrbMode ? isXuniTopbarCollapsed() : false;

  topbarCopyToggle.classList.toggle("is-orb-mode", useOrbMode);
  topbarCopyToggle.classList.toggle("is-collapsed", useOrbMode && collapsed);
  topbarCopyToggle.tabIndex = useOrbMode ? 0 : -1;
  topbarCopyToggle.setAttribute("aria-expanded", String(!(useOrbMode && collapsed)));
  topbarCopyToggle.setAttribute(
    "aria-label",
    !useOrbMode
      ? "时间织梦簿"
      : collapsed
        ? "展开时间织梦簿标题卡片"
        : "双击收起时间织梦簿标题卡片"
  );
}

function handleTopbarCopyToggleClick() {
  if (!isXuniThemeActive() || currentView !== "dashboard") {
    return;
  }

  setXuniTopbarCollapsed(!isXuniTopbarCollapsed());
}

function handleTopbarCopyToggleDoubleClick(event) {
  if (!isXuniThemeActive() || currentView !== "dashboard" || isXuniTopbarCollapsed()) {
    return;
  }

  event.preventDefault();
  setXuniTopbarCollapsed(true);
}

function handleTopbarCopyToggleKeydown(event) {
  if (!isXuniThemeActive() || currentView !== "dashboard") {
    return;
  }

  if ((event.key === "Enter" || event.key === " ") && isXuniTopbarCollapsed()) {
    event.preventDefault();
    setXuniTopbarCollapsed(false);
    return;
  }

  if (event.key === "Escape" && !isXuniTopbarCollapsed()) {
    event.preventDefault();
    setXuniTopbarCollapsed(true);
  }
}

function applyThemeById(themeId, options = {}) {
  const { animate = false } = options;
  const theme = getThemeById(themeId);
  if (animate) {
    playThemeTransition(theme);
  }

  saveJson(STORAGE_KEYS.authTheme, theme.id);

  document.documentElement.style.setProperty("--body-before-image", `url("${theme.images.bodyBefore}")`);
  document.documentElement.style.setProperty("--body-after-image", `url("${theme.images.bodyAfter}")`);
  document.documentElement.style.setProperty("--view-glow-image", `url("${theme.images.viewGlow}")`);
  document.documentElement.style.setProperty("--planner-glow-image", `url("${theme.images.plannerGlow}")`);
  document.documentElement.style.setProperty("--auth-hero-image", `url("${theme.images.authHero}")`);
  document.documentElement.style.setProperty("--topbar-image", `url("${theme.images.topbar}")`);
  document.documentElement.style.setProperty("--auth-hero-image-position", theme.imagePositions?.authHero || "center center");
  document.documentElement.style.setProperty("--topbar-image-position", theme.imagePositions?.topbar || "center center");
  document.documentElement.style.setProperty("--body-before-opacity", String(theme.layerOpacity?.bodyBefore ?? 0.72));
  document.documentElement.style.setProperty("--body-after-opacity", String(theme.layerOpacity?.bodyAfter ?? 0.34));
  document.documentElement.style.setProperty("--topbar-strip-image-a", `url("${theme.stripImages?.first || theme.images.topbar}")`);
  document.documentElement.style.setProperty("--topbar-strip-image-b", `url("${theme.stripImages?.second || theme.images.topbar}")`);
  document.documentElement.style.setProperty("--topbar-strip-image-c", `url("${theme.stripImages?.third || theme.images.topbar}")`);
  document.body.dataset.themeId = theme.id;

  Object.entries(theme.vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });

  [introFrameA, introFrameB, introFrameC].forEach((frame, index) => {
    if (frame) {
      frame.src = theme.introFrames[index];
    }
  });

  syncTopbarCopyToggle();
}

function applyActivePreferences(options = {}) {
  const { animateThemeChange = false } = options;
  const preferences = getActivePreferences();
  const companion = getCompanionById(preferences.companionId);

  applyThemeById(preferences.themeId, { animate: animateThemeChange });
  companionFigure.src = companion.images.guiding;
  renderThemeStudio();
}

function updatePreferences(partial) {
  if (!activeUser) {
    return;
  }

  const previousPreferences = getActivePreferences();
  const data = getUserData();
  data.preferences = normalizePreferences({
    ...data.preferences,
    ...partial
  });
  updateUserData(data);
  applyActivePreferences({
    animateThemeChange: Boolean(partial.themeId && partial.themeId !== previousPreferences.themeId)
  });

  if (currentView === "planner") {
    renderPlanner();
    syncCompanionForCurrentView();
  } else if (currentView === "dashboard") {
    renderSchedule();
    renderSuggestions();
    updateCompanionState("guiding");
  } else if (currentView === "clock") {
    renderClockView();
  }
}

function getActiveCompanion() {
  return getCompanionById(getActivePreferences().companionId);
}

function isThemeStudioOpen() {
  return Boolean(themeStudio && !themeStudio.classList.contains("hidden"));
}

function openThemeStudio() {
  if (!activeUser) {
    return;
  }

  if (isThemeStudioOpen()) {
    closeThemeStudio();
    return;
  }

  renderThemeStudio();
  themeStudio.classList.remove("hidden");
  themeStudio.setAttribute("aria-hidden", "false");
}

function closeThemeStudio() {
  themeStudio.classList.add("hidden");
  themeStudio.setAttribute("aria-hidden", "true");
}

function handleThemeStudioPointerDown(event) {
  if (!isThemeStudioOpen()) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (themeStudio?.contains(target) || openThemeStudioBtn?.contains(target)) {
    return;
  }

  closeThemeStudio();
}

function handleThemeStudioKeydown(event) {
  if (event.key === "Escape" && isThemeStudioOpen()) {
    closeThemeStudio();
  }
}

function renderThemeStudio() {
  const preferences = getActivePreferences();

  themeOptionList.innerHTML = ACTIVE_THEME_OPTIONS.map((theme) => `
    <button class="theme-option-card ${theme.id === preferences.themeId ? "active" : ""}" type="button" data-theme-id="${theme.id}">
      <div class="theme-option-preview">
        ${(theme.previewImages || theme.introFrames).slice(0, 3).map((image) => `<span style="background-image:url('${escapeHtml(image)}')"></span>`).join("")}
      </div>
      <div class="theme-option-meta">
        <strong>${escapeHtml(theme.name)}</strong>
        <small>${escapeHtml(theme.description)}</small>
      </div>
    </button>
  `).join("");

  companionOptionList.innerHTML = COMPANION_OPTIONS.map((companion) => `
    <button class="companion-option-card ${companion.id === preferences.companionId ? "active" : ""}" type="button" data-companion-id="${companion.id}">
      <img class="companion-option-preview" src="${escapeHtml(companion.preview)}" alt="">
      <div class="companion-option-meta">
        <strong>${escapeHtml(companion.name)}</strong>
        <small>${escapeHtml(companion.persona)}</small>
      </div>
    </button>
  `).join("");

  defaultTaskColorList.innerHTML = TASK_COLOR_OPTIONS.map((color) => `
    <button
      class="color-swatch-btn ${color.id === preferences.defaultTaskColorId ? "active" : ""}"
      type="button"
      data-default-task-color-id="${color.id}"
      title="${escapeHtml(color.name)}"
      style="background:${escapeHtml(color.tint)}"
    ></button>
  `).join("");

  bindThemeStudioEvents();
}

function bindThemeStudioEvents() {
  themeOptionList.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.themeId) {
        updatePreferences({ themeId: button.dataset.themeId });
      }
    });
  });

  companionOptionList.querySelectorAll("[data-companion-id]").forEach((button) => {
    button.addEventListener("click", () => updatePreferences({ companionId: button.dataset.companionId }));
  });

  defaultTaskColorList.querySelectorAll("[data-default-task-color-id]").forEach((button) => {
    button.addEventListener("click", () => updatePreferences({ defaultTaskColorId: button.dataset.defaultTaskColorId }));
  });
}

function handleScheduleCardDoubleClick(event) {
  const card = event.target.closest("[data-schedule-id]");
  if (!card || currentView !== "dashboard") {
    return;
  }

  pendingTaskColorId = card.dataset.scheduleId;
  taskColorPickerTitle.textContent = `正在为「${card.dataset.scheduleTitle || "这张任务卡"}」选择底色。`;
  renderTaskColorPicker();
  taskColorPicker.classList.remove("hidden");
  taskColorPicker.setAttribute("aria-hidden", "false");
}

function handleClockTaskBoardKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  handleClockTaskBoardDoubleClick();
}

function buildClockTaskOptions(data) {
  const options = [];
  const seen = new Set();
  const scheduleCards = getScheduleCards(data);

  scheduleCards.forEach((item) => {
    const key = `schedule:${item.id}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    options.push({
      id: key,
      title: item.title,
      meta: item.time,
      detail: item.detail,
      source: "今日任务卡",
      sourceDetail: `来自今日任务区，适合直接开始推进。`
    });
  });

  (Array.isArray(data?.goals) ? data.goals : []).forEach((goal) => {
    (Array.isArray(goal.tasks) ? goal.tasks : []).forEach((task) => {
      if (isGoalTaskComplete(task)) {
        return;
      }

      const key = `goal:${goal.id}:${task.id}`;
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      options.push({
        id: key,
        title: formatGoalTaskLabel(task),
        meta: goal.deadline ? `目标截止：${goal.deadline}` : "长线目标推进",
        detail: goal.title,
        source: "长线目标",
        sourceDetail: `来自「${goal.title}」的未完成动作，适合在静室里单点推进。`
      });
    });
  });

  return options;
}

function getSelectedClockTask(data) {
  const options = buildClockTaskOptions(data);
  if (!options.length) {
    return { options, task: null };
  }

  const selectedId = typeof data?.clockFocusTaskId === "string" ? data.clockFocusTaskId : "";
  const selectedTask = options.find((item) => item.id === selectedId) || options[0];
  return {
    options,
    task: selectedTask
  };
}

function legacyRenderClockCurrentTaskBoardV1(data = getUserData()) {
  if (!clockCurrentTaskBoard) {
    return;
  }

  const { options, task } = getSelectedClockTask(data);

  if (!task) {
    delete clockCurrentTaskBoard.dataset.clockTaskId;
    clockCurrentTaskBoard.innerHTML = `
      <div class="clock-task-empty">
        <span class="clock-task-badge">当前任务</span>
        <h3 class="clock-task-title">这里还没有任务</h3>
        <p class="clock-task-empty-copy">先去首页插入一条今日任务，或让守星人帮你拆一版计划，再回来专注推进。</p>
        <p class="clock-task-empty-hint">等这里有任务后，双击这张板就能轮换当前任务。</p>
      </div>
    `;
    return;
  }

  clockCurrentTaskBoard.dataset.clockTaskId = task.id;
  clockCurrentTaskBoard.innerHTML = `
    <article class="clock-task-card">
      <div class="clock-task-kicker">
        <span class="clock-task-badge">当前任务</span>
        <span class="clock-task-cycle">${options.length > 1 ? `双击切换 ${options.length} 项` : "当前仅 1 项"}</span>
      </div>
      <h3 class="clock-task-title">${escapeHtml(task.title)}</h3>
      <p class="clock-task-meta">${escapeHtml(task.meta)}</p>
      <div class="clock-task-source">
        <p class="clock-task-source-label">${escapeHtml(task.source)}</p>
        <p class="clock-task-source-copy">${escapeHtml(task.detail)}</p>
        <p class="clock-task-meta">${escapeHtml(task.sourceDetail)}</p>
      </div>
    </article>
  `;
}

function handleClockTaskBoardDoubleClick() {
  if (suppressClockTaskBoardSwitch) {
    return;
  }

  const data = getUserData();
  const { options, task } = getSelectedClockTask(data);
  if (!task || options.length < 2) {
    return;
  }

  const currentIndex = options.findIndex((item) => item.id === task.id);
  const nextTask = options[(currentIndex + 1) % options.length];
  data.clockFocusTaskId = nextTask.id;
  updateUserData(data);
  renderClockCurrentTaskBoard();
}

function handleTaskColorPickerBackdrop(event) {
  if (event.target === taskColorPicker) {
    closeTaskColorPicker();
  }
}

function renderTaskColorPicker() {
  const data = getUserData();
  const scheduleItem = data.schedule.find((item) => item.id === pendingTaskColorId);
  const selectedColorId = scheduleItem?.colorId || data.preferences.defaultTaskColorId;

  taskColorOptionList.innerHTML = TASK_COLOR_OPTIONS.map((color) => `
    <button
      class="color-swatch-btn ${color.id === selectedColorId ? "active" : ""}"
      type="button"
      data-task-color-id="${color.id}"
      title="${escapeHtml(color.name)}"
      style="background:${escapeHtml(color.tint)}"
    ></button>
  `).join("");

  taskColorOptionList.querySelectorAll("[data-task-color-id]").forEach((button) => {
    button.addEventListener("click", () => applyTaskColorToSchedule(button.dataset.taskColorId));
  });
}

function applyTaskColorToSchedule(colorId) {
  if (!pendingTaskColorId) {
    return;
  }

  const data = getUserData();
  const item = data.schedule.find((schedule) => schedule.id === pendingTaskColorId);
  if (!item) {
    return;
  }

  item.colorId = getTaskColorById(colorId).id;
  updateUserData(data);
  closeTaskColorPicker();
  renderSchedule();
}

function closeTaskColorPicker() {
  pendingTaskColorId = null;
  taskColorPicker.classList.add("hidden");
  taskColorPicker.setAttribute("aria-hidden", "true");
}

function startClockTicker() {
  updateLiveClock();
  if (clockTickerId) {
    window.clearInterval(clockTickerId);
  }
  clockTickerId = window.setInterval(updateLiveClock, 1000);
  resetCountdown();
  renderClockView();
}

function updateLiveClock() {
  const now = new Date();
  updateClockLauncher(now);
  if (currentView === "clock" && clockMode === "time") {
    renderClockView();
  } else if (currentView === "clock") {
    clockPageDate.textContent = formatDisplayDate(now);
  }
}

function updateClockLauncher(date) {
  setClockHandRotation(clockLauncherHour, ((date.getHours() % 12) + date.getMinutes() / 60) * 30);
  setClockHandRotation(clockLauncherMinute, (date.getMinutes() + date.getSeconds() / 60) * 6);
  setClockHandRotation(clockLauncherSecond, date.getSeconds() * 6);
}

function setClockHandRotation(element, degree) {
  if (!element) {
    return;
  }

  element.style.transform = `translate(-50%, -100%) rotate(${degree}deg)`;
}

function showClockView() {
  if (!activeUser) {
    return;
  }

  previousMainView = currentView === "planner" ? "planner" : "dashboard";
  currentView = "clock";
  setBodyView();
  authView.classList.add("hidden");
  dashboardView.classList.add("hidden");
  plannerView.classList.add("hidden");
  clockView.classList.remove("hidden");
  companionDock.classList.add("hidden");
  closeThemeStudio();
  closeTaskColorPicker();
  renderClockView();
  syncClockTaskPanelFloatingState();
}

function returnFromClockView() {
  if (previousMainView === "planner") {
    showPlannerView();
    return;
  }

  showDashboard();
}

function setClockMode(mode) {
  clockMode = mode;
  if (mode === "countdown") {
    resetCountdown();
  }
  if (mode === "stopwatch") {
    renderStopwatch();
  }
  renderClockView();
}

function renderClockView() {
  const now = new Date();
  clockPageDate.textContent = formatDisplayDate(now);
  renderClockCurrentTaskBoard(getUserData());
  syncClockTaskPanelFloatingState();
  clockModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.clockMode === clockMode);
  });
  clockTimePanel.classList.toggle("hidden", clockMode !== "time");
  clockCountdownPanel.classList.toggle("hidden", clockMode !== "countdown");
  clockStopwatchPanel.classList.toggle("hidden", clockMode !== "stopwatch");

  if (clockMode === "countdown") {
    renderCountdown();
    return;
  }

  if (clockMode === "stopwatch") {
    renderStopwatch();
    return;
  }

  clockModeLabel.textContent = "当前时刻";
  clockPrimaryDisplay.textContent = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  clockSecondaryDisplay.textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日，先把心绪慢下来，再开始今天的推进。`;
}

function startCountdown() {
  pauseCountdown();
  const minutes = clamp(Number(countdownMinutesInput.value) || 25, 1, 180);
  if (!countdownRemainingMs || countdownRemainingMs <= 1000) {
    countdownRemainingMs = minutes * 60 * 1000;
  }
  countdownEndAt = Date.now() + countdownRemainingMs;
  countdownIntervalId = window.setInterval(tickCountdown, 250);
  renderCountdown();
}

function tickCountdown() {
  if (!countdownEndAt) {
    return;
  }

  countdownRemainingMs = Math.max(0, countdownEndAt - Date.now());
  renderCountdown();
  if (countdownRemainingMs <= 0) {
    pauseCountdown();
    clockSecondaryDisplay.textContent = "这一段倒计时已经走完了。先抬头、呼吸，再决定下一段要不要继续。";
  }
}

function pauseCountdown() {
  if (countdownIntervalId) {
    window.clearInterval(countdownIntervalId);
    countdownIntervalId = 0;
  }
  if (countdownEndAt) {
    countdownRemainingMs = Math.max(0, countdownEndAt - Date.now());
  }
  countdownEndAt = null;
  renderCountdown();
}

function resetCountdown() {
  if (countdownIntervalId) {
    window.clearInterval(countdownIntervalId);
    countdownIntervalId = 0;
  }
  countdownEndAt = null;
  countdownRemainingMs = clamp(Number(countdownMinutesInput.value) || 25, 1, 180) * 60 * 1000;
  renderCountdown();
}

function renderCountdown() {
  clockModeLabel.textContent = "倒计时";
  clockPrimaryDisplay.textContent = formatDuration(countdownRemainingMs);
  clockSecondaryDisplay.textContent = countdownEndAt
    ? "把杂音关掉，只专心推进这一段时间里真正重要的一件事。"
    : "设定一段安静的时长，让注意力先在这里落地。";
}

function startStopwatch() {
  if (stopwatchIntervalId) {
    return;
  }
  stopwatchStartedAt = Date.now() - stopwatchElapsedMs;
  stopwatchIntervalId = window.setInterval(() => {
    stopwatchElapsedMs = Date.now() - stopwatchStartedAt;
    renderStopwatch();
  }, 250);
  renderStopwatch();
}

function pauseStopwatch() {
  if (stopwatchIntervalId) {
    window.clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = 0;
  }
  if (stopwatchStartedAt) {
    stopwatchElapsedMs = Date.now() - stopwatchStartedAt;
  }
  stopwatchStartedAt = null;
  renderStopwatch();
}

function resetStopwatch() {
  if (stopwatchIntervalId) {
    window.clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = 0;
  }
  stopwatchStartedAt = null;
  stopwatchElapsedMs = 0;
  renderStopwatch();
}

function renderStopwatch() {
  clockModeLabel.textContent = "正计时";
  clockPrimaryDisplay.textContent = formatDuration(stopwatchElapsedMs);
  clockSecondaryDisplay.textContent = stopwatchIntervalId
    ? "时间正在静静前行，把注意力继续留在你手上的这件事。"
    : "当你准备进入一段沉浸状态，就按下开始。";
}

function toggleAuthMode(mode) {
  const isLogin = mode === "login";
  loginForm.classList.toggle("hidden", !isLogin);
  registerForm.classList.toggle("hidden", isLogin);
  showLoginBtn.classList.toggle("active", isLogin);
  showRegisterBtn.classList.toggle("active", !isLogin);
  authMessage.textContent = "";
}

function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value.trim();
  const contact = document.getElementById("registerContact").value.trim();
  const password = document.getElementById("registerPassword").value;
  const users = loadJson(STORAGE_KEYS.users, []);

  if (!username || !contact || !password) {
    authMessage.textContent = "请完整填写注册信息。";
    return;
  }

  if (password.length < 6) {
    authMessage.textContent = "密码至少需要 6 位。";
    return;
  }

  if (users.some((user) => user.username === username)) {
    authMessage.textContent = "用户名已存在，请换一个。";
    return;
  }

  users.push({ username, contact, password });
  saveJson(STORAGE_KEYS.users, users);

  const dashboardStore = loadJson(STORAGE_KEYS.dashboard, {});
  dashboardStore[username] = createInitialDashboardData(username);
  saveJson(STORAGE_KEYS.dashboard, dashboardStore);

  saveJson(STORAGE_KEYS.session, { username });
  activeUser = username;
  registerForm.reset();
  authMessage.textContent = "";
  applyActivePreferences();
  showDashboard();
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const users = loadJson(STORAGE_KEYS.users, []);
  const matchedUser = users.find((user) => user.username === username && user.password === password);

  if (!matchedUser) {
    authMessage.textContent = "用户名或密码错误。";
    return;
  }

  saveJson(STORAGE_KEYS.session, { username: matchedUser.username });
  activeUser = matchedUser.username;
  loginForm.reset();
  authMessage.textContent = "";
  applyActivePreferences();
  showDashboard();
}

function handleLogout() {
  const themeId = getActivePreferences().themeId;
  localStorage.removeItem(STORAGE_KEYS.session);
  activeUser = null;
  ambientAudioEnabled = false;
  pauseAmbientAudio();
  saveAmbientAudioState();
  updateAmbientAudioButton();
  closeThemeStudio();
  closeTaskColorPicker();
  applyThemeById(themeId);
  showAuthView();
}

function showAuthView() {
  currentView = "auth";
  setBodyView();
  authView.classList.remove("hidden");
  dashboardView.classList.add("hidden");
  plannerView.classList.add("hidden");
  clockView.classList.add("hidden");
  companionDock.classList.add("hidden");
  syncTopbarCopyToggle();
}

function showDashboard() {
  currentView = "dashboard";
  previousMainView = "dashboard";
  setBodyView();
  authView.classList.add("hidden");
  plannerView.classList.add("hidden");
  clockView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  applyActivePreferences();
  if (isXuniThemeActive()) {
    setXuniTopbarCollapsed(true);
  }
  renderHeader();
  renderSchedule();
  syncBoardSwitchState();
  renderGoals();
  renderSuggestions();
  showCompanion();
  updateCompanionState("guiding");
  syncTopbarCopyToggle();
}

function showPlannerView() {
  currentView = "planner";
  previousMainView = "planner";
  setBodyView();
  authView.classList.add("hidden");
  dashboardView.classList.add("hidden");
  clockView.classList.add("hidden");
  plannerView.classList.remove("hidden");
  applyActivePreferences();
  renderPlannerHeader();
  renderPlanner();
  showCompanion();
  syncCompanionForCurrentView();
}

function setBodyView() {
  document.body.dataset.view = currentView;
  const showTools = activeUser && currentView !== "auth" && currentView !== "clock";
  const showAmbientAudio = Boolean(activeUser && currentView !== "auth");
  clockLauncher.classList.toggle("hidden", !activeUser || currentView === "clock");
  houseDock.classList.toggle("hidden", !showTools);
  ambientAudioDock.classList.toggle("hidden", !showAmbientAudio);
  if (currentView === "clock") {
    companionDock.classList.add("hidden");
  }
}

function renderHeader() {
  todayDate.textContent = formatDisplayDate(new Date());
  welcomeText.textContent = `${activeUser}，今天继续把目标往前推进一点。`;
}

function renderPlannerHeader() {
  plannerDate.textContent = formatDisplayDate(new Date());
}

function renderSchedule() {
  const data = getUserData();
  const scheduleCards = getScheduleCards(data);

  if (!scheduleCards.length) {
    todayScheduleList.innerHTML = `<div class="empty-state">今天还没有安排，先进入 AI 拆解页，说说你想完成什么。</div>`;
    return;
  }

  todayScheduleList.innerHTML = scheduleCards.map((item) => `
    <article
      class="schedule-card"
      data-schedule-id="${escapeHtml(item.id)}"
      data-schedule-title="${escapeHtml(item.title)}"
      style="--task-card-tint:${escapeHtml(getTaskColorById(item.colorId || data.preferences.defaultTaskColorId).tint)}"
    >
      <p class="schedule-time">${escapeHtml(item.time)}</p>
      <h3 class="schedule-title">${escapeHtml(item.title)}</h3>
      <p class="schedule-meta">${escapeHtml(item.detail)}</p>
    </article>
  `).join("");
}

function renderGoals() {
  const data = getUserData();

  if (!data.goals.length) {
    goalList.innerHTML = `<div class="empty-state">你还没有长线目标。点击右下角守星人，先聊一聊，再把草案插入这里。</div>`;
    return;
  }

  if (currentGoalView === "timeline") {
    goalList.innerHTML = renderTimelineGoals(data.goals);
  } else if (currentGoalView === "summit") {
    goalList.innerHTML = renderSummitGoals(data.goals);
  } else {
    goalList.innerHTML = data.goals.map(renderGoalCard).join("");
  }

  bindTaskToggleEvents();
}

function renderGoalCard(goal) {
  const total = goal.tasks.length;
  const done = goal.tasks.filter((task) => isGoalTaskComplete(task)).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return `
    <article class="goal-card ${armedGoalDeleteId === goal.id ? "is-delete-armed" : ""}" data-goal-card data-goal-id="${goal.id}">
      <h3 class="goal-title">${escapeHtml(goal.title)}</h3>
      <p class="goal-meta">预计完成时间：${escapeHtml(goal.deadline)} · 完成 ${done}/${total}</p>
      <div class="goal-progress" aria-label="进度 ${progress}%">
        <div class="goal-progress-bar" style="width:${progress}%"></div>
      </div>
      <div class="task-checklist">${renderTaskChecklist(goal)}</div>
      ${renderGoalDeleteAction(goal.id)}
    </article>
  `;
}

function renderTimelineGoals(goals) {
  return `
    <div class="timeline-board">
      ${goals.map((goal) => {
        const total = goal.tasks.length;
        const done = goal.tasks.filter((task) => isGoalTaskComplete(task)).length;
        return `
          <article class="timeline-goal-card ${armedGoalDeleteId === goal.id ? "is-delete-armed" : ""}" data-goal-card data-goal-id="${goal.id}">
            <div class="timeline-goal-head">
              <div>
                <h3 class="goal-title">${escapeHtml(goal.title)}</h3>
                <p class="goal-meta">计划终点：${escapeHtml(goal.deadline)}</p>
              </div>
              <span class="timeline-progress-tag">${done}/${total}</span>
            </div>
            <div class="timeline-track">
              ${goal.tasks.map((task, index) => `
                <div class="timeline-node ${isGoalTaskComplete(task) ? "done" : ""}">
                  <span class="timeline-dot">${index + 1}</span>
                  <div class="timeline-copy">
                    <strong>${escapeHtml(task.title)}</strong>
                    <small>${isGoalTaskComplete(task) ? "这一步已经落地" : "这是当前等待推进的一站"}</small>
                  </div>
                </div>
              `).join("")}
            </div>
            <div class="timeline-checklist">${renderTaskChecklist(goal)}</div>
            ${renderGoalDeleteAction(goal.id)}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderSummitGoals(goals) {
  return `
    <div class="summit-board">
      ${goals.map((goal) => {
        const total = goal.tasks.length;
        const done = goal.tasks.filter((task) => isGoalTaskComplete(task)).length;
        const progressRatio = total ? done / total : 0;
        const climberLeft = 20 + (progressRatio * 54);
        const climberBottom = 18 + (progressRatio * 48);

        return `
          <article class="summit-card ${armedGoalDeleteId === goal.id ? "is-delete-armed" : ""}" data-goal-card data-goal-id="${goal.id}">
            <div class="summit-scene">
              <div class="summit-sky"></div>
              <div class="summit-mountain"></div>
              <div class="summit-lighthouse">
                <span class="summit-lighthouse-top"></span>
                <span class="summit-lighthouse-beam"></span>
              </div>
              <div class="summit-climber" style="left:${climberLeft}%; bottom:${climberBottom}%;">
                <span class="summit-climber-head"></span>
                <span class="summit-climber-body"></span>
              </div>
              ${goal.tasks.map((task, index) => {
                const left = 18 + ((index + 1) / (goal.tasks.length + 1)) * 60;
                const bottom = 15 + ((index + 1) / (goal.tasks.length + 1)) * 50;
                return `
                  <div class="summit-camp ${isGoalTaskComplete(task) ? "done" : ""}" style="left:${left}%; bottom:${bottom}%;">
                    <span class="summit-camp-dot"></span>
                  </div>
                `;
              }).join("")}
            </div>
            <div class="summit-meta">
              <div class="summit-meta-head">
                <div>
                  <h3 class="goal-title">${escapeHtml(goal.title)}</h3>
                  <p class="goal-meta">灯塔日期：${escapeHtml(goal.deadline)} · 完成 ${done}/${total}</p>
                </div>
                <span class="timeline-progress-tag">${Math.round(progressRatio * 100)}%</span>
              </div>
              <div class="summit-task-list">${renderTaskChecklist(goal)}</div>
            </div>
            ${renderGoalDeleteAction(goal.id)}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderTaskChecklist(goal) {
  return goal.tasks.map((task) => `
    <label class="task-row ${isGoalTaskComplete(task) ? "done" : ""}">
      <input type="checkbox" data-goal-id="${goal.id}" data-task-id="${task.id}" ${isGoalTaskCheckedForToday(task) ? "checked" : ""}>
      <span>${escapeHtml(formatGoalTaskLabel(task))}</span>
    </label>
  `).join("");
}

function renderGoalDeleteAction(goalId) {
  return `
    <div class="goal-delete-action">
      <span class="goal-delete-hint">双击后可删除这个计划</span>
      <button class="goal-delete-btn" type="button" data-delete-goal-id="${goalId}">删除这个计划</button>
    </div>
  `;
}

function bindTaskToggleEvents() {
  goalList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", handleTaskToggle);
  });
}

function handleTaskToggle(event) {
  const goalId = event.target.dataset.goalId;
  const taskId = event.target.dataset.taskId;
  const data = getUserData();
  const goal = data.goals.find((item) => item.id === goalId);
  const task = goal?.tasks.find((item) => item.id === taskId);

  if (!goal || !task) {
    return;
  }

  if (task.repeat === "daily") {
    const today = getTodayDateKey();
    const completedDates = Array.isArray(task.completedDates) ? [...task.completedDates] : [];
    const hasToday = completedDates.includes(today);

    if (event.target.checked && !hasToday) {
      completedDates.push(today);
    }

    if (!event.target.checked && hasToday) {
      task.completedDates = completedDates.filter((date) => date !== today);
    } else {
      task.completedDates = completedDates;
    }

    task.done = isGoalTaskComplete(task);
  } else {
    task.done = event.target.checked;
  }

  updateUserData(data);
  renderSchedule();
  renderGoals();
  renderSuggestions();
}

function handleGoalCardDoubleClick(event) {
  const card = event.target.closest("[data-goal-card]");
  if (!card || event.target.closest("input, button, label")) {
    return;
  }

  const goalId = card.dataset.goalId || "";
  armedGoalDeleteId = armedGoalDeleteId === goalId ? "" : goalId;
  renderGoals();
}

function handleGoalListClick(event) {
  const deleteButton = event.target.closest("[data-delete-goal-id]");
  if (deleteButton) {
    deleteGoalById(deleteButton.dataset.deleteGoalId || "");
    return;
  }

  if (!event.target.closest("[data-goal-card]") && armedGoalDeleteId) {
    armedGoalDeleteId = "";
    renderGoals();
  }
}

function deleteGoalById(goalId) {
  if (!goalId) {
    return;
  }

  const data = getUserData();
  const goal = Array.isArray(data.goals) ? data.goals.find((item) => item.id === goalId) : null;
  if (!goal) {
    return;
  }

  data.goals = data.goals.filter((item) => item.id !== goalId);
  data.schedule = (Array.isArray(data.schedule) ? data.schedule : []).filter((item) => (
    !String(item?.detail || "").includes(goal.title)
  ));

  if (typeof data.clockFocusTaskId === "string" && data.clockFocusTaskId.startsWith(`goal:${goalId}:`)) {
    delete data.clockFocusTaskId;
  }

  armedGoalDeleteId = "";
  updateUserData(data);
  renderSchedule();
  renderGoals();
  renderSuggestions();
  renderClockView();
}

function renderSuggestions() {
  const suggestions = buildSuggestions(getUserData());

  if (!suggestions.length) {
    aiSuggestionList.innerHTML = `<div class="empty-state">现在没有待推进建议。你可以再进入 AI 拆解页生成新的计划。</div>`;
    return;
  }

  aiSuggestionList.innerHTML = suggestions.map((item) => `
    <article class="suggestion-card">
      <h3 class="suggestion-title">${escapeHtml(item.title)}</h3>
      <p class="suggestion-meta">${escapeHtml(item.reason)}</p>
    </article>
  `).join("");
}

function getTodayDateKey() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function countUniqueDates(dates) {
  return Array.isArray(dates) ? new Set(dates.filter(Boolean)).size : 0;
}

function parseChineseNumberToken(token) {
  const normalized = String(token || "").trim();
  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  const directMap = {
    "半": 0.5,
    "一": 1,
    "二": 2,
    "两": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10
  };

  if (directMap[normalized] != null) {
    return directMap[normalized];
  }

  const tenMatch = normalized.match(/^(十|[一二两三四五六七八九]十|十[一二三四五六七八九]|[一二两三四五六七八九]十[一二三四五六七八九])$/);
  if (!tenMatch) {
    return null;
  }

  if (normalized === "十") {
    return 10;
  }

  if (normalized.startsWith("十")) {
    return 10 + (directMap[normalized.slice(1)] || 0);
  }

  if (normalized.endsWith("十")) {
    return (directMap[normalized[0]] || 0) * 10;
  }

  return ((directMap[normalized[0]] || 0) * 10) + (directMap[normalized[2]] || 0);
}

function parseRecurringTaskDurationDays(taskTitle) {
  const normalized = String(taskTitle || "");
  if (!normalized) {
    return null;
  }

  const dayMatch = normalized.match(/(?:用|在|共|连续|坚持)?\s*(\d+|[一二两三四五六七八九十]+)\s*(?:天|日)(?:内|完成|集中|冲刺|准备)?/u);
  if (dayMatch) {
    const dayCount = parseChineseNumberToken(dayMatch[1]);
    if (Number.isFinite(dayCount) && dayCount > 0) {
      return Math.round(dayCount);
    }
  }

  const weekMatch = normalized.match(/(?:用|在|共|连续|坚持)?\s*(\d+|[一二两三四五六七八九十]+)\s*周(?:内|完成|集中|冲刺|准备)?/u);
  if (weekMatch) {
    const weekCount = parseChineseNumberToken(weekMatch[1]);
    if (Number.isFinite(weekCount) && weekCount > 0) {
      return Math.round(weekCount * 7);
    }
  }

  return null;
}

function getGoalTaskTargetDays(task, goalDeadline) {
  const explicitDurationDays = parseRecurringTaskDurationDays(task?.title || task);
  if (Number.isFinite(explicitDurationDays) && explicitDurationDays > 0) {
    return clamp(explicitDurationDays, 1, 30);
  }

  if (typeof task?.targetDays === "number" && task.targetDays > 0) {
    return task.targetDays;
  }

  const deadline = String(goalDeadline || "");
  const match = deadline.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const target = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const diffDays = Math.max(1, Math.ceil((target - new Date()) / 86400000));
    return clamp(diffDays, 1, 30);
  }

  return 7;
}

function isGoalTaskComplete(task) {
  if (task?.repeat === "daily") {
    return countUniqueDates(task.completedDates) >= (task.targetDays || 7);
  }

  return Boolean(task?.done);
}

function isGoalTaskCheckedForToday(task) {
  if (task?.repeat === "daily") {
    return Array.isArray(task.completedDates) && task.completedDates.includes(getTodayDateKey());
  }

  return Boolean(task?.done);
}

function formatGoalTaskLabel(task) {
  if (task?.repeat === "daily") {
    const todayDone = isGoalTaskCheckedForToday(task);
    const doneCount = countUniqueDates(task.completedDates);
    const totalDays = task.targetDays || 7;
    return `${task.title}（${todayDone ? "今日已完成" : `每日任务 ${doneCount}/${totalDays}` }）`;
  }

  return task?.title || "";
}

function parseGoalDeadlineDays(goalDeadline) {
  const deadline = String(goalDeadline || "");
  const match = deadline.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const target = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Math.max(1, Math.ceil((target - new Date()) / 86400000));
}

function isRecurringTaskTitle(title) {
  const normalized = String(title || "");
  return /(?:每天|每日|打卡|坚持|长期|每天都|每天固定|每日固定|每晚|每天晚上|每天早上|每周)/u.test(normalized);
}

function buildGoalTask(taskTitle, goalDeadline) {
  const repeat = isRecurringTaskTitle(taskTitle) ? "daily" : null;
  const targetDays = repeat === "daily"
    ? getGoalTaskTargetDays({ title: taskTitle }, goalDeadline)
    : null;

  return {
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: taskTitle,
    done: false,
    repeat,
    targetDays,
    completedDates: repeat === "daily" ? [] : null
  };
}

function prioritizeGoalTasks(tasks) {
  const normalizedTasks = Array.isArray(tasks) ? [...tasks] : [];
  return normalizedTasks.sort((left, right) => {
    const leftRecurring = left?.repeat === "daily" ? 1 : 0;
    const rightRecurring = right?.repeat === "daily" ? 1 : 0;
    return leftRecurring - rightRecurring;
  });
}

function getScheduleCards(data) {
  const baseSchedule = Array.isArray(data?.schedule) ? data.schedule : [];
  const derivedDailyCards = [];

  (Array.isArray(data?.goals) ? data.goals : []).forEach((goal) => {
    (Array.isArray(goal.tasks) ? goal.tasks : []).forEach((task, index) => {
      if (task?.repeat !== "daily" || isGoalTaskComplete(task)) {
        return;
      }

      derivedDailyCards.push({
        id: `derived_${goal.id}_${task.id}`,
        time: "今日习惯",
        title: formatGoalTaskLabel(task),
        detail: `来自目标「${goal.title}」的每日任务，${isGoalTaskCheckedForToday(task) ? "今天已完成" : "今天还要补上"}。`,
        colorId: baseSchedule[index % (baseSchedule.length || 1)]?.colorId || data.preferences.defaultTaskColorId
      });
    });
  });

  return [...derivedDailyCards, ...baseSchedule];
}

function normalizeGoalTask(task, goalDeadline) {
  const normalizedTask = task && typeof task === "object"
    ? { ...task }
    : buildGoalTask(String(task || ""), goalDeadline);

  normalizedTask.id = normalizedTask.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  normalizedTask.title = String(normalizedTask.title || "");
  normalizedTask.repeat = normalizedTask.repeat === "daily" || isRecurringTaskTitle(normalizedTask.title) ? "daily" : null;
  normalizedTask.targetDays = normalizedTask.repeat === "daily"
    ? getGoalTaskTargetDays(normalizedTask, goalDeadline)
    : null;
  normalizedTask.completedDates = normalizedTask.repeat === "daily"
    ? (Array.isArray(normalizedTask.completedDates) ? [...new Set(normalizedTask.completedDates.filter(Boolean))] : [])
    : null;
  normalizedTask.done = isGoalTaskComplete(normalizedTask);
  return normalizedTask;
}

function normalizeGoal(goal) {
  const title = String(goal?.title || "");
  const deadline = String(goal?.deadline || "");
  const tasks = Array.isArray(goal?.tasks)
    ? goal.tasks.map((task) => normalizeGoalTask(task, deadline))
    : [];

  return {
    id: goal?.id || `goal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    deadline,
    tasks
  };
}

function legacyRenderPlannerV1() {
  const data = getUserData();
  const draft = data.plannerDraft;
  const companion = getActiveCompanion();

  plannerChatList.innerHTML = data.plannerHistory.map((message) => `
    <article class="chat-message ${message.role}">
      ${message.role === "assistant" ? renderAssistantAvatar() : renderUserAvatar()}
      <div class="chat-content">
        <span class="chat-role">${message.role === "assistant" ? escapeHtml(companion.name) : escapeHtml(activeUser)}</span>
        <div class="chat-bubble">${formatMultilineText(message.text)}</div>
      </div>
    </article>
  `).join("");

  if (!draft) {
    plannerDraftView.innerHTML = `
      <div class="planner-empty">
        把你的比赛、考试、项目、生活目标直接说给 AI。<br>
        它会先拆成可执行步骤，再问你是否插入首页看板。
      </div>
    `;
  } else {
    plannerDraftView.innerHTML = `
      <article class="draft-card">
        <h3 class="draft-title">${escapeHtml(draft.title)}</h3>
        <p class="draft-meta">预计完成时间：${escapeHtml(draft.deadline)}</p>
        <p class="draft-rationale">${escapeHtml(draft.rationale)}</p>
        <div class="draft-task-list">
          ${draft.tasks.map((task, index) => `
            <div class="draft-task-row">${index + 1}. ${escapeHtml(task)}</div>
          `).join("")}
        </div>
        <div class="draft-actions">
          <button id="insertDraftBtn" class="primary-btn" type="button" ${plannerRequestPending ? "disabled" : ""}>插入看板</button>
          <button id="reuseDraftBtn" class="secondary-btn" type="button" ${plannerRequestPending ? "disabled" : ""}>再细化一层</button>
        </div>
      </article>
    `;

    document.getElementById("insertDraftBtn").addEventListener("click", insertDraftIntoBoard);
    document.getElementById("reuseDraftBtn").addEventListener("click", refineCurrentDraft);
  }

  scrollPlannerChatToLatest();
}

function getPlannerLoadingMessage() {
  return "我在先整理你的目标、时间投入和当前状态，马上继续。";
}

function isGreetingOnlyPrompt(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return /^(?:你好|您好|嗨|hi|hello|哈喽|在吗|有人吗|hello there)[!！。.?？~～ ]*$/u.test(normalized);
}

function buildGreetingPromptResponse() {
  return {
    mode: "ask",
    reply: "我在。你直接告诉我你现在想完成什么，我会先判断信息够不够；如果不够，我先追问关键细节，再给你计划。",
    questions: [
      "你现在最想解决的是考试复习、课程作业、编程项目，还是长期提升？",
      "这件事最晚什么时候要推进到什么程度？",
      "你现在大概做到哪一步了？"
    ],
    draft: null
  };
}

function getPlannerMessagesForRender(history) {
  const messages = Array.isArray(history) ? [...history] : [];
  if (plannerRequestPending) {
    messages.push({
      role: "assistant",
      text: `${getPlannerLoadingMessage()}\n\n这一步会先判断信息是否足够，如果不够，我会先问你几个关键问题。`,
      pending: true
    });
  }
  return messages;
}

function scrollPlannerChatToLatest() {
  if (!plannerChatList) {
    return;
  }

  window.requestAnimationFrame(() => {
    plannerChatList.scrollTop = plannerChatList.scrollHeight;
    const latestMessage = plannerChatList.lastElementChild;
    if (latestMessage instanceof HTMLElement) {
      latestMessage.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  });
}

function buildPresetPlannerResponse(prompt) {
  if (/(英语|四级|六级|雅思|托福)/.test(prompt) && /(考试|复习|备考)/.test(prompt)) {
    const questions = [
      "这次英语考试具体是哪一种？比如四级、六级、雅思、托福，或者学校自己的课程考试。",
      "你的考试时间或目标出分时间是什么时候？",
      "你现在最薄弱的是哪个模块？比如听力、阅读、写作、翻译，还是词汇和语法。",
      "你目前的基础大概在哪个水平？比如最近一次分数、做题正确率，或者你自己的主观判断。",
      "你接下来每天或每周大概能拿出多少时间复习？更适合整块专注，还是碎片时间推进。"
    ];

    return {
      mode: "ask",
      reply: `我先把你的英语备考情况摸清，再给你出更贴合的计划。\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`,
      questions,
      draft: null
    };
  }

  return null;
}

function legacyDetectPlannerCategoryV1(text) {
  const normalized = String(text || "").toLowerCase();
  const score = (groups) => groups.reduce((count, keywords) => count + (hasAny(normalized, keywords) ? 1 : 0), 0);
  const scores = {
    exam: score([
      ["英语", "考试", "复习", "备考", "四级", "六级", "雅思", "托福", "期末", "考"],
      ["数学", "高数", "线代", "线性代数", "概率", "概率论"]
    ]),
    demo: score([
      ["demo", "app", "pwa"],
      ["网页", "网站", "原型", "答辩"],
      ["比赛", "项目"]
    ]),
    coursework: score([
      ["作业", "课程"],
      ["论文", "报告", "实验报告"],
      ["pre", "ppt", "汇报", "评分标准", "题目"]
    ]),
    longterm: score([
      ["长期", "这学期", "这个学期"],
      ["习惯", "养成", "坚持"],
      ["目标", "计划", "提升"],
      ["每天", "学习"]
    ])
  };
  const ranked = Object.entries(scores).sort((left, right) => right[1] - left[1]);
  return ranked[0][1] > 0 ? ranked[0][0] : "general";
}

function buildPlannerConversationText(history, prompt) {
  const historyText = Array.isArray(history)
    ? history.map((message) => String(message?.text || "")).join("\n")
    : "";
  return `${historyText}\n${prompt}`.trim();
}

function hasExplicitTimeBudget(text) {
  const normalized = String(text || "");
  return /(?:(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a\u51e0])\s*(?:\u4e2a)?(?:\u5c0f\u65f6|\u5206\u949f|\u5206|\u6b21|h\b|hour|hours|min|mins|minute|minutes)|\u534a\u5c0f\u65f6|\u534a\u5929|\u4e00\u5c0f\u65f6|\u4e24\u5c0f\u65f6|\u4e00\u6574\u665a|\u6bcf\u5468\s*(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341])\s*\u6b21)/iu.test(normalized);
}

function hasPreferredStudySlot(text) {
  const normalized = String(text || "");
  return /(?:\u65e9\u4e0a|\u4e0a\u5348|\u4e2d\u5348|\u4e0b\u5348|\u508d\u665a|\u665a\u4e0a|\u7761\u524d|\u5348\u4f11|\u5468\u672b|\u901a\u52e4).{0,10}(?:\u5b66|\u590d\u4e60|\u80cc|\u505a|\u7ec3|\u5b89\u6392|\u5f00\u59cb|\u63a8\u8fdb|\u6295\u5165|\u7a7a\u51fa|\u56fa\u5b9a|\u9002\u5408|\u6548\u7387)/u.test(normalized)
    || /(?:\u56fa\u5b9a|\u901a\u5e38|\u4e00\u822c|\u4e60\u60ef).{0,10}(?:\u65e9\u4e0a|\u4e0a\u5348|\u4e2d\u5348|\u4e0b\u5348|\u508d\u665a|\u665a\u4e0a|\u7761\u524d|\u5468\u672b)/u.test(normalized);
}

function hasMinimumAction(text) {
  const normalized = String(text || "");
  return /(?:\u4fdd\u5e95|\u6700\u4f4e|\u81f3\u5c11|\u54ea\u6015|\u5c31\u7b97).{0,12}(?:\d+|[\u4e00\u4e8c\u4e24\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u534a])\s*(?:\u4e2a)?(?:\u5206\u949f|\u5c0f\u65f6|\u9875|\u7bc7|\u9053|\u7ec4|\u8f6e|\u4e2a|\u5355\u8bcd)/u.test(normalized);
}

function formatDateLabel(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inferRelativeDeadline(text) {
  const normalized = String(text || "");
  const now = new Date();
  const target = new Date(now);
  const weekdayMap = {
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "日": 0,
    "天": 0
  };

  if (/今天/.test(normalized)) {
    return formatDateLabel(target);
  }
  if (/明天/.test(normalized)) {
    target.setDate(target.getDate() + 1);
    return formatDateLabel(target);
  }

  const dayMatch = normalized.match(/(\d+)\s*天(?:后|内)?/);
  if (dayMatch) {
    target.setDate(target.getDate() + Number(dayMatch[1]));
    return formatDateLabel(target);
  }

  const weekMatch = normalized.match(/(\d+)\s*周(?:后|内)?/);
  if (weekMatch) {
    target.setDate(target.getDate() + Number(weekMatch[1]) * 7);
    return formatDateLabel(target);
  }

  const nextWeekdayMatch = normalized.match(/下周([一二三四五六日天])/);
  if (nextWeekdayMatch) {
    const currentWeekday = now.getDay();
    const targetWeekday = weekdayMap[nextWeekdayMatch[1]];
    const offset = ((targetWeekday - currentWeekday + 7) % 7) + 7;
    target.setDate(target.getDate() + offset);
    return formatDateLabel(target);
  }

  const weekdayMatch = normalized.match(/(?:周|星期)([一二三四五六日天])/);
  if (weekdayMatch) {
    const currentWeekday = now.getDay();
    const targetWeekday = weekdayMap[weekdayMatch[1]];
    let offset = (targetWeekday - currentWeekday + 7) % 7;
    if (offset === 0) {
      offset = 7;
    }
    target.setDate(target.getDate() + offset);
    return formatDateLabel(target);
  }

  if (/下个月/.test(normalized)) {
    return "下个月";
  }
  if (/下周/.test(normalized)) {
    return "下周";
  }
  if (/期末/.test(normalized)) {
    return "期末前";
  }
  return "待确认";
}

function extractPlannerSignals(text, category) {
  const normalized = String(text || "");
  return {
    goalKnown: normalized.length >= 6,
    deliverableKnown: /(交付|提交|网页|网站|页面|原型|代码|PPT|答辩|报告|论文|作品|Demo|demo|考试|分数|通过)/u.test(normalized),
    deadlineKnown: /(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}日?)|(\d+\s*(天|周|个月|月))|(今天|明天|后天|这周|下周([一二三四五六日天])?|(?:周|星期)[一二三四五六日天]|本月|这个月|期末|月底|暑假前|开学前)/u.test(normalized),
    progressKnown: /(还没开始|刚开始|做到|做完|完成了|已经|一半|初稿|资料|草图|提纲|刷过|基础|水平|进度|正确率|模拟|\d+\s*分)/u.test(normalized),
    timeBudgetKnown: hasExplicitTimeBudget(normalized),
    studySlotKnown: hasPreferredStudySlot(normalized),
    minimumActionKnown: hasMinimumAction(normalized),
    constraintsKnown: /(限制|打断|专注|作息|课程|课多|白天课多|社团|实习|队友|设备|效率|空档|晚上效率|短视频|只能|没法|不方便)/u.test(normalized),
    weakAreaKnown: /(听力|阅读|写作|翻译|口语|词汇|语法|薄弱|弱项|模块)/u.test(normalized),
    examTypeKnown: /(四级|六级|雅思|托福|课程考试|期末考试|英语考试)/u.test(normalized),
    materialKnown: /(要求|题目|材料|课程大纲|评分标准|老师要求|资料|参考文献|题库)/u.test(normalized),
    teamKnown: /(队友|分工|合作|组员|一个人做|自己做|单独做|独自做)/u.test(normalized)
  };
}

function legacyBuildGuidedQuestionsV1(category, signals) {
  const questions = [];

  const push = (question) => {
    if (questions.length < 3) {
      questions.push(question);
    }
  };

  if (!signals.deadlineKnown) {
    push("这件事最晚什么时候要完成？如果没有精确日期，也可以告诉我是这周、这个月，还是本学期内。");
  }

  if (!signals.progressKnown) {
    push("你现在做到哪一步了？比如刚开始、已经收集资料、做了一半，还是已经有初稿/代码/笔记。");
  }

  if (!signals.timeBudgetKnown) {
    push("你接下来每天或每周大概能稳定投入多少时间？更适合整块专注，还是碎片时间推进。");
  }

  if (category === "exam") {
    if (!signals.examTypeKnown) {
      push("这次具体是哪一种考试？比如四级、六级、雅思、托福，或者学校课程考试。");
    }
    if (!signals.weakAreaKnown) {
      push("你现在最薄弱的是哪个模块？比如听力、阅读、写作、翻译，还是词汇和语法。");
    }
    if (!signals.timeBudgetKnown && questions.length < 3) {
      push("你希望达到什么结果？比如通过、冲分，还是把某个模块先提上来。");
    }
  } else if (category === "demo") {
    if (!signals.deliverableKnown) {
      push("这次最终要交付什么？是可运行页面、演示原型、答辩 PPT，还是项目说明文档。");
    }
    if (!signals.teamKnown && questions.length < 3) {
      push("这是你一个人推进，还是有队友分工？如果有分工，你主要负责哪一块。");
    }
    if (!signals.constraintsKnown && questions.length < 3) {
      push("现在最大的限制是什么？比如课程多、时间碎、容易被打断，还是技术上有卡点。");
    }
  } else if (category === "coursework") {
    if (!signals.deliverableKnown) {
      push("这次要交付什么？比如论文、报告、PPT、代码，或者课堂展示。");
    }
    if (!signals.materialKnown && questions.length < 3) {
      push("老师给的要求、评分标准或题目材料你现在手里有了吗？缺哪一部分。");
    }
    if (!signals.constraintsKnown && questions.length < 3) {
      push("你最容易卡住的是哪一环？比如选题、查资料、写作、排版，还是展示。");
    }
  } else if (category === "longterm") {
    if (!signals.deliverableKnown) {
      push("你希望先看到什么阶段性结果？比如一周内形成习惯、一个月内完成首轮，还是先稳住某个指标。");
    }
    if (!signals.constraintsKnown && questions.length < 3) {
      push("你现在最容易被什么打断？比如作息不稳、课程挤占、拖延，还是专注时间太短。");
    }
    if (!signals.timeBudgetKnown && questions.length < 3) {
      push("你更适合每天固定推进，还是每周集中推进几次？大概能拿出多少时间。");
    }
  } else {
    if (!signals.deliverableKnown) {
      push("这件事最后要做到什么程度才算完成？最好直接说一个看得见的结果。");
    }
    if (!signals.constraintsKnown && questions.length < 3) {
      push("有没有需要我一起考虑的限制？比如时间碎、资源少、容易分心，或者必须和别人配合。");
    }
  }

  return questions.slice(0, 3);
}

function shouldUseGuidedQuestioning(category, signals) {
  if (category === "exam") {
    return !(signals.examTypeKnown && signals.deadlineKnown && signals.weakAreaKnown && signals.progressKnown && signals.timeBudgetKnown);
  }
  if (category === "demo") {
    return !(signals.deliverableKnown && signals.deadlineKnown && signals.progressKnown && signals.timeBudgetKnown && signals.constraintsKnown);
  }
  if (category === "coursework") {
    return !(signals.deliverableKnown && signals.deadlineKnown && signals.progressKnown && signals.materialKnown && signals.timeBudgetKnown);
  }
  if (category === "longterm") {
    return !(signals.deliverableKnown && signals.progressKnown && signals.timeBudgetKnown && signals.constraintsKnown);
  }
  return !(signals.deliverableKnown && signals.deadlineKnown && signals.progressKnown && signals.timeBudgetKnown);
}

function legacyBuildGuidedPlannerResponseV1(prompt, history) {
  const conversationText = buildPlannerConversationText(history, prompt);
  const category = detectPlannerCategory(conversationText);
  const signals = extractPlannerSignals(conversationText, category);

  if (!shouldUseGuidedQuestioning(category, signals)) {
    return null;
  }

  const questions = buildGuidedQuestions(category, signals);
  if (!questions.length) {
    return null;
  }

  const stageReplyMap = {
    exam: "我先按英语/考试复习的思路把信息补齐，再一步步细化成计划。",
    demo: "我先把交付物、进度和限制摸清，再一步步细化成可演示的推进计划。",
    coursework: "我先把作业要求、当前进度和可投入时间补齐，再一步步细化成可执行安排。",
    longterm: "我先把阶段目标、当前状态和现实限制理顺，再一步步细化成更稳的长期计划。",
    general: "我先补齐最关键的信息，再一步步细化成不飘的计划。"
  };

  return {
    mode: "ask",
    reply: `${stageReplyMap[category] || stageReplyMap.general}\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`,
    questions,
    draft: null
  };
}

function renderPlanner() {
  const data = getUserData();
  const draft = data.plannerDraft;
  const companion = getActiveCompanion();
  const messages = getPlannerMessagesForRender(data.plannerHistory);

  plannerChatList.innerHTML = messages.map((message) => `
    <article class="chat-message ${message.role}${message.pending ? " is-pending" : ""}">
      ${message.role === "assistant" ? renderAssistantAvatar() : renderUserAvatar()}
      <div class="chat-content">
        <span class="chat-role">${message.role === "assistant" ? escapeHtml(companion.name) : escapeHtml(activeUser)}</span>
        <div class="chat-bubble">${formatMultilineText(message.text)}</div>
      </div>
    </article>
  `).join("");

  plannerSubmitBtn.textContent = plannerRequestPending ? "守星人整理中..." : "发送给 AI";

  if (!draft) {
    plannerDraftView.innerHTML = `
      <div class="planner-empty">
        先把你的目标直接告诉守星人，它会先问清你的时间、基础和专注状态，再给出更稳的计划。
      </div>
    `;
  } else {
    plannerDraftView.innerHTML = `
      <article class="draft-card">
        <h3 class="draft-title">${escapeHtml(draft.title)}</h3>
        <p class="draft-meta">预计完成时间：${escapeHtml(draft.deadline)}</p>
        <p class="draft-rationale">${escapeHtml(draft.rationale)}</p>
        <div class="draft-task-list">
          ${draft.tasks.map((task, index) => `
            <div class="draft-task-row">${index + 1}. ${escapeHtml(task)}</div>
          `).join("")}
        </div>
        ${Array.isArray(draft.tips) && draft.tips.length ? `
          <div class="draft-tip-list">
            ${draft.tips.map((tip) => `<p class="draft-tip">小建议：${escapeHtml(tip)}</p>`).join("")}
          </div>
        ` : ""}
        <div class="draft-actions">
          <button id="insertDraftBtn" class="primary-btn" type="button" ${plannerRequestPending ? "disabled" : ""}>插入看板</button>
          <button id="reuseDraftBtn" class="secondary-btn" type="button" ${plannerRequestPending ? "disabled" : ""}>再细化一层</button>
        </div>
      </article>
    `;

    document.getElementById("insertDraftBtn").addEventListener("click", insertDraftIntoBoard);
    document.getElementById("reuseDraftBtn").addEventListener("click", refineCurrentDraft);
  }

  plannerChatList.scrollTop = plannerChatList.scrollHeight;
}

async function legacyHandlePlannerSubmitWithAttachmentsV1(event) {
  event.preventDefault();

  const prompt = plannerInput.value.trim();
  if (!prompt) {
    plannerInput.focus();
    return;
  }

  const data = getUserData();
  data.plannerHistory.push({ role: "user", text: prompt });
  data.plannerDraft = null;
  updateUserData(data);

  plannerInput.value = "";
  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  updateCompanionState("thinking");
  renderPlanner();

  try {
    const result = buildGuidedPlannerResponse(prompt, data.plannerHistory)
      || buildPresetPlannerResponse(prompt)
      || await requestPlannerResponse({
      prompt,
      history: data.plannerHistory,
      currentDraft: null,
      refine: false
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    latestData.plannerDraft = result.mode === "draft"
      ? attachSourcePrompt(result.draft, prompt)
      : null;
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const guidedAsk = buildGuidedPlannerResponse(prompt, data.plannerHistory);
    const reason = error instanceof Error && error.message
      ? `真实模型暂时不可用：${error.message}`
      : "真实模型暂时不可用。";
    latestData.plannerDraft = guidedAsk ? null : buildDraftFromPrompt(prompt, false);
    latestData.plannerHistory.push({
      role: "assistant",
      text: `${reason}\n\n我先用本地兜底逻辑为你整理出一版可执行草案，先别让流程断掉。`
    });
    updateUserData(latestData);
    updateCompanionState("speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
    if (currentView === "planner") {
      plannerInput.focus();
    }
  }
}

async function legacyHandlePlannerSubmitWithAttachmentsV2(event) {
  event.preventDefault();

  const prompt = plannerInput.value.trim();
  const attachments = plannerPendingAttachments.map((attachment) => ({ ...attachment }));
  const effectivePrompt = prompt || (attachments.length ? "请结合我上传的内容，帮我整理计划。" : "");
  if (!effectivePrompt) {
    plannerInput.focus();
    return;
  }

  const historyText = buildPlannerUserMessageText(prompt, attachments);
  const data = getUserData();
  data.plannerHistory.push({ role: "user", text: historyText });
  data.plannerDraft = null;
  updateUserData(data);

  plannerInput.value = "";
  plannerPendingAttachments = [];
  plannerAttachmentStatusMessage = "";
  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  if (plannerAttachmentsInput) {
    plannerAttachmentsInput.disabled = true;
  }
  if (plannerAttachmentClearBtn) {
    plannerAttachmentClearBtn.disabled = true;
  }
  updateCompanionState("thinking");
  renderPlanner();
  renderPlannerAttachmentList();

  try {
    const result = await requestPlannerResponse({
      prompt: effectivePrompt,
      history: data.plannerHistory,
      currentDraft: null,
      refine: false,
      attachments
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    latestData.plannerDraft = result.mode === "draft"
      ? attachSourcePrompt(result.draft, effectivePrompt)
      : null;
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const guidedAsk = (isGreetingOnlyPrompt(effectivePrompt) ? buildGreetingPromptResponse() : null)
      || buildGuidedPlannerResponse(effectivePrompt, data.plannerHistory)
      || buildPresetPlannerResponse(effectivePrompt);
    const draft = guidedAsk ? null : buildDraftFromPrompt(effectivePrompt, false);
    const reason = buildPlannerFallbackNotice(error);

    latestData.plannerDraft = draft;
    latestData.plannerHistory.push({
      role: "assistant",
      text: guidedAsk
        ? `${reason}\n\n${guidedAsk.reply}`
        : `${reason}\n\n我先用本地规则为你整理出一版可执行草案，先别让流程断掉。`
    });
    updateUserData(latestData);
    updateCompanionState(guidedAsk ? "listening" : "speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
    renderPlannerAttachmentList();
    if (currentView === "planner") {
      plannerInput.focus();
    }
  }
}

function formatAttachmentBytes(size) {
  if (!Number.isFinite(size) || size <= 0) {
    return "0 B";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function legacyGetPlannerAttachmentBadgeV1(attachment) {
  if (attachment.kind === "image") {
    return "图片";
  }

  if (attachment.kind === "pdf") {
    return "PDF";
  }

  return "文本";
}

function renderPlannerAttachmentList() {
  if (!plannerAttachmentList || !plannerAttachmentClearBtn) {
    return;
  }

  const items = plannerPendingAttachments.map((attachment, index) => `
    <div class="planner-attachment-item">
      <div class="planner-attachment-copy">
        <strong class="planner-attachment-name">${escapeHtml(attachment.name)}</strong>
        <span class="planner-attachment-meta">${getPlannerAttachmentBadge(attachment)} · ${formatAttachmentBytes(attachment.size)}</span>
      </div>
      <button class="ghost-btn ghost-btn-dark planner-attachment-remove" type="button" data-attachment-index="${index}" ${plannerRequestPending ? "disabled" : ""}>移除</button>
    </div>
  `);

  if (plannerAttachmentStatusMessage) {
    items.unshift(`<p class="planner-attachment-status">${escapeHtml(plannerAttachmentStatusMessage)}</p>`);
  }

  plannerAttachmentList.innerHTML = items.join("");
  plannerAttachmentClearBtn.disabled = plannerRequestPending || !plannerPendingAttachments.length;
  if (plannerAttachmentsInput) {
    plannerAttachmentsInput.disabled = plannerRequestPending || plannerPendingAttachments.length >= MAX_PLANNER_ATTACHMENTS;
  }
}

function clearPlannerPendingAttachments() {
  plannerPendingAttachments = [];
  plannerAttachmentStatusMessage = "";
  if (plannerAttachmentsInput) {
    plannerAttachmentsInput.value = "";
  }
  renderPlannerAttachmentList();
}

function handlePlannerAttachmentListClick(event) {
  const button = event.target instanceof HTMLElement
    ? event.target.closest("[data-attachment-index]")
    : null;
  if (!button || plannerRequestPending) {
    return;
  }

  const index = Number(button.getAttribute("data-attachment-index"));
  if (!Number.isInteger(index) || index < 0 || index >= plannerPendingAttachments.length) {
    return;
  }

  plannerPendingAttachments.splice(index, 1);
  plannerAttachmentStatusMessage = "";
  renderPlannerAttachmentList();
}

function isTextLikeAttachment(file) {
  const lowerName = String(file?.name || "").toLowerCase();
  const lowerType = String(file?.type || "").toLowerCase();
  return lowerType.startsWith("text/")
    || ["application/json", "application/xml", "text/csv"].includes(lowerType)
    || [".txt", ".md", ".json", ".csv"].some((ext) => lowerName.endsWith(ext));
}

function isDocxAttachment(file) {
  const lowerName = String(file?.name || "").toLowerCase();
  const lowerType = String(file?.type || "").toLowerCase();
  return lowerType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    || lowerName.endsWith(".docx");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error(`无法读取文件《${file.name}》。`));
    reader.readAsDataURL(file);
  });
}

async function preparePlannerAttachment(file) {
  if (!(file instanceof File)) {
    throw new Error("无效文件。");
  }

  if (file.size > MAX_ATTACHMENT_FILE_BYTES) {
    throw new Error(`文件《${file.name}》超过 4 MB，今天先控制在小文件内。`);
  }

  if (String(file.type || "").startsWith("image/")) {
    return {
      kind: "image",
      name: file.name,
      mimeType: file.type || "image/*",
      size: file.size,
      dataUrl: await readFileAsDataUrl(file)
    };
  }

  if ((file.type || "").toLowerCase() === "application/pdf" || String(file.name || "").toLowerCase().endsWith(".pdf")) {
    return {
      kind: "pdf",
      name: file.name,
      mimeType: "application/pdf",
      size: file.size,
      fileData: await readFileAsDataUrl(file)
    };
  }

  if (isDocxAttachment(file)) {
    return {
      kind: "docx",
      name: file.name,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: file.size,
      fileData: await readFileAsDataUrl(file)
    };
  }

  if (isTextLikeAttachment(file)) {
    const text = (await file.text()).trim();
    if (!text) {
      throw new Error(`文件《${file.name}》没有可读取的文本内容。`);
    }

    return {
      kind: "text",
      name: file.name,
      mimeType: file.type || "text/plain",
      size: file.size,
      text: text.slice(0, MAX_TEXT_ATTACHMENT_CHARS)
    };
  }

  throw new Error(`暂不支持《${file.name}》这种文件类型。今天先用图片、PDF、TXT、MD、JSON、CSV。`);
}

async function handlePlannerAttachmentSelection(event) {
  const files = Array.from(event.target?.files || []);
  if (!files.length) {
    return;
  }

  const availableSlots = Math.max(0, MAX_PLANNER_ATTACHMENTS - plannerPendingAttachments.length);
  const pickedFiles = files.slice(0, availableSlots);
  const errors = [];

  for (const file of pickedFiles) {
    try {
      const attachment = await preparePlannerAttachment(file);
      plannerPendingAttachments.push(attachment);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `文件《${file.name}》处理失败。`);
    }
  }

  if (files.length > pickedFiles.length) {
    errors.push(`最多只能附加 ${MAX_PLANNER_ATTACHMENTS} 个文件。`);
  }

  plannerAttachmentStatusMessage = errors.join(" ");
  if (plannerAttachmentsInput) {
    plannerAttachmentsInput.value = "";
  }
  renderPlannerAttachmentList();
}

function legacyBuildPlannerAttachmentSummaryV1(attachments) {
  if (!attachments.length) {
    return "";
  }

  return attachments
    .map((attachment, index) => `${index + 1}. ${getPlannerAttachmentBadge(attachment)}《${attachment.name}》`)
    .join("\n");
}

/*
function buildPlannerUserMessageText(prompt, attachments) {
  const normalizedPrompt = String(prompt || "").trim();
  const summary = buildPlannerAttachmentSummary(attachments);
  if (!summary) {
    return normalizedPrompt;
  }

  const lead = normalizedPrompt || "请结合我上传的内容，帮我整理计划。";
  return `${lead}\n\n[附件]\n${summary}`;
}

async function handlePlannerSubmitWithAttachments(event) {
  event.preventDefault();

  const prompt = plannerInput.value.trim();
  const attachments = plannerPendingAttachments.map((attachment) => ({ ...attachment }));
  const effectivePrompt = prompt || (attachments.length ? "请结合我上传的内容，帮我整理计划。" : "");
  if (!effectivePrompt) {
    plannerInput.focus();
    return;
  }

  const historyText = buildPlannerUserMessageText(prompt, attachments);
  const data = getUserData();
  data.plannerHistory.push({ role: "user", text: historyText });
  data.plannerDraft = null;
  updateUserData(data);

  plannerInput.value = "";
  plannerPendingAttachments = [];
  plannerAttachmentStatusMessage = "";
  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  if (plannerAttachmentsInput) {
    plannerAttachmentsInput.disabled = true;
  }
  if (plannerAttachmentClearBtn) {
    plannerAttachmentClearBtn.disabled = true;
  }
  updateCompanionState("thinking");
  renderPlanner();
  renderPlannerAttachmentList();

  try {
    const result = await requestPlannerResponse({
      prompt: effectivePrompt,
      history: data.plannerHistory,
      currentDraft: null,
      refine: false,
      attachments
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    latestData.plannerDraft = result.mode === "draft"
      ? attachSourcePrompt(result.draft, effectivePrompt)
      : null;
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const guidedAsk = (isGreetingOnlyPrompt(effectivePrompt) ? buildGreetingPromptResponse() : null)
      || buildGuidedPlannerResponse(effectivePrompt, data.plannerHistory)
      || buildPresetPlannerResponse(effectivePrompt);
    const draft = guidedAsk ? null : buildDraftFromPrompt(effectivePrompt, false);
    const reason = buildPlannerFallbackNotice(error);

    latestData.plannerDraft = draft;
    latestData.plannerHistory.push({
      role: "assistant",
      text: guidedAsk
        ? `${reason}\n\n${guidedAsk.reply}`
        : `${reason}\n\n鎴戝厛鐢ㄦ湰鍦拌鍒欎负浣犳暣鐞嗗嚭涓€鐗堝彲鎵ц鑽夋锛屽厛鍒娴佺▼鏂帀銆俙
    });
    updateUserData(latestData);
    updateCompanionState(guidedAsk ? "listening" : "speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
    renderPlannerAttachmentList();
    if (currentView === "planner") {
      plannerInput.focus();
    }
  }
}

*/

function buildPlannerUserMessageText(prompt, attachments) {
  const normalizedPrompt = String(prompt || "").trim();
  const summary = buildPlannerAttachmentSummary(attachments);
  if (!summary) {
    return normalizedPrompt;
  }

  const lead = normalizedPrompt || "请结合我上传的内容，帮我整理计划。";
  return `${lead}\n\n[附件]\n${summary}`;
}

async function handlePlannerSubmitWithAttachments(event) {
  event.preventDefault();

  const prompt = plannerInput.value.trim();
  const attachments = plannerPendingAttachments.map((attachment) => ({ ...attachment }));
  const effectivePrompt = prompt || (attachments.length ? "请结合我上传的内容，帮我整理计划。" : "");
  if (!effectivePrompt) {
    plannerInput.focus();
    return;
  }

  const historyText = buildPlannerUserMessageText(prompt, attachments);
  const data = getUserData();
  data.plannerHistory.push({ role: "user", text: historyText });
  data.plannerDraft = null;
  updateUserData(data);

  plannerInput.value = "";
  plannerPendingAttachments = [];
  plannerAttachmentStatusMessage = "";
  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  if (plannerAttachmentsInput) {
    plannerAttachmentsInput.disabled = true;
  }
  if (plannerAttachmentClearBtn) {
    plannerAttachmentClearBtn.disabled = true;
  }
  updateCompanionState("thinking");
  renderPlanner();
  renderPlannerAttachmentList();

  try {
    const result = await requestPlannerResponse({
      prompt: effectivePrompt,
      history: data.plannerHistory,
      currentDraft: null,
      refine: false,
      attachments
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    latestData.plannerDraft = result.mode === "draft"
      ? attachSourcePrompt(result.draft, effectivePrompt)
      : null;
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const guidedAsk = (isGreetingOnlyPrompt(effectivePrompt) ? buildGreetingPromptResponse() : null)
      || buildGuidedPlannerResponse(effectivePrompt, data.plannerHistory)
      || buildPresetPlannerResponse(effectivePrompt);
    const draft = guidedAsk ? null : buildDraftFromPrompt(effectivePrompt, false);
    const reason = buildPlannerFallbackNotice(error);

    latestData.plannerDraft = draft;
    latestData.plannerHistory.push({
      role: "assistant",
      text: guidedAsk
        ? `${reason}\n\n${guidedAsk.reply}`
        : `${reason}\n\n我先用本地规则为你整理出一版可执行草案，先别让流程断掉。`
    });
    updateUserData(latestData);
    updateCompanionState(guidedAsk ? "listening" : "speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
    renderPlannerAttachmentList();
    if (currentView === "planner") {
      plannerInput.focus();
    }
  }
}

function insertDraftIntoBoard() {
  const data = getUserData();
  const draft = data.plannerDraft;
  if (!draft) {
    return;
  }

  const goal = {
    id: `goal_${Date.now()}`,
    title: draft.title,
    deadline: draft.deadline,
    tasks: prioritizeGoalTasks(draft.tasks.map((task) => buildGoalTask(task, draft.deadline)))
  };

  data.goals.unshift(goal);

  const firstActionTask = goal.tasks[0];

  if (firstActionTask && firstActionTask.repeat !== "daily") {
    data.schedule = [
      createScheduleItem({
        time: "今天优先",
        title: `推进：${goal.tasks[0].title}`,
        detail: `来自目标「${goal.title}」的第一步`,
        colorId: data.preferences.defaultTaskColorId
      }),
      ...data.schedule
    ].slice(0, 6);
  }

  data.plannerHistory.push({
    role: "assistant",
    text: `已经把「${goal.title}」插入首页看板。回到首页后，你会直接看到它出现在长线目标区域。`
  });
  data.plannerDraft = null;

  updateUserData(data);
  showDashboard();
}

async function refineCurrentDraft() {
  const data = getUserData();
  if (!data.plannerDraft) {
    return;
  }

  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  updateCompanionState("thinking");
  renderPlanner();

  try {
    const result = await requestPlannerResponse({
      history: data.plannerHistory,
      currentDraft: data.plannerDraft,
      refine: true
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    if (result.mode === "draft") {
      latestData.plannerDraft = attachSourcePrompt(result.draft, data.plannerDraft.sourcePrompt);
    }
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const reason = error instanceof Error && error.message
      ? `真实模型细化暂时不可用：${error.message}`
      : "真实模型细化暂时不可用。";
    latestData.plannerDraft = buildDraftFromPrompt(data.plannerDraft.sourcePrompt, true);
    latestData.plannerHistory.push({
      role: "assistant",
      text: `${reason}\n\n我先用本地规则把这版计划继续拆细一层。`
    });
    updateUserData(latestData);
    updateCompanionState("speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
  }
}

function legacyBuildDraftFromPromptV1(prompt, detailed) {
  return {
    title: inferTitle(prompt),
    deadline: inferDeadline(prompt),
    rationale: inferRationale(prompt),
    tasks: inferTasks(prompt, detailed),
    sourcePrompt: prompt
  };
}

function inferTips(prompt) {
  const tips = [];

  if (hasAny(prompt, ["考试", "复习", "四级", "英语"])) {
    tips.push("先固定每天同一时段复习，能明显降低重新进入状态的成本。");
  }

  if (hasAny(prompt.toLowerCase(), ["demo", "app", "pwa", "网页", "网站", "比赛", "项目"])) {
    tips.push("先守住最小可演示闭环，再决定哪些视觉细节放到下一轮。");
  }

  tips.push("每天先预留一段不被打断的专注时间，再把碎片时间留给低强度任务。");
  return tips.slice(0, 3);
}

function buildDraftFromPrompt(prompt, detailed) {
  return {
    title: inferTitle(prompt),
    deadline: inferDeadline(prompt),
    rationale: inferRationale(prompt),
    tasks: inferTasks(prompt, detailed),
    tips: inferTips(prompt),
    sourcePrompt: prompt
  };
}

async function requestPlannerResponse({ prompt = "", history = [], currentDraft = null, refine = false, attachments = [] }) {
  const response = await fetch(PLANNER_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      history,
      currentDraft,
      refine,
      attachments
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Planner API request failed.");
  }

  return payload;
}

function attachSourcePrompt(draft, sourcePrompt) {
  return {
    ...draft,
    sourcePrompt
  };
}

function inferTitle(prompt) {
  const cleaned = prompt.replace(/\s+/g, " ").replace(/[。！？!?]/g, "").trim();

  if (hasAny(prompt.toLowerCase(), ["demo", "app", "pwa", "网页", "网站", "项目", "比赛"])) {
    return "产品与网页版本推进";
  }

  if (hasAny(prompt, ["四级", "英语", "考试", "复习"])) {
    return "近期学习与考试准备";
  }

  return cleaned.length > 18 ? `${cleaned.slice(0, 18)}…` : cleaned;
}

function inferDeadline(prompt) {
  const now = new Date();
  const dayMatch = prompt.match(/(\d+)\s*天/);
  const weekMatch = prompt.match(/(\d+)\s*周/);
  const monthMatch = prompt.match(/(\d+)\s*个?月/);
  const target = new Date(now);

  if (/今天/.test(prompt)) {
    return formatIsoDate(target);
  }

  if (/明天/.test(prompt)) {
    target.setDate(target.getDate() + 1);
    return formatIsoDate(target);
  }

  if (dayMatch) {
    target.setDate(target.getDate() + Number(dayMatch[1]));
    return formatIsoDate(target);
  }

  if (weekMatch) {
    target.setDate(target.getDate() + Number(weekMatch[1]) * 7);
    return formatIsoDate(target);
  }

  if (monthMatch) {
    target.setMonth(target.getMonth() + Number(monthMatch[1]));
    return formatIsoDate(target);
  }

  if (hasAny(prompt, ["期末", "考试"])) {
    target.setDate(target.getDate() + 21);
    return formatIsoDate(target);
  }

  if (hasAny(prompt.toLowerCase(), ["demo", "pwa", "app", "网页", "网站", "比赛"])) {
    target.setDate(target.getDate() + 14);
    return formatIsoDate(target);
  }

  target.setDate(target.getDate() + 10);
  return formatIsoDate(target);
}

function inferTasks(prompt, detailed) {
  const text = prompt.toLowerCase();
  let tasks = [];

  if (hasAny(text, ["demo", "app", "pwa", "网页", "网站", "项目", "比赛", "前端"])) {
    tasks = [
      "明确这一轮最小可展示的核心场景和页面顺序",
      "完成登录页、首页与 AI 拆解页的视觉统一",
      "打通页面切换与本地数据存储流程",
      "补齐最关键的一条用户操作闭环",
      "做一次整体走查并修掉影响演示的断点"
    ];
  } else if (hasAny(prompt, ["四级", "英语", "考试", "复习"])) {
    tasks = [
      "梳理考试范围与当前最薄弱的部分",
      "安排每天可完成的小单元练习",
      "加入一轮真题或模拟练习检查节奏",
      "回收错题并形成下一轮复习重点",
      "考前做一次压缩版总复盘"
    ];
  } else {
    tasks = [
      "先明确这件事最终要交付成什么样",
      "拆出 3 到 5 个真正能动手执行的步骤",
      "优先完成第一步并验证方向是否正确",
      "留出一次回看和修正，避免越做越偏"
    ];
  }

  if (!detailed) {
    return tasks;
  }

  return dedupeTasks(tasks.flatMap(splitTaskFurther)).slice(0, 7);
}

function inferRationale(prompt) {
  if (hasAny(prompt.toLowerCase(), ["demo", "app", "pwa", "网页", "网站", "项目", "比赛"])) {
    return "我优先按“能展示、能联通、能顺畅演示”的顺序拆解，这样更适合你当前做产品原型和比赛页面。";
  }

  if (hasAny(prompt, ["四级", "英语", "考试", "复习"])) {
    return "我优先按“范围梳理、日常执行、检测回收”的顺序拆解，这样更符合复习型任务的推进方式。";
  }

  return "我优先把目标拆成能立即动手的步骤，而不是保留抽象大词，这样插入看板后更容易真的开始。";
}

function splitTaskFurther(task) {
  if (task.includes("核心场景")) {
    return [
      "列清这一轮必须展示的 1 到 2 个核心使用场景",
      "确定演示时的页面进入顺序与重点讲述内容"
    ];
  }

  if (task.includes("视觉统一")) {
    return [
      "统一主背景、卡片层次与按钮风格",
      "修正登录页、首页和 AI 页之间的视觉过渡"
    ];
  }

  if (task.includes("页面切换")) {
    return [
      "检查登录后是否能稳定跳转到首页",
      "检查新建目标后是否直接进入 AI 拆解页"
    ];
  }

  if (task.includes("薄弱")) {
    return [
      "列出当前最不熟的 2 到 3 个知识块",
      "先补最影响成绩提升的那一块"
    ];
  }

  if (task.includes("真题") || task.includes("模拟")) {
    return [
      "做一次限时练习检查节奏",
      "把暴露的问题记录成下一轮复习清单"
    ];
  }

  return [task];
}

function legacyBuildSuggestionsV1(data) {
  const suggestions = [];

  data.goals.forEach((goal) => {
    const nextTask = pickSuggestedTask(goal);
    if (!nextTask) {
      return;
    }

    suggestions.push({
      title: `建议优先推进「${nextTask.title}」`,
      reason: `它属于目标「${goal.title}」，是当前最接近落地的一步。`
    });
  });

  return suggestions.slice(0, 4);
}

function getUserData() {
  const dashboardStore = loadJson(STORAGE_KEYS.dashboard, {});
  const currentData = normalizeUserData(dashboardStore[activeUser], activeUser);
  dashboardStore[activeUser] = currentData;
  saveJson(STORAGE_KEYS.dashboard, dashboardStore);
  return currentData;
}

function updateUserData(data) {
  const dashboardStore = loadJson(STORAGE_KEYS.dashboard, {});
  dashboardStore[activeUser] = normalizeUserData(data, activeUser);
  saveJson(STORAGE_KEYS.dashboard, dashboardStore);
}

function createScheduleItem({ time, title, detail, colorId }) {
  return {
    id: `schedule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time,
    title,
    detail,
    colorId: getTaskColorById(colorId || DEFAULT_PREFERENCES.defaultTaskColorId).id
  };
}

function normalizeScheduleItem(item, defaultTaskColorId) {
  return {
    id: item?.id || `schedule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: String(item?.time || ""),
    title: String(item?.title || ""),
    detail: String(item?.detail || ""),
    colorId: getTaskColorById(item?.colorId || defaultTaskColorId).id
  };
}

function legacyNormalizeUserDataV1(data, username) {
  const base = data || createInitialDashboardData(username);
  const preferences = normalizePreferences(base.preferences);
  const schedule = Array.isArray(base.schedule)
    ? base.schedule.map((item) => normalizeScheduleItem(item, preferences.defaultTaskColorId))
    : [];
  return {
    preferences,
    schedule,
    goals: Array.isArray(base.goals) ? base.goals : [],
    plannerHistory: Array.isArray(base.plannerHistory) && base.plannerHistory.length
      ? base.plannerHistory
      : createInitialPlannerHistory(),
    plannerDraft: base.plannerDraft || null
  };
}

function inferSuggestionCategory(goal, task) {
  const text = `${goal?.title || ""} ${task?.title || ""}`.toLowerCase();

  if (/(英语|数学|考试|复习|听力|阅读|写作|错题|真题|模拟|背诵|单词)/.test(text)) {
    return "study";
  }

  if (/(c\+\+|python|java|代码|项目|程序|demo|网站|网页|前端|后端|接口|调试|编译)/.test(text)) {
    return "project";
  }

  if (/(作业|课程|报告|论文|ppt|汇报|实验)/.test(text)) {
    return "coursework";
  }

  if (task?.repeat === "daily" || /(每天|每日|打卡|坚持|习惯)/.test(text)) {
    return "habit";
  }

  return "general";
}

function pickSuggestedTask(goal) {
  const tasks = Array.isArray(goal?.tasks) ? goal.tasks : [];
  const dueRecurringTask = tasks.find((task) => task?.repeat === "daily" && !isGoalTaskComplete(task) && !isGoalTaskCheckedForToday(task));
  if (dueRecurringTask) {
    return dueRecurringTask;
  }

  return tasks.find((task) => !isGoalTaskComplete(task)) || null;
}

function buildSuggestionReason(goal, task) {
  const category = inferSuggestionCategory(goal, task);
  const remainingCount = Math.max(0, (Array.isArray(goal?.tasks) ? goal.tasks : []).filter((item) => !isGoalTaskComplete(item)).length - 1);
  const progressHint = remainingCount > 0
    ? `完成这一步后，这个目标还剩 ${remainingCount} 个关键动作，更容易继续往下拆。`
    : "这一步完成后，这个目标就接近收口了。";

  if (task?.repeat === "daily") {
    const doneCount = countUniqueDates(task.completedDates);
    const targetDays = task.targetDays || 7;
    return `这是一个需要连续累计的日常任务，核心不是一次做很多，而是稳定形成重复刺激。今天完成后会把累计进度推进到 ${Math.min(doneCount + 1, targetDays)}/${targetDays}，比临时突击更符合记忆巩固和习惯养成。`;
  }

  if (category === "study") {
    return `这一步适合作为当前优先项，因为它直接对应提分杠杆最高的复习动作。先处理它，可以尽快暴露薄弱点，再决定后续是补知识、刷题还是做限时训练。${progressHint}`;
  }

  if (category === "project") {
    return `这一步优先级高，因为它更接近“能运行、能展示、能验证”的最小闭环。先把可执行结果做出来，能更早发现实现风险，避免后面把时间耗在返工上。${progressHint}`;
  }

  if (category === "coursework") {
    return `先推进这一项更稳，因为它能尽快产出可检查的材料或阶段成果。越早形成可见产物，越容易发现要求偏差，也更方便后续补细节和调整结构。${progressHint}`;
  }

  if (category === "habit") {
    return `这类任务的价值在于稳定重复而不是偶尔爆发，先把今天这一轮完成，能降低拖延后的补救成本，也能把目标推进维持在可持续节奏上。${progressHint}`;
  }

  return `这一步是当前最合适的切入口，因为它既能推动目标继续前进，又不会把任务一下子放大到难以下手。先完成一个清晰动作，再根据结果决定下一步，整体效率会更高。${progressHint}`;
}

function buildSuggestions(data) {
  const suggestions = [];

  (Array.isArray(data?.goals) ? data.goals : []).forEach((goal) => {
    const nextTask = pickSuggestedTask(goal);
    if (!nextTask) {
      return;
    }

    suggestions.push({
      title: `建议优先推进「${nextTask.title}」`,
      reason: buildSuggestionReason(goal, nextTask)
    });
  });

  return suggestions.slice(0, 4);
}

function normalizeUserData(data, username) {
  const base = data || createInitialDashboardData(username);
  const preferences = normalizePreferences(base.preferences);
  const schedule = Array.isArray(base.schedule)
    ? base.schedule.map((item) => normalizeScheduleItem(item, preferences.defaultTaskColorId))
    : [];
  const goals = Array.isArray(base.goals)
    ? base.goals.map((goal) => normalizeGoal(goal))
    : [];

  return {
    preferences,
    schedule,
    goals,
    clockFocusTaskId: typeof base.clockFocusTaskId === "string" ? base.clockFocusTaskId : "",
    plannerHistory: Array.isArray(base.plannerHistory) && base.plannerHistory.length
      ? base.plannerHistory
      : createInitialPlannerHistory(),
    plannerDraft: base.plannerDraft || null
  };
}

function createInitialDashboardData(username) {
  const schedule = [
    createScheduleItem({
      time: "09:00 - 10:00",
      title: "课程或主线学习时间",
      detail: "先把今天必须完成的主任务推进一小段。",
      colorId: "sunrise"
    }),
    createScheduleItem({
      time: "今日空档",
      title: "留给长线目标的一小时",
      detail: `你可以把 ${username} 现在最想完成的事情交给 AI 来拆解。`,
      colorId: "tidal"
    }),
    createScheduleItem({
      time: "晚间回看",
      title: "看看今天的计划是否真正落地",
      detail: "不是列得多，而是完成得稳。",
      colorId: "lilac"
    })
  ];

  return {
    preferences: { ...DEFAULT_PREFERENCES },
    schedule,
    clockFocusTaskId: "",
    goals: [
      {
        id: `goal_seed_${Date.now()}`,
        title: "时间织梦簿首版展示",
        deadline: "2026-05-30",
        tasks: [
          { id: `task_seed_1_${Date.now()}`, title: "完成登录页的视觉调整", done: true },
          { id: `task_seed_2_${Date.now()}`, title: "补齐首页与 AI 页之间的切换", done: false },
          { id: `task_seed_3_${Date.now()}`, title: "让 AI 草案可以插入首页看板", done: false }
        ]
      }
    ],
    plannerHistory: createInitialPlannerHistory(),
    plannerDraft: null
  };
}

function createInitialPlannerHistory() {
  return [
    {
      role: "assistant",
      text: "直接告诉我你想完成什么，不用先填起止时间，也不用自己拆很多字段。\n\n你只需要说人话，我先帮你整理成可执行计划，再问你要不要插入看板。"
    }
  ];
}

function renderAssistantAvatar() {
  const companion = getActiveCompanion();
  return `
    <div class="chat-avatar assistant-avatar" aria-hidden="true">
      <img src="${escapeHtml(companion.avatar)}" alt="">
    </div>
  `;
}

function renderUserAvatar() {
  const initial = activeUser ? escapeHtml(activeUser.slice(0, 1).toUpperCase()) : "U";
  return `<div class="chat-avatar user-avatar" aria-hidden="true">${initial}</div>`;
}

function showCompanion() {
  companionDock.classList.remove("hidden");

  if (!companionPositioned) {
    window.requestAnimationFrame(positionCompanion);
    return;
  }

  clampCompanionPosition();
}

function positionCompanion() {
  const saved = loadJson(STORAGE_KEYS.companionPos, null);

  if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
    setCompanionPosition(saved.left, saved.top);
    return;
  }

  const width = companionDock.offsetWidth || 400;
  const height = companionDock.offsetHeight || 140;
  const left = window.innerWidth - width - 24;
  const top = window.innerHeight - height - 24;
  setCompanionPosition(left, top);
}

function handleCompanionClick() {
  if (suppressCompanionClick) {
    return;
  }

  showPlannerView();
}

function handleCompanionPointerDown(event) {
  if (event.button !== 0) {
    return;
  }

  const rect = companionDock.getBoundingClientRect();
  companionDrag.active = true;
  companionDrag.moved = false;
  companionDrag.offsetX = event.clientX - rect.left;
  companionDrag.offsetY = event.clientY - rect.top;
  companionDock.classList.add("dragging");
}

function handleCompanionPointerMove(event) {
  if (!companionDrag.active) {
    return;
  }

  const nextLeft = event.clientX - companionDrag.offsetX;
  const nextTop = event.clientY - companionDrag.offsetY;
  const rect = companionDock.getBoundingClientRect();

  if (!companionDrag.moved) {
    const distance = Math.abs(nextLeft - rect.left) + Math.abs(nextTop - rect.top);
    if (distance > 8) {
      companionDrag.moved = true;
    }
  }

  setCompanionPosition(nextLeft, nextTop);
}

function handleCompanionPointerUp() {
  if (!companionDrag.active) {
    return;
  }

  companionDrag.active = false;
  companionDock.classList.remove("dragging");
  saveCompanionPosition();

  if (companionDrag.moved) {
    suppressCompanionClick = true;
    window.setTimeout(() => {
      suppressCompanionClick = false;
    }, 120);
  }
}

function setCompanionPosition(left, top) {
  const maxLeft = Math.max(12, window.innerWidth - companionDock.offsetWidth - 12);
  const maxTop = Math.max(12, window.innerHeight - companionDock.offsetHeight - 12);
  const clampedLeft = clamp(left, 12, maxLeft);
  const clampedTop = clamp(top, 12, maxTop);

  companionDock.style.left = `${clampedLeft}px`;
  companionDock.style.top = `${clampedTop}px`;
  companionDock.style.right = "auto";
  companionDock.style.bottom = "auto";
  companionPositioned = true;
}

function clampCompanionPosition() {
  if (!companionPositioned || companionDock.classList.contains("hidden")) {
    return;
  }

  const rect = companionDock.getBoundingClientRect();
  setCompanionPosition(rect.left, rect.top);
}

function saveCompanionPosition() {
  if (!companionPositioned) {
    return;
  }

  const rect = companionDock.getBoundingClientRect();
  saveJson(STORAGE_KEYS.companionPos, {
    left: rect.left,
    top: rect.top
  });
}

function canFloatClockTaskPanel() {
  return window.innerWidth > 900;
}

function syncClockTaskPanelFloatingState() {
  if (!clockView || !clockTaskPanel) {
    return;
  }

  const shouldFloat = Boolean(activeUser && currentView === "clock" && canFloatClockTaskPanel());
  clockView.classList.toggle("has-floating-task-panel", shouldFloat);

  if (!shouldFloat) {
    clockTaskPanel.classList.remove("dragging");
    clockTaskPanel.style.left = "";
    clockTaskPanel.style.top = "";
    clockTaskPanel.style.right = "";
    clockTaskPanel.style.bottom = "";
    return;
  }

  if (!clockTaskPanelPositioned) {
    window.requestAnimationFrame(positionClockTaskPanel);
    return;
  }

  clampClockTaskPanelPosition();
}

function positionClockTaskPanel() {
  if (!clockTaskPanel) {
    return;
  }

  const saved = loadJson(STORAGE_KEYS.clockTaskPanelPos, null);
  if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
    setClockTaskPanelPosition(saved.left, saved.top);
    return;
  }

  const width = clockTaskPanel.offsetWidth || 320;
  const height = clockTaskPanel.offsetHeight || 220;
  const left = window.innerWidth - width - 28;
  const top = Math.max(132, Math.round(window.innerHeight - height - 110));
  setClockTaskPanelPosition(left, top);
}

function handleClockTaskPanelPointerDown(event) {
  if (!clockTaskPanel || !canFloatClockTaskPanel() || currentView !== "clock" || event.button !== 0) {
    return;
  }

  const rect = clockTaskPanel.getBoundingClientRect();
  clockTaskPanelDrag.active = true;
  clockTaskPanelDrag.moved = false;
  clockTaskPanelDrag.offsetX = event.clientX - rect.left;
  clockTaskPanelDrag.offsetY = event.clientY - rect.top;
  clockTaskPanel.classList.add("dragging");
}

function handleClockTaskPanelPointerMove(event) {
  if (!clockTaskPanelDrag.active || !clockTaskPanel) {
    return;
  }

  const nextLeft = event.clientX - clockTaskPanelDrag.offsetX;
  const nextTop = event.clientY - clockTaskPanelDrag.offsetY;
  const rect = clockTaskPanel.getBoundingClientRect();

  if (!clockTaskPanelDrag.moved) {
    const distance = Math.abs(nextLeft - rect.left) + Math.abs(nextTop - rect.top);
    if (distance > 8) {
      clockTaskPanelDrag.moved = true;
    }
  }

  setClockTaskPanelPosition(nextLeft, nextTop);
}

function handleClockTaskPanelPointerUp() {
  if (!clockTaskPanelDrag.active || !clockTaskPanel) {
    return;
  }

  clockTaskPanelDrag.active = false;
  clockTaskPanel.classList.remove("dragging");
  saveClockTaskPanelPosition();

  if (clockTaskPanelDrag.moved) {
    suppressClockTaskBoardSwitch = true;
    window.setTimeout(() => {
      suppressClockTaskBoardSwitch = false;
    }, 120);
  }
}

function setClockTaskPanelPosition(left, top) {
  if (!clockTaskPanel) {
    return;
  }

  const minLeft = 12;
  const minTop = 108;
  const maxLeft = Math.max(minLeft, window.innerWidth - clockTaskPanel.offsetWidth - 12);
  const maxTop = Math.max(minTop, window.innerHeight - clockTaskPanel.offsetHeight - 12);
  const clampedLeft = clamp(left, minLeft, maxLeft);
  const clampedTop = clamp(top, minTop, maxTop);

  clockTaskPanel.style.left = `${clampedLeft}px`;
  clockTaskPanel.style.top = `${clampedTop}px`;
  clockTaskPanel.style.right = "auto";
  clockTaskPanel.style.bottom = "auto";
  clockTaskPanelPositioned = true;
}

function clampClockTaskPanelPosition() {
  if (!clockTaskPanel || !clockTaskPanelPositioned || currentView !== "clock" || !canFloatClockTaskPanel()) {
    return;
  }

  const rect = clockTaskPanel.getBoundingClientRect();
  setClockTaskPanelPosition(rect.left, rect.top);
}

function saveClockTaskPanelPosition() {
  if (!clockTaskPanel || !clockTaskPanelPositioned) {
    return;
  }

  const rect = clockTaskPanel.getBoundingClientRect();
  saveJson(STORAGE_KEYS.clockTaskPanelPos, {
    left: rect.left,
    top: rect.top
  });
}

function syncCompanionForCurrentView() {
  if (currentView !== "planner") {
    updateCompanionState("guiding");
    return;
  }

  if (document.activeElement === plannerInput) {
    updateCompanionState("listening");
    return;
  }

  updateCompanionState("guiding");
}

function legacyUpdateCompanionStateV1(state) {
  const companion = getActiveCompanion();
  const companionImages = companion.images;
  companionDock.classList.remove("state-guiding", "state-listening", "state-thinking", "state-speaking");
  companionDock.classList.add(`state-${state}`);
  companionFigure.src = companionImages[state] || companionImages.guiding;

  if (state === "listening") {
    companionHintLabel.textContent = `${companion.name}聆听中`;
    companionHintTitle.textContent = "继续告诉我你的目标";
    companionHintBody.textContent = "不用填复杂表单，直接像聊天一样说就可以。";
    return;
  }

  if (state === "thinking") {
    companionHintLabel.textContent = `${companion.name}思考中`;
    companionHintTitle.textContent = "我在整理更合适的拆解步骤";
    companionHintBody.textContent = "先把目标收束成可执行的小段落，再决定要不要放进看板。";
    return;
  }

  if (state === "speaking") {
    companionHintLabel.textContent = `${companion.name}回应中`;
    companionHintTitle.textContent = "我已经为你织好一版计划";
    companionHintBody.textContent = "先看看草案，如果合理，就把它插进首页看板。";
    return;
  }

  companionHintLabel.textContent = currentView === "planner" ? `${companion.name}陪伴中` : `${companion.name}引路`;
  companionHintTitle.textContent = currentView === "planner" ? "想好了就继续和我说" : "点我进入 AI 拆解";
  companionHintBody.textContent = currentView === "planner"
    ? "把抽象目标说清楚，我会继续把它拆得更顺手。"
    : "新建目标后直接进聊天拆解页，不需要你手动设一堆时间字段。";
}

function updateCompanionState(state) {
  const companion = getActiveCompanion();
  const companionImages = companion.images;
  companionDock.classList.remove("state-guiding", "state-listening", "state-thinking", "state-speaking");
  companionDock.classList.add(`state-${state}`);
  companionFigure.src = companionImages[state] || companionImages.guiding;

  if (state === "listening") {
    companionHintLabel.textContent = `${companion.name}聆听中`;
    companionHintTitle.textContent = "继续告诉我你的目标";
    companionHintBody.textContent = "我会先确认时间、基础和限制条件，再决定怎么拆计划。";
    return;
  }

  if (state === "thinking") {
    companionHintLabel.textContent = `${companion.name}思考中`;
    companionHintTitle.textContent = "我在分析你的情况，不是卡住了";
    companionHintBody.textContent = "正在整理目标、时间投入、当前基础和专注状态，接下来会先追问或直接给计划。";
    return;
  }

  if (state === "speaking") {
    companionHintLabel.textContent = `${companion.name}回应中`;
    companionHintTitle.textContent = "我已经整理好下一步了";
    companionHintBody.textContent = "先看问题或草案是否贴合你，再决定要不要插入看板。";
    return;
  }

  companionHintLabel.textContent = currentView === "planner" ? `${companion.name}陪伴中` : `${companion.name}引路`;
  companionHintTitle.textContent = currentView === "planner" ? "想到什么就继续补充" : "点我进入 AI 拆解";
  companionHintBody.textContent = currentView === "planner"
    ? "你说得越具体，守星人越容易给出稳定、不飘的计划。"
    : "先聊天式问几句，再把长期目标拆成能执行的行动。";
}

function syncBoardSwitchState() {
  boardSwitchButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.boardView === currentGoalView);
  });
}

function formatDisplayDate(date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDuration(durationMs) {
  const safeDuration = Math.max(0, Math.floor(durationMs / 1000));
  const hours = String(Math.floor(safeDuration / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safeDuration % 3600) / 60)).padStart(2, "0");
  const seconds = String(safeDuration % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function detectPlannerCategory(text) {
  const normalized = String(text || "").toLowerCase();
  const score = (groups) => groups.reduce((count, keywords) => count + (hasAny(normalized, keywords) ? 1 : 0), 0);
  const scores = {
    exam: score([
      ["英语", "数学", "高数", "线代", "线性代数", "概率", "概率论"],
      ["考试", "考", "复习", "备考", "四级", "六级", "雅思", "托福", "期末"]
    ]),
    demo: score([
      ["demo", "app", "pwa"],
      ["网页", "网站", "原型", "答辩"],
      ["比赛", "项目"]
    ]),
    coursework: score([
      ["作业", "课程"],
      ["论文", "报告", "实验报告"],
      ["pre", "ppt", "汇报", "评分标准", "题目"]
    ]),
    longterm: score([
      ["长期", "这学期", "这个学期"],
      ["习惯", "养成", "坚持"],
      ["目标", "计划", "提升"],
      ["每天", "学习"]
    ])
  };
  const ranked = Object.entries(scores).sort((left, right) => right[1] - left[1]);
  return ranked[0][1] > 0 ? ranked[0][0] : "general";
}

function detectExamSubject(text) {
  const normalized = String(text || "").toLowerCase();
  if (hasAny(normalized, ["英语", "四级", "六级", "雅思", "托福"])) {
    return "english";
  }
  if (hasAny(normalized, ["数学", "高数", "线代", "线性代数", "概率", "概率论"])) {
    return "math";
  }
  return "general";
}

function buildGuidedQuestions(category, signals) {
  const questions = [];
  const push = (question) => {
    if (questions.length < 3) {
      questions.push(question);
    }
  };

  if (category === "exam") {
    const subject = detectExamSubject(signals.sourceText || "");
    if (!signals.examTypeKnown) {
      push("这次具体考哪一门或哪一类？比如英语四级、高数期末、线代期中，或者学校课程考试。");
    }
    if (!signals.deadlineKnown) {
      push("你的考试时间是什么时候？如果就是下周，也可以直接告诉我具体到周几。");
    }
    if (!signals.weakAreaKnown && subject === "english") {
      push("你现在最薄弱的是哪个模块？比如听力、阅读、写作、翻译，还是词汇和语法。");
    }
    if (!signals.weakAreaKnown && subject === "math") {
      push("你现在最不稳的是哪几块？比如函数、极限、导数、积分、线代、概率，或者证明题和计算题。");
    }
    if (!signals.weakAreaKnown && subject === "general") {
      push("你现在最薄弱的是哪一部分？可以直接说章节、题型，或者最容易失分的模块。");
    }
    if (!signals.progressKnown && questions.length < 3) {
      push("你目前的基础大概在哪个水平？比如最近一次分数、做题正确率，或者你自己的主观判断。");
    }
    if (!signals.timeBudgetKnown && questions.length < 3) {
      push("你接下来每天或每周大概能拿出多少时间复习？更适合整块专注，还是碎片时间推进。");
    }
    return questions;
  }

  if (category === "demo") {
    if (!signals.deliverableKnown) {
      push("这次最终要交付什么？是可运行页面、演示原型、答辩 PPT，还是项目说明文档。");
    }
    if (!signals.progressKnown) {
      push("你现在做到哪一步了？比如已有草图、部分前端、数据流程，还是只是想法阶段。");
    }
    if (!signals.timeBudgetKnown) {
      push("从现在到截止前，你每天或每周大概能稳定投入多少时间？");
    }
    if (!signals.constraintsKnown && questions.length < 3) {
      push("现在最大的限制是什么？比如课程多、时间碎、容易被打断，还是技术上有卡点。");
    }
    return questions;
  }

  if (category === "coursework") {
    if (!signals.deliverableKnown) {
      push("这次要交付什么？比如论文、报告、PPT、代码，或者课堂展示。");
    }
    if (!signals.deadlineKnown) {
      push("老师给的截止时间或汇报时间是什么时候？");
    }
    if (!signals.materialKnown) {
      push("老师的要求、评分标准或题目材料你现在手里有了吗？缺哪一部分。");
    }
    if (!signals.progressKnown && questions.length < 3) {
      push("你现在做到哪一步了？比如刚开始、已列提纲、查过资料，还是已经有初稿。");
    }
    return questions;
  }

  if (category === "longterm") {
    if (!signals.deliverableKnown) {
      push("你希望先看到什么阶段性结果？比如一周内形成习惯、一个月完成首轮，还是先稳住某个指标。");
    }
    if (!signals.progressKnown) {
      push("你现在的状态大概怎样？已经开始过、断断续续推进，还是还没真正动起来。");
    }
    if (!signals.timeBudgetKnown) {
      push("你每天或每周大概能稳定拿出多少时间？比如每天 20 分钟、工作日晚上 1 小时，或周末 2 小时。");
    }
    if (!signals.studySlotKnown && questions.length < 3) {
      push("你最容易固定下来的学习时段是什么时候？比如早上、晚饭后、睡前，还是周末整块时间。");
    }
    if (!signals.constraintsKnown && questions.length < 3) {
      push("你现在最容易被什么打断？比如作息不稳、课程挤占、拖延，还是专注时间太短。");
    }
    if (!signals.minimumActionKnown && signals.timeBudgetKnown && questions.length < 3) {
      push("如果哪天状态差，你愿意保底完成什么最小动作？比如背 10 个单词、做 1 篇阅读，或听 10 分钟。");
    }
    return questions;
  }

  if (!signals.deliverableKnown) {
    push("这件事最后要做到什么程度才算完成？最好直接说一个看得见的结果。");
  }
  if (!signals.deadlineKnown) {
    push("这件事最晚什么时候要完成？如果没有精确日期，也可以告诉我是这周、这个月，还是本学期内。");
  }
  if (!signals.progressKnown) {
    push("你现在做到哪一步了？比如刚开始、已经收集资料、做了一半，还是已经有初稿/代码/笔记。");
  }
  if (!signals.timeBudgetKnown && questions.length < 3) {
    push("你接下来每天或每周大概能稳定投入多少时间？更适合整块专注，还是碎片时间推进。");
  }
  return questions;
}

/*
function buildLocalDraftResponse(category, conversationText) {
  const deadline = inferRelativeDeadline(conversationText);

  if (category === "exam") {
    return {
      mode: "draft",
      reply: "信息已经够了，我先按冲刺复习的顺序给你收成一版能直接执行的草案。重点会放在先补弱项、再做限时检验，避免临近考试还在泛泛复习。",
      questions: null,
      draft: {
        title: "考试冲刺复习安排",
        deadline,
        rationale: "我先按考试时间、薄弱模块、当前水平和可投入时长做拆解，优先保证最容易提分的内容先被覆盖，再留出临近考试的回看和检验时间。",
        tasks: [
          "整理考试范围与现有资料清单，圈出这几天必须覆盖的章节和题型。",
          "先集中补薄弱模块的核心概念和例题，形成一页公式或方法速记。",
          "按每天可投入时长刷针对性练习，并把错题按原因归到同一份清单里。",
          "安排 1 到 2 次限时训练，检验做题速度、步骤稳定性和薄弱点是否回潮。",
          "在考前回看错题、公式和易混点，只保留最影响分数的内容做最后加固。"
        },
        tips: [
          "先做最容易提分的薄弱模块，不要把时间平均摊给所有章节。",
          "限时训练要尽量贴近真实考试节奏，避免只做不计时。",
          "晚上复习前先定一个主攻点，这样 2 小时更容易收住。"
        ]
      }
    };
  }

  if (category === "demo") {
    return {
      mode: "draft",
      reply: "信息已经够了，我先按“先跑通最小可演示闭环，再补展示材料”的顺序给你出一版推进草案。这样更适合一个人利用晚上的整块时间稳定往前推。",
      questions: null,
      draft: {
        title: "比赛 Demo 冲刺推进",
        deadline,
        rationale: "我先按交付物、当前进度、可投入时长和现实限制做拆解，优先保住可演示网页的主流程，再把答辩材料和收尾检查排到后面。",
        tasks: [
          "明确本次 Demo 的最小演示闭环，写清首页、核心流程和必须展示的结果。",
          "先补齐网页主流程和关键页面，保证从进入到完成展示能顺畅跑通。",
          "同步整理演示所需截图、文案和结果说明，避免最后临时回头补材料。",
          "按晚间固定时段推进一个明确模块，并记录第二天衔接点减少重新启动成本。",
          "在截止前做一轮完整演示和彩排，修掉最影响展示效果的卡点和缺口。"
        ],
        tips: [
          "先保证能演示，再决定哪些细节留到下一轮优化。",
          "一个人推进时每天只盯一个主模块，切换太多最容易掉效率。",
          "答辩 PPT 最好跟着功能推进同步积累，不要全部留到最后一天。"
        ]
      }
    };
  }

  if (category === "coursework") {
    return {
      mode: "draft",
      reply: "信息已经够我先帮你收成一版作业冲刺草案了。我会按“先完成能拿分的结果，再补说明和自查”的顺序拆，这样更适合临近截止的课程任务。",
      questions: null,
      draft: {
        title: "课程作业完成安排",
        deadline,
        rationale: "我先根据交付物、截止时间、当前进度、评分标准和可投入时长做拆解，优先保证必交内容先完成，再把报告整理、自查和提交风险压到后面处理。",
        tasks: [
          "通读题目和评分标准，列出必做项、占分点和不能漏交的材料清单。",
          "先把环境、资料和作业框架准备好，确认代码或正文能够从头顺利推进。",
          "按题目顺序完成核心内容，并同步保存运行结果、截图或引用材料供后续整理。",
          "根据评分标准补齐实验报告、分析说明或排版细节，避免只完成主体却丢过程分。",
          "在提交前做一轮对照自查，确认文件命名、格式、附件和截止时间都没有遗漏。"
        ],
        tips: [
          "先完成最占分的主体内容，再回头补格式和润色会更稳。",
          "代码、截图和报告最好同步留档，避免最后回头补证据。",
          "如果晚上时间固定，第一小时做主体，第二小时专门收结果和整理材料。"
        ]
      }
    };
  }

  if (category === "longterm") {
    return {
      mode: "draft",
      reply: "信息已经够了，我先给你收成一版能稳定执行的长期推进草案。重点不会放在一开始做很多，而是先把节奏固定住，再慢慢加量。",
      questions: null,
      draft: {
        title: "长期目标稳步推进",
        deadline,
        rationale: "我先按阶段目标、当前状态、可投入时长和现实限制做拆解，优先保证固定时段和最小动作先建立，再把连续推进和复盘放进后续节奏里。",
        tasks: [
          "明确这一阶段最先要看到的结果，写成一个 2 到 6 周内能判断成败的标准。",
          "固定每周最稳定的学习时段，并给每次推进预留一个不会太重的起步动作。",
          "按当前时间预算安排稳定练习，把输出留痕到同一份记录里便于复盘。",
          "针对最容易打断你的因素提前设置限制，降低临时分心把整次学习打散的概率。",
          "每周做一次短复盘，只调整最影响坚持率的一个问题，让节奏越走越稳。"
        ],
        tips: [
          "长期目标先保连续性，再慢慢加难度，比一开始排太满更容易坚持。",
          "固定时段前先准备最小动作，状态差时也不容易完全断掉。",
          "每周只改一个最卡你的点，节奏会比频繁大改更稳。"
        ]
      }
    };
  }

  return null;
}
*/

function buildLocalDraftResponse(category, conversationText) {
  const deadline = inferRelativeDeadline(conversationText);

  if (category === "exam") {
    return {
      mode: "draft",
      reply: "信息已经够了，我先按冲刺复习的顺序给你收成一版能直接执行的草案。重点会放在先补弱项、再做限时检验，避免临近考试还在泛泛复习。",
      questions: null,
      draft: {
        title: "考试冲刺复习安排",
        deadline,
        rationale: "我先按考试时间、薄弱模块、当前水平和可投入时长做拆解，优先保证最容易提分的内容先被覆盖，再留出临近考试的回看和检验时间。",
        tasks: [
          "整理考试范围与现有资料清单，圈出这几天必须覆盖的章节和题型。",
          "先集中补薄弱模块的核心概念和例题，形成一页公式或方法速记。",
          "按每天可投入时长刷针对性练习，并把错题按原因归到同一份清单里。",
          "安排 1 到 2 次限时训练，检验做题速度、步骤稳定性和薄弱点是否回潮。",
          "在考前回看错题、公式和易混点，只保留最影响分数的内容做最后加固。"
        ],
        tips: [
          "先做最容易提分的薄弱模块，不要把时间平均摊给所有章节。",
          "限时训练要尽量贴近真实考试节奏，避免只做不计时。",
          "晚上复习前先定一个主攻点，这样 2 小时更容易收住。"
        ]
      }
    };
  }

  if (category === "demo") {
    return {
      mode: "draft",
      reply: "信息已经够了，我先按“先跑通最小可演示闭环，再补展示材料”的顺序给你出一版推进草案。这样更适合一个人利用晚上的整块时间稳定往前推。",
      questions: null,
      draft: {
        title: "比赛 Demo 冲刺推进",
        deadline,
        rationale: "我先按交付物、当前进度、可投入时长和现实限制做拆解，优先保住可演示网页的主流程，再把答辩材料和收尾检查排到后面。",
        tasks: [
          "明确本次 Demo 的最小演示闭环，写清首页、核心流程和必须展示的结果。",
          "先补齐网页主流程和关键页面，保证从进入到完成展示能顺畅跑通。",
          "同步整理演示所需截图、文案和结果说明，避免最后临时回头补材料。",
          "按晚间固定时段推进一个明确模块，并记录第二天衔接点减少重新启动成本。",
          "在截止前做一轮完整演示和彩排，修掉最影响展示效果的卡点和缺口。"
        ],
        tips: [
          "先保证能演示，再决定哪些细节留到下一轮优化。",
          "一个人推进时每天只盯一个主模块，切换太多最容易掉效率。",
          "答辩 PPT 最好跟着功能推进同步积累，不要全部留到最后一天。"
        ]
      }
    };
  }

  if (category === "coursework") {
    return {
      mode: "draft",
      reply: "信息已经够我先帮你收成一版作业冲刺草案了。我会按“先完成能拿分的结果，再补说明和自查”的顺序拆，这样更适合临近截止的课程任务。",
      questions: null,
      draft: {
        title: "课程作业完成安排",
        deadline,
        rationale: "我先根据交付物、截止时间、当前进度、评分标准和可投入时长做拆解，优先保证必交内容先完成，再把报告整理、自查和提交风险压到后面处理。",
        tasks: [
          "通读题目和评分标准，列出必做项、占分点和不能漏交的材料清单。",
          "先把环境、资料和作业框架准备好，确认代码或正文能够从头顺利推进。",
          "按题目顺序完成核心内容，并同步保存运行结果、截图或引用材料供后续整理。",
          "根据评分标准补齐实验报告、分析说明或排版细节，避免只完成主体却丢过程分。",
          "在提交前做一轮对照自查，确认文件命名、格式、附件和截止时间都没有遗漏。"
        ],
        tips: [
          "先完成最占分的主体内容，再回头补格式和润色会更稳。",
          "代码、截图和报告最好同步留档，避免最后回头补证据。",
          "如果晚上时间固定，第一小时做主体，第二小时专门收结果和整理材料。"
        ]
      }
    };
  }

  if (category === "longterm") {
    return {
      mode: "draft",
      reply: "信息已经够了，我先给你收成一版能稳定执行的长期推进草案。重点不会放在一开始做很多，而是先把节奏固定住，再慢慢加量。",
      questions: null,
      draft: {
        title: "长期目标稳步推进",
        deadline,
        rationale: "我先按阶段目标、当前状态、可投入时长和现实限制做拆解，优先保证固定时段和最小动作先建立，再把连续推进和复盘放进后续节奏里。",
        tasks: [
          "明确这一阶段最先要看到的结果，写成一个 2 到 6 周内能判断成败的标准。",
          "固定每周最稳定的学习时段，并给每次推进预留一个不会太重的起步动作。",
          "按当前时间预算安排稳定练习，把输出留痕到同一份记录里便于复盘。",
          "针对最容易打断你的因素提前设置限制，降低临时分心把整次学习打散的概率。",
          "每周做一次短复盘，只调整最影响坚持率的一个问题，让节奏越走越稳。"
        ],
        tips: [
          "长期目标先保连续性，再慢慢加难度，比一开始排太满更容易坚持。",
          "固定时段前先准备最小动作，状态差时也不容易完全断掉。",
          "每周只改一个最卡你的点，节奏会比频繁大改更稳。"
        ]
      }
    };
  }

  return null;
}

function buildGuidedPlannerResponse(prompt, history) {
  const conversationText = buildPlannerConversationText(history, prompt);
  const category = detectPlannerCategory(conversationText);
  const signals = {
    ...extractPlannerSignals(conversationText, category),
    sourceText: conversationText
  };

  if (!shouldUseGuidedQuestioning(category, signals)) {
    return buildLocalDraftResponse(category, conversationText);
  }

  const questions = buildGuidedQuestions(category, signals);
  if (!questions.length) {
    return null;
  }

  const stageReplyMap = {
    exam: "我先按考试复习的思路把信息补齐，再一步步细化成计划。",
    demo: "我先把交付物、进度和限制摸清，再一步步细化成可演示的推进计划。",
    coursework: "我先把作业要求、当前进度和可投入时间补齐，再一步步细化成可执行安排。",
    longterm: "我先把阶段目标、当前状态和现实限制理顺，再一步步细化成更稳的长期计划。",
    general: "我先补齐最关键的信息，再一步步细化成不飘的计划。"
  };

  return {
    mode: "ask",
    reply: `${stageReplyMap[category] || stageReplyMap.general}\n\n${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`,
    questions,
    draft: null
  };
}

function legacyBuildPlannerFallbackNoticeV1(error) {
  const message = error instanceof Error ? error.message : "";
  if (/invalid character|non-json|unexpected token|json|upstream/iu.test(message)) {
    return "真实模型连接暂时异常，我先用本地规则继续，避免流程中断。";
  }

  return "真实模型暂时不可用，我先用本地规则继续，避免流程中断。";
}

async function legacyHandlePlannerSubmitV1(event) {
  event.preventDefault();

  const prompt = plannerInput.value.trim();
  if (!prompt) {
    plannerInput.focus();
    return;
  }

  const data = getUserData();
  data.plannerHistory.push({ role: "user", text: prompt });
  data.plannerDraft = null;
  updateUserData(data);

  plannerInput.value = "";
  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  updateCompanionState("thinking");
  renderPlanner();

  try {
    const result = await requestPlannerResponse({
      prompt,
      history: data.plannerHistory,
      currentDraft: null,
      refine: false
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    latestData.plannerDraft = result.mode === "draft"
      ? attachSourcePrompt(result.draft, prompt)
      : null;
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const guidedAsk = (isGreetingOnlyPrompt(prompt) ? buildGreetingPromptResponse() : null)
      || buildGuidedPlannerResponse(prompt, data.plannerHistory)
      || buildPresetPlannerResponse(prompt);
    const draft = guidedAsk ? null : buildDraftFromPrompt(prompt, false);
    const reason = error instanceof Error && error.message
      ? `真实模型暂时不可用：${error.message}`
      : "真实模型暂时不可用。";
    latestData.plannerDraft = draft;
    latestData.plannerHistory.push({
      role: "assistant",
      text: guidedAsk
        ? `${reason}\n\n${guidedAsk.reply}`
        : `${reason}\n\n我先用本地兜底逻辑为你整理出一版可执行草案，先别让流程断掉。`
    });
    updateUserData(latestData);
    updateCompanionState(guidedAsk ? "listening" : "speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
    if (currentView === "planner") {
      plannerInput.focus();
    }
  }
}

function getPlannerAttachmentBadge(attachment) {
  if (attachment.kind === "image") {
    return "图片";
  }

  if (attachment.kind === "pdf") {
    return "PDF";
  }

  if (attachment.kind === "docx") {
    return "DOCX";
  }

  return "文本";
}

function buildPlannerAttachmentSummary(attachments) {
  if (!attachments.length) {
    return "";
  }

  return attachments
    .map((attachment, index) => `${index + 1}. ${getPlannerAttachmentBadge(attachment)}《${attachment.name}》`)
    .join("\n");
}

function dedupeTasks(tasks) {
  return [...new Set(tasks)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatMultilineText(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderClockCurrentTaskBoard(data = getUserData()) {
  if (!clockCurrentTaskBoard) {
    return;
  }

  const { options, task } = getSelectedClockTask(data);

  if (!task) {
    delete clockCurrentTaskBoard.dataset.clockTaskId;
    clockCurrentTaskBoard.innerHTML = `
      <div class="clock-task-empty">
        <span class="clock-task-badge">当前任务</span>
        <h3 class="clock-task-title">这里还没有任务</h3>
        <p class="clock-task-empty-hint">先去首页或让 AI 插入一条任务。</p>
      </div>
    `;
    return;
  }

  clockCurrentTaskBoard.dataset.clockTaskId = task.id;
  clockCurrentTaskBoard.innerHTML = `
    <article class="clock-task-card">
      <div class="clock-task-kicker">
        <span class="clock-task-badge">当前任务</span>
        ${options.length > 1 ? `<span class="clock-task-cycle">双击切换</span>` : ""}
      </div>
      <h3 class="clock-task-title">${escapeHtml(task.title)}</h3>
    </article>
  `;
}

function getAmbientSoundById(soundId) {
  const normalizedId = soundId === "alpha" ? "chimes" : soundId;
  if (normalizedId === "wind") {
    return { id: "wind", name: "风声", mode: "wind" };
  }
  if (normalizedId === "chimes") {
    return { id: "chimes", name: "阿尔法", mode: "alpha" };
  }
  return { id: "rain", name: "雨声", mode: "rain" };
}

function initializeAmbientAudio() {
  const saved = loadJson(STORAGE_KEYS.ambientAudio, null);
  ambientSoundId = getAmbientSoundById(saved?.soundId).id;
  ambientAudioEnabled = false;
  updateAmbientAudioButton();
}

function saveAmbientAudioState() {
  saveJson(STORAGE_KEYS.ambientAudio, {
    soundId: ambientSoundId,
    enabled: ambientAudioEnabled
  });
}

function ensureAmbientAudioContext() {
  if (ambientAudioContext) {
    return ambientAudioContext;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  ambientAudioContext = new AudioContextClass();
  return ambientAudioContext;
}

function getAmbientNoiseBuffer(context) {
  if (ambientNoiseBuffer) {
    return ambientNoiseBuffer;
  }

  const duration = 2.4;
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * 0.72;
  }
  ambientNoiseBuffer = buffer;
  return ambientNoiseBuffer;
}

function clearAmbientAudioGraph() {
  ambientAudioCleanup.forEach((cleanup) => {
    try {
      cleanup();
    } catch (error) {
      // Ignore cleanup failures from already-stopped nodes.
    }
  });
  ambientAudioCleanup = [];

  if (ambientAudioMasterGain) {
    try {
      ambientAudioMasterGain.disconnect();
    } catch (error) {
      // Ignore disconnect failures.
    }
    ambientAudioMasterGain = null;
  }
}

function buildRainAmbientGraph(context, destination) {
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getAmbientNoiseBuffer(context);
  noiseSource.loop = true;

  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 6800;
  lowpass.Q.value = 0.4;

  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 900;

  const gain = context.createGain();
  gain.gain.value = 0.19;

  noiseSource.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(destination);
  noiseSource.start();

  ambientAudioCleanup.push(() => {
    noiseSource.stop();
    noiseSource.disconnect();
    lowpass.disconnect();
    highpass.disconnect();
    gain.disconnect();
  });
}

function buildWindAmbientGraph(context, destination) {
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getAmbientNoiseBuffer(context);
  noiseSource.loop = true;

  const bandpass = context.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 480;
  bandpass.Q.value = 0.7;

  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1200;

  const gain = context.createGain();
  gain.gain.value = 0.11;

  const lfo = context.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoGain = context.createGain();
  lfoGain.gain.value = 240;
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = 0.04;

  noiseSource.connect(bandpass);
  bandpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(destination);

  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);
  lfo.connect(lfoDepth);
  lfoDepth.connect(gain.gain);

  noiseSource.start();
  lfo.start();

  ambientAudioCleanup.push(() => {
    noiseSource.stop();
    lfo.stop();
    noiseSource.disconnect();
    bandpass.disconnect();
    lowpass.disconnect();
    gain.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
    lfoDepth.disconnect();
  });
}

function buildAlphaAmbientGraph(context, destination) {
  const master = context.createGain();
  master.gain.value = 0.09;
  master.connect(destination);

  const left = context.createOscillator();
  left.type = "sine";
  left.frequency.value = 200;
  const right = context.createOscillator();
  right.type = "sine";
  right.frequency.value = 210;

  const leftGain = context.createGain();
  leftGain.gain.value = 0.55;
  const rightGain = context.createGain();
  rightGain.gain.value = 0.55;

  const leftPan = context.createStereoPanner();
  leftPan.pan.value = -0.42;
  const rightPan = context.createStereoPanner();
  rightPan.pan.value = 0.42;

  const shimmer = context.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.value = 100;
  const shimmerGain = context.createGain();
  shimmerGain.gain.value = 0.025;

  const pulse = context.createOscillator();
  pulse.type = "sine";
  pulse.frequency.value = 0.11;
  const pulseGain = context.createGain();
  pulseGain.gain.value = 0.018;

  left.connect(leftGain);
  leftGain.connect(leftPan);
  leftPan.connect(master);

  right.connect(rightGain);
  rightGain.connect(rightPan);
  rightPan.connect(master);

  shimmer.connect(shimmerGain);
  shimmerGain.connect(master);

  pulse.connect(pulseGain);
  pulseGain.connect(master.gain);

  left.start();
  right.start();
  shimmer.start();
  pulse.start();

  ambientAudioCleanup.push(() => {
    left.stop();
    right.stop();
    shimmer.stop();
    pulse.stop();
    left.disconnect();
    right.disconnect();
    shimmer.disconnect();
    pulse.disconnect();
    leftGain.disconnect();
    rightGain.disconnect();
    leftPan.disconnect();
    rightPan.disconnect();
    shimmerGain.disconnect();
    pulseGain.disconnect();
    master.disconnect();
  });
}

async function playAmbientAudio() {
  const context = ensureAmbientAudioContext();
  if (!context) {
    ambientAudioEnabled = false;
    saveAmbientAudioState();
    updateAmbientAudioButton();
    return;
  }

  clearAmbientAudioGraph();
  ambientAudioMasterGain = context.createGain();
  ambientAudioMasterGain.gain.value = 1;
  ambientAudioMasterGain.connect(context.destination);

  const sound = getAmbientSoundById(ambientSoundId);
  if (sound.mode === "wind") {
    buildWindAmbientGraph(context, ambientAudioMasterGain);
  } else if (sound.mode === "alpha") {
    buildAlphaAmbientGraph(context, ambientAudioMasterGain);
  } else {
    buildRainAmbientGraph(context, ambientAudioMasterGain);
  }

  try {
    await context.resume();
  } catch (error) {
    ambientAudioEnabled = false;
    clearAmbientAudioGraph();
    saveAmbientAudioState();
    updateAmbientAudioButton();
  }
}

function pauseAmbientAudio() {
  if (!ambientAudioContext) {
    return;
  }

  clearAmbientAudioGraph();
  if (ambientAudioContext.state === "running") {
    ambientAudioContext.suspend();
  }
}

function toggleAmbientAudio() {
  ambientAudioEnabled = !ambientAudioEnabled;
  if (ambientAudioEnabled) {
    playAmbientAudio();
  } else {
    pauseAmbientAudio();
  }
  saveAmbientAudioState();
  updateAmbientAudioButton();
}

function cycleAmbientSound() {
  const currentIndex = AMBIENT_SOUND_OPTIONS.findIndex((item) => item.id === ambientSoundId);
  const nextSound = AMBIENT_SOUND_OPTIONS[(currentIndex + 1) % AMBIENT_SOUND_OPTIONS.length];
  ambientSoundId = nextSound.id;
  if (ambientAudioEnabled) {
    playAmbientAudio();
  }
  saveAmbientAudioState();
  updateAmbientAudioButton();
}

function updateAmbientAudioButton() {
  if (!ambientAudioButton || !ambientAudioDock || !ambientAudioLabel) {
    return;
  }

  const sound = getAmbientSoundById(ambientSoundId);
  ambientAudioButton.classList.toggle("is-active", ambientAudioEnabled);
  ambientAudioLabel.textContent = sound.name;
  ambientAudioButton.title = `单击${ambientAudioEnabled ? "关闭" : "开启"}音效，双击切换声音。当前：${sound.name}`;
  ambientAudioButton.setAttribute("aria-label", `当前${sound.name}，单击${ambientAudioEnabled ? "关闭" : "开启"}音效，双击切换声音`);
}

function buildPlannerFallbackNotice(error) {
  const message = error instanceof Error ? error.message : "";
  if (/invalid character|non-json|unexpected token|json|upstream/iu.test(message)) {
    return "真实模型连接暂时异常，我先用本地规则继续，避免流程中断。";
  }

  return "真实模型暂时不可用，我先用本地规则继续，避免流程中断。";
}

async function handlePlannerSubmit(event) {
  event.preventDefault();

  const prompt = plannerInput.value.trim();
  if (!prompt) {
    plannerInput.focus();
    return;
  }

  const data = getUserData();
  data.plannerHistory.push({ role: "user", text: prompt });
  data.plannerDraft = null;
  updateUserData(data);

  plannerInput.value = "";
  plannerRequestPending = true;
  plannerInput.disabled = true;
  plannerSubmitBtn.disabled = true;
  updateCompanionState("thinking");
  renderPlanner();

  try {
    const result = await requestPlannerResponse({
      prompt,
      history: data.plannerHistory,
      currentDraft: null,
      refine: false
    });
    const latestData = getUserData();
    latestData.plannerHistory.push({
      role: "assistant",
      text: result.reply
    });
    latestData.plannerDraft = result.mode === "draft"
      ? attachSourcePrompt(result.draft, prompt)
      : null;
    updateUserData(latestData);
    updateCompanionState(result.mode === "draft" ? "speaking" : "listening");
  } catch (error) {
    const latestData = getUserData();
    const guidedAsk = (isGreetingOnlyPrompt(prompt) ? buildGreetingPromptResponse() : null)
      || buildGuidedPlannerResponse(prompt, data.plannerHistory)
      || buildPresetPlannerResponse(prompt);
    const draft = guidedAsk ? null : buildDraftFromPrompt(prompt, false);
    const reason = buildPlannerFallbackNotice(error);

    latestData.plannerDraft = draft;
    latestData.plannerHistory.push({
      role: "assistant",
      text: guidedAsk
        ? `${reason}\n\n${guidedAsk.reply}`
        : `${reason}\n\n我先用本地规则为你整理出一版可执行草案，先别让流程断掉。`
    });
    updateUserData(latestData);
    updateCompanionState(guidedAsk ? "listening" : "speaking");
  } finally {
    plannerRequestPending = false;
    plannerInput.disabled = false;
    plannerSubmitBtn.disabled = false;
    renderPlanner();
    if (currentView === "planner") {
      plannerInput.focus();
    }
  }
}
