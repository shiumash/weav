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
        name: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
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

const fetchUserFriends = async (userId: string) => {
  try {
    // Convert userId to BigInt since schema uses BigInt
    const userIdBigInt = BigInt(userId);
    // if this does work just do Numer(userId)

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
        friend_id: true
      }
    });

    // Find bidirectional friendships
    const confirmedFriendIds = new Set<bigint>();
    const friendPairs = new Map<string, Set<bigint>>();

    interface Friendship {
      user_id: bigint;
      friend_id: bigint;
    }

    interface FriendPairs {
      [key: string]: Set<bigint>;
    }

    friendships.forEach((friendship: Friendship) => {
      const key: string = friendship.user_id < friendship.friend_id 
        ? `${friendship.user_id}-${friendship.friend_id}`
        : `${friendship.friend_id}-${friendship.user_id}`;
      
      if (!friendPairs.has(key)) {
        friendPairs.set(key, new Set());
      }
      friendPairs.get(key)?.add(friendship.user_id);
      friendPairs.get(key)?.add(friendship.friend_id);

      // If both users are in the set, it's a confirmed friendship
      if (friendPairs.get(key)?.size === 2) {
        const friendId: bigint = friendship.user_id === userIdBigInt 
          ? friendship.friend_id 
          : friendship.user_id;
        confirmedFriendIds.add(friendId);
      }
    });

    // Fetch details for confirmed friends
    const friends = await prisma.user.findMany({
      where: {
        id: {
          in: Array.from(confirmedFriendIds)
        }
      },
      select: {
        firstName: true,
        lastName: true,
        profilePic: true,
        email: true,
        is_vegetarian: true,
        is_spicy: true,
        is_family: true
      }
    });

    return friends;

  } catch (error) {
    console.error('Error fetching user friends:', error);
    throw new Error('Failed to fetch user friends');
  }
};

export {
  addUserData,
  fetchUserProfile,
  fetchUserFriends,
  addFriendData
}