module.exports = {
    "env": {
      "browser": true,
      "es2021": true,
      "node": true,
      "webextensions": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single", { "allowTemplateLiterals": true }],
      "semi": ["error", "always"],
      "no-unused-vars": ["warn"],
      "no-console": ["off"]
    }
  };