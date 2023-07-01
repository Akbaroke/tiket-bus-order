import * as React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import HeaderAdmin from '../../../components/Layouts/HeaderAdmin'
import { MonthPickerInput } from '@mantine/dates'
import { SlCalender } from 'react-icons/sl'
import { dateToEpochMillis } from '../../../utils/timeManipulation'
import axios from '../../../api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Income {
  busFleetId: string
  aramada: string
  income: number
  totalPassengers: number
}

export default function ViewDashboard() {
  const [monthFrom, setMonthFrom] = React.useState<Date | null>(
    null
  )
  const [monthTo, setMonthTo] = React.useState<Date | null>(null)
  const [income, setIncome] = React.useState<Income[]>([])

  React.useEffect(() => {
    const getIncome = async (
      monthFrom: number,
      monthTo: number
    ) => {
      const { data } = await axios.post('/income', {
        date1: monthFrom,
        date2: monthTo,
      })
      if (data.data) {
        setIncome(data.data)
      }
      console.log(data.message)
    }

    if (monthFrom && monthTo) {
      getIncome(
        dateToEpochMillis(monthFrom),
        dateToEpochMillis(monthTo)
      )
    } else {
      getIncome(1672573150, 1701430750)
    }
  }, [monthFrom, monthTo])

  // Mengubah format data ke format yang diperlukan oleh grafik
  const labels = income.map(item => item.aramada)
  const incomeData = income.map(item => item.income)
  const passengersData = income.map(item => item.totalPassengers)

  const data1 = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#ffdd009d',
      },
    ],
  }

  const data2 = {
    labels,
    datasets: [
      {
        label: 'Passengers',
        data: passengersData,
        backgroundColor: '#095BA89d',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Report Grafic Analysis',
      },
    },
  }

  return (
    <div className="p-10">
      <HeaderAdmin title="Dashboard">
        <MonthPickerInput
          icon={<SlCalender />}
          label="Month From"
          placeholder="Jan 2023"
          value={monthFrom}
          onChange={setMonthFrom}
          mx="auto"
          maw={400}
        />
        <MonthPickerInput
          icon={<SlCalender />}
          label="Month To"
          placeholder="Dec 2023"
          value={monthTo}
          onChange={setMonthTo}
          mx="auto"
          maw={400}
        />
      </HeaderAdmin>
      <div className="flex flex-col gap-10">
        <div className="bg-white p-5 rounded-[10px] shadow-md">
          <Bar options={options} data={data1} />
        </div>
        <div className="bg-white p-5 rounded-[10px] shadow-md">
          <Bar options={options} data={data2} />
        </div>
      </div>
    </div>
  )
}
