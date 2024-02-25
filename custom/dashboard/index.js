addEventListener("DOMContentLoaded", async () => {
  const { options, pastStates } = await chrome.storage.local.get([
    "options",
    "pastStates",
  ]);

  renderChart(pastStates);
  renderCards(options, pastStates);
});

function renderChart(pastStates) {
  const ctx = document.getElementById("chart");
  const { datasets, labels } = prepareDataForLastMonth(pastStates);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets,
    },
    options: {
      scales: {
        y: {
          grace: 1,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

function renderCards(options, pastStates) {
  const todayDateIso = new Date().toISOString().slice(0, 10);

  if (!pastStates[todayDateIso]) return;

  const count = countStatesPerDay(pastStates[todayDateIso]);

  const focusSessions = document.querySelector(".card.focus-sessions .value");
  const focusTime = document.querySelector(".card.focus-time .value");
  const restSessions = document.querySelector(".card.rest-sessions .value");
  const restTime = document.querySelector(".card.rest-time .value");

  focusSessions.textContent = count["FOCUS_TIME"];
  focusTime.textContent = count["FOCUS_TIME"] * options.focusTime;

  restSessions.textContent = count["REST_TIME"] + count["EXTENDED_REST_TIME"];
  restTime.textContent =
    count["REST_TIME"] * options.restTime +
    count["EXTENDED_REST_TIME"] * options.extendedRestTime;
}

function prepareDataForLastMonth(pastStates) {
  const labels = [];
  let focusData = [];
  let restData = [];
  let extendedRestData = [];

  Object.entries(pastStates)
    .slice(pastStates.length - 29)
    .forEach(([dateStr, states]) => {
      const count = countStatesPerDay(states);

      labels.push(dateStr);
      focusData.push(count["FOCUS_TIME"]);
      restData.push(count["REST_TIME"]);
      extendedRestData.push(count["EXTENDED_REST_TIME"]);
    });

  const datasets = [
    {
      label: "Focus",
      data: focusData,
      borderWidth: 1,
    },
    {
      label: "Rest",
      data: restData,
      borderWidth: 1,
    },
    {
      label: "Extended Rest",
      data: extendedRestData,
      borderWidth: 1,
    },
  ];

  return { datasets, labels };
}

function countStatesPerDay(dayStates) {
  const result = {
    REST_TIME: 0,
    FOCUS_TIME: 0,
    EXTENDED_REST_TIME: 0,
  };

  dayStates.forEach((state) => {
    result[state] = result[state] + 1;
  });

  return result;
}
