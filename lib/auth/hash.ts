/* ===================================================================
File: lib/auth/hash.ts
Purpose: simple bcrypt helpers for hashing & verifying passwords
=================================================================== */
import bcrypt from "bcryptjs";


export const SALT_ROUNDS = 10;


export async function hashPassword(plain: string): Promise<string> {
return await bcrypt.hash(plain, SALT_ROUNDS);
}


export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
return await bcrypt.compare(plain, hash);
}
