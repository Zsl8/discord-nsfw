const tf = require('@tensorflow/tfjs-node')
const { getBufferImage } = require('../utils/functions')

module.exports = async (client, message) => {
    if (message.attachments.size > 0) {
        let nsfwCheck;
        message.attachments.forEach(async attachment => {
            let buffer = await getBufferImage(attachment.url)
            let image = tf.node.decodeImage(buffer, 3)

            let result = await (await client.model).classify(image)
            result = decodeResult(result)

            let check = isNsfw(result, client.limits)
            if (check) {
                message.delete().catch(err => 0)
                if (!nsfwCheck) {
                    message.channel.send({ content: `${message.author}, Your message has been deleted for nsfw content.\nplease don't send something similar to that content again` })
                }
                nsfwCheck = true
            }
        })
    } else if (message.content) {
        let matches = message.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi)

        if (Array.isArray(matches)) {
            let nsfwCheck;
            matches.forEach(async item => {
                try {
                    let buffer = await getBufferImage(item)
                    let image = tf.node.decodeImage(buffer, 3)

                    let result = await (await client.model).classify(image)
                    result = decodeResult(result)

                    let check = isNsfw(result, client.limits)
                    if (check) {
                        message.delete().catch(err => 0)
                        if (!nsfwCheck) {
                            message.channel.send({ content: `${message.author}, Your message has been deleted for nsfw content.\nplease don't send something similar to that content again` })
                        }
                        nsfwCheck = true
                    }
                } catch {}
            })
        }
    }
}

function decodeResult(result) {
    let object = {}
    result.forEach(item => {
        object[item.className] = item.probability * 100
    })
    return object
}

function isNsfw(result, limits) {
    if (
        result.Sexy > limits.Sexy && limits.Sexy !== 0
        ||
        result.Porn > limits.Porn && limits.Porn !== 0
        ||
        result.Hentai > limits.Hentai && limits.Hentai !== 0
        ||
        result.Drawing > limits.Drawing && limits.Drawing !== 0
        ||
        result.Neutral > limits.Neutral && limits.Neutral !== 0
        ||
        result.Drawing > limits.DrawingHentai.Drawing && result.Hentai > limits.DrawingHentai.Hentai && limits.DrawingHentai.Hentai !== 0 && limits.DrawingHentai.Drawing !== 0
    ) {
        return true
    } else {
        return false
    }
}