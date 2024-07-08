// Function to create and inject the widget
function createAndInjectWidget() {
    // Check if the widget already exists
    if (!document.getElementById('auto-prompt-widget')) {
        let widget = document.createElement('div');
        widget.setAttribute('id', 'auto-prompt-widget');
        widget.setAttribute('style', 'border: 1px solid black; padding: 10px; background-color: lightgray; margin-bottom: 10px; width: 100%;');
        widget.innerHTML = `
            <label for="prompts">Number of Prompts: </label>
            <input id="prompts" type="number" min="1" value="1" />
            <br />
            <label for="customMessage">Custom Message: </label>
            <input id="customMessage" type="text" placeholder="Enter message" />
            <br />
            <button id="startAuto">Start Auto Prompts</button>
        `;

        // Append widget above the text box container
        let textBoxContainer = document.querySelector('textarea[data-element-id="chat-input-textbox"]');
        if (textBoxContainer) {
            textBoxContainer.parentNode.insertBefore(widget, textBoxContainer);
        }

        // Adding event listener to the button for starting automatic prompts
        document.getElementById('startAuto').addEventListener('click', () => {
            let prompts = document.getElementById('prompts').value;
            let message = document.getElementById('customMessage').value;
            startAutoPrompts(parseInt(prompts), message);
        });
    }
}

// Function to start automatic prompts
function startAutoPrompts(numberOfPrompts, customMessage) {
    let count = 0;
    let interval = setInterval(() => {
        if (count >= numberOfPrompts) {
            clearInterval(interval);
            return;
        }

        // Detecting end of tokens and continue chat logic
        let lastMessageElement = document.querySelector('.chat-message.last-message');
        if (lastMessageElement && lastMessageElement.textContent.includes('Token limit reached')) {
            document.querySelector('[data-element-id="new-chat-button-in-side-bar"]').click();
            count++;
        } else {
            // Sending the custom message in the current chat
            if (customMessage) {
                let textBox = document.querySelector('textarea[data-element-id="chat-input-textbox"]');
                let sendButton = document.querySelector('button[data-element-id="send-button"]');
                textBox.value = customMessage;
                sendButton.click();
                count++;
            }
        }
    }, 5000); // Check every 5 seconds
}

// Ensure the widget is injected on chat navigation or page load
function ensureWidgetInjection() {
    createAndInjectWidget();

    // Observing for changes within the chat space
    const observer = new MutationObserver(() => {
        createAndInjectWidget();
    });
    
    // Observe the main chat space for changes
    let chatSpace = document.querySelector('[data-element-id="chat-space-background"]');
    if (chatSpace) {
        observer.observe(chatSpace, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', ensureWidgetInjection);
