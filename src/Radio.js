import React, { useState, useEffect } from 'react'
import {Typography, Slider, Grid} from '@material-ui/core'
import {VolumeDown, VolumeUp} from '@material-ui/icons'
import Marquee from "react-fast-marquee";

const videoList = [
    {'src':'/videos/Just-Communication.mp4', 'duration':260, 'name':'Mobile Suit Gundam Wing - Just Communication   '},
    {'src':'/videos/Fly-Gundam.mp4', 'duration':89, 'name':'Mobile Suit Gundam - Fly! Gundam!   '},
    {'src':'/videos/Bubblegum-Crisis-Konya-Wa-Hurricane.mp4', 'duration':291, 'name':'Bubblegum Crisis - Konya Wa Hurricane   '},
    {'src':'/videos/MD-Geist-Violence-of-the-Flame.mp4', 'duration':240, 'name':'M.D. Geist - Violence of the Flame   '},
    {'src':'/videos/Yellow-Dancer-(Lancer)-Look-Up-the-Sky-is-Falling.mp4', 'duration':285, 'name':'Yellow Dancer (Lancer) - Look Up the Sky is Falling   '},
    {'src':'/videos/Choujuu-Kishin-Dancouga-Ai-yo-Far-Away.mp4', 'duration':246, 'name':'Choujuu Kishin - Dancouga Ai yo Far Away   '},
    {'src':'/videos/Mobile-Police-Patlabor-(Early-Days)-Opening-Remastered.mp4', 'duration':90, 'name':'Mobile Police Patlabor (Early Days) - Opening (Remastered)   '},
    {'src':'/videos/Trider-G7-Opening.mp4', 'duration':86, 'name':'Trider G7 - Opening   '},
    {'src':'/videos/Aku-Daisakusen-Slangle-Late-FIGHTING-ON.mp4', 'duration':80, 'name':'Aku Daisakusen Slangle Late - FIGHTING ON   '},
    {'src':'/videos/Aura-Battler-Dunbine-OP.mp4', 'duration':91, 'name':'Aura Battler Dunbine - Opening   '},
    {'src':'/videos/Metal-Armor-Dragonar-Opening-1.mp4', 'duration':90, 'name':'Metal Armor Dragonar - Opening 1   '},
]

var radioCycle = 1
var unshuffledRadioQueue = []
var radioQueue = []
var radioPosition = 0
var totalDuration = 0

for (let i = 0; i < videoList.length; i++) {
    //set up some variables
    unshuffledRadioQueue.push(i)
    totalDuration += videoList[i].duration
}

//generates a pseudorandom value between 0 and 1
function randNumber(seed) {
    var random = Math.sin(seed)*43758.5453123
	return random - Math.floor(random)
}

//pseudorandomly shuffles an array
function shuffleArray(array, seed) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randNumber(seed * i) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


export default function Radio() {
    //stores the volume
    const [volume, setVolume] = useState(0)
    
    function changeVolume(_, value) {
        setVolume(value)
    }

    //stores info about the video being played
    const [currentVideo, setCurrentVideo] = useState({
        cycle: 0,
        videoID: 0,
        songName: ''
    })

    function setVideoID(value) {
        let newCurrentVideo = {
            cycle: radioCycle,
            videoID: value,
            songName: videoList[value].name
        }
        setCurrentVideo(newCurrentVideo)
    }

    //changes the current song to the one that should be playing
    function updateSong() {
        syncRadio()
        setVideoID(radioQueue[0])
        changeVolume(undefined, volume)
    }

    function syncRadio() {
        //use unix time to sync all clients to the same song and position
        let time = Math.floor(Date.now() / 1000)

        //after all the songs have played, radioCycle increases
        //when this happens, reshuffle the radioQueue based on the new value
        //this causes the songs to play in a different order each time
        radioCycle = Math.floor(time / totalDuration)
        radioQueue = [...unshuffledRadioQueue]
        shuffleArray(radioQueue, radioCycle)

        //radioPosition is how far along in the radioQueue we should be (in seconds)
        //iterate through each video in the queue until we reach the correct one
        radioPosition = time % totalDuration
        for (let i = 0; i < radioQueue.length; i++) {
            let video = videoList[radioQueue[0]]
            if (radioPosition < video.duration) { break }

            radioPosition -= video.duration
            radioQueue.push(radioQueue.shift())
            if (radioPosition < 1) { radioPosition = 1 } //safeguard for when radioPosition is close to 0
        }
    }

    useEffect(() => {
        //when a new song is loaded, set its time to the radioPosition
        let videoObject = document.getElementById('background-video')
        videoObject.load()
        videoObject.currentTime = radioPosition
    }, [currentVideo])

    useEffect(() => {
        //when a new song is loaded, or when the volume is changed, set the volume
        let videoObject = document.getElementById('background-video')
        videoObject.volume = volume/100.0
    }, [volume, currentVideo])
    
    //start the radio on page load
    useEffect(() => {
        updateSong()
        changeVolume(undefined, 0) //start muted
    }, [])

    return (
        <div>
            <video id='background-video' autoPlay key={currentVideo.videoID} onEnded={() => {updateSong()}}>
                <source src={videoList[currentVideo.videoID].src} type='video/mp4' />
                Your browser does not support this video format.
            </video>

            <div id="radio-controls">
                <Grid container item xs={8} md={4} xl={3} alignItems="center">  
                    <Marquee gradient={false}>
                        <Typography>
                            Now Playing: {currentVideo.songName}
                        </Typography>
                    </Marquee>
                </Grid>
                <Grid container item xs={8} md={4} xl={3} alignItems="center">
                    <Grid item xs={1}>
                        <VolumeDown onClick={() => {changeVolume(undefined, 0)}} />
                    </Grid>
                    <Grid item xs={10}>
                        <Slider value={volume} onChange={changeVolume} />
                    </Grid>
                    <Grid item xs={1}>
                        <VolumeUp onClick={() => {changeVolume(undefined, 100)}} />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
