import { Stream } from "stream";
import { extname, basename } from "path";
import axios from "axios";
import { FileUpload } from "graphql-upload";

const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = process.env;

const PICTURE_BED_URL = `https://api.github.com/repos/${GITHUB_OWNER!}/${GITHUB_REPO!}/contents`;
const JS_DELIVR_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER!}/${GITHUB_REPO!}@main`;

const streamToBuffer = (stream: Stream) =>
  new Promise<Buffer>((resolve, reject) => {
    const buffers: Buffer[] = [];
    stream.on("error", reject);
    stream.on("data", (data: Buffer) => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
  });

export const uploadToGithub = async (
  fileUpload: Promise<FileUpload>,
  directory: string
) => {
  const file = await fileUpload;
  const filename =
    Math.random().toString(32).slice(2) +
    basename(file.filename, extname(file.filename)).replace(/[^\w\-_\d]/g, "") +
    extname(file.filename);

  const buffer = await streamToBuffer(file.createReadStream());
  const content = buffer.toString("base64");

  // https://api.github.com/repos/iTsingchen/picture-bed/contents
  // https://cdn.jsdelivr.net/gh/iTsingchen/picture-bed@main

  await axios.put(
    `${PICTURE_BED_URL}/${directory}/${filename}`,
    {
      message: `Upload file ${filename}`,
      content,
    },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN!}`,
      },
    }
  );

  return `${JS_DELIVR_URL}/${directory}/${filename}`;
};
