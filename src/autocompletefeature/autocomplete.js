//this is for the autocomplete feature on the searchbar / search input

// autocomplete.js
export async function setupAutocomplete(getLocationSuggestions) {
  const searchInput = document.getElementById("searchInput");

  const suggestionBox = document.createElement("div");
  suggestionBox.classList.add(
    "absolute", "left-0", "top-full", "mt-1",
    "w-full", "bg-white", "border", "border-gray-300",
    "rounded-md", "shadow-lg", "z-50", "max-h-60", "overflow-auto"
  );

  searchInput.parentElement.classList.add("relative");
  searchInput.parentElement.appendChild(suggestionBox);

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    suggestionBox.innerHTML = "";
    if (!query) return;

    try {
      const suggestions = await getLocationSuggestions(query);

      suggestions.forEach((item) => {
        const option = document.createElement("div");
        option.classList.add("px-3", "py-2", "hover:bg-slate-200", "cursor-pointer");
        option.textContent = `${item.name}, ${item.country}`;

        option.addEventListener("click", () => {
          searchInput.value = `${item.name}, ${item.country}`;
          suggestionBox.innerHTML = "";

          // ✅ Trigger weather fetch immediately
          //getWeather(searchInput.value);
        });

        suggestionBox.appendChild(option);
      });
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    }
  });
}
