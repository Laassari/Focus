const startFocusBtn = document.querySelector("button.start-focus");
const startRestTimeBtn = document.querySelector("button.start-rest-time");
const startExtendedRestTimeBtn = document.querySelector(
  "button.start-extended-rest-time"
);

startFocusBtn.addEventListener("click", startFocusTime);
startRestTimeBtn.addEventListener("click", startRestTime);
startExtendedRestTimeBtn.addEventListener("click", startExtendedRestTime);

async function startFocusTime() {
  const options = await getOptions();

  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.focusTime });

  await chrome.alarms.create(focusStates.focusTime, {
    delayInMinutes: parseInt(options.focusTime, 10),
  });

  updatePopUp("/popups/focus-started/index.html");
}

async function startRestTime() {
  const options = await getOptions();

  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.restTime });

  await chrome.alarms.create(focusStates.restTime, {
    delayInMinutes: parseInt(options.restTime, 10),
  });

  updatePopUp("/popups/rest-started/index.html");
}

async function startExtendedRestTime() {
  const options = await getOptions();

  await chrome.storage.local.set({
    [APP_STATE_KEY]: focusStates.extendedRestTime,
  });

  await chrome.alarms.create(focusStates.extendedRestTime, {
    delayInMinutes: parseInt(options.extendedRestTime, 10),
  });

  updatePopUp("/popups/rest-started/index.html");
}

async function getOptions() {
  const { options } = await chrome.storage.local.get(["options"]);

  return options;
}
