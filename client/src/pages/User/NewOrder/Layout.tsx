import * as React from 'react'
import { Accordion, Stepper } from '@mantine/core'
import Step1 from './Step1'
import Step2 from './Step2'
import { BsSearch } from 'react-icons/bs'
import { BiSelectMultiple } from 'react-icons/bi'
import { CgDetailsMore } from 'react-icons/cg'
import { FaWpforms } from 'react-icons/fa'
import { MdEventSeat } from 'react-icons/md'
import Step3 from './Step3'
import Step4 from './Step4'

const dataStepper = [
  {
    label: 'Step 1',
    icon: <BsSearch />,
    description: 'Find schedules',
  },
  {
    label: 'Step 2',
    icon: <BiSelectMultiple />,
    description: 'Select schedules',
  },
  {
    label: 'Step 3',
    icon: <CgDetailsMore />,
    description: 'Detail schedules',
  },
  {
    label: 'Step 4',
    icon: <MdEventSeat />,
    description: 'Select seat',
  },
  {
    label: 'Step 5',
    icon: <FaWpforms />,
    description: 'Form Order',
  },
]

export interface ResultFindBus {
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
  const [resultFindBus, setResultFindBus] = React.useState<
    ResultFindBus[]
  >([])

  React.useEffect(() => {
    console.log(resultFindBus)
  }, [resultFindBus])

  const nextStep = () =>
    setActive(current =>
      current < dataStepper.length ? current + 1 : current
    )
  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current))

  const setData = (data: ResultFindBus[]) => {
    setResultFindBus(data)
  }

  const RenderChildren = () => {
    switch (active) {
      case 0:
        return <Step1 nextStep={nextStep} setData={setData} />
      case 1:
        return (
          <Step2
            resultFindBus={resultFindBus}
            nextStep={nextStep}
          />
        )
      case 2:
        return <Step3 nextStep={nextStep} prevStep={prevStep} />
      case 3:
        return <Step4 nextStep={nextStep} />
      default:
        break
    }
  }

  return (
    <div className="sm:p-10 p-5 flex flex-col sm:gap-10 gap-3">
      <Accordion variant="separated" className="sm:hidden">
        <Accordion.Item value="customization">
          <Accordion.Control>
            <p className="text-sm font-semibold">Steps Order</p>
          </Accordion.Control>
          <Accordion.Panel>
            <Stepper
              iconSize={42}
              active={active}
              breakpoint="sm"
              onStepClick={setActive}
              allowNextStepsSelect={false}>
              {dataStepper.map((data, index) => (
                <Stepper.Step
                  key={index}
                  label={data.label}
                  icon={data.icon}
                  description={data.description}
                />
              ))}
            </Stepper>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Stepper
        className="hidden sm:block"
        iconSize={42}
        active={active}
        breakpoint="sm"
        onStepClick={setActive}
        allowNextStepsSelect={false}>
        {dataStepper.map((data, index) => (
          <Stepper.Step
            key={index}
            label={data.label}
            icon={data.icon}
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
