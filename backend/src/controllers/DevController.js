const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {
    async index(request, response){
        try{
            const devs = await Dev.find()
        
            return response.json(devs)
        } catch (e){
            console.log(e)
        }

        return response.json({ error: "Problemas..." })
    },

    async store(request, response) {
        const { github_name, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_name })

        if (!dev) {
            const techsArray = parseStringAsArray(techs)

            const apiResponse = await axios.get(`https://api.github.com/users/${github_name}`)

            let { name = login, avatar_url, bio } = apiResponse.data

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_name,
                techs: techsArray,
                name,
                avatar: avatar_url,
                bio,
                location
            })

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )
            
            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }

        return response.json(dev)
    }
}