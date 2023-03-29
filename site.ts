const style = (config) => `
    .form, .button, .thanks {
        position: fixed;
        bottom: 20px;
        right: 20px;
        color: black;
        font-weight: normal;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        text-align: left;
        z-index: ${parseInt(config.zIndex) || 99999};
    }
    .button {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        text-align: center;
        line-height: 60px;
        font-size: 32px;
        border: none;
        cursor: pointer;
    }
    .button:hover {
        filter: brightness(1.2);
    }
    .form-submit[disabled] {
        opacity: 0.6;
        filter: grayscale(100%);
        cursor: not-allowed;
    }
    .thanks {
        background: white;
    }
    .form {
        display: none;
        flex-direction: column;
        background: white;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        padding-top: 5px;
        max-width: 380px;
        box-shadow: -6px 0 16px -8px rgb(0 0 0 / 8%), -9px 0 28px 0 rgb(0 0 0 / 5%), -12px 0 48px 16px rgb(0 0 0 / 3%);
    }
    .form textarea {
        color: #2d2d2d;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        margin-bottom: 10px;
        background: white;
        color: black;
        border: none;
        outline: none;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
    }
    .form-submit {
        box-sizing: border-box;
        margin: 0;
        font-family: inherit;
        overflow: visible;
        text-transform: none;
        line-height: 1.5715;
        position: relative;
        display: inline-block;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        user-select: none;
        touch-action: manipulation;
        height: 32px;
        padding: 4px 15px;
        font-size: 14px;
        border-radius: 4px;
        outline: 0;
        color: #fff;
        border-color: #1d4aff;
        background: #1d4aff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    }
    .form-submit:hover {
        filter: brightness(1.2);
    }
    .form-cancel {
        box-sizing: border-box;
        margin: 0;
        font-family: inherit;
        overflow: visible;
        text-transform: none;
        line-height: 1.5715;
        position: relative;
        display: inline-block;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        border: 1px solid transparent;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        user-select: none;
        touch-action: manipulation;
        height: 32px;
        padding: 4px 15px;
        font-size: 14px;
        border-radius: 4px;
        color: #2d2d2d;
        border-color: rgba(0, 0, 0, 0.15);
        background: #fff;
        outline: 0;
    }
    .thanks {
        display: none;
        font-size: 14px;
        padding: 20px;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        box-shadow: -6px 0 16px -8px rgb(0 0 0 / 8%), -9px 0 28px 0 rgb(0 0 0 / 5%), -12px 0 48px 16px rgb(0 0 0 / 3%);
        max-width: 340px;
        margin-block-end: 1em;
    }
    .bolded { font-weight: 600; }
    .bottom-section {
        border-top: 1px solid #f0f0f0;
        padding: 10px 16px;
    }
    .buttons {
        display: flex;
        justify-content: space-between;
    }
    .specific-issue {
        padding-top: 10px;
        font-size: 14px;
        color: #747ea1;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    .specific-issue a:link {
        color: #5879FF;
    }
    .specific-issue a:visited {
        color: #5879FF;
    }
`

