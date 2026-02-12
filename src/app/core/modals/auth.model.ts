export interface UserResponse {
  userAccountID: number;
  userName: string;
  loginName: string;
  designation: string;
  password?: string; // Optional as it might be excluded in other API calls
  description: string;
  employeeID: number;
  employeeName: string;
  employeeNameNat: string;
  branchID: number;
  institutionID: number;
  companyID: number;
  companyName: string;
  voucherTypeSetup: 'Y' | 'N'; // Using literal types for ERP flags
  companyNameNat: string;
  address1: string;
  address2: string;
  shortName: string;
  city: string;
  country: string;
  phone: string;
  currencyID: number;
  branchMail: string;
  crNo: string;
  accountNo: string | null;
  bankBranch: string | null;
  licCode: string | null;
  swiftCode: string | null;
  bankName: string | null;
  url: string | null;
  vattin: string;
  nationality: string;
  itemCodeAutoGen: 'Y' | 'N';
  ledgerWithCode: 'Y' | 'N';
  defaultSMSProviderID: number;
  culture: string;
  email: string;
  photopath: string | null;
  loginType: string;
  accessToken: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  expiresIn: number;
}

export interface TrialInfo {
  isTrialMode: boolean;
  trialStartDate: Date;
  trialEndDate: Date;
  daysRemaining: number;
  isFeaturesRestricted: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  STUDENT = 'student',
  GUEST = 'guest'
}

export enum Permission {
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  MANAGE_COURSES = 'manage:courses',
  VIEW_REPORTS = 'view:reports',
  MANAGE_TRIAL = 'manage:trial'
}

export type RolePermissionMap = {
  [key in UserRole]: Permission[];
}
