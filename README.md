# Feedback App

Gather feedback from your users with this app.

Steps:
1. Install the app from the PostHog App Repository
2. Customise the text, and enable the plugin
3. Each feedback from your users is now captured as a custom `Feedback Sent` event
4. You can now use this event to trigger PostHog actions, or create a funnel to see how many users are giving feedback.

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