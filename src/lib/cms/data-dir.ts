import {
  accessSync,
  constants,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

function canWrite(dir: string) {
  try {
    mkdirSync(dir, { recursive: true });
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export function dataDirs() {
  const dirs = [
    process.env.CMS_DATA_DIR,
    path.join(process.cwd(), "content"),
    path.resolve(process.cwd(), "..", "content"),
    "/app/content",
    path.join("/tmp", "acfo-cms"),
  ].filter((dir): dir is string => Boolean(dir));

  return [...new Set(dirs)];
}

export function uploadDirs() {
  return [
    ...dataDirs().map((dir) => path.join(dir, "uploads")),
    path.join(process.cwd(), "public", "uploads"),
    path.join("/tmp", "acfo-cms", "uploads"),
  ].filter((dir, index, all) => all.indexOf(dir) === index);
}

export function writeJsonFile(filename: string, contents: string) {
  let ok = false;

  for (const dir of dataDirs()) {
    if (!canWrite(dir)) {
      continue;
    }

    try {
      writeFileSync(path.join(dir, filename), contents, "utf8");
      ok = true;
    } catch (error) {
      console.error(`Could not write ${filename} in ${dir}`, error);
    }
  }

  return ok;
}

export function readJsonFile(filename: string) {
  for (const dir of dataDirs()) {
    try {
      return readFileSync(path.join(dir, filename), "utf8");
    } catch {
      // try the next location
    }
  }

  return null;
}

export function writeUpload(filename: string, buffer: Buffer) {
  let ok = false;

  for (const dir of uploadDirs()) {
    if (!canWrite(dir)) {
      continue;
    }

    try {
      writeFileSync(path.join(dir, filename), buffer);
      ok = true;
    } catch (error) {
      console.error(`Could not write upload ${filename} in ${dir}`, error);
    }
  }

  return ok;
}

export function readUpload(filename: string) {
  for (const dir of uploadDirs()) {
    try {
      return readFileSync(path.join(dir, filename));
    } catch {
      // try the next location
    }
  }

  return null;
}
