import { hashPassword, verifyPassword } from "./hash";
import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  const hashed = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || null,
    },
  });
}

export async function verifyUserCredentials(
  email: string,
  password: string
) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const ok = await verifyPassword(password, user.password);
  if (!ok) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}
