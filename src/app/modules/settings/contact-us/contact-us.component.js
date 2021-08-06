"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var contact_helper_1 = require("../../../../ACCommon/helpers/contact.helper");
var router_1 = require("@angular/router");
var helpers_1 = require("../../../../ACCommon/helpers");
var ContactUsComponent = /** @class */ (function () {
    function ContactUsComponent(contactHelper, route, routerHelper) {
        this.contactHelper = contactHelper;
        this.route = route;
        this.routerHelper = routerHelper;
        this.from = '';
        this.title = 'Contact Us';
    }
    ContactUsComponent.prototype.ngOnInit = function () {
        this.from = this.route.snapshot.paramMap.get('from'); // Grabs route parameter
        if (this.from) {
            this.title = 'Customer Support';
        }
    };
    ContactUsComponent.prototype.faqTap = function () {
        this.routerHelper.navigate(['settings/faq']);
    };
    ContactUsComponent.prototype.phoneTap = function () {
        this.contactHelper.call('1-844-695-8232');
    };
    ContactUsComponent.prototype.emailTap = function () {
        this.contactHelper.email('ltcpayroll@ltcfastpay.com');
    };
    ContactUsComponent = __decorate([
        core_1.Component({
            selector: 'app-contact-us',
            templateUrl: './contact-us.component.html',
            styleUrls: ['./contact-us.component.scss']
        }),
        __metadata("design:paramtypes", [contact_helper_1.ContactHelper, router_1.ActivatedRoute, helpers_1.RouterHelper])
    ], ContactUsComponent);
    return ContactUsComponent;
}());
exports.ContactUsComponent = ContactUsComponent;
