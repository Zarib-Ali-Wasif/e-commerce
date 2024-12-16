// Updated ChatController
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Create or get a room for the user
  @Post('user/:userId')
  async createOrGetRoom(@Param('userId') userId: string) {
    try {
      // Validate if userId is a valid ObjectId
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }

      // Use a valid ObjectId for the admin
      const adminId = process.env.ADMIN_ID || '6749f375742364fed3c4eab6'; // Replace with the actual admin ObjectId
      if (!Types.ObjectId.isValid(adminId)) {
        throw new Error('Invalid adminId');
      }

      const userIds = [new Types.ObjectId(userId), new Types.ObjectId(adminId)];
      return this.chatService.findOrCreateRoom(userIds);
    } catch (error) {
      console.error('Error in createOrGetRoom:', error);
      throw new Error('Failed to create or get room.');
    }
  }

  // Send a message to a chat room
  @Post('send-message')
  async sendMessage(
    @Body('content') content: string,
    @Body('roomId') roomId: string,
    @Body('userId') userId: string,
  ) {
    return this.chatService.saveMessage(content, roomId, userId);
  }

  // Get all messages from a chat room
  @Get('room/:roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }

  // Get all chat rooms
  @Get('all')
  async getAllChats() {
    return this.chatService.getAllChats();
  }
}
