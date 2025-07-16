document.addEventListener("DOMContentLoaded", () => {
  const promoteForm = document.getElementById("promoteForm");
  const promoteTypeInput = document.getElementById("promoteType");
  const selectedPromoteTypeBtn = document.getElementById("selectedPromoteType");
  const promoteDesc = document.getElementById("promoteDesc");
  const addonDropdownBtn = document.getElementById("selectedAddonOption");
  const addonOptionInput = document.getElementById("addonOption");

  let configData = {};
  let currentType = null;

  // Hide sections on load if exist
  const bookingWrapper = document.querySelector(".booking-input-wrapper");
  const bookingLabel = document.querySelector("label[for='bookingDate']");
  const fastTrackAddon = document.getElementById("fastTrackAddon");

  if (bookingWrapper) bookingWrapper.style.display = "none";
  if (bookingLabel) bookingLabel.style.display = "none";
  if (fastTrackAddon) fastTrackAddon.style.display = "none";

  fetch("config.json")
    .then(res => res.json())
    .then(config => {
      configData = config;

      document.querySelectorAll('.dropdown-item').forEach(item => {
        const type = item.dataset.value;
        const used = Object.keys(config.booking[type] || {}).length;
        const max = config.slot[type];
        const isDisabled = config.enabled[type] === false;

        if (used >= max || isDisabled) {
          item.classList.add("disabled");
          item.style.opacity = 0.5;
          item.style.pointerEvents = "none";
        }
      });
    });

  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      const value = item.dataset.value;
      currentType = value;
      promoteTypeInput.value = value;
      selectedPromoteTypeBtn.textContent = item.textContent;

      const freeFields = document.getElementById("freeExtraFields");
      const addonField = document.getElementById("fastTrackAddon");

      addonOptionInput.value = "";
      addonDropdownBtn.textContent = "Select Addon";

      if (value === "NORMAL") {
        promoteDesc.textContent = "You choose the NORMAL type of service.";
        if (addonField) addonField.style.display = "none";
        if (freeFields) freeFields.style.display = "none";
      } else if (value === "FREE") {
        promoteDesc.textContent = "This is a free promotion.";
        if (addonField) addonField.style.display = "none";
        if (freeFields) freeFields.style.display = "block";
      } else if (value === "FAST-TRACK") {
        promoteDesc.textContent = "You choose the FAST TRACK type of service.";
        if (addonField) addonField.style.display = "block";
        if (freeFields) freeFields.style.display = "none";
      }

      document.querySelector(".dropdown-content").style.display = "none";
    });
  });

  selectedPromoteTypeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = document.querySelector("#promoteDropdown .dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  addonDropdownBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = document.querySelector(".addon-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.querySelectorAll(".addon-item").forEach(item => {
    item.addEventListener("click", () => {
      const value = item.dataset.value;
      addonOptionInput.value = value;
      addonDropdownBtn.textContent = value;
      document.querySelector(".addon-dropdown").style.display = "none";
    });
  });

  promoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const server = document.getElementById("serverName").value.trim();
    const type = promoteTypeInput.value;
    const addon = addonOptionInput.value.trim();
    const wa = document.getElementById("waGroup").value.trim();
    const dc = document.getElementById("discordGroup").value.trim();
    const msg = document.getElementById("message").value.trim();
    const id = document.getElementById("requestId").textContent.trim();

    if (!server || !type) {
      alert("Please fill out required fields.");
      return;
    }

    const finalMsg = `Request Promote:\n- ${id}\n- Server: ${server}\n- Type: ${type}\n${
      (type === "FAST-TRACK" && addon) ? `- Addon: ${addon}\n` : ""
    }- WhatsApp Group: ${wa || "-"}\n- Discord: ${dc || "-"}\n- Message: ${msg || "-"}`;

    const waUrl = `https://wa.me/6281373371005?text=${encodeURIComponent(finalMsg)}`;
    window.open(waUrl, '_blank');
    closeModal();
  });

  window.generateRequestId = function () {
    const random = Math.floor(10000000 + Math.random() * 9000000);
    const today = new Date();
    const id = `#${random}-${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    document.getElementById('requestId').textContent = id;
    return id;
  };

  window.openModal = function () {
    generateRequestId();
    document.getElementById("productModal").style.display = "block";
  };

  window.closeModal = function () {
    document.getElementById("productModal").style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === document.getElementById("productModal")) closeModal();
  };

  document.addEventListener("keydown", function (e) {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && ['u', 'U'].includes(e.key)) ||
      (e.ctrlKey && e.shiftKey && ['I', 'i'].includes(e.key))
    ) {
      e.preventDefault();
      alert('Menyalin sumber halaman tidak diperbolehkan!');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
