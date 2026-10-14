import type { Config } from "tailwindcss";
// SMB Agents AI brand tokens — see docs/brand-book.md
// "clay" = Operator Coral (shared with Hello Operator's #ED7347). Kept the `clay` key so existing classes keep working.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      cream: "#FBF7F0",          // Paper
      ink: "#2B2420",            // Espresso ink
      clay: { 50: "#FDF0EA", 100: "#FBDCCD", 300: "#F5A27F", 500: "#ED7347", 600: "#C9502A", 700: "#9A3B1C" }, // Operator Coral
      coral: { 50: "#FDF0EA", 100: "#FBDCCD", 500: "#ED7347", 600: "#C9502A", 700: "#9A3B1C" },
      mustard: { 50: "#FEF6E2", 100: "#FCEBC0", 400: "#F4B740", 600: "#B7800F" }, // Switchboard Lamp
      sage: { 50: "#F1F6EF", 100: "#E2ECDF", 500: "#7FA07A", 600: "#4F7A55" },     // Gary's arms
    },
    fontFamily: {
      sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      serif: ["var(--font-display)", "Georgia", "Cambria", "serif"],
    },
    boxShadow: { pop: "3px 3px 0 0 #2B2420" },
  } },
  plugins: [],
} satisfies Config;
