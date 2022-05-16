import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class UserController {

  private userRepository = getRepository(User);

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users: User[] = await this.userRepository.find();

      return res.status(200).json({message: 'Success', data: users})
    } catch (err) {
      return res.status(500).json({message: err});
    }
  }

  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = await this.userRepository.findOne(req.params.id);

      return res.status(200).json({ message: 'Success', data: user});
    } catch (err) {
      return res.status(500).json({message: err});
    }
  }

  async save(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = await this.userRepository.save(req.body);

      return res.status(200).json({ message: 'Success', data: user});
    } catch (err) {
      return res.status(500).json({message: err});
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      let userToRemove = await this.userRepository.findOne(req.params.id);
      if (!userToRemove) return res.status(400).json({message: 'User not found'});

      await this.userRepository.remove(userToRemove);

      return res.status(200).json({ message: 'Success'});
    } catch (err) {
      return res.status(500).json({message: err});
    }
  }
}
