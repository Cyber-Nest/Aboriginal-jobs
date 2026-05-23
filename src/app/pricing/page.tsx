"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Star, Zap, Building2, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function OrganicShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

const packages = [
  {
    icon: Star,
    name: 'Basic Job Posting',
    price: 'Contact for Pricing',
    tagline: 'Perfect for getting started',
    features: [
      'Single job listing',
      '30-day active posting',
      'Standard search visibility',
      'Applicant email notifications',
      'Basic applicant tracking',
    ],
    cta: 'Get Started',
    highlight: false,
    badge: null,
  },
  {
    icon: Zap,
    name: 'Featured Job Posting',
    price: 'Contact for Pricing',
    tagline: 'Maximum visibility for your listing',
    features: [
      'Highlighted listing placement',
      '60-day active posting',
      'Priority search results',
      'Featured badge on listing',
      'Applicant management tools',
      'Email & dashboard notifications',
    ],
    cta: 'Post Featured',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    icon: Building2,
    name: 'Employer Branding Package',
    price: 'Contact for Pricing',
    tagline: 'Build your Indigenous employer brand',
    features: [
      'Dedicated company profile page',
      'Multiple job listings included',
      'Logo & banner placement',
      'Indigenous hiring statement',
      'Priority customer support',
      'Enhanced search visibility',
    ],
    cta: 'Build Your Brand',
    highlight: false,
    badge: null,
  },
  {
    icon: HeartHandshake,
    name: 'Monthly Hiring Support',
    price: 'Contact for Pricing',
    tagline: 'Full-service hiring partnership',
    features: [
      'Unlimited job postings',
      'Dedicated account manager',
      'Full applicant management suite',
      'Monthly performance reports',
      'Indigenous hiring consultation',
      'Priority featured placement',
      'Custom employer profile',
    ],
    cta: 'Contact Us',
    highlight: false,
    badge: 'Best Value',
  },
];

const faqs = [
  { q: 'How long are job postings active?', a: 'Basic postings are active for 30 days, Featured postings for 60 days. Monthly Hiring Support includes unlimited postings with flexible durations.' },
  { q: 'Can I edit my job posting after it\'s live?', a: 'Yes, you can edit your job posting at any time through your employer dashboard.' },
  { q: 'How do I receive applications?', a: 'Applications are delivered to your employer dashboard and via email notifications. You can manage all applicants in one place.' },
  { q: 'Is Aboriginal Jobs Canada only for Indigenous-owned businesses?', a: 'No — Aboriginal Jobs Canada welcomes all employers who are committed to inclusive hiring and connecting with Indigenous talent across Canada.' },
  { q: 'Do you offer support for writing inclusive job postings?', a: 'Yes, our team can provide guidance on writing respectful, inclusive job descriptions that resonate with Indigenous job seekers.' },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">Employer Packages</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Packages for Every Hiring Need
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#6B3A2A]/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you're posting your first job or building a long-term Indigenous hiring strategy, we have a package designed for you. Contact us for current pricing.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-white py-8 lg:py-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className={`rounded-2xl p-8 relative transition-shadow duration-200 ${
                  pkg.highlight
                    ? 'bg-[#C8782A] text-white ring-2 ring-[#C8782A] shadow-2xl lg:-mt-4 lg:mb-4'
                    : 'bg-[#FAF5EE] border border-[#C8782A]/10 hover:shadow-lg'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap ${pkg.highlight ? 'bg-[#6B3A2A] text-white' : 'bg-[#C8782A] text-white'}`}>
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center ${pkg.highlight ? 'bg-white/20' : 'bg-[#C8782A]/10'}`}>
                  <pkg.icon size={20} className={pkg.highlight ? 'text-white' : 'text-[#C8782A]'} />
                </div>
                <h3 className={`font-bold text-xl mb-1 ${pkg.highlight ? 'text-white' : 'text-[#1C1C1C]'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.name}</h3>
                <p className={`text-sm mb-2 ${pkg.highlight ? 'text-white/70' : 'text-[#6B3A2A]/60'}`}>{pkg.tagline}</p>
                <p className={`text-sm font-semibold mb-6 ${pkg.highlight ? 'text-white/90' : 'text-[#C8782A]'}`}>{pkg.price}</p>
                <ul className="flex flex-col gap-2.5 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${pkg.highlight ? 'text-white/90' : 'text-[#1C1C1C]/70'}`}>
                      <CheckCircle size={14} className={`flex-shrink-0 mt-0.5 ${pkg.highlight ? 'text-white' : 'text-[#7A9E7E]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button className={`w-full font-semibold ${pkg.highlight ? 'bg-white text-[#C8782A] hover:bg-[#FAF5EE]' : 'bg-[#C8782A] hover:bg-[#B06820] text-white'}`}>
                    {pkg.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <motion.div key={faq.q} variants={fadeUp} className="bg-white rounded-2xl p-7 border border-[#C8782A]/10">
                <h3 className="font-bold text-[#1C1C1C] mb-2">{faq.q}</h3>
                <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#6B3A2A] py-16 relative overflow-hidden">
        <OrganicShape className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-[#FAF5EE] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Not Sure Which Package Is Right for You?</motion.h2>
            <motion.p variants={fadeUp} className="text-[#FAF5EE]/70 mb-8 text-lg">Our team is happy to help you find the best fit for your hiring needs. Reach out today.</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact"><Button size="lg" className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-10">Contact Aboriginal Jobs Canada <ArrowRight size={16} className="ml-2" /></Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
