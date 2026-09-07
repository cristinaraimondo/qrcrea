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

generateBtn.addEventListener("click", async () => {

  const qrName = document.getElementById("qrName").value.trim();
  const contenido = qrText.value.trim();
  const qrFile = document.getElementById("qrFile");
const archivo = qrFile.files[0];

 if (!qrName || (!contenido && !archivo)) {
  alert("Completá el nombre y agregá un enlace/texto o un archivo.");
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

  qrContainer.innerHTML = "";

   const slug = crypto.randomUUID();
 const urlPublica = new URL(`q.html?slug=${slug}`, window.location.href).href;

 new QRCode(qrContainer, {
  text: urlPublica,
  width: 220,
  height: 220
});

 

  const { data, error } = await supabaseClient
    .from("qr_codes")
    .insert({
      user_id: user.id,
      name: qrName,
      type: tipoQr,
      destination_url: destinoFinal,
      slug: slug
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
});
const logoutBtn = document.getElementById("logoutBtn");

async function actualizarSesion() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {
    logoutBtn.style.display = "block";
    loginMessage.textContent = `✅ Sesión iniciada como ${user.email}`;
  } else {
    logoutBtn.style.display = "none";
  }
}

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();

  loginMessage.textContent = "Sesión cerrada.";
  logoutBtn.style.display = "none";
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

  data.forEach((qr) => {
    const item = document.createElement("div");

item.innerHTML = `
  <strong>${qr.name}</strong>
  <p>${qr.destination_url}</p>

  <button class="editQrBtn"
    data-id="${qr.id}"
    data-url="${qr.destination_url}">
    Editar destino
  </button>

  <button class="deleteQrBtn" data-id="${qr.id}">
    Eliminar
  </button>
`;

    myQrs.appendChild(item);
  });
}

cargarMisQR();
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("deleteQrBtn")) return;

  const id = e.target.dataset.id;

  const confirmar = confirm("¿Seguro que querés eliminar este QR?");

  if (!confirmar) return;

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
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("editQrBtn")) return;

  const id = e.target.dataset.id;
  const urlActual = e.target.dataset.url;

  const nuevaUrl = prompt("Ingresá el nuevo destino del QR:", urlActual);

  if (!nuevaUrl) return;

  const { error } = await supabaseClient
    .from("qr_codes")
    .update({
      destination_url: nuevaUrl.trim()
    })
    .eq("id", id);

  if (error) {
    console.error("Error al editar QR:", error);
    alert("No se pudo actualizar el QR.");
    return;
  }

  await cargarMisQR();
  alert("✅ Destino actualizado correctamente.");
});