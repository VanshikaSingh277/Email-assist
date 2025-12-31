console.log("Email Assistant");

function getEmailContent() {
  const selectors = [
    '.h7',
    '.a3s.ail',
    '.gmail_quote',
    '[role="presentation"]'
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return '';
}

function findComposeToolbar() {
  const selectors = [ '.btC', '.aDh','[role="toolbar"]', '.gU.Up'];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
  return null;
}

function createAIButton() {
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply';
  button.style.marginRight = '8px';
  button.innerText = 'AI Reply';
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');

  button.addEventListener('click', async () => {
    try {
      button.innerText = "Generating...";
      button.style.pointerEvents = "none";

      const emailContent = getEmailContent();

      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailContent,
          tone: "professional"
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const generatedReply = await response.text();

      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );

      if (composeBox) {
        composeBox.focus();
        document.execCommand('insertText', false, generatedReply);
      }

    } catch (error) {
      console.error("AI Reply Error:", error);
    } finally {
      button.innerText = "AI Reply";
      button.style.pointerEvents = "auto";
    }
  });

  return button;
}

function injectButton() {
  if (document.querySelector('.ai-reply')) return;

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Toolbar found");
  const button = createAIButton();
  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {

    const addedNodes = [...(mutation.addedNodes || [])];

    const hasComposeElements = addedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE &&
      (
        node.matches('.aDh, .btC, [role="dialog"]') ||
        node.querySelector?.('.aDh, .btC, [role="dialog"]')
      )
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected.");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
