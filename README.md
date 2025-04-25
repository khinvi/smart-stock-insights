# Smart Stock Insights

![Status](https://img.shields.io/badge/Status-In_Progress-yellow)

A browser extension that displays relevant stock information based on the current website you're browsing. For example, it shows GOOG data when on Google.com.

## Features

### 1. Entity Recognition
- Detects company names, key executives, products, or subsidiaries mentioned on the page and links them to their stock tickers
- Example: Detects "AWS" → $AMZN on a tech blog

### 2. Mini Graph with Events Overlay
- Provides a sparkline chart with annotations for important events like earnings reports
- Visualizes stock performance with event markers for context

### 3. Valuation Quick View
- Shows key metrics like P/E, EPS, revenue growth, analyst rating in a compact view
- Get instant fundamental analysis at a glance

### 4. Right-Click Ticker Lookup
- Right-click on any text → "Lookup stock info" for instant stock data
- Works with company names or ticker symbols

### 5. Theme Integration
- Matches extension theme with market condition (red for bear, green for bull)
- Visual cues for market sentiment

## Installation

### For Development

1. Clone this repository:
```bash
git clone https://github.com/yourusername/smart-stock-insights.git
cd smart-stock-insights
```

2. Install dependencies:
```bash
npm install
```

3. Generate icons (if needed):
```bash
node scripts/create-icons.js
```

4. Build the extension:
```bash
npm run build
```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top right
   - Click "Load unpacked" and select the `dist` directory

### For Users

1. Download the latest release from the [Releases page](https://github.com/yourusername/smart-stock-insights/releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" by toggling the switch in the top right
5. Click "Load unpacked" and select the extracted directory

## API Keys

This extension uses two external APIs:
- Alpha Vantage API for stock data
- Financial Modeling Prep API for company profiles

To use these APIs:
1. Sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free API key at [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs/)
3. Create a file named `.env` in the root directory with the following content:
```
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
FMP_API_KEY=your_fmp_key_here
```
4. Run the build script which will inject these keys into the extension:
```bash
npm run build
```

## Usage

### Entity Recognition
- Navigate to any website that mentions companies or their products
- The extension automatically detects companies and shows a floating button
- Click the button to see all identified companies

### Right-Click Lookup
- Select any text that might be a company name or ticker
- Right-click and select "Lookup Stock Info"
- View detailed stock information

### Theme Integration
- Open the extension popup by clicking its icon in the toolbar
- Toggle the "Theme: Market Condition" switch to enable/disable theme integration

## Development

### Scripts

- `npm run build` - Build the extension
- `npm run dev` - Build with watch mode for development
- `npm run lint` - Run linter
- `npm run test` - Run tests
- `npm run package` - Create a distributable ZIP file

### Adding Companies to Entity Recognition

To add more companies to the entity recognition database, just edit `src/utils/entity-detection.js`:

```javascript
// Add entries to the companyMap object
const companyMap = {
  // Existing entries...
  "Your Company Name": "TICKER",
  "Product Name": "TICKER",
  // ...
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [Alpha Vantage](https://www.alphavantage.co/) for stock data API
- [Financial Modeling Prep](https://financialmodelingprep.com/) for company profile data

## Screenshots

### Entity Recognition
![Entity Recognition](assets/entity-recognition.png)

### Stock Detail Panel
![Stock Detail Panel](assets/stock-detail.png)

### Right-Click Lookup
![Right-Click Lookup](assets/right-click.png)

### Theme Integration
![Theme Integration](assets/theme.png)

## Roadmap

Future features I'm considering:
- Portfolio tracker integration
- Advanced technical indicators
- News sentiment analysis
- Mobile browser support
- Social media mention tracking

## Troubleshooting

### Common Issues

**API Rate Limits**: Both Alpha Vantage and Financial Modeling Prep have rate limits on their free tiers. If you're seeing errors when fetching data, you may have hit these limits.

**Permission Issues**: Make sure you've granted the extension all required permissions when installing.

**Extension Conflicts**: If you have other stock-related extensions installed, they might conflict with Smart Stock Insights.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/smart-stock-insights/issues) page to see if it's already been reported
2. If not, create a new issue with detailed information about the problem

## Privacy Policy

Smart Stock Insights doesn't collect or store personal data from users. It simply only processes data locally on your device and makes API calls directly to third-party services to fetch stock information.

## Disclaimer

Apparently I have to say that this extension is for informational purposes only. The stock data provided should not be considered financial advice. Always do your own research before making investment decisions.
