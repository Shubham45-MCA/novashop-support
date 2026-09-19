const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock E-Commerce Orders Database
let ordersDB = [
    { id: 'ORD-101', item: 'Wireless Bluetooth Headphones', status: 'Delivered', deliveryDate: 'May 24, 2026' },
    { id: 'ORD-102', item: 'Smart Fitness Watch', status: 'Shipped (Arriving in 2 days)', deliveryDate: 'June 02, 2026' },
    { id: 'ORD-103', item: 'Ergonomic Office Chair', status: 'Processing', deliveryDate: 'June 08, 2026' }
];

// In-memory Tickets Database with chat transcripts
let tickets = [];

// 1. AI E-Commerce Chat & Tool/Order Management API
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'Gemini API Key is missing in .env file' });
        }

        const systemPrompt = `You are NovaShop's elite E-Commerce Support Assistant. 
        Active Orders Reference: ${JSON.stringify(ordersDB)}.
        Your capabilities:
        1. Look up order statuses accurately when a customer provides an order ID (ORD-101, ORD-102, ORD-103).
        2. Answer return policies (7-day hassle-free returns).
        3. If a customer is frustrated or requests cancellation/refund that requires manual verification, instruct them to click "Raise Ticket" below so a human support agent can take over.
        Keep your tone professional, polite, and direct. Avoid generic AI introductory fluff.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(200).json({ success: true, reply: `API Error: ${data.error.message}` });
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf kijiye, main abhi iska jawab nahi de pa raha hoon.";
        
        res.json({ success: true, reply: aiReply });
    } catch (error) {
        console.error('Server Catch Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Create Ticket API (Escalation with chat transcript)
app.post('/api/tickets', (req, res) => {
    const { name, email, issue, chatHistory } = req.body;
    if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    
    const newTicket = {
        id: 'TICK-' + Math.floor(1000 + Math.random() * 9000),
        name,
        email,
        issue: issue || 'Customer requested agent assistance.',
        chatHistory: chatHistory || [],
        status: 'Open',
        resolutionType: 'Pending',
        agentReply: '',
        createdAt: new Date().toISOString()
    };
    
    tickets.unshift(newTicket);
    res.status(201).json({ success: true, ticket: newTicket });
});

// 3. Get All Tickets API (For Agent Workspace)
app.get('/api/tickets', (req, res) => {
    res.json({ success: true, tickets });
});

// 4. Advanced Agent Resolution & Action API
app.patch('/api/tickets/:id', (req, res) => {
    const { id } = req.params;
    const { status, resolutionType, agentReply } = req.body;
    
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) {
        return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    
    if (status) ticket.status = status;
    if (resolutionType) ticket.resolutionType = resolutionType;
    if (agentReply !== undefined) ticket.agentReply = agentReply;
    
    res.json({ success: true, ticket });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`NovaShop Enterprise Support Server running on port ${PORT}`);
});