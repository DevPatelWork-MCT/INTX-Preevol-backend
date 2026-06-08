import type { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>

export function asyncHandler(fn: AsyncHandler) {
    return function (req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
