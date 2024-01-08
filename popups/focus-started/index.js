const stopFocusBtn = document.querySelector("button.stop-focus");

stopFocusBtn.addEventListener("click", stopFocusTime);

async function stopFocusTime() {
  await chrome.runtime.sendMessage({ type: "stop-focus-time" });

  updatePopUp("/popups/default/index.html");
}
