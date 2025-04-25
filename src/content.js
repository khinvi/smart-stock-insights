// CSS Injection
const style = document.createElement('style');
style.textContent = `
  #stock-insights-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #4CAF50;
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  }
  #stock-insights-button:hover {
    transform: scale(1.1);
  }
`;
document.head.appendChild(style);

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait for the page to fully load
  window.setTimeout(analyzePageContent, 1500);
});

// Store identified entities
let identifiedEntities = [];

// Function to analyze page content for entity recognition
function analyzePageContent() {
  // Get the current domain
  const domain = window.location.hostname;
  
  // Check for known companies based on domain
  const knownDomains = {
    "google.com": "GOOG",
    "amazon.com": "AMZN",
    "apple.com": "AAPL",
    "microsoft.com": "MSFT",
    "facebook.com": "META",
    "netflix.com": "NFLX",
    "tesla.com": "TSLA",
    // Add more domains as needed
  };
  
  // Look for a direct domain match
  for (const [domainKey, ticker] of Object.entries(knownDomains)) {
    if (domain.includes(domainKey)) {
      showStockInfoBanner(ticker);
      break;
    }
  }
  
  // Parse page content for entity recognition
  const pageText = document.body.innerText;
  identifyEntities(pageText);
}

// Import entity detection 
async function identifyEntities(text) {
  try {
    // Dynamic import of entity detection module
    const entityModule = await import('./utils/entity-detection.js');
    identifiedEntities = entityModule.detectEntities(text);
    
    // If entities found, create a floating button to show stock info
    if (identifiedEntities.length > 0) {
      createFloatingButton();
    }
  } catch (error) {
    console.error('Error loading entity detection module:', error);
    
    // Fallback to simplified detection
    const companyMap = {
      "Google": "GOOG",
      "Alphabet": "GOOG",
      "Amazon": "AMZN",
      "AWS": "AMZN",
      "Apple": "AAPL",
      "Microsoft": "MSFT",
      "Azure": "MSFT",
      "Facebook": "META",
      "Meta": "META",
      "Netflix": "NFLX",
      "Tesla": "TSLA",
      "Nvidia": "NVDA",
      "AMD": "AMD",
      "Intel": "INTC",
      // Add more company names and their products/subsidiaries
    };
    
    // Clear previous entities
    identifiedEntities = [];
    
    // Simple entity recognition
    for (const [company, ticker] of Object.entries(companyMap)) {
      const regex = new RegExp(`\\b${company}\\b`, 'gi');
      if (regex.test(text)) {
        // Add to identified entities if not already included
        if (!identifiedEntities.some(entity => entity.ticker === ticker)) {
          identifiedEntities.push({
            name: company,
            ticker: ticker
          });
        }
      }
    }
    
    // If entities found, create a floating button to show stock info
    if (identifiedEntities.length > 0) {
      createFloatingButton();
    }
  }
}

// Function to create a floating button for identified entities
function createFloatingButton() {
  // Remove existing button if any
  const existingButton = document.getElementById('stock-insights-button');
  if (existingButton) {
    existingButton.remove();
  }
  
  // Create a floating button
  const button = document.createElement('div');
  button.id = 'stock-insights-button';
  button.innerText = '📈';
  button.title = 'Show Stock Insights';
  
  // Add click event to show stock panel
  button.addEventListener('click', () => {
    showStockPanel();
  });
  
  // Add to page
  document.body.appendChild(button);
}

