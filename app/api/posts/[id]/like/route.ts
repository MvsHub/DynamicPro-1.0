import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    const userId = "user-test-id" // Replace with actual user ID retrieval

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: userId,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId: postId,
            userId: userId,
          },
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      await prisma.like.create({
        data: {
          postId: postId,
          userId: userId,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

