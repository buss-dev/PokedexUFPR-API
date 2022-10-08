"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authenticationRoutes_1 = require("./routes/authenticationRoutes");
const router = (0, express_1.Router)();
exports.router = router;
//Routes
router.use('/', authenticationRoutes_1.router);
