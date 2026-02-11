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
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const hpp_1 = __importDefault(require("hpp"));
const dbcon_1 = __importDefault(require("./app/config/dbcon"));
const productApiRoutes_1 = __importDefault(require("./app/routes/productApiRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// SECURITY & MIDDLEWARE
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
// RATE LIMITING
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
// PREVENT PARAMETER POLLUTION
app.use((0, hpp_1.default)());
// COMPRESSION
app.use((0, compression_1.default)());
// LOGGING
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use(express_1.default.json({ limit: '10kb' })); // Limit body size
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public/uploads')));
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
// 404 HANDLER FOR API
app.all('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server!`
    });
});
// SERVE FRONTEND IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path_1.default.resolve(__dirname, '../../frontend/dist');
    app.use(express_1.default.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(frontendPath, 'index.html'));
    });
}
// GENERAL 404 HANDLER (Fallback)
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server!`
    });
});
// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    console.error('ERROR 💥', err);
    res.status(statusCode).json({
        success: false,
        status: status,
        message: err.message || 'Something went very wrong!',
    });
});
// START
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log(`==========================================`);
    console.log(`STATUS: BACKEND SERVICE RUNNING`);
    console.log(`PORT  : ${port}`);
    console.log(`ENV   : ${process.env.NODE_ENV || 'development'}`);
    console.log(`==========================================`);
});
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
