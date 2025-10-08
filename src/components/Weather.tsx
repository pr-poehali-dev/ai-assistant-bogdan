import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  description: string;
  humidity: number;
  wind_speed: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

export default function Weather() {
  const { toast } = useToast();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = '895284fb2d2c50a520ea537456963d9c';

  const handleGetWeather = async () => {
    if (!city.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название города',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Город не найден');
      }

      const weatherData = await weatherResponse.json();
      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        temp: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        wind_speed: Math.round(weatherData.wind.speed),
        icon: weatherData.weather[0].icon,
      });

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        const dailyForecasts: ForecastDay[] = [];
        const processedDates = new Set<string>();

        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateStr = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
          
          if (!processedDates.has(dateStr) && dailyForecasts.length < 7) {
            processedDates.add(dateStr);
            dailyForecasts.push({
              date: dateStr,
              temp_min: Math.round(item.main.temp_min),
              temp_max: Math.round(item.main.temp_max),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            });
          }
        });
        
        setForecast(dailyForecasts);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось получить погоду',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      '01d': 'Sun',
      '01n': 'Moon',
      '02d': 'CloudSun',
      '02n': 'CloudMoon',
      '03d': 'Cloud',
      '03n': 'Cloud',
      '04d': 'Cloudy',
      '04n': 'Cloudy',
      '09d': 'CloudRain',
      '09n': 'CloudRain',
      '10d': 'CloudRain',
      '10n': 'CloudRain',
      '11d': 'CloudLightning',
      '11n': 'CloudLightning',
      '13d': 'CloudSnow',
      '13n': 'CloudSnow',
      '50d': 'CloudFog',
      '50n': 'CloudFog',
    };
    return iconMap[iconCode] || 'Cloud';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Icon name="CloudSun" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Погода</h1>
            <p className="text-slate-600">Актуальная информация о погоде в любом городе мира</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGetWeather()}
            placeholder="Введите название города..."
            className="h-14 text-lg"
          />
          <Button
            onClick={handleGetWeather}
            disabled={isLoading}
            className="h-14 px-8 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Search" size={20} />
                Узнать погоду
              </>
            )}
          </Button>
        </div>

        {weather && (
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-1">
                  {weather.city}, {weather.country}
                </h2>
                <p className="text-lg text-slate-600 capitalize">{weather.description}</p>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/50 flex items-center justify-center">
                <Icon name={getWeatherIcon(weather.icon) as any} size={48} className="text-blue-600" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-4 bg-white/70 border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Icon name="Thermometer" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Температура</p>
                    <p className="text-2xl font-bold text-slate-800">{weather.temp}°C</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/70 border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <Icon name="Thermometer" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Ощущается</p>
                    <p className="text-2xl font-bold text-slate-800">{weather.feels_like}°C</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/70 border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Icon name="Droplets" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Влажность</p>
                    <p className="text-2xl font-bold text-slate-800">{weather.humidity}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/70 border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                    <Icon name="Wind" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Ветер</p>
                    <p className="text-2xl font-bold text-slate-800">{weather.wind_speed} м/с</p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        )}

        {forecast.length > 0 && (
          <Card className="p-6 bg-white/70 border-0 mt-6">
            <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="Calendar" size={24} className="text-blue-600" />
              Прогноз на неделю
            </h3>
            <div className="grid grid-cols-7 gap-3">
              {forecast.map((day, index) => (
                <Card key={index} className="p-3 bg-white border-blue-100 hover:border-blue-300 transition-all">
                  <p className="text-xs font-semibold text-slate-600 mb-2 text-center">{day.date}</p>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
                    <Icon name={getWeatherIcon(day.icon) as any} size={28} className="text-blue-600" />
                  </div>
                  <p className="text-center">
                    <span className="text-lg font-bold text-orange-600">{day.temp_max}°</span>
                    <span className="text-sm text-slate-400 mx-1">/</span>
                    <span className="text-sm font-semibold text-cyan-600">{day.temp_min}°</span>
                  </p>
                  <p className="text-xs text-slate-500 text-center mt-1 truncate capitalize">{day.description}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-blue-600" />
          Информация
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Актуальная погода для любого города мира</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Прогноз погоды на 7 дней вперед</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Температура, ощущения, влажность, скорость ветра</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Описание погодных условий на русском языке</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Минимальная и максимальная температура на каждый день</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}