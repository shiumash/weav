import { executePythonScript } from "@/app/services/eventsServices";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pythonResult = await executePythonScript(data);
    
    if (!pythonResult.success) {
      return NextResponse.json(
        { error: pythonResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pythonResult.data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}