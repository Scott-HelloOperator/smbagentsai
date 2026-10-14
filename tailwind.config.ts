import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { cream: "#FBF7F0", ink: "#2B2420", clay: { 50:"#FDF1EA",100:"#FAE0D2",500:"#D9693B",600:"#C2552A",700:"#9E431F" }, sage: { 100:"#E6EFE6", 600:"#4F7A55" } },
    fontFamily: { sans: ["ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","sans-serif"], serif: ["Georgia","Cambria","serif"] },
  } },
  plugins: [],
} satisfies Config;
