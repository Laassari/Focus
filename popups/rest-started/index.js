const stopRestTimeBtn = document.querySelector("button.stop-rest-time");

stopRestTimeBtn.addEventListener("click", stopRestTing);

async function stopRestTing() {
  const result = await chrome.storage.local.get(["state"]);
  const state = result.state;

  if (state === "REST_TIME") {
    await stopRestTime();
  } else {
    await stopExtendedRestTime();
  }

  updatePopUp("/popups/default/index.html");
}

async function stopRestTime() {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });

  await chrome.alarms.clear(focusStates.restTime);
}

async function stopExtendedRestTime() {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });

  await chrome.alarms.clear(focusStates.extendedRestTime);
}
