define(['apphost', 'pluginManager', 'events', 'embyRouter'], function (appHost, pluginManager, events, embyRouter) {
    'use strict';

    return function () {
        //alert("Plugin Loaded");
        
        var self = this;

        self.name = 'Linux Media Player';
        self.type = 'mediaplayer';
        self.id = 'linuxmediaplayer';
        self.requiresVideoTransparency = true;

        var currentSrc;
        var playbackPosition = 0;
        var timeUpdateInterval;

       	document.addEventListener('video-osd-show', function () {
            //alert("OSD Shown");
            startTimeUpdateInterval(1000);
            sendData("set_alpha", 127);
        });
        
       	document.addEventListener('video-osd-hide', function () {
            //alert("OSD Hidden");
            startTimeUpdateInterval(10000);
            sendData("set_alpha", 255);
        }); 

        self.canPlayMediaType = function (mediaType) {
            //alert("canPlayMediaType");		
            return true;
        };
        
        self.canPlayItem = function (item) {
            //alert("canPlayItem");

            return true;
        };

        self.getDeviceProfile = function () {
            //alert("getDeviceProfile");
			
            var profile = {};

            profile.MaxStreamingBitrate = 100000000;
            profile.MaxStaticBitrate = 100000000;
            profile.MusicStreamingTranscodingBitrate = 192000;

            profile.DirectPlayProfiles = [];

            profile.DirectPlayProfiles.push({
                Container: 'm4v,3gp,ts,mpegts,mov,xvid,vob,mkv,wmv,asf,ogm,ogv,m2v,avi,mpg,mpeg,mp4,webm,wtv,dvr-ms,iso,m2ts',
                Type: 'Video'
            });

            profile.DirectPlayProfiles.push({
                Container: 'aac,mp3,mpa,wav,wma,mp2,ogg,oga,webma,ape,opus,flac',
                Type: 'Audio'
            });

            profile.TranscodingProfiles = [];

            profile.TranscodingProfiles.push({
                Container: 'mkv',
                Type: 'Video',
                AudioCodec: 'mp3,ac3,aac',
                VideoCodec: 'h264',
                Context: 'Streaming'
            });

            profile.TranscodingProfiles.push({
                Container: 'mp3',
                Type: 'Audio',
                AudioCodec: 'mp3',
                Context: 'Streaming',
                Protocol: 'http'
            });

            profile.ContainerProfiles = [];

            profile.CodecProfiles = [];

            // Subtitle profiles
            // External vtt or burn in
            profile.SubtitleProfiles = [];
            profile.SubtitleProfiles.push({
                Format: 'srt',
                Method: 'External'
            });
            profile.SubtitleProfiles.push({
                Format: 'ass',
                Method: 'External'
            });
            profile.SubtitleProfiles.push({
                Format: 'ssa',
                Method: 'External'
            });
            profile.SubtitleProfiles.push({
                Format: 'srt',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'subrip',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'ass',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'ssa',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'pgs',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'pgssub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'dvdsub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'dvbsub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'vtt',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'sub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'idx',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'smi',
                Method: 'Embed'
            });

            profile.ResponseProfiles = [];

            return Promise.resolve(profile);
        };

        self.currentSrc = function () {
            //alert("currentSrc");
            return currentSrc;
        };

        self.play = function (options) {
            //alert("Play")
			
            var mediaSource = JSON.parse(JSON.stringify(options.mediaSource));

            var url = options.url;

            if(currentSrc == url) {
                // we are already playing this file so just set position
                // need this in microseconds
                sendData("set_position", (options.playerStartPositionTicks / 10));
            }
            else {
                currentSrc = url;

                //var isVideo = options.mimeType.toLowerCase('video').indexOf() == 0;
                //var isVideo = options.item.MediaType == 'Video';
   
                var startTime = new Date(null);
                startTime.setSeconds((options.playerStartPositionTicks || 0) / 10000000);
                var startTimeString = startTime.toISOString().substr(11, 8);
                
                var playRequest = {
                    url: url,
                    startTime: startTimeString
                };
                var playData = JSON.stringify(playRequest);
   
                sendData("play", playData);
                
                startTimeUpdateInterval(1000);
                embyRouter.showVideoOsd();
            }
            
            playbackPosition = (options.playerStartPositionTicks || 0) / 10;
            events.trigger(self, 'timeupdate');
            
            return Promise.resolve();
        };

        self.currentTime = function (val) {
            //alert("currentTime");
			
            if (val != null) {
            	alert("currentTime: " + val);
                sendData("set_position", val * 1000);
                return;
            }

            // needs to be milliseconds
            return playbackPosition / 1000;
        };

        self.duration = function (val) {
            //alert("duration");
            return 0;
        };

        self.stop = function (destroyPlayer, reportEnded) {
            //alert("stop");
            stopTimeUpdateInterval();
            currentSrc = "";
            events.trigger(self, 'stopped');
            sendData("stop");
        };

        self.destroy = function () {
            //alert("destroy");
        };

        self.pause = function () {
            //alert("pause");
            //events.trigger(self, 'pause');
            sendData("pause_toggle");
        };

        self.unpause = function () {
            //alert("unpause");
            //events.trigger(self, 'playing');
            sendData("resume");
        };

        self.paused = function () {
            //alert("paused");
            return false;
        };

        self.volume = function (val) {
            //alert("volume");
            if (val != null) {
                // set vol
                return;
            }

            return 0;
        };

        self.setSubtitleStreamIndex = function (index) {
        };

        self.setAudioStreamIndex = function (index) {
        };

        self.canSetAudioStreamIndex = function () {
            return true;
        };

        self.setMute = function (mute) {
        };

        self.isMuted = function () {
            return false;
        };
        
        function startTimeUpdateInterval(interval) {
            stopTimeUpdateInterval();
            //alert("startTimeUpdateInterval: " + interval);
            timeUpdateInterval = setInterval(onTimeUpdate, interval);
        }        
        
        function stopTimeUpdateInterval() {
            if (timeUpdateInterval) {
                clearInterval(timeUpdateInterval);
                timeUpdateInterval = null;
            }
        }
		
        function onTimeUpdate() {
            //alert("onTimeUpdate");
            sendData("get_position", false, updatePlayerPosition);
        }
        
        function updatePlayerPosition(data) {
            //alert("Doing Timed Update: " + data);
            playbackPosition = parseInt(data);
            events.trigger(self, 'timeupdate');
        }
        
        		
        function setCurrentPos(data) {
            console.log(data);
        }

        function sendData(action, sendData, callback) {
            var encodedSendData = "";
            if(sendData) {
                encodedSendData = encodeURIComponent(sendData.toString());
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'linuxplayer://' + action + '?data=' + encodedSendData, true);
            xhr.onload = function () {
            if (this.response) {
                var data = this.response;
                if(callback) {
                    callback(data);
                }
            }};
            xhr.send();
        }
		
    }
});
