export interface DriveItem {
  id: string
  name: string
  type: 'file' | 'folder'
  mimeType?: string
  size?: string
  modifiedTime?: string
  children?: DriveItem[]
}

export interface DriveAudioFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime?: string
  webViewLink?: string
  streamUrl: string
}

export interface DriveContent {
  id: string
  name: string
  mimeType: string
  modifiedTime?: string
  content: string
  audioFiles: DriveAudioFile[]
}
