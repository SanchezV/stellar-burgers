import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://127.0.0.1:4000',
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
  },
});
