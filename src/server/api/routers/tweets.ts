
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { TweetSchema } from '~/components/CreateTweets';

export const tweetRouter = createTRPCRouter({
    create: protectedProcedure
        .input(TweetSchema)
        .mutation(({ ctx, input }) => {
            const { db, session } = ctx;
            const { text } = input;
            const userId = session.user.id;

            return db.tweet.create({
                data:{
                    text,
                    author:{
                        connect:{
                            id: userId
                        }
                        
                    }
                }
            })

        })
})