import http from 'node:http';
import { Server } from 'socket.io';
import app, { allowedOrigins } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

async function start() {
  await connectDB();
  server.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
