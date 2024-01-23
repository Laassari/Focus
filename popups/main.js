const APP_STATE_KEY = "state";
const focusStates = {
  none: "NONE",
  focusTime: "FOCUS_TIME",
  restTime: "REST_TIME",
  extendedRestTime: "EXTENDED_REST_TIME",
};

const optionsBtn = document.querySelector("button.options");

optionsBtn.addEventListener("click", openOptionsPage);

document.addEventListener("load", redirectToRightPopUp);
document.addEventListener("DOMContentLoaded", handleCountDown);
chrome.storage.onChanged.addListener(handleStorageChange);

async function handleCountDown() {
  const result = await chrome.storage.local.get(["state"]);

  if (
    ["FOCUS_TIME", "REST_TIME", "EXTENDED_REST_TIME"].includes(result.state)
  ) {
    renderCountDown();
    setInterval(renderCountDown, 1000);
  }
}

async function updatePopUp(popup) {
  await chrome.action.setPopup({ popup });
  const currentPopup = await chrome.action.getPopup({});
  location.href = currentPopup;
}

function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

function timeStampToUnits(timeStamp) {
  const timeDiffSeconds = (timeStamp - Date.now()) / 1000;

  const hours = parseInt(timeDiffSeconds / (60 * 60));

  const remainingSeconds = timeDiffSeconds % (60 * 60);

  const minutes = parseInt(remainingSeconds / 60);

  const seconds = parseInt(remainingSeconds % 60);

  return {
    hours: formatTimeUnit(hours),
    minutes: formatTimeUnit(minutes),
    seconds: formatTimeUnit(seconds),
  };
}

function formatTimeUnit(time) {
  return String(time).padStart(2, "0");
}

async function renderCountDown() {
  const countDownContainer = document.querySelector(".count-down");

  if (!countDownContainer) {
    console.error("Should have a count down container");
    return;
  }

  const alarms = await chrome.alarms.getAll();
  const alarm = alarms[0];

  if (!alarm) return;

  const { hours, minutes, seconds } = timeStampToUnits(alarm.scheduledTime);

  countDownContainer.querySelector("#hours").textContent = hours;
  countDownContainer.querySelector("#minutes").textContent = minutes;
  countDownContainer.querySelector("#seconds").textContent = seconds;
}

async function redirectToRightPopUp(currentState) {
  const result = await chrome.storage.local.get(["state"]);
  const state = currentState || result.state;
  let popUpName;

  switch (state) {
    case "NONE":
      popUpName = "default";
      break;

    case "FOCUS_TIME":
      popUpName = "focus-started";
      break;

    case "REST_TIME":
    case "EXTENDED_REST_TIME":
      popUpName = "rest-started";
      break;

    default:
      popUpName = "default";
  }

  updatePopUp(`/popups/${popUpName}/index.html`);
}

function handleStorageChange(changes) {
  if (changes[APP_STATE_KEY]) {
    redirectToRightPopUp(changes[APP_STATE_KEY].newValue);
  }
}
