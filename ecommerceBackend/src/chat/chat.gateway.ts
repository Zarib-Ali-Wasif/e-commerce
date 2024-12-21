import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', '*'], // Frontend origin, or all origins with '*'
    methods: ['GET', 'POST'],
    credentials: true, // Allow cookies if needed
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { content: string; roomId: string; userId: string },
  ) {
    const message = await this.chatService.saveMessage(
      data.content,
      data.roomId,
      data.userId,
    );
    this.server.to(data.roomId).emit('newMessage', message);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() roomId: string) {
    this.server.socketsJoin(roomId);
  }
}
