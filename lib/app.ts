import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Routes } from './routes/crmRoutes';
import * as mongoose from "mongoose";

class App {
    public mongoUrl: string = 'mongodb://localhost:27017/CRMdb';
    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }    
    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}

export default new App().app;