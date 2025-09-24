export const weatherIconMap: Record<string, string> = {
  "ciel dégagé": "/src/assets/weather_icons/sunny.svg",
  ensoleillé: "/src/assets/weather_icons/sunny.svg",
  "peu nuageux": "/src/assets/weather_icons/clearing.svg",
  "partiellement nuageux": "/src/assets/weather_icons/clearing.svg",
  nuageux: "/src/assets/weather_icons/cloudy.svg",
  couvert: "/src/assets/weather_icons/cloudy.svg",
  brume: "/src/assets/weather_icons/fog.svg",
  brouillard: "/src/assets/weather_icons/fog.svg",
  pluie: "/src/assets/weather_icons/rain.svg",
  "pluie légère": "/src/assets/weather_icons/rain.svg",
  averses: "/src/assets/weather_icons/shower_rain.svg",
  "fortes averses": "/src/assets/weather_icons/shower_rain.svg",
  neige: "/src/assets/weather_icons/snow.svg",
  "chute de neige": "/src/assets/weather_icons/snow.svg",
  orage: "/src/assets/weather_icons/thunder.svg",
  "orage avec pluie": "/src/assets/weather_icons/thunder.svg",
};

export function getWeatherIcon(description: string): string {
  const desc = description.toLowerCase();
  return (
    weatherIconMap[desc] ?? "/src/assets/weather_icons/cloudy.svg" // fallback
  );
}
