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
    network : '?',
    diskspace : '?',
    batteryStatus : '?',
    batteryPercent : '?'
}

console.log('{"version":1}')
console.log('[[],')

var bar = function() {
    var out = [
        { "full_text" : formatDiskInfo(data),    "color" : "#ffff00" },
        { "full_text" : formatNetworkInfo(data), "color" : "#00F265" },
        { "full_text" : formatBatteryInfo(data), "color" : "#ffff00" },
        { "full_text" : formatTimeInfo(data),    "color" : "#ffff00" },
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

function formatDiskInfo(data) {
    return chalk.white(data.diskspace)
}

function formatBatteryInfo(data) {
    var battcolor = data.batteryStatus == 'Discharging' ? chalk.cyan : chalk.green
    if (data.batteryStatus == 'Discharging' && parseFloat(data.batteryPercent) < 10) battcolor = chalk.red
    return battcolor('🔋  '+data.batteryPercent+'%')
}

function formatNetworkInfo(data) {
    if (data.network == '?') return '?'
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

function formatTimeInfo() {
    return moment().format('DD MMM HH:mm')
}

setInterval(bar,5000);bar();
