const panel = document.getElementById("ai-chat-panel");
const toggle = document.getElementById("ai-chat-toggle");
const closeButton = document.getElementById("ai-chat-close");
const form = document.getElementById("ai-chat-form");
const input = document.getElementById("ai-chat-input");
const sendButton = document.getElementById("ai-chat-send");
const messages = document.getElementById("ai-chat-messages");
const thinking = document.getElementById("ai-chat-thinking");

if (panel && toggle && closeButton && form && input && sendButton && messages && thinking) {
  let waitingForReply = false;

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close AI Assistant" : "Open AI Assistant");
    toggle.innerHTML = `<span aria-hidden="true">${open ? "×" : "✦"}</span>`;
    if (open) input.focus();
    else toggle.focus();
  };

  const scrollToLatest = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const addMessage = (sender, text) => {
    const row = document.createElement("div");
    row.className = `ai-chat-row ai-chat-row-${sender}`;
    const bubble = document.createElement("p");
    bubble.className = "ai-chat-bubble";
    bubble.textContent = text;
    row.append(bubble);
    messages.insertBefore(row, thinking);
    scrollToLatest();
  };

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || waitingForReply) return;

    waitingForReply = true;
    addMessage("user", message);
    input.value = "";
    input.disabled = true;
    sendButton.disabled = true;
    thinking.hidden = false;
    scrollToLatest();

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("Chat request failed.");
      }
      addMessage("assistant", data.reply);
    } catch {
      addMessage("assistant", "Sorry, I couldn't get a reply right now. Please try again in a moment.");
    } finally {
      waitingForReply = false;
      thinking.hidden = true;
      input.disabled = false;
      sendButton.disabled = false;
      if (!panel.hidden) input.focus();
      scrollToLatest();
    }
  });
}
