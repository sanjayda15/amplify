import '../../App.css';
import {API, graphqlOperation, Storage} from 'aws-amplify';
import {createSong} from '../../graphql/mutations';
import {useState } from 'react';
import {TextField,IconButton} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import {v4 as uuid} from 'uuid'

const AddSong = ({onUpload}) =>{
    const [songData,setSongData] = useState({});
    const [mp3Data, setMp3Data] = useState()
    const uploadSong = async () => {
      const {title,description,owner} = songData;
      console.log(songData)
      const { key } = await Storage.put(`${uuid()}.mp3`, mp3Data, {contentType:'audio/mp3'});
      const createSongInput = {
        id:uuid(),
        title,
        description,
        owner,
        filePath: key,
        like:0
      }
      await API.graphql(graphqlOperation(createSong, {input: createSongInput }))
      onUpload();
    }
    return (
      <div className="newSong">
        <TextField label="Title" value={songData.title} onChange={e => setSongData({...songData, title:e.target.value})}/>
        <TextField label="Artist" value={songData.owner} onChange={e => setSongData({...songData, owner:e.target.value})}/>
        <TextField label="Description" value={songData.description} onChange={e => setSongData({...songData, description:e.target.value})}/>
        <input type="file" accept="audio/mp3" onChange={e => setMp3Data(e.target.files[0])} />
        <IconButton onClick={uploadSong}>
          <PublishIcon></PublishIcon>
        </IconButton>
        </div>
    )
  }

  export default AddSong;