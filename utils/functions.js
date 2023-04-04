const fetch = require('node-fetch')

module.exports = {
    getBufferImage: async function(url) {
        const res = await fetch(url);
        return res && res.ok ? await res.buffer() : null;
    }
}