import db from '../database/db';

interface UserData {
  id?: number | null;
  title?: string | null;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  maidenName?: string | null;
  gender?: string | null;
  dob: string;
  bloodGroup?: string | null;
  marriedStatus?: string | null;
  email: string;
  phone: string;
  password?: string;
  hashPassword?: string;
  profilePicture?: string | null;
  bio?: string | null;
  userStatusLookupId?: number | null;
  userRoleLookupId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfile {
  id: number;
  title: string | null;
  firstName: string;
  lastName: string;
  middleName: string | null;
  maidenName: string | null;
  gender: string | null;
  dob: string;
  bloodGroup: string | null;
  marriedStatus: string | null;
  email: string;
  phone: string;
  password?: string;
  profilePicture: string | null;
  bio: string | null;
  userStatusLookupId: number | null;
  userRoleLookupId: number | null;
  userStatus?: string;
  userRole?: string;
  createdAt: string;
  updatedAt: string;
}

export default class User {
  private id: number | null;
  private title: string | null;
  private firstName: string;
  private lastName: string;
  private middleName: string | null;
  private maidenName: string | null;
  private gender: string | null;
  private dob: string;
  private bloodGroup: string | null;
  private marriedStatus: string | null;
  private email: string;
  private phone: string;
  private password: string | undefined;
  private hashPassword: string | undefined;
  private profilePicture: string | null;
  private bio: string | null;
  private userStatusLookupId: number | null;
  private userRoleLookupId: number | null;
  private createdAt: string;
  private updatedAt: string;

  // Static column mapping for database column names
  static columnMapping: { [key: string]: string } = {
    firstName: '"firstName"',
    lastName: '"lastName"',
    middleName: '"middleName"',
    maidenName: '"maidenName"',
    bloodGroup: '"bloodGroup"',
    marriedStatus: '"marriedStatus"',
    profilePicture: '"profilePicture"',
    userStatusLookupId: '"userStatusLookupId"',
    userRoleLookupId: '"userRoleLookupId"',
    createdAt: '"createdAt"',
    updatedAt: '"updatedAt"',
  };

