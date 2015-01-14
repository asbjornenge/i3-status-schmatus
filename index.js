var chalk = require('chalk')
var diskspace = require('diskspace')
var batteryInfo = require('battery-info')

var data = {
    diskspace : '?',
    batteryStatus : '?',
    batteryPercent : '?'
}

var bar = function() {
    console.log('%s | %s', chalk.white(data.diskspace), data.battery)
    diskspace.check('/', function(err, total, free, status) {
        if (err) return
        data.diskspace = Math.round(free/1000000000) + ' GB'
    })
    batteryInfo('BAT0', function(err, info) {
        if (err) return
        data.batteryStatus = info.status
        data.batteryPercent = ((100 / info.energy_full) * info.energy_now).toFixed(2)
        console.log(data)
    })
}

setInterval(bar,2000); bar()
