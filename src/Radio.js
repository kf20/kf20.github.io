import React, { useState, useEffect } from 'react';
import { Typography, Slider, Grid } from '@material-ui/core';
import { VolumeDown, VolumeUp } from '@material-ui/icons';
import Marquee from 'react-fast-marquee';

const VIDEO_LIST = [
  { name: 'machine-1', duration: 18 },
  { name: 'machine-2', duration: 12 },
  { name: 'machine-3', duration: 29 },
  { name: 'machine-4', duration: 25 },
  { name: 'machine-5', duration: 20 },
  { name: 'machine-6', duration: 32 },
  { name: 'machine-7', duration: 31 },
  { name: 'machine-8', duration: 6 },
  { name: 'machine-9', duration: 9 },
  { name: 'machine-10', duration: 36 },
  { name: 'machine-11', duration: 16 },
  { name: 'machine-12', duration: 18 },
  { name: 'machine-13', duration: 34 },
  { name: 'machine-14', duration: 12 },
  { name: 'machine-15', duration: 25 },
  { name: 'machine-16', duration: 28 },
  { name: 'machine-17', duration: 20 },
  { name: 'machine-18', duration: 13 },
  { name: 'machine-19', duration: 24 },
  { name: 'machine-20', duration: 71 },
  { name: 'machine-21', duration: 28 },
  { name: 'machine-22', duration: 13 },
  { name: 'machine-23', duration: 16 },
  { name: 'machine-24', duration: 9 },
  { name: 'machine-25', duration: 13 },
  { name: 'machine-26', duration: 27 },
  { name: 'machine-27', duration: 17 },
  { name: 'machine-28', duration: 29 },
  { name: 'machine-29', duration: 12 },
  { name: 'machine-30', duration: 27 },
  { name: 'machine-31', duration: 25 },
  { name: 'machine-32', duration: 22 },
  { name: 'machine-33', duration: 32 },
  { name: 'gun-34', duration: 18 },
  { name: 'gun-35', duration: 23 },
  { name: 'machine-34', duration: 20 },
  { name: 'machine-35', duration: 22 },
  { name: 'machine-36', duration: 29 },
];

const SONG_LIST = [
  { name: 'P-MODEL - フ・ル・ヘッ・ヘッ・ヘッ', duration: 172 },
  { name: 'サエキけんぞう＆ぶどう÷グレープ「母子受精」', duration: 155 },
  { name: 'CORNELIUS - BREEZIN', duration: 240 },
  { name: 'Cornelius - 『いつか - どこか』 Sometime - Someplace', duration: 240 },
  { name: 'Focus - YMO', duration: 230 },
  { name: 'Ghost In The Tapes - Black Mass', duration: 162 },
  { name: 'Jacksons Club - Sunspot', duration: 137 },
  { name: 'Logic System - Automatic Collect, Automatic Correct', duration: 326 },
  { name: 'Majupose', duration: 242 },
  { name: 'OOIOO - Grow Sound Tree', duration: 340 },
  { name: 'Rei Harakami - Owari no Kisetsu', duration: 199 },
  { name: 'Ryo Kawasaki - Caravan (Original Mix)', duration: 296 },
  { name: 'Mariah - Shinzo No Tobira', duration: 282 },
  { name: 'Yellow Magic Orchestra - Rydeen', duration: 275 },
  { name: '初音ミク-RAP PHENOMENA-ラップ現象', duration: 270 },
  { name: '大貫妙子 Taeko Ohnuki - Labyrinth', duration: 277 },
  { name: 'Drop', duration: 308 },
  { name: '가지 마 Dont Go', duration: 253 },
  { name: 'ZOMBIE-CHANG - LEMONADE', duration: 282 },
  { name: 'Luxury Elite - Strut (猫 シ Corp. Remix)', duration: 145 },
  { name: 'Catch! (feat. Antenna Girl)', duration: 174 },
  { name: 'Nami Shimada - Sunshower', duration: 315 },
  { name: 'Le Courant De Mecontentment', duration: 258 },
  { name: 'TIBETAN DANCE', duration: 262 },
  { name: 'Older Girl', duration: 256 },
  { name: 'Haruomi Hosono - スポーツマン', duration: 244 },
  { name: 'Haruomi Hosono - Body Snatchers', duration: 350 },
  { name: 'naomi akimoto - tennessee waltz', duration: 180 },
  { name: 'Talk Back', duration: 252 },
];

var unshuffled_video_queue = [];
var video_queue = [];
var total_video_duration = 0;
var target_video_position = 0;

var unshuffled_song_queue = [];
var song_queue = [];
var total_song_duration = 0;
var target_song_position = 0;

for (let i = 0; i < VIDEO_LIST.length; i++) {
  //set up some variables
  unshuffled_video_queue.push(i);
  total_video_duration += VIDEO_LIST[i].duration;
}

