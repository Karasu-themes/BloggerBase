// Get the current path
const APP_PATH = process.env.PWD;

// Default folder name
const DEFAULT_FOLDER = 'app';

export const CONFIG = {
  route: APP_PATH,
  folderName: DEFAULT_FOLDER,
  folderAssets: "assets",
  folderDist: "dist"
}