export interface LookupType {
  lookupType: string;
  lookups: { label: string }[];
}

export interface Lookup {
  id: number;
  label: string;
  lookupTypeId: number;
  lookupTypeName: string;
}
