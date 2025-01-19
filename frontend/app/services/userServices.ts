import { PrismaClient } from '@prisma/client';
import axios from 'axios'

const prisma = new PrismaClient();

interface UserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  gcal_permission: boolean;
  profilePic: string;
}

const addUserData = async ({ firstName, lastName, userName, email, gcal_permission, profilePic }: UserData) => {
  return await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: userName,
      profilePic: profilePic,
      email: email,
      is_vegetarian: false,
      is_spicy: false,
      is_family: false,
      gcal_permission: gcal_permission
    }
  })
}

const addFriendData = async (userId: string, targetEmail: string) => {
  try {
    const userIdBigInt = BigInt(userId);
    
    // Find target user by email
    const targetUser = await prisma.user.findUnique({
      where: {
        email: targetEmail
      },
      select: {
        id: true
      }
    });

    if (!targetUser) {
      throw new Error('Target user not found');
    }

    const friendship = await prisma.friend.create({
      data: {
        user_id: userIdBigInt,
        friend_id: targetUser.id
      }
    });

    return friendship;
    
  } catch (error) {
    console.error('Error adding friend connection:', error);
    throw new Error('Failed to add friend connection');
  }
};

const fetchUserProfile = async (userId: string) => {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePic: true,
      },
    });

    if (!userData) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

async function fetchUserFriends(userId: string) {
  try {
    const userIdBigInt = BigInt(userId);

    // Get all friend relationships where user is either initiator or receiver
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [
          { user_id: userIdBigInt },
          { friend_id: userIdBigInt }
        ]
      },
      select: {
        user_id: true,
        friend_id: true,
        user: true,
        friend: true
      }
    });

    // Find bidirectional friendships
    const confirmedFriendIds = new Set<bigint>();
    const friendPairs = new Map<string, Set<bigint>>();

    friendships.forEach(friendship => {
      const { user_id, friend_id } = friendship;
      const key = `${user_id}-${friend_id}`;
      const reverseKey = `${friend_id}-${user_id}`;

      if (friendPairs.has(reverseKey)) {
        confirmedFriendIds.add(user_id);
        confirmedFriendIds.add(friend_id);
      } else {
        friendPairs.set(key, new Set([user_id, friend_id]));
      }
    });

    // Fetch user details for confirmed friends
    const confirmedFriends = await prisma.user.findMany({
      where: {
        id: { in: Array.from(confirmedFriendIds) }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        profilePic: true
      }
    });

    return confirmedFriends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
}

export {
  addUserData,
  fetchUserProfile,
  fetchUserFriends,
  addFriendData
}