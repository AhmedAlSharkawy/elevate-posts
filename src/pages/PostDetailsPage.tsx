import axios from 'axios'
import { ArrowLeft, Calendar, Loader2, User as UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, type Post, type User } from '@/lib/api'

// JSONPlaceholder posts have no publication date.
// This static placeholder only reproduces the Figma mockup — replace it when real dates exist.
const PLACEHOLDER_DATE = 'Sun, August 24th, 2025'

function BackButton() {
  return (
    <Link
      to="/"
      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-2.5 text-sm font-medium text-neutral-900 hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
    >
      <ArrowLeft className="size-4" />
      Back to Posts
    </Link>
  )
}

export default function PostDetailsPage() {
  const { id } = useParams()

  const [post, setPost] = useState<Post | null>(null)
  const [author, setAuthor] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPost() {
      try {
        const postResponse = await api.get<Post>(`/posts/${id}`)
        setPost(postResponse.data)

        // A missing author should not break the page, so it has its own try/catch
        try {
          const userResponse = await api.get<User>(`/users/${postResponse.data.userId}`)
          setAuthor(userResponse.data)
        } catch {
          setAuthor(null)
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Post not found.')
        } else {
          setError('Failed to load the post. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [id])

  if (isLoading || error || !post) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-xl bg-white/70 p-6 text-center backdrop-blur-sm">
        {isLoading ? (
          <p className="flex items-center gap-2 text-neutral-500">
            <Loader2 className="size-5 animate-spin" />
            Loading post...
          </p>
        ) : (
          <>
            <p className="text-red-600">{error || 'Post not found.'}</p>
            <BackButton />
          </>
        )}
      </section>
    )
  }

  return (
    <article className="overflow-hidden rounded-xl shadow-sm">
      <header className="flex min-h-64 flex-col justify-end gap-4 bg-linear-to-b from-[#3f5974]/80 to-[#5386b5]/80 px-6 pt-16 pb-6 text-white backdrop-blur-md sm:min-h-100">
        <BackButton />

        <h1 className="text-2xl leading-snug font-bold wrap-anywhere sm:text-4xl">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <UserIcon className="size-4" />
            {author?.name ?? 'Unknown author'}
          </span>
          <span className="flex items-center gap-1.5" title="Placeholder date — the API has no publication date">
            <Calendar className="size-4" />
            {PLACEHOLDER_DATE}
          </span>
        </div>
      </header>

      <div className="min-h-80 bg-white/75 px-6 py-8 leading-snug whitespace-pre-line wrap-anywhere backdrop-blur-xl sm:min-h-120 sm:text-lg">
        {post.body}
      </div>
    </article>
  )
}
