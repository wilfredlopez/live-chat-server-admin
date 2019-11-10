import { Response, Request } from "express"

export default async function(req: Request, res: Response) {
  res.json([
    {
      _id: "123",
      name: "dummy product 1",
    },
  ])
}
