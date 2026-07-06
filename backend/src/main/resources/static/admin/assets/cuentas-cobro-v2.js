const API = '/api/admin/cuentas-cobro';
const CLIENTS_KEY = 'redmatrix.admin.clients';

const form = document.querySelector('#accountForm');
const historyList = document.querySelector('[data-history]');
const frame = document.querySelector('[data-pdf-frame]');
const toast = document.querySelector('[data-toast]');
const searchInput = document.querySelector('[data-search]');
const dateFilter = document.querySelector('[data-date-filter]');
const livePreview = document.querySelector('[data-live-preview]');
const clientForm = document.querySelector('[data-client-form]');
const clientList = document.querySelector('[data-client-list]');

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
  renderClients();
  updateLivePreview();
});

function bindEvents() {
  form.addEventListener('submit', saveAccount);
  form.addEventListener('input', event => {
    if (event.target.classList.contains('money-input')) formatMoneyField(event.target);
    updateLivePreview();
  });
  form.addEventListener('change', updateLivePreview);

  document.querySelector('[data-new]').addEventListener('click', resetForm);
  document.querySelector('[data-cancel]').addEventListener('click', resetForm);
  document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', previewPdf));
  document.querySelectorAll('[data-download]').forEach(button => button.addEventListener('click', downloadPdf));
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', printPdf));
  searchInput.addEventListener('input', debounce(loadHistory, 260));
  dateFilter.addEventListener('change', loadHistory);

  clientForm.addEventListener('submit', saveClient);
  clientForm.addEventListener('input', event => {
    if (event.target.classList.contains('money-input')) formatMoneyField(event.target);
  });
  document.querySelector('[data-clear-client]').addEventListener('click', () => clientForm.reset());
}

async function saveAccount(event) {
  event.preventDefault();
  if (!form.reportValidity()) {
    showToast('Completa los campos obligatorios antes de guardar.');
    return null;
  }

  const payload = readForm();
  const url = selectedId ? `${API}/${selectedId}` : API;
  const method = selectedId ? 'PUT' : 'POST';
  const account = await request(url, { method, body: JSON.stringify(payload) });
  selectedId = account.id;
  form.id.value = account.id;
  document.querySelector('[data-form-title]').textContent = `Editando ${account.numero}`;
  await loadHistory();
  updateLivePreview();
  showToast('Cuenta guardada correctamente.');
  return account;
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
      <button type="button" data-preview>Vista previa PDF</button>
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
    } else if (name === 'valorTotalServicio' || name === 'valorPagar') {
      form[name].value = formatMoney(account[name]);
    } else {
      form[name].value = account[name] ?? '';
    }
  });
  document.querySelector('[data-form-title]').textContent = `Editando ${account.numero}`;
  updateLivePreview();
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
  updateLivePreview();
}

async function previewPdf(id = selectedId) {
  id = normalizeActionId(id);
  const accountId = await ensureSaved(id);
  if (!accountId) return;
  const blob = await requestBlob(`${API}/${accountId}/pdf`);
  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  pdfUrl = URL.createObjectURL(blob);
  frame.src = pdfUrl;
  showToast('PDF generado correctamente.');
}

async function downloadPdf(id = selectedId) {
  id = normalizeActionId(id);
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
  id = normalizeActionId(id);
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
  if (!form.reportValidity()) {
    showToast('Completa la cuenta antes de generar el PDF.');
    return null;
  }
  const account = await saveAccount(new Event('submit'));
  return account?.id || selectedId;
}

function normalizeActionId(id) {
  return id instanceof Event ? selectedId : id;
}

function readForm() {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    ...data,
    marcasServicios: splitLines(data.marcasServicios),
    actividadesDesarrolladas: splitLines(data.actividadesDesarrolladas),
    valorTotalServicio: parseMoney(data.valorTotalServicio),
    valorPagar: parseMoney(data.valorPagar)
  };
}

