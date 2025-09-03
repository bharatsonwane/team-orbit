import logger from "../../utils/logger";
import db from "../db";
import { getHashPassword } from "../../utils/authHelper";

interface LookupType {
  name: string;
  lookups: Array<{ label: string }>;
}

interface UserData {
  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  maidenName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  marriedStatus: string;
  email: string;
  phone: string;
  password: string;
  profilePicture: string;
  bio: string;
  userStatusLookupId: number;
  userRoleLookupId: number;
}

interface LookupData {
  id: number;
  label: string;
  lookup_type_id: number;
  lookup_type_name: string;
}

async function main(): Promise<void> {
  try {
    logger.info("seed main function called");

    // First, create tables if they don't exist
    await createTables();

    const upsertAndFetchLookupData = async () => {
      const lookupTypeList: LookupType[] = [
        {
          name: "userRole",
          lookups: [
            { label: "Super Admin" },
            { label: "Admin" },
            { label: "Standard" },
          ],
        },
        {
          name: "userStatus",
          lookups: [
            { label: "Pending" },
            { label: "Active" },
            { label: "Deleted" },
            { label: "Blocked" },
          ],
        },
        {
          name: "chatType",
          lookups: [{ label: "1:1 Chat" }, { label: "Group Chat" }],
        },
      ];

      for (const lookupType of lookupTypeList) {
        /** Step 1: Upsert LookupType */
        const upsertLookupTypeQuery = `
          INSERT INTO lookup_type (name, "createdAt", "updatedAt")
          VALUES ($1, NOW(), NOW())
          ON CONFLICT (name) DO UPDATE
          SET "updatedAt" = NOW()
          RETURNING id, name;
        `;

        const lookupTypeResult = await db.query(upsertLookupTypeQuery, [
          lookupType.name,
        ]);
        const { id: lookupTypeId, name: lookupTypeName } = lookupTypeResult[0];

        logger.info(`Upserted lookup type: ${lookupTypeName} with ID: ${lookupTypeId}`);

        /** Step 2: Upsert Lookups for this LookupType */
        for (const lookup of lookupType.lookups) {
          const upsertLookupQuery = `
            INSERT INTO lookup (label, "lookupTypeId", "createdAt", "updatedAt")
            VALUES ($1, $2, NOW(), NOW())
            ON CONFLICT (label, "lookupTypeId") DO UPDATE
            SET "updatedAt" = NOW()
            RETURNING id, label, "lookupTypeId"
          `;
          const lookupResult = await db.query(upsertLookupQuery, [
            lookup.label,
            lookupTypeId
          ]);
          
          if (lookupResult.length > 0) {
            logger.info(`Upserted lookup: ${lookup.label} with ID: ${lookupResult[0].id}`);
          }
        }
      }

      const getLookupDataByTypeLabel = async (lookupTypeName: string, lookupLabel: string): Promise<LookupData> => {
        const getLookupDataQuery = `
          SELECT l.id, l.label, l."lookupTypeId" as lookup_type_id, lt.name as lookup_type_name
          FROM lookup_type lt
          INNER JOIN lookup l ON lt.id = l."lookupTypeId"
          WHERE lt.name = $1 AND l.label = $2;
        `;

        const lookupDataResult = await db.query(getLookupDataQuery, [
          lookupTypeName,
          lookupLabel,
        ]);
        
        if (lookupDataResult.length === 0) {
          throw new Error(`Lookup data not found for type: ${lookupTypeName}, label: ${lookupLabel}`);
        }
        
        return lookupDataResult[0];
      };

      return { getLookupDataByTypeLabel };
    };

    const { getLookupDataByTypeLabel } = await upsertAndFetchLookupData();

    // Get lookup data for user roles and status
    const superAdminRoleData = await getLookupDataByTypeLabel(
      "userRole",
      "Super Admin"
    );

    const adminRoleData = await getLookupDataByTypeLabel("userRole", "Admin");

    const activeUserStatusData = await getLookupDataByTypeLabel(
      "userStatus",
      "Active"
    );

    logger.info(`Super Admin Role ID: ${superAdminRoleData.id}`);
    logger.info(`Admin Role ID: ${adminRoleData.id}`);
    logger.info(`Active Status ID: ${activeUserStatusData.id}`);

    const upsertAndFetchUserData = async () => {
      const userDataList: UserData[] = [
        {
          title: "Mr",
          firstName: "SuperFirstName1",
          lastName: "SuperLastName",
          middleName: "SuperMiddleName",
          maidenName: "",
          gender: "Male",
          dob: "1995-07-31",
          bloodGroup: "B+",
          marriedStatus: "Married",
          email: "bharatsdev@gmail.com",
          phone: "1234567890",
          password: "Super@123",
          profilePicture: "",
          bio: "This is Super Admin",
          userStatusLookupId: activeUserStatusData.id,
          userRoleLookupId: superAdminRoleData.id,
        },
        {
          title: "Mr",
          firstName: "AdminFirstName",
          lastName: "AdminLastName",
          middleName: "AdminMiddleName",
          maidenName: "",
          gender: "Male",
          dob: "1995-06-19",
          bloodGroup: "B+",
          marriedStatus: "Single",
          email: "shantanu@gmail.com",
          phone: "1234567891",
          password: "Admin@123",
          profilePicture: "",
          bio: "This is Admin user",
          userStatusLookupId: activeUserStatusData.id,
          userRoleLookupId: adminRoleData.id,
        },
      ];

      for (const userData of userDataList) {
        try {
          // Hash the password
          const hashedPassword = await getHashPassword(userData.password);
          
          // Check if user already exists
          const checkUserQuery = `
            SELECT id, email FROM user_profile WHERE email = $1;
          `;
          const existingUser = await db.query(checkUserQuery, [userData.email]);
          
          if (existingUser.length > 0) {
            logger.info(`User already exists: ${userData.email}`);
            continue;
          }

          // Insert new user
          const upsertUserQuery = `
            INSERT INTO user_profile (
              title,
              "firstName",
              "lastName",
              "middleName",
              "maidenName",
              gender,
              dob,
              "bloodGroup",
              "marriedStatus",
              email,
              phone,
              password,
              "profilePicture",
              bio,
              "userStatusLookupId",
              "userRoleLookupId",
              "createdAt",
              "updatedAt")
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
            )
            RETURNING id, email, "firstName", "lastName";
          `;

          const userResult = await db.query(upsertUserQuery, [
            userData.title,
            userData.firstName,
            userData.lastName,
            userData.middleName,
            userData.maidenName,
            userData.gender,
            userData.dob,
            userData.bloodGroup,
            userData.marriedStatus,
            userData.email,
            userData.phone,
            hashedPassword,
            userData.profilePicture,
            userData.bio,
            userData.userStatusLookupId,
            userData.userRoleLookupId
          ]);
          
          if (userResult.length > 0) {
            const userResponse = userResult[0];
            logger.info(`User created successfully: ${userResponse.email} (ID: ${userResponse.id})`);
          }
        } catch (userError) {
          logger.error(`Error creating user ${userData.email}:`, userError);
        }
      }
    };

    await upsertAndFetchUserData();
    logger.info("Seeding completed successfully!");
    
  } catch (error) {
    logger.error("Error occurred during seeding:", error);
    throw error; // Re-throw to ensure the process exits with error code
  } finally {
    logger.info("Seeding reached to finally!");
  }
}

