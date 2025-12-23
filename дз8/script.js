(() => {
  "use strict";

  const FORM_ENDPOINT = "https://formcarry.com/s/aOXlh_cQ5Ya";

  const STORAGE_KEY = "feedbackFormDraft.v1";
  const OPEN_PATH = "#feedback";

  const overlay = document.getElementById("overlay");
  const openBtn = document.getElementById("openBtn");
  const closeBtn = document.getElementById("closeBtn");
  const form = document.getElementById("feedbackForm");
  const statusEl = document.getElementById("status");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");

  const fields = ["fullName", "email", "phone", "company", "message", "consent"];

  function setStatus(text, type) {
    statusEl.textContent = text || "";
    statusEl.style.color =
      type === "ok" ? "#34d399" :
      type === "error" ? "#fb7185" : "#9ca3af";
  }

  function saveDraft() {
    const data = {};
    fields.forEach(name => {
      const el = form.elements[name];
      if (!el) return;
      data[name] = el.type === "checkbox" ? el.checked : el.value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadDraft() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      fields.forEach(name => {
        const el = form.elements[name];
        if (!el || data[name] === undefined) return;
        if (el.type === "checkbox") el.checked = data[name];
        else el.value = data[name];
      });
    } catch {}
  }

  function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function openModal(push) {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    loadDraft();
    if (push) history.pushState({ modal: true }, "", OPEN_PATH);
    form.elements.fullName.focus();
  }

  function closeModal(fromPop) {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (!fromPop && location.hash === OPEN_PATH) history.back();
  }

  openBtn.onclick = () => openModal(true);
  closeBtn.onclick = () => closeModal(false);

  overlay.onclick = e => {
    if (e.target === overlay) closeModal(false);
  };

  window.onkeydown = e => {
    if (e.key === "Escape" && !overlay.hidden) closeModal(false);
  };

  window.onpopstate = () => {
    if (!overlay.hidden) closeModal(true);
  };

  if (location.hash === OPEN_PATH) openModal(false);

  form.addEventListener("input", saveDraft);

  resetBtn.onclick = () => {
    form.reset();
    clearDraft();
    setStatus("Данные очищены", "neutral");
  };

  function validate() {
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    const phoneDigits = form.elements.phone.value.replace(/\D/g, "");
    if (phoneDigits.length < 6) {
      setStatus("Некорректный номер телефона", "error");
      return false;
    }

    if (!form.elements.consent.checked) {
      setStatus("Необходимо согласие на обработку данных", "error");
      return false;
    }

    return true;
  }

  form.onsubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    setStatus("Отправка...", "neutral");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (!res.ok) throw new Error("Ошибка отправки");

      setStatus("Сообщение успешно отправлено!", "ok");
      form.reset();
      clearDraft();
      setTimeout(() => closeModal(false), 800);
    } catch {
      setStatus("Ошибка отправки. Попробуйте позже.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  };
})();
