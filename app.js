const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const request = require('request');
const crypto = require('crypto')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'app.html'))
})
app.get('/morf', (req, res)=> {
    const readStream = fs.createReadStream('./db/morf2.jpg');
    readStream.pipe(res);
    res.on('finish', () => readStream.close());

})

app.post('/', (req, res)=> {
    console.log(req.body.url)
    const urls = req.body.url;
    const random = crypto.randomBytes(5).toString('hex');
    const dest = './db/' + random + '.jpg';
    request(urls).pipe(fs.createWriteStream(dest)).on('close', () => {
        console.log('image has been saved')
    })
    const stream = fs.createWriteStream(`./dbto/${random}.txt`);
    const data = `name: ${random}.jpg`;
    stream.write(JSON.stringify(data));
    stream.end();
    stream.on('finish', () => {
        console.log('data saved successfully')
    })
    res.redirect('/');
})

app.listen(3000, ()=> {console.log('server is running on port 3000')})