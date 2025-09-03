import db from "../database/db";

interface ChatMessageData {
  text?: string | null;
  media?: string | null;
  sent_user_id: string;
  chat_room_id: string;
  delivered_to?: string[];
  read_by?: string[];
  reaction?: Record<string, any>;
}

interface ChatMessage {
  id: string;
  text: string | null;
  media: string | null;
  sent_user_id: string;
  chat_room_id: string;
  created_at: string;
  delivered_to: string[];
  read_by: string[];
  reaction: Record<string, any>;
}

export default class Chat {
  private text: string | null;
  private media: string | null;
  private sent_user_id: string;
  private chat_room_id: string;
  private createdAt: string;
  private delivered_to: string[];
  private read_by: string[];
  private reaction: Record<string, any>;

  constructor({
    text,
    media,
    sent_user_id,
    chat_room_id,
    delivered_to,
    read_by,
    reaction,
  }: ChatMessageData) {
    this.text = text || null;
    this.media = media || null;
    this.sent_user_id = sent_user_id;
    this.chat_room_id = chat_room_id;
    this.createdAt = new Date().toISOString();

    // Ensure JSON-valid defaults
    this.delivered_to = Array.isArray(delivered_to) ? delivered_to : [];
    this.read_by = Array.isArray(read_by) ? read_by : [];
    this.reaction =
      reaction && typeof reaction === "object" && !Array.isArray(reaction)
        ? reaction
        : {};
  }

  async saveMessage(): Promise<ChatMessage> {
    const query = `
      INSERT INTO chat_message (
        text,
        media,
        sent_user_id,
        chat_room_id,
        created_at,
        delivered_to,
        read_by,
        reaction
      ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      this.text,
      this.media,
      this.sent_user_id,
      this.chat_room_id,
      JSON.stringify(this.delivered_to),
      JSON.stringify(this.read_by),
      JSON.stringify(this.reaction),
    ];

    console.log("Inserting chat message with values:", values);

    try {
      const result = await db.query(query, values);
      if (!result || result.length === 0) {
        throw new Error("No rows returned from insert");
      }
      return result[0] as ChatMessage;
    } catch (error) {
      console.error("Error saving chat message:", error);
      throw new Error("Failed to insert chat message");
    }
  }

  static async getMessagesForRoom(chat_room_id: string): Promise<ChatMessage[]> {
    const query = `
      SELECT * FROM chat_message
      WHERE chat_room_id = $1
      ORDER BY created_at ASC;
    `;
    try {
      const result = await db.query(query, [chat_room_id]);
      return result as ChatMessage[];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Failed to fetch messages for chat room");
    }
  }

  static async saveMessage(data: { senderId: string; receiverId: string; message: string; mediaUrl?: string }): Promise<ChatMessage> {
    // This method is used by the socket.io handler
    const chatMessage = new Chat({
      text: data.message,
      media: data.mediaUrl,
      sent_user_id: data.senderId,
      chat_room_id: data.receiverId, // Using receiverId as chat_room_id for simplicity
      delivered_to: [],
      read_by: [],
      reaction: {},
    });

    return await chatMessage.saveMessage();
  }
}
