const moment = require('moment')

function formatMessage(name, text) {
    return {
        name,
        text,
        time: moment().format('HH:mm:ss'),
    }
}

module.exports = formatMessage
