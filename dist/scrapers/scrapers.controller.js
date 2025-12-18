"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapersController = void 0;
const common_1 = require("@nestjs/common");
const scrapers_service_1 = require("./scrapers.service");
const scrape_request_dto_1 = require("./dto/scrape-request.dto");
let ScrapersController = class ScrapersController {
    scrapersService;
    constructor(scrapersService) {
        this.scrapersService = scrapersService;
    }
    async scrape(request) {
        return this.scrapersService.startScraping(request);
    }
    async getAvailableSites() {
        const sites = await this.scrapersService.getAvailableSites();
        return { sites };
    }
    async getAllJobs() {
        const jobs = await this.scrapersService.getAllJobs();
        return { jobs };
    }
    async getJob(id) {
        return this.scrapersService.getJob(id);
    }
};
exports.ScrapersController = ScrapersController;
__decorate([
    (0, common_1.Post)('scrape'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scrape_request_dto_1.ScrapeRequestDto]),
    __metadata("design:returntype", Promise)
], ScrapersController.prototype, "scrape", null);
__decorate([
    (0, common_1.Get)('sites'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScrapersController.prototype, "getAvailableSites", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScrapersController.prototype, "getAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScrapersController.prototype, "getJob", null);
exports.ScrapersController = ScrapersController = __decorate([
    (0, common_1.Controller)('scrapers'),
    __metadata("design:paramtypes", [scrapers_service_1.ScrapersService])
], ScrapersController);
//# sourceMappingURL=scrapers.controller.js.map