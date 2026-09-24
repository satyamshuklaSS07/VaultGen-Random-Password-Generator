const $ = (id) => document.getElementById(id);

const sets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

const lengthInput = $("length");
const lengthValue = $("lengthValue");
const passwordEl = $("password");
const strengthBar = $("strengthBar");
const strengthText = $("strengthText");
const strengthBadge = $("strengthBadge");
const copyMessage = $("copyMessage");
const generateBtn = $("generateBtn");

function secureRandomInt(max) {
  const range = 256 - (256 % max);
  const buffer = new Uint8Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= range);
  return value % max;
}

function selectedSets() {
  return Object.keys(sets).filter(key => $(key).checked);
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const selected = selectedSets();

  if (!selected.length) {
    passwordEl.textContent = "Select at least one option";
    strengthText.textContent = "—";
    strengthBadge.textContent = "NO OPTIONS";
    strengthBar.style.width = "0%";
    return;
  }

  const pool = selected.map(key => sets[key]).join("");
  let result = [];

  // Guarantee at least one character from every selected category.
  selected.forEach(key => {
    result.push(sets[key][secureRandomInt(sets[key].length)]);
  });

  while (result.length < length) {
    result.push(pool[secureRandomInt(pool.length)]);
  }

  // Fisher-Yates shuffle using the Web Crypto API.
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  const password = result.join("");
  passwordEl.textContent = password;
  updateStrength(password, selected.length);
  passwordEl.classList.remove("flash");
  void passwordEl.offsetWidth;
  passwordEl.classList.add("flash");
  copyMessage.textContent = "";
}

function updateStrength(password, categoryCount) {
  const length = password.length;
  let score = 0;
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (length >= 16) score++;
  if (categoryCount >= 2) score++;
  if (categoryCount >= 3) score++;
  if (categoryCount === 4) score++;

  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong", "Excellent"];
  const percent = Math.min(100, (score / 6) * 100);
  strengthBar.style.width = percent + "%";
  strengthText.textContent = labels[Math.min(score, labels.length - 1)];
  strengthBadge.textContent = labels[Math.min(score, labels.length - 1)].toUpperCase();

  if (score >= 5) strengthBar.style.background = "linear-gradient(90deg,#34d399,#22d3ee)";
  else if (score >= 3) strengthBar.style.background = "linear-gradient(90deg,#f59e0b,#34d399)";
  else strengthBar.style.background = "linear-gradient(90deg,#ef4444,#f59e0b)";
}

function syncOptionUI() {
  document.querySelectorAll(".option").forEach(label => {
    const input = label.querySelector("input");
    label.classList.toggle("active", input.checked);
  });
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

document.querySelectorAll(".option input").forEach(input => {
  input.addEventListener("change", () => {
    syncOptionUI();
    generatePassword();
  });
});

generateBtn.addEventListener("click", generatePassword);

$("copyBtn").addEventListener("click", async () => {
  const password = passwordEl.textContent;
  if (!password || password.includes("Select at least")) return;
  try {
    await navigator.clipboard.writeText(password);
    copyMessage.textContent = "Copied to clipboard ✓";
  } catch {
    copyMessage.textContent = "Copy blocked by browser";
  }
});

syncOptionUI();
generatePassword();
