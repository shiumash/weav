import { PrismaClient } from '@prisma/client';
import axios from 'axios'

const prisma = new PrismaClient();

interface UserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  gcal_permission: boolean;
}

const addUserData = async ({ firstName, lastName, userName, email, gcal_permission }: UserData) => {
  return await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: userName,
      email: email,
      is_vegetarian: false,
      is_spicy: false,
      is_family: false,
      gcal_permission: gcal_permission
    }
  })
}

export {
  addUserData
}