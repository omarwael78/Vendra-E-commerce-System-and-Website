import { initToast } from "./toast.js";

/* Global Error Listener */
window.onerror = function (message, source, lineno) {
  const cleanMessage = message.replace(/^Uncaught Error: /i, "");

  initToast(cleanMessage, "danger");
};

window.onunhandledrejection = function (event) {
  const msg = event.reason?.message || "An unexpected error occurred";
  initToast(msg, "warning");
};
