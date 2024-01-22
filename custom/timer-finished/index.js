const APP_STATE_KEY = "state";
const focusStates = {
  none: "NONE",
  focusTime: "FOCUS_TIME",
  restTime: "REST_TIME",
  extendedRestTime: "EXTENDED_REST_TIME",
};

const closeBtn = document.querySelector(".close");
const actionBtn = document.querySelector("button.main-action");

document.addEventListener("DOMContentLoaded", updateUiText);

closeBtn.addEventListener("click", closeTab);
actionBtn.addEventListener("click", handleActionBtn);

async function updateUiText() {
  const p = document.querySelector("p");
  const { current, next } = getStates();

  switch (current) {
    case focusStates.focusTime:
      p.textContent =
        "Well done! You have finished your focus time. You can reward yourself with a resting session.";
      break;

    case focusStates.restTime:
      p.textContent =
        "Your rest time has finished. It's time to get back making the world a better place";
      break;

    case focusStates.extendedRestTime:
      p.textContent =
        "Your extended rest time has finished. Use your new productivity to make even greater impact";
      break;
  }

  switch (next) {
    case focusStates.focusTime:
      actionBtn.textContent = "Start focusing";
      break;

    case focusStates.restTime:
      actionBtn.textContent = "Start resting";
      break;

    case focusStates.extendedRestTime:
      actionBtn.textContent = "Start an extended rest";
      break;
  }
}

async function handleActionBtn() {
  const { next } = getStates();

  switch (next) {
    case focusStates.focusTime:
      await startFocusTime();
      closeTab();
      break;

    case focusStates.restTime:
      await startRestTime();
      closeTab();
      break;

    case focusStates.extendedRestTime:
      await startExtendedRestTime();
      closeTab();
      break;
  }
}

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

async function updatePopUp(popup) {
  await chrome.action.setPopup({ popup });
  const currentPopup = await chrome.action.getPopup({});
  location.href = currentPopup;
}

function getStates() {
  const params = new URLSearchParams(location.search);
  const completedState = params.get("completed_state");
  const nextState = params.get("next_state");

  return {
    current: completedState,
    next: nextState,
  };
}

function closeTab() {
  window.close();
}
