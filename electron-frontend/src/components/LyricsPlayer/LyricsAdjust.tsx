import { IconButton, Stack, TextField, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Runner } from 'lrc-kit';
import { useEffect, useState } from 'react';
import { useLyrics } from './Lyrics.context';
import { useAudioStatus } from '../AudioPlayer/AudioStatus.context';
import { useAlertMessage } from '../Alert.context';

const LyricsAdjust = () => {
  const { lyricsRunner, setLyricsRunner } = useLyrics();
  const { currentSong } = useAudioStatus();
  const [currentOffset, setCurrentOffset] = useState('0');
  const { setAlertMessage, setShowAlertMessage } = useAlertMessage();

  useEffect(() => {
    setCurrentOffset('0');
  }, [currentSong]);

  const changeLyricsOffset = (offsetString: string) => {
    const offset = offsetString ? parseFloat(offsetString) : 0;
    const prevOffset = currentOffset ? parseFloat(currentOffset) : 0;
    if (!Number.isNaN(offset)) {
      const newLyrics = lyricsRunner.lrc;
      newLyrics.offset(offset - prevOffset);
      setLyricsRunner(new Runner(newLyrics, true));
      setCurrentOffset(offsetString);
    }
  };

  const step = (stepAmount: number) => {
    changeLyricsOffset(
      (Number(currentOffset) + stepAmount).toFixed(1).toString()
    );
  };

  const saveOffset = () => {
    if (currentSong?.lyricsPath) {
      const lyricsPath = currentSong?.lyricsPath;
      const lyrics = lyricsRunner.lrc.toString();
      window.electron.file
        .write(lyricsPath, lyrics)
        .then(({ error }) => {
          if (error) {
            setAlertMessage({
              message: 'Error updating lyrics file',
              severity: 'warning',
            });
            setShowAlertMessage(true);
            return false;
          }
          setCurrentOffset('0');
          setAlertMessage({
            message: 'Successfully updated lyrics file',
            severity: 'success',
          });
          setShowAlertMessage(true);
          return true;
        })
        .catch((error) => {
          setAlertMessage({ message: error.message, severity: 'error' });
          setShowAlertMessage(true);
        });
    } else {
      setAlertMessage({ message: 'No lyrics file found', severity: 'info' });
      setShowAlertMessage(true);
    }
  };

  return (
    <>
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyItems="center"
        >
          <IconButton
            aria-label="stepDown"
            size="small"
            onClick={() => step(-0.2)}
          >
            <RemoveIcon fontSize="small" color="secondary" />
          </IconButton>
          <TextField
            type="number"
            size="small"
            color="secondary"
            sx={{
              width: '50px',
              '& .MuiOutlinedInput-input': {
                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                },
              },
            }}
            inputProps={{
              'data-testid': 'offset',
              step: '0.2',
              style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 },
            }}
            value={currentOffset}
            onChange={(event) => changeLyricsOffset(event.target.value)}
          />
          <IconButton
            aria-label="stepUp"
            size="small"
            onClick={() => step(0.2)}
          >
            <AddIcon fontSize="small" color="secondary" />
          </IconButton>
        </Stack>
        <Stack
          direction="row"
          justifyItems="center"
          sx={{ position: 'relative' }}
        >
          <Typography>offset</Typography>
          <IconButton
            aria-label="saveOffset"
            onClick={saveOffset}
            size="small"
            sx={{ position: 'absolute', top: '0', left: '50px', padding: 0 }}
          >
            <CheckOutlinedIcon fontSize="small" color="success" />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
};

export default LyricsAdjust;