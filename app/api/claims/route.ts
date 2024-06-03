import connect from "@/utils/db";
import User, { UserRole } from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import nextConnect from "next-connect";
import Res from "@/app/models/Res";
import Claim from "@/app/models/Claim";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
const generateUniqueNumber = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0"); // Get day of the month (2 digits)
  const seconds = now.getSeconds().toString().padStart(2, "0"); // Get seconds (2 digits)
  const milliseconds = now.getMilliseconds().toString().padStart(4, "0"); // Get milliseconds (3 digits)
  const eightDigitNumber = day + seconds + milliseconds; // Combine day, seconds, and milliseconds
  return eightDigitNumber.toString(); // Convert to integer (optional)
};
const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connect();
    let data = await new Response(req.body).json();

    data = {
      ...data,
      date_of_excavation: new Date(data.date_of_excavation),
      date_of_sending: new Date(),
    };
    const res = await Res.findById(data.res);
    const newClaim = new Claim({
      neighborhood: data.neighborhood,
      invent_num: data.invent_num,
      address: data.address,
      direction: data.direction,
      res: res._id,
      date_of_excavation: data.date_of_excavation,
      open_square: data.open_square,
      street_type: data.street_type,
      type_of_work: data.type_of_work,
      date_of_sending: data.date_of_sending,
      claim_number: `${res.name}-${generateUniqueNumber()}`,
    });

    await newClaim.save();
    return Response.json({ data: { message: "Заявка создана" } });
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Internal Server Error",
        error: err.message,
      },
    });
  }
};

const GET = async (req: NextRequest, res: NextApiResponse) => {
  try {
    const PAGE_SIZE = 10;
    const pageNumber = Number(req.nextUrl.searchParams.get("page")) || 1;
    let totalCount = 0;
    let totalPages = 0;

    await connect();
    const session = await getServerSession(authOptions);
    if (
      req.nextUrl.searchParams.get("claim_number") ||
      req.nextUrl.searchParams.get("invent_num") ||
      req.nextUrl.searchParams.get("res") ||
      req.nextUrl.searchParams.get("neighborhood")
    ) {
      const params = {
        claim_number: req.nextUrl.searchParams.get("claim_number") || "",
        invent_num: req.nextUrl.searchParams.get("invent_num") || "",
        res: req.nextUrl.searchParams.get("res") || "",
        neighborhood: req.nextUrl.searchParams.get("neighborhood") || "",
      };
      if (session?.user.role == "user") {
        if (params.claim_number != "" && params.invent_num != "") {
          totalCount = await Claim.countDocuments({
            res: session.user.res,
            claim_number: params.claim_number,
            invent_num: params.invent_num,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            res: session.user.res,
            claim_number: params.claim_number,
            invent_num: params.invent_num,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);
          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
        if (params.claim_number) {
          totalCount = await Claim.countDocuments({
            res: session.user.res,
            claim_number: params.claim_number,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            res: session.user.res,
            claim_number: params.claim_number,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
        if (params.invent_num) {
          totalCount = await Claim.countDocuments({
            res: session.user.res,
            invent_num: params.invent_num,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            res: session.user.res,
            invent_num: params.invent_num,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);
          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
      }
      if (session?.user.role == "admin") {
        if (params.claim_number != "" && params.invent_num != "") {
          totalCount = await Claim.countDocuments({
            claim_number: params.claim_number,
            invent_num: params.invent_num,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            claim_number: params.claim_number,
            invent_num: params.invent_num,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);
          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
        if (params.claim_number) {
          totalCount = await Claim.countDocuments({
            claim_number: params.claim_number,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            claim_number: params.claim_number,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
        if (params.invent_num) {
          totalCount = await Claim.countDocuments({
            invent_num: params.invent_num,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            invent_num: params.invent_num,
          })
            .populate("res")
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);
          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
        if (params.neighborhood) {
          let neighborhood = "";
          switch (params.neighborhood) {
            case "ALATAU":
              neighborhood = "Алатауский";
              break;
            case "ALMALY":
              neighborhood = "Алмалинский";
              break;
            case "AUEZ":
              neighborhood = "Ауэзовский";
              break;
            case "BOSTNDYK":
              neighborhood = "Бостандыкский";
              break;
            case "ZHETISU":
              neighborhood = "Жетысуский";
              break;
            case "MEDEU":
              neighborhood = "Медеуский";
              break;
            case "NAURYZBAI":
              neighborhood = "Наурызбайский";
              break;
            case "TURKSIB":
              neighborhood = "Турксибский";
              break;

            default:
              break;
          }
          totalCount = await Claim.countDocuments({
            neighborhood: neighborhood,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            neighborhood: neighborhood,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);
          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
        if (params.res) {
          const res = await Res.findOne({ name: params.res });
          totalCount = await Claim.countDocuments({
            res: res._id,
          });
          totalPages = Math.ceil(totalCount / PAGE_SIZE);
          const claims = await Claim.find({
            res: res._id,
          })
            .populate("res")
            .sort({ date_of_sending: -1 })
            .skip((pageNumber - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);
          return Response.json({
            data: {
              claims,
              pagination: {
                pageNumber,
                totalPages,
                totalCount,
              },
            },
          });
        }
      }
    }
    if (session?.user.role == "user") {
      let res_session = session?.user.res;
      totalCount = await Claim.countDocuments({ res: res_session });
      totalPages = Math.ceil(totalCount / PAGE_SIZE);
      const claims = await Claim.find({ res: res_session })
        .populate("res")
        .sort({ date_of_sending: -1 })
        .skip((pageNumber - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
      return Response.json({
        data: {
          claims,
          pagination: {
            pageNumber,
            totalPages,
            totalCount,
          },
        },
      });
    }

    if (session?.user.role == "admin") {
      totalCount = await Claim.countDocuments();
      totalPages = Math.ceil(totalCount / PAGE_SIZE);
      const claims = await Claim.find()
        .populate("res")
        .sort({ date_of_sending: -1 })
        .skip((pageNumber - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
      return Response.json({
        data: {
          claims,
          pagination: {
            pageNumber,
            totalPages,
            totalCount,
          },
        },
      });
    }
    return Response.json({
      error: {
        message: "Internal Server Error",
      },
    });
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Internal Server Error",
        error: err.message,
      },
    });
  }
};
export { POST, GET };
