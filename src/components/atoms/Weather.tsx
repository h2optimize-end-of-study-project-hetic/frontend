import { useWeathers } from "../../hooks/useWeather";
import { getWeatherIcon } from "../../utils/weatherIcons";
import { useAtomValue } from "jotai";
import { locationAtom } from "./locationAtom";

const Weather = () => {
  const location = useAtomValue(locationAtom);
  const { weather, loading, error } = useWeathers(
    location?.city ?? null,
    location?.country ?? null
  );

  if (loading) return <p>Chargement météo...</p>;
  if (error) return <p>Erreur météo: {error}</p>;

  if (!weather) return null;

  const icon = getWeatherIcon(weather.description);

  return (
    <div className="bg-(--light-blue) rounded-2xl !p-2.5 ">
      <p className="text-xs">{weather?.city}</p>
      <div className="flex flex-row items-center gap-2">
        <img src={icon} alt={weather.description} className="w-6 h-6" />
        <p className="font-bold text-lg">{Math.round(weather.temp)}°C</p>
      </div>
    </div>
  );
};

export default Weather;
