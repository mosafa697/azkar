/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        scheherazade: ['ScheherazadeNew', 'serif'],
      },
      // Theme color definitions for light/solarized/dark
      colors: {
        light: {
          bg: "#fefefe",
          "button-bg": "#f9fafb",
          "button-border": "#e5e7eb",
          "button-hover": "#f3f4f6",
          card: "#ffffff",
          icon: "#575b63",
          "icon-active": "#ffffff",
          "secondary-bg": "#f9fafb",
          "secondary-text": "#6b7280",
          "slider-bg": "#f0f0f0",
          "slider-bg-active": "#3b82f6",
          text: "#111827",
        },
        solarized: {
          bg: "#f8ede0",
          "button-bg": "#f8ede0",
          "button-border": "#93a1a1",
          "button-hover": "#d3d3d3",
          card: "#fff9f4",
          icon: "#00753a",
          "icon-active": "#ffffff",
          "secondary-bg": "#f8ede0",
          "secondary-text": "#657b83",
          "slider-bg": "#f8ede0",
          "slider-bg-active": "#00753a",
          text: "#363739",
        },
        dark: {
          bg: "#1e293b",
          "button-bg": "#475569",
          "button-border": "#64748b",
          "button-hover": "#1e293b",
          card: "#334155",
          icon: "#dcebff",
          "icon-active": "#ffffff",
          "secondary-bg": "#475569",
          "secondary-text": "#94a3b8",
          "slider-bg": "#64748b",
          "slider-bg-active": "#2563eb",
          text: "#f8fafc",
        },
      },
      // Custom animations
      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        pop: {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.25)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease",
        pop: "pop 0.3s ease",
      },
      // Custom font size utilities (for dynamic font scaling)
      fontSize: {
        "2.3dvh": "2.3dvh",
        "2.6dvh": "2.6dvh",
        "2.8dvh": "2.8dvh",
        "3dvh": "3dvh",
      },
      // Custom height/width utilities for dvh units
      height: {
        "50dvh": "50dvh",
        "100dvh": "100dvh",
      },
      minHeight: {
        "50dvh": "50dvh",
        "100dvh": "100dvh",
      },
      width: {
        "20dvh": "20dvh",
        fill: "-webkit-fill-available",
      },
      // Padding for dvh units
      padding: {
        "2dvh": "2dvh",
        "3dvh": "3dvh",
      },
      // Content padding for dvh units
      maxHeight: {
        "100dvh": "100dvh",
      },
    },
  },
  plugins: [],
};
