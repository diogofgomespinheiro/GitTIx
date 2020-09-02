import { hash, genSalt, compare } from 'bcryptjs';

export class Bcrypt {
  static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  static async comparePasswords(
    insertedPassword: string,
    existingPassword: string,
  ): Promise<boolean> {
    const isMatchPasswords = await compare(insertedPassword, existingPassword);
    return isMatchPasswords;
  }
}
