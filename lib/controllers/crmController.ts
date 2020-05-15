import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import { UserSchema } from "../models/crmModel";
import { Request, Response } from "express";

const User = mongoose.model('User', UserSchema);

export class UserController {
    public addNewUser (req: Request, res: Response) {
        
        bcrypt.hash(req.body.password, 12).then((hash) => {
            
            let newUser: any = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            })

            newUser.save((err, user) => {
                if(err) {
                    res.send(err)
                }
                res.json(user)
            })

        });
    }

    public findOldUser (req: Request, res: Response) {

        User.findOne({ username: req.body.username })
        .then((user: any) => {
            if(!user) {
                return res.status(404).json({
                    message: 'Not found User!'
                })
            }
            bcrypt.compare(req.body.password, user.password)
            .then(response => {
                if(!response) {
                    return res.status(401).json({
                        message: 'Authentication failed!'
                    })
                } 
                return res.status(200).json({user, message: 'Authentication Successed!'})    
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal Server Error'
            })
        })
    }

    public getAllUser (req: Request, res: Response) {
        User.find({})
            .then((users: any) => {
                return res.status(200).send({
                    users
                })
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Internal Server Error'
                })
            })
    }

    public getUser (req: Request, res: Response) {

        let id: string = req.body.id

        User.findOne({ _id: id})
            .then((user: any) => {
                if(!user) {
                    return res.status(401).json({
                        message: 'User Not Found!'
                    })
                }
                return res.status(200).send({
                    user
                })
            })
    }

    public updateUser (req: Request, res: Response) {
        bcrypt.hash(req.body.password, 12).then((hash: string) => {
            User.findOneAndUpdate(
                { _id: req.body.id }, 
                {$set: {"username": req.body.username, "email": req.body.email, "password": hash}}, {new: true}, (err, doc) => {
                    // console.log("doc", doc)
                    if(!doc) {
                        return res.status(401).json({
                            message: "Updated Failed!"
                        })
                    }
                    return res.status(200).json({
                        updatedUser: doc,
                        message: "Updated Successed!"
                    })
                })                
        })
    }
}