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
          typeof data.image1 != "string" && claimDb.image1 != ""
            ? await replaceImage(claimDb.image1, data.image1, "image1")
            : data.image1 != "string" && claimDb.image1 == ""
            ? await uploadFile(data.image1, "image1")
            : data.image1,
        image2:
          typeof data.image2 != "string" && claimDb.image2 != ""
            ? await replaceImage(claimDb.image2, data.image2, "image2")
            : typeof data.image2 != "string" && claimDb.image2 == ""
            ? await uploadFile(data.image2, "image2")
            : data.image2,
        image3:
          typeof data.image3 != "string" && claimDb.image3 != ""
            ? await replaceImage(claimDb.image3, data.image3, "image3")
            : typeof data.image3 != "string" && claimDb.image3 == ""
            ? await uploadFile(data.image3, "image3")
            : data.image3,
        image4:
          typeof data.image4 != "string" && claimDb.image4 != ""
            ? await replaceImage(claimDb.image4, data.image4, "image4")
            : typeof data.image4 != "string" && claimDb.image4 == ""
            ? await uploadFile(data.image4, "image4")
            : data.image4,
        image5:
          typeof data.image5 != "string" && claimDb.image5 != ""
            ? await replaceImage(claimDb.image5, data.image5, "image5")
            : typeof data.image5 != "string" && claimDb.image5 == ""
            ? await uploadFile(data.image5, "image5")
            : data.image5,
        image6:
          typeof data.image6 != "string" && claimDb.image6 != ""
            ? await replaceImage(claimDb.image6, data.image6, "image6")
            : typeof data.image1 != "string" && claimDb.image6 == ""
            ? await uploadFile(data.image6, "image6")
            : data.image6,
        image7:
          typeof data.image7 != "string" && claimDb.image7 != ""
            ? await replaceImage(claimDb.image7, data.image7, "image7")
            : typeof data.image7 != "string" && claimDb.image7 == ""
            ? await uploadFile(data.image7, "image7")
            : data.image7,
      };

      await Claim.findByIdAndUpdate(
        claimDb._id,
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
        message: err.message,
        error: err.message,
      },
    });
  }
};
export { GET, PUT, DELETE };
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
  if (isValidUrl(oldName) && typeof file != "string") {
    const fileName = extractImageName(oldName);
    await deleteImage(fileName);
  }
  if (isValidUrl(oldName) && !(typeof file != "string")) {
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
  if (!(typeof fileUpload != "string")) return "";

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
