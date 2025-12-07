const withMT = require('@material-tailwind/react/utils/withMT');
const path = require('path');

module.exports = withMT({
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, '../../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, '../../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
