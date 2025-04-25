document.addEventListener('DOMContentLoaded', function() {
    // Get the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Display current page info
      document.getElementById('current-page').textContent = currentTab.title;
      
      // Get identified companies from storage for this tab
      chrome.storage.local.get(['identifiedCompanies'], function(result) {
        const companies = result.identifiedCompanies || {};
        const tabCompanies = companies[currentTab.url] || [];
        
        if (tabCompanies.length > 0) {
          displayCompanies('companies-container', tabCompanies);
        }
      });
      
      // Get watchlist from storage
      chrome.storage.local.get(['watchlist'], function(result) {
        const watchlist = result.watchlist || [];
        
        if (watchlist.length > 0) {
          displayCompanies('watchlist-container', watchlist);
        }
      });
    });
    
    // Theme toggle listener
    document.getElementById('theme-toggle').addEventListener('change', function(e) {
      const useMarketTheme = e.target.checked;
      
      chrome.storage.local.set({useMarketTheme: useMarketTheme});
      
      // Update theme indicator
      updateThemeIndicator(useMarketTheme);
    });
    
    // Get theme setting from storage
    chrome.storage.local.get(['useMarketTheme'], function(result) {
      const useMarketTheme = result.useMarketTheme !== undefined ? result.useMarketTheme : true;
      
      document.getElementById('theme-toggle').checked = useMarketTheme;
      updateThemeIndicator(useMarketTheme);
    });
  });
  
  // Function to display companies in a container
  function displayCompanies(containerId, companies) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    companies.forEach(company => {
      const item = document.createElement('div');
      item.className = 'company-item';
      
      item.innerHTML = `
        <span class="company-name">${company.name}</span>
        <span class="company-ticker">(${company.ticker})</span>
      `;
      
      item.addEventListener('click', function() {
        // Send message to content script to show stock panel for this ticker
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "lookupStock",
            ticker: company.ticker
          });
          
          // Close popup
          window.close();
        });
      });
      
      container.appendChild(item);
    });
  }
  
  // Function to update theme indicator
  function updateThemeIndicator(useMarketTheme) {
    const indicator = document.querySelector('.theme-indicator');
    
    if (useMarketTheme) {
      // Get market condition from storage
      chrome.storage.local.get(['marketCondition'], function(result) {
        const isBullish = result.marketCondition !== undefined ? result.marketCondition : true;
        
        if (isBullish) {
          indicator.className = 'theme-indicator theme-bull';
        } else {
          indicator.className = 'theme-indicator theme-bear';
        }
      });
    } else {
      // Default theme (neutral)
      indicator.className = 'theme-indicator theme-bull';
    }
  }