/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // your project paths
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    main: "var(--theme-main)",
                    secondary: "var(--theme-secondary)",
                    accent: "var(--theme-accent)",
                    text: {
                        light: "var(--theme-text-light)",
                        dark: "var(--theme-text-dark)",
                    },
                    surface: "var(--theme-surface)",
                    surfaceLight: "var(--theme-surface-light)",
                    border: "var(--theme-border)",
                    sales: "var(--theme-sales)",
                    profit: "var(--theme-profit)",
                    dropdownHover: "var(--theme-dropdown-hover)",
                },
            },
        },
    },
    plugins: [],
};
