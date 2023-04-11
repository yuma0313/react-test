import Layout from '../components/Layout'
import { GetStaticProps } from 'next'
import { getAllTasksData } from '../lib/fetch'
import useSWR from 'swr'
import axios from 'axios'
import { TASK } from '../types/Type'

interface STAICPROPS {
  staticTasks: TASK[]
}

const axiosFetcher = async () => {
  const result = await axios.get<TASK[]>(
    'https://jsonplaceholder.typicode.com/todos/?_limit=10'
  )
  return result.data
}

const TaskPage: React.FC<STAICPROPS> = ({ staticTasks }) => {
  const { data: tasks, error } = useSWR('todoFetch', axiosFetcher, {
    //初期値の設定
    fallbackData: staticTasks,
    //trueにすることでマウント時に最新データを取得する
    revalidateOnMount: true,
  })

  if (error) return <span>Error!</span>
  return (
    <Layout title="Todos">
      <p className="mb-10 text-4xl">todos page</p>
      <ul>
        {tasks &&
          tasks.map((task) => (
            <li key={task.id}>
              {task.id}
              {': '}
              <span>{task.title}</span>
            </li>
          ))}
      </ul>
    </Layout>
  )
}
export default TaskPage

export const getStaticProps: GetStaticProps = async () => {
  const staticTasks = await getAllTasksData()
  return {
    props: { staticTasks },
  }
}
