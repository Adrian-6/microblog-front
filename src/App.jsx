import Register from './features/users/Register'
import { Routes, Route } from 'react-router-dom'
import Layout from './assets/Layout'
import RequireAuth from './features/auth/RequireAuth'
import PersistLogin from './features/auth/PersistLogin'
import PostsList from './features/posts/PostsList'
import Feed from './features/posts/Feed'
import User from './features/users/User'
import Welcome from './assets/Welcome'
import SinglePost from './features/posts/SinglePost'
import Login from './features/auth/Login'
import NewPostForm from './features/posts/NewPostForm'
import PageNotFound from './assets/PageNotFound'
function App() {

  return (
    <Routes>

      {/* public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google" element={<Welcome />} />
      <Route path="/register" element={<Register />} />

      {/* protected routes */}

      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
          <Route index element={<PostsList />} />
            <Route path="users">
              <Route path=":email">
                <Route index element={<User />} />
              </Route>
            </Route>
            <Route path="posts">
              <Route index element={<PostsList />} />
              <Route path="page/:page" element={<PostsList />} />
              <Route path=":id">
                <Route index element={<SinglePost />} />
              </Route>
              <Route path="new" element={<NewPostForm />} />
            </Route>
            <Route path="feed" element={<Feed />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
