const stopFocusBtn = document.querySelector("button.stop-focus");

stopFocusBtn.addEventListener("click", stopFocusTime);

async function stopFocusTime() {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });

  await chrome.alarms.clear(focusStates.focusTime);

  updatePopUp("/popups/default/index.html");
}
