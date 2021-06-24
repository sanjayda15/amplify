import '../../App.css';

import {listSongs} from '../../graphql/queries';
import {useState, useEffect } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PauseIcon from '@material-ui/icons/Pause';
import ReactPlayer from 'react-player';
import AddIcon from '@material-ui/icons/Add';
import {API, graphqlOperation, Storage} from 'aws-amplify';
import {updateSong} from '../../graphql/mutations';
import {Paper,IconButton} from '@material-ui/core';
import AddSong from '../AddSong';




const SongList = () => {
    const [songs,setSongs] = useState([])
    const [songPlaying, setSongPlaying ] = useState('')
    const [audioURL, setAudioURL] = useState('')
    const [showAddSong, setShowAddNewSong] = useState(false)
    useEffect( () => {
      fetchSongs();
    }, [])

  const toggleSong = async (idx) => {
    if (songPlaying === idx) {
      setSongPlaying('')
      return
    }
    const songFilePath = songs[idx].filePath;
    try{
      const fileAccessURL = await Storage.get(songFilePath, {expires:60 })
      console.log('access url', fileAccessURL)
      setSongPlaying(idx);
      setAudioURL(fileAccessURL)
      return
    } catch (error) {
      console.log('error accessing the file from s3', error)
      setAudioURL('');
      setSongPlaying('');
    }

    setSongPlaying(idx)
    return
  }
  const fetchSongs = async () =>{
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items
      console.log('song list', songList);
      setSongs(songList)
    } catch (error){
      console.log('error on fetching songs', error);
    }
  }
  const addLike = async(idx) => {
    try{
      const song = songs[idx];
      song.like = song.like+1;
      delete song.createdAt;
      delete song.updatedAt;
      console.log('songs', song);
      const songData = await API.graphql(graphqlOperation(updateSong,{input: song}));
      const songList = [...songs];
      console.log('songslist', songList)
      songList[idx] = songData.data.updateSong;
      console.log('songdata::::', songData);
      setSongs(songList);
    } catch (error) {
      console.log('error on fetching songs', error);
    }
  }

    return(
        <div className='songList'>
        {songs.map((song,idx) => {
          return (
            <Paper variant="outlined" elevation={2} key={`song${idx}`}>
              <div className="songCard">
              <IconButton aria-label="play" onClick={() => toggleSong(idx)}>
                {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <div>
                <div className='songTitle'>{song.title}</div>
                <div className='songOwner'>{song.owner}</div>
              </div>
              <div>
              <IconButton aria-label="like" onClick={() => addLike(idx)}>
                <FavoriteIcon />
              </IconButton>
              {song.like}
              </div>
              <div className="songDescription">{song.description}</div>
              <div>
              </div>
              </div>
            {
              songPlaying === idx ? (
                <div>
                  <ReactPlayer
                  url={audioURL}
                  controls
                  playing
                  height="50px"
                  onPause={() => toggleSong(idx)}
                />
                </div>
              ) : null
            }
            </Paper>
          )
        })}
        {
          showAddSong ? (
            <AddSong onUpload={() => {setShowAddNewSong(false)
            fetchSongs()}}/>
          ) : <IconButton onClick={() => setShowAddNewSong(true)}><AddIcon /></IconButton>
        }
      </div>
    
    )
}

export default SongList;