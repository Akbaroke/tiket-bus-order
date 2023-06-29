import * as React from 'react'
import { Accordion, Stepper } from '@mantine/core'
import Step1 from './Step1'
import Step2 from './Step2'
import { BsBarChartSteps, BsSearch } from 'react-icons/bs'
import { BiSelectMultiple } from 'react-icons/bi'
import { CgDetailsMore } from 'react-icons/cg'
import { FaWpforms } from 'react-icons/fa'
import { MdEventSeat } from 'react-icons/md'
import Step3 from './Step3'
import Step4 from './Step4'
import { Schedules } from '../../../contexts/swr-context'
import Step5 from './Step5'

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

export default function Layout() {
  const [active, setActive] = React.useState(0)
  const [resultFindBus, setResultFindBus] = React.useState<
    Schedules[]
  >([])

  const nextStep = () =>
    setActive(current =>
      current < dataStepper.length ? current + 1 : current
    )
  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current))

  const setData = (data: Schedules[]) => {
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
      case 4:
        return <Step5 prevStep={prevStep} />
      default:
        break
    }
  }

  const RenderStepper = ({
    breakpoint,
    className,
  }: {
    breakpoint: 'sm' | 'lg'
    className?: string
  }) => (
    <Stepper
      className={className}
      iconSize={42}
      active={active}
      breakpoint={breakpoint}
      onStepClick={setActive}
      allowNextStepsSelect={false}>
      {dataStepper.map((data, index) => (
        <Stepper.Step
          key={index}
          icon={data.icon}
          description={data.description}
        />
      ))}
    </Stepper>
  )
  return (
    <div className="lg:p-10 p-5 flex flex-col lg:gap-10 gap-3">
      <Accordion
        variant="contained"
        className="lg:hidden bg-white">
        <Accordion.Item value="steps">
          <Accordion.Control>
            <div className="flex gap-2 items-center text-gray-500">
              <BsBarChartSteps />
              <p className="text-sm font-semibold">
                Steps Order
              </p>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <RenderStepper breakpoint="lg" />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <RenderStepper
        breakpoint="sm"
        className="hidden lg:block bg-white p-5 rounded-[10px] shadow-md"
      />
      <div>
        <RenderChildren />
      </div>
    </div>
  )
}
