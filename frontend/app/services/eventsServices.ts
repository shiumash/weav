import { PrismaClient } from '@prisma/client';
import axios from 'axios'

const prisma = new PrismaClient();

const fetchEvents = async (userId: string) => {
  try {
    const userIdBigInt = BigInt(userId);

    const events: {
      id: bigint,
      title: string,
      description: string,
      start_time: Date,
      end_time: Date,
      creator: {
        email: string
      },
      participants: {
        user: {
          email: string,
          firstName: string,
          lastName: string
        }
      }[]
    }[] = await prisma.event.findMany({
      where: {
        OR: [
          // Events where user is creator
          { creator_id: userIdBigInt },
          // Events where user is participant
          {
            participants: {
              some: {
                user_id: userIdBigInt
              }
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
        creator: {
          select: {
            email: true
          }
        },
        participants: {
          select: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    return events.map(event => ({
      eventId: event.id.toString(),
      title: event.title,
      description: event.description,
      startTime: event.start_time,
      endTime: event.end_time,
      creatorEmail: event.creator.email,
      participants: event.participants.map(p => ({
        email: p.user.email,
        name: `${p.user.firstName} ${p.user.lastName}`
      }))
    }));

  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};



export {
  fetchEvents
}