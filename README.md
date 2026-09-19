# 🛍️ NovaShop - E-Commerce AI Support & Agent Workspace

NovaShop is a full-stack, enterprise-grade AI customer support and order management platform. It bridges the gap between automated AI responses (powered by Google Gemini) and human agent workflows, allowing real-time order tracking, chat transcript logging, and ticket escalation.

---

## 🚀 Key Features

* **AI E-Commerce Assistant:** Automatically handles order tracking (`ORD-101`, `ORD-102`, etc.), shipping updates, and return policies using Google Gemini.
* **Smart Ticket Escalation:** Customers can seamlessly escalate complex issues along with their full chat history transcript to human support.
* **Professional Agent Workspace:** A dedicated dashboard for support agents to review chat transcripts, select resolution actions (e.g., *Issue Resolved*, *Refund Processed*, *Order Cancelled*), and send direct resolutions.
* **Modern Tech Stack:** Built with Node.js, Express, Vanilla JS, and Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS (Responsive UI)
* **Backend:** Node.js, Express.js
* **AI Integration:** Google Gemini API (with System Instruction Prompting)
* **Deployment:** Render (Backend API)

---

## 📁 Project Structure

```text
Ai_customer_support/
├── server/
│   ├── server.js        # Express backend & Gemini API integration
│   └── package.json     # Backend dependencies
├── client/
│   ├── index.html       # Customer Chat Portal UI
│   ├── style.css        # Custom styling
│   └── script.js        # Chat & Ticket logic
└── agent_dashboard/
    ├── index.html       # Agent Workspace UI
    └── dashboard.js     # Ticket management & resolution logic
Clone the repository:

Bash
git clone [https://github.com/YOUR_USERNAME/novashop-support.git](https://github.com/YOUR_USERNAME/novashop-support.git)
cd novashop-support
Setup Backend:

Bash
cd server
npm install
Create a .env file inside the server folder and add your Gemini API Key:

Code snippet
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
Start the server:

Bash
npm start
Run Frontend:

Open client/index.html in your browser using Live Server (for customer chat).

Open agent_dashboard/index.html in your browser (for agent workspace).

🌐 Live Deployment
Backend API: Hosted on Render (https://your-backend-url.onrender.com)

Customer Portal: Ready for Netlify / Vercel hosting.


---

### Isko GitHub par kaise dalein?
1. Apni GitHub repository ke main page par jayein.
2. **"Add file" -> "Create new file"** par click karein.
3. File ka naam exact **`README.md`** rakhein.
4. Upar diya gaya poora markdown text paste kar dein aur niche **"Commit changes"** 
