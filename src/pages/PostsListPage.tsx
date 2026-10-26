import { Loader2, Plus, ScrollText, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api, type Post, type User } from '@/lib/api'

const POSTS_PER_PAGE = 10

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [usersError, setUsersError] = useState(false)

  const [search, setSearch] = useState('')
  const [authorId, setAuthorId] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    api
      .get<Post[]>('/posts')
      .then((response) => setPosts(response.data))
      .catch(() => setError('Failed to load posts. Please try again later.'))
      .finally(() => setIsLoading(false))

    // Users only power the author filter, so a failure here should not hide the posts
    api
      .get<User[]>('/users')
      .then((response) => setUsers(response.data))
      .catch(() => setUsersError(true))
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.trim().toLowerCase())
    const matchesAuthor = authorId === 'all' || post.userId === Number(authorId)
    return matchesSearch && matchesAuthor
  })

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const visiblePosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleAuthorChange(value: string) {
    setAuthorId(value)
    setPage(1)
  }

  return (
    <section className="overflow-hidden rounded-xl shadow-sm">
      <div className="flex items-center justify-between gap-4 bg-white px-4 py-4.5">
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <ScrollText className="size-6" />
          Post List
        </h2>
        <Link
          to="/posts/new"
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 sm:text-base"
        >
          <Plus className="size-4" />
          Create a new post
        </Link>
      </div>

      <div className="flex flex-col gap-3 border-y border-neutral-300 bg-neutral-300/85 px-4 py-4.5 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-600" />
          <Input
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search for a post..."
            aria-label="Search posts by title"
            className="h-13 rounded-full border-none bg-white pl-11 shadow-none md:text-base"
          />
        </div>

        <div className="flex items-center gap-2 sm:ml-8">
          <span className="text-neutral-700">Author:</span>
          <Select value={authorId} onValueChange={handleAuthorChange} disabled={usersError}>
            <SelectTrigger
              aria-label={usersError ? 'Filter by author (authors could not be loaded)' : 'Filter by author'}
              title={usersError ? 'Authors could not be loaded' : undefined}
              className="flex-1 border-none bg-white text-base shadow-none data-[size=default]:h-13 sm:w-40 sm:flex-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <p className="flex items-center justify-center gap-2 bg-white/70 py-16 text-neutral-500">
          <Loader2 className="size-5 animate-spin" />
          Loading posts...
        </p>
      )}

      {error && <p className="bg-white/70 py-16 text-center text-red-600">{error}</p>}

      {!isLoading && !error && visiblePosts.length === 0 && (
        <p className="bg-white/70 py-16 text-center text-neutral-500">No posts found.</p>
      )}

      {visiblePosts.length > 0 && (
        <ul className="backdrop-blur-sm">
          {visiblePosts.map((post) => (
            <li key={post.id} className="border-b border-neutral-300 last:border-b-0">
              <Link
                to={`/posts/${post.id}`}
                className="flex min-h-14 items-center bg-white/75 px-4 py-3 hover:bg-white/90 focus-visible:bg-white/90 focus-visible:outline-none"
              >
                <span className="text-sm font-medium sm:text-base">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-white px-4 py-6">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  )
}
