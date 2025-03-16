"use client"

const FeedPage = () => {
  return (
    <div>
      <h1>Feed</h1>
      {/* 
        // Verificar e atualizar qualquer referência à rota de comentários
        // Se houver chamadas como:
        // fetch(`/api/posts/${post.id}/comments`)

        // Manter como está, pois já usa o padrão correto com 'id'
      */}
      <p>This is the feed page. Placeholder content.</p>
      {/* Example of fetching posts (replace with actual data fetching) */}
      {/* 
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => {
              // Example of fetching comments for a post
              // Assuming the API route is already correct (using post.id)
              fetch(`/api/posts/${post.id}/comments`)
                .then(response => response.json())
                .then(comments => {
                  console.log(`Comments for post ${post.id}:`, comments);
                  // Handle comments here (e.g., display them)
                });
            }}>
              View Comments
            </button>
          </li>
        ))}
      </ul>
      */}
    </div>
  )
}

export default FeedPage



