"use strict";

const header = document.querySelector(".top");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const compactLayout = window.matchMedia("(max-width: 1040px)");
const isKazakh = document.documentElement.lang === "kk";
const copy = isKazakh ? {
  menuOpen: "Мәзірді ашу",
  menuClose: "Мәзірді жабу",
  phoneFormat: "Телефон нөмірін кодымен бірге жазыңыз, 10–15 цифр.",
  phoneRequired: "Телефон нөмірін енгізіңіз.",
  serviceRequired: "Тазалау қызметін таңдаңыз.",
  areaFormat: "Ауданын көрсетіңіз (кемінде 0,1 м²).",
  greeting: brand => `Сәлеметсіз бе! ${brand} компаниясынан тазалау қызметінің құнын білгім келеді.`,
  serviceLabel: "Қызмет",
  areaLabel: "Ауданы",
  notesLabel: "Түсініктеме",
  phoneLabel: "Байланыс нөмірі",
  ready: "Өтінім дайын. Таңдалған филиалға жіберу үшін WhatsApp ашыңыз.",
  copied: "Өтінім мәтіні көшірілді.",
  selected: "Мәтін белгіленді. Оны құрылғы мәзірі арқылы көшіріңіз.",
} : {
  menuOpen: "Открыть меню",
  menuClose: "Закрыть меню",
  phoneFormat: "Введите номер телефона с кодом, от 10 до 15 цифр.",
  phoneRequired: "Введите номер телефона.",
  serviceRequired: "Выберите услугу.",
  areaFormat: "Укажите площадь числом (от 0,1 м²).",
  greeting: brand => `Здравствуйте! Хочу узнать стоимость уборки в ${brand}.`,
  serviceLabel: "Услуга",
  areaLabel: "Площадь",
  notesLabel: "Комментарий",
  phoneLabel: "Номер для связи",
  ready: "Заявка готова. Откройте WhatsApp, чтобы отправить её выбранному филиалу.",
  copied: "Текст заявки скопирован.",
  selected: "Текст выделен. Скопируйте его через меню устройства.",
};

function setMenu(open) {
  const expanded = compactLayout.matches && open;
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute("aria-label", expanded ? copy.menuClose : copy.menuOpen);
  nav.hidden = compactLayout.matches && !expanded;
}

setMenu(false);
menuToggle.hidden = false;
compactLayout.addEventListener("change", () => {
  const restoreFocus = compactLayout.matches && nav.contains(document.activeElement);
  setMenu(false);
  if (restoreFocus) menuToggle.focus();
});

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") === "false");
});

document.addEventListener("pointerdown", (event) => {
  if (!header.contains(event.target)) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

header.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#']");
  if (!link || menuToggle.getAttribute("aria-expanded") !== "true") return;
  setMenu(false);

  const section = document.getElementById(link.hash.slice(1));
  const heading = section?.querySelector("h1, h2");
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
});

const progressBar = header.querySelector(".scroll-progress");
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const landmarks = [...document.querySelectorAll('main section[id]')].reverse();
let currentNavLink;
let currentSection;
let framePending = false;

function updateScrollState() {
  framePending = false;
  const offset = compactLayout.matches ? 32 : header.offsetHeight + 32;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const section = landmarks.find(landmark => landmark.getBoundingClientRect().top <= offset);
  const navLink = navLinks.find(link => link.hash === `#${section?.id}`);

  currentSection = section;
  header.classList.toggle("is-scrolled", window.scrollY > 10);
  progressBar.style.setProperty("--scroll-progress", pageHeight > 0 ? Math.min(1, window.scrollY / pageHeight) : 0);
  if (navLink !== currentNavLink) {
    currentNavLink?.removeAttribute("aria-current");
    navLink?.setAttribute("aria-current", "location");
    currentNavLink = navLink;
  }
}

function requestScrollUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateScrollState);
}

updateScrollState();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
document.addEventListener("toggle", requestScrollUpdate, true);

