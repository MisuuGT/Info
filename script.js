document.addEventListener("DOMContentLoaded", () => {
  const promoteForm = document.getElementById("promoteForm");
  const bookingDateInput = document.getElementById("bookingDate");
  const selectedPromoteTypeBtn = document.getElementById("selectedPromoteType");
  const promoteTypeInput = document.getElementById("promoteType");
  const promoteDesc = document.getElementById("promoteDesc");
  const bookingIcon = document.getElementById("bookingIcon");

  let disabledDates = [];
  let slotData = {};
  let config = {};

  fetch("config.json")
    .then(res => res.json())
    .then(data => {
      config = data;
      const max = data.max;
      slotData = data.slot;
      
      const videoLinks = config.videoLinks || [];
    if (videoLinks.length > 0) {
      const latestVideo = config.videoLinks[0];
document.getElementById("randomVideo").src = latestVideo;
    }
    
      // Atur disable dropdown berdasarkan slot dan enabled
      document.querySelectorAll('.dropdown-item').forEach(item => {
        const type = item.dataset.value;
        const isFull = slotData[type] >= max;
        const isDisabled = data.enabled && data.enabled[type] === false;

        if (isFull || isDisabled) {
          item.classList.add("disabled");
          item.style.opacity = 0.5;
          item.style.pointerEvents = "none";
        }
      });

      // Disabled date booking
      const bookedDates = Object.values(data.booking);
      disabledDates = bookedDates.map(d => {
        const [day, month, year] = d.split("-");
        return `${year}-${month}-${day}`;
      });

      // Load video dari config
      if (data.video && Array.isArray(data.video)) {
        const randomVideo = data.video[Math.floor(Math.random() * data.video.length)];
        document.getElementById("randomVideo").src = randomVideo;
      }

      // Input Booking Date
      bookingDateInput.addEventListener("input", () => {
        const selected = bookingDateInput.value;
        const bookingText = document.getElementById("bookingText");
        if (!selected) return;

        const formatted = formatDate(selected);
        const today = new Date();
        const selectedDate = new Date(selected);
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today || disabledDates.includes(selected)) {
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

  // Pilihan Promote Type
  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      const value = item.dataset.value;
      const text = item.textContent;

      promoteTypeInput.value = value;
      selectedPromoteTypeBtn.textContent = text;

      const freeFields = document.getElementById("freeExtraFields");
      const bookingWrapper = document.querySelector(".booking-input-wrapper");
      const bookingLabel = document.querySelector("label[for='bookingDate']");
      const bookingText = document.getElementById("bookingText");

      if (value === "NORMAL") {
        promoteDesc.textContent = "You choose the NORMAL type of service. With NORMAL queue, there's a risk of delay behind FAST TRACK users.";
        bookingWrapper.style.display = "block";
        bookingLabel.style.display = "block";
        bookingDateInput.required = true;
        bookingDateInput.removeAttribute("disabled");
        freeFields.style.display = "none";
      } else if (value === "FREE") {
        promoteDesc.textContent = "This is a free promotion. Limited queue, only available if slots are open.";
        bookingWrapper.style.display = "block";
        bookingLabel.style.display = "block";
        bookingDateInput.required = true;
        bookingDateInput.removeAttribute("disabled");
        freeFields.style.display = "block";
      } else {
        promoteDesc.textContent = "You choose the FAST TRACK type of service. With FAST TRACK, queues are faster and prioritized.";
        bookingWrapper.style.display = "none";
        bookingLabel.style.display = "none";
        bookingDateInput.required = false;
        bookingDateInput.value = "";
        bookingText.textContent = "";
        bookingDateInput.setAttribute("data-valid", "true");
        freeFields.style.display = "none";
      }

      // Tutup dropdown
      document.querySelector(".dropdown-content").style.display = "none";
    });
  });

  // Toggle dropdown saat tombol dipencet
  selectedPromoteTypeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = document.querySelector(".dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // Submit form
  promoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const server = document.getElementById("serverName").value.trim();
    const type = promoteTypeInput.value;
    const wa = document.getElementById("waGroup").value.trim();
    const dc = document.getElementById("discordGroup").value.trim();
    const msg = document.getElementById("message").value.trim();
    const id = document.getElementById("requestId").textContent.trim();
    const bookingDate = bookingDateInput.value;
    const formatted = formatDate(bookingDate);
    const bookingText = document.getElementById("bookingText");

    if (!server || !type) {
      alert("Please fill out required fields.");
      return;
    }

    if ((type === "NORMAL" || type === "FREE") &&
        (!bookingDate || bookingDateInput.getAttribute("data-valid") !== "true")) {
      bookingText.textContent = `${formatted} sudah dibooking atau tidak valid`;
      bookingText.style.color = "#f44336";
      return;
    }

    const finalMsg = `Request Promote:\n- ${id}\n- Server: ${server}\n- Type: ${type}\n${
      (type === "NORMAL" || type === "FREE") ? `- Booking Date: ${formatted}\n` : ""
    }- WhatsApp Group: ${wa || "-"}\n- Discord: ${dc || "-"}\n- Message: ${msg || "-"}`;

    const waUrl = `https://wa.me/6281373371005?text=${encodeURIComponent(finalMsg)}`;
    window.open(waUrl, '_blank');
    closeModal();
  });

  // Fungsi bantu
  function formatDate(input) {
    const d = new Date(input);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Booking icon
  bookingIcon.addEventListener("click", () => {
    bookingDateInput.value = "";
    bookingDateInput.removeAttribute("data-valid");
    document.getElementById("bookingText").textContent = "";
  });

  // Generate Request ID
  window.generateRequestId = function () {
    const random = Math.floor(10000000 + Math.random() * 9000000);
    const today = new Date();
    const id = `#${random}-${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    document.getElementById('requestId').textContent = id;
    return id;
  };

  // Modal handler
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

  // FAQ toggle
  window.toggleAnswer = function (q) {
    const a = q.nextElementSibling;
    document.querySelectorAll('.faq-answer').forEach(el => {
      if (el !== a) el.style.display = 'none';
    });
    a.style.display = a.style.display === 'block' ? 'none' : 'block';
  };

  // Scroll observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Scroll spy nav
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  // Anti developer tools
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
});
