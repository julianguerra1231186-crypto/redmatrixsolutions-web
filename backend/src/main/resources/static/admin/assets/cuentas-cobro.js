const API = '/api/admin/cuentas-cobro';
const form = document.querySelector('#accountForm');
const historyList = document.querySelector('[data-history]');
const frame = document.querySelector('[data-pdf-frame]');
const toast = document.querySelector('[data-toast]');
const searchInput = document.querySelector('[data-search]');
const dateFilter = document.querySelector('[data-date-filter]');
let selectedId = null;
let pdfUrl = null;

const fields = [
  'numero', 'fecha', 'ciudad', 'cliente', 'ciudadCliente', 'asunto', 'conceptoServicio',
  'marcasServicios', 'actividadesDesarrolladas', 'valorTotalServicio', 'valorPagar',
  'observaciones', 'medioPago', 'numeroMedioPago', 'titularCuenta', 'documentoIdentidad',
  'responsable', 'firma'
];

document.addEventListener('DOMContentLoaded', () => {
  form.fecha.valueAsDate = new Date();
  bindEvents();
  loadHistory();
});

function bindEvents() {
  form.addEventListener('submit', saveAccount);
  document.querySelector('[data-new]').addEventListener('click', resetForm);
  document.querySelector('[data-cancel]').addEventListener('click', resetForm);
  document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', previewPdf));
  document.querySelectorAll('[data-download]').forEach(button => button.addEventListener('click', downloadPdf));
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', printPdf));
  searchInput.addEventListener('input', debounce(loadHistory, 260));
  dateFilter.addEventListener('change', loadHistory);
}

async function saveAccount(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const payload = readForm();
  const url = selectedId ? `${API}/${selectedId}` : API;
  const method = selectedId ? 'PUT' : 'POST';
  const account = await request(url, { method, body: JSON.stringify(payload) });
  selectedId = account.id;
  form.id.value = account.id;
  document.querySelector('[data-form-title]').textContent = `Editando ${account.numero}`;
  await loadHistory();
  showToast('Cuenta guardada correctamente.');
}

async function loadHistory() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (dateFilter.value) params.set('fecha', dateFilter.value);
  const accounts = await request(`${API}?${params.toString()}`);
  historyList.innerHTML = accounts.length ? '' : '<div class="history-item"><span>No hay cuentas guardadas.</span></div>';
  accounts.forEach(account => historyList.appendChild(renderHistory(account)));
}

function renderHistory(account) {
  const item = document.createElement('article');
  item.className = 'history-item';
  item.innerHTML = `
    <div>
      <strong>${escapeHtml(account.numero)} - ${escapeHtml(account.cliente)}</strong><br>
      <span>${escapeHtml(account.fecha)} · ${formatMoney(account.valorPagar)}</span>
    </div>
    <div class="history-actions">
      <button type="button" data-edit>Editar</button>
      <button type="button" data-preview>Vista previa</button>
      <button type="button" data-download>Descargar</button>
      <button type="button" data-delete>Eliminar</button>
    </div>
  `;
  item.querySelector('[data-edit]').addEventListener('click', () => fillForm(account));
  item.querySelector('[data-preview]').addEventListener('click', () => previewPdf(account.id));
  item.querySelector('[data-download]').addEventListener('click', () => downloadPdf(account.id));
  item.querySelector('[data-delete]').addEventListener('click', () => deleteAccount(account.id));
  return item;
}

function fillForm(account) {
  selectedId = account.id;
  form.id.value = account.id;
  fields.forEach(name => {
    if (Array.isArray(account[name])) {
      form[name].value = account[name].join('\n');
    } else {
      form[name].value = account[name] ?? '';
    }
  });
  document.querySelector('[data-form-title]').textContent = `Editando ${account.numero}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  selectedId = null;
  form.reset();
  form.fecha.valueAsDate = new Date();
  form.ciudad.value = 'Neiva';
  form.medioPago.value = 'Bre-B';
  form.responsable.value = 'Julian Guerra';
  form.firma.value = 'Julian Guerra';
  document.querySelector('[data-form-title]').textContent = 'Nueva cuenta';
}

async function previewPdf(id = selectedId) {
  const accountId = await ensureSaved(id);
  if (!accountId) return;
  const blob = await requestBlob(`${API}/${accountId}/pdf`);
  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  pdfUrl = URL.createObjectURL(blob);
  frame.src = pdfUrl;
  showToast('Vista previa generada.');
}

async function downloadPdf(id = selectedId) {
  const accountId = await ensureSaved(id);
  if (!accountId) return;
  const blob = await requestBlob(`${API}/${accountId}/pdf`);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Cuenta-de-Cobro-${form.numero.value || accountId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

async function printPdf(id = selectedId) {
  await previewPdf(id);
  frame.contentWindow?.focus();
  frame.contentWindow?.print();
}

async function deleteAccount(id) {
  if (!confirm('Deseas eliminar esta cuenta de cobro?')) return;
  await request(`${API}/${id}`, { method: 'DELETE' });
  if (selectedId === id) resetForm();
  await loadHistory();
  showToast('Cuenta eliminada.');
}

async function ensureSaved(id) {
  if (id) return id;
  await saveAccount(new Event('submit'));
  return selectedId;
}

function readForm() {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    ...data,
    marcasServicios: splitLines(data.marcasServicios),
    actividadesDesarrolladas: splitLines(data.actividadesDesarrolladas),
    valorTotalServicio: Number(data.valorTotalServicio),
    valorPagar: Number(data.valorPagar)
  };
}

function splitLines(value) {
  return String(value || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw await toError(response);
  if (response.status === 204) return null;
  return response.json();
}

async function requestBlob(url) {
  const response = await fetch(url);
  if (!response.ok) throw await toError(response);
  return response.blob();
}

async function toError(response) {
  let message = 'No fue posible completar la operacion.';
  try {
    const body = await response.json();
    message = body.message || message;
  } catch (error) {
    message = response.statusText || message;
  }
  showToast(message);
  return new Error(message);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function debounce(fn, wait) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, wait);
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