// Function to show stock info banner for main company
function showStockInfoBanner(ticker) {
  chrome.runtime.sendMessage({ action: "getStockData", ticker: ticker }, (response) => {
    if (response && !response.error) {
      // Create banner
      const banner = document.createElement('div');
      banner.id = 'stock-insights-banner';
      
      // Set theme based on stock performance
      const isPositive = parseFloat(response.change) >= 0;
      const themeColor = isPositive ? '#4CAF50' : '#F44336';
      
      // Style the banner
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.width = '100%';
      banner.style.backgroundColor = themeColor;
      banner.style.color = 'white';
      banner.style.padding = '10px';
      banner.style.boxSizing = 'border-box';
      banner.style.zIndex = '9999';
      banner.style.display = 'flex';
      banner.style.justifyContent = 'space-between';
      banner.style.alignItems = 'center';
      
      // Add content
      banner.innerHTML = `
        <div>${ticker}: $${parseFloat(response.price).toFixed(2)} ${response.changePercent}</div>
        <button id="view-details-btn" style="background-color: white; color: ${themeColor}; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View Details</button>
        <button id="close-banner-btn" style="background-color: transparent; color: white; border: none; font-size: 16px; cursor: pointer;">✕</button>
      `;
      
      // Add to page
      document.body.appendChild(banner);
      
      // Add click handlers
      document.getElementById('view-details-btn').addEventListener('click', () => {
        showStockPanel(ticker);
      });
      
      document.getElementById('close-banner-btn').addEventListener('click', () => {
        banner.remove();
      });
      
      // Push document content down to avoid overlap
      document.body.style.marginTop = banner.offsetHeight + 'px';
      
      // Update market condition in storage
      chrome.storage.local.set({
        marketCondition: isPositive
      });
    }
  });
}

// Function to show the stock panel
function showStockPanel(specificTicker = null) {
  // Remove existing panel if any
  const existingPanel = document.getElementById('stock-insights-panel');
  if (existingPanel) {
    existingPanel.remove();
    return;
  }
  
  // Create panel
  const panel = document.createElement('div');
  panel.id = 'stock-insights-panel';
  
  // Style the panel
  panel.style.position = 'fixed';
  panel.style.top = '50%';
  panel.style.left = '50%';
  panel.style.transform = 'translate(-50%, -50%)';
  panel.style.width = '600px';
  panel.style.maxHeight = '80vh';
  panel.style.backgroundColor = 'white';
  panel.style.borderRadius = '8px';
  panel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  panel.style.zIndex = '10000';
  panel.style.overflow = 'auto';
  panel.style.padding = '20px';
  panel.style.boxSizing = 'border-box';
  
  // Add initial content
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0;">Stock Insights</h2>
      <button id="close-panel-btn" style="background-color: transparent; border: none; font-size: 20px; cursor: pointer;">✕</button>
    </div>
    <div id="panel-content">
      <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
        <div class="loader" style="border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  // Add to page
  document.body.appendChild(panel);
  
  // Add close button handler
  document.getElementById('close-panel-btn').addEventListener('click', () => {
    panel.remove();
  });
  
  // Load panel content
  if (specificTicker) {
    loadStockData(specificTicker);
  } else if (identifiedEntities.length > 0) {
    loadEntitiesList();
  } else {
    document.getElementById('panel-content').innerHTML = `
      <p>No companies identified on this page. Try using the right-click menu to look up a specific stock.</p>
    `;
  }
}

// Function to load the list of identified entities
function loadEntitiesList() {
  let html = `
    <h3>Companies Identified on This Page</h3>
    <ul style="list-style: none; padding: 0;">
  `;
  
  identifiedEntities.forEach(entity => {
    html += `
      <li style="padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;" 
          onclick="window.loadStockData('${entity.ticker}')">
        <div style="font-weight: bold;">${entity.name} (${entity.ticker})</div>
        <div style="color: #666; font-size: 0.9em;">Click to view details</div>
      </li>
    `;
  });
  
  html += `</ul>`;
  
  document.getElementById('panel-content').innerHTML = html;
  
  // Add function to window for click handlers
  window.loadStockData = loadStockData;
  
  // Store identified companies in storage
  chrome.storage.local.set({
    identifiedCompanies: {
      [window.location.href]: identifiedEntities
    }
  });
}

