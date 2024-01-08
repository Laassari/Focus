const optionsBtn = document.querySelector("button.options");

optionsBtn.addEventListener("click", openOptionsPage);

document.addEventListener("load", redirectToRightPopUp);
document.addEventListener("DOMContentLoaded", handleCountDown);

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

function formatTimeStamp(timeStamp) {
  const timeDiffSeconds = (timeStamp - Date.now()) / 1000;

  const hours = parseInt(timeDiffSeconds / (60 * 60));

  const remainingSeconds = timeDiffSeconds % (60 * 60);

  const minutes = parseInt(remainingSeconds / 60);

  const seconds = parseInt(remainingSeconds % 60);

  return { hours, minutes, seconds };
}

function formatTime(time) {
  return String(time).padStart(2, "0");
}

async function renderCountDown() {
  const alarms = await chrome.alarms.getAll();
  const alarm = alarms[0];

  if (!alarm) return;

  const { hours, minutes, seconds } = formatTimeStamp(alarm.scheduledTime);
  document.querySelector(".count-down").textContent = `${formatTime(
    hours
  )}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

async function redirectToRightPopUp() {
  const result = await chrome.storage.local.get(["state"]);
  let popUpName;

  switch (result.state) {
    case "NONE":
      popUpName = "default";
      break;

    case "FOCUS_TIME":
      popUpName = "focus-started";
      break;

    case "REST_TIME":
    case "EXTENDED_REST_TIME":
      popUpName = "rest-started";

    default:
      popUpName = "default";
  }

  updatePopUp(`/popups/${popUpName}/index.html`);
}
