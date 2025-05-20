export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 p-5 overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  )
}
