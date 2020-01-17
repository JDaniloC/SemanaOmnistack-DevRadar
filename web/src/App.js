import React, { useEffect, useState } from 'react';
import api from './services/api'

import './Sidebar.css'
import './App.css';
import './global.css'
import './Main.css'

function App() {
  const [devs, setDevs] = useState([])
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState('');
  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        setLongitude(longitude)
        setLatitude(latitude)
      },
      (err) => {
        console.log(err)
      },
      {
        timeout: 30000,
      }
    )
  }, [])

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs')

      setDevs(response.data)
    }

    loadDevs()
  }, [])

  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_name: github_username,
      techs,
      latitude,
      longitude
    })

    setGithub_username('')
    setTechs('')

    const hasDev = devs.filter(dev => dev.github_name === github_username)

    if (hasDev.length === 0){
      setDevs([...devs, response.data])
    }
  }

  return (
    <div id="app">
      <aside>
        <strong> Cadastrar </strong>
        <form onSubmit= {handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username"> Usuário do Github </label>
            <input 
              name="github_username" 
              id="github_username" 
              required 
              value={github_username} 
              onChange={e => setGithub_username(e.target.value)}/>
          </div>

          <div className="input-block">
            <label htmlFor="techs"> Tecnologias </label>
            <input 
              name="techs" 
              id="techs" 
              required
              value={techs} 
              onChange={e => setTechs(e.target.value)}/>
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude"> Latitude </label>
              <input 
                type= "number" 
                name="latitude" 
                id="latitude" 
                required value={latitude} 
                onChange = {e => setLatitude(e.target.value)}/>
            </div>
            <div className="input-block">
              <label htmlFor="longitude"> Longitude </label>
              <input 
                type= "number" 
                name="longitude"
                id="longitude" 
                required value={longitude} 
                onChange = {e => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <button type="submit"> Salvar </button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li key = {dev._id} className="dev-item">
              <header>
                <img src={dev.avatar} alt={dev.name}/>
                <div className="user-info">
                  <strong> {dev.name} </strong>
                  <span> {dev.techs.join(', ')} </span>
                </div>
                <p>
                  {dev.bio}
                </p>
                <a href = {`https://github.com/${dev.github_name}`}> Acessar perfil no Github </a>
              </header>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
