# Feedback App

Gather feedback from your users with this app.

## Installation

1. Make sure you have enabled `opt_in_site_apps: true` in your posthog-js config.
2. Install the app from the PostHog App Repository
3. Customise the text, and enable the plugin
4. Either select "Show feedback button on the page" or add a button with a corresponding data attribute e.g. `data-attr='posthog-feedback-button'` which when clicked will open the feedback widget 
4. Each feedback from your users is now captured as a custom `Feedback Sent` event
5. You can now use this event to trigger PostHog actions, or create a funnel to see how many users are giving feedback.

## Demo

![2022-10-14 11 44 41](https://user-images.githubusercontent.com/53387/195816802-ab1d4987-35f3-496d-9e97-4b85c2f66cfc.gif)

## Local development

For local development, clone the repo and run

```bash
npx @posthog/app-dev-server
```

or

```bash
pnpm install
pnpm start
```
