import { useQuery } from "@tanstack/react-query";

export type VerificationData = {
  id: number;
  email: string;
  avatar: string | null;
  nickname: string;
  accountType: string;
  level: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
};

type VerificationResponse = {
  data?: VerificationData | null;
  message: string[];
};

const fetchVerificationData = async (token: string | null) => {
  if (!token) return { data: null, message: ["토큰이 없습니다."] };
  const response = await fetch(`/api/auth/verification`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: VerificationResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message[0]);
  }

  return data;
};

export const useQueryGetVerification = (token: string | null) => {
  return useQuery<VerificationResponse>({
    queryKey: ["/api/auth/verification", "ignore"],
    queryFn: () => fetchVerificationData(token),
  });
};
