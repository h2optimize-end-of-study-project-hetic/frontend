// Imports des icônes
import sunny from "/src/assets/weather_icons/sunny.svg";
import clearing from "/src/assets/weather_icons/clearing.svg";
import cloudy from "/src/assets/weather_icons/cloudy.svg";
import fog from "/src/assets/weather_icons/fog.svg";
import rain from "/src/assets/weather_icons/rain.svg";
import showerRain from "/src/assets/weather_icons/shower_rain.svg";
import snow from "/src/assets/weather_icons/snow.svg";
import thunder from "/src/assets/weather_icons/thunder.svg";

// Map des descriptions vers les icônes
export const weatherIconMap: Record<string, string> = {
  "ciel dégagé": sunny,
  ensoleillé: sunny,
  "peu nuageux": clearing,
  "partiellement nuageux": clearing,
  nuageux: cloudy,
  couvert: cloudy,
  brume: fog,
  brouillard: fog,
  pluie: rain,
  "pluie légère": rain,
  averses: showerRain,
  "fortes averses": showerRain,
  neige: snow,
  "chute de neige": snow,
  orage: thunder,
  "orage avec pluie": thunder,
};

// Fonction pour récupérer l'icône
export function getWeatherIcon(description: string): string {
  const desc = description.toLowerCase();
  return weatherIconMap[desc] ?? cloudy; // fallback
}
