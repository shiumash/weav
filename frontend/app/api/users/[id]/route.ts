import {
  fetchUserProfile,
  fetchUserFriends
} from "@/app/services/userServices";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract the user ID from the URL parameters
  const userId = params.id;
  
  // Get the action type from the search parameters
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'profile': {
        // Fetch basic profile information
        const profileData = await fetchUserProfile(userId);
        return NextResponse.json(profileData);
      }

      case 'friends': {
        // Fetch user's friend list
        const friendsList = await fetchUserFriends(userId);
        return NextResponse.json(friendsList);
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}