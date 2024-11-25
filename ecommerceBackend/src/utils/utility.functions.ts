import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

export async function hashPassword(userPassword: string) {
  const saltOrRounds = parseInt(process.env.Salt_Or_Rounds);
  const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
  return hashedPassword;
}

export async function comparePassword(
  userPassword: string,
  storedPassword: string,
) {
  const verifyPassword = await bcrypt.compare(userPassword, storedPassword);
  if (!verifyPassword) {
    throw new BadRequestException('Invalid Credentials');
  }
  return verifyPassword;
}

export function isEmailOrPhoneNumber(
  email: string,
): 'email' | 'phone' | 'neither' {
  const emailRegex = /^[a-zA-Z_][a-zA-Z0-9_.]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  if (emailRegex.test(email)) {
    return 'email';
  } else if (phoneRegex.test(email)) {
    return 'phone';
  } else {
    throw new BadRequestException('Invalid email');
  }
}

export function generateRandom4DigitNumber() {
  const random4DigitNumber = Math.floor(Math.random() * 10000);
  const formattedNumber = String(random4DigitNumber).padStart(4, '0');
  return formattedNumber;
}

export function generateRandomPassword(): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const specialChars = '@$!%*?&';
  const digits = '0123456789';

  const minLength = 8;
  let password = '';

  // This is the requiremnet for login so follow the constraints when generating random passsword
  // Password should have atleast 1-UpperCase Letter, 1-LowerCase Letter, 1-Special Character, 1-Digit and should have more than 8 Characters
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]; // Include at least one uppercase letter
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]; // Include at least one lowercae letter
  password += specialChars[Math.floor(Math.random() * specialChars.length)]; // Include at least one special character
  password += digits[Math.floor(Math.random() * digits.length)]; // Include at least one digit

  const remainingLength = minLength - password.length;
  const allChars = uppercaseChars + lowercaseChars + specialChars + digits;
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join(''); // Shuffle password for randomness

  return password;
}
