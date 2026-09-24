const SUPABASE_URL = "https://srottoudvavudcujvzeb.supabase.co";
const SUPABASE_KEY = "sb_publishable_wpYSqgBPatf4EZa2AsKLpA_He28PET4";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
const mercadoPago = new MercadoPago(
  "APP_USR-b933dc01-8f7b-49af-8eff-eba314067a41",
  {
    locale: "es-AR"
  }
);
async function probarConexion() {
  const { data, error } = await supabaseClient
    .from("qr_codes")
    .select("*")
    .limit(1);

  if (error) {
    console.error("❌ Error Supabase:", error);
  } else {
    console.log("✅ Supabase conectado correctamente", data);
  }
}

probarConexion();
const generateBtn = document.getElementById("generateBtn");
const qrText = document.getElementById("qrText");
const qrContainer = document.getElementById("qrcode");
const qrTypeBtns = document.querySelectorAll(".qrTypeBtn");
const qrFileInput = document.getElementById("qrFile");
const qrSearch = document.getElementById("qrSearch");
const qrCount = document.getElementById("qrCount");
const qrLogoInput = document.getElementById("qrLogo");
const qrColorInput = document.getElementById("qrColor");
const vcardFields = document.getElementById("vcardFields");
const specialFields = document.getElementById("specialFields");
const specialColorInput = document.getElementById("specialColor");
const specialColorValue = document.getElementById("specialColorValue");

const qrColorValue = document.getElementById("qrColorValue");
const vcardColorInput = document.getElementById("vcardColor");
const vcardColorValue = document.getElementById("vcardColorValue");
const vcardPhotoInput = document.getElementById("vcardPhoto");
const vcardBackgroundInput = document.getElementById("vcardBackground");

qrColorInput.addEventListener("input", () => {
  qrColorValue.textContent = qrColorInput.value.toUpperCase();
});
vcardColorInput.addEventListener("input", () => {
  vcardColorValue.textContent = vcardColorInput.value.toUpperCase();
});
specialColorInput.addEventListener("input", () => {
  specialColorValue.textContent = specialColorInput.value.toUpperCase();
});
const qrBackgroundColorInput = document.getElementById("qrBackgroundColor");
const qrBackgroundColorValue = document.getElementById("qrBackgroundColorValue");

qrBackgroundColorInput.addEventListener("input", () => {
  qrBackgroundColorValue.textContent =
    qrBackgroundColorInput.value.toUpperCase();
});

function colorEsDemasiadoClaro(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brillo = (r * 299 + g * 587 + b * 114) / 1000;

  return brillo > 190;
}


qrSearch.addEventListener("input", () => {
  const busqueda = qrSearch.value.toLowerCase().trim();

  const tarjetas = document.querySelectorAll(".qrItem");

  let visibles = 0;

  tarjetas.forEach((tarjeta) => {
    const nombre = (tarjeta.dataset.name || "").toLowerCase();

    if (nombre.includes(busqueda)) {
      tarjeta.style.display = "block";
      visibles++;
    } else {
      tarjeta.style.display = "none";
    }
  });

  if (busqueda) {
    qrCount.textContent = `${visibles} de ${tarjetas.length} códigos`;
  } else {
    qrCount.textContent = `${tarjetas.length} ${tarjetas.length === 1 ? "código guardado" : "códigos guardados"}`;
  }
});
let selectedQrType = "url";

  function actualizarTipoQr() {


  // Ocultamos todos los campos especiales
  vcardFields.style.display = "none";
  specialFields.style.display = "none";
  qrText.style.display = "none";
  qrFileInput.style.display = "none";

  // ENLACE
  if (selectedQrType === "url") {
    qrText.style.display = "block";
    qrText.placeholder = "https://tusitio.com";
  }

  // ARCHIVOS
  else if (selectedQrType === "image") {
    qrFileInput.style.display = "block";
    qrFileInput.accept = "image/*";
  }

  else if (selectedQrType === "pdf") {
    qrFileInput.style.display = "block";
    qrFileInput.accept = "application/pdf";
  }

  else if (selectedQrType === "audio") {
    qrFileInput.style.display = "block";
    qrFileInput.accept = "audio/*";
  }

  // TARJETA DE PRESENTACIÓN PRO
  else if (selectedQrType === "vcard") {
    vcardFields.style.display = "block";
  }

  // TARJETA ESPECIAL PRO
  else if (selectedQrType === "special") {
    specialFields.style.display = "block";
  }
}



qrTypeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
  if (
  (btn.dataset.type === "vcard" || btn.dataset.type === "special") &&
  userPlan !== "premium"
) {
  alert("👑 Esta función es exclusiva de QRcrea PRO.");
  return;
}
    selectedQrType = btn.dataset.type;
    qrFileInput.value = "";
    if (selectedQrType === "image") {
  qrFileInput.accept = "image/*";
} else if (selectedQrType === "pdf") {
  qrFileInput.accept = "application/pdf";
} else if (selectedQrType === "audio") {
  qrFileInput.accept = "audio/*";
}

    qrTypeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    actualizarTipoQr();
  });
});

actualizarTipoQr();

generateBtn.addEventListener("click", async () => {

  const qrName = document.getElementById("qrName").value.trim();
  const contenido = qrText.value.trim();
  const vcardName = document.getElementById("vcardName").value.trim();
const vcardCompany = document.getElementById("vcardCompany").value.trim();
const vcardDescription = document.getElementById("vcardDescription").value.trim();
const vcardPhone = document.getElementById("vcardPhone").value.trim();
const vcardWhatsapp = document.getElementById("vcardWhatsapp").value.trim();
const vcardEmail = document.getElementById("vcardEmail").value.trim();
const vcardWebsite = document.getElementById("vcardWebsite").value.trim();
const vcardInstagram = document.getElementById("vcardInstagram").value.trim();
const vcardFacebook = document.getElementById("vcardFacebook").value.trim();
const vcardTiktok = document.getElementById("vcardTiktok").value.trim();
const vcardLinkedin = document.getElementById("vcardLinkedin").value.trim();
const specialTemplate = document.getElementById("specialTemplate").value;
const specialTitle = document.getElementById("specialTitle").value.trim();
const specialMessage = document.getElementById("specialMessage").value.trim();
const specialButtonText = document.getElementById("specialButtonText").value.trim();
const specialButtonUrl = document.getElementById("specialButtonUrl").value.trim();

const specialImageArchivo =
  document.getElementById("specialImage").files[0];

const specialBackgroundArchivo =
  document.getElementById("specialBackground").files[0];

const specialMusicArchivo =
  document.getElementById("specialMusic").files[0];

let specialImagePath = null;
let specialBackgroundPath = null;
let specialMusicPath = null;
  const qrFile = document.getElementById("qrFile");
  const archivo = qrFile.files[0];
  const logoArchivo = qrLogoInput.files[0];
  let logoPath = null;
  const vcardPhotoArchivo = vcardPhotoInput.files[0];
let vcardPhotoPath = null;
const vcardBackgroundArchivo = vcardBackgroundInput.files[0];
let vcardBackgroundPath = null;

if (!qrName) {
  alert("Completá el nombre del QR.");
  return;
}

if (selectedQrType === "url" && !contenido) {
  alert("Ingresá un enlace.");
  return;
}
if (selectedQrType === "vcard" && !vcardName) {
  alert("Completá el nombre de la tarjeta.");
  return;
}
if (selectedQrType === "special" && !specialTitle) {
  alert("Completá el título de la tarjeta.");
  return;
}

if (
  selectedQrType !== "url" &&
  selectedQrType !== "vcard" &&
  selectedQrType !== "special" &&
  !archivo
) {
  alert("Seleccioná el archivo correspondiente.");
  return;
}

if (colorEsDemasiadoClaro(qrColorInput.value)) {
  alert("Elegí un color más oscuro para garantizar que el código QR pueda escanearse correctamente.");
  return;
}
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    alert("Tenés que iniciar sesión para guardar el QR.");
    return;
  }
  let destinoFinal = contenido;
  let tipoQr = "url";
  let vcardData = null;

if (selectedQrType === "vcard") {
  tipoQr = "vcard";

 
}
if (selectedQrType === "special") {
  tipoQr = "special";
}

if (archivo) {
  const nombreSeguro = `${Date.now()}-${archivo.name}`;
  const rutaArchivo = `${user.id}/${nombreSeguro}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("user-files")
    .upload(rutaArchivo, archivo);

  if (uploadError) {
    console.error("Error al subir archivo:", uploadError);
    alert("No se pudo subir el archivo.");
    return;
  }

  destinoFinal = rutaArchivo;

  if (archivo.type.startsWith("image/")) {
    tipoQr = "image";
  } else if (archivo.type.startsWith("audio/")) {
    tipoQr = "audio";
  } else if (archivo.type === "application/pdf") {
    tipoQr = "pdf";
  } else {
    tipoQr = "file";
  }
}
if (logoArchivo) {

  if (!logoArchivo.type.startsWith("image/")) {
    alert("El logo debe ser una imagen.");
    return;
  }

  const nombreLogoSeguro = `${Date.now()}-logo-${logoArchivo.name}`;
  const rutaLogo = `${user.id}/${nombreLogoSeguro}`;

  const { error: logoUploadError } = await supabaseClient.storage
    .from("user-files")
    .upload(rutaLogo, logoArchivo);

  if (logoUploadError) {
    console.error("Error al subir logo:", logoUploadError);
    alert("No se pudo subir el logo.");
    return;
  }

  logoPath = rutaLogo;
}
if (vcardPhotoArchivo) {

  if (!vcardPhotoArchivo.type.startsWith("image/")) {
    alert("La foto de la tarjeta debe ser una imagen.");
    return;
  }

  const nombreFotoSeguro =
    `${Date.now()}-vcard-${vcardPhotoArchivo.name}`;

  const rutaFoto =
    `${user.id}/${nombreFotoSeguro}`;

  const { error: fotoUploadError } =
    await supabaseClient.storage
      .from("user-files")
      .upload(rutaFoto, vcardPhotoArchivo);

  if (fotoUploadError) {
    console.error("Error al subir foto de tarjeta:", fotoUploadError);
    alert("No se pudo subir la foto de la tarjeta.");
    return;
  }

  vcardPhotoPath = rutaFoto;
}
if (vcardBackgroundArchivo) {
  if (!vcardBackgroundArchivo.type.startsWith("image/")) {
    alert("El fondo de la tarjeta debe ser una imagen.");
    return;
  }

  const nombreFondoSeguro =
    `${Date.now()}-vcard-background-${vcardBackgroundArchivo.name}`;

  const rutaFondo =
    `${user.id}/${nombreFondoSeguro}`;

  const { error: fondoUploadError } =
    await supabaseClient.storage
      .from("user-files")
      .upload(rutaFondo, vcardBackgroundArchivo);

  if (fondoUploadError) {
    console.error("Error al subir fondo de tarjeta:", fondoUploadError);
    alert("No se pudo subir la imagen de fondo.");
    return;
  }

  vcardBackgroundPath = rutaFondo;
}
// ===============================
// ARCHIVOS TARJETA ESPECIAL PRO
// ===============================

// Imagen principal
if (specialImageArchivo) {

  if (!specialImageArchivo.type.startsWith("image/")) {
    alert("La imagen principal debe ser una imagen.");
    return;
  }

  const nombreImagen =
    `${Date.now()}-special-image-${specialImageArchivo.name}`;

  const rutaImagen =
    `${user.id}/${nombreImagen}`;

  const { error: imagenError } =
    await supabaseClient.storage
      .from("user-files")
      .upload(rutaImagen, specialImageArchivo);

  if (imagenError) {
    console.error("Error al subir imagen:", imagenError);
    alert("No se pudo subir la imagen principal.");
    return;
  }

  specialImagePath = rutaImagen;
}


// Imagen de fondo
if (specialBackgroundArchivo) {

  if (!specialBackgroundArchivo.type.startsWith("image/")) {
    alert("El fondo debe ser una imagen.");
    return;
  }

  const nombreFondo =
    `${Date.now()}-special-background-${specialBackgroundArchivo.name}`;

  const rutaFondo =
    `${user.id}/${nombreFondo}`;

  const { error: fondoError } =
    await supabaseClient.storage
      .from("user-files")
      .upload(rutaFondo, specialBackgroundArchivo);

  if (fondoError) {
    console.error("Error al subir fondo:", fondoError);
    alert("No se pudo subir la imagen de fondo.");
    return;
  }

  specialBackgroundPath = rutaFondo;
}


// Música
if (specialMusicArchivo) {

  if (!specialMusicArchivo.type.startsWith("audio/")) {
    alert("El archivo de música debe ser un audio.");
    return;
  }

  const nombreMusica =
    `${Date.now()}-special-music-${specialMusicArchivo.name}`;

  const rutaMusica =
    `${user.id}/${nombreMusica}`;

  const { error: musicaError } =
    await supabaseClient.storage
      .from("user-files")
      .upload(rutaMusica, specialMusicArchivo);

  if (musicaError) {
    console.error("Error al subir música:", musicaError);
    alert("No se pudo subir la música.");
    return;
  }

  specialMusicPath = rutaMusica;
}
if (selectedQrType === "vcard") {
  vcardData = {
    name: vcardName,
    company: vcardCompany,
     description: vcardDescription,
    phone: vcardPhone,
    whatsapp: vcardWhatsapp,
    email: vcardEmail,
    website: vcardWebsite,
    instagram: vcardInstagram,
   facebook: vcardFacebook,
   tiktok: vcardTiktok,
   linkedin: vcardLinkedin,
    color: vcardColorInput.value,
    photo_path: vcardPhotoPath,
    background_path: vcardBackgroundPath
  };
}
if (selectedQrType === "special") {
  vcardData = {
    template: specialTemplate,
    title: specialTitle,
    message: specialMessage,
    button_text: specialButtonText,
    button_url: specialButtonUrl,
    color: specialColorInput.value,
    image_path: specialImagePath,
    background_path: specialBackgroundPath,
    music_path: specialMusicPath
  };
}
  qrContainer.innerHTML = "";
  const qrResultCard = document.getElementById("qrResultCard");
qrResultCard.style.display = "block";
qrContainer.style.borderColor = qrColorInput.value;

const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
let paginaDestino = "q.html";

if (selectedQrType === "vcard") {
  paginaDestino = "vcard.html";
}

if (selectedQrType === "special") {
  paginaDestino = "special.html";
}

const urlPublica = new URL(
  `${paginaDestino}?slug=${slug}`,
  window.location.href
).href;

 new QRCode(qrContainer, {
  text: urlPublica,
  width: 180,
  height: 180,
  colorDark: qrColorInput.value,
  correctLevel: QRCode.CorrectLevel.H,
  colorLight: qrBackgroundColorInput.value,
});

const logoFile = qrLogoInput.files[0];

if (logoFile) {
  const logo = document.createElement("img");

  logo.src = URL.createObjectURL(logoFile);
  logo.className = "qrCenterLogo";

  qrContainer.style.position = "relative";
  qrContainer.style.width = "220px";
  qrContainer.style.height = "220px";

  qrContainer.appendChild(logo);
}
 

  const { data, error } = await supabaseClient
    .from("qr_codes")
    .insert({
      user_id: user.id,
      name: qrName,
      type: tipoQr,
      destination_url: destinoFinal,
      slug: slug,
      logo_path: logoPath,
      qr_color: qrColorInput.value,
      background_color: qrBackgroundColorInput.value,
      vcard_data: vcardData,
    })
    .select();

  if (error) {
    console.error("Error al guardar QR:", error);
    alert("El QR se generó, pero no se pudo guardar.");
    return;
  }

  console.log("QR guardado:", data);
  await cargarMisQR();
  document.getElementById("qrName").value = "";
qrText.value = "";
qrFileInput.value = "";
qrLogoInput.value = "";

qrColorInput.value = "#000000";
qrColorValue.textContent = "#000000";
  alert("✅ QR generado y guardado correctamente.");
});
const registerBtn = document.getElementById("registerBtn");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerMessage = document.getElementById("registerMessage");

registerBtn.addEventListener("click", async () => {

  const email = registerEmail.value.trim();
  const password = registerPassword.value;

  if (!email || !password) {
    registerMessage.textContent = "Completá el correo y la contraseña.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    registerMessage.textContent = "❌ " + error.message;
    console.error(error);
    return;
  }

 if (!data.user) {
  registerMessage.textContent =
    "❌ No se pudo crear la cuenta.";
  return;
}

if (data.user.identities && data.user.identities.length === 0) {

  registerMessage.innerHTML =
    '⚠️ Ese correo ya está registrado. <a href="#login" id="goToLogin">Iniciá sesión</a>.';

  document.getElementById("goToLogin").addEventListener("click", () => {
    registerCard.style.display = "none";
    loginCard.style.display = "block";
  });

  return;
}

registerMessage.textContent =
  "✅ Cuenta creada. Revisá tu correo para confirmar el registro.";

console.log("Usuario registrado:", data);
});
const loginBtn = document.getElementById("loginBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    loginMessage.textContent = "Completá el correo y la contraseña.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginMessage.textContent = "❌ " + error.message;
    console.error(error);
    return;
  }

  loginMessage.textContent = "✅ Sesión iniciada correctamente.";
  console.log("Usuario conectado:", data.user);
  await actualizarSesion();
await cargarMisQR();
});
const logoutBtn = document.getElementById("logoutBtn");
const registerCard = document.getElementById("registerCard");
const loginCard = document.getElementById("loginCard");
const headerLogoutBtn = document.getElementById("headerLogoutBtn");
const hash = window.location.hash;

if (hash === "#registro") {
  registerCard.style.display = "block";
  loginCard.style.display = "none";
}

if (hash === "#login") {
  registerCard.style.display = "none";
  loginCard.style.display = "block";
}
let userPlan = "free";

async function actualizarSesion() {
  
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {
    await supabaseClient.functions.invoke("check-pro-subscription");
    const { data: profile, error: profileError } = await supabaseClient
  .from("profiles")
  .select("plan")
  .eq("id", user.id)
  .single();
  console.log("PROFILE:", profile);
console.error("ERROR PROFILE:", profileError);

userPlan = profile?.plan || "free";

console.log("Plan del usuario:", userPlan);
const upgradeProBtn = document.getElementById("upgradeProBtn");

if (upgradeProBtn) {
  upgradeProBtn.style.display =
    userPlan === "free" ? "inline-flex" : "none";
}
  logoutBtn.style.display = "block";
  headerLogoutBtn.style.display = "block";
  loginMessage.textContent = `✅ Sesión iniciada como ${user.email}`;

  registerCard.style.display = "none";
  loginCard.style.display = "none";

} else {
  logoutBtn.style.display = "none";
  headerLogoutBtn.style.display = "none";

  if (window.location.hash === "#registro") {
    registerCard.style.display = "block";
    loginCard.style.display = "none";

  } else if (window.location.hash === "#login") {
    registerCard.style.display = "none";
    loginCard.style.display = "block";

  } else {
    registerCard.style.display = "block";
    loginCard.style.display = "block";
  }
}
}

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();

  loginMessage.textContent = "Sesión cerrada.";
  logoutBtn.style.display = "none";
});
headerLogoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();

  loginMessage.textContent = "Sesión cerrada.";
  headerLogoutBtn.style.display = "none";

  await actualizarSesion();
});


actualizarSesion();
const myQrs = document.getElementById("myQrs");
//CARGAR MIS QR
async function cargarMisQR() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    myQrs.innerHTML = "<p>Iniciá sesión para ver tus QR.</p>";
    return;
  }

  const { data, error } = await supabaseClient
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar QR:", error);
    myQrs.innerHTML = "<p>No se pudieron cargar tus QR.</p>";
    return;
  }

  if (data.length === 0) {
    myQrs.innerHTML = "<p>Todavía no creaste ningún QR.</p>";
    return;
  }

  myQrs.innerHTML = "";
qrCount.textContent = `${data.length} ${data.length === 1 ? "código guardado" : "códigos guardados"}`;
  data.forEach(async(qr) => {
    const item = document.createElement("div");

let paginaQr = "q.html";

if (qr.type === "vcard") {
  paginaQr = "vcard.html";
}

if (qr.type === "special") {
  paginaQr = "special.html";
}

const urlQr = new URL(
  `${paginaQr}?slug=${qr.slug}`,
  window.location.href
).href;
item.dataset.name = qr.name;
item.dataset.qrUrl = urlQr;
item.dataset.logoPath = qr.logo_path || "";
item.dataset.qrColor = qr.qr_color || "#000000";

const tipoTexto = {
  url: "🔗 Enlace",
  image: "🖼 Imagen",
  pdf: "📄 PDF",
  audio: "🎵 Audio",
  vcard: "👤 Tarjeta",
  special: "🎁 Tarjeta especial",
  file: "📁 Archivo"
};

item.className = "qrItem";

item.innerHTML = `
  <div class="qrItemHeader">
   <strong class="qrItemName" title="${qr.name}">${qr.name}</strong>
    <span class="qrItemType">${tipoTexto[qr.type] || "QR"}</span>
  </div>

  <div class="savedQr"></div>

  <div class="qrItemActions">
    <button class="editQrBtn"
      data-id="${qr.id}"
      data-url="${qr.destination_url}"
      data-type="${qr.type}">
      Editar destino
    </button>

    <button class="downloadQrBtn">
      Descargar
    </button>

  <button
  class="deleteQrBtn"
  data-id="${qr.id}"
  data-type="${qr.type}"
  data-url="${qr.destination_url}">
  Eliminar
</button>
  </div>
`;
myQrs.appendChild(item);

const qrGuardado = item.querySelector(".savedQr");
qrGuardado.classList.add("qrGuardadoMarco");
qrGuardado.style.borderColor = qr.qr_color || "#000000";

new QRCode(qrGuardado, {
  text: urlQr,
  width: 160,
  height: 160,
  colorDark: qr.qr_color || "#000000",
  colorLight: qr.background_color || "#FFFFFF",
  correctLevel: QRCode.CorrectLevel.H
});
if (qr.logo_path) {
  const { data: logoData } = await supabaseClient.storage
    .from("user-files")
    .createSignedUrl(qr.logo_path, 3600);

  if (logoData?.signedUrl) {
    const logo = document.createElement("img");

    logo.src = logoData.signedUrl;
    logo.className = "qrCenterLogo";

    qrGuardado.style.position = "relative";
    qrGuardado.style.width = "160px";
    qrGuardado.style.height = "160px";

    qrGuardado.appendChild(logo);
  }
}

  });
}

cargarMisQR();
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("deleteQrBtn")) return;

  const id = e.target.dataset.id;

const tipo = e.target.dataset.type;
const ruta = e.target.dataset.url;
  const confirmar = confirm("¿Seguro que querés eliminar este QR?");

  if (!confirmar) return;
  if (tipo !== "url" && ruta) {
  const { error: storageError } = await supabaseClient.storage
    .from("user-files")
    .remove([ruta]);

  if (storageError) {
    console.error("Error al eliminar archivo:", storageError);
    alert("No se pudo eliminar el archivo asociado.");
    return;
  }
}

  const { error } = await supabaseClient
    .from("qr_codes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar QR:", error);
    alert("No se pudo eliminar el QR.");
    return;
  }

  await cargarMisQR();
  alert("✅ QR eliminado.");
});
let qrEditandoId = null;
let qrEditandoTipoAnterior = null;
let qrEditandoRutaAnterior = null;

const editPanel = document.getElementById("editPanel");
const editType = document.getElementById("editType");
const editUrl = document.getElementById("editUrl");
const editFile = document.getElementById("editFile");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("editQrBtn")) return;

  qrEditandoId = e.target.dataset.id;
  qrEditandoTipoAnterior = e.target.dataset.type;
  qrEditandoRutaAnterior = e.target.dataset.url;

  editUrl.value = e.target.dataset.url || "";
  editType.value = "url";
  editPanel.style.display = "block";
});

cancelEditBtn.addEventListener("click", () => {
  qrEditandoId = null;
  editPanel.style.display = "none";
  editUrl.value = "";
  editFile.value = "";
});
saveEditBtn.addEventListener("click", async () => {
  if (!qrEditandoId) return;

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    alert("Tenés que iniciar sesión.");
    return;
  }

  let nuevoDestino = "";
  let nuevoTipo = "";

const archivo = editFile.files[0];

if (archivo) {
  const extension = archivo.name.split(".").pop().toLowerCase();
const nombreSeguro = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const rutaArchivo = `${user.id}/${nombreSeguro}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("user-files")
    .upload(rutaArchivo, archivo);

  if (uploadError) {
    console.error("Error al subir archivo:", uploadError);
    alert("No se pudo subir el archivo.");
    return;
  }

  nuevoDestino = rutaArchivo;

  if (archivo.type.startsWith("image/")) {
    nuevoTipo = "image";
  } else if (archivo.type.startsWith("audio/")) {
    nuevoTipo = "audio";
  } else if (archivo.type === "application/pdf") {
    nuevoTipo = "pdf";
  } else {
    nuevoTipo = "file";
  }

} else {
  nuevoDestino = editUrl.value.trim();

  if (!nuevoDestino) {
    alert("Ingresá una URL o seleccioná un archivo.");
    return;
  }

  nuevoTipo = "url";
}

  const { error } = await supabaseClient
    .from("qr_codes")
    .update({
      destination_url: nuevoDestino,
      type: nuevoTipo
    })
    .eq("id", qrEditandoId);

  if (error) {
    console.error("Error al actualizar QR:", error);
    alert("No se pudo actualizar el QR.");
    return;
  }
  if (
  qrEditandoTipoAnterior &&
  qrEditandoTipoAnterior !== "url" &&
  qrEditandoRutaAnterior &&
  qrEditandoRutaAnterior !== nuevoDestino
) {
  const { error: deleteOldError } = await supabaseClient.storage
    .from("user-files")
    .remove([qrEditandoRutaAnterior]);

  if (deleteOldError) {
    console.error("No se pudo eliminar el archivo anterior:", deleteOldError);
  }
}

  editPanel.style.display = "none";
  editUrl.value = "";
  editFile.value = "";
  qrEditandoId = null;
  qrEditandoTipoAnterior = null;
  qrEditandoRutaAnterior = null;

  await cargarMisQR();

  alert("✅ Destino actualizado correctamente.");
});
function actualizarEditorTipo() {
  if (editType.value === "url") {
    editUrl.style.display = "block";
    editFile.style.display = "none";
  } else {
    editUrl.style.display = "none";
    editFile.style.display = "block";
  }
}

