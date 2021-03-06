import { useState } from 'react';
import { EditText } from 'react-edit-text';
import EditIcon from '@mui/icons-material/Edit';
import 'react-edit-text/dist/index.css';
import { Button, Container, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAlertMessage } from '../AlertMessage';

export interface SongProps {
  songId: string;
  songName: string;
  artist: string;
  songPath: string;
  lyricsPath: string;
  vocalsPath: string;
  accompanimentPath: string;
  graphPath: string;
}

export const emptySongProps = {
  songId: '',
  songName: '',
  artist: '',
  songPath: '',
  lyricsPath: '',
  vocalsPath: '',
  accompanimentPath: '',
  graphPath: '',
};

export const songPickerOptions: Electron.OpenDialogOptions = {
  filters: [
    {
      name: 'Audio',
      extensions: ['mp3', 'wav', 'm4a', 'wma'],
    },
  ],
  properties: ['openFile'],
};

export const lyricsPickerOptions: Electron.OpenDialogOptions = {
  filters: [
    {
      name: 'Lyrics',
      extensions: ['txt', 'lrc'],
    },
  ],
  properties: ['openFile'],
};

interface SongComponentProps {
  song: SongProps;
  setSong: (song: SongProps) => void;
}

const Song = ({ song, setSong }: SongComponentProps) => {
  const [currSong, setCurrSong] = useState(song);
  const [isFetchingLyrics, setIsFetchingLyrics] = useState(false);
  const { setAlertMessage } = useAlertMessage();

  const changeSong = (changedSong: SongProps) => {
    setCurrSong(changedSong);
  };

  const saveSong = (changedSong: SongProps) => {
    setSong(changedSong);
  };

  const chooseFile = async (
    config: Electron.OpenDialogOptions,
    setPathFn: (arg0: string) => SongProps
  ) => {
    window.electron.dialog
      .openFile(config)
      .then((result) => setPathFn(result))
      .then((result) => {
        setCurrSong(result);
        return setSong(result);
      })
      .catch((error) => {
        if (
          error.message !==
          "Error invoking remote method 'dialog:openFile': Error: Cancelled file selection"
        ) {
          setAlertMessage({
            message: `Error uploading file: ${error}`,
            severity: 'error',
          });
        }
      });
  };

  const getLyrics = async () => {
    setIsFetchingLyrics(true);
    window.electron.music
      .getLrc(song)
      .then(({ lyricsPath, error }) => {
        if (!error) {
          const changedSong = { ...song, lyricsPath };
          setSong(changedSong);
          setCurrSong(changedSong);
          setIsFetchingLyrics(false);
          return true;
        }
        setAlertMessage({
          message: `Unable to fetch lyrics from online, possible fix: ensure internet connection and retry with different song/artist name`,
          severity: 'warning',
        });
        setIsFetchingLyrics(false);
        return false;
      })
      .catch((error) => {
        setAlertMessage({
          message: `Error fetching lyrics from online: ${error}`,
          severity: 'error',
        });
        setIsFetchingLyrics(false);
        return false;
      });
  };

  return (
    <Container sx={{ pt: '5%', width: 0.9 }}>
      <Container disableGutters>
        <Typography sx={{ fontWeight: 600 }}>Name: </Typography>
        <EditText
          placeholder="Enter song name"
          showEditButton
          editButtonContent={
            <EditIcon data-testid="edit-name" color="action" />
          }
          editButtonProps={{ style: { backgroundColor: 'transparent' } }}
          value={currSong.songName}
          onChange={(value: string) =>
            changeSong({ ...currSong, songName: value })
          }
          style={{
            marginBottom: '2%',
            font: 'inherit',
          }}
          onSave={(event: {
            name: string;
            value: string;
            previousValue: string;
          }) => {
            saveSong({
              ...currSong,
              songName: event.value || event.previousValue,
            });
          }}
        />
      </Container>
      <Container disableGutters>
        <Typography sx={{ fontWeight: 600 }}>Artist: </Typography>
        <EditText
          placeholder="Enter song artist"
          showEditButton
          editButtonContent={
            <EditIcon data-testid="edit-artist" color="action" />
          }
          editButtonProps={{ style: { backgroundColor: 'transparent' } }}
          value={currSong.artist}
          onChange={(value: string) =>
            changeSong({ ...currSong, artist: value })
          }
          style={{ marginBottom: '2%', font: 'inherit' }}
          onSave={(event: {
            name: string;
            value: string;
            previousValue: string;
          }) => {
            saveSong({
              ...currSong,
              artist: event.value || event.previousValue,
            });
          }}
        />
      </Container>
      <Container disableGutters>
        <Typography sx={{ fontWeight: 600 }}>Path: </Typography>
        <Typography sx={{ mt: '1%' }}>{currSong.songPath}</Typography>
        <Button
          variant="outlined"
          data-testid="song-picker-button"
          sx={{ mt: '1%', mb: '2%' }}
          onClick={() =>
            chooseFile(
              {
                ...songPickerOptions,
                defaultPath: currSong.songPath || undefined,
              },
              (path) => ({
                ...currSong,
                songPath: path,
              })
            )
          }
        >
          Change file
        </Button>
      </Container>
      <Container disableGutters>
        <Typography sx={{ fontWeight: 600 }}>Lyrics: </Typography>
        <Typography sx={{ mt: '1%' }} noWrap>
          {currSong.lyricsPath}
        </Typography>
        <Button
          data-testid="lyrics-picker-button"
          variant="outlined"
          sx={{ mr: '5px' }}
          onClick={() =>
            chooseFile(
              {
                ...lyricsPickerOptions,
                defaultPath: currSong.lyricsPath || undefined,
              },
              (path) => ({
                ...currSong,
                lyricsPath: path,
              })
            )
          }
        >
          {currSong.lyricsPath ? 'Change file' : 'Upload file'}
        </Button>
        <LoadingButton
          data-testid="fetch-lyrics"
          loading={isFetchingLyrics}
          variant="outlined"
          onClick={() => getLyrics()}
        >
          Fetch lyrics
        </LoadingButton>
      </Container>
    </Container>
  );
};

export default Song;