// Function to load stock data for a specific ticker
function loadStockData(ticker) {
  document.getElementById('panel-content').innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
      <div class="loader" style="border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
    </div>
  `;
  
  // Fetch stock data
  chrome.runtime.sendMessage({ action: "getStockData", ticker: ticker }, (stockData) => {
    if (stockData && !stockData.error) {
      // Fetch company profile in parallel
      chrome.runtime.sendMessage({ action: "getCompanyProfile", ticker: ticker }, (profileData) => {
        displayStockDetails(ticker, stockData, profileData || null);
      });
    } else {
      document.getElementById('panel-content').innerHTML = `
        <div style="color: red; text-align: center;">
          <p>Error loading stock data for ${ticker}</p>
          <p>${stockData ? stockData.error : 'Unknown error'}</p>
        </div>
      `;
    }
  });
}

// Function to display stock details
function displayStockDetails(ticker, stockData, profileData) {
  // Determine theme color based on stock performance
  const isPositive = parseFloat(stockData.change) >= 0;
  const themeColor = isPositive ? '#4CAF50' : '#F44336';
  
  // Format numbers
  const price = parseFloat(stockData.price).toFixed(2);
  const change = parseFloat(stockData.change).toFixed(2);
  const changePercent = stockData.changePercent;
  
  // Create HTML content
  let html = `
    <div style="border-bottom: 2px solid ${themeColor}; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="margin: 0; font-size: 24px;">${ticker}</h3>
          ${profileData ? `<div style="color: #666;">${profileData.name}</div>` : ''}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; font-weight: bold;">$${price}</div>
          <div style="color: ${isPositive ? '#4CAF50' : '#F44336'};">
            ${isPositive ? '▲' : '▼'} ${change} (${changePercent})
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add mini graph with a placeholder (in a real extension, this would be a real chart)
  html += `
    <div style="margin-bottom: 20px;">
      <h4 style="margin-top: 0;">Price History</h4>
      <div id="mini-chart" style="height: 150px; background-color: #f9f9f9; border-radius: 4px; padding: 10px; position: relative;">
        <!-- Simplified Chart Visualization -->
        <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
          <path d="M0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,5 L70,15 L80,25 L90,20 L100,${isPositive ? '5' : '35'}" 
                fill="none" stroke="${themeColor}" stroke-width="2"/>
        </svg>
        
        <!-- Event Marker Example -->
        <div style="position: absolute; bottom: 0; right: 20%; width: 2px; height: 80%; background-color: #888; opacity: 0.5;"></div>
        <div style="position: absolute; bottom: 0; right: 20%; transform: translateX(10px); background-color: #888; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
          Earnings
        </div>
      </div>
    </div>
  `;
  
  // Add valuation quick view
  if (profileData) {
    html += `
      <div style="margin-bottom: 20px;">
        <h4 style="margin-top: 0;">Valuation & Key Metrics</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
            <div style="font-size: 12px; color: #666;">P/E Ratio</div>
            <div style="font-weight: bold;">${profileData.pe || 'N/A'}</div>
          </div>
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
            <div style="font-size: 12px; color: #666;">Market Cap</div>
            <div style="font-weight: bold;">${profileData.marketCap || 'N/A'}</div>
          </div>
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
            <div style="font-size: 12px; color: #666;">Dividend Yield</div>
            <div style="font-weight: bold;">${profileData.dividend || 'N/A'}</div>
          </div>
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
            <div style="font-size: 12px; color: #666;">52-Week High</div>
            <div style="font-weight: bold;">${profileData.high52 || 'N/A'}</div>
          </div>
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
            <div style="font-size: 12px; color: #666;">52-Week Low</div>
            <div style="font-weight: bold;">${profileData.low52 || 'N/A'}</div>
          </div>
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
            <div style="font-size: 12px; color: #666;">Analyst Rating</div>
            <div style="font-weight: bold;">${profileData.rating || 'N/A'}</div>
          </div>
        </div>
      </div>
    `;
    
    // Add company info
    html += `
      <div>
        <h4 style="margin-top: 0;">Company Information</h4>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
          <div style="margin-bottom: 10px;"><strong>Sector:</strong> ${profileData.sector || 'N/A'}</div>
          <div style="margin-bottom: 10px;"><strong>Industry:</strong> ${profileData.industry || 'N/A'}</div>
          <div style="margin-bottom: 10px;"><strong>CEO:</strong> ${profileData.ceo || 'N/A'}</div>
          <div style="margin-bottom: 15px;"><strong>Website:</strong> <a href="${profileData.website || '#'}" target="_blank">${profileData.website || 'N/A'}</a></div>
          <div><strong>Description:</strong> ${profileData.description || 'No description available.'}</div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div style="text-align: center; color: #666; padding: 20px;">
        <p>Additional company information not available.</p>
      </div>
    `;
  }
  
  // Update content
  document.getElementById('panel-content').innerHTML = html;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "lookupStock" && request.ticker) {
    showStockPanel(request.ticker);
  }
});