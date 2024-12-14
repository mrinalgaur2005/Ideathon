import dbConnect from "../../../lib/connectDb";
import { UserModel } from "../../../model/User";

export async function GET(request: Request) {
      if(request.method!== 'GET'){
        return Response.json({
            success:false,
            message:'Only GET requests',
        },{status: 400})
      }
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'),
    };

    if (!queryParams.username) {
      return Response.json(
        {
          success: false,
          message: 'Username query parameter is required',
        },
        { status: 400 }
      );
    }

    const username = queryParams.username;

    const existingUser = await UserModel.findOne({
      username,
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'Username is already taken',
          },
          { status: 200 }
        );
      }

      return Response.json(
        {
          success: true,
          message: 'Username is available',
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