for (let i = 0; i < SONG_LIST.length; i++) {
  //set up some variables
  unshuffled_song_queue.push(i);
  total_song_duration += SONG_LIST[i].duration;
}

//generates a pseudorandom value between 0 and 1
function randNumber(_seed) {
  let random = Math.sin(_seed) * 43758.5453123;
  return random - Math.floor(random);
}

//pseudorandomly shuffles an array
function shuffleArray(array, seed) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(randNumber(seed * i) * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function Radio() {
  const [volume, setVolume] = useState(0);
  const [song_name, setSongName] = useState('');

  function changeVolume(_, value) {
    setVolume(value);
  }

  function setVideo(_id) {
    let videoPlayer = document.getElementById('video-player');
    let videoSource = document.getElementById('video-source');

    //set the video source as the new video
    videoSource.setAttribute('src', `/videos/${VIDEO_LIST[_id].name}.webm`);

    videoPlayer.currentTime = target_video_position;
    target_video_position = 0;

    //set the volume
    videoPlayer.volume = volume / 100;
    videoPlayer.load();
  }

  function nextVideo() {
    if (video_queue.length !== 0) {
      //if there is a video in the queue, play it
      setVideo(video_queue[0]);
      video_queue.shift();
    } else {
      //if the queue is empty, get a new queue
      syncVideoQueue();
      nextVideo();
    }
  }

  function syncVideoQueue() {
    //use unix time to sync all clients to the same song and video
    let time = Math.floor(Date.now() / 1000);

    //after all the videos have played, video_cycle increases
    //when this happens, shuffle the video_queue using video_cycle as the seed
    //this causes the videos to play in a different order each cycle
    let video_cycle = Math.floor(time / total_video_duration);
    video_queue = [...unshuffled_video_queue];
    shuffleArray(video_queue, video_cycle);

    //target_video_position is how far along in the video_queue we should be (in seconds), based off of unix time
    //iterate through each video in the queue until we reach the correct one
    target_video_position = time % total_video_duration;
    for (let i = 0; i < video_queue.length; i++) {
      let video = VIDEO_LIST[video_queue[0]];
      if (target_video_position < video.duration) {
        break;
      }

      target_video_position -= video.duration;
      video_queue.shift();
    }
  }

  function setSong(_id) {
    let audioPlayer = document.getElementById('audio-player');
    let audioSource = document.getElementById('audio-source');

    audioSource.setAttribute('src', `/songs/${SONG_LIST[_id].name}.mp3`);

    audioPlayer.currentTime = target_song_position;
    target_song_position = 0;

    audioPlayer.volume = volume / 100;
    audioPlayer.load();

    setSongName(SONG_LIST[_id].name);
  }

  function nextSong() {
    if (song_queue.length !== 0) {
      setSong(song_queue[0]);
      song_queue.shift();
    } else {
      syncSongQueue();
      nextSong();
    }
  }

  function syncSongQueue() {
    let time = Math.floor(Date.now() / 1000);

    let song_cycle = Math.floor(time / total_song_duration);
    song_queue = [...unshuffled_song_queue];
    shuffleArray(song_queue, song_cycle);

    target_song_position = time % total_song_duration;
    for (let i = 0; i < song_queue.length; i++) {
      let song = SONG_LIST[song_queue[0]];
      if (target_song_position < song.duration) break;

      target_song_position -= song.duration;
      song_queue.shift();
    }
  }

  useEffect(() => {
    //when volume is changed, set the new volume
    let audioObject = document.getElementById('audio-player');
    audioObject.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    //on page load
    nextVideo();
    nextSong();
  }, []);

  return (
    <>
      <video id='video-player' muted autoPlay onEnded={() => nextVideo()}>
        <source
          id='video-source'
          src={`/videos/${VIDEO_LIST[0].name}.webm`}
          type='video/webm'
        ></source>
        Your browser does not support this video format.
      </video>

      <audio id='audio-player' autoPlay onEnded={() => nextSong()}>
        <source
          id='audio-source'
          src={`/songs/${SONG_LIST[0].name}.mp3`}
        ></source>
      </audio>

      <Grid id='main-grid' container item xs={7} direction='column'>
        <Grid item xs={12} md={6} xl={4}>
          <Marquee gradient={false}>
            <Typography noWrap>Now Playing: {song_name}     </Typography>
          </Marquee>
        </Grid>
        <Grid container item xs={12} md={6} xl={4} alignItems='center'>
          <Grid item xs={1}>
            <VolumeDown onClick={() => changeVolume(undefined, 0)} />
          </Grid>
          <Grid item xs={10}>
            <Slider value={volume} onChange={changeVolume} />
          </Grid>
          <Grid item xs={1}>
            <VolumeUp onClick={() => changeVolume(undefined, 100)} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
