import { useState } from 'react'

export default function Switch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
}) {
  const [value, setValue] = useState<Boolean>(checked)

  const onClick = () => {
    setValue(!value)
    onChange && onChange(!value)
  }

  return (
    <div
      className="switch relative w-12 h-6 rounded-full border-1 border-bcolor cursor-pointer bg-foreground"
      onClick={onClick}>
      <div
        className={`slider absolute top-1/2 ${
          value ? 'left-6' : 'left-0.5'
        } -translate-y-1/2 w-5 h-5 rounded-full border-1 border-bcolor bg-white shadow-md duration-200`}></div>
    </div>
  )
}
