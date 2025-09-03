-- lookup_type Table
CREATE TABLE IF NOT EXISTS lookup_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- lookup Table
CREATE TABLE IF NOT EXISTS lookup (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    "lookupTypeId" INT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_lookup_lookup_type FOREIGN KEY ("lookupTypeId") REFERENCES lookup_type (id),
    CONSTRAINT unique_lookup_type_id_label UNIQUE ("lookupTypeId", label)
);

-- title_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'title_enum') THEN
        CREATE TYPE title_enum AS ENUM ('Mr', 'Mrs', 'Ms');
    END IF;
END $$;

-- gender_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
        CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
    END IF;
END $$;

-- blood_group_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blood_group_enum') THEN
        CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
    END IF;
END $$;

-- married_status_enum Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'married_status_enum') THEN
        CREATE TYPE married_status_enum AS ENUM ( 'Single', 'Married', 'Divorced', 'Widowed');
    END IF;
END $$;

-- user_profile Table
CREATE TABLE IF NOT EXISTS user_profile (
    id SERIAL PRIMARY KEY,
    title title_enum, -- Use ENUM type
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "middleName" VARCHAR(255),
    "maidenName" VARCHAR(255),
    gender gender_enum, -- Use ENUM type
    dob DATE,
    "bloodGroup" blood_group_enum, -- Use ENUM type
    "marriedStatus" married_status_enum,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),  -- Store hashed password
    "profilePicture" VARCHAR(255), -- Picture URL
    bio TEXT, -- User biography
    "userStatusLookupId" INT, -- Foreign key to lookup table
    "userRoleLookupId" INT,   -- Foreign key to lookup table
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user_status_lookup FOREIGN KEY ("userStatusLookupId") REFERENCES lookup (id) ON DELETE SET NULL,
    CONSTRAINT fk_user_role_lookup FOREIGN KEY ("userRoleLookupId") REFERENCES lookup (id) ON DELETE SET NULL
);

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
