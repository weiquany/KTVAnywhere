import { IpcRenderer } from 'electron';
import { ConfigType } from '../main/schema';
import { SongProps } from '../components/Song';
import { QueueItemProps } from '../components/SongsQueue';

declare global {
  interface Window {
    electron: {
      window: {
        reloadApp(): void;
        closeApp(): void;
        minimizeApp(): void;
        maximizeApp(): void;
      };
      dialog: {
        openFile(config: Electron.OpenDialogOptions): Promise<string>;
        openFiles(config: Electron.OpenDialogOptions): Promise<string[]>;
      };
      file: {
        read(filePath: string): Promise<string>;
        readAsBuffer(filePath: string): Promise<Buffer>;
        ifFileExists(filePath: string): boolean;
        write(filePath: string, data: string): Promise<{ error?: Error }>;
        getAssetsPath(filePath?: string): string;
      };
      music: {
        getLrc(song: SongProps): Promise<{ lyricsPath: string; error?: Error }>;
      };
      store: {
        songs: {
          getSong(songId: string): SongProps;
          setSong(song: SongProps): void;
          addSong(song: SongProps): void;
          addSongs(songs: SongProps[], prepend: boolean): void;
          deleteSong(songId: string): void;
          getAllSongs(): SongProps[];
          setAllSongs(songs: SongProps[]): void;
          getRandomSong(): SongProps | null;
          onChange(
            callback: (_event: IpcRenderer, results: SongProps[]) => void
          ): () => void;
          search(query: string): Promise<SongProps[]>;
        };
        queueItems: {
          getQueueItem(queueItemId: string): QueueItemProps;
          setQueueItem(queueItem: QueueItemProps): void;
          enqueueItem(queueItem: QueueItemProps): void;
          dequeueItem(): SongProps | null;
          deleteQueueItem(queueItemId: string): void;
          getAllQueueItems(): QueueItemProps[];
          setAllQueueItems(queueItems: QueueItemProps[]): void;
          getQueueLength(): number;
          shuffleQueue(): void;
          onChange(
            callback: (_event: IpcRenderer, results: QueueItemProps[]) => void
          ): () => void;
        };
        config: {
          getAudioStatusConfig(): ConfigType['audioStatusConfig'];
          setAudioStatusConfig(
            audioStatusConfig: ConfigType['audioStatusConfig']
          ): void;
          getSettings(): ConfigType['settings'];
          setSettings(settings: ConfigType['settings']): void;
          onSettingsChange(
            callback: (
              _event: IpcRenderer,
              results: ConfigType['settings']
            ) => void
          ): () => void;
        };
      };
      preprocess: {
        getSongDetails(
          songPaths: string[]
        ): Promise<{ songName: string; artist: string; songPath: string }[]>;
        processSong(song: SongProps): void;
        processResult(
          callback: (results: {
            vocalsPath: string;
            accompanimentPath: string;
            graphPath: string;
            songId: string;
            error?: Error;
          }) => void
        ): () => void;
      };
    };
  }
}
export {};
