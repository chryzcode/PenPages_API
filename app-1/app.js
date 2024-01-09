require('dotenv').config()
const express = require('express')

app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hi')
})

const port =  process.env.PORT || 3000

const start = (async => {
    try {
     app.listen(port, ()=> console.log(`server is running on port ${port}`))
    } catch (error) {
        console.log(error)
    }
})


start()