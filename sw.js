const APP_STATE_KEY = "state";
const focusStates = {
  none: "NONE",
  focusTime: "FOCUS_TIME",
  restTime: "REST_TIME",
  extendedRestTime: "EXTENDED_REST_TIME",
};

chrome.runtime.onInstalled.addListener(setDefaultOptions);
chrome.webNavigation.onCommitted.addListener(handleNavigation);
chrome.runtime.onMessage.addListener(handleRuntimeMessage);
chrome.alarms.onAlarm.addListener(handleAlarms);

async function setDefaultOptions() {
  const defaultOptions = {
    focusTime: 40,
    restTime: 5,
    extendedRestTime: 15,
    blockList: ["facebook.com", "youtube.com", "twitter.com", "instagram.com"],
  };

  const current = await chrome.storage.local.get(["options"]);

  if (!current.options) {
    await chrome.storage.local.set({ options: defaultOptions });
  }
}

async function handleNavigation(details) {
  const { options } = await chrome.storage.local.get(["options"]);

  const url = new URL(details.url);
  const inBlackList = options.blockList.includes(url.hostname);
  const isFocusTime = await checkFocusTime();

  if (inBlackList && isFocusTime) {
    chrome.tabs.update(details.tabId, { active: true });
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["replace-site-content.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId: details.tabId },
      files: ["replace-site-content.css"],
    });
  }
}

async function handleAlarms(alarm) {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });

  const options = {
    type: "basic",
    title: "Focus",
    message: getMessageForNotifications(alarm.name),
    iconUrl: "images/logo/focus-32.png",
  };

  chrome.notifications.create(options);
}

async function handleRuntimeMessage(message, sender) {
  const { tab } = sender;

  switch (message.type) {
    case "close-tab":
      chrome.tabs.remove(tab.id);
      break;
  }
}

async function checkFocusTime() {
  const result = await chrome.storage.local.get([APP_STATE_KEY]);
  const state = result[APP_STATE_KEY];

  if (!state) return false;

  return state === focusStates.focusTime;
}

function getMessageForNotifications(key) {
  switch (key) {
    case focusStates.focusTime:
      return `Focus time has ended.`;

    case focusStates.restTime:
      return `Rest time has ended.`;

    case focusStates.extendedRestTime:
      return `Extended rest time has ended.`;

    default:
      break;
  }
}