for (const link of document.querySelectorAll("[data-language-link]")) {
  const targetPage = link.getAttribute("href");
  link.addEventListener("click", () => {
    link.href = currentSection ? `${targetPage}#${currentSection.id}` : targetPage;
  });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!entry.target.contains(document.activeElement)) {
        entry.target.setAttribute("data-entered", "");
      }
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  for (const section of document.querySelectorAll("[data-reveal]")) {
    if (section.getBoundingClientRect().top > window.innerHeight) reveal.observe(section);
  }
}

const form = document.querySelector("#quote-form");
const service = document.querySelector("#service");
const area = document.querySelector("#area");
const phone = document.querySelector("#phone");
const notes = document.querySelector("#notes");
const result = document.querySelector("#quote-result");
const status = document.querySelector("#quote-status");
const message = document.querySelector("#quote-message");
const copyButton = document.querySelector("#quote-copy");
const city = document.querySelector("#city");
const item = document.querySelector("#item");
const quantity = document.querySelector("#quantity");
const estimate = document.querySelector("#estimate");
const estimateNote = document.querySelector("#estimate-note");
const whatsappLink = document.querySelector("#quote-whatsapp");
const areaField = document.querySelector("#area-field");
const itemField = document.querySelector("#item-field");
const quantityField = document.querySelector("#quantity-field");

const labels = isKazakh ? {
  chooseService: "Қызметті таңдаңыз",
  chooseItem: "Тазаланатын затты таңдаңыз",
  enterArea: "Ауданын көрсетіңіз",
  enterQuantity: "Заттар санын көрсетіңіз",
  individual: "Жеке есептеледі",
  minimum: "Ең аз тапсырыс сомасы",
  city: "Қала",
  cityRequired: "Өтінім үшін қаланы таңдаңыз.",
  item: "Химиялық тазалау түрі",
  quantity: "Саны",
  unit: "дана",
  estimate: "Алдын ала құны",
  from: value => `${value} бастап`,
  upTo: value => `${value} дейін`,
} : {
  chooseService: "Выберите услугу",
  chooseItem: "Выберите предмет химчистки",
  enterArea: "Укажите площадь",
  enterQuantity: "Укажите количество предметов",
  individual: "По индивидуальному расчёту",
  minimum: "Минимальная сумма заказа",
  city: "Город",
  cityRequired: "Выберите город для заявки.",
  item: "Позиция химчистки",
  quantity: "Количество",
  unit: "шт.",
  estimate: "Предварительная стоимость",
  from: value => `от ${value}`,
  upTo: value => `до ${value}`,
};

const formatter = new Intl.NumberFormat("ru-RU");
const money = value => `${formatter.format(value)} ₸`;

function setField(field, control, visible) {
  field.hidden = !visible;
  control.disabled = !visible;
  if (!visible) control.setCustomValidity("");
}

function getEstimate() {
  const dryCleaning = service.value === "dry";
  const itemOption = item.selectedOptions[0];
  const measureArea = !dryCleaning || itemOption.dataset.area === "true";
  if (!service.value) return { prompt: labels.chooseService, dryCleaning, measureArea };
  if (dryCleaning && !item.value) return { prompt: labels.chooseItem, dryCleaning, measureArea };

  const rate = (dryCleaning ? itemOption : service.selectedOptions[0]).dataset;
  const rateMin = Number(rate.low);
  const rateMax = Number(rate.high);
  if (!rateMin && !rateMax) return { prompt: labels.individual, dryCleaning, measureArea };

  const input = measureArea ? area : quantity;
  const amount = input.valueAsNumber;
  const orderMinimum = Number(rate.minimum || 0);
  const note = orderMinimum ? `${labels.minimum} — ${money(orderMinimum)}` : "";
  if (!(amount > 0 && input.validity.valid)) {
    return { prompt: measureArea ? labels.enterArea : labels.enterQuantity, note, dryCleaning, measureArea };
  }

  const low = rateMin ? Math.max(orderMinimum, Math.round(rateMin * amount)) : 0;
  const high = rateMax ? Math.max(orderMinimum, Math.round(rateMax * amount)) : 0;
  const total = low === high ? money(low)
    : !low ? labels.upTo(money(high))
    : !high ? labels.from(money(low))
    : `${formatter.format(low)}–${money(high)}`;
  return { total, note, dryCleaning, measureArea };
}

