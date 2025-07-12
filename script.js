const videoLinks = [
    "https://www.youtube.com/embed/6DRPP31sGRY",
  ];

  // Ambil satu secara acak
  const randomIndex = Math.floor(Math.random() * videoLinks.length);
  const selectedVideo = videoLinks[randomIndex];

  // Masukkan ke iframe
  const iframe = document.getElementById("randomVideo");
  iframe.src = selectedVideo;
  	document.addEventListener('keydown', function(e) {
    // Mencegah pembukaan Developer Tools
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 'U') || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')))) {
      e.preventDefault();
      alert('Menyalin sumber halaman tidak diperbolehkan!');
    }
  });
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Scroll spy
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
    
    // Fungsi untuk toggle jawaban FAQ
function toggleAnswer(questionElement) {
  const answerElement = questionElement.nextElementSibling;
  
  // Jika jawaban sudah ditampilkan, sembunyikan
  if (answerElement.style.display === "block") {
    answerElement.style.display = "none";
  } else {
    // Sembunyikan jawaban lain jika sedang ditampilkan
    const allAnswers = document.querySelectorAll('.faq-answer');
    allAnswers.forEach(answer => {
      if (answer !== answerElement) {
        answer.style.display = "none";
      }
    });
    // Tampilkan jawaban yang diklik
    answerElement.style.display = "block";
  }
}

function generateRequestId() {
  const random = Math.floor(10000000 + Math.random() * 9000000);
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
  const yyyy = today.getFullYear();
  const fullId = `#${random}-${dd}-${mm}-${yyyy}`;

  document.getElementById('requestId').textContent = fullId;
  return fullId;
}

function openModal() {
  generateRequestId();
  document.getElementById("productModal").style.display = "block";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

// Close modal saat klik di luar kotak
window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
}

function sendToWhatsApp(event) {
  event.preventDefault();
  const server = document.getElementById('serverName').value;
  const type = document.getElementById('promoteType').value;
  const wa = document.getElementById('waGroup').value;
  const discord = document.getElementById('discordGroup').value;
  const msg = document.getElementById('message').value;
  const id = document.getElementById('requestId').textContent;

  const text = `Request Promote:\n- ${id}\n- Server: ${server}\n- Type: ${type}\n- WhatsApp Group: ${wa || '-'}\n- Discord Server: ${discord || '-'}\n- Message: ${msg || '-'}`;

  const url = `https://wa.me/6281373371005?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');

  closeModal();
}