editType.addEventListener("change", actualizarEditorTipo);
actualizarEditorTipo();
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("downloadQrBtn")) return;

 const item = e.target.closest(".qrItem");
  const urlQr = item.dataset.qrUrl;
  const logoPath = item.dataset.logoPath;
  const qrColor = item.dataset.qrColor || "#000000";

  if (!urlQr) {
    alert("No se pudo obtener la dirección del QR.");
    return;
  }
const qrTemporal = document.createElement("div");
 new QRCode(qrTemporal, {
  text: urlQr,
  width: 1000,
  height: 1000,
  colorDark: qrColor,
  correctLevel: QRCode.CorrectLevel.H
});

  setTimeout(async () => {
  const canvas = qrTemporal.querySelector("canvas");

  if (!canvas) {
    alert("No se pudo preparar el QR para descargar.");
    return;
  }

  // Si este QR tiene logo, lo dibujamos dentro del PNG
  if (logoPath) {
    console.log("DESCARGA - logoPath:", logoPath);
    const { data: logoBlob, error: logoError } =
      await supabaseClient.storage
        .from("user-files")
        .download(logoPath);

    if (!logoError && logoBlob) {
      const logoUrl = URL.createObjectURL(logoBlob);
      const logo = new Image();

      await new Promise((resolve) => {
        logo.onload = resolve;
        logo.src = logoUrl;
      });

      const ctx = canvas.getContext("2d");

     const logoSize = 140;      // antes 200
     const fondoSize = 170;     // antes 230

      const fondoX = (canvas.width - fondoSize) / 2;
      const fondoY = (canvas.height - fondoSize) / 2;

      const logoX = (canvas.width - logoSize) / 2;
      const logoY = (canvas.height - logoSize) / 2;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(fondoX, fondoY, fondoSize, fondoSize);

      ctx.drawImage(
        logo,
        logoX,
        logoY,
        logoSize,
        logoSize
      );

      URL.revokeObjectURL(logoUrl);
    }
  }
  const canvasConMarco = document.createElement("canvas");
canvasConMarco.width = 1080;
canvasConMarco.height = 1080;

const ctxMarco = canvasConMarco.getContext("2d");

// Fondo blanco
ctxMarco.fillStyle = "#ffffff";
ctxMarco.fillRect(0, 0, 1080, 1080);

// Marco del mismo color del QR
ctxMarco.strokeStyle = qrColor;
ctxMarco.lineWidth = 18;
ctxMarco.strokeRect(9, 9, 1062, 1062);

// QR centrado dentro del marco
ctxMarco.drawImage(canvas, 40, 40, 1000, 1000);

 const dataUrl = canvasConMarco.toDataURL("image/png");

  const nombreQr = item.dataset.name || "qrcrea-qr";

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${nombreQr}.png`;
  link.click();

}, 100);
});
const upgradeProButton = document.getElementById("upgradeProBtn");
const proPaymentContainer = document.getElementById("proPaymentContainer");
const closeProPayment = document.getElementById("closeProPayment");

if (closeProPayment) {
  closeProPayment.addEventListener("click", () => {
    proPaymentContainer.style.display = "none";
  });
}
if (upgradeProButton) {
  upgradeProButton.addEventListener("click", async () => {
    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
      alert("Tenés que iniciar sesión para activar QRcrea PRO.");
      return;
    }

    proPaymentContainer.style.display = "flex";
    await iniciarFormularioPro();
  });
}
let proCardForm = null;
async function iniciarFormularioPro() {
  if (proCardForm) return;

 document.getElementById("proCardForm").innerHTML = `
    <form id="form-checkout">
      <input id="form-checkout__cardholderName" type="text" placeholder="Nombre del titular">
      <input id="form-checkout__cardholderEmail" type="email" placeholder="Email">

      <label>Número de tarjeta</label>
<div id="form-checkout__cardNumber"></div>

<div class="proCardRow">
  <div>
    <label>Vencimiento</label>
    <div id="form-checkout__expirationDate"></div>
  </div>

  <div>
    <label>Código de seguridad</label>
    <div id="form-checkout__securityCode"></div>
  </div>
</div>

      <select id="form-checkout__issuer"></select>
      <select id="form-checkout__installments"></select>
      <select id="form-checkout__identificationType"></select>
      <input id="form-checkout__identificationNumber" type="text" placeholder="DNI">

      <button type="submit" id="form-checkout__submit">
        Suscribirme a QRcrea PRO
      </button>
    </form>
  `;
  proCardForm = mercadoPago.cardForm({
  amount: "7000",
  iframe: true,
  form: {
    id: "form-checkout",
    cardholderName: {
      id: "form-checkout__cardholderName",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
    },
   cardNumber: {
  id: "form-checkout__cardNumber",
  placeholder: "Número de tarjeta",
},
expirationDate: {
  id: "form-checkout__expirationDate",
  placeholder: "MM/YY",
},
   securityCode: {
  id: "form-checkout__securityCode",
  placeholder: "Código de seguridad",
},
    installments: {
      id: "form-checkout__installments",
    },
    identificationType: {
      id: "form-checkout__identificationType",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
    },
    issuer: {
      id: "form-checkout__issuer",
    },
    submit: {
      id: "form-checkout__submit",
    },
  },
    callbacks: {
    onFormMounted: (error) => {
      if (error) {
        console.error("Error al montar Mercado Pago:", error);
        return;
      }

      console.log("Formulario Mercado Pago cargado correctamente");
    },

   onSubmit: async (event) => {
  event.preventDefault();

  try {
    const formData = proCardForm.getCardFormData();

    if (!formData.token) {
      alert("Revisá los datos de la tarjeta.");
      return;
    }

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
      alert("Tu sesión venció. Volvé a iniciar sesión.");
      return;
    }

    const submitButton =
      document.getElementById("form-checkout__submit");

    submitButton.disabled = true;
    submitButton.textContent = "Procesando...";

    const { data, error } = await supabaseClient.functions.invoke(
      "create-pro-subscription",
      {
        body: {
          card_token_id: formData.token,
          email: document.getElementById("form-checkout__cardholderEmail").value.trim(),
          user_id: user.id
        }
      }
    );

    if (error) throw error;

    if (!data?.success) {
      throw new Error("Mercado Pago no pudo crear la suscripción.");
    }

    alert("¡QRcrea PRO activado correctamente!");

    window.location.reload();

  } catch (error) {
    console.error("Error activando PRO:", error);
    alert("No se pudo activar QRcrea PRO. Revisá los datos e intentá nuevamente.");

    const submitButton =
      document.getElementById("form-checkout__submit");

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Suscribirme a QRcrea PRO";
    }
  }
},

  },
});

}

