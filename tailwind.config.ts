import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reference your CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#004D40", // Deep teal for financial security (trustworthy)
          dark: "#0d4029", // Darker shade for hover/focus
        },
        secondary: {
          DEFAULT: "#10B981", // Chime green (good for success)
          dark: "#0E9E6E", // Slightly darker green for hover effects
          light: "#D1FAE5", // Very light green for background highlights
        },
        neutral: {
          DEFAULT: "#F3F4F6", // Light gray for neutral UI elements
          dark: "#E5E7EB", // Slightly darker gray for hover states
        },
        accent: "var(--accent)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Arial", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
    },
  },
  plugins: [
    // Optional: Add plugins like forms or typography if needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
} satisfies Config;
