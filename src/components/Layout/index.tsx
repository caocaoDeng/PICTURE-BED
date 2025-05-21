import Header from './header'
import Sider from './sider'
import Content from './main'

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
