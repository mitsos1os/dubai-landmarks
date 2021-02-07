export const environment = {
  production: true,
  applicationId: process.env.APP_ID as string,
  serverUrl: process.env.PUBLIC_SERVER_URL as string,
  maxPhotoSize: Number(process.env.MAX_PHOTO_SIZE),
};
