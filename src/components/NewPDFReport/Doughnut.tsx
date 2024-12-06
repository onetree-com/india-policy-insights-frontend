import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut as DoughnutChart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { generateCanvasURL } from "utils/generate-canvas-url";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Props {
  id: string;
  setImage: Dispatch<SetStateAction<string>>;
  dataNum: number[];
  backgroundColor: string[];
}

const Doughnut: FC<Props> = ({ id, setImage, dataNum, backgroundColor }) => {
  const { t, i18n } = useTranslation();
  const data: any = {
    labels: [dataNum],
    datasets: [
      {
        label: "# of Votes",
        data: dataNum,
        backgroundColor,
        borderColor: [
          "transparent",
          "transparent",
          "transparent",
          "transparent",
        ],
        borderWidth: 1,
        datalabels: {
          align: "end",
          anchor: "end",
        },
      },
    ],
    showDatapoints: true,
  };

  const options: any = {
    layout: {
      padding: "20",
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const datalabels = {
    id: "datalabels",
    color: "#000",
    align: "end",
    anchor: "end",
    formatter: function (value: any, context: any) {
      return context.chart.data.labels[context.dataIndex];
    },
    font: {
      size: 16,
      style: "bold",
    },
  };
  const textCenter = {
    id: "textCenter",
    beforeDatasetDraw(chart: { getDatasetMeta?: any; ctx?: any; data?: any }) {
      const { ctx, data } = chart;
      ctx.save();
      ctx.font = "bolder 5px";
      ctx.fillStyle = "#8F8F8F";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `${data.datasets[0].data.reduce(
          (partialSum: number, a: number) => partialSum + a,
          0
        )}`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y - 7
      );
      ctx.fillText(
        t("indicators"),
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y + 7
      );
    },
  };

  useEffect(() => {
    setTimeout(() => {
      generateCanvasURL(id, { height: 180, width: 180 }).then((result) =>
        setImage(String(result))
      );
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dataNum), i18n.language]);

  return (
    <DoughnutChart
      id={id}
      data={data}
      options={options}
      plugins={[textCenter, datalabels]}
    />
  );
};

export default Doughnut;
