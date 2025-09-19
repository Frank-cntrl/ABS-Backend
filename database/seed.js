const db = require("./db");
const { User, Event } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

    const users = await User.bulkCreate([
      { username: "Admin", passwordHash: User.hashPassword("admin123") },
      { username: "user1", passwordHash: User.hashPassword("user111") },
      { username: "user2", passwordHash: User.hashPassword("user222") },
    ]);

    console.log(`👤 Created ${users.length} users`);

    // Create sample events with RSVP links
    const events = await Event.bulkCreate([
      {
        title: "Welcome Back Mixer",
        description: "Join us for our annual welcome back event! Meet fellow students, enjoy refreshments, and learn about upcoming activities. This is a great opportunity to network and make new friends in our community.",
        location: "Student Union Building, Room 201",
        date: new Date("2024-01-15T18:00:00Z"),
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
        rsvpLink: "https://forms.google.com/welcome-mixer-rsvp"
      },
      {
        title: "Tech Workshop: Web Development",
        description: "Learn the basics of modern web development! We'll cover HTML, CSS, JavaScript, and popular frameworks. Perfect for beginners and those looking to refresh their skills. Laptops will be provided.",
        location: "Computer Lab, Science Building",
        date: new Date("2024-01-22T14:00:00Z"),
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
        rsvpLink: "https://forms.google.com/tech-workshop-rsvp"
      },
      {
        title: "Study Group Session",
        description: "Join our weekly study group! We'll work on homework, prepare for exams, and help each other succeed. All majors welcome. Snacks and study materials provided.",
        location: "Library Study Room B",
        date: new Date("2024-01-29T16:00:00Z"),
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
        rsvpLink: null // No RSVP required for study groups
      },
      {
        title: "Career Fair Prep Workshop",
        description: "Get ready for the upcoming career fair! Learn how to write effective resumes, practice elevator pitches, and discover what employers are looking for. Professional attire recommended.",
        location: "Career Services Center",
        date: new Date("2024-02-05T13:00:00Z"),
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        rsvpLink: "https://forms.google.com/career-prep-rsvp"
      },
      {
        title: "Game Night",
        description: "Unwind with board games, video games, and pizza! Bring your friends or come solo and meet new people. We have classic games and the latest releases. Fun guaranteed!",
        location: "Recreation Center Lounge",
        date: new Date("2024-02-12T19:00:00Z"),
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
        rsvpLink: "https://forms.google.com/game-night-rsvp"
      },
      {
        title: "Guest Speaker: Industry Insights",
        description: "Hear from successful professionals in your field! Our guest speakers will share career advice, industry trends, and answer your questions. Networking session follows the presentation.",
        location: "Main Auditorium",
        date: new Date("2024-02-19T17:30:00Z"),
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        rsvpLink: "https://forms.google.com/guest-speaker-rsvp"
      }
    ]);

    console.log(`🎉 Created ${events.length} events`);

    console.log("🌱 Seeded the database successfully!");
    console.log("\n📅 Sample events created:");
    events.forEach(event => {
      console.log(`   • ${event.title} - ${event.date.toDateString()}`);
    });

  } catch (error) {
    console.error("Error seeding database:", error);
    if (error.message.includes("does not exist")) {
      console.log("\n🤔🤔🤔 Have you created your database??? 🤔🤔🤔");
    }
  }
  db.close();
};

seed();