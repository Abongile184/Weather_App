import loadingGif from "../assets/images/loading.gif"; // <-- use the real path & case in your repo

export function showLoader() {
  const app = document.getElementById("app");
  // store previous content if you ever want to restore it
  app.dataset._prev = app.innerHTML || "";
  app.innerHTML = `
    <div class="flex justify-center items-center min-h-screen">
      <img src="${loadingGif}" alt="Loading..." style="width: 220px; height: 220px;" class="mx-auto"" />
    </div>
  `;
}

export function hideLoader() {
  const app = document.getElementById("app");
  // clear loader to make space for UI render
  app.innerHTML = "";
  // optionally restore previous: 
  // if (app.dataset._prev) { app.innerHTML = app.dataset._prev; delete app.dataset._prev; }
}