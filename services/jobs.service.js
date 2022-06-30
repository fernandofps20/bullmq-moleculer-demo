"use strict";

const BullMqMixin = require("moleculer-bullmq");
const nodemailer = require('nodemailer');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "jobs",
    // version: 1

    /**
     * Mixins
     */
    mixins: [BullMqMixin],

    /**
     * Settings
     */
    settings: {
        bullmq: {
            client: 'redis://127.0.0.1:6379'
        }
    },

    /**
     * Action Hooks
     */
    hooks: {
    },

    /**
     * Actions
     */
    actions: {
        RegistrationMail: {
            queue: true,
            params: { name: 'string', email: 'string', password: 'string' },
            async handler(ctx) {
                const transport = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: "3cf87952111a61",
                        pass: "8d53b5bf890bdf"
                    }
                });
                await transport.sendMail({
                    from: 'Fernando <fernando@fernando.com.br>',
                    to: `${ctx.params.name} <${ctx.params.email}>`,
                    subject: 'Cadastro de usuário',
                    html: 'OIOIOIOOOIOIOIOO'
                })
            }
        },
        TestConsole: {
            queue: true,
            async handler(ctx) {
                console.log("TESTE QUEUE");
            }
        }
    },

    /**
     * Methods
     */
    methods: {
        /**
         * Loading sample data to the collection.
         * It is called in the DB.mixin after the database
         * connection establishing & the collection is empty.
         */
        async seedDB() {

        }
    },

    /**
     * Fired after database connection establishing.
     */
    async afterConnected() {
        // await this.adapter.collection.createIndex({ name: 1 });
    }
};
