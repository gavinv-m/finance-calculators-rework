const prefixSelector = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    // prefixSelector({
    //   prefix: '.lwg_finance_calculator',
    //   transform: (prefix, selector, prefixedSelector) => {
    //     if (selector.startsWith('html') || selector.startsWith('body'))
    //       return selector;
    //     return prefixedSelector;
    //   },
    // }),
  ],
};