function updateLivePreview() {
  const data = readForm();
  const marcas = data.marcasServicios.length ? data.marcasServicios : ['Marca o servicio pendiente'];
  const actividades = data.actividadesDesarrolladas.length ? data.actividadesDesarrolladas : ['Actividad pendiente'];

  livePreview.innerHTML = `
    <div class="document-preview__header">
      <div><div class="document-preview__brand">RED MATRIX SOLUTIONS</div><span>Cuenta de cobro corporativa</span></div>
      <div><span class="document-preview__label">Fecha</span><span class="document-preview__value">${escapeHtml(formatDate(data.fecha))}</span></div>
    </div>
    <h3>CUENTA DE COBRO</h3>
    <div class="document-preview__meta document-preview__grid">
      ${previewField('No.', data.numero || 'Pendiente')}
      ${previewField('Ciudad', data.ciudad || 'Neiva')}
      ${previewField('Cliente', data.cliente || 'Nombre del cliente')}
    </div>
    <div class="document-preview__box">
      ${previewField('Ciudad del cliente', data.ciudadCliente || 'Pendiente')}
      ${previewField('Asunto', data.asunto || 'Pendiente')}
    </div>
    ${previewSection('Concepto del servicio', data.conceptoServicio || 'Describe aqui el servicio prestado.')}
    ${previewList('Marcas o servicios incluidos', marcas)}
    ${previewList('Actividades desarrolladas', actividades)}
    <div class="document-preview__amounts">
      <div class="document-preview__amount"><span class="document-preview__label">Valor total del servicio</span><strong>${formatMoney(data.valorTotalServicio)}</strong></div>
      <div class="document-preview__amount document-preview__amount--main"><span class="document-preview__label">Valor a pagar</span><strong>${formatMoney(data.valorPagar)}</strong></div>
    </div>
    ${previewSection('Observaciones', data.observaciones || 'Sin observaciones adicionales.')}
    <div class="document-preview__box document-preview__grid">
      ${previewField('Medio de pago', data.medioPago || 'Bre-B')}
      ${previewField('Numero', data.numeroMedioPago || 'Pendiente')}
      ${previewField('Titular', data.titularCuenta || 'Pendiente')}
    </div>
    <div class="document-preview__signature">
      <div>______________________________</div>
      <div>${escapeHtml(data.responsable || 'Julian Guerra')}</div>
      <small>Firma: ${escapeHtml(data.firma || 'Julian Guerra')}</small>
    </div>
  `;
}

function previewField(label, value) {
  return `<div><span class="document-preview__label">${escapeHtml(label)}</span><span class="document-preview__value">${escapeHtml(value)}</span></div>`;
}

function previewSection(title, text) {
  return `<section class="document-preview__section"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(text)}</p></section>`;
}

function previewList(title, values) {
  return `<section class="document-preview__section"><h4>${escapeHtml(title)}</h4><ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul></section>`;
}

function saveClient(event) {
  event.preventDefault();
  if (!clientForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(clientForm).entries());
  const clients = getClients();
  clients.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    nombreCliente: data.nombreCliente.trim(),
    empresaCliente: data.empresaCliente.trim(),
    valorCliente: parseMoney(data.valorCliente),
    observacionesCliente: (data.observacionesCliente || '').trim(),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  clientForm.reset();
  renderClients();
  showToast('Cliente registrado en el inventario.');
}

function renderClients() {
  const clients = getClients();
  clientList.innerHTML = clients.length ? '' : '<div class="history-item"><span>No hay clientes registrados todavia.</span></div>';
  clients.forEach(client => {
    const item = document.createElement('article');
    item.className = 'client-card';
    item.innerHTML = `
      <div><strong>${escapeHtml(client.nombreCliente)}</strong><br><span>${escapeHtml(client.empresaCliente)}</span></div>
      <div class="client-card__value">${formatMoney(client.valorCliente)}</div>
      <span>${escapeHtml(client.observacionesCliente || 'Sin observaciones')}</span>
      <div class="client-card__actions">
        <button type="button" data-client-use>Usar en cuenta</button>
        <button type="button" data-client-delete>Eliminar</button>
      </div>
    `;
    item.querySelector('[data-client-use]').addEventListener('click', () => useClient(client));
    item.querySelector('[data-client-delete]').addEventListener('click', () => deleteClient(client.id));
    clientList.appendChild(item);
  });
}

function useClient(client) {
  form.cliente.value = client.nombreCliente;
  form.asunto.value = form.asunto.value || `Cuenta de cobro por servicios prestados a ${client.empresaCliente}`;
  form.valorTotalServicio.value = formatMoney(client.valorCliente);
  form.valorPagar.value = formatMoney(client.valorCliente);
  form.observaciones.value = client.observacionesCliente || form.observaciones.value;
  updateLivePreview();
  window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
  showToast('Cliente cargado en la cuenta.');
}

function deleteClient(id) {
  if (!confirm('Deseas eliminar este cliente del inventario?')) return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(getClients().filter(client => client.id !== id)));
  renderClients();
}

function getClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]');
  } catch (error) {
    return [];
  }
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

function formatMoneyField(input) {
  const value = parseMoney(input.value);
  input.value = value ? formatMoney(value) : '';
}

function parseMoney(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return 'Pendiente';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}
