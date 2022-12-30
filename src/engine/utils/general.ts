export const calculateAspectRatio = (width: number, height: number) => {
  if (width > height) {
    return width / height
  } else {
    return height / width
  }
}
