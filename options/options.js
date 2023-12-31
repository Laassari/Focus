window.addEventListener("DOMContentLoaded", syncOptionWithStorage);
window.addEventListener("DOMContentLoaded", startUp);

function startUp() {
  const form = document.querySelector("form");

  form.addEventListener("submit", updateOptions);
}

async function syncOptionWithStorage() {
  const form = document.querySelector("form");
  const { options } = await chrome.storage.local.get(["options"]);

  if (Object.values(options).length) {
    const { focusTime, restTime, extendedRestTime, blockList } = options;

    form.focusTimeInput.value = focusTime;
    form.restTimeInput.value = restTime;
    form.extendedRestTimeInput.value = extendedRestTime;
    form.blockListInput.value = blockList.join('\n');
  }
}

async function updateOptions(e) {
  e.preventDefault();

  const form = document.querySelector("form");

  const {
    focusTimeInput,
    restTimeInput,
    extendedRestTimeInput,
    blockListInput,
  } = form;

  await chrome.storage.local.set({
    options: {
      focusTime: focusTimeInput.value,
      restTime: restTimeInput.value,
      extendedRestTime: extendedRestTimeInput.value,
      blockList: blockListInput.value.split('\n').map(e => e.trim()).filter(Boolean),
    },
  });

  alert("Options updated successfully!");
}
