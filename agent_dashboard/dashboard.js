const ticketsList = document.getElementById('tickets-list');

// Backend URL: Local testing ke liye localhost, live deployment ke baad Render URL yahan daalein
const BACKEND_URL = 'http://localhost:5000';
// Example for Live: const BACKEND_URL = 'https://novashop-backend.onrender.com';

async function fetchTickets() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/tickets`);
        const data = await response.json();
        if (data.success) {
            renderTickets(data.tickets);
        }
    } catch (err) {
        console.error('Error fetching tickets:', err);
        ticketsList.innerHTML = `<div class="bg-red-950/30 border border-red-900/50 p-4 rounded-xl text-center text-sm text-red-400">Failed to connect to backend server. Is it running?</div>`;
    }
}

function renderTickets(tickets) {
    if (!tickets || tickets.length === 0) {
        ticketsList.innerHTML = `<div class="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center text-sm text-slate-400">No support tickets found. All clear!</div>`;
        return;
    }

    ticketsList.innerHTML = tickets.map(ticket => {
        // Format chat transcript for agent review
        const transcriptHTML = ticket.chatHistory && ticket.chatHistory.length > 0
            ? ticket.chatHistory.map(h => `<div class="text-[11px] text-slate-300"><strong>${h.sender}:</strong> ${h.message}</div>`).join('')
            : `<div class="text-[11px] text-slate-500">No chat history recorded. Issue: ${ticket.issue}</div>`;

        return `
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-lg">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
                    <div class="flex items-center space-x-3">
                        <span class="text-xs font-mono font-semibold bg-indigo-950 text-indigo-400 px-3 py-1 rounded border border-indigo-800/50">${ticket.id}</span>
                        <span class="text-xs px-3 py-1 rounded font-medium ${ticket.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'}">${ticket.status}</span>
                        <span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded">Action: ${ticket.resolutionType || 'Pending'}</span>
                    </div>
                    <span class="text-xs text-slate-400">${ticket.name} (${ticket.email})</span>
                </div>

                <!-- Chat History Transcript Box -->
                <div class="bg-slate-950 border border-slate-800/80 p-3 rounded-lg max-h-36 overflow-y-auto space-y-1">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Customer & AI Chat Transcript:</p>
                    ${transcriptHTML}
                </div>

                ${ticket.agentReply ? `<div class="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-xs text-emerald-400"><strong>Agent Resolution Note:</strong> ${ticket.agentReply}</div>` : ''}

                <!-- Agent Action Controls -->
                <div class="flex flex-col md:flex-row items-center gap-3 pt-2">
                    <select id="action-${ticket.id}" class="bg-slate-950 border border-slate-800 text-xs rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500">
                        <option value="Issue Resolved">Mark as Resolved</option>
                        <option value="Refund Processed">Issue Refund</option>
                        <option value="Order Cancelled">Cancel Order</option>
                        <option value="Escalated to Logistics">Escalate to Logistics</option>
                    </select>
                    <input type="text" id="reply-${ticket.id}" placeholder="Type message for customer..." class="bg-slate-950 border border-slate-800 text-xs rounded px-3 py-2 flex-1 w-full focus:outline-none focus:border-indigo-500 text-slate-100">
                    <button onclick="resolveTicket('${ticket.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2 rounded transition whitespace-nowrap shadow font-medium">Save Resolution</button>
                </div>
            </div>
        `;
    }).join('');
}

async function resolveTicket(id) {
    const actionSelect = document.getElementById(`action-${id}`);
    const replyInput = document.getElementById(`reply-${id}`);
    
    const resolutionType = actionSelect.value;
    const agentReply = replyInput.value.trim();

    if (!agentReply) {
        alert('Please type a resolution response before saving.');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'Resolved', 
                resolutionType: resolutionType, 
                agentReply: agentReply 
            })
        });
        const data = await response.json();

        if (data.success) {
            alert(`Ticket ${id} successfully resolved with action: ${resolutionType}!`);
            fetchTickets();
        } else {
            alert('Failed to update ticket on server.');
        }
    } catch (err) {
        console.error('Error updating ticket:', err);
        alert('Server communication error.');
    }
}

// Initial fetch on page load
fetchTickets();
