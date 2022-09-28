"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstController = void 0;
class FirstController {
    home(req, res) {
        return res.json({
            response: 'Hello World',
        });
    }
}
exports.firstController = new FirstController();
