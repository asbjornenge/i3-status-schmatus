var chalk = require('chalk')
var diskspace = require('diskspace')
var batteryInfo = require('battery-info')

var data = {
    diskspace : '?',
    batteryStatus : '?',
    batteryPercent : '?'
}

var bar = function() {
    var disk = formatDiskInfo(data)
    var batt = formatBatteryInfo(data)
    console.log('%s | %s', disk, batt) 
    diskspace.check('/', function(err, total, free, status) {
        if (err) return
        data.diskspace = Math.round(free/1000000000) + ' GB'
    })
    batteryInfo('BAT0', function(err, info) {
        if (err) return
        data.batteryStatus = info.status
        data.batteryPercent = ((100 / info.energy_full) * info.energy_now).toFixed(2)
    })
}

function formatDiskInfo(data) {
    return chalk.white(data.diskspace)
}

function formatBatteryInfo(data) {
    var battcolor = data.batteryStatus == 'Discharging' ? chalk.cyan : chalk.green
    if (data.batteryStatus == 'Discharging' && parseFloat(data.batteryPercent) < 10) battcolor = chalk.red
    return battcolor('🔋  '+data.batteryPercent+'%')
}

setInterval(bar,2000);bar();
