// SkillX fullscreen chat logic.
// Sends user messages to deployed EduNex AI endpoint and renders responses.
(function initSkillXChat() {
  const form = document.getElementById('skillxChatForm');
  const input = document.getElementById('skillxPrompt');
  const messages = document.getElementById('skillxMessages');

  if (!form || !input || !messages) return;

  const API_URL = 'https://edunex-xfv2.onrender.com/api/ai/chat';

  const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const appendBubble = (text, role = 'ai', pending = false) => {
    const bubble = document.createElement('article');
    bubble.className = `skillx-bubble ${role}`;
    bubble.textContent = text;

    if (pending) {
      bubble.dataset.pending = 'true';
      bubble.classList.add('typing');
    }

    messages.appendChild(bubble);
    scrollToBottom();
    return bubble;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    appendBubble(message, 'user');
    input.value = '';

    const loadingBubble = appendBubble('Typing...', 'ai', true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'AI request failed. Please try again.');
      }

      loadingBubble.textContent = data.reply || 'I could not generate a response right now.';
      loadingBubble.classList.remove('typing');
      delete loadingBubble.dataset.pending;
      scrollToBottom();
    } catch (error) {
      loadingBubble.textContent = error.message || 'Network error. Please retry.';
      loadingBubble.classList.remove('typing');
      delete loadingBubble.dataset.pending;
      scrollToBottom();
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
})();
