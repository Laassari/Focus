const startFocusBtn = document.querySelector("button.start-focus");
const startRestTimeBtn = document.querySelector("button.start-rest-time");
const startExtendedRestTimeBtn = document.querySelector(
  "button.start-extended-rest-time"
);

startFocusBtn.addEventListener("click", startFocusTime);
startRestTimeBtn.addEventListener("click", startRestTime);
startExtendedRestTimeBtn.addEventListener("click", startExtendedRestTime);

async function startFocusTime() {
  await chrome.runtime.sendMessage({ type: "start-focus-time" });

  updatePopUp("/popups/focus-started/index.html");
}

async function startRestTime() {
  await chrome.runtime.sendMessage({ type: "start-rest-time" });

  updatePopUp("/popups/rest-started/index.html");
}

async function startExtendedRestTime() {
  await chrome.runtime.sendMessage({ type: "start-extended-rest-time" });

  updatePopUp("/popups/rest-started/index.html");
}
