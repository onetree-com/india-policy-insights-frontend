import html2canvas from "html2canvas";

export const generateCanvasURL = async (
  id: string,
  dimensions = { width: 300, height: 300 }
) => {
  const element = document.getElementById(id);

  return new Promise(async (resolve, reject) => {
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          width: dimensions.width,
          height: dimensions.height,
        });
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error(`No element found with id: ${id}`));
    }
  });
};
