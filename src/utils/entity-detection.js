/**
 * Entity detection module for Smart Stock Insights
 * Detects company names, products, executives in text
 */

// Company name to ticker mapping
const companyMap = {
    // Tech companies
    "Google": "GOOG",
    "Alphabet": "GOOG",
    "Amazon": "AMZN",
    "AWS": "AMZN",
    "Apple": "AAPL",
    "Microsoft": "MSFT",
    "Azure": "MSFT",
    "Facebook": "META",
    "Meta": "META",
    "Instagram": "META",
    "WhatsApp": "META",
    "Netflix": "NFLX",
    "Tesla": "TSLA",
    "SpaceX": "PRIVATE",
    "Nvidia": "NVDA",
    "AMD": "AMD",
    "Intel": "INTC",
    
    // Retail companies
    "Walmart": "WMT",
    "Target": "TGT",
    "Costco": "COST",
    "Home Depot": "HD",
    
    // Financial companies
    "JPMorgan": "JPM",
    "JP Morgan": "JPM",
    "Bank of America": "BAC",
    "Goldman Sachs": "GS",
    "Morgan Stanley": "MS",
    "Visa": "V",
    "Mastercard": "MA",
    "PayPal": "PYPL",
    
    // Auto companies
    "Ford": "F",
    "General Motors": "GM",
    "Toyota": "TM",
    "Honda": "HMC",
    "BMW": "BMWYY",
    
    // Executives
    "Tim Cook": "AAPL",
    "Sundar Pichai": "GOOG",
    "Satya Nadella": "MSFT",
    "Mark Zuckerberg": "META",
    "Elon Musk": "TSLA",
    "Jensen Huang": "NVDA",
    "Andy Jassy": "AMZN",
    "Lisa Su": "AMD",
    "Pat Gelsinger": "INTC"
  };
  
  // Keywords that indicate a company reference
  const companyIndicators = [
    "company", "stock", "shares", "CEO", "headquartered",
    "announced", "reported", "earnings", "quarterly", "investors",
    "market", "revenue", "growth", "products", "launched", "unveiled"
  ];
  
  /**
   * Detect company entities in text
   * @param {string} text - The text to analyze
   * @returns {Array} - Array of identified entities
   */
  export function detectEntities(text) {
    const entities = [];
    const paragraphs = text.split(/\n\n+/);
    
    // Check for exact name matches
    for (const [company, ticker] of Object.entries(companyMap)) {
      const regex = new RegExp(`\\b${company}\\b`, 'gi');
      if (regex.test(text)) {
        // Add to identified entities if not already included
        if (!entities.some(entity => entity.ticker === ticker)) {
          entities.push({
            name: company,
            ticker: ticker,
            confidence: 1.0
          });
        }
      }
    }
    
    // Context-based entity detection
    // This is a simplified version - in a real extension, this would use NLP
    paragraphs.forEach(paragraph => {
      // Check if paragraph likely discusses a company
      const hasCompanyIndicator = companyIndicators.some(indicator => 
        paragraph.toLowerCase().includes(indicator.toLowerCase())
      );
      
      if (hasCompanyIndicator) {
        // Look for partial matches or contextual clues
        for (const [company, ticker] of Object.entries(companyMap)) {
          // Skip if already added as exact match
          if (entities.some(entity => entity.ticker === ticker)) {
            continue;
          }
          
          // Look for variations of company name
          const words = company.split(' ');
          if (words.length > 1) {
            // For multi-word company names, check if first word appears
            const firstWord = words[0];
            if (new RegExp(`\\b${firstWord}\\b`, 'gi').test(paragraph)) {
              entities.push({
                name: company,
                ticker: ticker,
                confidence: 0.7
              });
            }
          }
        }
      }
    });
    
    // Filter out private companies for stock lookup
    return entities.filter(entity => entity.ticker !== 'PRIVATE');
  }