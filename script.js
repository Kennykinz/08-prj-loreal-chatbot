const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const CLOUDLFARE_WORKER_URL =
  "https://08-prj-loreal-chatbot.kennedyannlorenzen.workers.dev"; // Replace with your Cloudflare Worker URL

chatWindow.innerHTML = `<div class="msg ai">👋 Hello! I’m your beauty assistant. Ask me about L’Oréal products or routines.</div>`;

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  appendMessage("ai", "⏳ Thinking...");

  const payload = {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for L’Oréal. Only answer questions related to L’Oréal products, skincare/haircare routines, and beauty advice. Politely decline unrelated questions.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  };

  try {
    const res = await fetch(CLOUDLFARE_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, no response.";
    replaceLastMessage("ai", reply);
  } catch (error) {
    replaceLastMessage("ai", "⚠️ Oops! Something went wrong.");
    console.error(error);
  }
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function replaceLastMessage(role, newText) {
  const msgs = [...chatWindow.querySelectorAll(`.msg.${role}`)];
  if (msgs.length > 0) {
    msgs[msgs.length - 1].textContent = newText;
  }
}