export function inject({ config, posthog }) {
    if (config.domains) {
        const domains = config.domains.split(',').map((domain) => domain.trim())
        if (domains.length > 0 && domains.indexOf(window.location.hostname) === -1) {
            return
        }
    }
    const shadow = createShadow(style(config))

    function openbugBox() {
        Object.assign(buttonElement.style, { display: 'none' })
        Object.assign(formElement.style, { display: 'flex' })

        const closeButton = shadow.querySelector('.form-cancel')
        closeButton.addEventListener('click', (e) => {
            e.preventDefault()
            Object.assign(formElement.style, { display: 'none' })
        })
    }

    const buttonElement = Object.assign(document.createElement('button'), {
        className: 'button',
        innerText: config.buttonText || '?',
        onclick: openbugBox,
        title: config.buttonTitle || '',
    })
    Object.assign(buttonElement.style, {
        color: config.buttonColor || 'black',
        background: config.buttonBackground || '#1d8db9',
    })

    if (config.useButton === 'Yes') {
        shadow.appendChild(buttonElement)
    }

    const form = `
        <textarea class='bug-textarea' name='bug' rows=6></textarea>
        <div class='bottom-section'>
            <div class='buttons'>
                <a class='form-cancel' type='button'>Close</a>
                <button class='form-submit' type='submit' disabled>Submit</button>
            </div>
            <div class='specific-issue'></div>
        </div>
    `

    const getSessionRecordingUrl = () => {
        const sessionId = posthog?.sessionRecording?.sessionId
        const LOOK_BACK = 30
        const recordingStartTime = Math.max(
            Math.floor((new Date().getTime() - (posthog?.sessionManager?._sessionStartTimestamp || 0)) / 1000) -
                LOOK_BACK,
            0
        )
        const api_host = posthog?.config?.api_host || 'https://app.posthog.com'
        return sessionId ? `${api_host}/recordings/${sessionId}?t=${recordingStartTime}` : undefined
    }

    const formElement = Object.assign(document.createElement('form'), {
        className: 'form',
        innerHTML: form,
        onsubmit: function (e) {
            e.preventDefault()
            const sessionRecordingUrl = getSessionRecordingUrl()
            posthog.capture(config.eventName || 'bug Sent', {
                [config.bugProperty || '$bug']: this.bug.value,
                sessionRecordingUrl: sessionRecordingUrl,
            })
            Object.assign(formElement.style, { display: 'none' })
            Object.assign(thanksElement.style, { display: 'flex' })
            window.setTimeout(() => {
                Object.assign(thanksElement.style, { display: 'none' })
            }, 3000)
            formElement.reset()
        },
    })
    const textarea = formElement.getElementsByClassName('bug-textarea')[0] as HTMLTextAreaElement
    const cancelButton = formElement.getElementsByClassName('form-cancel')[0] as HTMLElement
    const submitButton = formElement.getElementsByClassName('form-submit')[0] as HTMLButtonElement
    const footerArea = formElement.getElementsByClassName('specific-issue')[0] as HTMLElement

    Object.assign(submitButton.style, {
        color: config.buttonColor || 'white',
        background: config.buttonBackground || '#1d8db9',
        borderColor: config.buttonBackground || '#1d8db9',
    })

    textarea.addEventListener('input', (e) => {
        if (textarea.value.length > 0) {
            submitButton.disabled = false
        } else {
            submitButton.disabled = true
        }
    })

    textarea.setAttribute('placeholder', config.placeholderText || 'Help us improve')
    cancelButton.innerText = config.cancelButtonText || 'Cancel'
    submitButton.innerText = config.sendButtonText || 'Send bug'
    if (config.footerHTML) {
        footerArea.innerHTML = config.footerHTML
    } else {
        footerArea.style.display = 'none'
    }
    shadow.appendChild(formElement)

    if (config.selector) {
        const clickListener = (e) => {
            if (e.target.matches(config.selector)) {
                openbugBox()
            }
        }
        window.addEventListener('click', clickListener)
    }

    console.log('Posthog - latest bug widget')

    const thanksElement = Object.assign(document.createElement('div'), {
        className: 'thanks',
        innerHTML: '<img src="https://media.tenor.com/7hJpFtl63HQAAAAC/sanic-the-hedgehob.gif"/><div>' + config.thanksText + '</div>' || 'Thank you!',
    })
    shadow.appendChild(thanksElement)
}

function createShadow(styleSheet: string): ShadowRoot {
    const div = document.createElement('div')
    const shadow = div.attachShadow({ mode: 'open' })
    if (styleSheet) {
        const styleElement = Object.assign(document.createElement('style'), {
            innerText: styleSheet,
        })
        shadow.appendChild(styleElement)
    }
    document.body.appendChild(div)
    return shadow
}
