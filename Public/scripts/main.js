//====== registeration form ============
let currentStep = 1;
const totalSteps = 4;

function changeStep(direction) {
  const currentStepElement = document.getElementById(`step${currentStep}`);

  // Validate current step before proceeding
  if (direction === 1 && !validateStep(currentStep)) {
    return;
  }

  // Hide current step
  currentStepElement.classList.add("hidden");

  // Update step number
  currentStep += direction;

  // Show new step
  const newStepElement = document.getElementById(`step${currentStep}`);
  newStepElement.classList.remove("hidden");

  // Update progress bar
  const progressPercentage = (currentStep / totalSteps) * 100;
  document.getElementById("progressBar").style.width = `${progressPercentage}%`;

  // Update step indicators
  updateStepIndicators();

  // Update navigation buttons
  updateNavigationButtons();
}

function updateStepIndicators() {
  const indicators = document.querySelectorAll(".step-indicator");
  indicators.forEach((indicator, index) => {
    const stepNumber = index + 1;
    indicator.classList.remove("active", "completed");

    if (stepNumber < currentStep) {
      indicator.classList.add("completed");
      indicator.innerHTML = "✓";
    } else if (stepNumber === currentStep) {
      indicator.classList.add("active");
      indicator.innerHTML = stepNumber;
    } else {
      indicator.innerHTML = stepNumber;
    }
  });
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  // Show/hide previous button
  if (currentStep === 1) {
    prevBtn.classList.add("hidden");
  } else {
    prevBtn.classList.remove("hidden");
  }

  // Show/hide next/submit buttons
  if (currentStep === totalSteps) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

function validateStep(step) {
  const stepElement = document.getElementById(`step${step}`);
  const requiredFields = stepElement.querySelectorAll("[required]");

  for (let field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();
      field.classList.add("error-border");
      setTimeout(() => field.classList.remove("error-border"), 3000);
      return false;
    }
  }
  return true;
}

updateNavigationButtons();

// Handle select field floating labels
document.querySelectorAll("select.form-field").forEach((select) => {
  select.addEventListener("change", function () {
    const label = this.nextElementSibling;
    if (this.value !== "") {
      label.style.transform = "translateY(-28px) scale(0.85)";
      label.style.color = "#667eea";
      label.style.background = "white";
    } else {
      label.style.transform = "";
      label.style.color = "#6b7280";
      label.style.background = "transparent";
    }
  });
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'975bada790ba3e40',t:'MTc1NjI5ODg1Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
// add to cart button
function addToCart(button, productName) {
  button.classList.add("added");

  setTimeout(() => {
    button.classList.remove("added");
  }, 1500);

  console.log(`Added ${productName} to cart`);
}

// product detail page script
let currentQuantity = 1;
let selectedColor = "black";
let basePrice = 0;

// -------------------- Tabs --------------------
function switchTab(tabName, ev) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".p-d-tab-content");
  tabContents.forEach((el) => el.classList.remove("p-d-active"));

  // Deactivate all tab buttons
  const tabButtons = document.querySelectorAll(".p-d-tab-button");
  tabButtons.forEach((btn) => btn.classList.remove("p-d-active"));

  // Show the selected tab content
  const contentEl = document.getElementById("content-" + tabName);
  if (contentEl) contentEl.classList.add("p-d-active");

  // Activate the clicked button
  const btn = ev && (ev.currentTarget || ev.target);
  if (btn && btn.classList) btn.classList.add("p-d-active");
}

// -------------------- Color --------------------
function selectColor(color) {
  selectedColor = color;
  const opts = document.querySelectorAll(".color-option");
  opts.forEach((o) => {
    o.classList.remove("selected");
    if (o.dataset.color === color) o.classList.add("selected");
  });
}

// -------------------- Quantity --------------------
function changeQuantity(delta) {
  const next = currentQuantity + delta;
  if (next >= 1 && next <= 10) {
    currentQuantity = next;
    const q = document.getElementById("quantity");
    if (q) q.textContent = currentQuantity;
    updateTotalPrice();
  }
}

// -------------------- Price --------------------
function updateTotalPrice() {
  const total = (basePrice * currentQuantity).toFixed(2);
  const el = document.getElementById("totalPrice");
  if (el) el.textContent = total;
}

// -------------------- Modal --------------------
function addToCart() {
  const m = document.getElementById("successModal");
  if (m) m.classList.add("p-d-show");
}

function closeModal() {
  const m = document.getElementById("successModal");
  if (m) m.classList.remove("p-d-show");
}

// -------------------- Init --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Get base price safely
  const priceEl = document.getElementById("totalPrice");
  basePrice = parseFloat((priceEl && priceEl.textContent) || "0") || 0;

  // Ensure first tab is active if none is
  const firstContent = document.querySelector(".p-d-tab-content");
  if (firstContent && !document.querySelector(".p-d-tab-content.p-d-active")) {
    firstContent.classList.add("p-d-active");
  }
  const firstButton = document.querySelector(".p-d-tab-button");
  if (firstButton && !document.querySelector(".p-d-tab-button.p-d-active")) {
    firstButton.classList.add("p-d-active");
  }

  updateTotalPrice();
});
