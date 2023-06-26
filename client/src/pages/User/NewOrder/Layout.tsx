import * as React from 'react'
import { Stepper } from '@mantine/core'
import Step1 from './Step1'

const dataStepper = [
  {
    label: 'Step 1',
    description: 'Find bus schedules',
  },
  {
    label: 'Step 2',
    description: 'Find bus schedules',
  },
]

export default function Layout() {
  const [active, setActive] = React.useState(0)
  const nextStep = () =>
    setActive(current =>
      current < dataStepper.length ? current + 1 : current
    )
  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current))

  const RenderChildren = () => {
    switch (active) {
      case 0:
        return <Step1 />
      case 1:
        return <Step1 />
      default:
        break
    }
  }

  return (
    <div className="p-10 flex flex-col gap-10">
      <Stepper iconSize={42} active={active} breakpoint="sm">
        {dataStepper.map(data => (
          <Stepper.Step
            label={data.label}
            description={data.description}
          />
        ))}
      </Stepper>
      <div>
        <RenderChildren />
      </div>
    </div>
  )
}
