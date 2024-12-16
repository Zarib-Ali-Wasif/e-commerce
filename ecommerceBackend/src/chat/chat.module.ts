import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Services and Gateway
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

// Controller
import { ChatController } from './chat.controller';

// Schemas
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schema';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    // Register the schemas with Mongoose
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController], // Add ChatController for HTTP routes
  providers: [ChatService, ChatGateway], // Add ChatService and ChatGateway for business logic and WebSocket functionality
})
export class ChatModule {}
