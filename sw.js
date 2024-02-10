const APP_STATE_KEY = "state";
const focusStates = {
  none: "NONE",
  focusTime: "FOCUS_TIME",
  restTime: "REST_TIME",
  extendedRestTime: "EXTENDED_REST_TIME",
};

chrome.runtime.onInstalled.addListener(setDefaultOptions);
chrome.webNavigation.onBeforeNavigate.addListener(restrictBlockedWebsites);
chrome.webNavigation.onHistoryStateUpdated.addListener(restrictBlockedWebsites);
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

async function restrictBlockedWebsites(details) {
  const { options } = await chrome.storage.local.get(["options"]);

  const url = new URL(details.url);
  const inBlackList = options.blockList.includes(url.hostname);
  const isFocusTime = await checkFocusTime();

  if (inBlackList && isFocusTime) {
    console.log("blocked url", url);
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("custom/page-blocked/index.html"),
    });
  }
}

async function handleAlarms(alarm) {
  await updateState(alarm.name);
  const nextState = await getNextState(alarm.name);

  chrome.tabs.create({
    url: chrome.runtime.getURL(
      `custom/timer-finished/index.html?completed_state=${alarm.name}&next_state=${nextState}`
    ),
  });
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

async function updateState(currentState) {
  const { pastStates = {} } = await chrome.storage.local.get(["pastStates"]);

  const todayDateIso = new Date().toISOString().slice(0, 10);
  const todayStates = pastStates[todayDateIso] || [];

  const newStates = {
    ...pastStates,
    [todayDateIso]: [...todayStates, currentState],
  };

  await chrome.storage.local.set({ pastStates: newStates });
  await chrome.storage.local.set({ [APP_STATE_KEY]: focusStates.none });
}

async function getNextState() {
  const { pastStates } = await chrome.storage.local.get(["pastStates"]);
  const todayDateIso = new Date().toISOString().slice(0, 10);
  const todayStates = pastStates[todayDateIso];
  const lastState = todayStates.at(-1);

  if (
    [focusStates.restTime, focusStates.extendedRestTime].includes(lastState)
  ) {
    return focusStates.focusTime;
  }

  // after every three short rests we do an extended rest
  const shortRestsCount = todayStates
    .slice(todayStates.length - 6 - 1)
    .filter((s) => s === focusStates.restTime).length;

  if (shortRestsCount === 3) return focusStates.extendedRestTime;

  return focusStates.restTime;
}
