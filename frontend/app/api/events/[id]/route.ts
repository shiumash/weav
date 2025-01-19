import { fetchEvents } from "@/app/services/eventsServices";
import { NextResponse } from "next/server";
import { useUser } from "@clerk/nextjs";

const userData = useUser();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const events = await fetchEvents(userData);
    
    return NextResponse.json({ 
      success: true,
      events: events 
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}