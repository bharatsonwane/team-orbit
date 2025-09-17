import { Request, Response } from 'express';
import Chat from '../services/chat.service';

interface ChatMessageBody {
  text: string;
  media?: string;
  sentUserId: string;
  chatRoomId: string;
  deliveredTo?: string[];
  readBy?: string[];
  reaction?: Record<string, any>;
}

export const sendMessage = async (
  req: Request<{}, {}, ChatMessageBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      text,
      media,
      sentUserId,
      chatRoomId,
      deliveredTo,
      readBy,
      reaction,
    } = req.body;

    const chatMessage = new Chat({
      text,
      media,
      sentUserId,
      chatRoomId,
      deliveredTo,
      readBy,
      reaction: reaction || {},
    });

    const savedMessage = await chatMessage.saveMessage(req.db);

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: savedMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
    });
  }
};

export const getMessagesByChatRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId } = req.params as { chatRoomId: string };

    const messages = await Chat.getMessagesForRoom(req.db, chatRoomId);
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
    });
  }
};
