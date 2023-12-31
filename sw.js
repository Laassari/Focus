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

async function handleRuntimeMessage(message, sender) {
  const { options } = await chrome.storage.local.get(["options"]);
  const { tab } = sender;

  switch (message.type) {
    case "close-tab":
      chrome.tabs.remove(tab.id);
      break;
    case "start-focus-time":
      setFocusTime(options);
      break;

    case "stop-focus-time":
      stopFocusTime(options);
      break;

    case "start-rest-time":
      startRestTime(options);
      break;

    default:
      break;
  }
}

async function checkFocusTime() {
  const result = await chrome.storage.local.get([APP_STATE_KEY]);
  const state = result[APP_STATE_KEY];

  if (!state) return false;

  return state === focusStates.focusTime;
}

async function setFocusTime(options) {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.focusTime });

  await chrome.alarms.create(focusStates.focusTime, {
    delayInMinutes: parseInt(options.focusTime, 10),
  });
}

async function stopFocusTime() {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });

  await chrome.alarms.clear(focusStates.focusTime);
}

async function startRestTime(options) {
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.restTime });

  await chrome.alarms.create(focusStates.restTime, {
    delayInMinutes: parseInt(options.restTime, 10),
  });
}
