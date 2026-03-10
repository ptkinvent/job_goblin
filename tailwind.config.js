/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{js,jsx}", "../templates/**/*.html"],
  safelist: [
    "h-full",

    // Alerts
    "text-primary-500",
    "text-primary-700",
    "bg-primary-50",
    "bg-primary-500",
    "dark:bg-primary-900",
    "dark:border-primary-950",

    "text-secondary-500",
    "text-secondary-700",
    "bg-secondary-50",
    "bg-secondary-500",
    "dark:bg-secondary-900",
    "dark:border-secondary-950",

    "text-info-500",
    "text-info-700",
    "bg-info-50",
    "bg-info-500",
    "dark:bg-info-900",
    "dark:border-info-950",

    "text-success-500",
    "text-success-700",
    "bg-success-50",
    "bg-success-500",
    "dark:bg-success-900",
    "dark:border-success-950",

    "text-warning-500",
    "text-warning-700",
    "bg-warning-50",
    "bg-warning-500",
    "dark:bg-warning-900",
    "dark:border-warning-950",

    "text-danger-500",
    "text-danger-700",
    "bg-danger-50",
    "bg-danger-500",
    "dark:bg-danger-900",
    "dark:border-danger-950",

    "text-alert-500",
    "text-alert-700",
    "bg-alert-50",
    "bg-alert-500",
    "dark:bg-alert-900",
    "dark:border-alert-950",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1366px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.indigo,
        info: colors.sky,
        secondary: colors.zinc,
        warning: colors.yellow,
        alert: colors.amber,
        danger: colors.red,
        success: colors.green,
        dark: colors.black,
      },
    },
  },
};
