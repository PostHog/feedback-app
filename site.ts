const style = /* css */ `
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: black;
    font-weight: normal;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    text-align: left;
    z-index: 999999;
}
/* display: none; */
.popup-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    /* display: none; */
}
.popup-container {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 500px;
    /* translate 50% */
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 101;
    /* padding */
    padding: 20px;
    /* display: none; */
}
/* popup-title */
.popup-title {
    font-family: -apple-system, BlinkMacSystemFont, Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', Segoe UI Symbol;
    color: #2d2d2d;
    font-size: 1.125rem;
    font-weight: 700;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding: 0 5px;
}
/* popup-body with padding */
.popup-body {
    top: 50px;
    left: 0;
    width: 100%;
    height: 250px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding: 20px 5px;
}
.popup-actions {
    width: 100%;
    /* flex container columns */
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    /* space between 5px */
    gap: 10px;
    /* top padding 10px */
    padding-top: 20px;
}
/* position popup-button in right of popup-actions using flex */
.popup-book-button {
    height: 32px;
    color: #fff;
    border-color: #1d4aff;
    background: #1d4aff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    font-weight: 400;
    border: 1px solid transparent;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 4px;
    outline: 0;
}
.popup-close-button {
    box-sizing: border-box;
    height: 32px;
    justify-content: flex-end;
    color: #1d4aff;
    border: #1d4aff 1px solid;
    background: transparent;
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 4px;
}
`

export function inject({ config, posthog }) {
    if (config.domains) {
        const domains = config.domains.split(',').map((domain) => domain.trim())
        if (domains.length > 0 && domains.indexOf(window.location.hostname) === -1) {
            return
        }
    }
    const shadow = createShadow(style)

    const sessionStorageName = `${config.featureFlagName}-popupshown`

    function detectBookedInterview() {
        const urlParams = new URLSearchParams(window.location.search)
        const bookedUserInterview = urlParams.get('bookedUserInterview')
        if (bookedUserInterview) {
            posthog.capture('bookedUserInterview', { featureFlagName: bookedUserInterview })
        }
    }

    detectBookedInterview()

    function createPopUp() {
        posthog.capture(config.shownUserInterviewPopupEvent)
        const popupHTML = /*html*/ `
        <div class="popup">
            <div class="popup-shadow"></div>
            <div class="popup-container">
                <div class="popup-title">${config.invitationTitle}</div>
                <div class="popup-body">
                    Book in a call here:
                    <a href="${config.bookButtonURL}" target="_blank">here!</a>
                </div>
                <div class="popup-actions">
                    <button class="popup-close-button">${config.closeButtonText}</button>
                    <button class="popup-book-button" onclick="window.open('${config.bookButtonURL}')"
                        >${config.bookButtonText}</button
                    >
                </div>
            </div>
        </div>`
        const popup = Object.assign(document.createElement('div'), {
            innerHTML: popupHTML,
        })
        shadow.appendChild(popup)

        // save popup shown in storage
        localStorage.setItem(sessionStorageName, 'true')
    }

    // if popup-close-button then remove popup
    shadow.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup-close-button')) {
            posthog.capture(config.closedUserInterviewPopupEvent)
            shadow.innerHTML = ''
        }
    })

    // if popup-book-button then remove popup
    shadow.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup-book-button')) {
            posthog.capture(config.clickBookButtonEvent)
            shadow.innerHTML = ''
        }
    })

    posthog.onFeatureFlags((flags) => {
        if (flags.includes(config.featureFlagName) && !localStorage.getItem(sessionStorageName)) {
            createPopUp()
        }
    })
}

function createShadow(style: string): ShadowRoot {
    const div = document.createElement('div')
    const shadow = div.attachShadow({ mode: 'open' })
    if (style) {
        const styleElement = Object.assign(document.createElement('style'), {
            innerText: style,
        })
        shadow.appendChild(styleElement)
    }
    document.body.appendChild(div)
    return shadow
}

// Next steps:
// Get it working on a test site
// Find a way to turn off the booking link after a certain number of people have booked in: https://posthog.com/docs/api/feature-flags#patch-api-projects-project_id-feature_flags-id
// Add in support for multiple feature flags and links
