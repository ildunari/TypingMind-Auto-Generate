// Function to create and inject the widget
function createAndInjectWidget() {
    try {
        console.log('Attempting to inject widget...');

        // Check if the widget already exists
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
                console.log('Text box container found. Injecting widget...');
                textBoxContainer.parentNode.insertBefore(widget, textBoxContainer);
            } else {
                console.error('Error: Text box container not found.');
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
        console.error('Error creating and injecting widget:', error);
    }
}

// Function to start automatic prompts
function startAutoPrompts(numberOfPrompts, customMessage) {
    try {
        console.log('Starting auto prompts with', numberOfPrompts, 'prompts and message:', customMessage);
        let count = 0;
        const interval = setInterval(() => {
            if (count >= numberOfPrompts) {
                clearInterval(interval);
                console.log('Auto prompts finished.');
                return;
            }

            let lastMessageElements = document.querySelectorAll('.chat-message');

            // Check latest few messages for token end indication
            for (let i = lastMessageElements.length - 1; i >= 0; i--) {
                if (lastMessageElements[i].textContent.includes('Token limit reached')) {
                    console.log('Token limit reached. Starting new chat...');
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
                    console.log('Sending custom message:', customMessage);
                    textBox.value = customMessage;
                    sendButton.click();
                    count++;
                } else {
                    console.error('Error: Send button not found.');
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
        console.log('Ensuring widget injection...');
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
            console.log('Observer set up on chat space.');
        } else {
            console.error('Error: Chat space not found for observer.');
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
                console.error('Error: Sidebar not found for button injection.');
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
    console.log('Initializing script...');
    ensureWidgetInjection();
    createLoadWidgetButton();
}

window.addEventListener('load', initialize);
