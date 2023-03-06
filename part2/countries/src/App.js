import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const App = () => {

  const [newSearch, setNewSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState([])
  const [wind, setWind] = useState([])
  const [icon, setIcon] = useState([])

  useEffect(() => {
    if (newSearch) {
      axios
        .get(`https://restcountries.com/v3.1/all`)
        .then(response => {
          setCountries(response.data)
    })
  }}, [newSearch])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const searchResults = newSearch
  ? countries.filter(country => country.name.official.toLowerCase().includes(newSearch.toLowerCase()))
  : countries

  const ShowOne = ({country}) => {
    getWeather({country})
    return (
      <div>
        <h1>{country.name.official}</h1>
        <p>capital {country.capital}<br></br>
          area {country.area}</p>
        <h3>
          languages:
        </h3>
          <ul>
            {Object.keys(country.languages).map(key => <li key={country.name.official}>{country.languages[key]}</li>)}
          </ul>
        <img src={country.flags['png']} />
        <h2>Weather in {country.capital}</h2>
        <p>temperature {weather} Celsius</p>
        <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
        <p>wind {wind} m/s</p>
      </div>  
    )
  }

  const getWeather = ({country}) => {
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]
     
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data.main.temp)
        setWind(response.data.wind.speed)
        setIcon(response.data.weather[0].icon)
      })
  }


  return (
    <div>
    <form>
      <div>
        find countries 
        <input
          value={newSearch}
          onChange={handleSearchChange}
        />
      </div>
    </form>
    {(searchResults.length === 1)
      ? <ShowOne country={searchResults[0]} />
      : (searchResults.length < 11)
        ? <dl style={{listStyle: 'none'}}>
          {searchResults.map(result => 
          <dt key={result.name.official}>{result.name.official} {' '}
          <button type='button' onClick={() => setNewSearch(result.name.official) }>show</button> </dt>
          )}
          </dl>
        : (newSearch !== '')
          ? <p>Too many matches, specify another filter</p>
          : <p></p>
    }
    </div>
  )
}

export default App;

