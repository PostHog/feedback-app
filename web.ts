import * as config from "./plugin.json";

const style = ` 
.form, .button, .thanks {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: blue;
  color: black;
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  text-align: left;
}
.button { 
  width: 64px;
  height: 64px;
  border-radius: 100%;
  text-align: center;
  line-height: 60px;
  font-size: 32px;
  border: none;
  cursor: pointer;
}
.button:hover {
  background: #b88505;
}
.form {
  display: none;
  padding: 20px;
  flex-direction: column;
}
.form textarea {
  margin-bottom: 20px;
  background: white;
  color: black;
  border: none;
}
.form button {
  color: white;
  background: black;
}
.thanks {
  display:none;
  padding: 20px;
}
`;

const form = `
  <textarea name='feedback' rows=6></textarea>
  <button class='form-submit' type='submit'></button>
`;

export function inject({ config, posthog }) {
  const shadow = createShadow();

  function openFeedbackBox() {
    Object.assign(buttonElement.style, { display: "none" });
    Object.assign(formElement.style, { display: "flex" });
    const submit: HTMLElement | undefined =
      formElement.querySelector(".form-submit");
    if (submit) {
      submit.innerText = config.sendButtonText;
    }
  }

  const buttonElement = Object.assign(document.createElement("button"), {
    className: "button",
    innerText: config.buttonText || "?",
    onclick: openFeedbackBox,
  });

  // shadow.appendChild(buttonElement);

  const formElement = Object.assign(document.createElement("form"), {
    className: "form",
    innerHTML: form,
    onsubmit: function (e) {
      e.preventDefault();
      posthog.capture("Feedback Sent", { feedback: this.feedback.value });
      Object.assign(formElement.style, { display: "none" });
      Object.assign(thanksElement.style, { display: "flex" });
      window.setTimeout(() => {
        Object.assign(thanksElement.style, { display: "none" });
      }, 3000);
    },
  });
  shadow.appendChild(formElement);

  const buttons = document.querySelectorAll(
    "[data-attr='posthog-feedback-button']"
  );
  Array.from(buttons).forEach((x) =>
    x.addEventListener("click", openFeedbackBox)
  );

  const thanksElement = Object.assign(document.createElement("div"), {
    className: "thanks",
    innerHTML: config.thanksText || "Thank you! Closing in 3 seconds...",
  });
  shadow.appendChild(thanksElement);
}

function createShadow(): ShadowRoot {
  const div = document.createElement("div");
  const shadow = div.attachShadow({ mode: "open" });
  if (style) {
    const styleElement = Object.assign(document.createElement("style"), {
      innerText: style,
    });
    shadow.appendChild(styleElement);
  }
  document.body.appendChild(div);
  return shadow;
}
