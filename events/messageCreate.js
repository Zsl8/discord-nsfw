const tf = require('@tensorflow/tfjs-node')
const { getBufferImage } = require('../utils/functions')

module.exports = async (client, message) => {
    let attachments = message.attachments.map(c => c.url)
    let matches = message.content && message.content.match(/\bhttps?:\/\/\S+/gi) ? message.content.match(/\bhttps?:\/\/\S+/gi) : []
    let array = [...attachments, ...matches]

    for (const attachment of array) {
        try {
            let result = await classify(attachment)

            if (result) {
                message.delete().catch(err => 0)
                message.channel.send({ content: `${message.author}, Your message has been deleted for nsfw content.\nplease don't send something similar to that content again` })
                break;
            }
        } catch(e) { }
    }

    async function classify(attachment) {
        let buffer = await getBufferImage(attachment)
        let image = tf.node.decodeImage(buffer, 3)

        let result = await (await client.model).classify(image)
        result = decodeResult(result)

        return isNsfw(result, client.limits)
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
    return Boolean(
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
    )
}
