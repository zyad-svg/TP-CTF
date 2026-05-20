function show(id) { document.getElementById(id).classList.remove("hidden"); }
function hide(id) { document.getElementById(id).classList.add("hidden"); }
function setText(id, t) { document.getElementById(id).textContent = t; }

function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
}

function setProgress(step) {
  ["prog-1","prog-2","prog-3"].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove("active","done");
    if (i + 1 < step) el.classList.add("done");
    else if (i + 1 === step) el.classList.add("active");
  });
}

async function doLogin() {
  const username = document.getElementById("login-user").value;
  const password = document.getElementById("login-pass").value;
  hide("login-error"); hide("login-success");
  try {
    const res  = await fetch("/api/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({username,password}) });
    const data = await res.json();
    if (data.success) {
      setText("login-success", "✅ Authentication bypassed!\n🚩 " + data.flag);
      show("login-success");
      setTimeout(() => {
        document.getElementById("logged-user").textContent = data.user;
        document.getElementById("flag1").textContent = "🚩 " + data.flag;
        setProgress(2); showPage("dashboard");
      }, 1500);
    } else { setText("login-error","❌ "+data.message); show("login-error"); }
  } catch(e) { setText("login-error","❌ Cannot reach server."); show("login-error"); }
}

async function doUpload() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  hide("upload-error"); hide("upload-success");
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res  = await fetch("/api/upload", { method:"POST", body:formData });
    const data = await res.json();
    if (data.success) {
      setText("upload-success", "✅ "+data.message+"\n📁 "+data.path+"\n🚩 "+data.flag);
      show("upload-success");
      setTimeout(() => {
        document.getElementById("flag2").textContent = "🚩 " + data.flag;
        setProgress(3); showPage("rce");
      }, 2000);
    } else { setText("upload-error","❌ "+data.message); show("upload-error"); }
  } catch(e) { setText("upload-error","❌ Cannot reach server."); show("upload-error"); }
}

function handleRCEFile(input) {
  const file = input.files[0];
  if (!file) return;
  document.getElementById("rce-file-label").textContent = "📄 " + file.name + " sélectionné";
  document.getElementById("rce-file").value = file.name;
}

async function doRCEUpload(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res  = await fetch("/api/upload", { method:"POST", body:formData });
  return await res.json();
}

async function doRCE() {
  hide("rce-error"); hide("rce-output"); hide("flag3");
  hide("rce-upload-error"); hide("rce-upload-success");

  const rceInput = document.getElementById("rce-file-input");
  if (rceInput.files.length > 0) {
    try {
      const upData = await doRCEUpload(rceInput.files[0]);
      if (upData.success) {
        setText("rce-upload-success", "✅ Script uploadé : " + upData.path);
        show("rce-upload-success");
      } else {
        setText("rce-upload-error","❌ Upload échoué : "+upData.message);
        show("rce-upload-error"); return;
      }
    } catch(e) { setText("rce-upload-error","❌ Cannot reach server."); show("rce-upload-error"); return; }
  }

  const file = document.getElementById("rce-file").value;
  if (!file) { setText("rce-error","❌ Aucun fichier à exécuter."); show("rce-error"); return; }

  try {
    const res  = await fetch("/api/exec?file=" + encodeURIComponent(file));
    const data = await res.json();
    if (data.success) {
      setText("rce-output","$ node /uploads/"+file+"\n> "+data.output);
      show("rce-output");
      if (data.flag) {
        setTimeout(() => {
          setText("flag3","🏴 SYSTEM COMPROMISED\n\n"+data.flag+"\n\nMegaCorp has been fully pwned.");
          show("flag3");
        }, 800);
      }
    } else { setText("rce-error","❌ "+data.message); show("rce-error"); }
  } catch(e) { setText("rce-error","❌ Cannot reach server."); show("rce-error"); }
}