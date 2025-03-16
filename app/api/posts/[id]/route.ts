import { NextResponse } from "next/server"

// Dummy data - replace with your actual data source
const posts = [
  { id: "1", title: "First Post", content: "This is the first post." },
  { id: "2", title: "Second Post", content: "This is the second post." },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const postId = params.id
  const post = posts.find((post) => post.id === postId)

  if (!post) {
    return new NextResponse(JSON.stringify({ message: "Post not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return new NextResponse(JSON.stringify(post), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


