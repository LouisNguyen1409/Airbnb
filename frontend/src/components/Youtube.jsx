import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = (props) => {
  const opts = {
    height: '200',
    width: '300',
    playerVars: {
      autoplay: 0, // 0 for false, 1 for true
    },
  };
  const onPlayerReady = (event) => {
    event.target.pauseVideo();
  }
  const getVideoIdFromUrl = (url) => {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return videoId.substring(0, ampersandPosition);
    }
    return videoId;
  };
  const videoId = getVideoIdFromUrl(props.url);
  return <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady}/>;
};

export default VideoPlayer;
