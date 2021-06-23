const express = require('express')
const http = require('http')
const socket = require('socket.io')
const ejs = require('ejs')

const app = express()
const server = http.createServer(app)
const IO = socket(server)

const PORT = process.env.PORT || 4500

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

const users = {}

IO.on('connection', (client) => {
    
    client.on('mass', (data) => {
        client.broadcast.emit('r_mass', data)
        users[data] = client.id
    })

    client.on('mass_To', ({ to, message }) => {
        const key = Object.keys(users).find(key => users[key] === client.id)
        client.to(users[to]).emit('res_mass', {
            from: key,
            message
        })
    })


    // client.on('disconnect', () => console.log('leave connection'))
})

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(PORT, () => console.log('server running is ' + PORT))
