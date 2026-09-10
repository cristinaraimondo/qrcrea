const SUPABASE_URL = "https://srottoudvavudcujvzeb.supabase.co";
const SUPABASE_KEY = "sb_publishable_wpYSqgBPatf4EZa2AsKLpA_He28PET4";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
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
  if (selectedQrType === "url") {
    qrText.style.display = "block";
    qrFileInput.style.display = "none";
    qrText.placeholder = "https://tusitio.com";
  } else {
    qrText.style.display = "none";
    qrFileInput.style.display = "block";

    if (selectedQrType === "image") {
      qrFileInput.title = "Seleccioná una imagen";
       qrFileInput.setAttribute("aria-label", "Seleccioná una imagen");
    } else if (selectedQrType === "pdf") {
      qrFileInput.title = "Seleccioná un archivo PDF";
       qrFileInput.setAttribute("aria-label", "Seleccioná un archivo PDF");
    } else if (selectedQrType === "audio") {
      qrFileInput.title = "Seleccioná un archivo de audio";
      qrFileInput.setAttribute("aria-label", "Seleccioná un archivo de audio");
    }
  }
}


qrTypeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
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
  const qrFile = document.getElementById("qrFile");
  const archivo = qrFile.files[0];
  const logoArchivo = qrLogoInput.files[0];
  let logoPath = null;

if (!qrName) {
  alert("Completá el nombre del QR.");
  return;
}

if (selectedQrType === "url" && !contenido) {
  alert("Ingresá un enlace.");
  return;
}

if (selectedQrType !== "url" && !archivo) {
  alert("Seleccioná el archivo correspondiente.");
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

  qrContainer.innerHTML = "";

  const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
 const urlPublica = new URL(`q.html?slug=${slug}`, window.location.href).href;

 new QRCode(qrContainer, {
  text: urlPublica,
  width: 220,
  height: 220,
  correctLevel: QRCode.CorrectLevel.H
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
      logo_path: logoPath
    })
    .select();

  if (error) {
    console.error("Error al guardar QR:", error);
    alert("El QR se generó, pero no se pudo guardar.");
    return;
  }

  console.log("QR guardado:", data);
  await cargarMisQR();
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


async function actualizarSesion() {
  
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {
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

const urlQr = new URL(`q.html?slug=${qr.slug}`, window.location.href).href;
item.dataset.name = qr.name;
item.dataset.qrUrl = urlQr;
item.dataset.logoPath = qr.logo_path || "";

const tipoTexto = {
  url: "🔗 Enlace",
  image: "🖼 Imagen",
  pdf: "📄 PDF",
  audio: "🎵 Audio",
  file: "📁 Archivo"
};

item.className = "qrItem";

item.innerHTML = `
  <div class="qrItemHeader">
    <strong class="qrItemName">${qr.name}</strong>
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

new QRCode(qrGuardado, {
  text: urlQr,
  width: 160,
  height: 160,
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

  if (!urlQr) {
    alert("No se pudo obtener la dirección del QR.");
    return;
  }
const qrTemporal = document.createElement("div");
 new QRCode(qrTemporal, {
  text: urlQr,
  width: 1000,
  height: 1000,
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

  const dataUrl = canvas.toDataURL("image/png");

  const nombreQr = item.dataset.name || "qrcrea-qr";

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${nombreQr}.png`;
  link.click();

}, 100);
});
 
