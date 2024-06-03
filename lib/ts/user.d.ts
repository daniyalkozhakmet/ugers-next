export interface UserCreateRequest {
  email: string;
  res: string;
  password: string;
}
export interface UserUpdateRequest {
  user_id: string;
  email: string;
  res: string;
  password: string;
}
export interface UserDeleteRequest {
    user_id: string;
  }
export interface UserCreateResponse {
  data?: {
    message: string;
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface UserGetResponse {
  data?: {
    user: {
      email: string;
      role: string;
      res: {
        _id: string;
        name: string;
      };
      _id: string;
    };
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface UsersGetResponse {
  data?: {
    users: {
      email: string;
      role: string;
      res: {
        _id: string;
        name: string;
      };
      _id: string;
    }[];
  };
  error?: {
    message: string;
    error?: string;
  };
}
