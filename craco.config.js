const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "primary-color": "#27448d",
              "link-color": "#ef2f6d",
              "layout-trigger-background": "#12284b",
              "processing-color": "#714783",
              "highlight-color": "#d64574",
              "error-color": "#d64574",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
