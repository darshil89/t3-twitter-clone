
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { TweetSchema } from '~/components/CreateTweets';
import { z } from 'zod';
export const tweetRouter = createTRPCRouter({
    create: protectedProcedure
        .input(TweetSchema)
        .mutation(({ ctx, input }) => {
            const { db, session } = ctx;
            const { text } = input;
            const userId = session.user.id;

            return db.tweet.create({
                data: {
                    text,
                    author: {
                        connect: {
                            id: userId
                        }

                    }
                }
            })

        }),

    timeline: publicProcedure.input(
        z.object({
            cursor: z.string().nullish(),
            limit: z.number().min(1).max(100).default(10)

        })
    ).query(async ({ ctx, input }) => {
        const { db } = ctx;
        const { cursor, limit } = input;
        const userId = ctx.session?.user?.id;
        const tweets = await db.tweet.findMany({
            take: limit + 1,
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            cursor: cursor ? { id: cursor } : undefined,
            include: {
                likes: {
                    where: {
                        userId
                    },
                    select: {
                        userId: true
                    }

                },
                author: {
                    select: {
                        name: true,
                        image: true,
                        id: true
                    }
                }

            }
        })

        let nextcursor: typeof cursor | undefined = undefined;
        if (tweets.length > limit) {
            const nextItem = tweets.pop() as typeof tweets[number];

            nextcursor = nextItem.id;
        }

        return {
            tweets,
            nextcursor
        }

    }),

    like: protectedProcedure.input(z.object({ tweetId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const usedId = ctx.session.user.id;

            const { db } = ctx;

            return db.like.create({
                data: {
                    tweet: {
                        connect: {
                            id: input.tweetId
                        }
                    },
                    user: {
                        connect: {
                            id: usedId
                        }
                    }
                }
            })

        }),

    unlike: protectedProcedure.input(z.object({ tweetId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const usedId = ctx.session.user.id;

            const { db } = ctx;

            return db.like.delete({
                where: {
                    tweetId_userId: {
                        tweetId: input.tweetId,
                        userId: usedId
                    }
                }
            })
        })


})