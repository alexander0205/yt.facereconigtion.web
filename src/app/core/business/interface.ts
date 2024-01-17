export interface People {
  _id?: number | string | null;
  name?: string;
  identification?: string;
  businessId?: string;
}

export interface Business {
  _id?: string | null;
  name?: string;
  description?: string;
  userId?: string;
}
