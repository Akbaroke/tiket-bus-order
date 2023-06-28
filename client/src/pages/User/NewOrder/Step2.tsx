import * as React from 'react'
import { useDispatch } from 'react-redux'
import CardSchedule from '../../../components/CardSchedule'
import { ResultFindBus } from './Layout'
import {
  resetScheduleSelected,
  setScheduleSelected,
} from '../../../redux/actions/order'
import { resetSeat } from '../../../redux/actions/seat'

type Props = {
  resultFindBus: ResultFindBus[]
  nextStep: () => void
}

export default function Step2({
  resultFindBus,
  nextStep,
}: Props) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(resetScheduleSelected())
    dispatch(resetSeat())
  }, [dispatch])

  return (
    <div>
      <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize m-auto mb-5">
        Select schedule
      </h1>
      <div className="flex flex-wrap gap-[20px] mt-4 sm:justify-start justify-center">
        {resultFindBus.map(item => (
          <div
            onClick={() => {
              nextStep()
              dispatch(
                setScheduleSelected({
                  schedulIdSelected: item.scheduleId,
                })
              )
            }}
            key={item.scheduleId}>
            <CardSchedule data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
