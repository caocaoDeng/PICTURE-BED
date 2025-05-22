export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex-1 p-5 overflow-y-auto overflow-x-hidden"
      style={{
        backgroundImage: `repeating-linear-gradient(315deg, #0307120d 0, #0307120d 1px, transparent 0, transparent 15px),
          repeating-linear-gradient(225deg, #0307120d 0, #0307120d 1px, transparent 0, transparent 15px)`,
      }}>
      {children}
    </div>
  )
}
