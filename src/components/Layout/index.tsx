import Header from './header/header'
import Sider from './sider/sider'
import Content from './content/content'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="fixed flex flex-col w-screen h-screen">
      <Header />
      <div className="relative flex flex-1 h-0">
        <Sider></Sider>
        <Content>{children}</Content>
      </div>
    </main>
  )
}
