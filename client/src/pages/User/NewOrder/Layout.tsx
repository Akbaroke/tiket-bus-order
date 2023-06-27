import * as React from 'react'
import { Stepper } from '@mantine/core'
import Step1 from './Step1'
import Step2 from './Step2'

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

interface ResultFindBus {
  scheduleId: string
  busId: string
  code: string
  price: string
  station_from: string
  name_station_from: string
  city_station_from: string
  station_to: string
  name_station_to: string
  name_city_to: string
  date: string
  time: string
  format: string
  className: string
  seatingCapacity: string
  name_bus_fleet: string
  updated_at: string
}

export default function Layout() {
  const [active, setActive] = React.useState(0)
  const nextStep = () =>
    setActive(current =>
      current < dataStepper.length ? current + 1 : current
    )
  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current))
  const [resultFindBus, setResultFindBus] = React.useState<
    ResultFindBus[]
  >([])

  // const setData = (data: ResultFindBus[]) => {
  //   setResultFindBus(data)
  // }

  const RenderChildren = () => {
    switch (active) {
      case 0:
        return (
          <Step1
            nextStep={nextStep}
            //  setData={setData}
          />
        )
      case 1:
        return <Step2 />
      default:
        break
    }
  }

  return (
    <div className="p-10 flex flex-col gap-10">
      <Stepper iconSize={42} active={active} breakpoint="sm">
        {dataStepper.map((data, index) => (
          <Stepper.Step
            key={index}
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
