document.addEventListener("DOMContentLoaded", () => {
  // Sembunyikan booking input awal
  document.querySelector(".booking-input-wrapper").style.display = "none";
  document.querySelector("label[for='bookingDate']").style.display = "none";

  const promoteForm = document.getElementById("promoteForm");
  const bookingIcon = document.getElementById("bookingIcon");
  const bookingDateInput = document.getElementById("bookingDate");
  const selectedPromoteTypeBtn = document.getElementById("selectedPromoteType");
  const promoteTypeInput = document.getElementById("promoteType");
  const promoteDesc = document.getElementById("promoteDesc");
  const bookingText = document.getElementById("bookingText");

  let configData = {};
  let currentType = null;

  fetch("config.json")
    .then(res => res.json())
    .then(config => {
      configData = config;
      const max = config.max;
      const slotData = config.slot;

      document.querySelectorAll('.dropdown-item').forEach(item => {
        const type = item.dataset.value;
        const isFull = slotData[type] >= max;
        const isDisabled = config.enabled?.[type] === false;

        if (isFull || isDisabled) {
          item.classList.add("disabled");
          item.style.opacity = 0.5;
          item.style.pointerEvents = "none";
        }
      });

      bookingDateInput.addEventListener("input", () => {
        const selected = bookingDateInput.value;
        if (!selected || !currentType) return;

        const formatted = formatDate(selected);
        const today = new Date();
        const selectedDate = new Date(selected);
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        // Ambil data booking berdasarkan jenis layanan
        const bookedDatesRaw = Object.values(config.booking?.[currentType] || {});
        const bookedDates = bookedDatesRaw.map(d => {
          const [day, month, year] = d.split("-");
          return `${year}-${month}-${day}`;
        });

        if (selectedDate < today || bookedDates.includes(selected)) {
          bookingText.textContent = `${formatted} unavailable`;
          bookingText.style.color = "#f44336";
          bookingText.style.display = "block";
          bookingDateInput.setAttribute("data-valid", "false");
        } else {
          bookingText.textContent = `${formatted} available`;
          bookingText.style.color = "#4caf50";
          bookingText.style.display = "block";
          bookingDateInput.setAttribute("data-valid", "true");
        }
      });
    });

  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      const value = item.dataset.value;
      const text = item.textContent;
      promoteTypeInput.value = value;
      selectedPromoteTypeBtn.textContent = text;
      currentType = value;

      const freeFields = document.getElementById("freeExtraFields");
      const bookingWrapper = document.querySelector(".booking-input-wrapper");
      const bookingLabel = document.querySelector("label[for='bookingDate']");
      const addonField = document.getElementById("fastTrackAddon");

      // Atur tampilan field berdasarkan pilihan type
      if (value === "NORMAL") {
        promoteDesc.textContent = "You choose the NORMAL type of service...";
        bookingWrapper.style.display = "block";
        bookingLabel.style.display = "block";
        bookingDateInput.required = true;
        bookingDateInput.removeAttribute("disabled");
        addonField.style.display = "none";
        freeFields.style.display = "none";
      } else if (value === "FREE") {
        promoteDesc.textContent = "This is a free promotion. Limited queue.";
        bookingWrapper.style.display = "block";
        bookingLabel.style.display = "block";
        bookingDateInput.required = true;
        bookingDateInput.removeAttribute("disabled");
        addonField.style.display = "none";
        freeFields.style.display = "block";
      } else if (value === "FAST-TRACK") {
        promoteDesc.textContent = "You choose the FAST TRACK type of service.";
        bookingWrapper.style.display = "none";
        bookingLabel.style.display = "none";
        bookingDateInput.required = false;
        bookingDateInput.value = "";
        bookingDateInput.setAttribute("data-valid", "true");
        bookingText.textContent = "";
        freeFields.style.display = "none";
        addonField.style.display = "block";
      }

      document.querySelector(".dropdown-content").style.display = "none";
    });
  });

  selectedPromoteTypeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = document.querySelector(".dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  promoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const server = document.getElementById("serverName").value.trim();
    const type = promoteTypeInput.value;
    const addon = document.getElementById("addonOption")?.value.trim();
    const wa = document.getElementById("waGroup").value.trim();
    const dc = document.getElementById("discordGroup").value.trim();
    const msg = document.getElementById("message").value.trim();
    const id = document.getElementById("requestId").textContent.trim();
    const bookingDate = bookingDateInput.value;
    const formatted = formatDate(bookingDate);

    if (!server || !type) {
      alert("Please fill out required fields.");
      return;
    }

    if ((type === "NORMAL" || type === "FREE") && bookingDateInput.getAttribute("data-valid") !== "true") {
      bookingText.textContent = `${formatted} sudah dibooking atau tidak valid`;
      bookingText.style.color = "#f44336";
      return;
    }

    const finalMsg = `Request Promote:\n- ${id}\n- Server: ${server}\n- Type: ${type}\n${
      (type === "NORMAL" || type === "FREE") ? `- Booking Date: ${formatted}\n` : ""
    }${(type === "FAST-TRACK" && addon) ? `- Addon: ${addon}\n` : ""}- WhatsApp Group: ${wa || "-"}\n- Discord: ${dc || "-"}\n- Message: ${msg || "-"}`;

    const waUrl = `https://wa.me/6281373371005?text=${encodeURIComponent(finalMsg)}`;
    window.open(waUrl, '_blank');
    closeModal();
  });

  function formatDate(input) {
    const d = new Date(input);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Anti devtools
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
      if (entry.isIntersecting) entry.target.classList.add('active');
      else entry.target.classList.remove('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  window.toggleAnswer = function (q) {
    const a = q.nextElementSibling;
    document.querySelectorAll('.faq-answer').forEach(el => {
      if (el !== a) el.style.display = 'none';
    });
    a.style.display = a.style.display === 'block' ? 'none' : 'block';
  };

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
    const modal = document.getElementById("productModal");
    if (event.target === modal) closeModal();
  };
});
