"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const dbcon_1 = __importDefault(require("./app/config/dbcon"));
const productApiRoutes_1 = __importDefault(require("./app/routes/productApiRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// SECURITY & MIDDLEWARE
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// DATABASE
(0, dbcon_1.default)().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
// ROUTES
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend service is healthy' });
});
app.use('/api/v1', productApiRoutes_1.default);
// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
// START
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("==========================================");
    console.log(`STATUS: BACKEND SERVICE RUNNING`);
    console.log(`PORT  : ${port}`);
    console.log(`ENV   : ${process.env.NODE_ENV || 'development'}`);
    console.log("==========================================");
});
