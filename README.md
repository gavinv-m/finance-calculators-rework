# Real Estate Financial Calculators

This project provides interactive calculators for house flipping, retirement planning, and rental property investment. It’s built with vanilla JavaScript and bundled using Webpack.

## Features

- Dynamic house flip profit/loss projections
- Retirement savings & income estimation
- Rental property cash flow and equity projections
- Real-time updates as users enter data
- PDF export support for generated reports

## How It Works (User Overview)

- Users fill in form fields related to purchase, renovation, rent, retirement, etc.
- Each form input triggers a specific calculator to update results in real-time.
- Results are displayed instantly in the UI, with table adjustments and visual clarity.
- Users can export results to PDF.

## How It Works (Developer Overview)

The app is initialized from `src/index.js`, where calculators and utilities are imported. The app listens for user input and executes logic from the relevant calculator modules.

### File Structure

src/
├── calculators/
│ ├── house-flip.js
│ ├── calculate-retirement.js
│ └── rental.js
├── utils/
│ ├── update-table-range.js
│ └── populate-years-dropdown.js
├── downloaders/
│ └── pdf-event-listeners.js
├── style.css
└── index.js

### Logic Flow

- `DOMContentLoaded` event attaches listeners to input fields.
- Each calculator module runs on relevant inputs and updates DOM.
- A dropdown for rental projection years updates dynamically.
- PDF export listeners are initialized.
- Calculators are invoked once at load for initial output.

## Styling Note

To fix a flickering issue during initial page load, visibility is hidden in the HTML `<head>`:

```html
<style>
  html {
    visibility: hidden;
    opacity: 0;
  }
</style>
```

And then restored at the bottom of the CSS file:

```css
html {
  visibility: visible;
  opacity: 1;
}
```

This prevents the user from seeing unstyled or flashing content.

## Build & Run

Install dependencies:

```bash
npm install
```

Bundle with Webpack:

```bash
npm run build
```

Start a dev server (if configured):

```bash
npm run start
```
