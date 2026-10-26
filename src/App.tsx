import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from '@/components/Layout'
import CreatePostPage from '@/pages/CreatePostPage'
import PostDetailsPage from '@/pages/PostDetailsPage'
import PostsListPage from '@/pages/PostsListPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PostsListPage />} />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
        </Route>
      </Routes>
      <Toaster
        theme="dark"
        position="bottom-right"
        icons={{ success: <Check className="size-4" /> }}
        style={{ '--width': '460px' } as CSSProperties}
        toastOptions={{ classNames: { icon: 'text-green-400', title: 'text-base font-normal!' } }}
      />
    </BrowserRouter>
  )
}
