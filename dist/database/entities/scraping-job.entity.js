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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingJob = exports.JobStatus = void 0;
const typeorm_1 = require("typeorm");
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "pending";
    JobStatus["RUNNING"] = "running";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["FAILED"] = "failed";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
let ScrapingJob = class ScrapingJob {
    id;
    sites;
    status;
    brand;
    productsScraped;
    productsUpdated;
    productsCreated;
    errorMessage;
    startedAt;
    completedAt;
    metadata;
};
exports.ScrapingJob = ScrapingJob;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ScrapingJob.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true, default: '[]' }),
    __metadata("design:type", Array)
], ScrapingJob.prototype, "sites", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: JobStatus,
        default: JobStatus.PENDING,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ScrapingJob.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScrapingJob.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ScrapingJob.prototype, "productsScraped", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ScrapingJob.prototype, "productsUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ScrapingJob.prototype, "productsCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ScrapingJob.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ScrapingJob.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ScrapingJob.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], ScrapingJob.prototype, "metadata", void 0);
exports.ScrapingJob = ScrapingJob = __decorate([
    (0, typeorm_1.Entity)('scraping_jobs')
], ScrapingJob);
//# sourceMappingURL=scraping-job.entity.js.map