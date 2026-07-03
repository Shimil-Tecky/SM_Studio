const http = require('http');

http.get('http://127.0.0.1:53621/json/list', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const targets = JSON.parse(data);
      console.log(JSON.stringify(targets, null, 2));
    } catch (e) {
      console.error("Failed to parse JSON", e);
    }
  });
}).on('error', (err) => {
  console.error("Error connecting to debugger:", err.message);
});
