"use server";

const API_URL = process.env.API_URL;

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export async function createUser({ name, email, password }: CreateUserRequest) {
  try {
    const data = JSON.stringify({ name, email, password });

    const response = await fetch(API_URL + "/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const resData = await response.json();
    return {
      success: true,
      message: "success create dari server action",
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed create dari server action",
    };
  }
}
