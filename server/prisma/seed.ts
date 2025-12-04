import { PrismaClient, Platform, ReviewStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo dealer
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const dealer = await prisma.dealer.upsert({
    where: { email: 'demo@example.com' },
    update: { isAdmin: true },
    create: {
      email: 'demo@example.com',
      passwordHash,
      name: 'Westside Auto Group',
      phone: '555-123-4567',
      isAdmin: true,
      voiceProfile: {
        tone: 'friendly and professional',
        signoff: 'The Westside Auto Team',
      },
    },
  });

  console.log(`Created dealer: ${dealer.name}`);

  // Create mock reviews
  const reviews = [
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-001',
      reviewerName: 'Sarah M.',
      rating: 5,
      reviewText: 'Absolutely fantastic experience! Marcus in sales was incredibly helpful and not pushy at all. Got a great deal on my new Accord. The whole process took about 2 hours from test drive to driving off the lot. Highly recommend!',
      reviewDate: new Date('2024-11-28'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-002',
      reviewerName: 'James R.',
      rating: 4,
      reviewText: 'Good dealership overall. Service department is quick and efficient. Only reason for 4 stars is the waiting area could use some updating - the coffee machine was broken both times I visited.',
      reviewDate: new Date('2024-11-25'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-003',
      reviewerName: 'Michelle T.',
      rating: 2,
      reviewText: 'Disappointed with my recent service visit. Brought my car in for an oil change and it took over 3 hours even with an appointment. No one communicated the delay. When I asked, they seemed surprised I was still waiting.',
      reviewDate: new Date('2024-11-22'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.FACEBOOK,
      platformReviewId: 'fb-review-001',
      reviewerName: 'David Chen',
      rating: 5,
      reviewText: 'Best car buying experience I have ever had! Everyone was so friendly and they worked with my budget. Will definitely be back for my next car.',
      reviewDate: new Date('2024-11-20'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-004',
      reviewerName: 'Anonymous',
      rating: 1,
      reviewText: 'Terrible. Bait and switch pricing. Online price was different from what they tried to charge me. Walked out and bought elsewhere. Stay away.',
      reviewDate: new Date('2024-11-18'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.FACEBOOK,
      platformReviewId: 'fb-review-002',
      reviewerName: 'Lisa Park',
      rating: 5,
      reviewText: 'Shoutout to Tony in the service department! He went above and beyond to get my car fixed same-day when I was in a bind. This is why I keep coming back.',
      reviewDate: new Date('2024-11-15'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-005',
      reviewerName: 'Robert K.',
      rating: 3,
      reviewText: 'Average experience. Car was fine, price was okay. Nothing special but nothing terrible either.',
      reviewDate: new Date('2024-11-12'),
      status: ReviewStatus.NEW,
    },
    {
      platform: Platform.GOOGLE,
      platformReviewId: 'google-review-006',
      reviewerName: 'Emma Wilson',
      rating: 5,
      reviewText: 'Just picked up my new CRV and I am in love! The team made everything so easy. Special thanks to Amanda for answering all my questions about the hybrid system.',
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
        dealerId: dealer.id,
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
