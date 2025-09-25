import { app } from './app.js';
import './services/mcp-server.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
