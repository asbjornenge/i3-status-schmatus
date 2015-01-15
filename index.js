#!/usr/bin/env node
var chalk = require('chalk')
var emoji = require('node-emoji')
var moment = require('moment')
var network = require('network')
var diskspace = require('diskspace')
var batteryInfo = require('battery-info')

// missing..
// load
// wifi signal strength ??

var data = {
    network : '',
    diskspace : '',
    batteryStatus : '',
    batteryPercent : ''
}

var colors = {
    cyan      : '#00D7FF',
    blue      : '#11A4EB',
    purple    : '#2F73DC',
    lightblue : '#11A4EB',
    magenta   : '#ED44AA',
    yellow    : '#E6DC06',
    green     : '#00F265',
    red       : '#F73D30',
    white     : '#cccccc',
    bluegrey  : '#525D71'
}

console.log('{"version":1}')
console.log('[[],')

var bar = function() {
    var out = [
        formatDiskInfo(data),
        formatSeparator(),
        formatNetworkInfo(data),
        formatSeparator(),
        formatBatteryInfo(data),
        formatSeparator(),
        formatTimeInfo(data),
    ]
    console.log(JSON.stringify(out)+',')
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

function formatSeparator() {
    return { "full_text" : '|', "color" : colors.magenta, "separator" : false }
}

function formatDiskInfo(data) {
    return { "full_text" : data.diskspace, "color" : colors.bluegrey, "separator" : false }
}

function formatBatteryInfo(data) {
    var battinfo = ''
    var battcolor = data.batteryStatus == 'Discharging' ? colors.cyan : colors.green
    if (data.batteryStatus == 'Discharging' && parseFloat(data.batteryPercent) < 20) battcolor = colors.red
    if (data.batteryPercent != '') battinfo = '🔋  '+data.batteryPercent+'%'
    return { "full_text" : battinfo, "color" : battcolor, "separator" : false }
}

function formatNetworkInfo(data) {
    var infostr = ''
    if (data.network instanceof Array) data.network.forEach(function(network, index) {
        if (index > 0) infostr += ' '
        if (!network.ip_address) return
        infostr += (network.type == 'Wireless') ? emoji.get('radio') : emoji.get('computer')
        infostr += '  '
        infostr += chalk.green(network.ip_address)
    })
    return { "full_text" : infostr, "color" : colors.green, "separator" : false }
}

function formatTimeInfo() {
    return { "full_text" : moment().format('DD MMM HH:mm'), "color" : colors.blue, "separator" : false }
}

setInterval(bar,5000);bar();
