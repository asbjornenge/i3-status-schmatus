var chalk = require('chalk')
var emoji = require('node-emoji')
var network = require('network')
var diskspace = require('diskspace')
var batteryInfo = require('battery-info')

// missing..
// load
// time

var data = {
    network : '?',
    diskspace : '?',
    batteryStatus : '?',
    batteryPercent : '?'
}

var bar = function() {
    var disk = formatDiskInfo(data)
    var batt = formatBatteryInfo(data)
    var netw = formatNetworkInfo(data)
    console.log('%s | %s | %s', disk, netw, batt) 
    diskspace.check('/', function(err, total, free, status) {
        if (err) return
        data.diskspace = Math.round(free/1000000000) + ' GB'
    })
    batteryInfo('BAT0', function(err, info) {
        if (err) return
        data.batteryStatus = info.status
        data.batteryPercent = ((100 / info.energy_full) * info.energy_now).toFixed(2)
    })
    network.get_interfaces_list(function(err, list) {
        if (err) return
        data.network = list
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

function formatNetworkInfo(data) {
    if (data.network == '?') return
    if (data.network instanceof Array && data.network.length == 0) return 'No network'
    var infostr = ''
    data.network.forEach(function(network, index) {
        if (index > 0) inforstr += ' '
        infostr += (network.type == 'Wireless') ? emoji.get('radio') : emoji.get('telephone')
        infostr += '  '
        infostr += chalk.green(network.ip_address)
    })
    return infostr
}

setInterval(bar,2000);bar();
