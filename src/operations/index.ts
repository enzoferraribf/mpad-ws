export type Operation<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>
