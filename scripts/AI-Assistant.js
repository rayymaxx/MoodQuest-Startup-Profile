document.addEventListener('DOMContentLoaded', () => {
    //checks if puter.js was loaded correctly
    if (typeof window.puter === 'undefined') {
        document.getElementById('error-message').textContent = 'Puter.js failed to load. Please refresh the page.';
        return;
    }

//this refers back to the DOM
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const errorMessage = document.getElementById('error-message');
const questionExamplesContainer = document.getElementById('question-examples');

//hard-coding the chatbot
const startupContext = `You are a smart and knowledged AI assistant for a startup called 'MoodQuest'.

    Your goal is to answer questions regarding the startup based on the information below. Maintain a positive and encouraging tone.

    **Startup Story and founder:**
    MoodQuest was founded by Raymond Odhiambo and Edmond Oketch. MoodQuest was born from a simple but urgent truth: today’s teens are struggling, and traditional mental health support isn’t reaching them. The founder, Edmond, a school psychologist with over a decade of experience, saw brilliant, creative, and sensitive kids quietly battling anxiety, stress, and self-doubt — often without the tools or language to ask for help.
    One afternoon, after a student said, “I wish therapy was more like a game,” the spark was lit. MoodQuest began as a passion project: a way to blend the emotional depth of therapy with the magic of storytelling and the motivation of gameplay.

    **Mission and Problem Solved**
    MoodQuest's mission is to empower teens and tweens to build emotional resilience by transforming self-care into a playful, quest-driven adventure — making mental wellness engaging, relatable, and accessible to everyone.
    It solves the problem of mental health being inaccessible to many people due to high charges for therapy and therapists population reduction.

    **Services and Products**
    We offer AI service such as:
    1. **Story Quests:** Teens complete short, interactive quests like 'Face the Dragon of Doubt', building emotional awareness and confidence in a playful, non-threatening way. The story quests are available 24/7 and are tailored to meet user needs. This uses Cognitive Behavioural Therapy(CBT) and narrative design.
    2. **Mood Mapping:** Helps users identify emotional patterns over time using color visuals, and journaling - no walls of text, just honest self-reflection. This uses emoji-sliders, color-coded mood entries and avatar expressions.
    3. **Mini Games and game badges:** Teens stay engaged through daily check-ins and playful skill challenges that encourage consistency without pressure. This uses a habit forming design and positive reinforcement psychology. 

    **Contact and Support:**
    Our project is for anyone and everyone. Anyone can contact us, the best way being via email to contact@moodquest.dev. We appreciate feedback, partnerships and brilliant minds joining our project. We welcome all.

    **Vision and Long-term Goal:**
    Our long-term goal and vision is to positively change the state of mental health in teens and the youth globally. We aim to erase the fates of our young adults as falling into depression and to extremes such as suicide, changing this fate to being successful young individuals with self directed thinking.`


    //stores conversation history for context
    let chatHistory = [
        { role: 'system', content: startupContext}
    ];

    /**
     * Appends a message to the chat display
     * @param {string} message - The text of the message.
     * @param {('user' | 'ai')} sender - Who sent the message.
     */
    const addMessageToUI = (message, sender) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}`;
        bubble.textContent = message;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    /**
     * Adds a streaming message bubble that can be updated in real time
     */
    const addstreamingMessage = () => {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai-bubble streaming text';
        bubble.id = 'streaming-bubble';
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return bubble;
    };

    /**
     * Shows or hides the typing indicator
     * @param {boolean} show - Whether to show the indicator
     */
    const showTypingIndicator = (show) => {
        let indicator = document.getElementById('typing-indicator');
        if(show) {
            if(!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'typing-indicator';
                indicator.className = 'chat-bubble ai-bubble typing-indicator';
                indicator.innerHTML = `<span></span><span></span><span></span>`;
                chatMessages.appendChild(indicator);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } else {
            if (indicator) {
                indicator.remove();
            }
        }
    };

    /**
     * Handles sending the chat message to tehAi and displaying the response
     */
    const handleSendMessage = async () => {
        const userMessage = chatInput.value.trim();

        //This handles empty input
        if (!userMessage) {
            errorMessage.textContent = 'Please enter a question.';
            setTimeout(() => errorMessage.textContent = '', 3000);
            return;
        }

        //Disable input and button during API call
        chatInput.disabled = true;
        sendButton.disabled = true;
        errorMessage.textContent = '';

        //Adds user message to UI and history
        addMessageToUI(userMessage, 'user');
        chatHistory.push({ role: 'user', content: userMessage});
        chatInput.value = '';

        //shows typing indicator
        showTypingIndicator(true);

        try {
            const response = await puter.ai.chat (
                chatHistory, {
                    model: 'gpt-4o'
                });
            
            console.log('Puter.js response:', response);

            let aiMessage = '';

            if (typeof response === 'string') {
                aiMessage = response;
            } else if (response && response.message && response.message.content) {
                
                if (Array.isArray(response.message.content)) {
                    aiMessage = response.message.content[0].text || response.message.content[0];
                } else {
                    aiMessage = response.message.content;
                }
            } else if (response && response.content) {
                aiMessage = response.content;
            } else {
                throw new Error('Unexpected response structure: ' + JSON.stringify(response));
            }

            //Add AI response to history and UI
            chatHistory.push({ role: 'assistant', content: aiMessage });
            addMessageToUI(aiMessage, 'ai');
            
        } catch (error) {
            console.error('Puter.js Error:', error);
            let errorMsg = 'Sorry I encountered an error. Please try again.';

            if (error.message) {
                errorMsg = `Error: ${error.message}`;
            }

            addMessageToUI(errorMsg, 'ai');
            errorMessage.textContent = 'Failed to get response. Please try again.';
        } finally {
            showTypingIndicator(false);
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }

    };

    sendButton.addEventListener('click', handleSendMessage);

    //Input by pressing enter 
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage()
        }
    });

    //on clicking question examples
    questionExamplesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('question-example')) {
            const question = event.target.textContent;
            chatInput.value = question;
            handleSendMessage();
        }
    });

    //focuses the input on loading of the page 
    chatInput.focus();

});