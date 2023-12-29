export interface HttpResponse<T> {
  data: T;
  error: {
    errCode: string;
    msg: string;
  };
}
 