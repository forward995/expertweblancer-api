import { Request, Response } from "express";
import { UserController } from '../controllers/crmController'

export class Routes {
    public userController: UserController = new UserController();

    public routes(app): void {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successful!'
            })
        })

        app.route('/register')
        .post(this.userController.addNewUser);

        app.route('/login')
        .post(this.userController.findOldUser);

        app.route('/alluser')
        .get(this.userController.getAllUser);

        app.route('/getuser')
        .post(this.userController.getUser);

        app.route('/updateuser')
        .post(this.userController.updateUser);
    }
}