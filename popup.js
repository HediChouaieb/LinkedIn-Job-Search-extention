// Populate the country dropdown
const countrySelect = document.getElementById("country");
COUNTRIES.forEach((country) => {
  const opt = document.createElement("option");
  opt.value = country;
  opt.textContent = country;
  countrySelect.appendChild(opt);
});

// Default to France since that's what the original link used
countrySelect.value = "France";

// Load last used job title, if any
chrome.storage?.local?.get(["lastJobTitle", "lastCountry"], (data) => {
  if (data?.lastJobTitle) document.getElementById("jobTitle").value = data.lastJobTitle;
  if (data?.lastCountry) countrySelect.value = data.lastCountry;
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const jobTitle = document.getElementById("jobTitle").value.trim() || "developer";
  const country = countrySelect.value;

  // Build the LinkedIn jobs search URL with the chosen keywords + location.
  // f_TPR=r3600 keeps the "past hour" filter from the original link.
  const url =
    "https://www.linkedin.com/jobs/search/?" +
    new URLSearchParams({
      keywords: jobTitle,
      location: country,
      f_TPR: "r3600"
    }).toString();

  // Remember the last search
  chrome.storage?.local?.set({ lastJobTitle: jobTitle, lastCountry: country });

  // Navigate the current active tab to the built URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.update(tabs[0].id, { url });
    } else {
      chrome.tabs.create({ url });
    }
  });
});
