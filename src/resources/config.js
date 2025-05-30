// https://once-ui.com/docs/color

const baseURL = "DeCode.xyz";

const mode = {
  language: "zh",
  cascaderMode: {
    withProgress: false,
  },
  dark: {},
  light: {},
  phone: {
    routes: {
      "/": true,
      "/my-info": true,
      "/courses": false,
      "/about": false,
    },
  },
  desktop: {
    routes: {
      "/": true,
      "/my-info": true,
      "/courses": true,
      "/about": true,
    },
  },
};

const style = {
  theme: "dark",
  brand: "indigo",
  accent: "violet",
  neutral: "slate",
  border: "conservative",
  solid: "contrast",
  solidStyle: "flat",
  surface: "translucent",
  transition: "all",
};

const navStyle = {};

const effects = {
  mask: {
    cursor: true,
    x: 0,
    y: 0,
    radius: 75,
  },
  gradient: {
    display: true,
    x: 50,
    y: 0,
    width: 100,
    height: 100,
    tilt: 0,
    colorStart: "brand-background-strong",
    colorEnd: "static-transparent",
    opacity: 50,
  },
  dots: {
    display: true,
    size: 2,
    color: "brand-on-background-weak",
    opacity: 20,
  },
  lines: {
    display: true,
    color: "neutral-alpha-weak",
    opacity: 80,
  },
  grid: {
    display: false,
    color: "neutral-alpha-weak",
    opacity: 100,
  },
};

const display = {
  location: true,
  time: true,
};

const mailchimp = {
  action: "https://url/subscribe/post?parameters",
  effects: {
    mask: {
      cursor: false,
      x: 100,
      y: 0,
      radius: 100,
    },
    gradient: {
      display: true,
      x: 100,
      y: 50,
      width: 100,
      height: 100,
      tilt: -45,
      colorStart: "accent-background-strong",
      colorEnd: "static-transparent",
      opacity: 100,
    },
    dots: {
      display: false,
      size: 24,
      color: "brand-on-background-weak",
      opacity: 100,
    },
    lines: {
      display: false,
      color: "neutral-alpha-weak",
      opacity: 100,
    },
    grid: {
      display: true,
      color: "neutral-alpha-weak",
      opacity: 100,
    },
  },
};

export { style, effects, display, mailchimp, baseURL, mode };
