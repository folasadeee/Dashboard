import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = (props) => {

    const option = {
        indexAxis: 'x',
        elements: {
            bar: {
                borderWidth: 1,
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Horizontal bar chart'
            }
        }
    }

    const data = {
        labels: props.movieNames,
        datasets: [
            {
                label: "Vote Count",
                data: props.movieVoteCounts,
                backgroundColor: "#F87171",
                borderColor: "#B91C1C",
                borderWidth: 1,
            }
        ]
    }

    return (
        <>
            <h2 className="text-center font-bold text-2xl py-5">Now Playing Movies Vote Count</h2>
            <Bar option={option} data={data} />
        </>
    )
}

export default BarGraph;
