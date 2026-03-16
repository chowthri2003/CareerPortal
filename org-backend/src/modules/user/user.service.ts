import User from "./user.model.js";

export const createUserIfNotExists = async (providerId: string, email: string) => {
  const existing = await User.findOne({ where: { email } });

  if (!existing) {
    throw new Error("You are not authorized to access this organization.");
  }
  if (!existing.providerId) {
    existing.providerId = providerId;
    await existing.save();
  }

  return existing;
};

export const getAllUsers = async () => {
  return await User.findAll();
};

export const updateUserRole = async (id: string, data: { role?: "admin" | "hr"; isActive?: boolean }) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  if (data.role !== undefined) user.role = data.role;
  if (data.isActive !== undefined) user.isActive = data.isActive;

  await user.save();
  return user;
};