"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var FakeAuthService = /** @class */ (function () {
    function FakeAuthService() {
    }
    FakeAuthService.prototype.login = function (loginInfo) {
        if (loginInfo.Email === 'test@email.com' && loginInfo.Password === 'Password') {
            return rxjs_1.of({
                'Name': 'Evangeline Baigan',
                'Token': 'OjQxMDE5OmouZm93bGVyQGFzc3VyaWNhcmUuY29tOlBhc3N3b3JkMTE=',
                'Id': 41019
            });
        }
        else {
            return rxjs_1.throwError('Failed login');
        }
    };
    FakeAuthService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], FakeAuthService);
    return FakeAuthService;
}());
exports.FakeAuthService = FakeAuthService;
