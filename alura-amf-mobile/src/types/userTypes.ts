export type UserData = {
  id: string;
  profileId: string;
  cpf: string;
  academicRegister: string;
  email: string;
  verificationCode: string;
  profile: {
    id: string;
    name: string;
    type: string;
    lastName: string;
    phone: string;
    deletedAt: Date | null;
    createdAt: number;
    isActive: boolean;
  };
};

export type UserUpdateData = {
  name: string;
  lastName: string;
  phone: string;
  cpf: string;
  academicRegister: string;
  email: string;
};

export type UserUpdatePasswordData = {
  newPassword: string;
  newPassword_confirmation: string;
  oldPassword: string;
};
