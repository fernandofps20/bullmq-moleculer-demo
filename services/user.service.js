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
                await this.queue(ctx, 'jobs', 'RegistrationMail', user, { attempts: 10, delay: 5000 });
                return user;
            }
        },
        'testDelay.async': {
            rest: "GET /testDelay",
            async handler(ctx) {
                const user = {
                    name: "NAME",
                    email: "EMAIL",
                    password: "password"
                }
                const job = await this.queue(ctx, 'jobs', 'TestConsole', user, { delay: 5000 });
                console.log(job);
                return "OK";
            }
        },
        'testRepeatable1.async': {
            rest: "GET /testRepeatable1",
            async handler(ctx) {
                const user = {
                    name: "NAME",
                    email: "EMAIL",
                    password: "password"
                }
                await this.queue(ctx, 'jobs', 'TestConsole', user, {
                    repeat: {
                        cron: '* 15 3 * * *',
                    },
                });
                return "OK";
            }
        },
        'testRepeatable2.async': {
            rest: "GET /testRepeatable2",
            async handler(ctx) {
                const user = {
                    name: "NAME",
                    email: "EMAIL",
                    password: "password"
                }
                await this.queue(ctx, 'jobs', 'TestConsole', user, {
                    repeat: {
                        every: 10000,
                        limit: 100,
                    }
                });
                return "OK";
            }
        },
        'testPrioritized.async': {
            rest: "GET /testPrioritized",
            async handler(ctx) {
                const user = {
                    name: "NAME",
                    email: "EMAIL",
                    password: "password"
                }
                await this.queue(ctx, 'jobs', 'TestConsole', user, { priority: 10 });
                return "OK";
            }
        },
        'pauseQueue.async': {
            rest: "POST /pauseQueue",
            async handler(ctx) {
                await this.pause('jobs');
                return "OK";
            }
        },
        'resumeQueue.async': {
            rest: "POST /resumeQueue",
            async handler(ctx) {
                await this.resume('jobs');
                return "OK";
            }
        },
        'testRemoveJob.async': {
            rest: "GET /testRemoveJob",
            async handler(ctx) {
                //return await this.$resolve("jobs").getJob(id);

                //const job = await this.job('jobs', id);
                //await job.remove();
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
