import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './schemas/chat-room.schema';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // Find or create a chat room for given user IDs
  async findOrCreateRoom(userIds: Types.ObjectId[]): Promise<ChatRoom> {
    let room = await this.chatRoomModel
      .findOne({ users: { $all: userIds } })
      .populate('messages');

    if (!room) {
      room = await this.chatRoomModel.create({ users: userIds, messages: [] });
    }

    return room;
  }

  // Save a message and associate it with a chat room
  async saveMessage(
    content: string,
    roomId: string,
    userId: string,
  ): Promise<Message> {
    const message = await this.messageModel.create({ content, roomId, userId });
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      $push: { messages: message._id },
    });

    return message;
  }

  // Get messages from a specific chat room
  async getMessages(roomId: string): Promise<Message[]> {
    return this.messageModel.find({ roomId }).sort({ createdAt: 1 });
  }

  // Get all chat rooms with populated messages
  async getAllChats(): Promise<ChatRoom[]> {
    return this.chatRoomModel.find().populate('messages');
  }
}
