import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { POST } from '../types/Type'
import Post from '../components/Post'

describe('Postコンポーネント与えられたpropsでテスト', () => {
  let dummyProps: POST
  beforeEach(() => {
    dummyProps = {
      userId: 1,
      id: 1,
      title: 'dummy title 1',
      body: 'dummy title 2',
    }
  })
  it('与えられたダミーpropsを遷移先で表示できているか', () => {
    //コンポーネントを呼び出す形式でrender指定
    render(<Post {...dummyProps} />)
    //dummypropsのid,titleが表示されるかexpectでテストする
    expect(screen.getByText(dummyProps.id)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.title)).toBeInTheDocument()
  })
})
