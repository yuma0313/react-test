import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import TaskPage from '../pages/task-page'
import { TASK } from '../types/Type'
import 'setimmediate'

const server = setupServer(
  rest.get(
    'https://jsonplaceholder.typicode.com/todos/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'Task A',
            completed: false,
          },
          {
            userId: 2,
            id: 2,
            title: 'Task B',
            completed: true,
          },
        ])
      )
    }
  )
)

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

describe('Todos page / useSWR', () => {
  let staticProps: TASK[]
  staticProps = [
    {
      userId: 3,
      id: 3,
      title: 'Static task C',
      completed: true,
    },
    {
      userId: 4,
      id: 4,
      title: 'Static task D',
      completed: false,
    },
  ]
  it('初期値が設定されて、その後fetchでデータを取得できているかテスト', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskPage staticTasks={staticProps} />
      </SWRConfig>
    )
    expect(await screen.findByText('Static task C')).toBeInTheDocument()
    expect(screen.getByText('Static task D')).toBeInTheDocument()
    //screen.debug()
    expect(await screen.findByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
    //screen.debug()
  })
  it('エラー時のテスト', async () => {
    server.use(
      rest.get(
        'https://jsonplaceholder.typicode.com/todos/',
        (req, res, ctx) => {
          const query = req.url.searchParams
          const _limit = query.get('_limit')
          if (_limit === '10') {
            return res(ctx.status(400))
          }
        }
      )
    )
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskPage staticTasks={staticProps} />
      </SWRConfig>
    )
    expect(await screen.findByText('Error!')).toBeInTheDocument()
  })
})
