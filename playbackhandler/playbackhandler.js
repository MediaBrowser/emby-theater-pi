
function play(playData, callback) {

    console.log('Play Data : ' + playData);
    var playData = JSON.parse(playData);
    console.log('Play URL : ' + playData.url);
    console.log('Play StartTime : ' + playData.startTime);
	
    var args = ["--alpha", "127", "--pos", playData.startTime, playData.url];
    //args = ["--win", "0 0 300 300", "--alpha", "127", "--pos", playData.startTime, playData.url];
    
    var path = "omxplayer";
    var process = require('child_process');
    process.execFile(path, args, {}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function stop(callback) {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.Stop"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function pause() {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.Pause"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function pause_toggle() {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.PlayPause"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function resume() {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.Play"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function get_position(callback) {

    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session",
        "--reply-timeout=1000",
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.freedesktop.DBus.Properties.Get", 
        "string:org.mpris.MediaPlayer2.Player",
        "string:Position"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
        else {
            //console.log('Process stdout: ' + stdout);
            var bits = stdout.trim().split(" ");
            //console.log('get_position Data: ' + bits[1]);
            callback(bits[1]);
        }
    });     	
}

function set_position(data) {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.SetPosition",
        "objpath:/not/used",
        "int64:" + data.toString()];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function set_alpha(data) {

    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.SetAlpha",
        "objpath:/not/used",
        "int64:" + data.toString()];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function get_audio_tracks(callback) {
	
	callback("1:eng:long:test");
}

function processRequest(request, callback) {
	
    //console.log("request url : " + request.url);
    var url = require('url');
    var url_parts = url.parse(request.url, true);
    var action = url_parts.host;

    switch (action) {

        case 'play':
            var data = url_parts.query["data"];			
            play(data, callback);
            callback("Play Action");
            break;
        case 'stop':			
            stop(callback);
            callback("Stop Action");
            break;
        case 'get_position':			
            get_position(callback);
            break;
        case 'set_position':
            var data = url_parts.query["data"];			
            set_position(data);
            callback("Set Position Action");
            break;
        case 'set_alpha':
            var data = url_parts.query["data"];
            set_alpha(data);
            break;
        case 'pause_toggle':
            pause_toggle();
            break;             
        case 'pause':
            pause();
            break; 
        case 'resume':
            resume();
            break; 
        case 'get_audio_tracks':	
            get_audio_tracks(callback);
            break;			
        default:
            console.log('playbackhandler:processRequest action unknown : ' + action);
            callback("");
            break;
    }
}

function registerMediaPlayerProtocol(protocol) {

    protocol.registerStringProtocol('linuxplayer', function (request, callback) {
        processRequest(request, callback);
    });
}

exports.registerMediaPlayerProtocol = registerMediaPlayerProtocol;
