const Jimp = require('jimp')
const fs = require('node:fs')
const fetch = require('node-fetch')


module.exports = {
    getBufferImage: async function(url) {
        let num = Math.floor(Math.random() * 10000000)

        if(!url.includes('jpeg') && !url.includes('png') && !url.includes('bmp')) {
            Jimp.read(url, (err, image) => {
                if(err) return;
                image.write(`./temp/${num}.png`)
                url = `./temp/${num}.png`
            })
        }

        const res = await fetch(url);

        setTimeout(() => {
            fs.unlink(`./temp/${num}.png`, (e) => {})
        }, 3000)

        return res && res.ok ? await res.buffer() : null;
    }
}
