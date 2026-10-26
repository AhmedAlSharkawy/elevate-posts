import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Info, Loader2, NotebookPen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api, type Post, type User } from '@/lib/api'

// .trim() runs before .min(1), so whitespace-only values are rejected
const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Post title is required'),
  body: z.string().trim().min(1, 'Post body is required'),
  userId: z.string().min(1, 'Please select an author for this post'),
})

type CreatePostForm = z.infer<typeof createPostSchema>

const fieldClassName =
  'h-12 rounded-lg border-none bg-neutral-200 px-4 text-base shadow-none placeholder:text-neutral-500 aria-invalid:ring-0 md:text-base'

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
      <Info className="size-4 shrink-0" />
      {message}
    </p>
  )
}

function getSubmitErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 500) return 'Internal Server Error'
    if (error.response) return `Request failed with status ${error.response.status}. Please try again.`
    return 'Network error. Please check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}

export default function CreatePostPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: '', body: '', userId: '' },
  })

  function loadUsers() {
    api
      .get<User[]>('/users')
      .then((response) => {
        if (!Array.isArray(response.data)) throw new Error('Unexpected response')
        setUsers(response.data)
      })
      .catch(() => setUsersError('Failed to load authors.'))
      .finally(() => setIsLoadingUsers(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function handleRetryUsers() {
    setIsLoadingUsers(true)
    setUsersError('')
    loadUsers()
  }

  async function onSubmit(values: CreatePostForm) {
    setSubmitError('')
    try {
      await api.post<Post>('/posts', {
        title: values.title,
        body: values.body,
        userId: Number(values.userId),
      })
      toast.success('A new post has been successfully created!')
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error))
    }
  }

  const canSubmit = !isSubmitting && !isLoadingUsers && users.length > 0

  return (
    <section className="overflow-hidden rounded-xl shadow-sm">
      <div className="flex items-center gap-2 bg-white px-4 py-4">
        <NotebookPen className="size-6" />
        <h2 className="text-xl font-semibold">Create a New Post</h2>
      </div>

      <div className="bg-white/60 p-4 backdrop-blur-sm sm:p-6">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6 rounded-xl bg-white p-6 lg:min-h-197 lg:w-[74%]"
        >
          <div>
            <label htmlFor="title" className="mb-2 block font-semibold">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter post title"
              aria-invalid={!!errors.title}
              className={fieldClassName}
              {...register('title')}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <label htmlFor="body" className="mb-2 block font-semibold">
              Body
            </label>
            <Textarea
              id="body"
              placeholder="Enter post body"
              aria-invalid={!!errors.body}
              className={`${fieldClassName} field-sizing-fixed h-32 resize-none py-3`}
              {...register('body')}
            />
            <FieldError message={errors.body?.message} />
          </div>

          <div>
            <label htmlFor="userId" className="mb-2 block font-semibold">
              Author
            </label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingUsers || !!usersError}>
                  <SelectTrigger
                    id="userId"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={!!errors.userId}
                    className={`${fieldClassName} w-full data-[size=default]:h-12`}
                  >
                    <SelectValue placeholder={isLoadingUsers ? 'Loading authors...' : 'Select Author'} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.userId?.message} />

            {usersError && (
              <p className="mt-2 flex items-center gap-2 text-xs text-red-700">
                {usersError}
                <button type="button" onClick={handleRetryUsers} className="font-semibold underline">
                  Retry
                </button>
              </p>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-700 bg-red-50 px-4 py-2 text-center text-sm text-red-700"
            >
              <Info className="size-4 shrink-0" />
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 self-end rounded-lg bg-neutral-800 text-base text-white hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </section>
  )
}
