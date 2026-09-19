const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const ticketBox = document.getElementById('ticket-box');

// Local array to maintain full chat transcript for agent review
let chatHistoryLog = [];

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

function toggleTicketBox() {
    ticketBox.classList.toggle('hidden');
}

function sendQuickQuery(text) {
    userInput.value = text;
    sendMessage();
}

function appendMessage(sender, text) {
    const isUser = sender === 'user';
    chatHistoryLog.push({ sender: isUser ? 'Customer' : 'AI Bot', message: text });

    const messageHTML = `
        <div class="flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}">
            <div class="${isUser ? 'bg-indigo-600' : 'bg-emerald-600'} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                ${isUser ? 'U' : 'AI'}
            </div>
            <div class="${isUser ? 'bg-indigo-950/40 border-indigo-900/50' : 'bg-slate-800 border-slate-700'} border p-3.5 rounded-2xl max-w-md text-sm leading-relaxed shadow-sm">
                ${text}
            </div>
        </div>
    `;
    chatContainer.innerHTML += messageHTML;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();

        if (data.success) {
            appendMessage('ai', data.reply);
        } else {
            appendMessage('ai', 'Maaf kijiye, server se response milne mein samasya aayi.');
        }
    } catch (err) {
        console.error('Error connecting to backend:', err);
        appendMessage('ai', 'Backend server se connect nahi ho pa raha hai.');
    }
}

async function submitTicket() {
    const name = document.getElementById('ticket-name').value.trim();
    const email = document.getElementById('ticket-email').value.trim();

    if (!name || !email) {
        alert('Please fill in your name and email to generate a ticket.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                email, 
                issue: chatHistoryLog[chatHistoryLog.length - 1]?.message || 'User escalation',
                chatHistory: chatHistoryLog 
            })
        });
        const data = await response.json();

        if (data.success) {
            alert(`Support Ticket Generated! ID: ${data.ticket.id}`);
            ticketBox.classList.add('hidden');
            document.getElementById('ticket-name').value = '';
            document.getElementById('ticket-email').value = '';
            appendMessage('ai', `Your support ticket **${data.ticket.id}** has been escalated along with your full chat history. Our human agent will review it shortly.`);
        }
    } catch (err) {
        console.error('Error submitting ticket:', err);
        alert('Server error while creating ticket.');
    }
}