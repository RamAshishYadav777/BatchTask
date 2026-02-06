"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL;
const DatabaseConnection = async () => {
    if (!MONGO_URL) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }
    try {
        await mongoose_1.default.connect(MONGO_URL);
        console.log("------------------------------------------");
        console.log("DATABASE: Connected Successfully");
        console.log("------------------------------------------");
    }
    catch (error) {
        console.error("DATABASE: Connection Failed");
        throw error;
    }
};
exports.default = DatabaseConnection;
