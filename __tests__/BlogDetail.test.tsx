import { render, screen, cleanup, findByText } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import 'setimmediate'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers()

const handlers = [
  rest.get(
    'https://jsonplaceholder.typicode.com/posts/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'dummy title 1',
            body: 'dummy body 1',
          },
          {
            userId: 2,
            id: 2,
            title: 'dummy title 2',
            body: 'dummy body 2',
          },
        ])
      )
    }
  ),
  rest.get('https://jsonplaceholder.typicode.com/posts/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        id: 1,
        title: 'dummy title 1',
        body: 'dummy body 1',
      })
    )
  }),
  rest.get('https://jsonplaceholder.typicode.com/posts/2', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 2,
        id: 2,
        title: 'dummy title 2',
        body: 'dummy body 2',
      })
    )
  }),
]

//モック用サーバーの起動と停止、各テストケースが終わった後にリセットをかける
const server = setupServer(...handlers)
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  server.close()
})

describe(`Blog detail page`, () => {
  it('id:1のブログ詳細ページへ遷移する際のテスト', async () => {
    const { page } = await getPage({
      route: '/posts/1',
    })
    render(page)
    expect(await screen.findByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy body 1')).toBeInTheDocument()
  })
  it('id:2のブログ詳細ページへ遷移する際のテスト', async () => {
    const { page } = await getPage({
      route: '/posts/2',
    })
    render(page)
    expect(await screen.findByText('dummy title 2')).toBeInTheDocument()
    expect(screen.getByText('dummy body 2')).toBeInTheDocument()
  })
  it('ブログ詳細ページから一覧ページへ遷移する際のテスト', async () => {
    const { page } = await getPage({
      route: '/posts/2',
    })
    render(page)
    await screen.findByText('dummy title 2')
    userEvent.click(screen.getByTestId('back-blog'))
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
  })
})
