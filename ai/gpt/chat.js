const chat = document.getElementById("chat");
const input = document.getElementById("input");

input.addEventListener("keydown", e=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});

function addMessage(role){
  const div=document.createElement("div");
  div.className=`msg ${role}`;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
  return div;
}

function showTyping(){
  const t=document.createElement("div");
  t.className="typing";
  t.id="typing";
  t.textContent="Bot sedang mengetik...";
  chat.appendChild(t);
}

function removeTyping(){
  const t=document.getElementById("typing");
  if(t) t.remove();
}

function parseMessage(text){
  const parts=[];
  const regex=/```([\s\S]*?)```/g;
  let last=0, m;
  while((m=regex.exec(text))){
    if(m.index>last) parts.push({type:"text",content:text.slice(last,m.index)});
    parts.push({type:"code",content:m[1].trim()});
    last=regex.lastIndex;
  }
  if(last<text.length) parts.push({type:"text",content:text.slice(last)});
  return parts;
}

async function typeEffect(el,text){
  const parts=parseMessage(text);
  for(const p of parts){
    if(p.type==="text"){
      const span=document.createElement("span");
      el.appendChild(span);
      for(const c of p.content){
        span.textContent+=c;
        chat.scrollTop=chat.scrollHeight;
        await new Promise(r=>setTimeout(r,15));
      }
    }else{
      const container=document.createElement("div");
      container.className="code-container";
      const header=document.createElement("div");
      header.className="code-header";
      const label=document.createElement("span");
      label.textContent="HTML";
      header.appendChild(label);
      const darkBtn=document.createElement("button");
      darkBtn.textContent="Darkmode";
      darkBtn.onclick=()=>container.classList.toggle("dark-mode");
      header.appendChild(darkBtn);
      const copyBtn=document.createElement("button");
      copyBtn.textContent="Copy";
      copyBtn.onclick=()=>navigator.clipboard.writeText(p.content);
      header.appendChild(copyBtn);
      const previewBtn=document.createElement("button");
      previewBtn.textContent="Preview";
      previewBtn.onclick=()=>openModal(p.content);
      header.appendChild(previewBtn);
      container.appendChild(header);
      const pre=document.createElement("pre");
      const code=document.createElement("code");
      code.className="language-html";
      code.textContent=p.content;
      pre.appendChild(code);
      container.appendChild(pre);
      container.appendChild(pre);
      el.appendChild(container);
      Prism.highlightElement(code);
      chat.scrollTop=chat.scrollHeight;
    }
  }
}

const modal=document.getElementById("modal");
const iframe=document.getElementById("preview-iframe");
function openModal(code){
  iframe.srcdoc=code;
  modal.style.display="flex";
}
function closeModal(){ modal.style.display="none"; }

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user").textContent = text;
  input.value = "";
  showTyping();

  const apiUrl = "https://api.fay.my.id/ai/chatgpt/api.php";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    // Cek jika respons gagal
    if (!res.ok) {
      const errorData = await res.json();
      console.error("API Error:", errorData);
      removeTyping();
      return;
    }

    const data = await res.json();
    removeTyping();
    const reply = data.choices[0].message.content;

    const botEl = addMessage("bot");
    await typeEffect(botEl, reply);
  } catch (error) {
    console.error("Error sending message:", error);
    removeTyping();
  }
}



function clearChat(){
  chat.innerHTML="";
}
