chrome.runtime.onInstalled.addListener(() => {
    // Create context menu for right-click ticker lookup
    chrome.contextMenus.create({
      id: "lookupStock",
      title: "Lookup Stock Info",
      contexts: ["selection"]
    });
  });
  
  // Listen for context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookupStock" && info.selectionText) {
      // Send the selected text to the content script for processing
      chrome.tabs.sendMessage(tab.id, {
        action: "lookupStock",
        ticker: info.selectionText.trim()
      });
    }
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStockData") {
      fetchStockData(request.ticker)
        .then(data => sendResponse(data))
        .catch(error => sendResponse({ error: error.message }));
      return true; // Required for async sendResponse
    }
    
    if (request.action === "getCompanyProfile") {
      fetchCompanyProfile(request.ticker)
        .then(data => sendResponse(data))
        .catch(error => sendResponse({ error: error.message }));
      return true; // Required for async sendResponse
    }
  });
  
  // Function to fetch stock data from a public API
  async function fetchStockData(ticker) {
    try {
      // Using Alpha Vantage API (you'll need to get a free API key)
      const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "YOUR_ALPHA_VANTAGE_API_KEY";
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`);
      const data = await response.json();
      
      if (data["Global Quote"]) {
        return {
          ticker: ticker,
          price: data["Global Quote"]["05. price"],
          change: data["Global Quote"]["09. change"],
          changePercent: data["Global Quote"]["10. change percent"],
          error: null
        };
      } else {
        throw new Error("Unable to find stock data");
      }
    } catch (error) {
      throw new Error(`Error fetching stock data: ${error.message}`);
    }
  }
  
  // Also fetch company profile and valuation data
  async function fetchCompanyProfile(ticker) {
    try {
      // Using Financial Modeling Prep API (you'll need to get a free API key)
      const API_KEY = process.env.FMP_API_KEY || "YOUR_FMP_API_KEY";
      const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${API_KEY}`);
      const data = await response.json();
      
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
      } else {
        throw new Error("Unable to find company profile");
      }
    } catch (error) {
      throw new Error(`Error fetching company profile: ${error.message}`);
    }
  }
  
  // Helper function to format market cap
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
  
  // Helper function to generate analyst rating
  function getRating(currentPrice, targetPrice) {
    if (!currentPrice || !targetPrice) return 'N/A';
    
    const difference = ((targetPrice - currentPrice) / currentPrice) * 100;
    
    if (difference >= 15) {
      return 'Strong Buy';
    } else if (difference >= 5) {
      return 'Buy';
    } else if (difference >= -5) {
      return 'Hold';
    } else if (difference >= -15) {
      return 'Sell';
    } else {
      return 'Strong Sell';
    }
  }