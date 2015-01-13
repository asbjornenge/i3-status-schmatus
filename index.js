var chalk = require('chalk')
var diskspace = require('diskspace')

var data = {
   diskspace : '?',
   battery   : '?'
}

var bar = function() {
    console.log('%s | %s', chalk.white(data.diskspace), data.battery)
    diskspace.check('/', function(err, total, free, status) {
        data.diskspace = Math.round(free/1000000000) + ' GB'
    })
}

setInterval(bar,2000); bar()
