// Fallback implementation that doesn't require @prisma/client
import { getCollection } from "./mongodb-serverless";

// Mock implementation of the Prisma client
export const prisma = {
  // Implementation for the 'like' functionality
  like: {
    findUnique: async ({ where }: { where: any }) => {
      try {
        const likes = await getCollection("likes");
        
        // Handle Prisma-style query
        if (where.postId_userId) {
          return await likes.findOne({
            postId: where.postId_userId.postId,
            userId: where.postId_userId.userId
          });
        }
        return null;
      } catch (error) {
        console.error("Error in prisma.like.findUnique:", error);
        return null;
      }
    },
    
    delete: async ({ where }: { where: any }) => {
      try {
        const likes = await getCollection("likes");
        
        if (where.postId_userId) {
          await likes.deleteOne({
            postId: where.postId_userId.postId,
            userId: where.postId_userId.userId
          });
        }
        return { success: true };
      } catch (error) {
        console.error("Error in prisma.like.delete:", error);
        return { success: false };
      }
    },
    
    create: async ({ data }: { data: any }) => {
      try {
        const likes = await getCollection("likes");
        
        const result = await likes.insertOne({
          postId: data.postId,
          userId: data.userId,
          createdAt: new Date()
        });
        
        return { 
          id: result.insertedId,
          postId: data.postId,
          userId: data.userId,
          createdAt: new Date()
        };
      } catch (error) {
        console.error("Error in prisma.like.create:", error);
        return null;
      }
    }
  }
};