import { Server } from "socket.io";
import jwt from "jsonwebtoken";



export const initializeSocket = (io: Server) => {

  // 1. Authenticate during handshake
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_SECRET!
      ) as jwt.JwtPayload & { id: string };

      socket.data.userId = decoded.id;
      socket.data.tokenExpiry = decoded.exp;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });


  // 2. Handle successful connection
  io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id);
    console.log("User ID:", socket.data.userId);

 socket.join(socket.data.userId);
console.log(
  "Socket joined room:",
  socket.data.userId,
  "Rooms:",
  Array.from(socket.rooms)
);

    // 3. Handle token expiration
    const expiry = socket.data.tokenExpiry;

    if (expiry) {
      const remainingTime = expiry * 1000 - Date.now();

      const timer = setTimeout(() => {
        socket.emit("token_expired");
        socket.disconnect();
      }, remainingTime);


      socket.on("disconnect", () => {
        clearTimeout(timer);

        

        console.log("Socket disconnected:", socket.id);
        
      });
    }
  });
};