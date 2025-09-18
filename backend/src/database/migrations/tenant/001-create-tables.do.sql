-- chat_room_type_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_room_type_enum') THEN
        CREATE TYPE chat_room_type_enum AS ENUM ('one_to_one', 'group');
    END IF;
END $$;

-- chat_room Table
CREATE TABLE IF NOT EXISTS chat_room (
    id SERIAL PRIMARY KEY,
    type chat_room_type_enum NOT NULL, -- ENUM for chat room type
    description TEXT, -- Chat room description
    image VARCHAR(255), -- Image URL for the chat room
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE NOT NULL -- Indicates if the chat room is active
);

-- user_chat_room_mapping Table
CREATE TABLE IF NOT EXISTS user_chat_room_mapping (
    id SERIAL PRIMARY KEY,
    "userProfileId" INT NOT NULL, -- Foreign key to user_profile table
    "chatRoomId" INT NOT NULL, -- Foreign key to chat_room table
    "isAdmin" BOOLEAN DEFAULT FALSE NOT NULL, -- Indicates if the user is an admin in the chat room
    "isActive" BOOLEAN DEFAULT TRUE NOT NULL, -- Indicates if the mapping is active
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user_profile FOREIGN KEY ("userProfileId") REFERENCES user_profile (id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_room FOREIGN KEY ("chatRoomId") REFERENCES chat_room (id) ON DELETE CASCADE
);

-- chat_message Table
CREATE TABLE IF NOT EXISTS chat_message (
    id SERIAL PRIMARY KEY,
    text TEXT, -- Message text content
    media VARCHAR(255), -- Media URL or file path
    "isEdited" BOOLEAN DEFAULT FALSE NOT NULL, -- Indicates if the message is edited
    "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL, -- Indicates if the message is deleted
    "deliveredTo" JSON, -- JSON array storing who the message is delivered to
    "readBy" JSON, -- JSON array storing who has read the message
    reaction JSON, -- JSON storing reactions to the message
    "sentUserId" INT NOT NULL, -- Foreign key to user_profile table
    "chatRoomId" INT NOT NULL, -- Foreign key to chat_room table
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_sent_user FOREIGN KEY ("sentUserId") REFERENCES user_profile (id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_room FOREIGN KEY ("chatRoomId") REFERENCES chat_room (id) ON DELETE CASCADE
);
