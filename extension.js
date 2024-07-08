// Function to create and inject the widget
function createAndInjectWidget() {
    try {
        console.log('Attempting to inject widget...');
        if (!document.getElementById('auto-prompt-widget')) {
            let widget = document.createElement('div');
            widget.setAttribute('id', 'auto-prompt-widget');
            widget.setAttribute('style', 'border: 1px solid black; padding: 10px; background-color: lightgray; margin-bottom: 10px; width: 100%; z-index: 1000;');
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
                console.log('Text box found. Injecting widget...');
                textBoxContainer.parentNode.insertBefore(widget, textBoxContainer);
            } else {
                console.log('Text box not found.');
            }

            // Adding event listener to the button for starting automatic prompts
            document.getElementById('startAuto').addEventListener('click', () => {
                let prompts = document.getElementById('prompts').value;
                let message = document.getElementById('customMessage').value;
                startAutoPrompts(parseInt(prompts), message);
            });
        } else {
            console.log('Widget already exists.');
        }
    } catch (error) {
        console.error('Error while injecting the widget:', error);
    }
}

// Function to start automatic prompts
function startAutoPrompts(numberOfPrompts, customMessage) {
    try {
        console.log('Starting auto prompts...');
        let count = 0;
        const interval = setInterval(() => {
            if (count >= numberOfPrompts) {
                clearInterval(interval);
                return;
            }

            let lastMessageElements = document.querySelectorAll('.chat-message');

            // Check latest few messages for token end indication
            for (let i = lastMessageElements.length - 1; i >= 0; i--) {
                if (lastMessageElements[i].textContent.includes('Token limit reached')) {
                    document.querySelector('[data-element-id="new-chat-button-in-side-bar"]').click();
                    count++;
                    return;
                }
            }

            // Sending the custom message in the current chat
            if (customMessage) {
                let textBox = document.querySelector('textarea[data-element-id="chat-input-textbox"]');
                let sendButton = document.querySelector('button[data-element-id="send-button"]');
                if (sendButton) {
                    textBox.value = customMessage;
                    sendButton.click();
                    count++;
                }
            }
        }, 5000); // Check every 5 seconds
    } catch (error) {
        console.error('Error while auto-sending prompts:', error);
    }
}

// Ensure the widget is injected on chat navigation or page load
function ensureWidgetInjection() {
    try {
        createAndInjectWidget();

        const observer = new MutationObserver(() => {
            createAndInjectWidget();
        });

        let chatSpace = document.querySelector('[data-element-id="chat-space-background"]');
        if (chatSpace) {
            observer.observe(chatSpace, {
                childList: true,
                subtree: true
            });
        }
    } catch (error) {
        console.error('Error while ensuring widget injection:', error);
    }
}

// Function to create and inject the manual load button
function createLoadWidgetButton() {
    try {
        console.log('Attempting to inject load widget button...');
        if (!document.getElementById('load-widget-button')) {
            let button = document.createElement('button');
            button.setAttribute('id', 'load-widget-button');
            button.textContent = 'Load Widget';
            button.setAttribute('style', 'margin: 10px; padding: 10px; background-color: blue; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 1000;');
            button.addEventListener('click', createAndInjectWidget);

            // Inject the button into the sidebar
            let sidebar = document.querySelector('[data-element-id="side-bar-background"]');
            if (sidebar) {
                console.log('Sidebar found. Injecting load widget button...');
                sidebar.appendChild(button);
            } else {
                console.log('Sidebar not found.');
            }
        } else {
            console.log('Load widget button already exists.');
        }
    } catch (error) {
        console.error('Error while injecting the load widget button:', error);
    }
}

// Initialize when the document is fully loaded
function initialize() {
    ensureWidgetInjection();
    createLoadWidgetButton();
}

window.addEventListener('load', initialize);