async function createTables(): Promise<void> {
  try {
    logger.info("Creating database tables...");

    // Create lookup_type table
    const createLookupTypeTable = `
      CREATE TABLE IF NOT EXISTS lookup_type (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;

    await db.query(createLookupTypeTable);
    logger.info("lookup_type table created/verified");

    // Create lookup table
    const createLookupTable = `
      CREATE TABLE IF NOT EXISTS lookup (
        id SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        "lookupTypeId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("lookupTypeId") REFERENCES lookup_type(id) ON DELETE CASCADE,
        UNIQUE(label, "lookupTypeId")
      );
    `;

    await db.query(createLookupTable);
    logger.info("lookup table created/verified");

    // Create user_profile table
    const createUserProfileTable = `
      CREATE TABLE IF NOT EXISTS user_profile (
        id SERIAL PRIMARY KEY,
        title VARCHAR(10),
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        "middleName" VARCHAR(100),
        "maidenName" VARCHAR(100),
        gender VARCHAR(20),
        dob DATE,
        "bloodGroup" VARCHAR(10),
        "marriedStatus" VARCHAR(20),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        "profilePicture" TEXT,
        bio TEXT,
        "userStatusLookupId" INTEGER,
        "userRoleLookupId" INTEGER,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("userStatusLookupId") REFERENCES lookup(id),
        FOREIGN KEY ("userRoleLookupId") REFERENCES lookup(id)
      );
    `;

    await db.query(createUserProfileTable);
    logger.info("user_profile table created/verified");

    // Create indexes for better performance
    const createIndexes = [
      `CREATE INDEX IF NOT EXISTS idx_lookup_type_name ON lookup_type(name);`,
      `CREATE INDEX IF NOT EXISTS idx_lookup_type_label ON lookup("lookupTypeId", label);`,
      `CREATE INDEX IF NOT EXISTS idx_user_profile_email ON user_profile(email);`,
      `CREATE INDEX IF NOT EXISTS idx_user_profile_status ON user_profile("userStatusLookupId");`,
      `CREATE INDEX IF NOT EXISTS idx_user_profile_role ON user_profile("userRoleLookupId");`
    ];

    for (const indexQuery of createIndexes) {
      await db.query(indexQuery);
    }
    
    logger.info("Database indexes created/verified");
    logger.info("All tables created successfully!");

  } catch (error) {
    logger.error("Error creating tables:", error);
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Graceful shutdown...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  logger.error('Fatal error in main function:', error);
  process.exit(1);
});
