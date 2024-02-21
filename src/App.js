import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
function App() {
  const [city,setCity]=useState('');
  const [isCorrect,setCorrect]=useState(false)
  const [weather,setWeather]=useState(null)
  const [coordinate,setCoordinate]=useState({
    long:null,
    lat:null
  })

  useEffect(()=>{
    navigator && navigator.geolocation.getCurrentPosition(position=>{
      setCoordinate({
        long:position.coords.longitude,
        lat:position.coords.latitude
      })
    })
  },[])

  useEffect(()=>{
    console.log(coordinate)
    const params={
      lat: coordinate.lat,
      lon: coordinate.long,
      units:'metric',
      appid: process.env.REACT_APP_APPID,
    }
    let url='https://api.openweathermap.org/data/2.5/weather'
    coordinate.lat &&  axios.get(url,{params}).then(response=>{
      console.log(response.data)
      setWeather(response.data)
    })
  },[coordinate])

  const handleSubmit=e =>{
    e.preventDefault();
    const params={
      q:encodeURIComponent(city),
      appid:process.env.REACT_APP_APPID,
      units:'metric'
    }
    let url='https://api.openweathermap.org/data/2.5/weather'
    city && axios.get(url,{params}).then(res=> {setWeather(res.data);setCorrect(false)}).catch(error => {
      if (error.response && error.response.status === 404) {
        setCorrect(true)
        console.clear()
      }
    });
  }
  const handleCity=({target})=>{
    setCity(target.value)
  }
  return (
    <div>{
      weather && (
    <div style={{background:`url(https://source.unsplash.com/random/900×700/?${weather.weather[0].main})`,backgroundSize:'cover',backgroundPosition:'center'}}>
      <div className="weather-app flex max-md:flex-col text-shadow min-h-screen">
        <div className="flex flex-col w-2/3 max-md:w-full min-h-screen max-md:min-h-[250px] p-12 justify-between">
            <h3 className="capitalize">weather with me</h3>
            <div className='flex items-start gap-2'>
                <h1 className="text-8xl max-lg:text-6xl max-sm:text-4xl">{weather.main.temp}&#176; C</h1>
                <sup className='text-sm'>{weather.sys.country}</sup>
                <div className="city-time">
                    <h1 className="text-4xl max-sm:text-2xl">{weather.name}</h1>
                    <small>
                        {weather? weather.weather[0].main :'..'}-
                        {weather? weather.weather[0].description :'..'}
                    </small>
                </div>
                
            </div>
        </div>
        <div className=" w-2/6 max-md:w-full h-screen py-12 px-5 backdrop-blur-md bg-[rgba(80,80,80,0.3)]">
            <form id="locationInput" onSubmit={handleSubmit}>
                <input type="text" className="rounded-md indent-2 p-2 w-full text-black" onChange={handleCity} value={city} placeholder="Search Location..."/>
                {isCorrect && <p className='text-red-500 mt-2'>incorrect city name</p>}
            </form>
            <table className=" mt-5">
              <tbody className='flex flex-col gap-1'>

                <tr className='text-2xl mt-3 mb-2'><td colSpan={2}>Weather Details</td></tr>
                <tr className='w-[300px]'>
                    <td className='w-1/2 inline-block'>Feels like</td>
                    <td className='inline-block w-1/2'>{weather.main.feels_like}&#176; C</td>
                </tr>
                <tr>
                    <td className='w-1/2 inline-block'>Humidity</td>
                    <td className='w-1/2 inline-block'>{ weather.main.humidity}%</td>
                </tr>
                <tr>
                    <td className='w-1/2 inline-block'>Wind Speed</td>
                    <td className='w-1/2 inline-block'>{weather.wind.speed}mi/h</td>
                </tr>
                <tr>
                    <td className='w-1/2 inline-block'>Pressure</td>
                    <td className='w-1/2 inline-block'>{weather.main.pressure}hPa</td>
                </tr>
                <tr>
                    <td className='w-1/2 inline-block'>Min Temp</td>
                    <td className='w-1/2 inline-block'>{weather.main.temp_min}&#176; C</td>
                </tr>
                <tr>
                    <td className='w-1/2 inline-block'>Miax Temp</td>
                    <td className='w-1/2 inline-block'>{weather.main.temp_max}&#176; C</td>
                </tr>
    </tbody>
                
            </table>
        </div>
    </div>
    </div>)}
    </div>
  );
}

export default App;

