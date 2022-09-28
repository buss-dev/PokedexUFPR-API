"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const FirstController_1 = require("./app/controller/FirstController");
const router = (0, express_1.Router)();
exports.router = router;
//Routes
router.get('/', FirstController_1.firstController.home);
