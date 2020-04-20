import React, { useEffect, useState } from 'react';
import api from './services/api'
import { FiTrash2, FiEdit } from 'react-icons/fi'

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
  const [formulario, setFormulario] = useState('Cadastrar Dev');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    document.title = "Dev Radar"
  }, [])

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

  function handleEdit(github_name) {
    const dev = devs.filter(dev => dev.github_name === github_name)[0]

    setGithub_username(github_name)
    setName(dev.name)
    setBio(dev.bio)
    setLongitude(dev.location.coordinates[0])
    setLatitude(dev.location.coordinates[1])
    setTechs(dev.techs.join(", "))

    document.querySelector('#cadastro').style.display = 'none'
    setFormulario("Editar Dev")
    document.querySelector("#edicao").style.display = 'block'
  }

  async function handleUpdate(e) {
    e.preventDefault();
    
    const novo = await api.put('/devs/' + github_username, {
      name,
      bio,
      techs,
      latitude,
      longitude
    });

    let dev = devs
    for (var i = 0; i < dev.length; i++) {
      if (dev[i].github_name === github_username) {
        dev[i].name = name;
        dev[i].bio = bio;
        dev[i].techs = novo.data.techs;
        dev[i].latitude = latitude;
      }
    }

    setDevs(dev)

    voltarCadastro(e)
  }
  function voltarCadastro(e) {
    e.preventDefault()

    document.querySelector('#cadastro').style.display = 'block'
    setFormulario("Cadastrar Dev")
    document.querySelector("#edicao").style.display = 'none'

    setGithub_username("")
    setName("")
    setBio("")
    setLongitude("")
    setLatitude("")
    setTechs("")
  }

  async function handleDelete(github_name) {
    const response = window.confirm("Você quer mesmo deletar " + github_name + "?")
    if (response) {
      setDevs( devs.filter(dev => dev.github_name !== github_name) )

      await api.delete('/devs/' + github_name)
    }
  }

  return (
    <div id="app">
      <aside>
        <strong> {formulario} </strong>
        <form id="cadastro" onSubmit= {handleAddDev}>
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

        <form id="edicao">
          <div className="input-block">
            <label htmlFor="github_username"> Usuário do Github </label>
            <input 
              name="github_username" 
              id="github_username" 
              required 
              value={github_username} 
              onChange={e => setGithub_username(e.target.value)}
              disabled/>
          </div>
          <div className="input-block">
            <label htmlFor="name"> Nome </label>
            <input 
              name="name" 
              id="name" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)}/>
          </div>
          <div className="input-block">
            <label htmlFor="bio"> Biografia </label>
            <input 
              name="bio" 
              id="bio" 
              required 
              value={bio} 
              onChange={e => setBio(e.target.value)}/>
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
          <button style={{width:"45%", marginRight:"10px"}} onClick={voltarCadastro}> Cancelar </button>
          <button style={{width:"45%"}} onClick={handleUpdate}> Modificar </button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li key = {dev._id} className="dev-item">
              <div style={{ float:"right" }}>
                <button id = "editButton" style={{ borderStyle:'none', backgroundColor:"#FFF", cursor:"pointer" }} onClick={() => handleEdit(dev.github_name)}>
                  <FiEdit size={16}/>
                </button>

                <button id = "deleteButton" style={{ borderStyle:'none', backgroundColor:"#FFF", cursor:"pointer" }} onClick={() => handleDelete(dev.github_name)}>
                  <FiTrash2 size={16}/>
                </button>
              </div>
              <header>
                <img src={dev.avatar} alt={dev.name}/>
                <div className="user-info">
                  <strong> {dev.name} </strong>
                  <span> {dev.techs.join(', ')} </span>
                </div>
              </header>
              <p>{dev.bio}</p>
              <a href = {`https://github.com/${dev.github_name}`}> Acessar perfil no Github </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
