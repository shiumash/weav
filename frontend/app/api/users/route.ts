import {
    addUserData,
    addFriendData
  } from "@/app/services/userServices";
  
// app/api/users/route.ts - For non-dynamic POST requests
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get the action type from the URL parameters
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const body = await request.json();

  try {
    switch (action) {
      case 'friend': {
        const { userId, targetEmail } = body;
        await addFriendData(userId, targetEmail);
        return NextResponse.json({ success: true });
      }
      
      case 'profile': {
        // Handle profile update logic
        // Profile data would come from the request body
        const { userData } = body;
        // Your profile update logic here
        return NextResponse.json({ success: true });
      }

    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}