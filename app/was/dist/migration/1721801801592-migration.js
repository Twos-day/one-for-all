"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1721801801592 = void 0;
class Migration1721801801592 {
    constructor() {
        this.name = 'Migration1721801801592';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "twosday_reference" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "url" character varying NOT NULL, "thumbnail" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_1c088bdb12273d62bf72dee2b94" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "twosday_reference"`);
    }
}
exports.Migration1721801801592 = Migration1721801801592;
//# sourceMappingURL=1721801801592-migration.js.map