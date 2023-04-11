import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { SWRConfig, Cache } from 'swr'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import CommentPage from '../pages/comment-page'

const server = setupServer(
  rest.get(
    'https://jsonplaceholder.typicode.com/comments/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            postId: 1,
            id: 1,
            name: 'A',
            email: 'dummya@gmail.com',
            body: 'test body 1',
          },
          {
            postId: 2,
            id: 2,
            name: 'B',
            email: 'dummyb@gmail.com',
            body: 'test body 2',
          },
        ])
      )
    }
  )
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())

describe('Common page with SWR / Success+Error', () => {
  it('useSWRによってフェッチされた値が正しく表示、遷移できている', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    )
    expect(await screen.findByText('1 : test body 1')).toBeInTheDocument()
    expect(screen.getByText('2 : test body 2')).toBeInTheDocument()
  })
  it('useSWRによってフェッチされた値がエラー時のテスト', async () => {
    server.use(
      rest.get(
        'https://jsonplaceholder.typicode.com/comments/?_limit=10',
        (req, res, ctx) => {
          return res(ctx.status(400))
        }
      )
    )
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    )
    expect(await screen.findByText('Error!')).toBeInTheDocument()
  })
})
