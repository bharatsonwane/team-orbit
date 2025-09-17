import logger from '../../utils/logger';
import db, { schemaNames } from '../db';
import { getHashPassword } from '../../utils/authHelper';

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
    logger.info('seed main function called');

    const pool = await db.getSchemaPool(schemaNames.main);

    const upsertAndFetchLookupData = async () => {
      const lookupTypeList: LookupType[] = [
        {
          name: 'userRole',
          lookups: [
            { label: 'Super Admin' },
            { label: 'Admin' },
            { label: 'Standard' },
          ],
        },
        {
          name: 'userStatus',
          lookups: [
            { label: 'Pending' },
            { label: 'Active' },
            { label: 'Deleted' },
            { label: 'Blocked' },
          ],
        },
        {
          name: 'chatType',
          lookups: [{ label: '1:1 Chat' }, { label: 'Group Chat' }],
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

        const lookupTypeResult = (
          await pool.query(upsertLookupTypeQuery, [lookupType.name])
        ).rows;

        const { id: lookupTypeId, name: lookupTypeName } = lookupTypeResult[0];

        logger.info(
          `Upserted lookup type: ${lookupTypeName} with ID: ${lookupTypeId}`
        );

        /** Step 2: Upsert Lookups for this LookupType */
        for (const lookup of lookupType.lookups) {
          const upsertLookupQuery = `
            INSERT INTO lookup (label, "lookupTypeId", "createdAt", "updatedAt")
            VALUES ($1, $2, NOW(), NOW())
            ON CONFLICT (label, "lookupTypeId") DO UPDATE
            SET "updatedAt" = NOW()
            RETURNING id, label, "lookupTypeId"
          `;
          const lookupResult = (
            await pool.query(upsertLookupQuery, [lookup.label, lookupTypeId])
          ).rows;

          if (lookupResult.length > 0) {
            logger.info(
              `Upserted lookup: ${lookup.label} with ID: ${lookupResult[0].id}`
            );
          }
        }
      }

      const getLookupDataByTypeLabel = async (
        lookupTypeName: string,
        lookupLabel: string
      ): Promise<LookupData> => {
        const getLookupDataQuery = `
          SELECT l.id, l.label, l."lookupTypeId" as lookup_type_id, lt.name as lookup_type_name
          FROM lookup_type lt
          INNER JOIN lookup l ON lt.id = l."lookupTypeId"
          WHERE lt.name = $1 AND l.label = $2;
        `;

        const lookupDataResult = (
          await pool.query(getLookupDataQuery, [lookupTypeName, lookupLabel])
        ).rows;

        if (lookupDataResult.length === 0) {
          throw new Error(
            `Lookup data not found for type: ${lookupTypeName}, label: ${lookupLabel}`
          );
        }

        return lookupDataResult[0];
      };

      return { getLookupDataByTypeLabel };
    };

    const { getLookupDataByTypeLabel } = await upsertAndFetchLookupData();

    // Get lookup data for user roles and status
    const superAdminRoleData = await getLookupDataByTypeLabel(
      'userRole',
      'Super Admin'
    );

    const adminRoleData = await getLookupDataByTypeLabel('userRole', 'Admin');

    const activeUserStatusData = await getLookupDataByTypeLabel(
      'userStatus',
      'Active'
    );

    logger.info(`Super Admin Role ID: ${superAdminRoleData.id}`);
    logger.info(`Admin Role ID: ${adminRoleData.id}`);
    logger.info(`Active Status ID: ${activeUserStatusData.id}`);

    const upsertAndFetchUserData = async () => {
      const userDataList: UserData[] = [
        {
          title: 'Mr',
          firstName: 'SuperFirstName1',
          lastName: 'SuperLastName',
          middleName: 'SuperMiddleName',
          maidenName: '',
          gender: 'Male',
          dob: '1995-07-31',
          bloodGroup: 'B+',
          marriedStatus: 'Married',
          email: 'bharatsdev@gmail.com',
          phone: '1234567890',
          password: 'Super@123',
          profilePicture: '',
          bio: 'This is Super Admin',
          userStatusLookupId: activeUserStatusData.id,
          userRoleLookupId: superAdminRoleData.id,
        },
        {
          title: 'Mr',
          firstName: 'AdminFirstName',
          lastName: 'AdminLastName',
          middleName: 'AdminMiddleName',
          maidenName: '',
          gender: 'Male',
          dob: '1995-06-19',
          bloodGroup: 'B+',
          marriedStatus: 'Single',
          email: 'shantanu@gmail.com',
          phone: '1234567891',
          password: 'Admin@123',
          profilePicture: '',
          bio: 'This is Admin user',
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
          const existingUser = (
            await pool.query(checkUserQuery, [userData.email])
          ).rows;

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

          const userResult = (
            await pool.query(upsertUserQuery, [
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
              userData.userRoleLookupId,
            ])
          ).rows;

          if (userResult.length > 0) {
            const userResponse = userResult[0];
            logger.info(
              `User created successfully: ${userResponse.email} (ID: ${userResponse.id})`
            );
          }
        } catch (userError) {
          logger.error(`Error creating user ${userData.email}:`, userError);
        }
      }
    };

    await upsertAndFetchUserData();
    logger.info('Seeding completed successfully!');
  } catch (error) {
    logger.error('Error occurred during seeding:', error);
    throw error; // Re-throw to ensure the process exits with error code
  } finally {
    logger.info('Seeding reached to finally!');
    process.exit(0);
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
main().catch(error => {
  logger.error('Fatal error in main function:', error);
  process.exit(1);
});
