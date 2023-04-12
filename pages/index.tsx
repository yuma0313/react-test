import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../components/Layout'
import { getAllPostsData } from '../lib/fetch'
import { POST } from '../types/types'
import Cookie from 'universal-cookie'

const cookie = new Cookie()

interface STATICPROPS {
  posts: POST[]
}

const BlogPage: React.FC<STATICPROPS> = ({ posts }) => {
  const [hasToken, setHasToken] = useState(false)

  //ログアウトするときにCookieを削除し、setHasTokenをfalseにする
  const logout = () => {
    cookie.remove('access_token')
    setHasToken(false)
  }

  //ログイン中のユーザーのみゴミ箱ボタンをクリックした際にブログを削除できる関数
  const deletePost = async (id: number) => {
    alert('削除してよろしいですか？')
    await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/delete-blog/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `JWT ${cookie.get('access_token')}`,
      },
    }).then((res) => {
      //削除できなかった場合の処理
      if (res.status === 401) {
        alert('JWT Token not valid')
      }
    })
  }

  //ページがマウントされたときにCookieが存在するかしないかの評価する
  useEffect(() => {
    console.log(cookie)
    if (cookie.get('access_token')) {
      setHasToken(true)
    }
  }, [])

  return (
    <Layout title="Blog">
      <p className="text-4xl mb-10">blog page</p>
      <ul>
        {posts &&
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <a className="cursor-pointer border-b border-gray-500 hover:bg-gray-300">
                  {post.title}
                </a>
              </Link>
              {/* ログイン中のユーザーがいるときのみゴミ箱ボタン表示（hasTokenがtrueのとき） */}
              {hasToken && (
                <svg
                  onClick={() => deletePost(post.id)}
                  data-testid={`btn-${post.id}`}
                  className="w-6 h-6 ml-10 float-right cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </li>
          ))}
      </ul>
    </Layout>
  )
}
export default BlogPage

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPostsData()
  return {
    props: { posts },
    //ISRを有効化し、新たなブログ投稿時に静的にHTMLを生成する(3秒に一回)
    revalidate: 3,
  }
}