  constructor(reqObj: UserData) {
    this.id = reqObj.id || null;
    this.title = reqObj.title || null; // ENUM type
    this.firstName = reqObj.firstName;
    this.lastName = reqObj.lastName;
    this.middleName = reqObj.middleName || null;
    this.maidenName = reqObj.maidenName || null;
    this.gender = reqObj.gender || null;
    this.dob = reqObj.dob;
    this.bloodGroup = reqObj.bloodGroup || null; // ENUM type
    this.marriedStatus = reqObj.marriedStatus || null;
    this.email = reqObj.email;
    this.phone = reqObj.phone;
    this.password = reqObj.password;
    this.hashPassword = reqObj.hashPassword;
    this.profilePicture = reqObj.profilePicture || null; // Picture URL
    this.bio = reqObj.bio || null; // User biography
    this.userStatusLookupId = reqObj.userStatusLookupId || null; // Foreign key to lookup table
    this.userRoleLookupId = reqObj.userRoleLookupId || null; // Foreign key to lookup table
    this.createdAt = reqObj.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async signupUser(): Promise<UserProfile> {
    /* insert user */
    const userSignupQuery = `
        INSERT INTO user_profile (
                email,
                password,
                phone,
                "firstName",
                "lastName",
                "userStatusLookupId",
                "userRoleLookupId",
                "createdAt",
                "updatedAt"
            ) VALUES (
                '${this.email}',
                '${this.hashPassword}',
                '${this.phone}',
                '${this.firstName}',
                '${this.lastName}',
                ${this.userStatusLookupId},
                ${this.userRoleLookupId},
                NOW(),
                NOW()
        )
        RETURNING *;`;
    const results = await db.query(userSignupQuery);
    const response = results[0] as UserProfile;
    return response;
  }

  async getUserByEmailOrPhone(): Promise<UserProfile | undefined> {
    const queryString = `
        SELECT 
        up.id,
        up.title,
        up."firstName",
        up."lastName",
        up."middleName",
        up."maidenName",
        up.gender,
        up.dob,
        up."bloodGroup",
        up."marriedStatus",
        up.email,
        up.phone,
        up.password,
        up."profilePicture",
        up.bio,
        up."userStatusLookupId",
        up."userRoleLookupId",
        usl.label AS "userStatus",
        url.label AS "userRole",
        up."createdAt",
        up."updatedAt"
      FROM 
        user_profile up
      LEFT JOIN 
        lookup usl ON up."userStatusLookupId" = usl.id
      LEFT JOIN 
        lookup url ON up."userRoleLookupId" = usl.id
      WHERE email = '${this.email}' OR phone = '${this.phone}';`;

    const results = await db.query(queryString);
    const response = results[0] as UserProfile | undefined;

    return response;
  }

  async getUserById(): Promise<UserProfile | undefined> {
    const queryString = `
    SELECT 
    up.id,
    up.title,
    up."firstName",
    up."lastName",
    up."middleName",
    up."maidenName",
    up.gender,
    up.dob,
    up."bloodGroup",
    up."marriedStatus",
    up.email,
    up.phone,
    up."profilePicture",
    up.bio,
    up."userStatusLookupId",
    up."userRoleLookupId",
    usl.label AS "userStatus",
    url.label AS "userRole",
    up."createdAt",
    up."updatedAt"
  FROM 
    user_profile up
  LEFT JOIN 
    lookup usl ON up."userStatusLookupId" = usl.id
  LEFT JOIN 
    lookup url ON up."userRoleLookupId" = usl.id
  WHERE up.id = ${this.id};`;

    const results = await db.query(queryString);
    const response = results[0] as UserProfile | undefined;

    return response;
  }

  static async getUsers(): Promise<UserProfile[]> {
    const queryString = `
        SELECT 
          up.id,
          up.title,
          up."firstName",
          up."lastName",
          up."middleName",
          up."maidenName",
          up.gender,
          up.dob,
          up."bloodGroup",
          up."marriedStatus",
          up.email,
          up.phone,
          up."profilePicture",
          up.bio,
          up."userStatusLookupId",
          up."userRoleLookupId",
          usl.label AS "userStatus",
          url.label AS "userRole",
          up."createdAt",
          up."updatedAt"
      FROM 
        user_profile up
      LEFT JOIN 
        lookup usl ON up."userStatusLookupId" = usl.id
      LEFT JOIN 
        lookup url ON up."userRoleLookupId" = usl.id;`;

    const results = await db.query(queryString);

    return results as UserProfile[];
  }

  async updateUserInfo(): Promise<UserProfile> {
    const acceptedKeys = [
      'title',
      'firstName',
      'lastName',
      'middleName',
      'maidenName',
      'gender',
      'dob',
      'bloodGroup',
      'marriedStatus',
      'bio',
    ];

    const setQueryString = Object.keys(this)
      .filter(
        key =>
          (this as any)[key] !== undefined &&
          (this as any)[key] !== null &&
          acceptedKeys.includes(key)
      )
      .map(
        key =>
          `${User.columnMapping[key] ? User.columnMapping[key] : key} = '${
            (this as any)[key]
          }'`
      )
      .join(', ');

    const queryString = `
      UPDATE user_profile
      SET ${setQueryString}
      WHERE id = ${this.id} RETURNING *;`;
    const results = await db.query(queryString);

    delete (results[0] as any).password;
    return results[0] as UserProfile;
  }

  async updateUserPassword(): Promise<UserProfile> {
    const queryString = `
      UPDATE user_profile
      SET password = '${this.hashPassword}'
      WHERE id = ${this.id} RETURNING *;`;
    const results = await db.query(queryString);

    delete (results[0] as any).password;
    return results[0] as UserProfile;
  }

  async createUserInfo(): Promise<UserProfile> {
    const acceptedKeys = [
      'title',
      'firstName',
      'lastName',
      'middleName',
      'maidenName',
      'gender',
      'dob',
      'bloodGroup',
      'marriedStatus',
      'email',
      'phone',
      'hashPassword',
      'profilePicture',
      'bio',
      'userStatusLookupId',
      'userRoleLookupId',
    ];

    const keysToInsert = acceptedKeys.filter(
      key => (this as any)[key] !== undefined && (this as any)[key] !== null
    );

    const columns = keysToInsert.map(key => User.columnMapping[key] || key);
    const values = keysToInsert.map(key => `'${(this as any)[key]}'`);

    const queryString = `
    INSERT INTO user_profile (
      ${columns.join(', ')},
      "createdAt",
      "updatedAt"
    ) VALUES (
      ${values.join(', ')},
      NOW(),
      NOW()
    )
    RETURNING *;
  `;

    const results = await db.query(queryString);
    const response = results[0] as UserProfile;
    delete (response as any).password;

    return response;
  }
}
