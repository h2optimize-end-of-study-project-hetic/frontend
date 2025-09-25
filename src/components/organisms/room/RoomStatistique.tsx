import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAuthHeaders } from "../../../hooks/useAuthHeader";

const RoomStatistique = () => {
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchRoomsStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/data/rooms?smooth_interval_minutes=60`,
          { headers }
        );
        if (!res.ok) throw new Error("Erreur lors de la récupération des stats");
        const json = await res.json();
        setRoomsData(json.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoomsStats();
  }, [headers]);

  const buildChartOptions = (
    title: string,
    unit: string,
    series: { name: string; data: [number, number][] }[]
  ) => ({
    chart: { type: "line", height: 400 },
    title: { text: title },
    xAxis: { type: "datetime", title: { text: "Temps" } },
    yAxis: { title: { text: unit } },
    tooltip: {
      shared: true,
      xDateFormat: "%Y-%m-%d %H:%M",
      pointFormat: `<span style="color:{series.color}">●</span> {series.name}: <b>{point.y:.2f} ${unit}</b><br/>`,
    },
    series,
  });

  // Construire les séries pour chaque type de capteur
  const temperatureSeries = roomsData
    .filter((room) => room.temperature?.data?.length)
    .map((room) => ({
      name: room.name,
      data: room.temperature.data as [number, number][],
    }));

  const humiditySeries = roomsData
    .filter((room) => room.humidity?.data?.length)
    .map((room) => ({
      name: room.name,
      data: room.humidity.data as [number, number][],
    }));

  const pressureSeries = roomsData
    .filter((room) => room.pressure?.data?.length)
    .map((room) => ({
      name: room.name,
      data: room.pressure.data as [number, number][],
    }));

  return (
    <div>
      {roomsData.length > 0 ? (
        <>
          <HighchartsReact
            highcharts={Highcharts}
            options={buildChartOptions("Température", "°C", temperatureSeries)}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={buildChartOptions("Humidité", "%", humiditySeries)}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={buildChartOptions("Pression", "hPa", pressureSeries)}
          />
        </>
      ) : (
        <p>Aucune donnée disponible...</p>
      )}
    </div>
  );
};

export default RoomStatistique;
