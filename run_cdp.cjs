// In Node v24, standard WebSockets are built-in as a global: `new WebSocket(...)`.
// So we do not need to require('ws').

const wsUrl = 'ws://127.0.0.1:53621/devtools/browser/14fa2a46-276a-43a2-9280-7bee165bcf33';
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log("Connected to browser WebSocket");
  // Let's create a new target page to navigate to http://localhost:5173/admin/login
  const msg = {
    id: 1,
    method: 'Target.createTarget',
    params: {
      url: 'http://localhost:5173/admin/login'
    }
  };
  ws.send(JSON.stringify(msg));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Message from browser:", JSON.stringify(data, null, 2));
  if (data.id === 1) {
    const targetId = data.result.targetId;
    console.log("Target created successfully:", targetId);
    ws.close();
  }
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};
