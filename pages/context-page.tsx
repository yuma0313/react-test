import Layout from '../components/Layout'
import { StateProvider } from '../context/StateProvider'
import ContextA from '../components/ContextA'
import ContextB from '../components/ContextB'

const ContextPage: React.FC = () => {
  return (
    <Layout title="Context">
      <p className="text-4xl mb-10">Context page</p>
      <StateProvider>
        <ContextA />
        <ContextB />
      </StateProvider>
    </Layout>
  )
}
export default ContextPage
