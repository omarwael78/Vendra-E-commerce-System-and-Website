function toast(message, type) {
  return `
<div class="toast-container position-fixed top-0 mt-5 end-0 p-3 ">
  <div id="liveToast" class="bg-${type} text-dark fw-bold toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">Vendra</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body ">
        ${message}
    </div>
  </div>
</div>`;
}

export function initToast(message, type) {
  $(".toast-container").remove();

  // Append toast to body
  $("body").append(toast(message, type));

  const toastElement = $(".toast").last()[0];
  const toastInstance = new bootstrap.Toast(toastElement, {
    delay: 3000,
  });

  toastInstance.show();
}
