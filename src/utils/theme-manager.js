/**
 * Theme manager module for Smart Stock Insights
 * Manages theme based on market conditions
 */

// Theme colors
const THEME_COLORS = {
    bull: {
      primary: '#4CAF50',
      secondary: '#81C784',
      light: '#E8F5E9',
      text: '#1B5E20'
    },
    bear: {
      primary: '#F44336',
      secondary: '#E57373',
      light: '#FFEBEE',
      text: '#B71C1C'
    },
    neutral: {
      primary: '#2196F3',
      secondary: '#64B5F6',
      light: '#E3F2FD',
      text: '#0D47A1'
    }
  };
  
  /**
   * Get theme based on market condition
   * @param {boolean} isBullish - Whether market is bullish
   * @param {boolean} useMarketTheme - Whether to use market theme
   * @returns {Object} - Theme color object
   */
  export function getTheme(isBullish, useMarketTheme = true) {
    if (!useMarketTheme) {
      return THEME_COLORS.neutral;
    }
    
    return isBullish ? THEME_COLORS.bull : THEME_COLORS.bear;
  }
  
  /**
   * Apply theme to element
   * @param {HTMLElement} element - Element to apply theme to
   * @param {Object} theme - Theme object
   * @param {string} elementType - Type of element
   */
  export function applyTheme(element, theme, elementType = 'default') {
    switch (elementType) {
      case 'button':
        element.style.backgroundColor = theme.primary;
        element.style.color = 'white';
        break;
      case 'card':
        element.style.borderColor = theme.secondary;
        element.style.backgroundColor = theme.light;
        break;
      case 'text':
        element.style.color = theme.text;
        break;
      case 'icon':
        element.style.color = theme.primary;
        break;
      default:
        element.style.backgroundColor = theme.primary;
        element.style.color = 'white';
    }
  }