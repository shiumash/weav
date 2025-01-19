import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const events = await prisma.event.findMany()
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        start_time: new Date(body.start_time),
        end_time: new Date(body.end_time),
        creator_id: BigInt(body.creator_id),
        everyone_fw: body.everyone_fw || false
      }
    })
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}