function updateEstimate() {
  const dryCleaning = service.value === "dry";
  const measureArea = !dryCleaning || item.selectedOptions[0].dataset.area === "true";
  setField(areaField, area, measureArea);
  setField(itemField, item, dryCleaning);
  setField(quantityField, quantity, dryCleaning && item.value !== "" && !measureArea);
  const current = getEstimate();
  estimate.value = current.total || current.prompt;
  estimateNote.textContent = current.note || "";
  return current;
}

function clearResult() {
  if (result.hidden) return;
  result.hidden = true;
  status.textContent = "";
  message.value = "";
  whatsappLink.removeAttribute("href");
}

function validatePhone() {
  const value = phone.value.trim();
  const digits = value.replace(/\D/g, "");
  const valid = /^\+?[0-9\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
  phone.setCustomValidity(value && !valid ? copy.phoneFormat : "");
}

document.addEventListener("click", (event) => {
  const serviceLink = event.target.closest("[data-service]");
  if (!serviceLink || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  service.value = serviceLink.dataset.service;
  service.setCustomValidity("");
  clearResult();
  updateEstimate();
  if (event.detail === 0) {
    const heading = document.querySelector("#contact-title");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
});

form.addEventListener("input", (event) => {
  event.target.setCustomValidity?.("");
  if (event.target === phone) validatePhone();
  clearResult();
  if ([service, item, area, quantity].includes(event.target)) updateEstimate();
});

form.addEventListener("invalid", (event) => {
  const field = event.target;
  if (field === service) field.setCustomValidity(copy.serviceRequired);
  if (field === city) field.setCustomValidity(labels.cityRequired);
  if (field === phone && field.validity.valueMissing) field.setCustomValidity(copy.phoneRequired);
  if (field === area) field.setCustomValidity(copy.areaFormat);
}, true);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  validatePhone();
  if (!form.reportValidity()) return;

  const branch = city.selectedOptions[0];
  const calculation = updateEstimate();
  const lines = [
    copy.greeting(document.body.dataset.brand),
    `${labels.city}: ${branch.label}`,
    `${copy.serviceLabel}: ${service.selectedOptions[0].label}`,
  ];

  if (calculation.dryCleaning && item.value) lines.push(`${labels.item}: ${item.selectedOptions[0].label}`);
  if (!area.disabled && area.value) lines.push(`${copy.areaLabel}: ${area.value} м²`);
  if (!quantity.disabled && quantity.value) lines.push(`${labels.quantity}: ${quantity.value} ${labels.unit}`);
  if (calculation.total) lines.push(`${labels.estimate}: ${calculation.total}`);
  if (notes.value.trim()) lines.push(`${copy.notesLabel}: ${notes.value.trim()}`);
  lines.push(`${copy.phoneLabel}: ${phone.value.trim()}`);

  message.value = lines.join("\n");
  whatsappLink.href = `https://wa.me/${branch.dataset.whatsapp}?text=${encodeURIComponent(message.value)}`;
  result.hidden = false;
  status.textContent = copy.ready;
  message.focus({ preventScroll: true });
  result.scrollIntoView({ block: "nearest" });
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = copy.copied;
  } catch {
    message.focus();
    message.select();
    if (document.execCommand("copy")) {
      status.textContent = copy.copied;
      copyButton.focus();
    } else {
      status.textContent = copy.selected;
    }
  }
});

updateEstimate();
form.querySelector("button[type='submit']").disabled = false;
