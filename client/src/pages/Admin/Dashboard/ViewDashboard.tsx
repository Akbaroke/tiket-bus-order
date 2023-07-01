// import * as React from 'react'
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function ViewDashboard() {
  return (
    <div className="p-10">
      <HeaderAdmin title="Dashboard" />
      <div className="bg-white p-5 rounded-[10px] shadow-md">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
}

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
]

const data = {
  labels,
  datasets: [
    {
      label: 'Penumpang',
      data: 'tes',
      backgroundColor: '#000000',
    },
    {
      label: 'Pendapatan',
      data: 'tes',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}
