const stopRestTimeBtn = document.querySelector("button.stop-rest-time");

stopRestTimeBtn.addEventListener("click", stopRestTime);

async function stopRestTime() {
  const result = await chrome.storage.local.get(["state"]);
  const state = result.state;

  if (state === "REST_TIME") {
    await chrome.runtime.sendMessage({ type: "stop-rest-time" });
  } else {
    await chrome.runtime.sendMessage({ type: "stop-extended-rest-time" });
  }

  updatePopUp("/popups/default/index.html");
}
