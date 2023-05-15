# Feedback App

Gather feedback from your users with this app.

## Installation

1. Make sure you have enabled `opt_in_site_apps: true` in your posthog-js config init.
2. Install the app from the PostHog App Repository
3. Customise the text, and enable the plugin
4. Either select "Show feedback button on the page" or add a button with a corresponding data attribute e.g. `data-attr='posthog-feedback-button'` which when clicked will open the feedback widget
5. Each feedback from your users is now captured as a custom `Feedback Sent` event
6. You can now use this event to trigger PostHog actions, or create a funnel to see how many users are giving feedback.

### Handling overlapping widgets

If there are other widgets in the bottom right hand corner:

-   Use a custom button with the corresponding data attribute e.g. `data-attr='posthog-feedback-button'` which when clicked will open the feedback widget
-   For when the feedback widget opens:
    -   If there is a HubSpot widget present, opening the feedback widget will attempt to use `window.HubSpotConversations?.widget?.remove();`
    -   Add an event listener to the window that hides the other widgets e.g. `PHFeedbackBoxOpened` and show it again with the `PHFeedbackBoxClosed` event. For example:

        ```
        window.addEventListener('PHFeedbackBoxOpened', function (e) {
        window.OtherWidget.hide();
        });

        window.addEventListener('PHFeedbackBoxClosed', function (e) {
        window.OtherWidget.show();
        });
        ```

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
