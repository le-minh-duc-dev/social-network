import React from "react"

export default function CommentForm({ postId }: { postId: string }) {
    
  return (
    <form>
      <input
        placeholder="Add a comment..."
        type="text"
        className=" focus-within:bg-transparent focus-within:outline-none w-full bg-transparent pb-1 text-sm"
      />
    </form>
  )
}
