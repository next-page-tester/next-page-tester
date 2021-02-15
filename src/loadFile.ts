export function loadFile<FileType>({
  absolutePath,
}: {
  absolutePath: string;
}): FileType {
  return require(absolutePath);
}
