interface SuccessBody<T> {
  message: string[];
  data: T;
}

interface ErrorBody {
  statusCode: number;
  message: string[];
  error: string;
}
