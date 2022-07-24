"use strict";

const BullMqMixin = require("moleculer-bullmq");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "user",
    // version: 1

    /**
     * Mixins
     */
    mixins: [BullMqMixin],

    /**
     * Settings
     */
    settings: {
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
        /**
         * The "moleculer-db" mixin registers the following actions:
         *  - list
         *  - find
         *  - count
         *  - create
         *  - insert
         *  - update
         *  - remove
         */

        // --- ADDITIONAL ACTIONS ---
        'registrationMail.async': {
            rest: "POST /registrationMail",
            params: { name: 'string', email: 'string', password: 'string' },
            async handler(ctx) {
                const { name, email, password } = ctx.params;
                const user = {
                    name,
                    email,
                    password
                }
                await this.queue(ctx, 'jobs', 'RegistrationMail', user, {attempts: 10, delay: 5000});
                return user;
            }
        },
        'testConsole.async': {
            rest: "GET /testConsole",
            async handler(ctx) {
                const user = {
                    name: "NAME",
                    email: "EMAIL",
                    password: "password"
                }
                await this.queue(ctx, 'jobs', 'TestConsole', user);
                return "OK";
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
            /*await this.adapter.insertMany([
                { name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
                { name: "iPhone 11 Pro", quantity: 25, price: 999 },
                { name: "Huawei P30 Pro", quantity: 15, price: 679 },
            ]);*/
        }
    },

    /**
     * Fired after database connection establishing.
     */
    async afterConnected() {
        // await this.adapter.collection.createIndex({ name: 1 });
    }
};
