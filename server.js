import http from 'http';
import app from './app';
import { runner } from './server/models';

const PORT = process.env.PORT || 5500;

const server = http.createServer(app);

server.listen(PORT, async () => {
  await runner();
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
