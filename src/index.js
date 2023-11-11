import app from './server.js';

import './database.js'

app.listen(4001, () => {
    console.log('Is working')
})