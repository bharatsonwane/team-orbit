import db from '../database/db';

interface ChatMessageData {
  text?: string | null;
  media?: string | null;
  sentUserId: string;
  chatRoomId: string;
  deliveredTo?: string[];
  readBy?: string[];
  reaction?: Record<string, any>;
}

interface ChatMessage {
  id: string;
  text: string | null;
  media: string | null;
  sentUserId: string;
  chatRoomId: string;
  createdAt: string;
  deliveredTo: string[];
  readBy: string[];
  reaction: Record<string, any>;
}

export default class Chat {
  private text: string | null;
  private media: string | null;
  private sentUserId: string;
  private chatRoomId: string;
  private createdAt: string;
  private deliveredTo: string[];
  private readBy: string[];
  private reaction: Record<string, any>;

  constructor({
    text,
    media,
    sentUserId,
    chatRoomId,
    deliveredTo,
    readBy,
    reaction,
  }: ChatMessageData) {
    this.text = text || null;
    this.media = media || null;
    this.sentUserId = sentUserId;
    this.chatRoomId = chatRoomId;
    this.createdAt = new Date().toISOString();

    // Ensure JSON-valid defaults
    this.deliveredTo = Array.isArray(deliveredTo) ? deliveredTo : [];
    this.readBy = Array.isArray(readBy) ? readBy : [];
    this.reaction =
      reaction && typeof reaction === 'object' && !Array.isArray(reaction)
        ? reaction
        : {};
  }

  async saveMessage(): Promise<ChatMessage> {
    const query = `
      INSERT INTO chat_message (
        text,
        media,
        "sentUserId",
        "chatRoomId",
        "createdAt",
        "deliveredTo",
        "readBy",
        "reaction"
      ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      this.text,
      this.media,
      this.sentUserId,
      this.chatRoomId,
      JSON.stringify(this.deliveredTo),
      JSON.stringify(this.readBy),
      JSON.stringify(this.reaction),
    ];

    console.log('Inserting chat message with values:', values);

    try {
      const result = await db.query(query, values);
      if (!result || result.length === 0) {
        throw new Error('No rows returned from insert');
      }
      return result[0] as ChatMessage;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw new Error('Failed to insert chat message');
    }
  }

  static async getMessagesForRoom(chatRoomId: string): Promise<ChatMessage[]> {
    const query = `
      SELECT * FROM chat_message
      WHERE "chatRoomId" = $1
      ORDER BY "createdAt" ASC;
    `;
    try {
      const result = await db.query(query, [chatRoomId]);
      return result as ChatMessage[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages for chat room');
    }
  }

  static async saveMessage(data: {
    senderId: string;
    receiverId: string;
    message: string;
    mediaUrl?: string;
  }): Promise<ChatMessage> {
    // This method is used by the socket.io handler
    const chatMessage = new Chat({
      text: data.message,
      media: data.mediaUrl,
      sentUserId: data.senderId,
      chatRoomId: data.receiverId, // Using receiverId as chat_room_id for simplicity
      deliveredTo: [],
      readBy: [],
      reaction: {},
    });

    return await chatMessage.saveMessage();
  }
}
