import Claim from "@/app/models/Claim";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/utils/firebaseConfig";
import sharp from "sharp";
const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role == "admin") {
      await connect();

      const claim_id = req.url.split("/").pop();

      await Claim.deleteOne({ _id: claim_id });

      return Response.json({ data: { message: "Заявка удалена" } });
    }
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Заявка не найдена",
        error: err.message,
      },
    });
  }
};
const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role == "user") {
      await connect();

      const claim_id = req.url.split("/").pop();

      const claim = await Claim.findById(claim_id).populate("res");

      if (!claim) {
        return Response.json({
          error: {
            message: "Заявка не найдена",
          },
        });
      }
      if (claim.res._id != session.user.res) {
        if (!claim) {
          return Response.json({
            error: {
              message: "Не авторизована",
            },
          });
        }
      }
      return Response.json({ data: { claim } });
    }
    if (session?.user.role == "admin") {
      await connect();

      const claim_id = req.url.split("/").pop();

      const claim = await Claim.findById(claim_id).populate("res");

      if (!claim) {
        return Response.json({
          error: {
            message: "Заявка не найдена",
          },
        });
      }
      return Response.json({ data: { claim } });
    }
    return Response.json({
      error: {
        message: "Нет доступа",
      },
    });
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Заявка не найдена",
        error: err.message,
      },
    });
  }
};
const PUT = async (req: NextRequest, res: NextResponse) => {
  try {
    const session = await getServerSession(authOptions);
    // console.log(req);
    const files = await req.formData();
    let data = Object.fromEntries(files.entries());


    if (session?.user.role == "user" && data.res_id == session.user.res) {
      await connect();
      const claimDb = await Claim.findById(data._id);

      data = {
        ...data,
        image1:
          data.image1 instanceof File && claimDb.image1 != ""
            ? await replaceImage(claimDb.image1, data.image1, "image1")
            : data.image1 instanceof File && claimDb.image1 == ""
            ? await uploadFile(data.image1, "image1")
            : data.image1,
        image2:
          data.image2 instanceof File && claimDb.image2 != ""
            ? await replaceImage(claimDb.image2, data.image2, "image2")
            : data.image2 instanceof File && claimDb.image2 == ""
            ? await uploadFile(data.image2, "image2")
            : data.image2,
        image3:
          data.image3 instanceof File && claimDb.image3 != ""
            ? await replaceImage(claimDb.image3, data.image3, "image3")
            : data.image3 instanceof File && claimDb.image3 == ""
            ? await uploadFile(data.image3, "image3")
            : data.image3,
        image4:
          data.image4 instanceof File && claimDb.image4 != ""
            ? await replaceImage(claimDb.image4, data.image4, "image4")
            : data.image4 instanceof File && claimDb.image4 == ""
            ? await uploadFile(data.image4, "image4")
            : data.image4,
        image5:
          data.image5 instanceof File && claimDb.image5 != ""
            ? await replaceImage(claimDb.image5, data.image5, "image5")
            : data.image5 instanceof File && claimDb.image5 == ""
            ? await uploadFile(data.image5, "image5")
            : data.image5,
        image6:
          data.image6 instanceof File && claimDb.image6 != ""
            ? await replaceImage(claimDb.image6, data.image6, "image6")
            : data.image6 instanceof File && claimDb.image6 == ""
            ? await uploadFile(data.image6, "image6")
            : data.image6,
        image7:
          data.image7 instanceof File && claimDb.image7 != ""
            ? await replaceImage(claimDb.image7, data.image7, "image7")
            : data.image7 instanceof File && claimDb.image7 == ""
            ? await uploadFile(data.image7, "image7")
            : data.image7,
      };


 

      await Claim.findByIdAndUpdate(
        data._id,
        { ...data, res: data.res_id },
        {
          new: false, // return the new document after update
          runValidators: true, // validate before update
        }
      );
      return Response.json({ data: { message: "Заявка редактирована" } });
    }
    return Response.json({
      error: {
        message: "Нет доступа",
      },
    });
  } catch (err: any) {

    return Response.json({
      error: {
        message: "Заявка не найдена",
        error: err.message,
      },
    });
  }
};
export { GET, PUT, DELETE };
export const resizeImage = (file: File): Promise<File> => {
  return new Promise<File>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      if (event.target && event.target.result) {
        img.src = event.target.result as string;
        img.onload = () => {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(resizedFile);
                }
              },
              file.type,
              0.9
            ); // Adjust compression quality here (0.7 is 70% quality)
          }
        };
      }
    };
  });
};
const resizeImage1 = async (
  file: any,
  width: number,
  height: number
): Promise<Buffer> => {
  return await sharp(file)
    .resize(width, height, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toBuffer();
};
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
const extractImageName = (url: string) => {
  // Split the URL by '/'
  const parts = url.split("/");

  // Get the last part of the URL which contains the filename
  const lastPart = parts[parts.length - 1];

  // Decode the URI component to get the filename
  const decodedFileName = decodeURIComponent(lastPart);

  return decodedFileName.split("?alt")[0];
};
const replaceImage = async (oldName: any, file: any, folderName: string) => {
  if (isValidUrl(oldName) && file instanceof File) {
    const fileName = extractImageName(oldName);
    await deleteImage(fileName);
  }
  if (isValidUrl(oldName) && !(file instanceof File)) {
    return oldName;
  }
  return await uploadFile(file, folderName);
};
const deleteImage = async (imageName: string) => {
  const imageRef = ref(storage, imageName);
  try {
    await deleteObject(imageRef);
  } catch (error) {}
};
const uploadFile = async (fileUpload: any, folderName: string) => {
  if (!(fileUpload instanceof File)) return "";

  const filesFolderRef = ref(storage, `${folderName}/${Math.random()}`);
  //   fileUpload = await resizeImage1(fileUpload, 800, 600);

  try {
    await uploadBytes(filesFolderRef, fileUpload, {
      contentType: fileUpload.type,
    });
    const downloadURL = await getDownloadURL(filesFolderRef);
    return downloadURL;
  } catch (err) {
    return "";
  }
};
