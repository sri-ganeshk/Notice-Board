/**
 * Seed Script — creates admin + user accounts and mock notices/events
 * Run: npx ts-node seed.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// ── Models ─────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin', 'student'], default: 'student' },
}, { timestamps: true });

const noticeSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  category: { type: String, enum: ['academic', 'sports', 'cultural'], required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const eventSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  description:     { type: String, required: true },
  eventDate:       { type: Date, required: true },
  location:        { type: String, required: true },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const User   = mongoose.model('User', userSchema);
const Notice = mongoose.model('Notice', noticeSchema);
const Event  = mongoose.model('Event', eventSchema);

// ── Main ───────────────────────────────────────────────────────────────────
async function seed() {
  const MONGO_URI = process.env.MONGO_URI;

  // Clear existing data
  await User.deleteMany({});
  await Notice.deleteMany({});
  await Event.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const SALT_ROUNDS = 10;

  // ── Users ──────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('123456789', SALT_ROUNDS);
  const userHash  = await bcrypt.hash('12345689', SALT_ROUNDS);

  const admin = await User.create({
    fullName: 'Admin User',
    email: 'admin@gmail.com',
    passwordHash: adminHash,
    role: 'admin'
  });

  const student = await User.create({
    fullName: 'Ganesh K',
    email: 'user@gmail.com',
    passwordHash: userHash,
    role: 'student'
  });

  console.log('👤 Created users:');
  console.log('   Admin  → admin@gmail.com  / 123456789');
  console.log('   User   → user@gmail.com   / 12345689');

  // ── Notices ────────────────────────────────────────────────────────────
  const now = new Date();

  await Notice.insertMany([
    {
      title: 'End Semester Exam Schedule Released',
      content: 'The schedule for end semester examinations (May 2025) has been officially released. All students are advised to check the timetable on the academic portal. Hall tickets will be distributed one week before the exam. Ensure your attendance eligibility before downloading the hall ticket.',
      category: 'academic',
      postedBy: admin._id,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Annual Sports Day – Registration Open',
      content: 'Registrations are now open for Annual Sports Day 2025! Events include 100m sprint, 400m relay, shot put, long jump, badminton, and cricket. Students can register for up to 3 events. Registration closes on March 20th. Contact the Physical Education Department for details.',
      category: 'sports',
      postedBy: admin._id,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Cultural Fest 2025 – Theme Announced',
      content: 'The theme for this year\'s Cultural Fest is "Roots & Wings" — celebrating our heritage while embracing the future. The event will be held from April 5–7th. Competitions include dance, music, drama, fine arts, and literary events. Registrations open from March 10th.',
      category: 'cultural',
      postedBy: admin._id,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Library Timing Change – Effective Immediately',
      content: 'Please note that the Central Library will now be open from 8:00 AM to 10:00 PM on all working days, and from 9:00 AM to 6:00 PM on weekends. The reading hall on the 2nd floor will remain available until midnight for students with valid ID cards.',
      category: 'academic',
      postedBy: admin._id,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Inter-College Cricket Tournament',
      content: 'Our college will be hosting the inter-college cricket tournament from March 22nd to March 28th. Teams from 12 colleges will participate. Students are encouraged to come and cheer for our college team. Entry is free for all students with valid ID cards.',
      category: 'sports',
      postedBy: admin._id,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Scholarship Application – Last Date Extended',
      content: 'The deadline for merit-based scholarship applications for the academic year 2025–26 has been extended to March 31st. Eligible students (85% and above aggregate) are advised to submit their applications along with all required documents to the scholarship cell before the deadline.',
      category: 'academic',
      postedBy: admin._id,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    },
  ]);

  console.log('📋 Created 6 notices (academic, sports, cultural)');

  // ── Events ─────────────────────────────────────────────────────────────
  const futureDate = (daysFromNow: number) =>
    new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);

  const pastDate = (daysAgo: number) =>
    new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  await Event.insertMany([
    {
      title: 'Hackathon 2025 – Build for Impact',
      description: 'Join us for a 24-hour hackathon where teams of 3–5 will build tech solutions for real-world problems. Themes include healthcare, education, and sustainability. Cash prizes worth ₹50,000 for the top 3 teams. Mentors from leading tech companies will guide participants.',
      eventDate: futureDate(10),
      location: 'Main Auditorium, Block A',
      registeredUsers: [student._id],
      createdBy: admin._id,
    },
    {
      title: 'Guest Lecture – Modern Web Development',
      description: 'A special guest lecture by a senior engineer from Google on the latest trends in web development — including Angular 20, server-side rendering, and AI-assisted coding. Open to all CSE and IT students. Prior registration is mandatory.',
      eventDate: futureDate(5),
      location: 'Seminar Hall 2, Block C',
      registeredUsers: [],
      createdBy: admin._id,
    },
    {
      title: 'Annual Sports Day 2025',
      description: 'The Annual Sports Day will feature track and field events, team sports, and a closing ceremony with awards. All department teams will compete for the overall championship trophy. Spectators are welcome. Refreshments will be provided.',
      eventDate: futureDate(20),
      location: 'College Sports Ground',
      registeredUsers: [student._id],
      createdBy: admin._id,
    },
    {
      title: 'Cultural Fest – Opening Ceremony',
      description: 'The grand opening ceremony of Cultural Fest 2025 will feature a classical dance performance, a student band showcase, and a keynote address by a renowned alumni. All students and faculty are invited. The event begins at 5 PM sharp.',
      eventDate: futureDate(35),
      location: 'Open Air Theatre',
      registeredUsers: [],
      createdBy: admin._id,
    },
    {
      title: 'Workshop: Machine Learning with Python',
      description: 'A 2-day hands-on workshop covering Python basics, data preprocessing, model training with scikit-learn, and an introduction to neural networks with TensorFlow. Participants should bring their own laptops. Certificates will be provided upon completion.',
      eventDate: futureDate(15),
      location: 'Computer Lab 3, Block B',
      registeredUsers: [student._id],
      createdBy: admin._id,
    },
    {
      title: 'Freshers\' Welcome Party',
      description: 'A fun-filled welcome evening for first-year students! Includes talent shows, group games, and a dinner. Senior students from various departments will perform. New students are encouraged to showcase their hidden talents. Dress code: Casual.',
      eventDate: pastDate(7),
      location: 'College Cafeteria & Lawn',
      registeredUsers: [],
      createdBy: admin._id,
    },
  ]);

  console.log('📅 Created 6 events (5 upcoming, 1 past)');

  console.log('\n✅ Seed complete!\n');
  console.log('─────────────────────────────────────────');
  console.log('   Login Credentials');
  console.log('─────────────────────────────────────────');
  console.log('   Admin  → admin@gmail.com  /  123456789');
  console.log('   User   → user@gmail.com   /  12345689');
  console.log('─────────────────────────────────────────\n');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
