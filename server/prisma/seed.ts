import { PrismaClient, Platform, ReviewStatus, BusinessType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo business
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const business = await prisma.business.upsert({
    where: { email: 'demo@example.com' },
    update: { isAdmin: true },
    create: {
      email: 'demo@example.com',
      passwordHash,
      name: 'Sunrise Café',
      phone: '555-123-4567',
      businessType: BusinessType.RESTAURANT,
      isAdmin: true,
      responseTone: 'friendly',
      signOffName: 'The Sunrise Team',
      voiceProfile: {
        tone: 'warm and welcoming',
        style: 'conversational',
      },
    },
  });

  console.log(`Created business: ${business.name}`);

  // Create mock reviews
  const reviews = [
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-001',
      reviewerName: 'Sarah M.',
      rating: 5,
      reviewText: 'Absolutely fantastic brunch spot! The avocado toast is to die for and the coffee is some of the best in town. Service was quick and friendly. Will definitely be back!',
      reviewDate: new Date('2024-11-28'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-002',
      reviewerName: 'James R.',
      rating: 4,
      reviewText: 'Good food and nice atmosphere. Only reason for 4 stars is the wait time on weekends can be long. Wish they took reservations.',
      reviewDate: new Date('2024-11-25'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-003',
      reviewerName: 'Michelle T.',
      rating: 2,
      reviewText: 'Disappointed with my recent visit. Ordered the eggs benedict and it arrived cold. When I mentioned it to the server, they just shrugged. No offer to replace it or anything.',
      reviewDate: new Date('2024-11-22'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.FACEBOOK,
      platformReviewId: 'fb-review-001',
      reviewerName: 'David Chen',
      rating: 5,
      reviewText: 'Best pancakes in the city! So fluffy and the maple syrup is real. Love the cozy vibe here.',
      reviewDate: new Date('2024-11-20'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-004',
      reviewerName: 'Anonymous',
      rating: 1,
      reviewText: 'Terrible experience. Waited 45 minutes for food that never came. Asked for manager, none available. Never coming back.',
      reviewDate: new Date('2024-11-18'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.FACEBOOK,
      platformReviewId: 'fb-review-002',
      reviewerName: 'Lisa Park',
      rating: 5,
      reviewText: 'The pastries here are incredible! Everything is made fresh daily. The almond croissant is my weakness.',
      reviewDate: new Date('2024-11-15'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-005',
      reviewerName: 'Robert K.',
      rating: 3,
      reviewText: 'Decent food, nothing special. A bit overpriced for what you get. Coffee was good though.',
      reviewDate: new Date('2024-11-12'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-006',
      reviewerName: 'Emma Wilson',
      rating: 5,
      reviewText: 'My new favorite café! The staff remembers my order and always greets me with a smile. The homemade granola bowl is amazing.',
      reviewDate: new Date('2024-11-10'),
      status: ReviewStatus.NEW,
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        platform_platformReviewId: {
          platform: review.platform,
          platformReviewId: review.platformReviewId,
        },
      },
      update: {},
      create: {
        ...review,
        businessId: business.id,
      },
    });
  }

  console.log(`Created ${reviews.length} mock reviews`);
  console.log('Seeding complete!');
  console.log('\nDemo credentials:');
  console.log('  Email: demo@example.com');
  console.log('  Password: demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
