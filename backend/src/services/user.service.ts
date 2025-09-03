import db from "../database/db";

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
  first_name: string;
  last_name: string;
  middle_name: string | null;
  maiden_name: string | null;
  gender: string | null;
  dob: string;
  blood_group: string | null;
  married_status: string | null;
  email: string;
  phone: string;
  password?: string;
  profile_picture: string | null;
  bio: string | null;
  user_status_lookup_id: number | null;
  user_role_lookup_id: number | null;
  user_status?: string;
  user_role?: string;
  created_at: string;
  updated_at: string;
}

export default class User {
  static columnMapping: Record<string, string> = {
    title: "title",
    firstName: "first_name",
    lastName: "last_name",
    middleName: "middle_name",
    maidenName: "maiden_name",
    gender: "gender",
    dob: "dob",
    bloodGroup: "blood_group",
    marriedStatus: "married_status",
    email: "email",
    phone: "phone",
    password: "password",
    hashPassword: "hash_password",
    profilePicture: "profile_picture",
    bio: "bio",
    userStatusLookupId: "user_status_lookup_id",
    userRoleLookupId: "user_role_lookup_id",
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

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
                first_name,
                last_name,
                user_status_lookup_id,
                user_role_lookup_id,
                created_at,
                updated_at
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
        up.first_name,
        up.last_name,
        up.middle_name,
        up.maiden_name,
        up.gender,
        up.dob,
        up.blood_group,
        up.married_status,
        up.email,
        up.phone,
        up.password,
        up.profile_picture,
        up.bio,
        up.user_status_lookup_id,
        up.user_role_lookup_id,
        usl.label AS user_status,
        url.label AS user_role,
        up.created_at,
        up.updated_at
      FROM 
        user_profile up
      LEFT JOIN 
        lookup usl ON up.user_status_lookup_id = usl.id
      LEFT JOIN 
        lookup url ON up.user_role_lookup_id = url.id
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
    up.first_name,
    up.last_name,
    up.middle_name,
    up.maiden_name,
    up.gender,
    up.dob,
    up.blood_group,
    up.married_status,
    up.email,
    up.phone,
    up.profile_picture,
    up.bio,
    up.user_status_lookup_id,
    up.user_role_lookup_id,
    usl.label AS user_status,
    url.label AS user_role,
    up.created_at,
    up.updated_at
  FROM 
    user_profile up
  LEFT JOIN 
    lookup usl ON up.user_status_lookup_id = usl.id
  LEFT JOIN 
    lookup url ON up.user_role_lookup_id = url.id
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
          up.first_name,
          up.last_name,
          up.middle_name,
          up.maiden_name,
          up.gender,
          up.dob,
          up.blood_group,
          up.married_status,
          up.email,
          up.phone,
          up.profile_picture,
          up.bio,
          up.user_status_lookup_id,
          up.user_role_lookup_id,
          usl.label AS user_status,
          url.label AS user_role,
          up.created_at,
          up.updated_at
      FROM 
        user_profile up
      LEFT JOIN 
        lookup usl ON up.user_status_lookup_id = usl.id
      LEFT JOIN 
        lookup url ON up.user_role_lookup_id = url.id;`;

    const results = await db.query(queryString);

    return results as UserProfile[];
  }

  async updateUserInfo(): Promise<UserProfile> {
    const acceptedKeys = [
      "title",
      "firstName",
      "lastName",
      "middleName",
      "maidenName",
      "gender",
      "dob",
      "bloodGroup",
      "marriedStatus",
      "bio",
    ];

    const setQueryString = Object.keys(this)
      .filter(
        (key) =>
          (this as any)[key] !== undefined &&
          (this as any)[key] !== null &&
          acceptedKeys.includes(key)
      )
      .map(
        (key) =>
          `${User.columnMapping[key] ? User.columnMapping[key] : key} = '${
            (this as any)[key]
          }'`
      )
      .join(", ");

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
      "title",
      "firstName",
      "lastName",
      "middleName",
      "maidenName",
      "gender",
      "dob",
      "bloodGroup",
      "marriedStatus",
      "email",
      "phone",
      "hashPassword",
      "profilePicture",
      "bio",
      "userStatusLookupId",
      "userRoleLookupId",
    ];

    const keysToInsert = acceptedKeys.filter(
      (key) => (this as any)[key] !== undefined && (this as any)[key] !== null
    );

    const columns = keysToInsert.map((key) => User.columnMapping[key] || key);
    const values = keysToInsert.map((key) => `'${(this as any)[key]}'`);

    const queryString = `
    INSERT INTO user_profile (
      ${columns.join(", ")},
      created_at,
      updated_at
    ) VALUES (
      ${values.join(", ")},
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
