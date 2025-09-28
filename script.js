const sections = document.querySelectorAll("section, footer");
const navLinks = document.querySelectorAll(".nav-links a");
const navContainer = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");

// Ensure the page doesn't auto scroll on refresh
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("scrollPos", window.scrollY);
});

// Restore scroll position
window.addEventListener("load", () => {
  const scrollPos = sessionStorage.getItem("scrollPos");
  if (scrollPos) {
    window.scrollTo(0, parseInt(scrollPos, 10));
  }
});

// Toggle hamburger menu (mobile nav)
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("activate");
  navContainer.classList.toggle("activate");

  // Recalculate pill position when nav opens/closes
  const activeLink = document.querySelector(".nav-links a.active");
  if (activeLink) movePill(activeLink);
});

// Create pill element and add it to the nav
const pill = document.createElement("span");
pill.classList.add("pill");
navContainer.appendChild(pill);

// Function: move pill under given link
function movePill(link) {
  if (window.innerWidth < 1065) {
    return (pill.style.display = "none");
  }

  pill.style.display = "block";
  const { offsetLeft, offsetWidth } = link;
  pill.style.left = `${offsetLeft}px`;
  pill.style.width = `${offsetWidth}px`;
}

// On page load: set pill under default active link
const activeLink = document.querySelector(".nav-links a.active");
if (activeLink) movePill(activeLink);

// Recalculate pill position if window resizes
window.addEventListener("resize", () => {
  const activeLink = document.querySelector(".nav-links a.active");
  if (activeLink) movePill(activeLink);
});

// When clicking nav links, scroll smoothly to section
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Close hamburger if open
    hamburger.classList.remove("activate");
    navContainer.classList.remove("activate");

    const targetId = link.getAttribute("href").substring(1); // e.g. "#about" -> "about"
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      if (targetId === "newsletter") {
        // Special case: scroll to very bottom if it's the subscribe/newsletter link
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      } else {
        // Normal sections: scroll with header offset
        const yOffset = -140; // adjust this to match header height
        const y =
          targetEl.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }
  });
});

// Scrolling manually
window.addEventListener("scroll", () => {
  // Header scroll effect (add class when scrolled down)
  const navbar = document.querySelector(".cray-header");
  if (window.scrollY > 70) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Detect which section is in view
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 250; // offset buffer
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id"); // set "current" to visible section ID
    }
  });

  // Update active nav link + move pill
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
      movePill(link);
    }
  });

  // Special case: user scrolled to very bottom of page
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight
  ) {
    navLinks.forEach((link) => link.classList.remove("active"));
    const lastLink = document.querySelector(".nav-links a[href*='newsletter']");
    if (lastLink) {
      lastLink.classList.add("active");
      movePill(lastLink);
    }
  }
});

// Magnetic effect
function magneticEffect(element, strength = 40, extra = "") {
  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    element.style.transform = `translate(${x / strength}px, ${
      y / strength
    }px) ${extra}`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = `${extra}`;
  });
}

// Apply magnetic effect & intesity
magneticEffect(document.querySelector(".hero-card"), 3);
magneticEffect(document.querySelector(".memoji"), 3, "rotate(6.33deg)");
magneticEffect(document.querySelector(".cube-left"), 1);
magneticEffect(document.querySelector(".cube-right"), 0.3);
magneticEffect(document.querySelector(".ball-left"), 0.5);
magneticEffect(document.querySelector(".ball-right"), 0.5);

// Select all reveal elements
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate"); // trigger animation
        observer.unobserve(entry.target); // remove if you only want once
      }
    });
  },
  { threshold: 0.2 } // reveal when 20% of element is visible
);

reveals.forEach((el) => observer.observe(el));
