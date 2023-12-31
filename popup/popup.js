const optionsBtn = document.querySelector("button.options");

const stopFocusBtn = document.querySelector("button.stop-focus");
const startFocusBtn = document.querySelector("button.start-focus");
const startRestTimeBtn = document.querySelector("button.start-rest-time");
const startExtendedRestTimeBtn = document.querySelector(
  "button.start-extended-rest-time"
);

document.addEventListener("DOMContentLoaded", start);

optionsBtn.addEventListener("click", openOptionsPage);
startFocusBtn.addEventListener("click", startFocusTime);
stopFocusBtn.addEventListener("click", stopFocusTime);
startRestTimeBtn.addEventListener("click", startRestTime);
startExtendedRestTimeBtn.addEventListener("click", startExtendedRestTime);

async function start() {
  const result = await chrome.storage.local.get(["state"]);

  console.log(result.state);
  if (result.state === "FOCUS_TIME") {
    stopFocusBtn.style.display = "none";
  }

  document
    .querySelector("p")
    .insertAdjacentText("beforeend", " " + result.state);
}

function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}
function startFocusTime() {
  chrome.runtime.sendMessage({ type: "start-focus-time" });
}

function stopFocusTime() {
  chrome.runtime.sendMessage({ type: "stop-focus-time" });
}

function startRestTime() {
  chrome.runtime.sendMessage({ type: "start-rest-time" });
}

function startExtendedRestTime() {}
