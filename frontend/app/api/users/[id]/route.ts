import {
  addUserData,

} from "@/app/services/userServices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id // 'a', 'b', or 'c'
  return Response.json({ userId })
}

export async function POST(request: Request) {
  const data = await request.json()
  addUserData(data)
}
