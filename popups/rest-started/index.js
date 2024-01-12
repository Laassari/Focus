const stopRestTimeBtn = document.querySelector("button.stop-rest-time");

stopRestTimeBtn.addEventListener("click", stopRestTing);

async function stopRestTing() {
  const result = await chrome.storage.local.get(["state"]);
  const state = result.state;

  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });
  [focusStates.restTime, focusStates.extendedRestTime].forEach((t) =>
    chrome.alarms.clear(t)
  );

  updatePopUp("/popups/default/index.html");
}
