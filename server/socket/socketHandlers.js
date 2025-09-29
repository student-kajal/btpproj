export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    // Join user to their role-based room
    socket.on('join-room', (data) => {
      const { userId, role } = data;
      socket.join(`${role}-${userId}`);
      socket.join(role); // Join role-based room
      console.log(`User ${userId} joined ${role} room`);
    });

    // Group formation updates
    socket.on('group-proposed', (data) => {
      socket.to(`professor-${data.professorId}`).emit('new-group-proposal', data);
    });

    // Project updates
    socket.on('project-updated', (data) => {
      socket.to(`group-${data.groupId}`).emit('project-update', data);
    });

    // Real-time notifications
    socket.on('send-notification', (data) => {
      socket.to(`${data.targetRole}-${data.targetUserId}`).emit('notification', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });
};
