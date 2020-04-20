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

        let dev = await Dev.findOne({ github_name: github_name.toLowerCase() })

        if (!dev) {
            const techsArray = parseStringAsArray(techs)

            const apiResponse = await axios.get(`https://api.github.com/users/${github_name}`)

            let { name = login, avatar_url, bio } = apiResponse.data

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_name: github_name.toLowerCase(),
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
    },

    async update(request, response) {
        const { name, bio, techs, latitude, longitude } = request.body

        if (name && bio && techs && latitude && longitude && request.params.github_name) {

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            const techsArray = parseStringAsArray(techs)

            const dev = await Dev.findOne({ github_name: request.params.github_name.toLowerCase() })
            
            if (dev) {
                await Dev.updateOne(dev, {
                    name,
                    bio,
                    techs: techsArray,
                    location
                })

                return response.json({github_name: dev.github_name, name, bio, techs: techsArray, location})
            } else {
                return response.json({ error: "Dev not exists" })
            }
        } else {
            return response.json({ error: "Missing body/params" })
        }
    },

    async destroy(request, response) {
        const dev = await Dev.findOne({ github_name: request.params.github_name.toLowerCase() })
        
        if (dev != null) {
            await Dev.deleteOne(dev)

            return response.json({
                message: `${dev.name} deleted`
            })
        } else {
            return response.json({
                error: "Dev not exists"
            })
        }
    }
}