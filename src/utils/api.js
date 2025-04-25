/**
 * API utilities for Smart Stock Insights
 */

// API endpoints
const API_ENDPOINTS = {
    alphaVantage: 'https://www.alphavantage.co/query',
    financialModelingPrep: 'https://financialmodelingprep.com/api/v3',
    iexCloud: 'https://cloud.iexapis.com/stable'
  };
  
  // Cache for API responses
  const apiCache = new Map();
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
  
  /**
   * Fetch data from API with caching
   * @param {string} url - API URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - API response
   */
  export async function fetchWithCache(url, options = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    
    // Check cache
    if (apiCache.has(cacheKey)) {
      const cachedData = apiCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
        return cachedData.data;
      }
      // Cache expired, remove it
      apiCache.delete(cacheKey);
    }
    
    // Fetch fresh data
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store in cache
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }
  
  /**
   * Get stock quote data
   * @param {string} ticker - Stock ticker
   * @returns {Promise<Object>} - Stock quote data
   */
  export async function getStockQuote(ticker) {
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'YOUR_ALPHA_VANTAGE_API_KEY';
    const url = `${API_ENDPOINTS.alphaVantage}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
    
    const data = await fetchWithCache(url);
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      return {
        ticker,
        price: data['Global Quote']['05. price'],
        change: data['Global Quote']['09. change'],
        changePercent: data['Global Quote']['10. change percent'],
        volume: data['Global Quote']['06. volume'],
        latestTradingDay: data['Global Quote']['07. latest trading day'],
        error: null
      };
    }
    
    throw new Error('Unable to retrieve stock quote data');
  }
  
  /**
   * Get company profile data
   * @param {string} ticker - Stock ticker
   * @returns {Promise<Object>} - Company profile data
   */
  export async function getCompanyProfile(ticker) {
    const API_KEY = process.env.FMP_API_KEY || 'YOUR_FMP_API_KEY';
    const url = `${API_ENDPOINTS.financialModelingPrep}/profile/${ticker}?apikey=${API_KEY}`;
    
    const data = await fetchWithCache(url);
    
    if (data && data.length > 0) {
      return {
        name: data[0].companyName,
        sector: data[0].sector,
        industry: data[0].industry,
        description: data[0].description,
        ceo: data[0].ceo,
        website: data[0].website,
        pe: data[0].pe,
        marketCap: formatMarketCap(data[0].mktCap),
        dividend: data[0].lastDiv ? data[0].lastDiv.toFixed(2) + '%' : 'N/A',
        high52: '$' + data[0].range.split('-')[1].trim(),
        low52: '$' + data[0].range.split('-')[0].trim(),
        rating: getRating(data[0].price, data[0].targetPrice),
        error: null
      };
    }
    
    throw new Error('Unable to retrieve company profile data');
  }
  
  /**
   * Format market capitalization
   * @param {number} marketCap - Market capitalization
   * @returns {string} - Formatted market cap
   */
  function formatMarketCap(marketCap) {
    if (!marketCap) return 'N/A';
    
    if (marketCap >= 1e12) {
      return '$' + (marketCap / 1e12).toFixed(2) + 'T';
    } else if (marketCap >= 1e9) {
      return '$' + (marketCap / 1e9).toFixed(2) + 'B';
    } else if (marketCap >= 1e6) {
      return '$' + (marketCap / 1e6).toFixed(2) + 'M';
    } else {
      return '$' + marketCap.toFixed(2);
    }
  }
  
  /**
   * Generate analyst rating based on price targets
   * @param {number} currentPrice - Current stock price
   * @param {number} targetPrice - Target price