import { fetchEvents } from "@/app/services/eventsServices";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const events = await fetchEvents(userId);
    
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