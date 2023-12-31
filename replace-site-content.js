renderModal();

function renderModal() {
  const main = document.createElement("main");
  const wrapper = document.createElement("dialog");
  const h1 = document.createElement("h1");
  const p = document.createElement("p");
  const button = document.createElement("button");

  main.classList.add("focus-main");
  wrapper.classList.add("wrapper");
  wrapper.setAttribute("open", true);

  h1.textContent = "Focus Time";
  p.textContent = "This website is not allowed during focus time";
  button.textContent = "Close";

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "close-tab" });
  });

  wrapper.appendChild(h1);
  wrapper.appendChild(p);
  wrapper.appendChild(button);

  main.appendChild(wrapper);
  document.body.insertAdjacentElement("beforeend", main);
}
