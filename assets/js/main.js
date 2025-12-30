const themeToggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("theme");

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(prefersDark.matches ? "dark" : "light");
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

themeToggle?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(",");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalOverview = document.getElementById("modalOverview");
const modalTools = document.getElementById("modalTools");
const modalImpact = document.getElementById("modalImpact");
const modalGithub = document.getElementById("modalGithub");
const modalDemo = document.getElementById("modalDemo");

const openModal = (card) => {
  const links = card.dataset.links.split(",");
  modalTitle.textContent = card.dataset.title;
  modalOverview.textContent = card.dataset.overview;
  modalTools.textContent = card.dataset.tools;
  modalImpact.textContent = card.dataset.impact;
  modalGithub.href = links[0].trim();
  modalDemo.href = links[1].trim();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.currentTarget.closest(".project-card");
    if (card) {
      openModal(card);
    }
  });
});

modal?.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
  }
});

const copyButton = document.getElementById("copyEmail");
const copyStatus = document.getElementById("copyStatus");
const emailText = document.querySelector(".contact__email")?.textContent?.trim();

const updateStatus = (message) => {
  if (copyStatus) {
    copyStatus.textContent = message;
    setTimeout(() => {
      copyStatus.textContent = "";
    }, 2000);
  }
};

copyButton?.addEventListener("click", async () => {
  if (!emailText) {
    updateStatus("Email not available.");
    return;
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(emailText);
    updateStatus("Email copied to clipboard.");
  } else {
    const tempInput = document.createElement("textarea");
    tempInput.value = emailText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
    updateStatus("Email copied to clipboard.");
  }
});