"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Comment {
  id: string
  text: string
  content?: string
  author?: string
  authorName?: string
  createdAt: string
}

interface CommentsSectionProps {
  postId: string
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/posts/${postId}/comments`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setComments(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, id-param) // Corrigido: era "id-param" e agora é id-param

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setComments([...comments, data])
      setNewComment("")
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (loading) {
    return <p>Loading comments...</p>
  }

  if (error) {
    return <p>Error loading comments: {error}</p>
  }

  return (
    <div>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content || comment.text}</p>
              <p>
                By {comment.authorName || comment.author || "Anonymous"} on{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h4>Add a comment</h4>
      <form onSubmit={handleSubmit}>
        <textarea value={newComment} onChange={handleInputChange} placeholder="Write your comment here..." />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default CommentsSection





