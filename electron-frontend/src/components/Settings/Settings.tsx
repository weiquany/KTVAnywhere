import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { cyan } from '@mui/material/colors';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useConfirmation } from '../ConfirmationDialog';

export interface ColorThemeProps {
  colorThemeId: number;
  name: string;
  mode: string;
  primary: string;
  secondary: string;
  mainPageBackground: string;
  paperBackground: string;
  sidebarBackground: string;
  audioPlayerBackground: string;
  scrollbarThumb: string;
  scrollbarHover: string;
  scrollbarActive: string;
}

const ColorThemes: ColorThemeProps[] = [
  {
    colorThemeId: 0,
    name: 'default',
    mode: 'dark',
    primary: '#86C232',
    secondary: '#61892F',
    mainPageBackground: '#6C6F6F',
    paperBackground: '#222629',
    sidebarBackground: '#474B4B',
    audioPlayerBackground: '#222629',
    scrollbarThumb: '#505C47',
    scrollbarHover: '#5A6850',
    scrollbarActive: '#647359',
  },
  {
    colorThemeId: 1,
    name: 'ocean',
    mode: 'dark',
    primary: '#8DA9C4',
    secondary: '#EEF4ED',
    mainPageBackground: '#0E3158',
    paperBackground: '#0D2444',
    sidebarBackground: '#134074',
    audioPlayerBackground: '#0D2444',
    scrollbarThumb: cyan[800],
    scrollbarHover: cyan[700],
    scrollbarActive: cyan[600],
  },
  {
    colorThemeId: 2,
    name: 'sunset',
    mode: 'dark',
    primary: '#F29F05',
    secondary: '#F5DA8E',
    mainPageBackground: '#D33A03',
    paperBackground: '#A82F01',
    sidebarBackground: '#DC5304',
    audioPlayerBackground: '#A82F01',
    scrollbarThumb: '#F18D7E',
    scrollbarHover: '#F39E91',
    scrollbarActive: '#F5AEA3',
  },
  {
    colorThemeId: 3,
    name: 'pastel',
    mode: 'light',
    primary: '#27A59B',
    secondary: '#6D6875',
    mainPageBackground: '#FFECEE',
    paperBackground: '#FFD4DE',
    sidebarBackground: '#FFE0E6',
    audioPlayerBackground: '#FFC9D6',
    scrollbarThumb: '#EFBDBF',
    scrollbarHover: '#F3CECF',
    scrollbarActive: '#F7DEDF',
  },
  {
    colorThemeId: 4,
    name: 'berry',
    mode: 'dark',
    primary: '#72FEA7',
    secondary: '#E6EFE6',
    mainPageBackground: '#FF858B',
    paperBackground: '#724B4C',
    sidebarBackground: '#B36B6E',
    audioPlayerBackground: '#724B4C',
    scrollbarThumb: '#FFADB1',
    scrollbarHover: '#FFC2C5',
    scrollbarActive: '#FFD6D8',
  },
];

export const GetColorTheme = () => {
  const currentId =
    window.electron.store.config.getSettings().colorThemeId ?? 0;
  return ColorThemes[currentId + 1 > ColorThemes.length ? 0 : currentId];
};

const SettingsMenu = ({
  showSettings,
  setShowSettings,
}: {
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
}) => {
  const getCurrentSettings = () => window.electron.store.config.getSettings();
  const [errorMessagesTimeout, setErrorMessagesTimeout] = useState<number>(
    getCurrentSettings().errorMessagesTimeout
  );
  const [audioBufferSize, setAudioBufferSize] = useState<number>(
    getCurrentSettings().audioBufferSize
  );
  const [colorThemeId, setColorThemeId] = useState(
    getCurrentSettings().colorThemeId ?? 0
  );
  const { setConfirmationMessage, setActions, setOpen } = useConfirmation();

  useEffect(() => {
    window.electron.store.config.setSettings({
      errorMessagesTimeout,
      audioBufferSize,
      colorThemeId,
    });
  }, [errorMessagesTimeout, audioBufferSize, colorThemeId]);

  const errorTimeoutChange = (event: SelectChangeEvent<number>) => {
    setErrorMessagesTimeout(event.target.value as number);
  };

  const audioBufferSizeChange = (event: SelectChangeEvent<number>) => {
    setAudioBufferSize(event.target.value as number);
  };

  const colorThemeChange = (event: SelectChangeEvent<number>) => {
    setColorThemeId(event.target.value as number);
  };

  const reloadApplication = () => {
    setConfirmationMessage({
      heading: 'Reload application',
      message: 'Confirm reload?',
    });
    setActions([
      {
        label: 'Confirm',
        fn: () => {
          window.electron.window.reloadApp();
          setOpen(false);
        },
      },
    ]);
    setOpen(true);
  };

  const closeDialog = () => {
    setShowSettings(false);
  };

  return (
    <Dialog
      scroll="paper"
      fullWidth
      maxWidth="sm"
      open={showSettings}
      onClose={closeDialog}
      sx={{ top: '15%', maxHeight: '600px' }}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Grid container pb={2}>
          <Grid
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography sx={{ opacity: '90%' }}>Color theme</Typography>
          </Grid>
          <Grid
            item
            sx={{ ml: 'auto' }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                value={colorThemeId}
                onChange={colorThemeChange}
                renderValue={() => ColorThemes[colorThemeId].name}
              >
                {ColorThemes.map((_idx, index) => {
                  return (
                    <MenuItem
                      key={ColorThemes[index].colorThemeId}
                      value={index}
                    >
                      {ColorThemes[index].name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container pb={2}>
          <Grid
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography sx={{ opacity: '90%' }}>
              Timeout for alert/error messages
            </Typography>
          </Grid>
          <Grid
            item
            sx={{ ml: 'auto' }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                value={errorMessagesTimeout}
                onChange={errorTimeoutChange}
              >
                <MenuItem value={5}>5s</MenuItem>
                <MenuItem value={10}>10s</MenuItem>
                <MenuItem value={15}>15s</MenuItem>
                <MenuItem value={30}>30s</MenuItem>
                <MenuItem value={86400}>Never</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container pb={2}>
          <Grid
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography sx={{ opacity: '90%' }}>Audio buffer size</Typography>
            <Typography
              variant="subtitle2"
              maxWidth={400}
              sx={{ opacity: '70%' }}
            >
              Increase if audio has static noise / crackles, but audio controls
              responsiveness may decrease and may affect graph timing. Requires
              restart.
            </Typography>
          </Grid>
          <Grid
            item
            sx={{ ml: 'auto' }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                value={audioBufferSize || 4096}
                onChange={audioBufferSizeChange}
              >
                <MenuItem value={4096}>4 Kb</MenuItem>
                <MenuItem value={8192}>8 Kb</MenuItem>
                <MenuItem value={16384}>16 Kb</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={reloadApplication}
          color="warning"
          data-testid="reload-application-button"
        >
          Reload application
        </Button>
        <Button onClick={closeDialog} data-testid="close-settings-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsMenu;
