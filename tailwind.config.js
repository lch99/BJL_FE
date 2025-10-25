module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fff7e6',
                    100: '#ffedcc',
                    200: '#ffd999',
                    300: '#ffc266',
                    400: '#ffaa33',
                    500: '#ff9900',     // main orange
                    600: '#e68a00',
                    700: '#cc7a00',
                    800: '#b36b00',
                    900: '#994c00',
                },
                accent: {
                    500: '#ffd54f',     // yellow accent
                },
            },
        },
    },
    plugins: [],
}
