/*
  ===== 꼭 바꿔야 하는 값 =====
  1) RECEIVER_EMAIL : 접수 받을 실제 이메일
  2) KAKAO_URL      : 실제 카카오톡 오픈채팅 또는 상담 링크
  3) PHONE_NUMBER   : 실제 대표 전화번호
*/
const RECEIVER_EMAIL = "lyslhj@daum.net";
const KAKAO_URL = "https://open.kakao.com/o/g5NbSfph/";
const PHONE_NUMBER = "01049017168";

// 공통 링크 반영
document.querySelectorAll(".phone-link").forEach((el) => {
  el.setAttribute("href", `tel:${PHONE_NUMBER}`);
  if (el.textContent.includes("010-4901-7168")) {
    el.textContent = `📞 ${formatPhonePretty(PHONE_NUMBER)}`;
  }
});

document.querySelectorAll(".kakao-link").forEach((el) => {
  el.setAttribute("href", KAKAO_URL);
});

const targetTypeGroup = document.getElementById("targetTypeGroup");
const requestTypeGroup = document.getElementById("requestTypeGroup");
const equipmentSection = document.getElementById("equipmentSection");
const workerSection = document.getElementById("workerSection");
const equipmentSelect = document.getElementById("equipment");
const workerSelect = document.getElementById("worker");
const form = document.getElementById("contactForm");
const successBox = document.getElementById("successBox");
const dateTimeInput = document.getElementById("dateTime");

// 현재 시간보다 이전 시간 선택 방지용
setMinDateTime();

function setMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const local = now.toISOString().slice(0, 16);
  dateTimeInput.min = local;
}

function formatPhonePretty(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return phone;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function refreshRadioCardState(groupEl) {
  const cards = groupEl.querySelectorAll(".radio-card");
  cards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio.checked) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
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

requestTypeGroup.addEventListener("change", () => {
  refreshRadioCardState(requestTypeGroup);
});

targetTypeGroup.addEventListener("change", () => {
  refreshRadioCardState(targetTypeGroup);
  updateTargetSection();
});

refreshRadioCardState(requestTypeGroup);
refreshRadioCardState(targetTypeGroup);
updateTargetSection();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const requestType = document.querySelector('input[name="신청구분"]:checked')?.value || "";
  const targetType = document.querySelector('input[name="신청대상"]:checked')?.value || "";
  const equipment = equipmentSelect.value.trim();
  const worker = workerSelect.value.trim();
  const location = document.getElementById("location").value.trim();
  const dateTime = dateTimeInput.value.trim();
  const pickup = document.getElementById("pickup").value.trim();
  const area = document.getElementById("area").value.trim();
  const memo = document.getElementById("memo").value.trim();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!requestType) {
    alert("신청 구분을 선택해주세요.");
    return;
  }

  if (!targetType) {
    alert("신청 대상을 선택해주세요.");
    return;
  }

  if (targetType === "장비" && !equipment) {
    alert("장비를 선택해주세요.");
    equipmentSelect.focus();
    return;
  }

  if (targetType === "인력" && !worker) {
    alert("인력을 선택해주세요.");
    workerSelect.focus();
    return;
  }

  if (!location) {
    alert("현장 위치를 입력해주세요.");
    document.getElementById("location").focus();
    return;
  }

  if (!dateTime) {
    alert("희망 일자와 시간을 선택해주세요.");
    dateTimeInput.focus();
    return;
  }

  if (!name) {
    alert("이름을 입력해주세요.");
    document.getElementById("name").focus();
    return;
  }

  if (!phone) {
    alert("연락처를 입력해주세요.");
    document.getElementById("phone").focus();
    return;
  }

  const formattedDateTime = formatDateTime(dateTime);

  const subject = `[중기넷 접수] ${requestType} / ${targetType} / ${name}`;
  const body = [
    "중기넷 접수 내용",
    "",
    `신청 구분: ${requestType}`,
    `신청 대상: ${targetType}`,
    `장비 항목: ${equipment || "-"}`,
    `인력 직종: ${worker || "-"}`,
    `현장 위치: ${location}`,
    `희망 일시: ${formattedDateTime}`,
    `픽업 서비스: ${pickup || "-"}`,
    `희망 지역: ${area || "-"}`,
    `요청 내용: ${memo || "-"}`,
    `이름: ${name}`,
    `연락처: ${phone}`
  ].join("\n");

  successBox.style.display = "block";

  const mailtoUrl =
    `mailto:${encodeURIComponent(RECEIVER_EMAIL)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 300);
});