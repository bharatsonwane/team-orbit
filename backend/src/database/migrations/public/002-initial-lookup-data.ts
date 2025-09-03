import { PoolClient } from 'pg';

interface LookupItem {
  label: string;
}

interface LookupTypeData {
  lookupType: string;
  lookups: LookupItem[];
}

export const up = async (client: PoolClient): Promise<void> => {
  // Define lookup data structure
  const lookupData: LookupTypeData[] = [
    {
      lookupType: "userRole",
      lookups: [
        { label: "Super Admin" },
        { label: "Admin" },
        { label: "Standard" },
      ],
    },
    {
      lookupType: "userStatus",
      lookups: [
        { label: "Pending" },
        { label: "Active" },
        { label: "Deleted" },
        { label: "Blocked" },
      ],
    },
    {
      lookupType: "chatType",
      lookups: [{ label: "1:1 Chat" }, { label: "Group Chat" }],
    },
  ];

  // Process each lookup type and its lookups
  for (const data of lookupData) {
    // Insert lookup type and get the ID
    const lookupTypeResult = await client.query(
      `
            INSERT INTO lookup_type (name, "createdAt", "updatedAt")
            VALUES ($1, NOW(), NOW())
            ON CONFLICT (name) DO NOTHING
            RETURNING id;
        `,
      [data.lookupType]
    );

    // If lookup type was inserted (not already existed), get the ID
    let lookupTypeId: number;
    if (lookupTypeResult.rows.length > 0) {
      lookupTypeId = lookupTypeResult.rows[0].id;
    } else {
      // If it already existed, fetch the existing ID
      const existingResult = await client.query(
        "SELECT id FROM lookup_type WHERE name = $1",
        [data.lookupType]
      );
      lookupTypeId = existingResult.rows[0].id;
    }

    // Insert lookups for this type
    for (const lookup of data.lookups) {
      await client.query(
        `
                INSERT INTO lookup (label, "lookupTypeId", "createdAt", "updatedAt")
                VALUES ($1, $2, NOW(), NOW())
                ON CONFLICT ("lookupTypeId", label) DO NOTHING;
            `,
        [lookup.label, lookupTypeId]
      );
    }
  }
};

export const down = async (client: PoolClient): Promise<void> => {
  // Rollback logic can be implemented here if needed
  // For now, we'll leave it empty as removing lookup data might affect other parts of the system
};
