const API_URL = "https://script.google.com/macros/s/AKfycbwfVJh5wh0mBaK9TkKzfidJ7fo6f0P-UwLs2tkLZ35_LrZ1nRZ_K6acVxXjBn3ZMTrx/exec";
const KAKAO_URL = "https://open.kakao.com/o/g5NbSfph";
const PHONE_NUMBER = "01049017168";

document.querySelectorAll(".phone-link").forEach((el) => {
  el.setAttribute("href", `tel:${PHONE_NUMBER}`);
});

document.querySelectorAll(".kakao-link").forEach((el) => {
  el.setAttribute("href", KAKAO_URL);
});

const requestTypeGroup = document.getElementById("requestTypeGroup");
const targetTypeGroup = document.getElementById("targetTypeGroup");
const equipmentSection = document.getElementById("equipmentSection");
const workerSection = document.getElementById("workerSection");
const equipmentSelect = document.getElementById("equipment");
const workerSelect = document.getElementById("worker");
const form = document.getElementById("contactForm");
const successBox = document.getElementById("successBox");
const dateTimeInput = document.getElementById("dateTime");

function setMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  dateTimeInput.min = now.toISOString().slice(0, 16);
}

function refreshChoiceState(groupEl) {
  const cards = groupEl.querySelectorAll(".choice-card");
  cards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio.checked) card.classList.add("active");
    else card.classList.remove("active");
  });
}

function updateTargetSection() {
  const selectedTarget = document.querySelector('input[name="신청대상"]:checked')?.value;
  if (selectedTarget === "인력") {
    equipmentSection.classList.add("hidden");
    workerSection.classList.remove("hidden");
    equipmentSelect.value = "";
  } else {
    equipmentSection.classList.remove("hidden");
    workerSection.classList.add("hidden");
    workerSelect.value = "";
  }
}

requestTypeGroup.addEventListener("change", () => refreshChoiceState(requestTypeGroup));
targetTypeGroup.addEventListener("change", () => {
  refreshChoiceState(targetTypeGroup);
  updateTargetSection();
});

setMinDateTime();
refreshChoiceState(requestTypeGroup);
refreshChoiceState(targetTypeGroup);
updateTargetSection();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const requestType = document.querySelector('input[name="신청구분"]:checked')?.value || "";
  const targetType = document.querySelector('input[name="신청대상"]:checked')?.value || "";
  const equipment = equipmentSelect.value.trim();
  const worker = workerSelect.value.trim();
  const location = document.getElementById("location").value.trim();
  const dateTime = dateTimeInput.value.trim();
  const phone = document.getElementById("phone").value.trim();
  const name = document.getElementById("name").value.trim();
  const memo = document.getElementById("memo").value.trim();

  if (!requestType) return alert("신청 구분을 선택해주세요.");
  if (!targetType) return alert("신청 대상을 선택해주세요.");
  if (targetType === "장비" && !equipment) return alert("장비를 선택해주세요.");
  if (targetType === "인력" && !worker) return alert("인력을 선택해주세요.");
  if (!location) return alert("현장 위치를 입력해주세요.");
  if (!dateTime) return alert("희망 일시를 선택해주세요.");
  if (!phone) return alert("연락처를 입력해주세요.");
  if (!name) return alert("이름을 입력해주세요.");

  const payload = {
    requestType,
    targetType,
    equipment,
    worker,
    location,
    dateTime,
    pickup: "",
    area: "",
    memo,
    name,
    phone
  };

  successBox.style.display = "block";
  successBox.textContent = "접수 저장 중입니다...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.ok) {
      successBox.textContent = "접수가 정상 저장되었습니다. 곧 확인 연락드리겠습니다.";
      form.reset();
      updateTargetSection();
      refreshChoiceState(requestTypeGroup);
      refreshChoiceState(targetTypeGroup);
      setMinDateTime();
    } else {
      successBox.textContent = data.message || "저장에 실패했습니다.";
    }
  } catch (err) {
    successBox.textContent = "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
});